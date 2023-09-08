import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/components/util/Provider";
import Head from "next/head";

export const metadata = {
  title: "TAMS BEAST",
  description: "The offical website of TAMS BEAST",
  manifest: "../manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        {" "}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body className={inter.className}>
        <Provider>
          <Toaster />
          <div className="max-w-full">
            <Navbar />
          </div>
          <div className="max-w-full min-h-[85vh] mx-10 mt-8 sm:mx-16">
            {children}
          </div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
