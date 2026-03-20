import { Handshake } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";

export default function DealsPage() {
  return (
    <PageContainer title="Deals" description="Track opportunities from lead to close">
      <EmptyState
        icon={Handshake}
        title="No deals yet"
        description="Your deal pipeline will show a kanban board here — Lead, Contacted, Proposal, Negotiation, Won, Lost."
      />
    </PageContainer>
  );
}
