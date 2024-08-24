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
import { sign_out } from "@/actions/auth.action";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { IMAGES_PATH_PREFIX } from "@/routes";
1;

export default function Navbar_Avatar() {
  const user = useAuth();

  const [isAvatarOpen, setIsAvatarOpen] = useState<boolean>(false);

  if (user !== undefined) {
    return (
      <div className="flex items-center">
        <DropdownMenu onOpenChange={(open) => setIsAvatarOpen(open)}>
          <DropdownMenuTrigger className="font-roboto text-base text-center ml-4 flex items-center gap-2">
            <div className="flex items-center justify-center bg-primary rounded-full size-8 md:size-[41px]">
              <Avatar className="size-8 md:size-9">
                <AvatarImage
                  src={
                    user?.image
                      ? user.image.startsWith("https://")
                        ? user?.image
                        : IMAGES_PATH_PREFIX + user?.image
                      : "/assets/profile.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="hidden md:flex items-center">
              <div className="flex flex-col">
                <p className="text-start text-black text-base font-medium gap-1.5 font-quicksand leading-normal tracking-tight hidden sm:block">
                  {user.name}
                </p>
                {user.role === "admin" && (
                  <p className="text-start text-gray-400 font-roboto text-sm font-medium">
                    Admin
                  </p>
                )}
              </div>
              <ChevronDown
                className={`size-[18px] ml-2 ${
                  isAvatarOpen && "rotate-180"
                } transition-transform duration-300`}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {user.role === "admin" && (
              <Link href="/admin/dashboard">
                <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-black">
                  Dashboard
                </DropdownMenuItem>
              </Link>
            )}
            <Link href="/user/accounts">
              <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-black">
                My Accounts
              </DropdownMenuItem>
            </Link>
            <Link href="/user/my-posts">
              <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-black">
                My Posts
              </DropdownMenuItem>
            </Link>
            <Link href="/user/settings">
              <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-black">
                Settings
              </DropdownMenuItem>
            </Link>
            <form
              action={async () => {
                await sign_out();
                if (typeof window !== "undefined") {
                  window.location.reload();
                }
              }}
            >
              <DropdownMenuItem asChild>
                <button
                  type="submit"
                  className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors w-full bg-transparent focus-visible:!ring-0 focus:!ring-0 !ring-0 text-black cursor-pointer hover:bg-red-600 hover:text-white text-start"
                >
                  Log Out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  } else {
    return (
      <Link href="/log-in">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center rounded-full size-7 lg:size-10">
            <Avatar className="size-6 lg:size-9">
              <AvatarImage src="/assets/profile.png" />
              <AvatarFallback>BL</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <p className="text-start text-black text-base font-medium gap-1.5 font-quicksand leading-normal tracking-tight hidden sm:block">
              Log-In
            </p>
          </div>
        </div>
      </Link>
    );
  }
}
