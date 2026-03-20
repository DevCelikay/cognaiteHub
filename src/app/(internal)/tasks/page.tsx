import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CheckSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/layout/page-container";
import { TaskFilters } from "./_components/task-filters";
import { TaskInbox } from "./_components/task-inbox";
import { TaskTable } from "./_components/task-table";
import type { TaskWithProject, Project } from "@/lib/types";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; project?: string }>;
}) {
  const { status, project } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let query = supabase
    .from("tasks")
    .select("*, projects(id, name)")
    .eq("user_id", user!.id)
    .order("completed")
    .order("created_at", { ascending: false });

  if (status === "active") {
    query = query.eq("completed", false);
  } else if (status === "completed") {
    query = query.eq("completed", true);
  }

  if (project && project !== "all") {
    if (project === "unassigned") {
      query = query.is("project_id", null);
    } else {
      query = query.eq("project_id", project);
    }
  }

  const { data: tasks } = await query;

  const { data: projects } = await supabase
    .from("projects")
    .select("id, user_id, name, description, status, client_id, created_at, updated_at")
    .eq("user_id", user!.id)
    .order("name");

  return (
    <PageContainer title="Tasks" description="All tasks across projects">
      <TaskInbox projects={(projects ?? []) as Project[]} />
      <Suspense>
        <TaskFilters projects={(projects ?? []) as Project[]} />
      </Suspense>
      <TaskTable tasks={(tasks ?? []) as TaskWithProject[]} />
    </PageContainer>
  );
}
