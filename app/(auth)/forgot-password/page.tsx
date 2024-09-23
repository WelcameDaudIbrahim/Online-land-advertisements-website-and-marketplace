import ForgotPassword from "@/components/auth/ForgotPassword";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};
export default function page() {
  return <ForgotPassword />;
}
