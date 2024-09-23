"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoBedOutline } from "react-icons/io5";
import { GrMapLocation } from "react-icons/gr";
import { LuBath } from "react-icons/lu";
import { PiMapPinSimpleAreaBold } from "react-icons/pi";
import { PostCardType } from "./Posts";
import { capitalizeFirstLetter, timeAgo } from "@/lib/utils";
import { IMAGES_PATH_PREFIX } from "@/routes";

export default function PostCard({
  post,
  vertical,
}: {
  post: PostCardType;
  vertical: boolean;
}) {
  const [isVertical, setIsVertical] = useState(vertical);
  const [updatedTime, setUpdatedTime] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth <= 768) setIsVertical(true);
    }
    setUpdatedTime(timeAgo(post.updated_at));
  }, []);
  return (
    <div
      className={`rounded-md mx-auto my-auto border w-full border-stone-200 flex items-center gap-2 bg-[#f8f8f8] shadow hover:shadow-md ${
        isVertical &&
        "flex-col !items-start max-w-full sm:max-w-[300px] px-0 sm:px-0 h-full"
      }`}
    >
      <Link
        href={`/post/${post.slug}`}
        className={!isVertical ? `w-fit h-[210px]` : `w-full`}
      >
        <div className="flex items-start justify-center h-full mx-auto md:m-0 relative w-full">
          <div
            className={`px-4 py-1.5 absolute left-0 md:-left-4 rounded-md md:rounded-sm rounded-r-noneopacity-65 md:bg-opacity-90 rounded-bl-none md:rounded-tl-none top-0 md:top-6 ${
              post.property_for === "rent" ? "bg-red-600" : "bg-primary"
            }`}
          >
            <p className="text-xs font-semibold font-quicksand text-[#f4f4f4] leading-[18px] tracking-wide">
              {capitalizeFirstLetter(post.property_for)}
            </p>
          </div>
          <Image
            src={IMAGES_PATH_PREFIX + post.photo}
            width={300}
            height={300}
            alt="Logo"
            className={`rounded-md sm:m-0  rounded-b-none object-cover ${
              !isVertical
                ? "rounded-r-none rounded-l-md onject-cover !h-full !min-w-[380px] !max-w-[380px]"
                : "!w-full !h-[200px]"
            }`}
          />
        </div>
      </Link>
      <div
        className={`${
          isVertical ? "flex-col" : "py-2.5 flex-col"
        } h-full flex justify-around w-full`}
      >
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
              {post.upazila}, {post.district}, {post.division}
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
        <div className="flex items-center justify-end px-4 pt-4 pb-2.5 w-full">
          <p className="text-gray-600 font-roboto text-sm text-end">
            {updatedTime} Ago
          </p>
        </div>
      </div>
    </div>
  );
}
