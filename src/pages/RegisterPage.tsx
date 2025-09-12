import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { User, Mail, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, X, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
          <button onClick={onClose} className="inline-flex rounded-md p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
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
    case 'auth/email-already-in-use':
      return 'Alamat email ini sudah terdaftar. Silakan coba login.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.';
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid.';
    default:
      return 'Terjadi kesalahan. Silakan coba lagi nanti.';
  }
};

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType | '' }>({ message: '', type: '' });
  const navigate = useNavigate();

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
  };

  const validateForm = (): boolean => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Nama lengkap tidak boleh kosong.';
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = 'Alamat email tidak boleh kosong.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format alamat email tidak valid.';
      isValid = false;
    }
    if (password.length < 6) {
      newErrors.password = 'Kata sandi minimal harus 6 karakter.';
      isValid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi tidak cocok.';
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: name,
        createdAt: new Date().toISOString(),
      });

      showNotification('Akun berhasil dibuat! Mengalihkan ke halaman login...', 'success');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      console.error("Registrasi Gagal:", err);
      const errorMessage = (err instanceof FirebaseError)
        ? getFriendlyAuthErrorMessage(err.code)
        : 'Terjadi kesalahan yang tidak diketahui.';
      showNotification(errorMessage, 'error');
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900/50" />
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-teal-500/10 rounded-full filter blur-3xl animate-pulse delay-1000" />
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-emerald-500/10 rounded-full filter blur-3xl animate-pulse" />

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
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <Link to="/">
                <img src="/logo.png" alt="SplitBill Pro Logo" className="h-10 w-auto mx-auto mb-4" />
              </Link>
              <h2 className="text-3xl font-bold text-white">Buat Akun Baru</h2>
              <p className="text-gray-400 mt-2">Gabung dan mulai berbagi tagihan dengan mudah.</p>
            </motion.div>

            <motion.form onSubmit={handleSubmit} noValidate>
              <motion.div variants={itemVariants} className="space-y-4">
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white/5 rounded-lg border transition-all text-white placeholder-gray-500 ${errors.name ? 'border-red-500' : 'border-transparent focus:border-emerald-500'} focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                      placeholder="Nama Lengkap" required disabled={isLoading} />
                  </div>
                  {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white/5 rounded-lg border transition-all text-white placeholder-gray-500 ${errors.email ? 'border-red-500' : 'border-transparent focus:border-emerald-500'} focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                      placeholder="Alamat Email" required disabled={isLoading} />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2.5 bg-white/5 rounded-lg border transition-all text-white placeholder-gray-500 ${errors.password ? 'border-red-500' : 'border-transparent focus:border-emerald-500'} focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                      placeholder="Kata Sandi" required disabled={isLoading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2.5 bg-white/5 rounded-lg border transition-all text-white placeholder-gray-500 ${errors.confirmPassword ? 'border-red-500' : 'border-transparent focus:border-emerald-500'} focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                      placeholder="Konfirmasi Kata Sandi" required disabled={isLoading} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6">
                <button type="submit"
                  className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Buat Akun"}
                </button>
              </motion.div>
            </motion.form>

            <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-gray-400">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-semibold text-emerald-400 hover:underline">
                Masuk di sini
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterPage;