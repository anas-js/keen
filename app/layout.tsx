import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import "./styles/globals.scss";
import {Providers} from "./providers";
import { Suspense } from "react";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Keen | تابع اوزانك",
  description: "هل انت جالس تتطور عضلياً؟",
  openGraph: {
    title: "Keen | تابع اوزانك",
    description: "هل انت جالس تتطور عضلياً؟",
    url: "https://keen.juzr.sa",
    siteName: "Keen",
    images: [
      {
        url: "https://keen.juzr.sa/images/og.png",
        width: 1080,
        height: 584,
      },
    ],
        type: "website",
  },
  icons: {
    icon: [
      { url: "/pwa/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/pwa/icon-192x192.png",
    shortcut: "/pwa/icon-192x192.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">

      <body>
        <Suspense>
           <Providers>
          {children}
        </Providers>
        </Suspense>
      </body>
    </html>
  );
}
