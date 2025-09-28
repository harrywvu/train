import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "TRAIN - Transparent AI Network",
  description: "A blockchain-based platform for transparent AI data sharing and verification",
  icons: {
    icon: '/logo/new logo png.png',
    shortcut: '/logo/new logo png.png',
    apple: '/logo/new logo png.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-proxima antialiased`}
        style={{ fontFamily: 'ProximaNova, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
