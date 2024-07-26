"use client";
import { sidebar_links } from "@/data/admin/layout";
import { sidebarLink } from "@/types/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function SidebarLinks({
  link,
  isSidebarOpen,
}: {
  link: sidebarLink;
  isSidebarOpen: boolean;
}) {
  const pathname = usePathname();
  const isActive: boolean = pathname.includes(link.href || link.path || "");

  const [isOpen, setIsOpen] = useState(isActive || false);

  return (
    <>
      <Link
        className={`flex items-center px-3.5 py-2 mt-px font-roboto text-gray-600 text-base hover:bg-gradient-to-br hover:from-primary hover:to-emerald-800 hover:text-white hover:rounded-sm hover:tracking-wider ${
          isActive
            ? "bg-gradient-to-br from-primary to-emerald-800 !text-white rounded-sm tracking-wider"
            : ""
        } ${!isSidebarOpen ? "!px-2 group-hover:!px-3.5" : ""}`}
        href={link.href || "?"}
        onClick={() => setIsOpen(!isOpen)}
      >
        <link.icon
          className={`size-5 mr-3.5 ${
            !isSidebarOpen ? "!m-0 group-hover:!mr-3.5" : ""
          }`}
        />
        <span className={!isSidebarOpen ? "hidden group-hover:block" : ""}>
          {link.name}
        </span>
        {link.sub_links?.length ? (
          <ChevronDown
            className={`size-5 ml-auto -rotate-90 transition-all ${
              isOpen ? "rotate-0" : ""
            } ${!isSidebarOpen ? "hidden group-hover:block" : ""}`}
          />
        ) : null}
      </Link>
      {link.sub_links?.length ? (
        <ul
          className={`mb-1 mt-0.5 ml-3 transition-all ${
            !isOpen ? "m-0 overflow-hidden absolute w-0 " : ""
          } ${!isSidebarOpen ? "hidden group-hover:block" : ""}`}
        >
          {link.sub_links.map((sub_link, i) => (
            <li className="px-3 py-1.5" key={i}>
              <Link
                className={`font-roboto text-black text-base hover:text-primary inline-block w-full ${
                  pathname === sub_link.href
                    ? "text-primary font-medium tracking-wide"
                    : ""
                }`}
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
export default function Sidebar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  return (
    <div
      className={`w-full max-w-[300px] h-[90vh] bg-white py-6 px-4 group transition-width ${
        !isSidebarOpen ? "!px-2 !max-w-16 hover:!max-w-[300px]" : ""
      }`}
    >
      <ul className="flex flex-col">
        {sidebar_links.map((link, i) => (
          <li className="px-1.5" key={i}>
            <SidebarLinks link={link} isSidebarOpen={isSidebarOpen} />
          </li>
        ))}
      </ul>
    </div>
  );
}
