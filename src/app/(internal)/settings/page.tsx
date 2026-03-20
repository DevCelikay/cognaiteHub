import Link from "next/link";
import { Users, UserCircle } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";

const settingsLinks = [
  {
    href: "/settings/profile",
    label: "Profile",
    description: "Your account details and preferences",
    icon: UserCircle,
  },
  {
    href: "/settings/team",
    label: "Team",
    description: "Manage members, roles, and invitations",
    icon: Users,
  },
];

export default function SettingsPage() {
  return (
    <PageContainer title="Settings" description="Manage your workspace">
      <div className="max-w-2xl space-y-2">
        {settingsLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white px-5 py-4 shadow-card transition-all duration-150 hover:shadow-hover"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-100">
              <item.icon className="h-5 w-5 text-surface-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-900">{item.label}</h3>
              <p className="text-sm text-surface-500">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
