import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/layout/page-container";
import { InviteDialog } from "./_components/invite-dialog";
import { MemberRow } from "./_components/member-row";
import type { Profile } from "@/lib/types";

export default async function TeamSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const canManage = currentProfile?.role === "owner" || currentProfile?.role === "admin";

  const { data: members } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at");

  // Sort: owner first, then admins, then members
  const roleOrder = { owner: 0, admin: 1, member: 2 };
  const sorted = ((members ?? []) as Profile[]).sort(
    (a, b) => roleOrder[a.role] - roleOrder[b.role]
  );

  return (
    <PageContainer
      title="Team"
      description="Manage team members and roles"
      actions={canManage ? <InviteDialog /> : undefined}
    >
      <div className="max-w-2xl space-y-2">
        {sorted.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            currentUserId={user.id}
            canManage={canManage}
          />
        ))}
      </div>
    </PageContainer>
  );
}
