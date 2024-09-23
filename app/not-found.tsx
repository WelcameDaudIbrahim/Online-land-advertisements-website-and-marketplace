import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
};
export default function NotFound() {
  return (
    <>
      <div className="flex items-center justify-center w-full h-[100vh] overflow-hidden">
        <Image
          src="/assets/login.png"
          height={1000}
          width={1000}
          alt="Login Image"
          className="blur-lg !h-[100vh] w-full absolute top-0 left-0 object-cover -z-20 opacity-80"
          quality="45"
        />
        <div className="!h-[100vh] w-full absolute top-0 left-0 bg-primary-500 opacity-65 -z-10"></div>
        <div className=" ">
          <div className="">
            <h1 className="font-quicksand font-black text-[#e4e4e4] text-[122px] tracking-wide">
              404
            </h1>
          </div>
          <h2 className="text-2xl font-medium tracking-wider font-roboto text-gray-400">
            Ooops.This Page Couldn&rsquo;t Be Found
          </h2>
          <p className="text-white mt-1.5">
            The page you are looking for might have been removed had its name
            changed or is temporarily unavailable.
          </p>
          <Link href="/">
            <Button className="border-4 rounded-full mt-3.5 border-primary hover:border-primary hover:bg-white hover:text-black">
              Go To Homepage
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
