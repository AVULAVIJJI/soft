import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400','600','700','800'] });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['300','400','500','600'] });

export const metadata: Metadata = {
  title: { default: 'Softmaster Technology Solutions Pvt Ltd', template: '%s | Softmaster' },
  description: '24+ years of trusted software solutions. 1700+ clients across India. Custom software, ERP, mobile apps, web design and more.',
  keywords: ['Softmaster', 'software development', 'ERP', 'POS', 'web design', 'Hyderabad', 'Hyderabad', 'hospital management', 'school management'],
  authors: [{ name: 'Softmaster Technology Solutions Pvt Ltd' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://softmastertech.com',
    siteName: 'Softmaster Technology Solutions',
    title: 'Softmaster Technology Solutions Pvt Ltd',
    description: '24+ years of trusted software solutions in Hyderabad, India',
  },
  twitter: { card: 'summary_large_image', title: 'Softmaster Technology Solutions', description: '24+ years of trusted software solutions' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://softmastertech.com" />
      </head>
      <body className={`${syne.variable} ${dmSans.variable} font-sans bg-dark text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}

