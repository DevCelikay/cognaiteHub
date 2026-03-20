"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { updateUserRole, removeUser } from "@/app/(internal)/actions/team";
import type { Profile } from "@/lib/types";

export function MemberRow({
  member,
  currentUserId,
  canManage,
}: {
  member: Profile;
  currentUserId: string;
  canManage: boolean;
}) {
  const isOwner = member.role === "owner";
  const isSelf = member.id === currentUserId;
  const initials = member.email.slice(0, 2).toUpperCase();

  async function handleRoleChange(role: string) {
    await updateUserRole(member.id, role);
  }

  async function handleRemove() {
    if (!confirm(`Remove ${member.email} from the team?`)) return;
    await removeUser(member.id);
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-surface-200 bg-white px-4 py-3">
      <Avatar size="default" fallback={initials} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-900 truncate">
          {member.full_name || member.email}
        </p>
        {member.full_name && (
          <p className="text-xs text-surface-500 truncate">{member.email}</p>
        )}
      </div>

      {isOwner ? (
        <Badge variant="brand">Owner</Badge>
      ) : canManage && !isSelf ? (
        <div className="flex items-center gap-2">
          <Select value={member.role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={handleRemove}
            className="flex h-8 w-8 items-center justify-center rounded-md text-surface-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <Badge variant={member.role === "admin" ? "info" : "default"}>
          {member.role}
        </Badge>
      )}
    </div>
  );
}
