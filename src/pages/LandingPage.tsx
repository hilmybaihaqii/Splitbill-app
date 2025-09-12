import { useRef, useEffect, useState } from "react";
import type { RefObject } from "react";
import Header from "../components/Home/Header";
import HeroSection from "../components/Home/HeroSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import FAQSection from "../components/Home/FAQSection";
import CTASection from "../components/Home/CTASection";
import Footer from "../components/Home/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

type SectionRefs = RefObject<HTMLElement | null>[];

const useIntersectionObserver = (
  refs: SectionRefs,
  threshold = 0.5
): string => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold }
    );

    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [refs, threshold]);

  return activeSection;
};

const LandingPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const qnaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const activeSection = useIntersectionObserver([
    heroRef,
    featuresRef,
    qnaRef,
    ctaRef,
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-cover bg-center">
        <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header activeSection={activeSection} />
        <HeroSection ref={heroRef} id="hero" />
        <FeaturesSection ref={featuresRef} id="features" />
        <FAQSection ref={qnaRef} id="qna" />
        <CTASection ref={ctaRef} id="cta" />
        <Footer />
      </div>

      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            onClick={scrollToTop}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            whileHover={{ y: -5 }} 
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="fixed bottom-6 right-6 z-50 p-4 bg-teal-500 rounded-full shadow-lg text-white hover:bg-teal-600 transition-colors overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-20 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isHovered
                  ? { scale: 1.5, opacity: 0.2 }
                  : { scale: 0, opacity: 0 }
              }
              transition={{ duration: 0.4 }}
            />
            <ChevronUp size={32} className="relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
