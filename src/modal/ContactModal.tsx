import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Github, Mail, FileText, MessageSquare, X } from "lucide-react";
import { memo, useEffect, type ReactNode } from "react";

interface ContactOptionProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  variant?: "primary" | "secondary";
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ContactOption = ({ icon, title, description, buttonText, href, variant = "primary" }: ContactOptionProps) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -4, scale: 1.02 }} 
    className="bg-gray-800/60 p-5 rounded-lg border border-white/10 transition-transform duration-300 w-full"
  >
    <h4 className="flex items-center justify-center gap-2 text-white font-semibold mb-2">
      {icon} {title}
    </h4>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    {variant === "primary" ? (
      <a 
        href={href} 
        className="relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-xl shadow-emerald-500/30 px-6 py-2 rounded-full text-white font-semibold inline-block text-sm overflow-hidden group"
      >
        {buttonText}
        <span className="absolute inset-0 w-full h-full bg-white opacity-10 blur-xl group-hover:opacity-0 transition-opacity duration-300"></span>
      </a>
    ) : (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full font-semibold text-gray-300 border border-white/10 bg-gray-700/50 hover:border-white/20 hover:bg-gray-700 transition-all duration-300 shadow-md text-sm"
      >
        <Github size={16} /> {buttonText}
      </a>
    )}
  </motion.div>
);

const modalContainerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: -50 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { 
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1, 
    } 
  },
  exit: { opacity: 0, scale: 0.8, y: -50, transition: { duration: 0.2 } },
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4" // z-index tinggi
        >
          <motion.div
            variants={modalContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gray-800/80 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-auto border border-white/10 text-center"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
              <X size={24} />
            </button>
            
            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center mb-6">
              <div className="p-3 mb-2 bg-emerald-500/10 rounded-full">
                <MessageSquare size={25} className="text-emerald-500"/>
              </div>
              <h3 className="text-xl font-bold text-white">Hubungi Kami</h3>
              <p className="text-gray-300 text-sm mt-1">
                Pilih cara terbaik untuk terhubung dengan kami.
              </p>
            </motion.div>
            
            <div className="flex flex-col items-center gap-4 mb-4">
              <ContactOption 
                icon={<Mail size={20} className="text-emerald-400" />}
                title="Dukungan Umum"
                description="Untuk pertanyaan, bantuan teknis, atau hal non-teknis lainnya."
                buttonText="Kirim Email"
                href="mailto:support@splitbill-app.com"
                variant="primary"
              />
              
              <ContactOption 
                icon={<FileText size={20} className="text-indigo-400" />}
                title="Laporan Bug & Ide"
                description="Laporkan masalah atau usulkan fitur baru di repositori GitHub kami."
                buttonText="Buka GitHub Issues"
                href="https://github.com/hilmybaihaqii/Splitbill-app/issues"
                variant="secondary"
              />
            </div>
            
            <motion.div variants={itemVariants} className="border-t border-white/10 pt-4">
              <div className="flex flex-col items-center justify-center text-sm text-gray-400">
                  Terima Kasih!
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(ContactModal);