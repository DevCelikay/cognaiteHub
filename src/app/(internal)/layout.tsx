import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar userEmail={user?.email} />
        <main className="flex-1 overflow-auto bg-surface-50">{children}</main>
      </div>
    </div>
  );
}
