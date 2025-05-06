import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";

export const InlineEditTask = ({ task, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleConfirm = () => {
    if (value.trim() && value !== task.title) {
      onSave(value);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setValue(task.title);
    setEditing(false);
  };

  return (
    <div className="relative">
      {editing ? (
        <>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-zinc-700 text-white px-3 py-2 rounded-md outline-none border border-zinc-600"
          />

          <div className="absolute left-1/2 -translate-x-1/2 mt-2 flex gap-3 bg-zinc-800 border border-zinc-600 rounded-md px-3 py-2 shadow-lg z-10">
            <button
              onClick={handleConfirm}
              className="text-green-400 hover:text-green-500"
              title="Save"
            >
              <Check size={18} />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-400 hover:text-red-500"
              title="Cancel"
            >
              <X size={18} />
            </button>
          </div>
        </>
      ) : (
        <div
          onClick={() => setEditing(true)}
          className="cursor-pointer hover:bg-zinc-700 px-3 py-2 rounded-md transition"
        >
          <p className="text-white">{task.title || <span className="italic text-gray-400">Untitled</span>}</p>
        </div>
      )}
    </div>
  );
};
