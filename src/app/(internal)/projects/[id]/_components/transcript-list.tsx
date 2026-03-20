"use client";

import { format } from "date-fns";
import { Trash2, FileAudio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { deleteTranscript } from "@/app/(internal)/actions/transcripts";
import { AddTranscriptDialog } from "./add-transcript-dialog";
import type { Transcript } from "@/lib/types";

export function TranscriptList({
  transcripts,
  projectId,
}: {
  transcripts: Transcript[];
  projectId: string;
}) {
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <AddTranscriptDialog projectId={projectId} />
      </div>
      {transcripts.length > 0 ? (
        <div className="space-y-2">
          {transcripts.map((t) => (
            <div
              key={t.id}
              className="group flex items-center gap-3 rounded-lg border border-surface-200 bg-white p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-100">
                <FileAudio className="h-[18px] w-[18px] text-surface-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-surface-900">{t.title}</h4>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-surface-400">
                  {t.source && <Badge variant="info">{t.source}</Badge>}
                  {t.recorded_at && <span>{format(new Date(t.recorded_at), "MMM d, yyyy")}</span>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteTranscript(t.id)}
                className="invisible text-surface-400 transition-colors hover:text-red-500 group-hover:visible"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-surface-400">No transcripts yet</p>
      )}
    </div>
  );
}
