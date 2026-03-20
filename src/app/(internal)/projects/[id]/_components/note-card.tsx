import { FileText } from "lucide-react";
import type { Note } from "@/lib/types";

export function NoteCard({
  note,
  onClick,
}: {
  note: Note;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full rounded-xl border border-surface-200 bg-white p-4 text-left shadow-card transition-all duration-150 hover:shadow-hover"
    >
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-surface-100">
        <FileText className="h-4 w-4 text-surface-500" />
      </div>
      <h4 className="font-medium text-surface-900">{note.title}</h4>
      {note.content && (
        <p className="mt-1 line-clamp-2 text-sm text-surface-500">{note.content}</p>
      )}
    </button>
  );
}
