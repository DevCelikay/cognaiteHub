import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/layout/page-container";
import { TaskCardList } from "../all/_components/task-card-list";
import type { TaskWithProject } from "@/lib/types";

export default async function TodayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, projects(id, name)")
    .eq("user_id", user!.id)
    .eq("today", true)
    .order("completed")
    .order("created_at", { ascending: false });

  return (
    <PageContainer
      title="Today"
      description="Tasks you're focusing on today"
      backHref="/projects"
    >
      <div className="mt-4">
        <TaskCardList tasks={(tasks ?? []) as TaskWithProject[]} />
      </div>
    </PageContainer>
  );
}
