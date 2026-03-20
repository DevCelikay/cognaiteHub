import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backHref?: string;
}

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, title, description, actions, backHref, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex-1 overflow-auto", className)} {...props}>
        <div className="mx-auto w-full max-w-6xl px-6 py-6">
          {/* Back link */}
          {backHref && (
            <Link
              href={backHref}
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-500 transition-colors hover:text-surface-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          )}

          {/* Page header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-surface-950">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-surface-500">{description}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>

          {/* Page content */}
          {children}
        </div>
      </div>
    );
  }
);
PageContainer.displayName = "PageContainer";

export { PageContainer };
