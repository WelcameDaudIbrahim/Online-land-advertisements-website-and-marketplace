"use client";
import { AdminButton } from "@/components/admin/layout/Utils";
import { useRouter } from "next/navigation";
import React from "react";

export default function AdminBackButton() {
  const router = useRouter();
  return <AdminButton onClick={() => router.back()}>Back</AdminButton>;
}
