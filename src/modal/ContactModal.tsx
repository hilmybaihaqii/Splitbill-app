import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Github, X, Mail, FileText, MessageSquare } from "lucide-react";
import { memo } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: -50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, y: -50, transition: { duration: 0.2 } },
};

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gray-800/80 p-5 rounded-2xl shadow-2xl max-w-sm w-full mx-5 border border-white/10 text-center"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center justify-center mb-6">
                <div className="p-3 mb-2 bg-emerald-500/10 rounded-full">
                    <MessageSquare size={25} className="text-emerald-500"/>
                </div>
                <h3 className="text-xl font-bold text-white">Hubungi Kami</h3>
                <p className="text-gray-300 text-sm mt-1">
                  Pilih cara terbaik untuk terhubung dengan kami.
                </p>
            </div>
            
            <div className="flex flex-col gap-4 mb-4">
                <motion.div whileHover={{ y: -3, scale: 1.02 }} className="bg-gray-800/60 p-5 rounded-lg border border-white/10 cursor-pointer transition-transform duration-300">
                  <h4 className="flex items-center justify-center gap-2 text-white font-semibold mb-2">
                    <Mail size={20} className="text-emerald-400" /> Dukungan Umum
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">Untuk pertanyaan, bantuan teknis, atau hal non-teknis lainnya.</p>
                  <a href="https://gmail.com/" className="relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-xl shadow-emerald-500/30 px-6 py-2 rounded-full text-white font-semibold inline-block text-sm overflow-hidden group">
                    Kirim Email
                    <span className="absolute inset-0 w-full h-full bg-white opacity-10 blur-xl group-hover:opacity-0 transition-opacity duration-300"></span>
                  </a>
                </motion.div>
                
                <motion.div whileHover={{ y: -3, scale: 1.02 }} className="bg-gray-800/60 p-5 rounded-lg border border-white/10 cursor-pointer transition-transform duration-300">
                  <h4 className="flex items-center justify-center gap-2 text-white font-semibold mb-2">
                    <FileText size={20} className="text-indigo-400" /> Laporan Bug & Ide
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">Laporkan masalah atau usulkan fitur baru di repositori GitHub kami.</p>
                  <a href="https://github.com/hilmybaihaqii/Splitbill-app.git" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full font-semibold text-gray-300 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-md text-sm">
                    <Github size={16} /> Buka GitHub Issues
                  </a>
                </motion.div>
            </div>
            
            <div className="border-t border-white/10 pt-4">
                <div className="flex flex-col items-center justify-center text-sm text-gray-400">
                    Terima Kasih!
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(ContactModal);