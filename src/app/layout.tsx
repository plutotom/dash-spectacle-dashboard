import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { KIOSK_DIAGNOSTICS_SCRIPT } from "@/lib/kiosk-diagnostics";

import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dash Spectacle",
  description: "A modern dashboard application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <head>
          {/* No extra download: diagnostics still run when an app chunk cannot load. */}
          <script dangerouslySetInnerHTML={{ __html: KIOSK_DIAGNOSTICS_SCRIPT }} />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <noscript>
            <p style={{ padding: 32, fontSize: 28, background: "#211710", color: "#fff7ed" }}>
              Dashboard cannot start: JavaScript is disabled in this browser.
            </p>
          </noscript>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
