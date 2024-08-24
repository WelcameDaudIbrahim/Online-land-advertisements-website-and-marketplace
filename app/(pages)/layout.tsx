import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">{children}</main>
      <Footer />
    </>
  );
}
