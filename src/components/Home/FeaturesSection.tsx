import { forwardRef, useState, memo } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { FC } from "react";
import { featuresData } from "../../data/featuresData";

type Feature = {
  imgSrc: string;
  altText: string;
  title: string;
  desc: string;
};


const containerFeaturesVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemFeaturesVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
    },
  },
};

const FeatureCard: FC<Feature> = memo(({ imgSrc, altText, title, desc }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped((prev) => !prev);

  return (
    <motion.div
      variants={itemFeaturesVariants}
      whileHover={{ y: -8 }}
      className="relative group [perspective:1000px]"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-300"></div>
      <motion.div
        onClick={handleFlip}
        className="relative h-72 w-full cursor-pointer [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-2xl bg-gray-800/90 p-6 text-center backdrop-blur-sm border border-white/10 [backface-visibility:hidden]">
          <div className="mb-4 rounded-full bg-emerald-500/10 p-4">
            <img
              src={imgSrc}
              alt={altText}
              className="h-16 w-16 object-contain sm:h-20 sm:w-20"
              loading="lazy"
            />
          </div>
          <h3 className="text-2xl font-bold text-emerald-500">{title}</h3>
        </div>
        <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-2xl bg-gray-800/90 p-6 text-center backdrop-blur-sm border border-white/10 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="w-12 h-1 bg-emerald-500/50 rounded-full mb-4"></div>
          <p className="text-md text-gray-300">{desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
});

interface FeaturesSectionProps {
  id: string;
}

const FeaturesSection = forwardRef<HTMLDivElement, FeaturesSectionProps>(
  (props, ref) => {
    return (
      <section
        id={props.id}
        ref={ref}
        className="py-20 bg-gray-900 z-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold text-center mb-4 text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Mengapa <span className="text-emerald-500">SplitBill</span> Pilihan Tepat?
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            Kami merancang setiap fitur untuk menghilangkan kerumitan dalam urusan keuangan bersama. Dari hitungan otomatis hingga transparansi penuh, semua ada di sini.
          </motion.p>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerFeaturesVariants}
          >
            {featuresData.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </motion.div>
        </div>
      </section>
    );
  }
);


export default memo(FeaturesSection);