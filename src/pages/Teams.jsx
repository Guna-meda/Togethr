// src/pages/Teams.jsx
import React from "react";
import { useUserStore } from "../store/userStore";
import { useEffect, useState } from "react";
//import { getTeamById } from "../firebase/teams"; // You’ll use this soon

const Teams = () => {
  const user = useUserStore((s) => s.user);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      if (user?.teamId) {
        const teamData = await getTeamById(user.teamId);
        setTeam(teamData);
      }
    };
    fetchTeam();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      {!user?.teamId && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md cursor-pointer hover:ring-2 ring-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Create a Team</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">Start a new team with a name and bio.</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md cursor-pointer hover:ring-2 ring-green-500 transition">
            <h2 className="text-xl font-semibold mb-2">Join a Team</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">Enter an invite code to join an existing team.</p>
          </div>
        </div>
      )}

      {team && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-1">{team.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{team.bio}</p>
          <p className="text-xs text-gray-400">Invite Code: <code>{team.inviteCode}</code></p>
        </div>
      )}
    </div>
  );
};

export default Teams;
