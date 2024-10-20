"use client"
import "./globals.css";
import Navbar from "@components/navbar";
import Particles from "@/components/ui/particles";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col max-w-[1300px] mx-auto h-dvh pt-4 relative">
      <Navbar />
        {children}
      <Particles
        className="fixed inset-0 -z-10"
        quantity={500}
        ease={100}
        color={"#000000"}
        refresh
      />
      </body>
    </html>
  );
}
