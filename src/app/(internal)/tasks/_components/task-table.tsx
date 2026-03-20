"use client";

import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toggleTask, deleteTask } from "@/app/(internal)/actions/tasks";
import type { TaskWithProject } from "@/lib/types";

export function TaskTable({ tasks }: { tasks: TaskWithProject[] }) {
  if (tasks.length === 0) {
    return <p className="py-8 text-center text-sm text-surface-400">No tasks match your filters</p>;
  }

  return (
    <div className="rounded-xl border border-surface-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-100 text-left text-xs font-medium text-surface-500">
            <th className="px-4 py-3 w-10" />
            <th className="px-4 py-3">Task</th>
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="group border-b border-surface-50 last:border-0">
              <td className="px-4 py-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => {
                    if (typeof checked === "boolean") toggleTask(task.id, checked);
                  }}
                />
              </td>
              <td className={`px-4 py-3 ${task.completed ? "text-surface-400 line-through" : "text-surface-900"}`}>
                {task.title}
              </td>
              <td className="px-4 py-3">
                {task.projects ? (
                  <Badge variant="default">{task.projects.name}</Badge>
                ) : (
                  <span className="text-surface-400">Unassigned</span>
                )}
              </td>
              <td className="px-4 py-3 text-surface-400">
                {format(new Date(task.created_at), "MMM d")}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="invisible text-surface-400 transition-colors hover:text-red-500 group-hover:visible"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
