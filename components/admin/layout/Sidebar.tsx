"use client";
import { sidebar_links } from "@/data/admin/layout";
import { sidebarLink } from "@/types/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export function SidebarLinks({ link }: { link: sidebarLink }) {
  const pathname = usePathname();
  const isActive: boolean = false;
  // const isActive: boolean = pathname.includes(link.href || link.path || "");
  // console.log(link.href);
  // console.log(link.path || "");
  const [isOpen, setIsOpen] = useState(isActive || false);

  return (
    <>
      <Link
        className={`flex items-center px-3.5 py-2 font-roboto text-black text-base hover:bg-gradient-to-br hover:from-primary hover:to-emerald-800 hover:text-white hover:rounded-sm hover:tracking-wider${
          isActive ??
          "bg-gradient-to-br from-primary to-emerald-800 text-white rounded-sm tracking-wider"
        }`}
        href={link.href || "?"}
        onClick={() => setIsOpen(!isOpen)}
      >
        <link.icon className="size-5 mr-2" />
        {link.name}
        {link.sub_links?.length ? (
          <ChevronDown
            className={`size-5 ml-auto -rotate-90 delay-200 transition-all ${
              isOpen ? "rotate-0" : ""
            }`}
          />
        ) : null}
      </Link>
      {link.sub_links?.length ? (
        <ul
          className={`mb-1 mt-0.5 ml-3 l ${
            !isOpen ? "m-0 overflow-hidden absolute w-0" : ""
          }`}
        >
          {link.sub_links.map((sub_link, i) => (
            <li className="px-3 py-1.5" key={i}>
              <Link
                className="font-roboto text-black text-base hover:text-primary"
                href={sub_link.href}
              >
                {sub_link.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
export default function Sidebar() {
  return (
    <div className="w-full max-w-[300px] h-[90vh] bg-white py-6 px-4">
      <ul className="flex flex-col">
        {sidebar_links.map((link, i) => (
          <li className="px-1.5" key={i}>
            <SidebarLinks link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
}
