import { IconType } from "react-icons";

export interface Link {
  name: string;
  href: string;
}

export type Links = Link[];

export interface sidebarLink {
  name: string;
  href?: string;
  path?: string;
  icon: IconType;
  sub_links?: Links;
}
