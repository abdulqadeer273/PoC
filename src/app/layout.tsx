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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setActive(pathname);
    setOpen(false); // close sidebar on route change (mobile)
  }, [pathname]);

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded shadow"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <aside
        className={`bg-blue-900 text-blue-50 fixed md:static top-0 left-0 h-full z-40 w-64 min-h-screen flex flex-col py-6 px-3 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={{ maxWidth: "100vw" }}
      >
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
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
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
          <main className="flex-1 bg-gray-900 text-white p-2 md:p-6 overflow-auto min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
