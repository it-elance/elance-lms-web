'use client';

import { Search, ChevronLeft, X, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import Image from 'next/image';
import Link from 'next/link';
import NotificationPanel from './Notification';
import { useNotifications } from '@/hooks/useNotifications';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const { notifications } = useNotifications();

  const unreadCount = notifications.filter((n) => n.status).length;

  const router = useRouter();

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = () => (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Topics Section */}
      <div>
        <h3 className="Body-Extra-Small text-(--color-text-tertiary) mb-3">
          Topics
        </h3>

        <div className="flex flex-col">
          {[
            {
              title: 'Types of organizations',
              time: '9:47 min',
              icon: (
                <div className="w-6 h-6 rounded-full bg-(--color-success-600) flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ),
            },
            {
              title: 'Stakeholders',
              time: '9:47 min',
              icon: (
                <div className="w-6 h-6 rounded-full bg-(--color-info-600) border-2 border-(--color-info-500) relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-(--color-bg-primary) w-3.5 h-full left-[50%]"></div>
                </div>
              ),
            },
            {
              title: 'Business environment',
              time: '9:47 min',
              icon: (
                <div className="w-6 h-6 rounded-full border-2 border-(--color-border-light) shrink-0"></div>
              ),
            },
          ].map((topic, index) => (
            <motion.div
              key={index}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-(--color-bg-tertiary) transition-colors ${
                index !== 2 ? 'border-b border-(--color-border-light) mb-2' : ''
              }`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div>
                <div className="Body-Small text-(--color-text-primary)">
                  {topic.title}
                </div>

                <div className="Caption-Small text-(--color-text-tertiary) mt-0.5">
                  {topic.time}
                </div>
              </div>

              <div>{topic.icon}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <motion.header
        className="h-16 md:h-20 w-full bg-(--color-bg-primary) border-b-[1.5px] border-(--color-border) px-4 md:px-6 flex items-center justify-between fixed top-0 left-0 z-50"
        animate={{ y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-3 cursor-pointer">
          <motion.div whileHover={{ scale: 1.01 }}>
            <Image
              src={
                resolvedTheme === 'dark' ? '/elance-dark.svg' : '/elance.svg'
              }
              alt="Elance Logo"
              width={140}
              height={40}
              className="w-28 md:w-36 h-auto"
            />
          </motion.div>
        </Link>

        {/* Search */}
        <div
          className="flex-1 max-w-xl mx-6 hidden lg:block"
          ref={searchContainerRef}
        >
          <div className="relative">
            <motion.div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-text-primary)" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-11 pr-10 py-2 bg-(--color-bg-secondary) border border-(--color-border-medium) focus:border-(--color-border-medium) rounded-full outline-none text-sm text-(--color-text-primary) placeholder:text-(--color-text-disabled)"
              />

              {searchQuery && (
                <motion.button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-secondary) p-1 rounded-full transition-colors cursor-pointer"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 1.1 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>

            {/* Desktop Search Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  className="absolute top-full left-0 w-full bg-(--color-bg-secondary) border border-(--color-border-medium) rounded-2xl mt-2 p-4 z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {searchResults()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-3">
          <motion.button
            className="Button-small bg-(--color-bg-pressed) text-(--color-primary-500) rounded-full px-3 py-1.5 md:px-4 md:py-2 cursor-pointer whitespace-nowrap text-xs md:text-sm"
            onClick={() => router.push('/course')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            Switch Course
          </motion.button>

          <motion.button
            className="p-1 md:p-2 lg:hidden text-(--color-text-secondary) hover:bg-(--color-bg-tertiary) rounded-full transition-colors relative cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>

          <motion.button
            className="p-1 md:p-2 text-(--color-text-secondary) rounded-full transition-colors relative cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsNotificationOpen(true)}
          >
            <Image
              src={
                resolvedTheme === 'dark'
                  ? '/notification-dark.svg'
                  : '/notification.svg'
              }
              alt="Notification"
              width={24}
              height={24}
              className="w-5 h-5 md:w-6 md:h-6"
            />

            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 md:top-2 md:right-2 w-2 h-2 md:w-2.5 md:h-2.5 bg-(--color-primary-500) rounded-full border-2 border-(--color-bg-primary)" />
            )}
          </motion.button>
        </div>
      </motion.header>

      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 bg-(--color-bg-primary) z-60 flex flex-col p-4 lg:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            <h1 className="Heading-3 font-bold text-(--color-text-primary) mb-3">
              Search
            </h1>

            <motion.div
              className="flex items-center gap-2 mb-6"
              transition={{ delay: 0.15 }}
            >
              <motion.button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 -ml-1 text-(--color-text-primary)"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <div className="relative flex-1">
                <motion.div>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-text-primary)" />
                  <input
                    type="text"
                    placeholder="Search"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-10 py-2.5 bg-(--color-bg-secondary) border border-(--color-border-medium) focus:border-(--color-border-medium) rounded-full outline-none text-sm text-(--color-text-primary) placeholder:text-(--color-text-disabled) transition-all"
                  />

                  {searchQuery && (
                    <motion.button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-secondary) p-1 hover:bg-(--color-bg-tertiary) rounded-full transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 1.1 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {searchResults()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
