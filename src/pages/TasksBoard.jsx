import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTeamById } from "../firebase/teams";
import { useUserStore } from "../store/userStore";
import toast from "react-hot-toast";
import {
  addPersonalTask,
  deletePersonalTask,
  getPersonalTasks,
  updatePersonalTask,
} from "../firebase/tasks";
import { Trash2, X } from "lucide-react";
import dayjs from "dayjs";

const TaskBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab") || "Personal Tasks";
  const user = useUserStore((s) => s.user);
  const [userTeams, setUserTeams] = useState([]);
  const [selectedTab, setSelectedTab] = useState(currentTab);
  const [tasks, setTasks] = useState([]);
  const tabs = ["Personal Tasks", "Team Boards"];
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("todo");
  const [selectedPersonalTask, setSelectedPersonalTask] = useState(null);
  const [editingPersonalTask, setEditingPersonalTask] = useState(null);

  const groupedTasks = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  useEffect(() => {
    setSelectedTab(currentTab);
  }, [currentTab]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || !user.uid) {
        return;
      }
      setLoading(true);
      const data = await getPersonalTasks(user.uid);
      setTasks(data || []);
      setLoading(false);
    };

    fetchTasks();
  }, [user?.uid]);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      if (user?.teamIds?.length) {
        const data = await Promise.all(
          user.teamIds.map((id) => getTeamById(id))
        );
        setUserTeams(data.filter(Boolean));
      }
      setLoading(false);
    };
    fetchTeams();
  }, [user?.uid]);

  const createTask = async () => {
    if (!user.uid) {
      toast.error("Login to add Tasks");
      return;
    }

    if (!title) {
      toast.error("Enter the title");
      return;
    }
    const newTask = {
      title,
      description,
      status,
      createdAt: new Date(),
       dueDate: dueDate ? new Date(dueDate) : null,
    };

    const added = await addPersonalTask(user.uid, newTask);
    setTasks((prev) => [...prev, added]);
    setTitle("");
    setDescription("");
    setStatus("todo");
    setShowModal(false);
    setDueDate("");
  };

  const updateTask = async (id, updates) => {
    if (!user?.uid) return;
    await updatePersonalTask(user.uid, id, updates);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTaskById = async (id) => {
    if (!user?.uid) return;
    await deletePersonalTask(user.uid, id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const getDueTagBgClass = (dueDate) => {
    const daysLeft = dayjs(dueDate).diff(dayjs(), "day");
    if (!dueDate) return "bg-gray-500";
    if (daysLeft < 0) return "bg-red-500";
    if (daysLeft <= 2) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 text-white">
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

      {selectedTab === "Personal Tasks" && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Tasks</h2>
            <div className="flex gap-2">
              <div className="flex justify-center mt-8">
                {user?.uid ? (
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm"
                  >
                    + Add Task
                  </button>
                ) : (
                  <button
                    onClick={() => toast.error("Login to add tasks")}
                    className="bg-gray-700 text-white px-6 py-2 rounded-md shadow-sm cursor-not-allowed"
                  >
                    + Add Task
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["todo", "in-progress", "done"].map((status) => (
              <div
                key={status}
                className="bg-zinc-800 p-4 rounded-lg shadow border border-zinc-700 flex flex-col"
              >
                <h3 className="text-lg font-semibold mb-4 border-b pb-2 capitalize text-blue-400">
                  {status.replace("-", " ")}
                </h3>
                <ul className="space-y-3 min-h-[30px] flex-1">
                  {groupedTasks[status].length > 0 ? (
                    groupedTasks[status].map((task) => (
                      <li
                        key={task.id}
                        className="bg-zinc-700 text-white p-3 rounded-md shadow-sm transition-colors flex justify-between items-center"
                      >
                        <div
                          onClick={() => {
                            setSelectedPersonalTask(task);
                            setEditingPersonalTask({ ...task });
                          }}
                          className="cursor-pointer flex-1"
                        >
                          <div className="font-medium">{task.title}</div>
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

                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => deleteTaskById(task.id)}
                            className="text-red-500 hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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

      {selectedPersonalTask && editingPersonalTask && (
  <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-zinc-900 text-white z-50 shadow-lg p-6 overflow-y-auto">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-semibold">Task Details</h3>
      <button
        onClick={() => setSelectedPersonalTask(null)}
        className="text-gray-400 hover:text-white"
      >
        <X size={20} />
      </button>
    </div>

    <div className="mb-4">
      <label className="text-sm text-gray-400 block mb-1">Title</label>
      <input
        className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
        value={editingPersonalTask.title}
        onChange={(e) =>
          setEditingPersonalTask({
            ...editingPersonalTask,
            title: e.target.value,
          })
        }
      />
    </div>

    <div className="mb-4">
      <label className="text-sm text-gray-400 block mb-1">Description</label>
      <textarea
        className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
        rows={4}
        value={editingPersonalTask.description || ""}
        onChange={(e) =>
          setEditingPersonalTask({
            ...editingPersonalTask,
            description: e.target.value,
          })
        }
      />
    </div>

    <div className="mb-4">
      <label className="text-sm text-gray-400 block mb-1">Due Date</label>
      <input
        type="date"
        value={
          editingPersonalTask.dueDate
            ? dayjs(editingPersonalTask.dueDate).format("YYYY-MM-DD")
            : ""
        }
        onChange={(e) =>
          setEditingPersonalTask({
            ...editingPersonalTask,
            dueDate: e.target.value ? new Date(e.target.value) : null,
          })
        }
        className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
      />
    </div>

    <div className="mb-6">
      <label className="text-sm text-gray-400 block mb-1">Status</label>
      <select
        className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
        value={editingPersonalTask.status}
        onChange={(e) =>
          setEditingPersonalTask({
            ...editingPersonalTask,
            status: e.target.value,
          })
        }
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
    <div className="flex justify-between gap-4">
      <button
        onClick={() => {
          deleteTaskById(selectedPersonalTask.id);
          setSelectedPersonalTask(null);
        }}
        className="w-full text-red-500 hover:text-red-300 border border-red-500 rounded py-2"
      >
        Delete
      </button>
      <button
        onClick={async () => {
          await updateTask(editingPersonalTask.id, editingPersonalTask);
          setSelectedPersonalTask(null);
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2"
      >
        Save
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
              placeholder="Description (optional)"
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
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-zinc-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={createTask}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
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
                  onClick={() => navigate(`/teams/${team.id}`)}
                >
                  <h3 className="text-lg font-semibold">{team.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{team.bio}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-2">
              You’re not in any teams yet. Join or create a team to view team
              tasks.
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default TaskBoard;
