"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { refresh } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role === "member") {
    throw new Error("Only owners and admins can manage the team");
  }

  return { user, supabase };
}

export async function inviteUser(formData: FormData) {
  await requireAdmin();

  const email = formData.get("email") as string;
  const role = (formData.get("role") as string) || "member";

  if (!email) return { error: "Email is required" };
  if (!["admin", "member"].includes(role)) return { error: "Invalid role" };

  const admin = createAdminClient();

  // Check if user already exists
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (existingProfile) return { error: "User already exists" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/accept-invite`,
  });

  if (error) return { error: error.message };

  // Pre-set role in profiles (trigger will create with 'member', update if needed)
  if (role === "admin") {
    // Wait for trigger to create profile, then update
    // The trigger fires on auth.users insert, so profile should exist after invite
    const { data: newUser } = await admin.auth.admin.listUsers();
    const invited = newUser.users.find((u) => u.email === email);
    if (invited) {
      await admin.from("profiles").update({ role }).eq("id", invited.id);
    }
  }

  refresh();
  return { error: null };
}

export async function updateUserRole(userId: string, role: string) {
  const { supabase } = await requireAdmin();

  if (!["admin", "member"].includes(role)) {
    throw new Error("Invalid role");
  }

  // Prevent changing owner role
  const { data: target } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (target?.role === "owner") {
    throw new Error("Cannot change the owner's role");
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) throw new Error(error.message);
  refresh();
}

export async function removeUser(userId: string) {
  const { user } = await requireAdmin();

  if (userId === user.id) {
    throw new Error("Cannot remove yourself");
  }

  const admin = createAdminClient();

  // Prevent removing owner
  const { data: target } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (target?.role === "owner") {
    throw new Error("Cannot remove the owner");
  }

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);

  refresh();
}
