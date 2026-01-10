'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login' || pathname === '/';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen overflow-hidden bg-(--color-bg-primary)">
      <Header />
      <Sidebar />

      <main className="fixed top-16 md:top-20 left-0 lg:left-64 right-0 bottom-16 lg:bottom-0 overflow-y-auto px-3 pb-3">
        {children}
      </main>
    </div>
  );
};

export default LayoutWrapper;
