import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaskList } from "./_components/task-list";
import { NotesGallery } from "./_components/notes-gallery";
import { TranscriptList } from "./_components/transcript-list";
import type { Task, Note, Transcript } from "@/lib/types";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("*, clients(id, name)")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!project) notFound();

  const [{ data: tasks }, { data: notes }, { data: transcripts }] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("project_id", id)
      .eq("user_id", user!.id)
      .order("completed")
      .order("position")
      .order("created_at", { ascending: false }),
    supabase
      .from("notes")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("transcripts")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <PageContainer
      title={project.name}
      description={project.description ?? undefined}
      actions={
        <Badge variant={project.status === "active" ? "success" : "default"}>
          {project.status}
        </Badge>
      }
    >
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <TaskList tasks={(tasks ?? []) as Task[]} projectId={id} />
        </TabsContent>
        <TabsContent value="notes">
          <NotesGallery notes={(notes ?? []) as Note[]} projectId={id} />
        </TabsContent>
        <TabsContent value="transcripts">
          <TranscriptList transcripts={(transcripts ?? []) as Transcript[]} projectId={id} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
