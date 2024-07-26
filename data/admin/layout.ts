import { Links, sidebarLink } from "@/types/types";
import { FaHome, FaUsers } from "react-icons/fa";
import { FaSignsPost } from "react-icons/fa6";

export const sidebar_links: sidebarLink[] = [
  {
    name: "Home",
    href: "/admin/dashboard",
    icon: FaHome,
  },
  {
    name: "Posts",
    path: "/admin/posts",
    icon: FaSignsPost,
    sub_links: [
      { name: "All Posts", href: "/admin/posts/all" },
      { name: "Add Post", href: "/admin/posts/add" },
    ],
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
  // {
  //   name: "Users",
  //   path: "/admin/users",
  //   icon: FaUsers,
  //   sub_links: [
  //     { name: "All Users", href: "/admin/users/all" },
  //     { name: "Add User", href: "/admin/users/add" },
  //   ],
  // },
];
