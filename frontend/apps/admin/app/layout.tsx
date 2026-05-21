import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import '../styles/admin.css';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400','600','700','800'] });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['300','400','500','600'] });

export const metadata: Metadata = {
  title: { default: 'Admin Dashboard | Softmaster', template: '%s | Admin - Softmaster' },
  description: 'Softmaster Technology Solutions - Admin Control Panel',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} font-sans bg-gray-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
