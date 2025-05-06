import React from "react";
import { useUserStore } from "../store/userStore";
import { useEffect, useState } from "react";
import { createTeam, getTeamById, updateForUser } from "../firebase/teams";

const Teams = () => {
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const [teams, setTeams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", bio: "" });
  const [inviteCode, setInviteCode] = useState("");
  const { authLoading } = useUserStore();
  const setAuthLoading = useUserStore((s) => s.setAuthLoading);


  useEffect(() => {
    const fetchItems = async () => {
      
      if (user?.teamIds?.length) {
        const data = await Promise.all(
          user.teamIds.map((id) => getTeamById(id))
        );
        setTeams(data.filter(Boolean));
      }
      setAuthLoading(false);
    };
    fetchItems();
  }, [user]);

  const handleCreate = async () => {
    console.log("one");
    if (!newTeam.name || !newTeam.bio || !user.uid) return;
    console.log("two");

    const team = await createTeam(newTeam.name, newTeam.bio, user.uid);
    console.log("three");

    const updatedTeamIds = [...(user.teamIds || []), team.id];
    await updateForUser(user.uid, { teamIds: updatedTeamIds });
    console.log("four before");

    updateUser({ teamIds: updatedTeamIds });
    console.log("four");

    setTeams((prev) => [...prev, team]);
    console.log("five");

    setShowCreateModal(false);
    setNewTeam({ name: "", bio: "" });
  };
  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Teams</h1>
  
        
        {!user?.teamIds?.length && (
          <div className="grid sm:grid-cols-2 gap-6">
            <div
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md cursor-pointer hover:ring-2 ring-blue-500 transition"
              onClick={() => setShowCreateModal(true)}
            >
              <h2 className="text-xl font-semibold mb-2">Create a Team</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Start a new team with a name and bio.
              </p>
            </div>
  
            <div
              onClick={() => setShowJoinModal(true)}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md cursor-pointer hover:ring-2 ring-green-500 transition"
            >
              <h2 className="text-xl font-semibold mb-2">Join a Team</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Enter an invite code to join an existing team.
              </p>
            </div>
          </div>
        )}
  
        <div className="text-center mt-10">
          <div className="spinner mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      {!user?.teamId && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div
            className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md cursor-pointer hover:ring-2 ring-blue-500 transition"
            onClick={() => setShowCreateModal(true)}
          >
            <h2 className="text-xl font-semibold mb-2">Create a Team</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Start a new team with a name and bio.
            </p>
          </div>

          <div
            onClick={() => setShowJoinModal(true)}
            className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md cursor-pointer hover:ring-2 ring-green-500 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Join a Team</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Enter an invite code to join an existing team.
            </p>
          </div>
        </div>
      )}

      {teams &&
        teams.map((team) => (
          <div
            key={team.id}
            className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md"
          >
            <h2 className="text-xl font-bold mb-1">{team.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              {team.bio}
            </p>
            <p className="text-xs text-gray-400">
              Invite Code: <code>{team.inviteCode}</code>
            </p>
          </div>
        ))}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Team</h2>
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
                onClick={() => {
                  setShowCreateModal(false);
                  setNewTeam({ name: "", bio: "" });
                }}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  handleCreate();
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Join Team</h2>
            <input
              type="text"
              placeholder="Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full p-2 mb-4 border rounded dark:bg-zinc-700 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setInviteCode("");
                }}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded">
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
