import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProjectWithClient } from "@/lib/types";

export function ProjectCard({
  project,
  taskCount,
}: {
  project: ProjectWithClient;
  taskCount: number;
}) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-xl border border-surface-200 bg-white p-5 shadow-card transition-all duration-150 hover:shadow-hover"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-100 transition-colors group-hover:bg-brand-50">
          <FolderKanban className="h-[18px] w-[18px] text-surface-500 group-hover:text-brand-500" />
        </div>
        <Badge variant={project.status === "active" ? "success" : "default"}>
          {project.status}
        </Badge>
      </div>
      <h3 className="font-semibold text-surface-900">{project.name}</h3>
      {project.clients && (
        <p className="mt-0.5 text-sm text-surface-500">{project.clients.name}</p>
      )}
      <p className="mt-2 text-xs text-surface-400">
        {taskCount} {taskCount === 1 ? "task" : "tasks"}
      </p>
    </Link>
  );
}
