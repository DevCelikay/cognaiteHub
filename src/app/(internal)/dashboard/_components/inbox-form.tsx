"use client";

import * as React from "react";
import { Plus, FolderKanban, Check } from "lucide-react";
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
  const [flash, setFlash] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setTitle("");
    setFlash(true);
    textareaRef.current?.focus();

    const fd = new FormData();
    fd.set("title", trimmed);
    if (projectId && projectId !== "none") {
      fd.set("project_id", projectId);
    }
    createTask(fd);

    setTimeout(() => setFlash(false), 600);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-44 flex-col">
      <div className="flex-1 rounded border border-stone-200/80 bg-[#faf7f2] p-3">
        <textarea
          ref={textareaRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className="h-full w-full resize-none bg-transparent text-stone-800 placeholder:text-stone-400 focus:outline-none"
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        {flash ? (
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <Check className="h-3.5 w-3.5" />
            Added
          </div>
        ) : (
          <span className="text-xs text-stone-400">Press Enter to add</span>
        )}
        <div className="flex gap-1.5">
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="h-8 w-auto gap-1.5 rounded border-stone-300 bg-white/60 px-2.5 text-xs text-stone-600 [&>svg:last-child]:h-3 [&>svg:last-child]:w-3 [&>svg:last-child]:text-stone-400">
              <FolderKanban className="h-3.5 w-3.5 shrink-0" />
              <SelectValue placeholder="Project" />
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
          <Button
            type="submit"
            disabled={!title.trim()}
            className="h-8 w-8 rounded border border-stone-300 bg-stone-700 p-0 hover:bg-stone-800 disabled:opacity-30"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
