import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientShell } from "@/components/layout/ClientShell";
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
  title: "청렴 바이브",
  description:
    "내부 직원용 청렴 인식 · 공공기관 청렴도 평가 관점의 가벼운 체크와 퀴즈",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 via-sky-50/80 to-white text-slate-800">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
