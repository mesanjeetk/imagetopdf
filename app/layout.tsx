import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Provider from "@/components/Provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Converter - Convert Images to PDF Effortlessly",
  description: "Upload, and convert your images into high-quality PDF documents in seconds.",
  keywords: ["PDF converter", "image to PDF", "online PDF tool", "Image tool", "convert to PDF"],
  authors: [{ name: "Sanjeet Kumar", url: "https://imagetopdf.vercel.app" }],
  creator: "Sanjeet Kumar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
