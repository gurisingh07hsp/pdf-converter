import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDFTouch - Precision PDF Tools",
  description: "Compress, convert, merge, and edit your documents with industrial-grade reliability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} min-h-full flex flex-col font-jakarta`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
