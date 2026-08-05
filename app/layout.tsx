import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkedPaw — Professional Networking for the Animal Kingdom",
  description:
    "Where apex predators connect, humble-brag, and apply for positions they're wildly overqualified for.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f3f2ef]">
        <Navbar />
        {children}
        <footer className="mt-auto py-4 border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">🐾 LinkedPaw</span>
            <a href="/about" className="hover:underline hover:text-gray-800">About</a>
            <a href="#" className="hover:underline hover:text-gray-800">Accessibility</a>
            <a href="#" className="hover:underline hover:text-gray-800">Help Centre (Watering Hole)</a>
            <a href="#" className="hover:underline hover:text-gray-800">Privacy & Territory Terms</a>
            <a href="#" className="hover:underline hover:text-gray-800">Cookie Policy</a>
            <a href="#" className="hover:underline hover:text-gray-800">Advertise to Prey</a>
            <span className="ml-auto">LinkedPaw Corporation © 2025</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
