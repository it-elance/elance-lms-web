'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isLocked, setIsLocked] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const isLoginPage = pathname === '/login' || pathname === '/';

  if (isLoginPage) {
    return <>{children}</>;
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
