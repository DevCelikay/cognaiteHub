"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Pencil,
  Trash2,
  X,
  Check,
  CircleDot,
  FolderKanban,
} from "lucide-react";
import { TaskCheck } from "@/components/ui/task-check";
import {
  toggleTask,
  deleteTask,
  updateTask,
  toggleToday,
  moveTaskToProject,
} from "@/app/(internal)/actions/tasks";
import type { TaskWithProject, Project } from "@/lib/types";

function InboxTaskCard({
  task,
  projects,
}: {
  task: TaskWithProject;
  projects: Project[];
}) {
  const [completed, setCompleted] = React.useState(task.completed);
  const [isToday, setIsToday] = React.useState(task.today);
  const [menu, setMenu] = React.useState<{ x: number; y: number } | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(task.title);
  const [showProjects, setShowProjects] = React.useState(false);
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
    setShowProjects(false);
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
        <div className="flex flex-1 flex-col gap-1">
          {editing ? (
            <div
              className="flex items-center gap-2"
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
              className={`text-sm font-medium transition-colors ${
                completed
                  ? "text-surface-400 line-through"
                  : "text-surface-900 group-hover:text-surface-600"
              }`}
            >
              {task.title}
            </span>
          )}
          <div className="flex items-center gap-2">
            {isToday && (
              <CircleDot className="h-3 w-3 text-brand-500" />
            )}
            <span className="text-[11px] text-surface-400">
              {format(new Date(task.created_at), "MMM d")}
            </span>
          </div>
        </div>
      </div>

      {menu && (
        <div
          className="fixed z-50 min-w-[180px] overflow-hidden rounded-lg border border-surface-200 bg-white py-1 shadow-lg"
          style={{ left: menu.x, top: menu.y }}
        >
          <div className="relative">
            <button
              onClick={() => setShowProjects(!showProjects)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
            >
              <FolderKanban className="h-3.5 w-3.5" />
              Move to project
            </button>
            {showProjects && (
              <div className="border-t border-surface-100">
                {projects.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-surface-400">
                    No projects available
                  </p>
                ) : (
                  projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setMenu(null);
                        setShowProjects(false);
                        moveTaskToProject(task.id, p.id);
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 pl-8 text-sm text-surface-700 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {p.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
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

export function InboxTaskList({
  tasks,
  projects,
}: {
  tasks: TaskWithProject[];
  projects: Project[];
}) {
  if (tasks.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-surface-400">
        No unassigned tasks — everything is in a project
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <InboxTaskCard key={task.id} task={task} projects={projects} />
      ))}
    </div>
  );
}
