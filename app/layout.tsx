"use client";

import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { useGlobalStore } from "@/store/globalStore";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { gs } = useGlobalStore();
  return (
    <html lang="en">
      <body className="flex h-screen flex-col">
        <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
        <header className="flex space-x-5 border-b-2 p-3">
          <h1 className="text-2xl font-bold">Kilátók Magyarországon</h1>
          <Link className="text-2xl hover:underline" href="/">
            Nyitólap
          </Link>
          <Link className="text-2xl hover:underline" href="/rating">
            Értékelés
          </Link>
          <Link className="text-2xl hover:underline" href="/pagination">
            Lapozás
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-200">{children}</main>
        <footer className="flex h-12 shrink-0 items-center justify-around text-2xl border-t-2">
          <p>Rekordok száma: {gs.numberOfRecords}</p>
          <p>Oldal: {gs.actualPage}. / {gs.numberOfPages}</p>
        </footer>
      </body>
    </html>
  );
}
