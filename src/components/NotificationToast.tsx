// src/components/NotificationToast.tsx

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Variants } from 'framer-motion';

const toastVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

interface NotificationToastProps {
  notification: {
    message: string;
    type: 'success' | 'error';
  } | null;
}

function NotificationToast({ notification }: NotificationToastProps) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-lg flex items-center gap-3 z-[1002] border backdrop-blur-sm ${
            notification.type === 'success'
              ? 'bg-gradient-to-br from-teal-500/80 to-emerald-600/80 border-teal-400/50'
              : 'bg-gradient-to-br from-red-500/80 to-rose-600/80 border-red-400/50'
          }`}
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {notification.type === 'success' ? (
            <CheckCircle size={20} className="text-white" />
          ) : (
            <XCircle size={20} className="text-white" />
          )}
          <span className="text-white font-medium">{notification.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NotificationToast;