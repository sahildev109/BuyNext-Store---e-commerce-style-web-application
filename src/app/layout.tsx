import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce App',
  description: 'A modern e-commerce application built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center px-4">
              <h1 className="text-3xl font-extrabold font-mono">Buy<span className="text-black">Next</span> Store</h1>
             
<div className="space-x-4">
  <a href="/" className="hover:text-blue-200">Home</a>
  <a href="/recommendations" className="hover:text-blue-200">Recommendations</a>
  <a href="/dashboard" className="hover:text-blue-200">Dashboard</a>
  <a href="/admin" className="hover:text-blue-200">Admin</a>
</div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}