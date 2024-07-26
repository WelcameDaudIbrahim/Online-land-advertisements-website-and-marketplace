import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export function AdminHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "text-black font-roboto text-3xl font-medium tracking-wide",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function AdminButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cn(
        "text-white font-roboto py-1 px-4 text-base tracking-wider hover:bg-primary-500 focus-visible:!ring-transparent",
        className
      )}
      variant={variant}
      size={size}
      asChild={asChild}
      {...props}
    />
  );
}

export function AdminContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full bg-white border border-stone-200 shadow px-4 py-3 ",
        className
      )}
    >
      {children}
    </div>
  );
}
