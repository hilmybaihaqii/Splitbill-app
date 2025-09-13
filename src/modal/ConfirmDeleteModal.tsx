import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';
import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-800/90 rounded-2xl border border-red-500/30 shadow-xl p-8 max-w-sm w-full text-center"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-8">{message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Menghapus...
                  </>
                ) : (
                  'Ya, Hapus'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;