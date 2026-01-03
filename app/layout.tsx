import type { Metadata } from 'next';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata: Metadata = {
  title: 'Elance Learning',
  icons: {
    icon: '/elance-logo.svg',
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <LayoutWrapper>{children}</LayoutWrapper>
    </body>
  </html>
);

export default RootLayout;
