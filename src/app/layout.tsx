import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Archival OCR | Digitalisasi Arsip Cerdas",
  description: "Aplikasi MBKM untuk input dokumen fisik ke spreadsheet menggunakan AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${outfit.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <AuthProvider>
          <div className="animated-bg" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
