"use client";

import { useQueryState } from "nuqs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Project } from "@/lib/types";

export function TaskFilters({ projects }: { projects: Project[] }) {
  const [status, setStatus] = useQueryState("status", { defaultValue: "all" });
  const [projectId, setProjectId] = useQueryState("project", { defaultValue: "all" });

  return (
    <div className="mb-4 flex gap-3">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={projectId} onValueChange={setProjectId}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
