// src/modal/CreateBillModal.tsx

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, List, Plus, RotateCw, CheckCircle, XCircle } from 'lucide-react';
import type { Variants } from 'framer-motion';

interface CreateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const confirmationModalVariants: Variants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: 50, opacity: 0 },
};

const toastVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

function CreateBillModal({ isOpen, onClose }: CreateBillModalProps) {
  const [billName, setBillName] = useState('');
  const [mode, setMode] = useState('restoran');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const handleCreateBill = useCallback(async () => {
    if (!billName || !currentUser) return;
    setIsLoading(true);
    setNotification(null);

    try {
      const docRef = await addDoc(collection(db, 'bills'), {
        billName,
        mode,
        creatorUid: currentUser.uid,
        participantUids: [currentUser.uid],
        createdAt: serverTimestamp(),
        taxPercent: 10,
        serviceFee: 0,
        items: [],
      });
      setIsLoading(false);
      setNotification({ message: 'Tagihan berhasil dibuat!', type: 'success' });
      
      setTimeout(() => {
        onClose();
        navigate(`/bill/${docRef.id}`);
      }, 1500);
      
    } catch (error) {
      console.error("Error creating bill:", error);
      setIsLoading(false);
      setNotification({ message: 'Gagal membuat tagihan. Coba lagi.', type: 'error' });
    }
  }, [billName, mode, onClose, navigate, currentUser]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmationOpen(true);
  };
  
  const handleCloseModal = useCallback(() => {
    onClose();
    setBillName('');
    setMode('restoran');
  }, [onClose]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[1000] p-4 bg-gray-900/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800/60 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 relative"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                disabled={isLoading}
              >
                <X size={24} />
              </button>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500 mb-2">
                Buat Tagihan Baru
              </h2>
              <p className="text-gray-400 mb-6 text-sm">Masukan detail tagihan Anda.</p>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label htmlFor="billName" className="sr-only">Nama Tagihan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="text-gray-500" size={20} />
                    </div>
                    <input
                      type="text"
                      id="billName"
                      value={billName}
                      onChange={(e) => setBillName(e.target.value)}
                      className="block w-full px-10 py-3 bg-gray-800/60 text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Nama Tagihan"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="mode" className="sr-only">Tipe Tagihan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <List className="text-gray-500" size={20} />
                    </div>
                    <select
                      id="mode"
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="block w-full px-10 py-3 bg-gray-800/60 text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none"
                      disabled={isLoading}
                    >
                      <option value="restoran">Resto</option>
                      <option value="jasa">Jasa</option>
                      <option value="rekreasi">Rekreasi</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold px-4 py-3 rounded-lg transition-colors"
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-4 py-3 rounded-lg shadow-xl shadow-emerald-500/20 transition-all"
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <>
                        <RotateCw size={18} className="animate-spin" />
                        Membuat...
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Tambah
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConfirmationOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[1001] p-4 bg-gray-900/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsConfirmationOpen(false)}
          >
            <motion.div
              className="bg-gray-800/60 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/10 relative text-center"
              variants={confirmationModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-2">Konfirmasi</h3>
              <p className="text-gray-400 mb-6">Apakah Anda yakin ingin membuat tagihan baru?</p>
              <div className="flex justify-center space-x-4">
                <motion.button
                  onClick={() => setIsConfirmationOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold px-4 py-2 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Batal
                </motion.button>
                <motion.button
                  onClick={() => {
                    setIsConfirmationOpen(false);
                    handleCreateBill();
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-4 py-2 rounded-lg shadow-xl shadow-emerald-500/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ya, Buat
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-lg flex items-center gap-3 z-[1002] transition-colors ${
              notification.type === 'success' ? 'bg-green-600/90' : 'bg-red-600/90'
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
            <span className="text-white">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CreateBillModal;