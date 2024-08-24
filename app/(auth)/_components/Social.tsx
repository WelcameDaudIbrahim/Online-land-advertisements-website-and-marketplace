"use client";
import { Button } from "@/components/ui/button";
import { DEFAULT_REDIRECT_AFTER_LOGIN } from "@/routes";
import { signIn } from "next-auth/react";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";

export default function Social({ text = " Log in" }: { text?: string }) {
  const onClick = (provider: "google" | "facebook") => {
    signIn(provider, { callbackUrl: DEFAULT_REDIRECT_AFTER_LOGIN });
  };
  return (
    <>
      <Button
        onClick={() => onClick("google")}
        className="rounded-none w-full text-base font-normal font-roboto text-red-500 hover:bg-red-500 hover:text-white bg-[#eee] md:bg-transparent bg-opacity-35 md:bg-opacity-100 border-2 border-red-500 leading-normal active:bg-red-600"
      >
        <FaGoogle className="mr-1.5 size-4" />
        {text} with Google
      </Button>
      <Button
        onClick={() => onClick("facebook")}
        className="rounded-none w-full text-base font-normal font-roboto text-indigo-700 hover:bg-indigo-700 hover:text-white bg-[#eee] md:bg-transparent bg-opacity-35 md:bg-opacity-100 border-2 border-indigo-700 leading-normal active:bg-indigo-800"
      >
        <FaFacebookF className="mr-1.5 size-4" /> {text} with Facebook
      </Button>
    </>
  );
}
