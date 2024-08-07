import { $Enums, Post } from "@prisma/client";
import React from "react";
import PostCard from "./PostCard";

export type PostCardType = {
  area: number;
  title: string;
  updated_at: Date;
  slug: string;
  bedroom: number | null;
  bathroom: number | null;
  property_for: $Enums.PropertyFor;
  property_type: $Enums.PropertyType;
};

export type getPostsType = () => Promise<PostCardType[]>;

export default function Posts({
  getPosts,
  text = "Recent Post",
}: {
  getPosts: getPostsType;
  text?: string;
}) {
  return (
    <div className="w-full mt-8">
      <h2 className="text-black text-[40px] font-bold font-roboto leading-[48px] text-center mb-10">
        {text}
      </h2>
      <div className="max-w-[1460px] mx-auto grid grid-cols-4 gap-8">
        <AllPost getPosts={getPosts} />
      </div>
    </div>
  );
}
const AllPost = async ({ getPosts }: { getPosts: getPostsType }) => {
  const posts = await getPosts();
  return posts.map((post) => <PostCard key={post.slug} post={post} />);
};
