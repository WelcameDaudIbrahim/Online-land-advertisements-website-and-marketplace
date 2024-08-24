import type { Metadata } from "next";
import { Roboto, Quicksand } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Deployment from "./deployment";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Home - BdLord",
  description: "Created By BdLord",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-roboto antialiased",
            roboto.variable,
            quicksand.variable
          )}
        >
          {children}
          {process.env.NODE_ENV === "production" && <Deployment />}
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
