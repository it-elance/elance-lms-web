'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationItem } from '@/types/notification.types';
import Image from 'next/image';

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATION_ICONS: Record<string, string> = {
  academics: '/school-noti.svg',
  school: '/school-noti.svg',
  general: '/mail-noti.svg',
  mail: '/mail-noti.svg',
  bank: '/bank-noti.svg',
  book: '/book-noti.svg',
  wallet: '/wallet-noti.svg',
  announce: '/announce-noti.svg',
};

const FILTERS = [
  { name: 'All', icon: '/filter.svg' },
  { name: 'Academics', icon: '/school.svg' },
  { name: 'General', icon: '/mail.svg' },
];

const getNotificationIcon = (type: string) =>
  NOTIFICATION_ICONS[type.toLowerCase()] || '/mail-noti.svg';

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

const NotificationCard = ({
  notification,
  isLast,
  onRead,
}: {
  notification: NotificationItem;
  isLast: boolean;
  onRead: (id: string) => void;
}) => {
  const isUnread = notification?.status;

  return (
    <div
      onClick={() => {
        if (!isUnread) return;
        onRead(notification?._id || '');
      }}
      className={`flex gap-4 group cursor-pointer ${
        !isLast ? 'border-b border-(--color-border-light) pb-4' : ''
      } ${!isUnread ? 'opacity-60' : ''}`}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
        <Image
          src={getNotificationIcon(notification?.type)}
          alt={notification?.type}
          width={20}
          height={20}
          className="w-7 h-7"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="Body-Small text-(--color-text-primary) mb-1 font-medium">
          {notification?.title}
        </p>

        <p className="Caption-Small text-(--color-text-tertiary) mb-1">
          {notification?.content}
        </p>

        {notification?.createdAt && (
          <p className="Caption-Small text-(--color-text-tertiary)">
            {new Date(notification?.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>

      {/* Unread Dot */}
      {isUnread && (
        <div className="w-2 h-2 rounded-full bg-(--color-primary-500) mt-2 shrink-0" />
      )}
    </div>
  );
};

const Notification = ({ isOpen, onClose }: NotificationProps) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
  } = useNotifications();

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'All') {
      return notifications;
    }

    return notifications.filter(
      (notification) =>
        notification.type.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [notifications, activeFilter]);

  const hasNotifications = filteredNotifications.length > 0;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';

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
            className="fixed shadow-sm top-16 md:top-22 right-0 md:right-4 h-[calc(100vh-64px)] md:h-180 w-full md:w-100 bg-(--color-bg-primary) z-70 md:rounded-xl flex flex-col border-l md:border border-(--color-border-light) overflow-hidden"
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

                <button
                  onClick={() => markAllAsRead()}
                  disabled={isMarkingAllAsRead || notifications.length === 0}
                  className="Caption text-(--color-primary-500) hover:text-(--color-primary-600) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Mark as read
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {FILTERS.map((filter) => {
                  const isActive = activeFilter === filter?.name;

                  return (
                    <button
                      key={filter?.name}
                      onClick={() => setActiveFilter(filter?.name)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full Button-Small border whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'border-(--color-primary-500) text-(--color-primary-500)'
                          : 'border-(--color-border-medium) text-(--color-text-secondary)'
                      }`}
                    >
                      <SvgIcon
                        src={filter?.icon}
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-(--color-primary-500)'
                            : 'text-(--color-text-tertiary)'
                        }`}
                      />

                      {filter?.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 flex flex-col">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-(--color-primary-500)" />

                  <p className="Body-Small text-(--color-text-tertiary)">
                    Loading notifications...
                  </p>
                </div>
              ) : !hasNotifications ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-3">
                  <Image
                    src="/empty-notifications.svg"
                    alt="No notifications"
                    width={90}
                    height={90}
                    className="opacity-90"
                  />

                  <div className="flex flex-col items-center gap-1.5 mt-2">
                    <h3 className="Heading-4 text-(--color-text-primary)">
                      No Notifications Yet
                    </h3>

                    <p className="Body-Small text-(--color-text-tertiary) text-center max-w-xs">
                      Important announcements and reminders will show up here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h3 className="Body-Extra-Small text-(--color-text-tertiary) mb-4">
                    Recent
                  </h3>

                  <div className="space-y-6">
                    {filteredNotifications.map((notification, index) => (
                      <NotificationCard
                        key={notification?._id}
                        notification={notification}
                        isLast={index === filteredNotifications.length - 1}
                        onRead={(id) =>
                          markAsRead({
                            notification_id: id,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Notification;
