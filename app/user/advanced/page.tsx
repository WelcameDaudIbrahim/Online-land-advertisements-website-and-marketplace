import Advanced from "@/components/user/Advanced";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advanced",
};
export default function Page() {
  return (
    <div>
      <h1 className="text-black font-roboto text-3xl mb-3 font-medium tracking-wide">
        Advanced Settings
      </h1>
      <Advanced />
    </div>
  );
}
