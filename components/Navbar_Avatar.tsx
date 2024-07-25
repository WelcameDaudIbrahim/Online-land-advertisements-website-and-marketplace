"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

export default function Navbar_Avatar() {
  const [isAvatarOpen, setIsAvatarOpen] = useState<boolean>(false);

  return (
    <DropdownMenu onOpenChange={(open) => setIsAvatarOpen(open)}>
      <DropdownMenuTrigger className="font-roboto-condensed text-base text-center ml-4 flex items-center gap-2">
        <div className="flex items-center justify-center bg-primary rounded-full size-7 lg:size-10">
          <Avatar className="size-6 lg:size-9">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col">
            <p className="text-start text-black text-base font-medium gap-1.5 font-quicksand leading-normal tracking-tight hidden sm:block">
              Mr. Misses
            </p>
            <p className="text-start text-gray-400 font-roboto text-sm font-medium">
              Admin
            </p>
          </div>
          <ChevronDown
            className={`size-[18px] ml-2 ${
              isAvatarOpen && "rotate-180"
            } transition-transform duration-300`}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-black">
          My Accounts
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-black">
          My Orders
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-black">
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-red-600 hover:text-white">
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
