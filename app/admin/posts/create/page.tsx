"use client";

import {
  AdminButton,
  AdminBox,
  AdminHeader,
} from "@/components/admin/layout/Utils";
import React from "react";
import CreatePost from "@/components/admin/post/CreatePost";

export default function Page() {
  return (
    <div className="px-3.5">
      <div className="flex items-center w-full justify-between py-2.5 ">
        <AdminHeader>Add Post</AdminHeader>
        <AdminButton>Back</AdminButton>
      </div>
      <AdminBox>
        <CreatePost />
      </AdminBox>
    </div>
  );
}
