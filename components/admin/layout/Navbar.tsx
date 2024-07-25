import Image from "next/image";
import React from "react";
import { Input } from "../../ui/input";
import { LuBell } from "react-icons/lu";
import Navbar_Avatar from "@/components/Navbar_Avatar";
import { IoSearch } from "react-icons/io5";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between w-full h-[10vh] bg-white px-8">
      {" "}
      <div className="logo">
        <Image
          src="/assets/logo.png"
          alt="logo"
          width={300}
          height={40}
          className="lg:!w-[auto] lg:!h-[30px] w-[161.94px] h-[40px]"
        />
      </div>
      <div className="flex">
        <Input
          type="text"
          placeholder="Do Not Search"
          className="text-[#4f4f4f] rounded-none text-base font-normal font-roboto leading-normal border-black border-2 w-[576px] border-r-0"
        />
        <Button className="flex p-0 items-center aspect-square justify-center text-black border-2 border-black rounded-none bg-white hover:border-primary-500 active:bg-primary-500 hover:text-white">
          <IoSearch className="size-5" />
        </Button>
      </div>
      <div className="flex items-center">
        <div className="notification relative">
          <div className="bg-primary-500 rounded-full size-2 z-10 absolute right-[2px] top-[-2px] opacity-85"></div>
          <LuBell className="size-5 cursor-pointer" />
        </div>
        <Navbar_Avatar />
      </div>
    </div>
  );
}
