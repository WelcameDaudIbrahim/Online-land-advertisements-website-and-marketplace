import {
  AdminButton,
  AdminBox,
  AdminHeader,
} from "@/components/admin/layout/Utils";
import React from "react";
import PostForm from "@/components/posts/PostForm";
import { notFound } from "next/navigation";
import db from "@/db/db";
import { headers } from "next/headers";
import { auth } from "@/auth";

export default async function Page({ params }: { params: { slug: string } }) {
  const user = await auth();

  if (!user || user === null) return notFound();

  const headersList = headers();
  const domain = headersList.get("host") || "";

  const { slug } = params;

  if (!slug) return notFound();

  const post = await db.post.findUnique({
    where: { slug, userId: user.user.id },
    select: {
      id: true,
      property_id: true,
      slug: true,
      title: true,
      photo: true,
      description: true,
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
      <h1 className="text-black font-roboto text-3xl mb-4 font-medium tracking-wide">
        Update Posts
      </h1>
      <PostForm id={post.id} postData={{ ...newPost, images: Images }} />
    </div>
  );
}
