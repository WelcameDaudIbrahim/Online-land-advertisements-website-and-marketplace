import Navbar from "@/components/Layout/Navbar";
import { Sidebar } from "@/components/user/Sidebar";
import Verification from "./_components/Verification";

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
        <div className="flex w-full flex-col h-[100vh] items-start">
          <Verification />
          <div className="flex-grow w-full px-3.5 py-1">{children}</div>
        </div>
      </main>
    </>
  );
}
