'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    title: 'Course content has been refreshed with the latest exam pattern.',
    time: '32 min ago',
    type: 'academics',
    icon: '/school-noti.svg',
    date: 'Today',
  },
  {
    id: 2,
    title: 'Course content has been refreshed with the latest exam pattern.',
    time: '32 min ago',
    type: 'general',
    icon: '/mail-noti.svg',
    date: 'Today',
  },
  {
    id: 3,
    title: 'Course content has been refreshed with the latest exam pattern.',
    time: '32 min ago',
    type: 'academics',
    icon: '/bank-noti.svg',
    date: 'Today',
  },
  {
    id: 4,
    title: 'Course content has been refreshed with the latest exam pattern.',
    time: '32 min ago',
    type: 'academics',
    icon: '/book-noti.svg',
    date: 'Yesterday',
  },
  {
    id: 5,
    title: 'Course content has been refreshed with the latest exam pattern.',
    time: '32 min ago',
    type: 'general',
    icon: '/wallet-noti.svg',
    date: 'Yesterday',
  },
  {
    id: 6,
    title: 'Course content has been refreshed with the latest exam pattern.',
    time: '32 min ago',
    type: 'general',
    icon: '/announce-noti.svg',
    date: 'Yesterday',
  },
];

const Notification = ({ isOpen, onClose }: NotificationProps) => {
  const [activeFilter, setActiveFilter] = useState('All');

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
        backgroundColor: 'currentColor',
      }}
    />
  );

  const filters = [
    {
      name: 'All',
      icon: (props: { className?: string }) => (
        <SvgIcon src="/filter.svg" {...props} />
      ),
    },
    {
      name: 'Academics',
      icon: (props: { className?: string }) => (
        <SvgIcon src="/school.svg" {...props} />
      ),
    },
    {
      name: 'General',
      icon: (props: { className?: string }) => (
        <SvgIcon src="/mail.svg" {...props} />
      ),
    },
  ];

  // Prevent body scroll when notification is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="notification-backdrop"
            className="fixed inset-0 z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="notification-drawer"
            className="fixed top-16 md:top-22 right-0 md:right-4 h-[calc(100vh-64px)] md:h-150 w-full md:w-100 bg-(--color-bg-primary) z-70 md:rounded-xl flex flex-col border-l md:border border-(--color-border-light) overflow-hidden"
            initial={{ x: '100%' }}
            animate={{
              x: 0,
              transition: {
                type: 'spring',
                damping: 30,
                stiffness: 300,
                mass: 0.8,
              },
            }}
            exit={{
              x: '100%',
              transition: {
                duration: 0.25,
                ease: 'easeInOut',
              },
            }}
          >
            {/* Header */}
            <div className="p-3 pb-2">
              <div className="flex items-center justify-between mb-6 mt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="md:hidden text-(--color-text-primary) hover:text-(--color-primary-500) transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <h2 className="Heading-4 text-(--color-text-primary)">
                    Notifications
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <button className="Caption text-(--color-primary-500) hover:text-(--color-primary-600) transition-colors cursor-pointer">
                    Mark as read
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {filters.map((filter) => {
                  const isActive = activeFilter === filter.name;
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.name}
                      onClick={() => setActiveFilter(filter.name)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full Button-Small border whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'border-(--color-primary-500) text-(--color-primary-500)'
                          : 'border-(--color-border-medium) text-(--color-text-secondary)'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-(--color-primary-500)'
                            : 'text-(--color-text-tertiary)'
                        }`}
                      />
                      {filter.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4">
              {['Today', 'Yesterday'].map((dateGroup) => {
                const groupNotifications = notifications.filter(
                  (n) => n.date === dateGroup
                );

                if (groupNotifications.length === 0) return null;

                return (
                  <div key={dateGroup} className="mb-6">
                    <h3 className="Body-Extra-Small text-(--color-text-tertiary) mb-4">
                      {dateGroup}
                    </h3>

                    <div className="space-y-6">
                      {groupNotifications.map((notification, index) => (
                        <div
                          key={notification.id}
                          className={`flex gap-4 group cursor-pointer ${
                            index !== groupNotifications.length - 1
                              ? 'border-b border-(--color-border-light) pb-4'
                              : ''
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
                          >
                            <Image
                              src={notification.icon}
                              alt={notification.type}
                              width={20}
                              height={20}
                              className="w-7 h-7"
                            />
                          </div>

                          <div>
                            <p className="Body-Small text-(--color-text-primary) mb-1">
                              {notification.title}
                            </p>

                            <p className="Caption-Small text-(--color-text-tertiary)">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Notification;
