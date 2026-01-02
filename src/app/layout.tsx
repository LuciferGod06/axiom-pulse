import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "AXIOM Pulse | Real-time Token Trading Dashboard",
  description: "Monitor new token pairs, track migrations, and trade on Solana with real-time data.",
  keywords: ["solana", "trading", "tokens", "defi", "crypto", "pulse"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0d1117] text-[#e6edf3]`}
      >
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#161b22',
              border: '1px solid #30363d',
              color: '#e6edf3',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
