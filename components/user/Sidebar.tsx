"use client";
import { CircleUser, Settings, SlidersVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsFillFilePostFill } from "react-icons/bs";
import { MdOutlineCreate } from "react-icons/md";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

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
  return (
    <div className="max-w-sm flex flex-grow w-full flex-col px-12 gap-4 py-4">
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
