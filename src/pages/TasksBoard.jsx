import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const mockPersonalTasks = [
  { id: "1", title: "Buy groceries", status: "todo" },
  { id: "2", title: "Finish project", status: "in-progress" },
  { id: "3", title: "Call plumber", status: "done" },
];

const mockUserTeams = [
  { id: "team1", name: "Dev Ninjas", bio: "We build fast ⚡" },
  { id: "team2", name: "Product Squad", bio: "Ideas to MVP 💡" },
];

const TaskBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab") || "Personal Tasks";

  const [selectedTab, setSelectedTab] = useState(currentTab);
  const tabs = ["Personal Tasks", "Team Boards"];

  const personalTasks = mockPersonalTasks;
  const userTeams = mockUserTeams;

  const groupedTasks = {
    "todo": personalTasks.filter((t) => t.status === "todo"),
    "in-progress": personalTasks.filter((t) => t.status === "in-progress"),
    "done": personalTasks.filter((t) => t.status === "done"),
  };

  useEffect(() => {
    setSelectedTab(currentTab);
  }, [currentTab]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 text-white">

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-600 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => navigate(`?tab=${tab}`)}
            className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
              selectedTab === tab
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-400 hover:text-blue-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === "Personal Tasks" && (
        <section>
          <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["todo", "in-progress", "done"].map((status) => (
              <div
                key={status}
                className="bg-zinc-800 p-4 rounded-md shadow border border-zinc-700"
              >
                <h3 className="text-lg font-semibold mb-4 border-b pb-2 capitalize text-blue-400">
                  {status.replace("-", " ")}
                </h3>
                <ul className="space-y-3 min-h-[40px]">
                  {groupedTasks[status].length > 0 ? (
                    groupedTasks[status].map((task) => (
                      <li
                        key={task.id}
                        className="bg-zinc-700 p-3 rounded-md shadow-sm text-sm"
                      >
                        {task.title}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic text-sm">No tasks</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedTab === "Team Boards" && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Team Boards</h2>
          {userTeams.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userTeams.map((team) => (
                <div
                  key={team.id}
                  className="bg-zinc-800 hover:bg-zinc-700 transition p-4 rounded-lg cursor-pointer shadow"
                  onClick={() => navigate(`/team/${team.id}`)}
                >
                  <h3 className="text-lg font-semibold">{team.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{team.bio}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-2">
              You’re not in any teams yet. Join or create a team to view team tasks.
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default TaskBoard;
