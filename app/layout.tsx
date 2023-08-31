import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/components/util/Provider";

export const metadata = {
  title: "TAMS BEAST",
  description: "The offical website of TAMS BEAST",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Toaster />
          <Navbar />
          <div className="w-max min-h-[85vh] mx-16 mt-8">{children}</div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
