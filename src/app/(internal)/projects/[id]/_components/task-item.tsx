"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleTask, deleteTask } from "@/app/(internal)/actions/tasks";
import type { Task } from "@/lib/types";

export function TaskItem({ task }: { task: Task }) {
  const [optimisticCompleted, setOptimisticCompleted] = React.useState(task.completed);

  async function handleToggle(checked: boolean | "indeterminate") {
    if (typeof checked !== "boolean") return;
    setOptimisticCompleted(checked);
    await toggleTask(task.id, checked);
  }

  return (
    <div className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-50">
      <Checkbox
        checked={optimisticCompleted}
        onCheckedChange={handleToggle}
      />
      <span className={`flex-1 text-sm ${optimisticCompleted ? "text-surface-400 line-through" : "text-surface-900"}`}>
        {task.title}
      </span>
      <button
        type="button"
        onClick={() => deleteTask(task.id)}
        className="invisible text-surface-400 transition-colors hover:text-red-500 group-hover:visible"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
