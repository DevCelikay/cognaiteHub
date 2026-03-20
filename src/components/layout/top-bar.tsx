"use client";

import * as React from "react";
import { Bell, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { logout } from "@/app/(internal)/actions/auth";

export function TopBar({ userEmail }: { userEmail?: string | null }) {
  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "?";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-surface-200 bg-white px-6">
      <div />

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-surface-500 transition-all duration-150 hover:bg-surface-100 hover:text-surface-700"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500" />
        </button>

        <div className="flex items-center gap-2">
          <Avatar
            size="default"
            fallback={initials}
            className="cursor-pointer transition-all duration-150 hover:ring-2 hover:ring-brand-500/20"
          />
          {userEmail && (
            <span className="hidden text-sm text-surface-600 sm:inline">{userEmail}</span>
          )}
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-surface-500 transition-all duration-150 hover:bg-surface-100 hover:text-surface-700"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </form>
      </div>
    </header>
  );
}
