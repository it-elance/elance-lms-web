import type { Metadata } from 'next';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Elance Learning',
  icons: {
    icon: '/elance-logo.svg',
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      (function () {
        try {
          const theme = localStorage.getItem('theme');
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

          if (theme === 'dark' || (!theme && isDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.style.colorScheme = 'dark';
          } else {
            document.documentElement.removeAttribute('data-theme');
            document.documentElement.style.colorScheme = 'light';
          }
        } catch (_) {}
      })();
    `,
          }}
        />
      </head>

      <body>
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
