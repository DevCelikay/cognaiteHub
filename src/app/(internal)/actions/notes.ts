"use server";

import { createClient } from "@/lib/supabase/server";
import { refresh } from "next/cache";
import { createNoteSchema, updateNoteSchema } from "@/lib/validations";

export async function createNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = createNoteSchema.parse({
    project_id: formData.get("project_id"),
    title: formData.get("title"),
    content: formData.get("content") || undefined,
  });

  const { error } = await supabase.from("notes").insert({
    project_id: parsed.project_id,
    title: parsed.title,
    content: parsed.content ?? null,
  });

  if (error) throw new Error(error.message);
  refresh();
}

export async function updateNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = updateNoteSchema.parse({
    id: formData.get("id"),
    title: formData.get("title"),
    content: formData.get("content") || undefined,
  });

  const { error } = await supabase
    .from("notes")
    .update({ title: parsed.title, content: parsed.content ?? null })
    .eq("id", parsed.id);

  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  refresh();
}
