"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Plus,
  Mic,
  Square,
  Loader2,
  Trash2,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskCheck } from "@/components/ui/task-check";
import {
  createTask,
  toggleTask,
  deleteTask,
  toggleToday,
} from "@/app/(internal)/actions/tasks";
import { transcribeAudio } from "@/app/(internal)/actions/transcribe";
import type { TaskWithProject } from "@/lib/types";

function MobileTaskCard({ task }: { task: TaskWithProject }) {
  const [completed, setCompleted] = React.useState(task.completed);

  function handleToggle() {
    const next = !completed;
    setCompleted(next);
    toggleTask(task.id, next);
  }

  function handleRemove() {
    toggleToday(task.id, false);
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-surface-200 bg-white px-3 py-3 shadow-sm">
      <div onClick={handleToggle} className="cursor-pointer">
        <TaskCheck checked={completed} />
      </div>
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span
          className={`truncate text-sm font-medium ${
            completed ? "text-surface-400 line-through" : "text-surface-900"
          }`}
        >
          {task.title}
        </span>
        <div className="flex items-center gap-1.5">
          {task.projects && (
            <Badge variant="default" className="text-[10px]">
              {task.projects.name}
            </Badge>
          )}
          <span className="text-[10px] text-surface-400">
            {format(new Date(task.created_at), "MMM d")}
          </span>
        </div>
      </div>
      <button
        onClick={handleRemove}
        className="shrink-0 rounded p-1 text-surface-300 transition-colors hover:bg-surface-100 hover:text-surface-500"
      >
        <CircleDot className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function MobileToday({ tasks }: { tasks: TaskWithProject[] }) {
  const [title, setTitle] = React.useState("");
  const [recording, setRecording] = React.useState(false);
  const [transcribing, setTranscribing] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const incomplete = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const fd = new FormData();
    fd.set("title", trimmed);
    createTask(fd);
    setTitle("");
    inputRef.current?.focus();
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setTranscribing(true);
        try {
          const fd = new FormData();
          fd.append("file", blob, "recording.webm");
          const text = await transcribeAudio(fd);
          setTitle((prev) => (prev ? prev + " " + text : text));
          inputRef.current?.focus();
        } catch (err) {
          console.error(err);
        } finally {
          setTranscribing(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <div className="flex h-full flex-col bg-surface-50">
      {/* Header */}
      <div className="shrink-0 border-b border-surface-200 bg-white px-4 pb-3 pt-[max(env(safe-area-inset-top),12px)]">
        <h1 className="text-lg font-semibold text-surface-950">Today</h1>
        <p className="text-xs text-surface-400">
          {incomplete.length} {incomplete.length === 1 ? "task" : "tasks"} remaining
        </p>
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-b border-surface-200 bg-white px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <Button
            type="button"
            disabled={transcribing}
            onClick={recording ? stopRecording : startRecording}
            className={`h-9 w-9 shrink-0 rounded-lg border p-0 disabled:opacity-30 ${
              recording
                ? "border-brand-300 bg-brand-500 hover:bg-brand-600"
                : "border-surface-200 bg-white text-surface-600 hover:bg-surface-50"
            }`}
          >
            {transcribing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : recording ? (
              <Square className="h-3 w-3" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="submit"
            disabled={!title.trim()}
            className="h-9 w-9 shrink-0 rounded-lg border border-surface-200 bg-surface-950 p-0 hover:bg-surface-800 disabled:opacity-30"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        {recording && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-500">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
            Recording...
          </div>
        )}
        {transcribing && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-surface-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            Transcribing...
          </div>
        )}
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-auto px-4 py-3">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CircleDot className="mb-3 h-8 w-8 text-surface-300" />
            <p className="text-sm font-medium text-surface-500">No tasks for today</p>
            <p className="mt-1 text-xs text-surface-400">
              Add tasks from All Tasks to plan your day
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {incomplete.map((task) => (
              <MobileTaskCard key={task.id} task={task} />
            ))}
            {done.length > 0 && (
              <>
                <p className="px-1 pt-3 text-[11px] font-medium uppercase tracking-wider text-surface-400">
                  Completed
                </p>
                {done.map((task) => (
                  <MobileTaskCard key={task.id} task={task} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
