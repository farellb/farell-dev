import type { Metadata } from "next";
import { Barlow_Condensed, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { getMenuData } from "@/lib/get-menu";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Farell Brooklyn",
  description: "Detalları gör, fərqi hiss et - Farell Brooklyn",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuData = await getMenuData();

  return (
    <html lang="en">
      <body
        className={`${barlowCondensed.variable} ${barlowCondensed.className} ${geistMono.variable} antialiased`}
      >
        <Header menuData={menuData} />
        {children}
      </body>
    </html>
  );
}
