import { FcStatistics } from "react-icons/fc";
import { sidebarLink } from "@/types/types";
import { FaHome, FaUsers } from "react-icons/fa";
import { FaSignsPost } from "react-icons/fa6";
import { TbGitBranchDeleted } from "react-icons/tb";

export const sidebar_links: sidebarLink[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: FaHome,
  },
  {
    name: "Posts",
    path: "/admin/posts",
    icon: FaSignsPost,
    sub_links: [
      { name: "All Posts", href: "/admin/posts/all" },
      { name: "Create Post", href: "/admin/posts/create" },
    ],
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: FaUsers,
    sub_links: [
      { name: "All Users", href: "/admin/users/all" },
      { name: "Create User", href: "/admin/users/create" },
    ],
  },
  {
    name: "Deleted Posts",
    href: "/admin/posts/all?trash=true",
    icon: TbGitBranchDeleted,
  },
  {
    name: "Visitor Statistics",
    href: "/admin/statistics/visitor",
    icon: FcStatistics,
  },
  // {
  //   name: "Users",
  //   path: "/admin/users",
  //   icon: FaUsers,
  //   sub_links: [
  //     { name: "All Users", href: "/admin/users/all" },
  //     { name: "Crea te User", href: "/admin/users/Crea te" },
  //   ],
  // },
];
