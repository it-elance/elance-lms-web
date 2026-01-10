'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const MotionLink = motion.create(Link);

const Sidebar = () => {
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

  return (
    <aside className="fixed bottom-0 left-0 w-full h-16 bg-(--color-bg-primary) border-t-[1.5px] lg:border-t-0 lg:border-r-[1.5px] border-(--color-border-light) flex flex-row lg:flex-col items-center lg:items-stretch justify-around lg:justify-start lg:py-6 z-40 lg:w-64 lg:h-[calc(100vh-80px)] lg:fixed lg:top-20">
      <nav className="flex flex-row lg:flex-col w-full justify-around lg:justify-start lg:space-y-1 lg:px-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/home' && pathname.startsWith(`${item.href}/`));

          return (
            <MotionLink
              key={item.name}
              href={item.href}
              className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-3 p-2 lg:px-4 lg:py-3 rounded-lg text-[10px] lg:text-sm font-medium ${
                isActive
                  ? 'text-(--color-primary-500)'
                  : 'text-(--color-text-primary)'
              }`}
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <SvgIcon
                src={isActive ? item.activeIcon : item.icon}
                className={`w-6 h-6 Button-Primary ${
                  isActive
                    ? 'bg-(--color-primary-500)'
                    : 'bg-(--color-text-primary)'
                }`}
              />
              <span className="lg:inline">{item.name}</span>
            </MotionLink>
          );
        })}
      </nav>
    </aside>
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
