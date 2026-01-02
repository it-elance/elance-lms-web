import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Elance Learning',
  icons: {
    icon: '/elance-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
