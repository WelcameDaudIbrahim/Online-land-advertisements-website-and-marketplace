"use client";
import { AdminButton } from "@/components/admin/layout/Utils";
import { useRouter } from "next/navigation";
import React from "react";

export default function AdminCreatePostButton() {
  const router = useRouter();
  return (
    <AdminButton onClick={() => router.push("/admin/post/create")}>
      Create Post
    </AdminButton>
  );
}
