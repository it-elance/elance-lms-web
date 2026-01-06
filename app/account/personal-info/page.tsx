'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PersonalInfo = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-full w-full relative">
      <div className="sticky top-0 z-10 w-full flex justify-start pointer-events-none">
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

        <div className="flex items-center justify-center relative w-full">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="Heading-3 text-(--color-text-primary)"
          >
            Personal Information
          </motion.h1>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 pb-6 mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-(--color-bg-secondary) rounded-xl p-5 flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden mb-6 relative">
            <Image
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60"
              alt="Leo Das"
              fill
              className="object-cover"
            />
          </div>

          <h1 className="Heading-4 text-(--color-text-primary) mb-2">
            Leo Das
          </h1>

          <p className="Body-Large text-(--color-primary-500)">ACCA . CMA</p>

          <p className="Body-Extra-Small text-(--color-text-primary) mb-12">
            Student ID : EL25AA321
          </p>

          <div className="w-full space-y-4">
            <div className="flex justify-between items-center py-4 border-b border-(--color-border-light)">
              <span className="text-(--color-text-tertiary) Body-Small">
                Email Address
              </span>

              <span className="text-(--color-text-primary) Body-Small">
                leodas@gmail.com
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-(--color-text-tertiary) Body-Small">
                Mobile Number
              </span>

              <span className="text-(--color-text-primary) Body-Small">
                +918963553633
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalInfo;
