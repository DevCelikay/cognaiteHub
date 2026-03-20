"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50 active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default: "bg-brand-500 text-white hover:bg-brand-600 shadow-sm",
        secondary: "bg-surface-100 text-surface-900 hover:bg-surface-200",
        outline: "border border-surface-200 bg-white text-surface-700 hover:bg-surface-50 hover:text-surface-900",
        ghost: "text-surface-600 hover:bg-surface-100 hover:text-surface-900",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        link: "text-brand-500 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-9 px-4",
        lg: "h-10 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
