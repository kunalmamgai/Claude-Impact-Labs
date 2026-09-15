import type { Metadata } from "next";
import { Noto_Sans_Devanagari, Newsreader } from "next/font/google";
import "./globals.css";

const bodyFont = Noto_Sans_Devanagari({ subsets: ["devanagari", "latin"], variable: "--font-body" });
const displayFont = Newsreader({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "BhashaHire — आवाज़ से अवसर तक",
  description: "अपनी भाषा में बोलकर नौकरी के लिए प्रोफ़ाइल, सही अवसर, रिज़्यूमे और इंटरव्यू की तैयारी पाएँ।",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
