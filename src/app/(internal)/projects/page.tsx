import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderKanban, CheckSquare, CircleDot, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectCard } from "./_components/project-card";
import { CreateProjectDialog } from "./_components/create-project-dialog";
import type { ProjectWithClient } from "@/lib/types";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: projects } = await supabase
    .from("projects")
    .select("*, clients(id, name)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const { data: taskCounts } = await supabase
    .from("tasks")
    .select("project_id")
    .eq("user_id", user!.id);

  const totalTaskCount = taskCounts?.length ?? 0;
  const countMap = new Map<string, number>();
  let inboxCount = 0;
  taskCounts?.forEach((t) => {
    if (t.project_id) {
      countMap.set(t.project_id, (countMap.get(t.project_id) ?? 0) + 1);
    } else {
      inboxCount++;
    }
  });

  const { data: todayTasks } = await supabase
    .from("tasks")
    .select("id")
    .eq("user_id", user!.id)
    .eq("today", true);

  const todayCount = todayTasks?.length ?? 0;

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user!.id)
    .order("name");

  return (
    <PageContainer
      title="Projects"
      description="All projects across clients"
      actions={<CreateProjectDialog clients={clients ?? []} />}
    >
      {/* Pinned task cards */}
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Link
          href="/projects/today"
          className="group flex items-center gap-4 rounded-xl border border-brand-200 bg-brand-50/50 p-5 shadow-card transition-all duration-150 hover:border-brand-300 hover:shadow-hover"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 transition-colors group-hover:bg-brand-200">
            <CircleDot className="h-[18px] w-[18px] text-brand-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-brand-900">Today</h3>
            <p className="text-xs text-brand-400">
              {todayCount} {todayCount === 1 ? "task" : "tasks"} for today
            </p>
          </div>
        </Link>
        <Link
          href="/projects/inbox"
          className="group flex items-center gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-card transition-all duration-150 hover:border-amber-300 hover:shadow-hover"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 transition-colors group-hover:bg-amber-200">
            <Inbox className="h-[18px] w-[18px] text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">Inbox</h3>
            <p className="text-xs text-amber-400">
              {inboxCount} unassigned {inboxCount === 1 ? "task" : "tasks"}
            </p>
          </div>
        </Link>
        <Link
          href="/projects/all"
          className="group flex items-center gap-4 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-card transition-all duration-150 hover:border-indigo-300 hover:shadow-hover"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 transition-colors group-hover:bg-indigo-200">
            <CheckSquare className="h-[18px] w-[18px] text-indigo-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-indigo-900">All Tasks</h3>
            <p className="text-xs text-indigo-400">
              {totalTaskCount} {totalTaskCount === 1 ? "task" : "tasks"} across all projects
            </p>
          </div>
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(projects as ProjectWithClient[]).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              taskCount={countMap.get(project.id) ?? 0}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to get started."
        />
      )}
    </PageContainer>
  );
}
