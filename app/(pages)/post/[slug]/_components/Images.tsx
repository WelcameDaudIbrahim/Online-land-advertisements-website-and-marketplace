"use client";
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
  const [photoSrc, setPhotoSrc] = useState<string>(photo);

  return (
    <>
      <div>
        <div className="px-4 py-2.5 flex flex-col items-center justify-start">
          <div className="rounded-md p-2 hover:border-primary cursor-pointer border border-gray-400">
            <Image
              src={photo}
              alt="Image"
              width={100}
              height={100}
              quality={10}
              onClick={() => setPhotoSrc(photo)}
              className={`rounded-md ${
                photo === photoSrc && "border-2 border-primary"
              }`}
            />
          </div>
          {images.length > 0 &&
            images.map((image) => (
              <div
                key={image.id}
                onClick={() => setPhotoSrc(image.image)}
                className={`rounded-md p-2 hover:border-primary cursor-pointer border border-gray-400 mt-3.5 ${
                  image.image === photoSrc && "border-2 border-primary"
                }`}
              >
                <Image
                  src={image.image}
                  alt="Image"
                  width={100}
                  height={100}
                  priority
                  className="rounded-md"
                />
              </div>
            ))}
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
