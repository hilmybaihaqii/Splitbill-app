import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import type { Variants } from 'framer-motion';

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.2,
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
      damping: 10,
    },
  },
};

const navItems = [
  { href: '#hero', text: 'Home' },
  { href: '#features', text: 'Fitur' },
  { href: '#qna', text: 'Q&A' },
];

const socialLinks = [
    { href: 'https://www.facebook.com/share/1EikutcRt7/?mibextid=wwXIfr', icon: Facebook, name: 'Facebook' },
    { href: 'https://www.instagram.com/hilmybaihaaqi_/', icon: Instagram, name: 'Instagram' },
    { href: 'https://www.linkedin.com/in/hilmy-baihaqi', icon: Linkedin, name: 'Linkedin' },
];

const Footer = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <motion.footer
      ref={ref}
      className="bg-gray-900 text-gray-400 relative overflow-hidden border-t border-white/10"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <motion.div variants={itemVariants} className="mb-4">
              <Link to="/" className="inline-block">
                <img src="/logo.png" alt="SplitBill Logo" className="h-10 w-auto" />
              </Link>
            </motion.div>
            <motion.p variants={itemVariants} className="max-w-xs text-sm">
              Membagi tagihan dengan mudah, cepat, dan transparan.
            </motion.p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <motion.h3 variants={itemVariants} className="font-bold text-white mb-4 text-xl">Navigasi</motion.h3>
            <motion.ul variants={itemVariants} className="space-y-3">
              {navItems.map(item => (
                <motion.li
                  key={item.text}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a href={item.href} className="hover:text-emerald-500 transition-colors text-base font-medium">
                    {item.text}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <motion.h3 variants={itemVariants} className="font-bold text-white mb-4 text-xl">Ikuti Kami</motion.h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks.map((social) => (
                <motion.a 
                  key={social.name} 
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  <social.icon size={26} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          <motion.p variants={itemVariants}>
            &copy; {new Date().getFullYear()} SplitBill. Semua Hak Cipta Dilindungi.
          </motion.p>
        </div>
      </div>
    </motion.footer>
  );
});

export default Footer;