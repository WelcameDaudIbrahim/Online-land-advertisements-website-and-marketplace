import React from "react";
import PostForm from "@/components/posts/PostForm";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default async function page() {
  const user = await auth();
  if (!user) return notFound();

  const isVerified = !!user.user.emailVerified;

  return (
    <>
      {!isVerified ? (
        <div className="w-full h-full relative overflow-hidden">
          <Skeleton className="w-full h-full rounded-md -z-10 absolute top-0 left-0 bg-red-900 bg-opacity-15 duration-5000" />
          <div className="h-full bg-red-300 border-2 border-red-400 rounded-lg bg-opacity-25 w-full flex items-center justify-center overflow-hidden">
            <p className="text-red-900 font-mono font-medium text-xl text-center">
              You Must Verify Your Email To Post Your Property
            </p>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-black font-roboto text-3xl mb-4 font-medium tracking-wide">
            Create Posts
          </h1>
          <PostForm />
        </>
      )}
    </>
  );
}
