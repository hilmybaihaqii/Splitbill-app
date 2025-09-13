import { forwardRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Lottie from 'lottie-react';
import heroAnimation from '../../assets/animations/bills.json'

interface HeroSectionProps {
  id: string;
}

const mainVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 10,
    },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      delay: 0.4,
    },
  },
};

const lottieVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
      delay: 0.6,
    },
  },
};

const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>((props, ref) => {
  return (
    <main
      ref={ref}
      id={props.id}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 py-24 relative bg-gray-900 text-white overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute top-1/4 -left-16 w-80 h-80 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-1/4 -right-16 w-80 h-80 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <motion.div
        className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-[1fr_1.5fr] items-center gap-16 md:gap-24 text-left z-10 relative"
        variants={mainVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="md:order-1 order-2">

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-300"
            variants={textVariants}
          >
            Bagi Tagihan Jadi{' '}
            <span className="relative inline-block text-emerald-400 group">
              Mudah
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </span>{' '}
            & Transparan
          </motion.h1>
          <motion.p
            className="text-base sm:text-md text-gray-300 mb-10 max-w-2xl"
            variants={textVariants}
          >
            SplitBill membantu kamu membagi pengeluaran dengan teman, keluarga, atau rekan kerja tanpa repot. Lebih adil, lebih cepat, lebih seru!
          </motion.p>

          <motion.div
            className="flex flex-col items-stretch sm:flex-row sm:items-center gap-4"
            variants={buttonVariants}
          >
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register" className="relative px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 overflow-hidden group">
                Mulai Sekarang
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                <span className="absolute inset-0 w-full h-full bg-white opacity-10 blur-xl group-hover:opacity-0 transition-opacity duration-300"></span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="#features" className="px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold text-emerald-400 border-2 border-emerald-400/50 hover:border-emerald-400 hover:bg-emerald-400/10 transition-all duration-300 flex justify-center">
                Pelajari Fitur
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="md:order-1 order-1 flex justify-center items-center relative"
          variants={lottieVariants}
        >
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,theme(colors.emerald.900/40)_0%,transparent_100%)] blur-2xl"></div>
          
          <div className="w-full max-w-[600px] relative z-10">
            <Lottie 
              animationData={heroAnimation}
              loop={true} 
              autoplay={true}
            />
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
});

export default memo(HeroSection);