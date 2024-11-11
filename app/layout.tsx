import type { Metadata } from "next";
import { Inter} from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interactive Data Visualization Dashboard",
  description: "A dashboard that allows users to visualize and analyze data in real-time. Built with Next.js, TypeScript, Tailwind CSS, Shadcn, Google sheet and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
