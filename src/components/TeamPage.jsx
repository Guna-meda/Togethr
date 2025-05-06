import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { createTask, deleteTask, listenToTask, updateTask } from "../firebase/tasks";
import { Trash2 } from "lucide-react";
import { InlineEditTask } from "./InLine";

const mockTeam = {
  name: "Cloud Warriors",
  bio: "A team conquering Firebase one bug at a time.",
  inviteCode: "abc123",
};

const TeamPage = ({ team = mockTeam  ,teamId}) => {
  const [selectedTab, setSelectedTab] = useState("Tasks");
  const tabs = ["Tasks", "Members", "Info", "Activity"];
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");

  useEffect(() => {
    if (!team?.id) return;

    const unsub = listenToTask(team.id, setTasks);
    return () => unsub();
  }, [team?.id]);

  const addTask = async () => {
    if (!team?.id || !title.trim()) return;

    await createTask(team.id, { title, description, status });
    setShowModal(false);
    setTitle("");
    setDescription("");
    setStatus("todo");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-gray-100 ">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">{team.name}</h1>
        <p className="text-gray-400 mt-2 text-base">{team.bio}</p>
      </div>

      <div className="flex gap-6 border-b border-gray-600 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
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

      <div>
        {selectedTab === "Tasks" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Team Tasks</h2>

            {tasks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {["todo", "in-progress", "done"].map((status) => (
                  <div
                    key={status}
                    className="bg-zinc-800 border border-zinc-700 rounded-md p-4 shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-blue-400 mb-3 border-b border-zinc-600 pb-2 capitalize">
                      {status.replace("-", " ")}
                    </h3>

                    <ul className="space-y-3 min-h-[40px]">
                      {tasks.filter((t) => t.status === status).length > 0 ? (
                        tasks
                          .filter((t) => t.status === status)
                          .map((task) => (
                            <li
                              key={task.id}
                              className="bg-zinc-700 text-white p-3 rounded-md shadow-sm transition-colors flex justify-between items-center"
                            >
                              <InlineEditTask
                                task={task}
                                onSave={(newTitle) =>
                                  updateTask(team.id, task.id, {
                                    title: newTitle,
                                  })
                                }
                              />

                              <div className="flex gap-2 items-center">
                               
                                <button
                                  onClick={() => deleteTask(teamId, task.id)}
                                  className="text-red-500 hover:text-red-300"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </li>
                          ))
                      ) : (
                        <li className="text-gray-400 italic text-sm">
                          No tasks
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 italic mt-10">
                No tasks yet. Start by adding one.
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm"
              >
                + Add Task
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full max-w-md space-y-4">
              <h3 className="text-xl font-semibold">Add New Task</h3>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Title"
                className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-zinc-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addTask()}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "Members" && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Team Members
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Arjun R", role: "Owner", joined: "Apr 2025" },
                { name: "Neha K", role: "Member", joined: "May 2025" },
              ].map((member, idx) => (
                <div
                  key={idx}
                  className="bg-gray-700 border border-gray-600 rounded-md p-4 text-sm"
                >
                  <div className="font-medium text-white">{member.name}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    {member.role} • Joined: {member.joined}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "Info" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-2">Team Info</h2>
            <p className="text-gray-400">
              <span className="font-medium text-white">Name:</span> {team.name}
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-white">Description:</span>{" "}
              {team.bio}
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-white">Invite Code:</span>{" "}
              <code className="bg-gray-600 px-2 py-1 rounded text-sm text-gray-100">
                {team.inviteCode}
              </code>
            </p>
            <div className="flex gap-3 pt-3">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm">
                Edit
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm">
                Delete Team
              </button>
            </div>
          </div>
        )}

        {selectedTab === "Activity" && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Recent Activity
            </h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                • Arjun added task:{" "}
                <span className="font-medium">Deploy to Firebase</span>
              </li>
              <li>• Neha joined the team</li>
              <li>• Arjun updated team description</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
