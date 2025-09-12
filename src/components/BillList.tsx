import { doc, deleteDoc, FirestoreError } from 'firebase/firestore';
import { MinusCircle } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import BillCard from './BillCard';
import React, { memo, useCallback } from 'react';
import { db } from '../firebase';

interface Bill {
  id: string;
  billName: string;
  createdAt: {
    seconds: number;
  };
}

interface BillListProps {
  bills: Bill[] | undefined;
  loading: boolean;
  error: FirestoreError | undefined;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const BillList: React.FC<BillListProps> = memo(({ bills, loading, error }) => {

  const handleDelete = useCallback(async (billId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await deleteDoc(doc(db, 'bills', billId));
      } catch (err) {
        console.error("Error deleting bill: ", err);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
        <div className="text-gray-400 mt-4">Loading your bills...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        Error: {error.message}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {bills && bills.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {bills.map((bill) => (
            <motion.div key={bill.id} variants={itemVariants}>
              <BillCard bill={bill} onDelete={handleDelete} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-16 px-8 bg-gray-800/40 rounded-xl shadow-2xl mx-auto max-w-md border border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MinusCircle size={64} className="mx-auto text-emerald-500 mb-4" />
          <h3 className="mt-2 text-xl font-medium text-white">Anda Belum Punya Tagihan</h3>
          <p className="mt-2 text-base text-gray-400">Klik "Tambah Tagihan" untuk memulai.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default BillList;