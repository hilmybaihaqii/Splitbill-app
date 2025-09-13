import { Link } from 'react-router-dom';
import { Trash2, FileText, Users } from 'lucide-react';
import { motion } from 'framer-motion';

// Sesuaikan interface Bill dengan struktur data Anda
interface Bill {
  id: string;
  billName: string;
  createdAt: {
    seconds: number;
  };
  totalAmount?: number;
  participantUids?: string[];
}

interface BillCardProps {
  bill: Bill;
  // Perbarui tipe onDelete, karena kita tidak perlu event object lagi
  onDelete: (billId: string) => void; 
}

const BillCard: React.FC<BillCardProps> = ({ bill, onDelete }) => {
  
  // Fungsi untuk mencegah navigasi saat tombol hapus diklik
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah klik pada Link
    e.preventDefault();  // Mencegah perilaku default
    onDelete(bill.id);
  };

  const participantCount = bill.participantUids?.length || 0;

  return (
    <motion.div
      className="relative group" // Tambahkan 'group' untuk efek hover
      layout // Animasi saat item dihapus dari daftar
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <Link 
        to={`/bill/${bill.id}`} 
        className="block bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-900/50"
      >
        <div className="flex items-center gap-5">
          <div className="bg-emerald-500/10 p-4 rounded-xl flex-shrink-0 transition-colors duration-300 group-hover:bg-emerald-500/20">
            <FileText className="text-emerald-400" size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white truncate">{bill.billName}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
              <span>Dibuat: {new Date(bill.createdAt?.seconds * 1000).toLocaleDateString()}</span>
              {participantCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  {participantCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      <motion.button
        onClick={handleDeleteClick}
        className="absolute top-4 right-4 p-2.5 text-gray-500 bg-gray-800/50 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:!opacity-100 hover:text-red-400 hover:bg-red-500/10"
        title="Hapus Tagihan"
        aria-label="Hapus Tagihan"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <Trash2 size={20} />
      </motion.button>
    </motion.div>
  );
};

export default BillCard;