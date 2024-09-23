import React from "react";
import ContactUs from "@/components/ContactUs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
};
export default function page() {
  return <ContactUs />;
}
