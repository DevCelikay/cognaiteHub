import { redirect } from "next/navigation";
import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/layout/page-container";
import { InboxForm } from "./_components/inbox-form";
import type { Project } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: projects } = await supabase
    .from("projects")
    .select("id, user_id, name, description, status, client_id, created_at, updated_at")
    .eq("user_id", user!.id)
    .eq("status", "active")
    .order("name");

  return (
    <PageContainer title="Dashboard" description="Overview of your business at a glance">
      <div className="max-w-lg">
        <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
              <Inbox className="h-4 w-4 text-brand-500" />
            </div>
            <h2 className="font-semibold text-surface-900">Inbox</h2>
          </div>
          <InboxForm projects={(projects ?? []) as Project[]} />
        </div>
      </div>
    </PageContainer>
  );
}
