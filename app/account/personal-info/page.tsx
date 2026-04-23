'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHomeData } from '@/hooks/useHomeData';

const PersonalInfo = () => {
  const router = useRouter();
  const { data, isLoading } = useHomeData();

  const user = data?.user;
  const programs = data?.user?.programs ?? [];

  return (
    <div className="flex flex-col min-h-full w-full relative lg:justify-center">
      <div className="sticky top-0 z-10 w-full flex justify-start pointer-events-none bg-(--color-bg-primary) py-4 lg:absolute lg:top-0 lg:left-0">
        <motion.button
          onClick={() => router.back()}
          className="rounded-full transition-colors pointer-events-auto cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ChevronLeft className="w-6 h-6 text-(--color-text-primary)" />
        </motion.button>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 pb-6 mt-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-(--color-bg-secondary) rounded-xl p-5 flex flex-col items-center"
        >
          {/* Profile Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 relative bg-(--color-bg-tertiary) flex items-center justify-center">
            {isLoading ? (
              <div className="w-full h-full bg-(--color-bg-tertiary) animate-pulse rounded-full" />
            ) : user?.profile_image_url ? (
              <Image
                src={user?.profile_image_url ?? ''}
                alt={user?.full_name ?? ''}
                fill
                className="object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-(--color-text-disabled)" />
            )}
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-2 flex flex-col items-center w-full mb-8">
              <div className="h-6 bg-(--color-bg-tertiary) rounded w-40" />
              <div className="h-4 bg-(--color-bg-tertiary) rounded w-32" />
              <div className="h-3 bg-(--color-bg-tertiary) rounded w-28" />
            </div>
          ) : (
            <>
              <h1 className="Heading-4 text-(--color-text-primary) mb-2">
                {user?.full_name ?? '—'}
              </h1>

              <p className="Body-Large text-(--color-primary-500)">
                {programs.map((p) => p.name).join(' . ')}
              </p>

              <p className="Body-Extra-Small text-(--color-text-primary) mb-12">
                Student ID : {user?.student_id ?? '—'}
              </p>
            </>
          )}

          <div className="w-full space-y-4">
            <div className="flex justify-between items-center py-4 border-b border-(--color-border-light)">
              <span className="text-(--color-text-tertiary) Body-Small">
                Email Address
              </span>

              {isLoading ? (
                <div className="h-4 bg-(--color-bg-tertiary) rounded w-40 animate-pulse" />
              ) : (
                <span className="text-(--color-text-primary) Body-Small">
                  {user?.email ?? '—'}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-(--color-text-tertiary) Body-Small">
                Mobile Number
              </span>

              {isLoading ? (
                <div className="h-4 bg-(--color-bg-tertiary) rounded w-32 animate-pulse" />
              ) : (
                <span className="text-(--color-text-primary) Body-Small">
                  {user?.mobile_number ?? '—'}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalInfo;
