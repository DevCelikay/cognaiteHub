import { Settings } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProfileSettingsPage() {
  return (
    <PageContainer title="Profile" description="Your personal settings">
      <EmptyState
        icon={Settings}
        title="Profile settings coming soon"
        description="Update your name, email, avatar, and notification preferences."
      />
    </PageContainer>
  );
}
