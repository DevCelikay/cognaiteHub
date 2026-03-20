"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteCard } from "./note-card";
import { NoteDialog } from "./note-dialog";
import type { Note } from "@/lib/types";

export function NotesGallery({ notes, projectId }: { notes: Note[]; projectId: string }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedNote, setSelectedNote] = React.useState<Note | null>(null);

  function openNew() {
    setSelectedNote(null);
    setDialogOpen(true);
  }

  function openEdit(note: Note) {
    setSelectedNote(note);
    setDialogOpen(true);
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>
      {notes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onClick={() => openEdit(note)} />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-surface-400">No notes yet</p>
      )}
      <NoteDialog
        projectId={projectId}
        note={selectedNote}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
