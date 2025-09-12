import { Link } from 'react-router-dom';
import { Trash2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface Bill {
  id: string;
  billName: string;
  createdAt: {
    seconds: number;
  };
}

interface BillCardProps {
  bill: Bill;
  onDelete: (billId: string, e: React.MouseEvent) => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onDelete }) => {
  return (
    <motion.div
      className="relative rounded-2xl shadow-xl overflow-hidden bg-gray-800/40 backdrop-blur-sm border border-white/10 transition-all duration-300 transform"
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <Link to={`/bill/${bill.id}`} className="block p-6">
        <div className="flex items-start gap-5">
          <div className="bg-emerald-500/10 p-4 rounded-full flex-shrink-0 shadow-inner">
            <FileText className="text-emerald-400" size={28} />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-white truncate">{bill.billName}</h3>
            <p className="text-sm text-gray-400 mt-2">
              Dibuat pada: {new Date(bill.createdAt?.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Link>
      <motion.button
        onClick={(e) => onDelete(bill.id, e)}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors duration-200"
        title="Delete Bill"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <Trash2 size={24} />
      </motion.button>
    </motion.div>
  );
};

export default BillCard;