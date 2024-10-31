"use client"
import "./globals.css";
import Navbar from "@components/navbar";
import FlickeringGrid from "@/components/ui/flickering-grid";
import Particles from "@/components/ui/particles";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col max-w-[80vw] mx-auto h-dvh pt-4 relative">
      <Navbar />
        {children}
        <FlickeringGrid
        className="-z-10 fixed inset-0 w-full h-full"
        squareSize={4}
        gridGap={6}
        color="#60A5FA"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={window.innerHeight}
        width={window.innerWidth}
      />
      {/* <Particles
        className="fixed inset-0 -z-10"
        quantity={600}
        ease={80}
        color={"#000000"}
        refresh
      /> */}
      </body>
    </html>
  );
}
