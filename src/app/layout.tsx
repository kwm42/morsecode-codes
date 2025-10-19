import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./theme.css";
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
  metadataBase: new URL("https://morsecode.codes"),
  title: "Morse Code Online – Translate, Practice, and Play",
  description: "Learn, translate, and explore Morse code online.",
  keywords: [
    "morse code",
    "morse code translator",
    "morse code chart",
    "learn morse code",
    "morse code practice",
    "morse code audio",
    "morse code lessons",
    "在线摩斯密码",
    "摩斯密码翻译",
    "摩斯密码学习",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  console.log("Current locale:", locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
