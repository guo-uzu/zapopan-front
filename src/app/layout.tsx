import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const geistSans = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atención Ciudadana",
  description:
    "Una plataforma para el manejo de bitácora del equipo de Atención Ciudadana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>{children}</body>
    </html>
  );
}
