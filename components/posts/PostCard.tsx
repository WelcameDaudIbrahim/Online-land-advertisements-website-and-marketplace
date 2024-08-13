import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoBedOutline } from "react-icons/io5";
import { GrMapLocation } from "react-icons/gr";
import { LuBath } from "react-icons/lu";
import { PiMapPinSimpleAreaBold } from "react-icons/pi";
import { PostCardType } from "./Posts";
import { capitalizeFirstLetter, timeAgo } from "@/lib/utils";

export default function PostCard({
  post,
  vertical,
}: {
  post: PostCardType;
  vertical: boolean;
}) {
  return (
    <div
      className={`rounded-md mx-auto my-auto border border-stone-200 flex items-center gap-2 bg-[#f8f8f8] shadow hover:shadow-md ${
        vertical &&
        "flex-col !items-start w-full max-w-full sm:max-w-[300px] px-4 sm:px-0"
      }`}
    >
      <Link href={`/post/${post.slug}`}>
        <div className=" max-h-auto flex items-start justify-center w-auto relative">
          <div
            className={`px-4 py-1.5 absolute left-0 md:-left-4 rounded-md md:rounded-sm rounded-r-none md:bg-opacity-95 opacity-65 rounded-bl-none md:rounded-tl-none top-0 md:top-6 ${
              post.property_for === "rent" ? "bg-red-600" : "bg-primary"
            }`}
          >
            <p className="text-xs font-semibold font-quicksand text-[#f4f4f4] leading-[18px] tracking-wide">
              {capitalizeFirstLetter(post.property_for)}
            </p>
          </div>
          <Image
            src={post.photo}
            width={300}
            height={300}
            alt="Logo"
            className="rounded-md sm:m-0 !w-100% !h-[300px] rounded-b-none object-contain"
          />
        </div>
      </Link>
      <div className={`${vertical && "flex-col w-full"}`}>
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
              {post.thana}, {post.district}, {post.division}
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
    </div>
  );
}
