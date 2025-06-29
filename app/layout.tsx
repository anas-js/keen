import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import "./styles/globals.scss";
import { Providers } from "./providers";

import { Suspense } from "react";
import Loading from "./components/loading";




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
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>Keen | تابع اوزانك</title>
        <meta name="description" content="هل انت جالس تتطور عضلياً؟" />
        <meta property="og:title" content="Keen | تابع اوزانك" />
        <meta property="og:description" content="هل انت جالس تتطور عضلياً؟" />
        <meta property="og:url" content="https://keen.juzr.sa" />
        <meta property="og:site_name" content="Keen" />
        <meta property="og:image" content="https://keen.juzr.sa/images/og.png" />
        <meta property="og:image:width" content="1080" />
        <meta property="og:image:height" content="584" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/pwa/icon-192x192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/pwa/icon-512x512.png" sizes="512x512" type="image/png" />
        <link rel="apple-touch-icon" href="/pwa/icon-192x192.png" />
        <link rel="shortcut icon" href="/pwa/icon-192x192.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/pwa/icon-192x192.png" type="image/x-icon" sizes="16x16"></link>
      </head>
      <body>
       
       <Suspense fallback={<Loading full></Loading>}>
         <Providers>{children}</Providers>
       </Suspense>
      </body>
    </html>
  );
}
