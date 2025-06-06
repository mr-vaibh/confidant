import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";

import Navbar from "@/components/custom/Navbar/Navbar";
import Footer from "@/components/custom/Home/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Confidant",
  description: "simplified solution designed to manage your variables, API keys, and database connections. Secure. Effortless. Expandable.",
};

export default function RootLayout({
  children,
  login,
  signup,
}: Readonly<{
  children: React.ReactNode
  login: React.ReactNode
  signup: React.ReactNode
}>) {
  return (
    <React.StrictMode>
      <html lang="en">
        <body className={inter.className}>
          <Toaster position="top-right" />
          <main className="flex flex-col items-center justify-between p-2 sm:p-6 bg-smoky_black-300">
            <Navbar />
            {children}
            {login}
            {signup}
            <Footer />
          </main>
        </body>
      </html>
    </React.StrictMode>
  );
}
