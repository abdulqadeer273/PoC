"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sidebarLinks = [
  { href: "/", label: "Flow Editor" },
  { href: "/survey", label: "Survey Form" },
  { href: "/partial_surveys", label: "Partial Surveys" },
  { href: "/completed_surveys", label: "Completed Surveys" },
  { href: "/n8n", label: "n8n Workflows" },
];

function Sidebar() {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <aside className="bg-blue-900 text-blue-50 w-56 min-h-screen flex flex-col py-6 px-3">
      <div className="text-2xl font-bold mb-8 text-center tracking-tight">
        Dashboard
      </div>
      <nav className="flex flex-col gap-2">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded px-3 py-2 font-medium transition ${
              active === link.href
                ? "bg-blue-700 text-white"
                : "hover:bg-blue-800 hover:text-white text-blue-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex-1" />
      <div className="text-xs text-blue-200 text-center mt-8 opacity-70">
        &copy; {new Date().getFullYear()} Survey Workflow Builder
      </div>
    </aside>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-gray-900 text-white p-6 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
