import { redirect } from "next/navigation";
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
      <div className="border border-stone-200 bg-[#f5f0e8] shadow-sm">
        <div className="flex items-center border-b border-stone-200/80 px-5 py-3">
          <h2 className="text-sm font-medium text-stone-500">Inbox</h2>
        </div>
        <div className="p-5">
          <InboxForm projects={(projects ?? []) as Project[]} />
        </div>
      </div>
    </PageContainer>
  );
}
