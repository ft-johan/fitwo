import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavigationDock } from "@/components/navigation-dock";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fitwo - Fitness Tracker",
  description: "Track your fitness journey",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <main className="min-h-screen pb-20"> {/* Add bottom padding for dock */}
          {children}
        </main>
        <NavigationDock />
      </body>
    </html>
  );
}
