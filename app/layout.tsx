import type { Metadata } from "next";
import { Roboto, Quicksand } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-roboto antialiased",
          roboto.variable,
          quicksand.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
