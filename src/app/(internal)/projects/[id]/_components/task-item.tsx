"use client";

import * as React from "react";
import { Pencil, Trash2, X, Check, CircleDot } from "lucide-react";
import { TaskCheck } from "@/components/ui/task-check";
import { toggleTask, deleteTask, updateTask, toggleToday } from "@/app/(internal)/actions/tasks";
import type { Task } from "@/lib/types";

export function TaskItem({ task }: { task: Task }) {
  const [completed, setCompleted] = React.useState(task.completed);
  const [isToday, setIsToday] = React.useState(task.today);
  const [menu, setMenu] = React.useState<{ x: number; y: number } | null>(
    null
  );
  const [editing, setEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(task.title);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleRowClick() {
    if (editing) return;
    const next = !completed;
    setCompleted(next);
    toggleTask(task.id, next);
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY });
  }

  function startEdit() {
    setMenu(null);
    setEditing(true);
    setEditTitle(task.title);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function saveEdit() {
    if (!editTitle.trim()) return;
    setEditing(false);
    await updateTask(task.id, editTitle);
  }

  function cancelEdit() {
    setEditing(false);
    setEditTitle(task.title);
  }

  return (
    <>
      {menu && (
        <div className="fixed inset-0 z-40" onClick={() => setMenu(null)} />
      )}

      <div
        onClick={handleRowClick}
        onContextMenu={handleContextMenu}
        className="group relative flex cursor-pointer items-center gap-4 rounded-lg border border-surface-200 bg-white px-4 py-3.5 shadow-sm transition-all hover:bg-surface-50/80"
      >
        <TaskCheck checked={completed} />
        {editing ? (
          <div
            className="flex flex-1 items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              className="flex-1 rounded border border-surface-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              onClick={saveEdit}
              className="text-green-500 hover:text-green-600"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="text-surface-400 hover:text-surface-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span
            className={`flex-1 text-sm font-medium transition-colors ${
              completed
                ? "text-surface-400 line-through"
                : "text-surface-900 group-hover:text-surface-600"
            }`}
          >
            {isToday && <CircleDot className="mr-1.5 inline h-3 w-3 text-brand-500" />}
            {task.title}
          </span>
        )}
      </div>

      {/* Right-click context menu */}
      {menu && (
        <div
          className="fixed z-50 min-w-[160px] overflow-hidden rounded-lg border border-surface-200 bg-white py-1 shadow-lg"
          style={{ left: menu.x, top: menu.y }}
        >
          <button
            onClick={() => {
              setMenu(null);
              const next = !isToday;
              setIsToday(next);
              toggleToday(task.id, next);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-brand-600 hover:bg-brand-50"
          >
            <CircleDot className="h-3.5 w-3.5" />
            {isToday ? "Remove from Today" : "Add to Today"}
          </button>
          <button
            onClick={startEdit}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit task
          </button>
          <button
            onClick={() => {
              setMenu(null);
              deleteTask(task.id);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete task
          </button>
        </div>
      )}
    </>
  );
}
