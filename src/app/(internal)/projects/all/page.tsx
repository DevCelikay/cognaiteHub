import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/layout/page-container";
import { TaskInbox } from "./_components/task-inbox";
import { TaskCardList } from "./_components/task-card-list";
import type { TaskWithProject, Project } from "@/lib/types";

export default async function AllTasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, projects(id, name)")
    .eq("user_id", user!.id)
    .order("completed")
    .order("created_at", { ascending: false });

  const { data: projects } = await supabase
    .from("projects")
    .select("id, user_id, name, description, status, client_id, created_at, updated_at")
    .eq("user_id", user!.id)
    .order("name");

  return (
    <PageContainer
      title="All Tasks"
      description="Every task across all projects"
      backHref="/projects"
    >
      <TaskInbox projects={(projects ?? []) as Project[]} />
      <div className="mt-4">
        <TaskCardList tasks={(tasks ?? []) as TaskWithProject[]} />
      </div>
    </PageContainer>
  );
}
