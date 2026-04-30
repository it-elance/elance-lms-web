'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const isLoginPage = pathname === '/' || pathname === '/login';

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('accessToken');
      const hasToken = Boolean(token);

      setIsAuthenticated(hasToken);
      setIsAuthReady(true);

      if (!hasToken && !isLoginPage) {
        router.replace('/');
        return;
      }

      if (hasToken && isLoginPage) {
        router.replace('/home');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isLoginPage, pathname, router]);

  if (!isAuthReady) {
    return null;
  }

  if (isLoginPage) {
    if (isAuthenticated) {
      return null;
    }

    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const isExpanded = isLocked;

  return (
    <div className="h-screen overflow-hidden bg-(--color-bg-primary)">
      <Header />
      <Sidebar
        isLocked={isLocked}
        setIsLocked={setIsLocked}
        isLargeScreen={isLargeScreen}
      />

      <motion.main
        initial={false}
        animate={
          isLargeScreen
            ? {
                left: isExpanded ? 256 : 80,
              }
            : {}
        }
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-16 md:top-20 left-0 lg:left-20 right-0 bottom-20 lg:bottom-0 overflow-y-auto overflow-x-hidden px-3 pb-3"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default LayoutWrapper;
