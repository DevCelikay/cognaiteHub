import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { MobileToday } from "@/components/layout/mobile-today";
import type { TaskWithProject } from "@/lib/types";

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: todayTasks } = user
    ? await supabase
        .from("tasks")
        .select("*, projects(id, name)")
        .eq("user_id", user.id)
        .eq("today", true)
        .order("completed")
        .order("created_at", { ascending: false })
    : { data: null };

  return (
    <div className="flex h-full">
      {/* Mobile: Today view only */}
      <div className="flex h-full w-full flex-col md:hidden">
        <MobileToday tasks={(todayTasks ?? []) as TaskWithProject[]} />
      </div>

      {/* Desktop: normal layout */}
      <div className="hidden h-full w-full md:flex">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar userEmail={user?.email} />
          <main className="flex-1 overflow-auto bg-surface-50">{children}</main>
        </div>
      </div>
    </div>
  );
}
