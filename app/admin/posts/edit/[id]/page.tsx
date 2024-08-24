import { AdminBox, AdminHeader } from "@/components/admin/layout/Utils";
import React from "react";
import PostForm from "@/components/posts/PostForm";
import { notFound } from "next/navigation";
import db from "@/db/db";
import { createFile } from "@/lib/utils";
import { headers } from "next/headers";
import AdminBackButton from "@/app/admin/_components/AdminBackButton";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) return notFound();
  let post_id: number = 0;

  try {
    post_id = Number(id);
  } catch (err) {
    return notFound();
  }
  const post = await db.post.findUnique({
    where: { id: post_id },
    select: {
      property_id: true,
      slug: true,
      title: true,
      photo: true,
      description: true,
      phoneNumber: true,
      area: true,
      bedroom: true,
      bathroom: true,
      property_for: true,
      property_type: true,
      thana: true,
      district: true,
      division: true,
      location: true,
      status: true,
      created_at: true,
      updated_at: true,
      Images: { select: { image: true } },
    },
  });

  if (!post) return notFound();

  const Images: string[] = [];

  const { Images: newImages, ...newPost } = post;

  newImages.map(({ image }) => {
    Images.push(image);
  });
  return (
    <div className="px-3.5">
      <div className="flex items-center w-full justify-between py-2.5 mt-2.5 mb-4">
        <AdminHeader>Edit Post</AdminHeader>
        <AdminBackButton />
      </div>
      <AdminBox>
        <PostForm id={post_id} postData={{ ...newPost, images: Images }} />
      </AdminBox>
    </div>
  );
}
