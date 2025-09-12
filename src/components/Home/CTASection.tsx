import { forwardRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Sparkles, Dices, ArrowRight, Users } from 'lucide-react';

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
      delay: 0.4,
    },
  },
};

interface CTASectionProps {
  id: string;
}

const CTASection = forwardRef<HTMLDivElement, CTASectionProps>((props, ref) => {
  return (
    <section 
      id={props.id} 
      ref={ref} 
      className="py-20 relative text-white text-center overflow-hidden bg-gray-900" 
    >
      <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full filter blur-3xl opacity-50 animate-blob -z-10"></div>
      <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000 -z-10"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-0"> 
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={ctaVariants}
          className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-2xl border border-white/10 relative overflow-hidden bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        >
          <motion.div className="absolute top-4 left-4 text-emerald-500" variants={iconVariants}>
            <Sparkles size={32} />
          </motion.div>
          <motion.div className="absolute bottom-4 right-4 text-emerald-500" variants={iconVariants}>
            <Dices size={32} />
          </motion.div>
          
          <motion.h2 variants={childVariants} className="text-3xl sm:text-4xl font-extrabold mb-4">
            Siap Bagi Tagihan Tanpa <span className="text-emerald-500">Ribet?</span>
          </motion.h2>
          <motion.p variants={childVariants} className="mb-8 text-lg text-gray-300 max-w-2xl mx-auto">
            Gabung sekarang dan rasakan pengalaman berbagi pengeluaran yang lebih mudah dan menyenangkan.
          </motion.p>
          <motion.div 
            variants={childVariants} 
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/register" 
              className="relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-xl shadow-emerald-500/30 overflow-hidden group"
            >
              Daftar Gratis
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              <span className="absolute inset-0 w-full h-full bg-white opacity-10 blur-xl group-hover:opacity-0 transition-opacity duration-300"></span>
            </Link>
          </motion.div>

          <motion.div variants={childVariants} className="mt-8 flex justify-center items-center gap-2 text-sm text-gray-400">
              <Users size={16} />
              <span>Bergabung dengan 1,000+ pengguna lainnya</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

export default memo(CTASection);