import { useUserStore } from "../store/userStore"; // assuming you store teams too
import { useEffect, useState } from "react";

const TaskBoard = () => {
  const user = useUserStore((s) => s.user);
  const [team, setTeam] = useState(null); // You'll fetch this later from Firestore

  useEffect(() => {
    // Simulate fetching team info
    // In real case, fetch from Firestore if user.teamId exists
    if (user?.teamId) {
      setTeam({ name: "The Avengers" }); // Replace with actual Firestore fetch
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* My Tasks */}
      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
        <div className="text-4xl mb-2">➕</div>
        <h2 className="text-xl font-semibold">My Tasks</h2>
        <p className="text-sm text-gray-500">View and manage your personal tasks.</p>
      </div>

      {/* Team Tasks */}
      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
        <div className="text-4xl mb-2">👥</div>
        {team ? (
          <>
            <h2 className="text-xl font-semibold">{team.name} Tasks</h2>
            <p className="text-sm text-gray-500">View and manage your team’s shared tasks.</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">Join or Create a Team</h2>
            <p className="text-sm text-gray-500">Team up to collaborate on tasks.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
