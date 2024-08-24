"use client";
import React from "react";

export default function page() {
  if (typeof window !== "undefined") {
    window.location.replace("/");
  }
  return <div>page</div>;
}
