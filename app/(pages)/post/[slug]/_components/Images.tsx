"use client";
import { IMAGES_PATH_PREFIX } from "@/routes";
import Image from "next/image";
import React, { useState } from "react";

export default function Images({
  images,
  photo,
}: {
  images: {
    id: number;
    image: string;
    created_at: Date;
    updated_at: Date;
    postId: number;
  }[];
  photo: string;
}) {
  photo = IMAGES_PATH_PREFIX + photo;

  const [photoSrc, setPhotoSrc] = useState<string>(photo);

  return (
    <>
      <div>
        <div className="px-4 py-2.5 flex flex-col items-center justify-start">
          <div
            className={`rounded-md p-2 hover:border-primary hover:outline-primary cursor-pointer border outline outline-transparent border-gray-400 mt-3.5 ${
              photo === photoSrc && "outline-primary border-primary"
            }`}
          >
            <Image
              src={photo}
              alt="Image"
              width={100}
              height={100}
              quality={10}
              onClick={() => setPhotoSrc(photo)}
              className={`rounded-md`}
            />
          </div>
          {images.length > 0 &&
            images.map((image) => {
              const image_path = IMAGES_PATH_PREFIX + image.image;
              return (
                <div
                  key={image.id}
                  onClick={() => setPhotoSrc(image_path)}
                  className={`rounded-md p-2 hover:border-primary hover:outline-primary cursor-pointer border outline outline-transparent border-gray-400 mt-3.5 ${
                    image_path === photoSrc && "outline-primary border-primary"
                  }`}
                >
                  <Image
                    src={image_path}
                    alt="Image"
                    width={100}
                    height={100}
                    priority
                    className="rounded-md"
                  />
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex items-center justify-center w-full">
        <Image
          src={photoSrc}
          height={800}
          width={800}
          quality={80}
          alt="Image"
          className=" !w-auto !max-h-[440px] !h-[100%] object-cover rounded-sm"
        />
      </div>
    </>
  );
}
