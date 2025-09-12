import { useState, forwardRef, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import type { FC } from "react";
import { ChevronDown, HelpCircle, Mail } from "lucide-react";
import { faqData } from "../../data/faqData";
import type { FAQItem } from "../../data/faqData";
import ContactModal from "../../modal/ContactModal";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

type FAQCardProps = FAQItem & {
  isOpen: boolean;
  onClick: () => void;
};

const FAQCard: FC<FAQCardProps> = memo(({ question, answer, isOpen, onClick }) => {
  return (
    <motion.div variants={itemVariants} className="border-b border-white/10">
      <div
        className="flex justify-between items-center py-4 cursor-pointer transition-colors duration-300 hover:bg-white/5 px-4 rounded-t-lg"
        onClick={onClick}
      >
        <h4
          className={`text-base sm:text-lg font-semibold transition-colors ${
            isOpen ? "text-emerald-500" : "text-white"
          }`}
        >
          {question}
        </h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="text-emerald-500 flex-shrink-0" size={24} />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="pt-2 pb-4 px-4 text-gray-300">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

interface FAQSectionProps {
  id: string;
}

const FAQSection = forwardRef<HTMLDivElement, FAQSectionProps>((props, ref) => {
  const [openFAQ, setOpenFAQ] = useState<string | null>(faqData[0].question);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFAQ = useCallback((question: string) => {
    setOpenFAQ((prevOpenFAQ) => (prevOpenFAQ === question ? null : question));
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <section
      id={props.id}
      ref={ref}
      className="py-20 bg-gray-900 z-10 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 flex items-center gap-4">
            <HelpCircle
              className="text-emerald-500 hidden sm:block"
              size={48}
            />
            <span>
              Punya <span className="text-emerald-500">Pertanyaan?</span>
            </span>
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Kami telah mengumpulkan beberapa pertanyaan yang paling sering
            diajukan untuk membantu Anda memulai. Jika Anda tidak menemukan
            jawaban di sini, jangan ragu untuk menghubungi kami.
          </p>
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex"
            onClick={openModal}
          >
            <div className="relative px-8 py-4 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 w-full sm:w-auto overflow-hidden group cursor-pointer">
              Hubungi Kami
              <Mail size={20} className="group-hover:translate-x-1 transition-transform" />
              <span className="absolute inset-0 w-full h-full bg-white opacity-10 blur-xl group-hover:opacity-0 transition-opacity duration-300"></span>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="bg-gray-800/40 rounded-2xl shadow-xl border border-white/10 backdrop-blur-sm"
        >
          {faqData.map((faq) => (
            <FAQCard
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFAQ === faq.question}
              onClick={() => toggleFAQ(faq.question)}
            />
          ))}
        </motion.div>
      </div>
      <ContactModal isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
});

export default memo(FAQSection);