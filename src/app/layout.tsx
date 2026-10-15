import type { Metadata } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";
import { GsapProvider } from "@/providers/GsapProvider";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import "./globals.css";
import Navbar from "@/components/navbar";
import TopBar from "@/components/top-bar";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synchroma",
  description: "Tech electronics ecommerce store",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScrollProvider>
          <GsapProvider>
            <TopBar/>
            <Navbar/>
            {children}


          </GsapProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
