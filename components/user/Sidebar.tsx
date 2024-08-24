"use client";
import { CircleUser, Settings, SlidersVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsFillFilePostFill } from "react-icons/bs";
import { MdOutlineCreate } from "react-icons/md";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { TbMenuDeep } from "react-icons/tb";

const links = [
  {
    title: "My Account",
    icon: CircleUser,
    href: "/accounts",
  },
  {
    title: "My Posts",
    icon: BsFillFilePostFill,
    href: "/my-posts",
  },
  {
    title: "Create Post",
    icon: MdOutlineCreate,
    href: "/post/create",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Advanced",
    icon: SlidersVertical,
    href: "/advanced",
  },
];

export function Sidebar() {
  return (
    <>
      <SidebarMenu className="hidden md:flex" />
      <div className="w-full z-10` absolute flex md:hidden items-center justify-end pr-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"outline"}>
              <TbMenuDeep className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="px-0">
            <SheetHeader>
              <SheetTitle className="px-6">
                <Image
                  src="/assets/logo.png"
                  alt="logo"
                  width={300}
                  height={40}
                  className="!w-[auto] !h-[26px] md:!h-[28px] md:lg:!h-[30px]"
                />
              </SheetTitle>
              <SheetDescription className="px-4">
                <SidebarMenu />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export function SidebarMenu({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "max-w-sm flex flex-grow w-full flex-col md:px-12 gap-4 py-4",
        className
      )}
    >
      <div className="grid gap-1.5 px-2">
        {links.map((link, index) => (
          <Link
            href={"/user" + link.href}
            key={index}
            className="w-full contents"
          >
            <Button
              className={`justify-start bg-transparent text-black hover:text-white ${
                pathname === "/user" + link.href && "text-white bg-primary"
              }`}
            >
              <link.icon className="mr-2 size-5" />
              {link.title}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
