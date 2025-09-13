import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { Mail, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, X, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import loginAnimation from '../assets/animations/login.json';

type NotificationType = 'success' | 'error';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

function Notification({ message, type, onClose }: NotificationProps) {
  const isError = type === 'error';
  const accentColor = isError ? 'border-red-500' : 'border-emerald-500';
  const Icon = isError ? AlertTriangle : CheckCircle;

  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
      className={`fixed top-5 right-5 z-50 w-full max-w-sm overflow-hidden rounded-xl bg-gray-800/80 backdrop-blur-lg border ${accentColor} border-l-4 shadow-2xl`}
    >
      <div className="p-4 flex items-start">
        <div className={`mr-3 flex-shrink-0 ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{message}</p>
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex rounded-md p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <motion.div
        className={`h-1 ${isError ? 'bg-red-500' : 'bg-emerald-500'}`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
      />
    </motion.div>
  );
}

const getFriendlyAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email atau kata sandi yang Anda masukkan salah.';
    default:
      return 'Terjadi kesalahan. Silakan coba lagi.';
  }
};

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType | '' }>({ message: '', type: '' });
  const navigate = useNavigate();
    
  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
  };
  
  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Alamat email tidak boleh kosong.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format alamat email tidak valid.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Kata sandi tidak boleh kosong.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setNotification({ message: '', type: '' });

    try {
      const persistenceType = rememberMe 
      ? browserLocalPersistence
      : browserSessionPersistence;

      await setPersistence(auth, persistenceType);

      await signInWithEmailAndPassword(auth, email, password);
      showNotification('Login berhasil! Mengalihkan...', 'success');
      setTimeout(() => navigate('/dashboard'), 1500); 
    } catch (err) {
      const errorMessage = (err instanceof FirebaseError)
        ? getFriendlyAuthErrorMessage(err.code)
        : 'Terjadi kesalahan yang tidak diketahui.';
      showNotification(errorMessage, 'error');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        showNotification('Masukkan email yang valid untuk reset password.', 'error');
        return;
    }
    
    setIsLoading(true);
    setNotification({ message: '', type: '' });

    try {
      await sendPasswordResetEmail(auth, email);
      showNotification('Tautan reset kata sandi telah dikirim ke email Anda.', 'success');
    } catch (err) {
      console.error("Gagal mengirim email reset:", err);
      showNotification('Gagal mengirim email. Pastikan email Anda benar.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  } as const;

  const lottieVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.3,
      },
    },
  } as const;

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex items-center justify-center p-4 pt-24 sm:pt-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900/50" />
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-500/10 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-emerald-500/10 rounded-full filter blur-3xl animate-pulse" />

      <Link
        to="/"
        className="absolute top-6 left-6 z-20 px-4 py-2 rounded-lg bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Kembali
      </Link>

      <AnimatePresence>
        {notification.message && notification.type && (
          <Notification 
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ message: '', type: '' })}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-gray-800/50 backdrop-blur-xl border border-white/10"
      >
        <motion.div
          variants={lottieVariants}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex lg:w-1/2 p-8 flex-col items-center justify-center bg-gray-700/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,theme(colors.teal.600/20)_0%,transparent_70%)] blur-3xl"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3000 opacity-60"></div>
          
          <Lottie 
            animationData={loginAnimation}
            loop={true} 
            autoplay={true}
            className="w-full max-w-[18rem] lg:max-w-sm relative z-10"
          />
        </motion.div>

        <motion.div 
          className="w-full lg:w-1/2 p-8 md:p-12 flex items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full max-w-md">
            <motion.div variants={itemVariants} className="text-center mb-8">
              <Link to="/">
                <img src="/logo.png" alt="SplitBill Pro Logo" className="h-10 w-auto mx-auto mb-4" />
              </Link>
              <h2 className="text-3xl font-bold text-white">Selamat Datang Kembali</h2>
              <p className="text-gray-400 mt-2">Masuk untuk melanjutkan petualanganmu.</p>
            </motion.div>

            <motion.form variants={itemVariants} onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white/5 rounded-lg border transition-all text-white placeholder-gray-500 ${errors.email ? 'border-red-500' : 'border-transparent focus:border-emerald-500'} focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                      placeholder="Alamat Email"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2.5 bg-white/5 rounded-lg border transition-all text-white placeholder-gray-500 ${errors.password ? 'border-red-500' : 'border-transparent focus:border-emerald-500'} focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                      placeholder="Kata Sandi"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 mb-6">
                <label className="flex items-center select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-300">Ingat Saya</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-emerald-400 hover:underline disabled:opacity-50"
                  disabled={isLoading || !email}
                >
                  Lupa Kata Sandi?
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Masuk"}
              </motion.button>
            </motion.form>

            <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-gray-400">
              Belum punya akun?{' '}
              <Link to="/register" className="font-semibold text-emerald-400 hover:underline">
                Daftar Sekarang
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginPage;