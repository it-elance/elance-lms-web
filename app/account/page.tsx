'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const menuItems = [
  { icon: '/bank.svg', label: 'Admissions Details', href: '#' },
  { icon: '/trend-up.svg', label: 'Analytics', href: '#' },
  { icon: '/heart.svg', label: 'Favourites', href: '/favourites' },
  { icon: '/palette.svg', label: 'Theme Preferences', href: '#' },
  { icon: '/book.svg', label: 'Course', href: '#' },
  { icon: '/user-circle.svg', label: 'Personal Information', href: '#' },
  { icon: '/headset-mic.svg', label: 'Support', href: '#' },
  { icon: '/power.svg', label: 'Logout', href: '#' },
];

const Account = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-5"
      >
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 relative">
          <Image
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60"
            alt="Leo Das"
            className="w-full h-full object-cover"
            fill
          />
        </div>

        <h1 className="Heading-4 text-(--color-text-primary) mb-1">Leo Das</h1>

        <p className="text-(--color-primary-500) Body-Large">ACCA</p>

        <p className="text-(--color-text-primary) Body-Extra-Small">
          Student ID : EL25AA321
        </p>
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
