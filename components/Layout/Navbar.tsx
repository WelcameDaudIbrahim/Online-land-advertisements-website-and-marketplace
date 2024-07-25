"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { navbarLinks } from "@/data/navbar";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Navbar_Avatar from "../Navbar_Avatar";

export default function Navbar() {
  const pathname = usePathname();
  const [isLangOpen, setLangOpen] = useState<boolean>(false);
  return (
    <div className="w-full h-[77px] shadow-">
      <div className="w-container mx-auto h-full flex items-center justify-between px-3.5 pt-0.5 lg:p-0">
        <div className="flex items-center justify-start gap-16">
          <div className="logo ml-8">
            <Image
              src="/assets/logo.png"
              alt="logo"
              width={300}
              height={40}
              className="lg:!w-[auto] lg:!h-[30px] w-[161.94px] h-[40px]"
            />
          </div>
          <div className="hidden lg:flex items-center gap-8">
            {navbarLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className={
                  pathname === link.href
                    ? "text-teal-800 text-base font-bold font-roboto leading-normal"
                    : "font-roboto text-base text-black"
                }
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-8 mr-12">
          <Navbar_Avatar />
          <DropdownMenu onOpenChange={(open) => setLangOpen(open)}>
            <DropdownMenuTrigger className="font-roboto-condensed text-base text-center mr-12 flex items-center gap-2">
              <div className="flex items-center">
                <p className="text-black text-base gap-1.5 font-medium font-quicksand leading-normal tracking-tight hidden sm:block">
                  Bangla
                </p>
                <ChevronDown
                  className={`size-[18px] ${
                    isLangOpen && "rotate-180"
                  } transition-transform duration-300`}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="gap-x-1">
              <DropdownMenuItem className="cursor-default pointer-events-none bg-primary text-white m-0  hover:bg-gray-10 hover:text-black">
                Bangla
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-primary hover:text-white">
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="ml-8 px-4 py-1 bg-secondary rounded-sm justify-center items-center border-none hover-none drop-shadow-[2px_2px_0px_rgba(0,0,0,0.55))] text-zinc-100 text-base font-medium font-roboto leading-normal tracking-tight">
            Post Property
          </Button>
        </div>
      </div>
    </div>
  );
}
