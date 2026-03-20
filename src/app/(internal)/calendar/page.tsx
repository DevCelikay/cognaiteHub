import { Calendar } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";

export default function CalendarPage() {
  return (
    <PageContainer title="Calendar" description="Deadlines, meetings, and milestones">
      <EmptyState
        icon={Calendar}
        title="Calendar coming soon"
        description="Task due dates, milestones, and meeting schedules will appear here."
      />
    </PageContainer>
  );
}
