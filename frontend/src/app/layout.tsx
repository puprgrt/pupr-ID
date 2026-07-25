import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PUPR ID - Single Sign On",
  description: "Platform Identitas Digital Terpadu DPUPR Kabupaten Garut",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${poppins.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}
