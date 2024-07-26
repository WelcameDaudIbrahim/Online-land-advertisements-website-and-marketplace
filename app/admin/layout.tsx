"use client";
import Sidebar from "@/components/admin/layout/Sidebar";
import Navbar from "@/components/admin/layout/Navbar";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <div className="w-full flex flex-col">
        <Navbar sidebarToggle={toggle} />
        <div className="w-full flex">
          <Sidebar isSidebarOpen={isSidebarOpen} />
          <div className="bg-accent w-full">{children}</div>
        </div>
      </div>
    </>
  );
}
