import Settings from "@/components/user/Settings";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};
export default function page() {
  return <Settings />;
}
