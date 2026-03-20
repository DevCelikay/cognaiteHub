"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createTask } from "@/app/(internal)/actions/tasks";
import { TaskItem } from "./task-item";
import type { Task } from "@/lib/types";

export function TaskList({ tasks, projectId }: { tasks: Task[]; projectId: string }) {
  const [title, setTitle] = React.useState("");
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setPending(true);
    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("project_id", projectId);
    await createTask(fd);
    setTitle("");
    setPending(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task…"
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={pending || !title.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>
      <div className="space-y-0.5">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <p className="py-8 text-center text-sm text-surface-400">No tasks yet</p>
        )}
      </div>
    </div>
  );
}
