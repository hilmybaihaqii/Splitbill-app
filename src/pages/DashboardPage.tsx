import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import BillList from '../components/BillList';
import CreateBillModal from '../modal/CreateBillModal';
import { LogOut, PlusCircle, Settings, Wallet, AlertTriangle } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

interface AvatarProps {
  name: string;
}
const Avatar: React.FC<AvatarProps> = ({ name }) => {
  const initials = name.split(' ').map((part) => part.charAt(0).toUpperCase()).join('');
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
      {initials}
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
}
const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon }) => (
  <motion.div
    className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg text-white"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h3>
      <div className="p-2 rounded-full bg-emerald-500/10">
        <Icon size={20} className="text-emerald-400" />
      </div>
    </div>
    <p className="text-3xl font-extrabold">{value}</p>
  </motion.div>
);

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-2xl border border-white/10 shadow-xl p-8 max-w-sm w-full text-center"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Konfirmasi Logout</h3>
            <p className="text-gray-400 mb-8">
              Apakah Anda yakin ingin keluar dari akun Anda?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Keluar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface Bill {
  id: string;
  billName: string;
  createdAt: {
    seconds: number;
  };
}

function DashboardPage() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  
  const billsRef = collection(db, 'bills');
  const q = user ? query(billsRef, where("participantUids", "array-contains", user.uid)) : null;

  const [snapshot, loading, error] = useCollection(q);
  const totalBills = snapshot?.docs.length || 0;
  const bills = snapshot?.docs.map(doc => ({ ...doc.data() as Bill, id: doc.id }));

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  const userName = user?.displayName || user?.email || 'Pengguna';

  return (
    <>
      <div className="min-h-screen w-full bg-gray-900 text-gray-100 font-sans antialiased relative overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.header
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-300">
                Dashboard
              </h1>
              <p className="text-gray-400 text-lg mt-2 font-light">
                Selamat datang kembali, <span className="text-emerald-400 font-semibold">{userName}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-6 sm:mt-0">
              <Avatar name={userName} />
              <Link to="/settings" className="p-2 text-gray-400 hover:text-emerald-400 transition-colors duration-200" aria-label="Settings">
                <Settings size={24} />
              </Link>
                <motion.button
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                  aria-label="Logout"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={24} />
                </motion.button>
            </div>
          </motion.header>
          
          <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <SummaryCard title="Total Tagihan" value={totalBills} icon={Wallet} />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-2xl font-semibold text-white mb-4 sm:mb-0">Daftar Tagihan</h2>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Tambah Tagihan"
              >
                <PlusCircle size={20} />
                <span>Tambah Tagihan</span>
              </motion.button>
            </div>

            <motion.div
              className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <BillList bills={bills} loading={loading} error={error} />
            </motion.div>
          </main>
        </div>
      </div>
      <CreateBillModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <LogoutConfirmModal 
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

export default DashboardPage;