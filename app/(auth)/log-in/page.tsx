import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COPYRIGHT_TEXT } from "@/data/layout";
import Image from "next/image";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";

export default function login() {
  return (
    <div className="flex flex-row">
      <Image
        src="/assets/login.png"
        height={1000}
        width={1000}
        alt="Login Image"
        className="!h-[100vh] w-[50%] "
      />
      <div className="flex flex-col  h-[100vh] w-[50%] px-16 justify-center">
        <Image
          src="/assets/logo.png"
          width={120}
          height={33}
          alt="logo"
          className="mx-auto pt-8"
        />
        <div className="flex items-center gap-2 flex-col my-auto max-w-[432px] md:min-w-[432px] mx-auto">
          <h1 className="mb-4 text-center text-primary text-5xl font-bold font-roboto leading-[57.60px]">
            Log in
          </h1>
          <Button className="rounded-none w-full text-base font-normal font-roboto text-red-500 hover:bg-red-500 hover:text-white bg-transparent border-2 border-red-500 leading-normal active:bg-red-600">
            <FaGoogle className="mr-1.5 size-4" />
            Log in with Google
          </Button>
          <Button className="rounded-none w-full text-base font-normal font-roboto text-indigo-700 hover:bg-indigo-700 hover:text-white bg-transparent border-2 border-indigo-700 leading-normal active:bg-indigo-800">
            <FaFacebookF className="mr-1.5 size-4" /> Log in with Facebook
          </Button>
          <div className="border-[1px] border-stone-600 w-full h-0"></div>
          <Input
            type="text"
            placeholder="Email"
            className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
          />
          <Input
            type="password"
            placeholder="Password"
            className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
          />
          <Button className="w-full text-white text-base font-normal font-roboto leading-[27px] tracking-wide rounded-none">
            Sign Up
          </Button>
          <p className="p-4">
            Already have an account?{" "}
            <span className="text-primary underline">Log In</span>
          </p>
        </div>
        <div className="text-left text-black text-sm font-normal font-roboto leading-[21px] w-full py-8">
          {COPYRIGHT_TEXT}
        </div>
      </div>
    </div>
  );
}
