import type { Metadata } from "next";
import "./globals.css";
import { Inter, Phudu } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster as Toast } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import QueryProvider from "@/context/query-provider";

const phudu = Phudu({
  variable: "--font-phudu",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-interdisplay",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KipVault — Secure IPFS File Vault",
  description:
    "Lock it, pin it, keep it. KipVault is the editorial-grade cloud vault for encrypted, IPFS-backed file storage and permissioned sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased bg-paper text-ink font-sans",
          phudu.variable,
          inter.variable
        )}
      >
        <QueryProvider>
          {children}
          <Toast />
          <Sonner />
        </QueryProvider>
      </body>
    </html>
  );
}
