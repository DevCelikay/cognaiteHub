"use client";

import * as React from "react";
import { CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskInbox } from "./task-inbox";
import { TaskCardList } from "./task-card-list";
import type { TaskWithProject, Project } from "@/lib/types";

export function AllTasksView({
  tasks,
  projects,
}: {
  tasks: TaskWithProject[];
  projects: Project[];
}) {
  const [selecting, setSelecting] = React.useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <TaskInbox projects={projects} />
        </div>
        <Button
          type="button"
          onClick={() => setSelecting(!selecting)}
          className={`h-[46px] shrink-0 gap-2 rounded border px-4 text-sm font-medium transition-all ${
            selecting
              ? "border-brand-300 bg-brand-500 text-white hover:bg-brand-600"
              : "border-surface-200 bg-white text-surface-600 hover:bg-surface-50"
          }`}
        >
          <CircleDot className="h-4 w-4" />
          {selecting ? "Done" : "Plan Today"}
        </Button>
      </div>
      <div className="mt-4">
        <TaskCardList tasks={tasks} selecting={selecting} />
      </div>
    </>
  );
}
