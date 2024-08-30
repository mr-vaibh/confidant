import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/custom/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Confidant",
  description: "simplified solution designed to manage your variables, API keys, and database connections. Secure. Effortless. Expandable.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col items-center justify-between p-2 sm:p-6 bg-smoky_black-300">
            <Navbar />
            {children}
            {modal}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
