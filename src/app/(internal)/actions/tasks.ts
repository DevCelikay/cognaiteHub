"use server";

import { createClient } from "@/lib/supabase/server";
import { refresh } from "next/cache";
import { createTaskSchema, toggleTaskSchema } from "@/lib/validations";

export async function createTask(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = createTaskSchema.parse({
    title: formData.get("title"),
    project_id: formData.get("project_id") || null,
  });

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title: parsed.title,
    project_id: parsed.project_id ?? null,
  });

  if (error) throw new Error(error.message);
  refresh();
}

export async function toggleTask(id: string, completed: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = toggleTaskSchema.parse({ id, completed });

  const { error } = await supabase
    .from("tasks")
    .update({ completed: parsed.completed })
    .eq("id", parsed.id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  refresh();
}
