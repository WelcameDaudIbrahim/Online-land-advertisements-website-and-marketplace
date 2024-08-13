"use client";

import {
  AdminButton,
  AdminBox,
  AdminHeader,
} from "@/components/admin/layout/Utils";
import React from "react";
import PostForm from "@/components/posts/PostForm";

export default function Page() {
  return (
    <div className="px-3.5">
      <div className="flex items-center w-full justify-between py-2.5 mt-2.5 mb-4">
        <AdminHeader>Add Post</AdminHeader>
        <AdminButton>Back</AdminButton>
      </div>
      <AdminBox>
        <PostForm />
      </AdminBox>
    </div>
  );
}
