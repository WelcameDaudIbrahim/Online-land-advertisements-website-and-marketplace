import React from "react";
import PostForm from "@/components/posts/PostForm";

export default function page() {
  return (
    <>
      <h1 className="text-black font-roboto text-3xl mb-4 font-medium tracking-wide">
        Create Posts
      </h1>
      <PostForm />
    </>
  );
}
