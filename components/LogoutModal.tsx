'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutModal = ({ isOpen, onClose, onLogout }: LogoutModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-99999 w-screen h-screen flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 w-full h-full bg-black/50"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-85 bg-(--color-bg-secondary) rounded-2xl p-6 flex flex-col items-center text-center shadow-xl"
          >
            {/* Warning Icon */}
            <div className="flex items-center justify-center mb-5">
              <Image src="/danger.svg" alt="danger" width={50} height={50} />
            </div>

            <h2 className="Heading-4 text-(--color-text-primary) mb-3">
              Logout
            </h2>

            <p className="Body-Medium text-(--color-text-secondary) mb-5 text-left">
              Are you sure you want to log out of your account? You’ll need to
              sign in again to continue learning.
            </p>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={onLogout}
                className="w-full bg-(--color-error-600) text-white py-3.5 rounded-xl cursor-pointer Button-Primary"
              >
                Logout
              </button>

              <button
                onClick={onClose}
                className="w-full bg-white border border-(--color-border-medium) text-(--color-text-primary) py-3.5 rounded-xl Button-Primary cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LogoutModal;
