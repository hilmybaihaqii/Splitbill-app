import { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { href: 'hero', text: 'Home' },
  { href: 'features', text: 'Fitur' },
  { href: 'qna', text: 'Q&A' },
  { href: 'cta', text: 'Mulai' },
];

interface HeaderProps {
  activeSection: string;
}

interface DesktopNavProps {
  activeSection: string;
}

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  activeSection: string;
}

const DesktopNav = memo(({ activeSection }: DesktopNavProps) => {
  return (
    <nav className="space-x-6 hidden md:flex">
      {navItems.map((item) => (
        <motion.a
          key={item.href}
          href={`#${item.href}`}
          whileHover={{ y: -5, scale: 1.02 }} 
          className={`relative text-white hover:text-emerald-400 transition-colors py-2 group ${activeSection === item.href ? 'text-emerald-400 font-semibold' : ''}`} // Diperbarui
        >
          {item.text}
          <span className={`absolute bottom-0 left-1/2 h-0.5 bg-emerald-400 transition-all duration-300 transform -translate-x-1/2 ${activeSection === item.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </motion.a>
      ))}
    </nav>
  );
});

const DesktopButtons = memo(() => (
  <div className="hidden md:flex space-x-4 items-center">
    <motion.div whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.95 }}>
      <Link to="/login" className="px-5 py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-xl shadow-emerald-500/30">
        Masuk
      </Link>
    </motion.div>
    <motion.div whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.95 }}>
      <Link to="/register" className="px-5 py-2.5 rounded-full text-sm font-medium text-emerald-400 border border-emerald-400/50 hover:border-emerald-400 hover:bg-emerald-400/10 hover:text-white transition-colors">
        Daftar
      </Link>
    </motion.div>
  </div>
));

const MobileMenu = memo(({ isMenuOpen, toggleMenu, activeSection }: MobileMenuProps) => {
  const menuVariants = {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  };
  const menuOverlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={menuOverlayVariants}
            onClick={toggleMenu}
            className="fixed inset-0 z-40 bg-gray-900/50"
          />
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={menuVariants}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-gray-800 p-8 shadow-xl flex flex-col justify-between"
          >
            <div className="flex flex-col">
              <div className="flex justify-end mb-8">
                <motion.button onClick={toggleMenu} className="p-2 text-gray-300" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <X size={24} />
                </motion.button>
              </div>
              <div className="flex flex-col space-y-6 text-xl">
                {navItems.map((item) => (
                  <motion.a
                    key={item.href}
                    href={`#${item.href}`}
                    onClick={toggleMenu}
                    className={`relative text-white hover:text-emerald-400 transition-colors py-2 group ${activeSection === item.href ? 'text-emerald-400 font-semibold' : ''}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {item.text}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-400 transition-all duration-300 transform -translate-x-1/2 group-hover:w-full"></span>
                  </motion.a>
                ))}
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <Link to="/login" onClick={toggleMenu} className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-xl shadow-emerald-500/30 text-center">
                Masuk
              </Link>
              <Link to="/register" onClick={toggleMenu} className="px-4 py-2 rounded-lg font-medium text-emerald-400 border border-emerald-400 hover:bg-emerald-400/10 hover:text-white transition-colors text-center">
                Daftar
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

const Header = ({ activeSection }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <header className="py-4 px-6 lg:px-12 fixed top-0 w-full z-50 transition-all duration-300 bg-gray-900/90">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center space-x-2">
          <Link to="/">
            <img src="/logo.png" alt="SplitBill Logo" className="h-8 w-auto lg:h-10" />
          </Link>
        </motion.div>
        
        <DesktopNav activeSection={activeSection} />
        <DesktopButtons />

        <div className="md:hidden">
          <motion.button onClick={toggleMenu} className="p-2 text-gray-300" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>
      <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} activeSection={activeSection} />
    </header>
  );
};

export default memo(Header);