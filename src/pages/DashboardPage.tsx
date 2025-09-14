import { useState, useMemo } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { motion, type Variants } from 'framer-motion';
import { Wallet, PlusCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

import BillList from '../components/dashboard/BillList';
import CreateBillModal from '../modal/CreateBillModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SummaryCard from '../components/dashboard/SummaryCard';

export interface Bill {
  id: string;
  billName: string;
  createdAt: { seconds: number; nanoseconds: number; };
  participantUids?: string[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, 
    },
  },
};

function DashboardPage() {
  const user = auth.currentUser;
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const billsQuery = user 
    ? query(
        collection(db, 'bills'), 
        where("participantUids", "array-contains", user.uid),
        orderBy("createdAt", "desc")
      ) 
    : null;

  const [snapshot, loading, error] = useCollection(billsQuery);

  const bills = useMemo(() => 
    snapshot?.docs.map(doc => ({ ...doc.data(), id: doc.id } as Bill)) || [], 
    [snapshot]
  );
  
  const latestBillName = bills.length > 0 ? bills[0].billName : 'Belum Ada';

  
  const handleDeleteBill = async (billId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus tagihan ini secara permanen?")) {
      return;
    }

    const billRef = doc(db, 'bills', billId);
    const toastId = toast.loading("Menghapus tagihan...");

    try {
      await deleteDoc(billRef);
      toast.update(toastId, { render: "Tagihan berhasil dihapus!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error("Error deleting bill: ", error);
      toast.update(toastId, { render: "Gagal menghapus tagihan.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const userName = user?.displayName || user?.email || 'Pengguna';

  return (
    <>
      <div className="min-h-screen w-full bg-gray-900 text-gray-100 font-sans antialiased relative overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* Prop onLogout dihapus dari sini */}
          <DashboardHeader userName={userName} />
          
          <main>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <SummaryCard 
                title="Total Tagihan" 
                value={bills.length} 
                icon={Wallet} 
                description="Jumlah semua tagihan Anda."
              />
              <SummaryCard 
                title="Tagihan Terbaru" 
                value={latestBillName} 
                icon={Clock} 
                description="Tagihan yang baru saja dibuat atau diikuti."
              />
            </motion.div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-2xl font-semibold text-white mb-4 sm:mb-0">Daftar Tagihan</h2>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                aria-label="Tambah Tagihan"
              >
                <PlusCircle size={20} />
                <span>Tambah Tagihan</span>
              </motion.button>
            </div>

            <motion.div
              className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <BillList 
                bills={bills} 
                loading={loading} 
                error={error} 
                onDelete={handleDeleteBill}
              />
            </motion.div>
          </main>
        </div>
      </div>
      <CreateBillModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default DashboardPage;