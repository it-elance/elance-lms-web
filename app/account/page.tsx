'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import LogoutModal from '../../components/modals/LogoutModal';
import { useHomeData } from '@/hooks/useHomeData';
import { User } from 'lucide-react';

const menuItems = [
  {
    icon: '/bank.svg',
    label: 'Admissions Details',
    href: '/account/admission-details',
  },
  {
    icon: '/trend-up.svg',
    label: 'Analytics',
    href: '/analytics?showHeader=true',
  },
  {
    icon: '/palette.svg',
    label: 'Theme Preferences',
    href: '/account/theme',
  },
  {
    icon: '/book.svg',
    label: 'Course',
    href: '/course',
  },
  {
    icon: '/user-circle.svg',
    label: 'Personal Information',
    href: '/account/personal-info',
  },
  { icon: '/headset-mic.svg', label: 'Support', href: '#' },
  { icon: '/power.svg', label: 'Logout', action: 'logout' },
];

const Account = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { data, isLoading } = useHomeData();

  const user = data?.user;
  const selectedProgram = data?.selected_program;

  const handleItemClick = (item: (typeof menuItems)[0]) => {
    if (item.action === 'logout') {
      setIsLogoutOpen(true);
    } else if (item.href && item.href !== '#') {
      router.push(item.href);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    localStorage.clear();
    toast.success('Logged out successfully');

    setIsLogoutOpen(false);
    setIsLoggingOut(false);

    router.push('/');
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-full">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-5"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3 relative bg-(--color-bg-tertiary) flex items-center justify-center">
            {isLoading ? (
              <div className="w-full h-full bg-(--color-bg-tertiary) animate-pulse rounded-full" />
            ) : user?.profile_image_url ? (
              <Image
                src={user?.profile_image_url ?? ''}
                alt={user?.full_name ?? ''}
                className="w-full h-full object-cover"
                fill
              />
            ) : (
              <User className="w-10 h-10 text-(--color-text-disabled)" />
            )}
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-2 flex flex-col items-center">
              <div className="h-6 bg-(--color-bg-tertiary) rounded w-36" />
              <div className="h-4 bg-(--color-bg-tertiary) rounded w-20" />
              <div className="h-3 bg-(--color-bg-tertiary) rounded w-28" />
            </div>
          ) : (
            <>
              <h1 className="Heading-4 text-(--color-text-primary) mb-1">
                {user?.full_name ?? '—'}
              </h1>

              <p className="text-(--color-primary-500) Body-Large">
                {selectedProgram?.name ?? '—'}
              </p>

              <p className="text-(--color-text-primary) Body-Extra-Small">
                Student ID : {user?.student_id ?? '—'}
              </p>
            </>
          )}
        </motion.div>

        {/* Menu Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="w-full max-w-md bg-(--color-bg-secondary) rounded-xl border border-(--color-border-medium) overflow-hidden"
        >
          <div className="flex flex-col">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleItemClick(item)}
                className={`flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-(--color-bg-tertiary) ${
                  index !== menuItems.length - 1
                    ? 'border-b border-(--color-border-light)'
                    : ''
                }`}
              >
                <SvgIcon
                  src={item.icon}
                  className="w-5 h-5 bg-(--color-text-secondary)"
                />

                <span className="text-(--color-text-primary) Body-Medium">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => !isLoggingOut && setIsLogoutOpen(false)}
        onLogout={handleLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default Account;

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
