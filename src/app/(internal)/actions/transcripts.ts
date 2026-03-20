"use server";

import { createClient } from "@/lib/supabase/server";
import { refresh } from "next/cache";
import { createTranscriptSchema } from "@/lib/validations";

export async function createTranscript(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = createTranscriptSchema.parse({
    project_id: formData.get("project_id"),
    title: formData.get("title"),
    content: formData.get("content") || undefined,
    source: formData.get("source") || undefined,
    recorded_at: formData.get("recorded_at") || undefined,
  });

  const { error } = await supabase.from("transcripts").insert({
    project_id: parsed.project_id,
    title: parsed.title,
    content: parsed.content ?? null,
    source: parsed.source ?? null,
    recorded_at: parsed.recorded_at ?? null,
  });

  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteTranscript(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("transcripts")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  refresh();
}
