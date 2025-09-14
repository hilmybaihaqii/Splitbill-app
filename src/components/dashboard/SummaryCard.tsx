import { motion, type Variants } from 'framer-motion';

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, description, icon: Icon }) => (
  <motion.div
    className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg text-white cursor-pointer"
    variants={cardVariants}
    whileHover={{ 
      scale: 1.03, 
      y: -5, 
      boxShadow: "0px 10px 30px rgba(16, 185, 129, 0.2)"
    }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h3>
      <div className="p-2 rounded-full bg-emerald-500/10">
        <Icon size={20} className="text-emerald-400" />
      </div>
    </div>
    <p className="text-3xl font-extrabold truncate">{value}</p>
    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
  </motion.div>
);

export default SummaryCard;