import React from "react";
import LogIn from "@/components/auth/LogIn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
};
export default function page() {
  return <LogIn />;
}
