import { Links, sidebarLink } from "@/types/types";
import { FaHome, FaUsers } from "react-icons/fa";

export const sidebar_links: sidebarLink[] = [
  {
    name: "Home",
    href: "/admin/dashboard",
    icon: FaHome,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: FaUsers,
    sub_links: [
      { name: "All Users", href: "/admin/users/all" },
      { name: "Add User", href: "/admin/users/add" },
    ],
  },
];
