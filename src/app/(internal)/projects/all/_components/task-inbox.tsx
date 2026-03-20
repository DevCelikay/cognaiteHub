"use client";

import * as React from "react";
import {
  Plus,
  FolderKanban,
  Check,
  ChevronDown,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createTask } from "@/app/(internal)/actions/tasks";
import { aiCreateTasks } from "@/app/(internal)/actions/ai-tasks";
import type { Project } from "@/lib/types";

export function TaskInbox({ projects }: { projects: Project[] }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [projectId, setProjectId] = React.useState<string>("");
  const [flash, setFlash] = React.useState<string[]>([]);
  const [aiLoading, setAiLoading] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const resolvedProjectId =
    projectId && projectId !== "none" ? projectId : null;

  React.useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setTitle("");
    setFlash([trimmed]);
    textareaRef.current?.focus();

    const fd = new FormData();
    fd.set("title", trimmed);
    if (resolvedProjectId) fd.set("project_id", resolvedProjectId);
    createTask(fd);

    setTimeout(() => setFlash([]), 600);
  }

  async function handleAi() {
    const trimmed = title.trim();
    if (!trimmed || aiLoading) return;

    setAiLoading(true);
    setFlash([]);

    try {
      const titles = await aiCreateTasks(trimmed, resolvedProjectId);
      setTitle("");
      setFlash(titles);
      textareaRef.current?.focus();
      setTimeout(() => setFlash([]), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpen(false)}
        />
      )}
    <div className="relative z-20 border border-stone-200 bg-[#f5f0e8] shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 transition-colors hover:bg-[#f0ebe2]"
      >
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-stone-500" />
          <span className="text-sm font-medium text-stone-500">
            Quick add task
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-stone-200/80 p-5">
          <form onSubmit={handleSubmit} className="flex h-36 flex-col">
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
              {flash.length > 0 ? (
                <div className="flex-1 space-y-0.5">
                  {flash.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-sm text-green-600"
                    >
                      <Check className="h-3.5 w-3.5 shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              ) : aiLoading ? (
                <div className="flex items-center gap-1.5 text-sm text-purple-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Breaking down tasks...
                </div>
              ) : (
                <span className="text-xs text-stone-400">
                  Press Enter to add
                </span>
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
                  type="button"
                  disabled={!title.trim() || aiLoading}
                  onClick={handleAi}
                  className="h-8 w-8 rounded border border-purple-300 bg-purple-600 p-0 hover:bg-purple-700 disabled:opacity-30"
                >
                  {aiLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                </Button>
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
        </div>
      )}
    </div>
    </>
  );
}
