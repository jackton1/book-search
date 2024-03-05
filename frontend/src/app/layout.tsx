import { auth } from "@/auth";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book Search",
  description: "Search for books and authors using the Google Books API",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
    <body className={`${inter.className} `}>
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        className: "text-sm text-black bg-white dark:bg-gray-900 dark:text-white p-4 border-2 border-gray-300 shadow-lg",
      }}
    />
    <SessionProvider session={session} basePath="/api/auth">
      <main className="flex-grow">
        {children}
      </main>
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2024 BookSphere
          </p>
        </div>
      </footer>
    </SessionProvider>
    </body>
    </html>
  );
}
