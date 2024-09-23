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
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Post",
};
export default async function Page({ params }: { params: { slug: string } }) {
  const user = await auth();

  if (!user || user === null) return notFound();

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
      phoneNumber: true,
      area: true,
      tags: true,
      bedroom: true,
      bathroom: true,
      price: true,
      availableFrom: true,
      negotiable: true,
      property_for: true,
      facing: true,
      parking: true,
      selling_floor: true,
      amenities: true,
      total_floor: true,
      transaction_type: true,
      balcony: true,
      total_land_area: true,
      property_type: true,
      upazila: true,
      district: true,
      division: true,
      address: true,
      status: true,
      created_at: true,
      updated_at: true,
      image: { select: { image: true } },
    },
  });

  if (!post) return notFound();

  const Images: string[] = [];

  const { image: newImages, tags: postTags, ...newPost } = post;

  newImages.map(({ image }) => {
    Images.push(image);
  });
  return (
    <div className="px-3.5">
      <h1 className="text-black font-roboto text-3xl mb-4 font-medium tracking-wide">
        Update Posts
      </h1>
      <PostForm
        id={post.id}
        postData={{ ...newPost, images: Images, postTags }}
      />
    </div>
  );
}
