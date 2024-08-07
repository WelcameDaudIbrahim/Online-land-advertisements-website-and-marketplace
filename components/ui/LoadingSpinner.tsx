import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import React from "react";

export default function LoadingSpinner({ className }: { className?: string }) {
  return <LoaderCircle className={cn(className, "animate-spin size-6")} />;
}
