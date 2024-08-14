"use client";
import React from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";
import { navbarLinks } from "@/data/navbar";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Navbar_Avatar from "../Navbar_Avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  const pathname = usePathname();
  return (
    <>
      <Sheet>
        <SheetTrigger className="block md:hidden ">
          <Menu className="size-5 md:size-7" />
        </SheetTrigger>
        <SheetContent side={"left"} className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>
              <Image
                src="/assets/logo.png"
                alt="logo"
                width={300}
                height={40}
                quality={40}
                className="!w-[auto] !h-[30px]"
              />
            </SheetTitle>
            <SheetDescription>
              <ul className="mt-6 w-full">
                {navbarLinks.map((link) => (
                  <Link href={link.href} key={link.href}>
                    <li
                      className={`flex flex-1 items-center justify-between py-4 px-3.5 font-medium transition-all ${
                        pathname === link.href && "bg-accent rounded-md"
                      }`}
                    >
                      {link.name}
                    </li>
                  </Link>
                ))}
              </ul>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  // const [isLangOpen, setLangOpen] = useState<boolean>(false);
  return (
    <div className="w-full h-[56px] md:h-[77px] shadow-">
      <div className="w-container mx-auto h-full flex items-center justify-between px-0.5 md:px-3.5 pt-0.5 lg:p-0">
        <div className="flex items-center justify-start gap-16">
          <div className="flex items-center md:gap-5 gap-1.5 logo justify-center ml-2.5 md:ml-8">
            <MobileNav />
            <Link href="/">
              <Image
                src="/assets/logo.png"
                alt="logo"
                width={300}
                height={40}
                className="!w-[auto] !h-[26px] md:!h-[28px] md:lg:!h-[30px]"
              />
            </Link>
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
        <div className="flex items-center mr-1.5 gap-5 md:gap-8 md:mr-12">
          <Navbar_Avatar />
          {/* <DropdownMenu onOpenChange={(open) => setLangOpen(open)}>
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
          </DropdownMenu> */}
          <Link href="/user/post/create">
            <Button className="relative ml-0 md:ml-8 px-2.5 md:px-4 py-0 h-[34.6px] md:h-auto md:py-2.5 bg-secondary rounded-sm justify-center items-center border-none hover-none drop-shadow-[2px_2px_0px_rgba(0,0,0,0.55))] text-zinc-100 text-xs md:text-base font-medium font-roboto leading-3 md:leading-normal tracking-tight">
              <span className="absolute top-[-12%] right-[-15%] text-white bg-primary border border-primary-dark text-xs px-1 py-0.5 rounded-sm">
                Free
              </span>
              Post Property
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
