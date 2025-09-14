import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <>
      <motion.header
        className="pb-8 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-4 sm:gap-5">
          <Link to="/settings" title="Pengaturan Akun" aria-label="Pengaturan Akun">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Avatar name={userName} />
            </motion.div>
          </Link>
          
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-300">
              Dashboard
            </h1>
            <p className="text-gray-400 text-md sm:text-lg mt-1 sm:mt-2 font-light">
              Selamat datang kembali, <span className="text-emerald-400 font-semibold">{userName}</span>
            </p>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default DashboardHeader;