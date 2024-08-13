"use client";
import useAuth from "@/hooks/useAuth";
import { notFound } from "next/navigation";
import React, { ReactNode } from "react";

export function RoleGate({
  children,
  allowedRole,
}: {
  children: ReactNode;
  allowedRole: string;
}) {
  const auth = useAuth();
  if (!auth || auth.role !== allowedRole) return notFound();
  return children;
}
export const AdminGate = ({ children }: { children: ReactNode }) => {
  return <RoleGate allowedRole="admin">{children}</RoleGate>;
};
