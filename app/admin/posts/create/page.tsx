import { AdminBox, AdminHeader } from "@/components/admin/layout/Utils";
import React from "react";
import PostForm from "@/components/posts/PostForm";
import AdminBackButton from "../../_components/AdminBackButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Posts",
};
export default function Page() {
  return (
    <div className="px-3.5">
      <div className="flex items-center w-full justify-between py-2.5 mt-2.5 mb-4">
        <AdminHeader>Add Post</AdminHeader>
        <AdminBackButton />
      </div>
      <AdminBox>
        <PostForm />
      </AdminBox>
    </div>
  );
}
