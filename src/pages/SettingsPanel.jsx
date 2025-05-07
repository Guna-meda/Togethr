import { useState } from "react";
import { Copy, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const SettingsPanel = ({ team, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(team.name || "");
  const [editedBio, setEditedBio] = useState(team.bio || "");

  const handleCopy = () => {
    navigator.clipboard.writeText(team.inviteCode);
    toast.success("Invite code copied to clipboard");
  };

  const handleSave = () => {
    if (editedName.trim()) {
      onEdit({ name: editedName, bio: editedBio });
      setEditing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 px-4 md:px-8 text-white">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Team Settings</h2>
        <p className="text-gray-400 text-sm">Manage your team’s info and preferences</p>
      </div>

      {/* Team Info Section */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-blue-400">Team Info</h3>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center text-sm text-blue-500 hover:text-blue-300"
            >
              <Pencil size={16} className="mr-1" /> Edit
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            {editing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
              />
            ) : (
              <p>{team.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            {editing ? (
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
              />
            ) : (
              <p>{team.bio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Created At</label>
            <p>{new Date(team.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {editing && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setEditing(false)}
              className="bg-zinc-600 hover:bg-zinc-500 text-white px-4 py-2 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Invite Code Section */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-md p-6 space-y-2">
        <h3 className="text-lg font-medium text-blue-400">Invite Code</h3>
        <div className="flex items-center justify-between bg-zinc-700 px-4 py-2 rounded">
          <code className="text-sm">{team.inviteCode}</code>
          <button
            onClick={handleCopy}
            className="text-blue-400 hover:text-blue-300"
            title="Copy invite code"
          >
            <Copy size={18} />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-zinc-800 border border-red-600 rounded-md p-6 space-y-3">
        <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
        <p className="text-sm text-gray-400">
          This will permanently delete your team and all associated data.
        </p>
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Delete This Team
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
