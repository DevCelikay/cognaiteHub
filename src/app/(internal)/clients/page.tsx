import { Users } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";

export default function ClientsPage() {
  return (
    <PageContainer title="Clients" description="Manage your client relationships">
      <EmptyState
        icon={Users}
        title="No clients yet"
        description="Add your first client to start managing projects and communications."
      />
    </PageContainer>
  );
}
