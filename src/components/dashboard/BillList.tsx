import { doc, deleteDoc, type FirestoreError } from "firebase/firestore";
import { MinusCircle } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import React, { memo, useCallback } from "react";
import BillCard from "./BillCard";
import { db } from "../../firebase";

interface Bill {
  id: string;
  billName: string;
  createdAt: {
    seconds: number;
  };
  participantUids?: string[];
}

interface BillListProps {
  bills: Bill[] | undefined;
  loading: boolean;
  error: FirestoreError | undefined;
}

const BillCardSkeleton = () => (
  <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 animate-pulse">
    <div className="flex items-center gap-5">
      <div className="bg-gray-700/50 p-4 rounded-xl h-[60px] w-[60px]"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const BillList: React.FC<BillListProps> = memo(({ bills, loading, error }) => {
  // --- FUNGSI HAPUS LANGSUNG ---
  // Fungsi ini akan dipanggil langsung dari BillCard
  const handleDelete = useCallback(async (billId: string) => {
    try {
      await deleteDoc(doc(db, 'bills', billId));
    } catch (err) {
      console.error("Error deleting bill:", err);
      // Tidak ada notifikasi error yang ditampilkan ke pengguna
    }
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <BillCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        Terjadi kesalahan saat memuat data: {error.message}
      </div>
    );
  }

  return (
    // Tidak perlu modal, jadi React.Fragment bisa dihapus
    <AnimatePresence>
      {bills && bills.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {bills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onDelete={handleDelete} // Kirim fungsi hapus langsung
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-16 px-8 bg-gray-800/40 rounded-xl shadow-2xl mx-auto max-w-md border border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MinusCircle size={64} className="mx-auto text-emerald-500/80 mb-4" />
          <h3 className="mt-2 text-xl font-medium text-white">
            Anda Belum Punya Tagihan
          </h3>
          <p className="mt-2 text-base text-gray-400">
            Mulai petualangan finansial Anda dengan mengklik "Tambah Tagihan".
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default BillList;

