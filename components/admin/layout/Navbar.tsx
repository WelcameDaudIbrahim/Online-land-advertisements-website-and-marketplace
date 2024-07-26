import Image from "next/image";
import React from "react";
import { Input } from "../../ui/input";
import { LuBell } from "react-icons/lu";
import Navbar_Avatar from "@/components/Navbar_Avatar";
import { IoSearch } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaBars } from "react-icons/fa";

export default function Navbar({
  sidebarToggle,
}: {
  sidebarToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between w-full h-[10vh] bg-white px-8">
      {" "}
      <div className="logo flex items-center gap-4 text-gray-700">
        <FaBars onClick={sidebarToggle} className="size-5 cursor-pointer" />
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
          className="text-[#4f4f4f] rounded-sm rounded-r-none text-base font-normal font-roboto leading-normal border-gray-400 border-2 w-[576px] border-r-0 focus-visible:!ring-transparent"
        />
        <Button className="flex p-0 items-center aspect-square justify-center text-black border-2 border-gray-400 rounded-sm rounded-l-none bg-white hover:border-primary active:border-primary-500 active:bg-primary-500 hover:text-white">
          <IoSearch className="size-5" />
        </Button>
      </div>
      <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="notification relative size-10 rounded-full cursor-pointer hover:bg-gray-200 active:bg-gray-300 bg-opacity-80 flex items-center justify-center">
                <div className="bg-primary-500 rounded-full size-2.5 z-10 absolute right-2.5 top-1.5 opacity-90"></div>
                <LuBell className="size-6" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="tracking-wide font-semibold font-roboto text-sm text-primary">
                Coming Soon
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Navbar_Avatar />
      </div>
    </div>
  );
}
