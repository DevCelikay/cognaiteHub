import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-200 text-surface-600 font-medium",
  {
    variants: {
      size: {
        sm: "h-7 w-7 text-xs",
        default: "h-9 w-9 text-sm",
        lg: "h-11 w-11 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(avatarVariants({ size, className }))} {...props}>
        {src ? (
          <img src={src} alt={alt ?? ""} className="h-full w-full object-cover" />
        ) : (
          <span>{fallback ?? "?"}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
