import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoBedOutline } from "react-icons/io5";
import { GrMapLocation } from "react-icons/gr";
import { LuBath } from "react-icons/lu";
import { PiMapPinSimpleAreaBold } from "react-icons/pi";
import { PostCardType } from "./Posts";
import { capitalizeFirstLetter, timeAgo } from "@/lib/utils";

export default function PostCard({ post }: { post: PostCardType }) {
  return (
    <div className="rounded-md my-auto border border-stone-200 flex items-center flex-col gap-2 max-w-[300px] bg-[#f8f8f8] shadow-xl hover:shadow-2xl">
      <Link href={`/post/${post.slug}`}>
        <div className="!min-h-[200px] max-h-auto flex items-start justify-center w-auto relative">
          <div
            className={`px-4 py-1.5 absolute -left-4 rounded-sm rounded-r-none rounded-tl-none top-6 ${
              post.property_for === "rent" ? "bg-red-600" : "bg-primary"
            }`}
          >
            <div
              className={`size-6 top-[-37%] rotate-45 absolute left-[5px] -z-10 ${
                post.property_for === "rent" ? "bg-red-900" : "bg-primary-dark"
              }`}
            ></div>
            <p className="text-xs font-semibold font-quicksand text-[#f4f4f4] leading-[18px] tracking-wide">
              {capitalizeFirstLetter(post.property_for)}
            </p>
          </div>
          <Image
            src="/assets/house.png"
            width={300}
            height={300}
            alt="Logo"
            className="rounded-md rounded-b-none object-contain"
          />
        </div>
      </Link>
      <div className="px-4 w-full">
        <Link href={`/post/${post.slug}`}>
          <p className="text-gray-700 hover:text-gray-900 text-sm font-medium font-roboto leading-[18px] tracking-normal">
            {capitalizeFirstLetter(post.property_type)}
          </p>
        </Link>
        <Link href={`/post/${post.slug}`}>
          <h1 className="text-black text-lg font-semibold font-roboto leading-[27px] line-clamp-2">
            {post.title}
          </h1>
        </Link>
        <div className="flex items-center gap-1 mt-1.5">
          <GrMapLocation className="text-gray-800 size-5" />
          <p className="text-black text-base font-medium font-roboto leading-[21px]">
            Section 15, Mirpur
          </p>
        </div>
      </div>
      <div
        className={`w-full rounded-md rounded-t-none flex items-center justify-between px-4 mt-2.5 ${
          !post.bedroom ? "!justify-end pr-6 gap-3.5" : ""
        }`}
      >
        {post.bedroom && (
          <div>
            <div className="flex items-center justify-center gap-1.5">
              <IoBedOutline className="text-gray-800 size-5" />
              <p className="text-black text-xl font-semibold font-roboto leading-[30px]">
                {post.bedroom}
              </p>
            </div>
            <p className="text-black text-sm font-semibold font-roboto leading-[15px]">
              Bedroom
            </p>
          </div>
        )}
        {post.bathroom && (
          <div>
            <div className="flex items-center justify-center gap-1.5">
              <LuBath className="text-gray-800 size-5" />
              <p className="text-black text-xl font-semibold font-roboto leading-[30px]">
                {post.bathroom}
              </p>
            </div>
            <p className="text-black text-sm font-semibold font-roboto leading-[15px]">
              Bathroom
            </p>
          </div>
        )}
        <div>
          <div className="flex items-center justify-center gap-1.5">
            <PiMapPinSimpleAreaBold className="text-gray-800 size-5" />
            <p className="text-black text-xl font-semibold font-roboto leading-[30px]">
              {post.area.toLocaleString()}
            </p>
          </div>
          <p className="text-black text-sm font-semibold font-roboto leading-[15px]">
            Sqft Area
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end px-4 pt-3.5 pb-1.5 w-full">
        <p className="text-gray-600 font-roboto text-base text-end">
          {timeAgo(post.updated_at)} Ago
        </p>
      </div>
    </div>
  );
}
