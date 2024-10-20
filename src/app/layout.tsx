import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col max-w-[1300px] mx-auto h-dvh pt-4">
        {children}
      </body>
    </html>
  );
}
