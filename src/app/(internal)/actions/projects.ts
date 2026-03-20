"use server";

import { createClient } from "@/lib/supabase/server";
import { refresh } from "next/cache";
import { createProjectSchema } from "@/lib/validations";

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = createProjectSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    client_id: formData.get("client_id") || null,
  });

  const { error } = await supabase.from("projects").insert({
    user_id: user.id,
    name: parsed.name,
    description: parsed.description ?? null,
    status: parsed.status,
    client_id: parsed.client_id ?? null,
  });

  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  refresh();
}
