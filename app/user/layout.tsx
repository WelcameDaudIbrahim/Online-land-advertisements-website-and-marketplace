import Navbar from "@/components/Layout/Navbar";
import { Sidebar } from "@/components/user/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="w-full flex mt-14">
        <Sidebar />
        <div className="flex-grow px-3.5 py-1">{children}</div>
      </main>
    </>
  );
}
