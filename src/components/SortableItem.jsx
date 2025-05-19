import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from "dayjs";

const SortableItem = ({ id, task, onClick, dueColor }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="bg-zinc-700 p-3 rounded-md hover:bg-zinc-600 cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <span>{task.title}</span>
        {task.dueDate && (
          <span className={`text-xs ${dueColor}`}>{dayjs(task.dueDate).format("MMM D")}</span>
        )}
      </div>
    </li>
  );
};


export default SortableItem;
