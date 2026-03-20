import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in",
          className
        )}
        {...props}
      >
        {Icon && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-100">
            <Icon className="h-6 w-6 text-surface-400" />
          </div>
        )}
        <h3 className="text-base font-semibold text-surface-900">{title}</h3>
        {description && (
          <p className="mt-1.5 max-w-sm text-sm text-surface-500">{description}</p>
        )}
        {action && <div className="mt-5">{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
