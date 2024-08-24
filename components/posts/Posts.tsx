import { $Enums } from "@prisma/client";
import React, { Suspense } from "react";
import PostCard from "./PostCard";
import { Skeleton } from "../ui/skeleton";
import { range } from "@/lib/utils";

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
    <div className={`w-full ${!!text ? "mt-8" : "mt-3"}`}>
      {!!text && (
        <h2 className="text-black text-[40px] font-bold font-roboto leading-[48px] text-center mb-10">
          {text}
        </h2>
      )}
      <div
        className={`w-full px-2.5 md:max-w-[1148px] mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ${
          vertical
            ? "flex flex-wrap sm:grid"
            : "md:flex flex flex-col flex-wrap md:flex-nowrap sm:grid"
        }`}
      >
        <Suspense
          fallback={range(1, 10).map((i) => (
            <div
              className={`w-full h-[227px] flex gap-6 ${
                vertical && "!flex-col"
              }`}
              key={i}
            >
              <Skeleton
                className={`w-[40%] h-full rounded-md ${vertical && "!w-full"}`}
              />
              <div className="w-full flex flex-col">
                <Skeleton className="w-full h-[36px] mt-2.5 rounded-md" />
                <Skeleton className="w-full h-full mt-2.5 rounded-md" />
              </div>
            </div>
          ))}
        >
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
  if (posts.length > 0) {
    return posts.map((post) => (
      <PostCard key={post.slug} post={post} vertical={vertical} />
    ));
  } else {
    return (
      <h1 className="text-center text-xl my-3.5 mt-12">No Posts Found :(</h1>
    );
  }
};
