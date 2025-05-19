import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import {
  createTask,
  deleteTask,
  getUserByIds,
  listenToTask,
  updateTask,
} from "../firebase/tasks";
import SettingsPanel from "../pages/SettingsPanel";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";

const TeamPage = ({ team, teamId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab") || "Tasks";
  const [selectedTab, setSelectedTab] = useState(currentTab);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [teamMembers, setTeamMembers] = useState(null);
  const [teamData, setTeamData] = useState(team);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (!team?.id) return;
    const unsub = listenToTask(team.id, setTasks);
    return () => unsub();
  }, [team?.id]);

  useEffect(() => {
    setTeamData(team);
  }, [team]);

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

  const getDueTagBgClass = (dueDate) => {
    const daysLeft = dayjs(dueDate).diff(dayjs(), "day");
    if (!dueDate) return "bg-gray-500";
    if (daysLeft < 0) return "bg-red-500";
    if (daysLeft <= 2) return "bg-orange-500";
    return "bg-green-500";
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setEditingTask({ ...task });
  };

  const handleTaskUpdate = async () => {
    await updateTask(team.id, selectedTask.id, editingTask);
    setSelectedTask(null);
    toast.success("Task updated");
  };

  const addTask = async () => {
    if (!team?.id || !title.trim()) return;
    const newTask = {
      title,
      description,
      status,
      dueDate: dueDate || null,
      assignedTo: assignedTo || null,
      createdBy: "You",
    };
    await createTask(team.id, newTask);
    setShowModal(false);
    setTitle("");
    setDescription("");
    setStatus("todo");
    setDueDate("");
    setAssignedTo("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-gray-100">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">{teamData?.name}</h1>
        <p className="text-gray-400 mt-2 text-base">{teamData?.bio}</p>
      </div>

      <div className="flex gap-6 border-b border-gray-600 mb-8">
        {["Tasks", "Members", "Activity", "Settings"].map((tab) => (
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
                    {tasks
                      .filter((t) => t.status === status)
                      .map((task) => (
                        <li
                          key={task.id}
                          className="bg-zinc-700 text-white p-3 rounded-md shadow-sm flex justify-between items-center cursor-pointer hover:bg-zinc-600"
                          onClick={() => handleTaskClick(task)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{task.title}</span>
                            {task.dueDate && (
                              <span
                                className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full text-white ${getDueTagBgClass(
                                  task.dueDate
                                )}`}
                              >
                                Due: {dayjs(task.dueDate).format("MMM D")}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
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
              placeholder="Title"
              className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
            />
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
            >
              <option value="">Unassigned</option>
              {teamMembers?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name || m.email}
                </option>
              ))}
            </select>
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
                onClick={addTask}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTask && editingTask && (
        <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-zinc-900 text-white z-50 shadow-lg p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Task Details</h3>
            <button onClick={() => setSelectedTask(null)}>
              <X />
            </button>
          </div>
          <input
            className="w-full p-2 mb-3 rounded bg-zinc-800"
            value={editingTask.title}
            onChange={(e) =>
              setEditingTask({ ...editingTask, title: e.target.value })
            }
          />
          <textarea
            className="w-full p-2 mb-3 rounded bg-zinc-800"
            rows={4}
            value={editingTask.description || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, description: e.target.value })
            }
          />
          <label className="text-sm mb-1 block">Due Date</label>
          <input
            type="date"
            className="w-full p-2 mb-3 rounded bg-zinc-800"
            value={editingTask.dueDate || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, dueDate: e.target.value })
            }
          />
          <label className="text-sm mb-1 block">Assigned To</label>
          <select
            className="w-full p-2 mb-3 rounded bg-zinc-800"
            value={editingTask.assignedTo || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, assignedTo: e.target.value })
            }
          >
            <option value="">Unassigned</option>
            {teamMembers?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name || m.email}
              </option>
            ))}
          </select>
          <label className="text-sm mb-1 block">Status</label>
          <select
            className="w-full p-2 mb-3 rounded bg-zinc-800"
            value={editingTask.status}
            onChange={(e) =>
              setEditingTask({ ...editingTask, status: e.target.value })
            }
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <div className="text-sm mb-4">
            Created by: {editingTask.createdBy || "Unknown"}
          </div>
          <div className="flex justify-between gap-2">
            <button
              onClick={() => deleteTask(teamId, selectedTask.id)}
              className="text-red-500 hover:text-red-300"
            >
              Delete
            </button>
            <button
              onClick={handleTaskUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>
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
          team={teamData}
          onEdit={async (updates) => {
            await updateDoc(doc(db, "teams", team.id), updates);
            setTeamData((prev) => ({ ...prev, ...updates }));
            toast.success("Team updated");
          }}
          onDelete={async () => {
            await deleteDoc(doc(db, "teams", team.id));
            toast.success("Team deleted");
            navigate("/Teams");
          }}
        />
      )}
    </div>
  );
};

export default TeamPage;
