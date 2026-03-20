"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Handshake,
  Users,
  FolderKanban,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { logout } from "@/app/(internal)/actions/auth";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Deals", href: "/deals", icon: Handshake },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Calendar", href: "/calendar", icon: Calendar },
] as const;

const bottomItems = [
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col bg-surface-950 text-white">
      {/* Logo */}
      <div className="flex h-14 items-center px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Image
            src="/CognaiteIcon.svg"
            alt="Cognaite"
            width={28}
            height={28}
            className="invert"
          />
          <span className="text-[15px] font-semibold tracking-tight">CognaiteHub</span>
        </Link>
      </div>

      {/* Main nav */}
      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-white/10 text-white"
                    : "text-surface-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-500" />
                )}
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom nav */}
        <div className="flex flex-col gap-0.5 px-3 pb-4">
          {bottomItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-white/10 text-white"
                    : "text-surface-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-500" />
                )}
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-surface-400 transition-all duration-150 hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              <span>Log out</span>
            </button>
          </form>
        </div>
      </TooltipProvider>
    </aside>
  );
}
