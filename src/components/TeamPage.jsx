import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  createTask,
  deleteTask,
  getUserByIds,
  listenToTask,
  updateTask,
} from "../firebase/tasks";
import { Trash2 } from "lucide-react";
import { InlineEditTask } from "./InLine";
import SettingsPanel from "../pages/SettingsPanel";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const TeamPage = ({ team = mockTeam, teamId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab") || "Tasks";
  const [selectedTab, setSelectedTab] = useState(currentTab);
  const tabs = ["Tasks", "Members", "Activity", "Settings"];
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [teamm, setTeamm] = useState(null);
  const [teamMembers, setTeamMembers] = useState(null);
 

  useEffect(() => {
    if (!team?.id) return;

    const unsub = listenToTask(team.id, setTasks);
    return () => unsub();
  }, [team?.id]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (team?.memberIds) {
        const members = await getUserByIds(team.memberIds);
        setTeamMembers(members);
      }
    };
    fetchMembers();
  }, [team?.memberIds]);

  useEffect(() => {
    setSelectedTab(currentTab);
  }, [currentTab]);

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
            onClick={() => {
              navigate(`?tab=${tab}`);
            }}
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
          <div className="bg-zinc-800 p-4 rounded-lg mt-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">
              Team Members
            </h3>
            {teamMembers ? (
              <ul className="space-y-2 text-sm text-gray-200">
                {teamMembers.map((member) => (
                  <li key={member.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    {member.name || member.email}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">Loading members...</p>
            )}
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

        {selectedTab === "Settings" && (
          <SettingsPanel
            team={team}
            onEdit={async (updates) => {
              await updateDoc(doc(db, "teams", team.id), updates);
              toast.success("Team updated");
            }}
            onDelete={async () => {
              await deleteDoc(doc(db, "teams", team.id));
              toast.success("Team deleted");
              navigate("/Teams");            }}
          />
        )}
      </div>
    </div>
  );
};

export default TeamPage;
