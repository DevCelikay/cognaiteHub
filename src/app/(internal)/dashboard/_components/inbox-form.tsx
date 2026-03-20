"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createTask } from "@/app/(internal)/actions/tasks";
import type { Project } from "@/lib/types";

export function InboxForm({ projects }: { projects: Project[] }) {
  const [title, setTitle] = React.useState("");
  const [projectId, setProjectId] = React.useState<string>("");
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setPending(true);
    const fd = new FormData();
    fd.set("title", title.trim());
    if (projectId && projectId !== "none") {
      fd.set("project_id", projectId);
    }
    await createTask(fd);
    setTitle("");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
      />
      <div className="flex items-center gap-2">
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="No project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No project</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={pending || !title.trim()}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </form>
  );
}
