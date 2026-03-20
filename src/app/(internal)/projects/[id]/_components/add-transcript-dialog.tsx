"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createTranscript } from "@/app/(internal)/actions/transcripts";

export function AddTranscriptDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    fd.set("project_id", projectId);
    await createTranscript(fd);
    setPending(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add Transcript
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transcript</DialogTitle>
          <DialogDescription>Add a meeting transcript or recording note.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="transcript-title" className="mb-1.5 block text-sm font-medium text-surface-700">
              Title
            </label>
            <Input id="transcript-title" name="title" required placeholder="Transcript title" />
          </div>
          <div>
            <label htmlFor="transcript-source" className="mb-1.5 block text-sm font-medium text-surface-700">
              Source
            </label>
            <Input id="transcript-source" name="source" placeholder="e.g. Zoom, Google Meet" />
          </div>
          <div>
            <label htmlFor="transcript-date" className="mb-1.5 block text-sm font-medium text-surface-700">
              Recorded at
            </label>
            <Input id="transcript-date" name="recorded_at" type="datetime-local" />
          </div>
          <div>
            <label htmlFor="transcript-content" className="mb-1.5 block text-sm font-medium text-surface-700">
              Content
            </label>
            <Textarea id="transcript-content" name="content" rows={6} placeholder="Paste transcript…" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding…" : "Add Transcript"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
