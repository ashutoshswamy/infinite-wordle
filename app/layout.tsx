import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Infinite Wordle",
  description: "Unlimited Wordle built with Next.js and Framer Motion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
