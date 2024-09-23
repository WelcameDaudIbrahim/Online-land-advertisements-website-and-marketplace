import React from "react";
import { Metadata } from "next";
import SignUp from "@/components/auth/SignUp";

export const metadata: Metadata = {
  title: "Sign Up",
};
export default function page() {
  return <SignUp />;
}
