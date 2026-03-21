import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/layout/page-container";
import { InboxTaskList } from "./_components/inbox-task-list";
import type { TaskWithProject, Project } from "@/lib/types";

export default async function InboxPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, projects(id, name)")
    .eq("user_id", user!.id)
    .is("project_id", null)
    .order("completed")
    .order("created_at", { ascending: false });

  const { data: projects } = await supabase
    .from("projects")
    .select("id, user_id, name, description, status, client_id, created_at, updated_at")
    .eq("user_id", user!.id)
    .eq("status", "active")
    .order("name");

  return (
    <PageContainer
      title="Inbox"
      description="Unassigned tasks — move them into projects"
      backHref="/projects"
    >
      <InboxTaskList
        tasks={(tasks ?? []) as TaskWithProject[]}
        projects={(projects ?? []) as Project[]}
      />
    </PageContainer>
  );
}
