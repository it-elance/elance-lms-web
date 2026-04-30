'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const MotionLink = motion.create(Link);

interface SidebarProps {
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  isLargeScreen: boolean;
}

const SPRING_CONFIG = { type: 'spring' as const, stiffness: 300, damping: 30 };

const SidebarIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
);

const Sidebar = ({ isLocked, setIsLocked, isLargeScreen }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      href: '/home',
      icon: '/home.svg',
      activeIcon: '/home-filled.svg',
    },
    {
      name: 'My Learning',
      href: '/learning',
      icon: '/school.svg',
      activeIcon: '/school-filled.svg',
    },
    {
      name: 'Favourites',
      href: '/favourites',
      icon: '/heart.svg',
      activeIcon: '/heart-filled.svg',
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: '/trend-up.svg',
      activeIcon: '/trend-up-home.svg',
    },
    {
      name: 'Account',
      href: '/account',
      icon: '/user.svg',
      activeIcon: '/user-filled.svg',
    },
  ];
  const mobileNavItems = navItems.filter((item) => item.name !== 'Analytics');

  const isExpanded = isLocked;
  const renderedNavItems = isLargeScreen ? navItems : mobileNavItems;

  return (
    <motion.aside
      initial={false}
      animate={
        isLargeScreen
          ? {
              width: isExpanded ? 256 : 80,
            }
          : {}
      }
      transition={SPRING_CONFIG}
      className="fixed bottom-0 left-0 right-0 w-auto lg:left-0 lg:right-auto lg:bottom-0 lg:w-20 h-16 bg-(--color-bg-primary) border-t-[1.5px] lg:border-t-0 lg:border-l-0 lg:border-b-0 lg:border-r-[1.5px] border-(--color-border-light) rounded-t-3xl lg:rounded-none flex flex-row lg:flex-col items-center lg:items-stretch justify-around lg:justify-start lg:py-6 z-40 lg:h-[calc(100vh-80px)] lg:fixed lg:top-20 overflow-hidden"
    >
      {/* Toggle Button */}
      <div className="hidden lg:flex items-center h-12 mb-2 relative w-full px-4">
        <motion.div
          animate={{
            x: isExpanded ? 184 : 0,
          }}
          transition={SPRING_CONFIG}
          className="flex items-center justify-center w-12"
        >
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              isLocked
                ? 'bg-(--color-bg-hover) text-(--color-primary-500)'
                : 'text-(--color-text-secondary) hover:bg-(--color-bg-tertiary) hover:text-(--color-text-primary)'
            }`}
            title={isExpanded ? 'Close sidebar' : 'Open sidebar'}
          >
            <SidebarIcon />
          </button>
        </motion.div>
      </div>

      <nav className="flex flex-row lg:flex-col w-full justify-around lg:justify-start lg:space-y-1 lg:px-3">
        {renderedNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/home' && pathname.startsWith(`${item.href}/`));

          return (
            <MotionLink
              key={item.name}
              href={item.href}
              className={`group relative flex flex-col lg:flex-row items-center lg:justify-start gap-1 lg:gap-3 p-2 lg:px-4 lg:py-3 rounded-xl text-[10px] lg:text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'text-(--color-primary-500) lg:bg-(--color-bg-hover)'
                  : 'text-(--color-text-secondary) hover:text-(--color-primary-500)'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <SvgIcon
                  src={isActive ? item.activeIcon : item.icon}
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isActive
                      ? 'bg-(--color-primary-500)'
                      : 'bg-(--color-text-secondary) group-hover:bg-(--color-primary-500)'
                  }`}
                />
              </div>

              <AnimatePresence mode="popLayout">
                {(isExpanded || !isLargeScreen) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </MotionLink>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;

const SvgIcon = ({
  src,
  className = '',
}: {
  src: string;
  className?: string;
}) => (
  <div
    className={className}
    style={{
      maskImage: `url(${src})`,
      WebkitMaskImage: `url(${src})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
    }}
  />
);
