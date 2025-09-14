import BillCard from './BillCard'; 
import { motion } from 'framer-motion';
import { Frown } from 'lucide-react';
import type { Bill } from '../../pages/DashboardPage';

interface BillListProps {
  bills: Bill[];
  loading: boolean;
  error?: Error;
  onDelete: (billId: string) => void; 
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const SkeletonCard = () => (
  <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10 animate-pulse">
    <div className="flex items-center gap-5">
      <div className="bg-gray-700/50 p-4 rounded-xl w-[60px] h-[60px]"></div>
      <div className="flex-1 min-w-0 space-y-3">
        <div className="h-6 w-3/4 bg-gray-700 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
);


const BillList: React.FC<BillListProps> = ({ bills, loading, error, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400">Error: {error.message}</div>;
  }

  if (bills.length === 0) {
    return (
      <div className="text-center py-10">
        <Frown size={40} className="mx-auto text-gray-500 mb-4" />
        <p className="text-gray-400">Anda belum memiliki tagihan.</p>
        <p className="text-sm text-gray-500">Klik "Tambah Tagihan" untuk memulai.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-5" 
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {bills.map((bill) => (
        <BillCard key={bill.id} bill={bill} onDelete={onDelete} />
      ))}
    </motion.div>
  );
};

export default BillList;