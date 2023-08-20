import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import Navbar from "@/components/Navbar";
import Provider from "@/components/util/Provider";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "TAMS BEAST",
  description: "The offical website of TAMS BEAST",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Navbar />
          <div className="w-max min-h-[85vh] mx-16 mt-8">{children}</div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
