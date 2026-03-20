import { redirect } from "next/navigation";
import { FolderKanban } from "lucide-react";
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

  const countMap = new Map<string, number>();
  taskCounts?.forEach((t) => {
    if (t.project_id) {
      countMap.set(t.project_id, (countMap.get(t.project_id) ?? 0) + 1);
    }
  });

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
