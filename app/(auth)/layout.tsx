import { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "BdLord", template: "%s - BdLord" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
