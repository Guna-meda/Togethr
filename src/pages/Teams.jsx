import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useUserStore } from "../store/userStore";
import {
  createTeam,
  getTeamById,
  joinTeam,
  updateForUser,
} from "../firebase/teams";

const Teams = () => {
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const teams = useUserStore((s) => s.teams);
  const setTeams = useUserStore((s) => s.setTeams);
  const { authLoading, setAuthLoading } = useUserStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", bio: "" });
  const [inviteCode, setInviteCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      if (user?.teamIds?.length) {
        const teamData = await Promise.all(
          user.teamIds.map((id) => getTeamById(id))
        );
        setTeams(teamData.filter(Boolean));
      }
      setAuthLoading(false);
    };

    fetchTeams();
  }, [user]);

  const handleCreate = async () => {
    if (!user?.uid) return toast.error("Login to create team.");
    if (!newTeam.name || !newTeam.bio) return toast.error("Enter all fields");

    const team = await createTeam(newTeam.name, newTeam.bio, user.uid);
    const updatedIds = [...(user.teamIds || []), team.id];

    await updateForUser(user.uid, { teamIds: updatedIds });
    updateUser({ teamIds: updatedIds });
    useUserStore.getState().setTeams([...useUserStore.getState().teams, team]);

    toast.success("Team created!");
    setShowCreateModal(false);
    setNewTeam({ name: "", bio: "" });
  };

  const handleJoin = async () => {
    if (!inviteCode) return toast.error("Enter Invite Code");
    if (!user?.uid) return toast.error("Login to Join");

    try {
      const team = await joinTeam(inviteCode, user.uid);
      const updatedIds = Array.from(
        new Set([...(user.teamIds || []), team.id])
      );

      await updateForUser(user.uid, { teamIds: updatedIds });
      updateUser({ teamIds: updatedIds });
      useUserStore
        .getState()
        .setTeams([...useUserStore.getState().teams, team]);

      toast.success("Joined team!");
      setInviteCode("");
      setShowJoinModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to join team.");
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <p className="text-center text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      <div className="grid sm:grid-cols-2 gap-6">
        <div
          className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md cursor-pointer hover:ring-2 ring-blue-500"
          onClick={() => setShowCreateModal(true)}
        >
          <h2 className="text-xl font-semibold mb-2">Create a Team</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Start a new team with a name and bio.
          </p>
        </div>

        <div
          onClick={() => setShowJoinModal(true)}
          className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md cursor-pointer hover:ring-2 ring-green-500"
        >
          <h2 className="text-xl font-semibold mb-2">Join a Team</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Enter an invite code to join an existing team.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            onClick={() => navigate(`/teams/${team.id}`)}
            className="group bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:ring-1 hover:ring-blue-500 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-semibold">{team.name}</h2>
              <span className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                Team
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {team.bio}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Invite Code:</span>{" "}
              <code
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-100 dark:bg-zinc-700 px-1 py-0.5 rounded"
              >
                {team.inviteCode}
              </code>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create a Team</h3>
            <input
              type="text"
              placeholder="Team Name"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              className="w-full p-2 mb-2 border rounded dark:bg-zinc-700 dark:text-white"
            />
            <textarea
              placeholder="Team Bio"
              value={newTeam.bio}
              onChange={(e) => setNewTeam({ ...newTeam, bio: e.target.value })}
              className="w-full p-2 mb-4 border rounded dark:bg-zinc-700 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 dark:bg-zinc-700"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">Join a Team</h3>
            <input
              type="text"
              placeholder="Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full p-2 mb-4 border rounded dark:bg-zinc-700 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 dark:bg-zinc-700"
                onClick={() => setShowJoinModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-green-600 text-white"
                onClick={handleJoin}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
