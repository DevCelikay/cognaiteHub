"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createNote, updateNote, deleteNote } from "@/app/(internal)/actions/notes";
import type { Note } from "@/lib/types";

export function NoteDialog({
  projectId,
  note,
  open,
  onOpenChange,
}: {
  projectId: string;
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, setPending] = React.useState(false);
  const isEdit = !!note;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    if (isEdit) {
      fd.set("id", note!.id);
      await updateNote(fd);
    } else {
      fd.set("project_id", projectId);
      await createNote(fd);
    }
    setPending(false);
    onOpenChange(false);
  }

  async function handleDelete() {
    if (!note) return;
    setPending(true);
    await deleteNote(note.id);
    setPending(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Note" : "New Note"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="note-title" className="mb-1.5 block text-sm font-medium text-surface-700">
              Title
            </label>
            <Input
              id="note-title"
              name="title"
              required
              defaultValue={note?.title ?? ""}
              placeholder="Note title"
            />
          </div>
          <div>
            <label htmlFor="note-content" className="mb-1.5 block text-sm font-medium text-surface-700">
              Content
            </label>
            <Textarea
              id="note-content"
              name="content"
              rows={6}
              defaultValue={note?.content ?? ""}
              placeholder="Write your note…"
            />
          </div>
          <div className="flex justify-between pt-2">
            <div>
              {isEdit && (
                <Button type="button" variant="destructive" onClick={handleDelete} disabled={pending}>
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : isEdit ? "Save" : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
