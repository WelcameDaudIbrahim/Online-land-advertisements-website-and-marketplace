import Sidebar from "@/components/admin/layout/Sidebar";
import Navbar from "@/components/admin/layout/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="w-full flex">
          <Sidebar />
          <div className="bg-accent w-full">{children}</div>
        </div>
      </div>
    </>
  );
}
