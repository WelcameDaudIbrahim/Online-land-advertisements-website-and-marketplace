import {
  AdminButton,
  AdminContainer,
  AdminHeader,
} from "@/components/admin/layout/Utils";
import React from "react";

export default function page() {
  return (
    <div className="px-3.5">
      <div className="flex items-center w-full justify-between py-2.5 ">
        <AdminHeader>Add Post</AdminHeader>
        <AdminButton>Back</AdminButton>
      </div>
      <AdminContainer>HEllo</AdminContainer>
    </div>
  );
}
