import { $Enums } from "@prisma/client";
import React, { Suspense } from "react";
import PostCard from "./PostCard";

export type PostCardType = {
  area: number;
  title: string;
  photo: string;
  updated_at: Date;
  slug: string;
  thana: string;
  district: string;
  division: string;
  bedroom: number | null;
  bathroom: number | null;
  property_for: $Enums.PropertyFor;
  property_type: $Enums.PropertyType;
};

export type getPostsType = () => Promise<PostCardType[]>;

export default function Posts({
  getPosts,
  vertical = true,
  text = "Recent Post",
}: {
  getPosts: getPostsType;
  vertical?: boolean;
  text?: string;
}) {
  return (
    <div className="w-full mt-8">
      <h2 className="text-black text-[40px] font-bold font-roboto leading-[48px] text-center mb-10">
        {text}
      </h2>
      <div
        className={`w-full px-2.5 md:max-w-[1148px] mx-auto grid--cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ${
          vertical ? "grid" : "flex flex-col"
        }`}
      >
        <Suspense fallback={<p>Loading...</p>}>
          <AllPost getPosts={getPosts} vertical={vertical} />
        </Suspense>
      </div>
    </div>
  );
}
const AllPost = async ({
  getPosts,
  vertical,
}: {
  getPosts: getPostsType;
  vertical: boolean;
}) => {
  const posts = await getPosts();
  return posts.map((post) => (
    <PostCard key={post.slug} post={post} vertical={vertical} />
  ));
};
