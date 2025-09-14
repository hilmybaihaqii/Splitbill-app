import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser, updateProfile, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, KeyRound, Trash2, User, Lock, Mail, Shield, AlertTriangle, LogOut } from 'lucide-react';

// =================================================================================
// 1. SEMUA KOMPONEN PENUNJANG DIDEFINISIKAN DI SINI
// =================================================================================

interface AvatarProps {
  name: string;
}
const Avatar: React.FC<AvatarProps> = ({ name }) => {
  const initials = name.split(' ').map((part: string) => part.charAt(0).toUpperCase()).join('');
  return (
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-4xl shadow-lg ring-4 ring-gray-700">
      {initials}
    </div>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'default' | 'danger';
}
const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick, variant = 'default' }) => {
    const baseClasses = 'flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200';
    const defaultVariantClasses = 'text-gray-400 hover:bg-gray-700/50 hover:text-white';
    const dangerVariantClasses = 'text-red-400/80 hover:bg-red-500/10 hover:text-red-400';
    
    const activeClasses = isActive 
      ? (variant === 'danger' ? 'bg-red-500/20 text-red-400 font-semibold' : 'bg-emerald-500/10 text-emerald-400 font-semibold')
      : (variant === 'danger' ? dangerVariantClasses : defaultVariantClasses);
  
    return (
      <button onClick={onClick} className={`${baseClasses} ${activeClasses}`}>
        <Icon size={22} className="mr-4" />
        <span className="text-md">{label}</span>
      </button>
    );
};

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
}
const InputField: React.FC<InputFieldProps> = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon size={20} className="text-gray-500" />
        </div>
        <input
            {...props}
            className="block w-full pl-12 pr-4 py-3 bg-gray-800/60 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-colors placeholder-gray-500"
        />
    </div>
);

interface ActionButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  icon: React.ElementType;
  variant?: 'primary' | 'danger';
  onClick?: () => void;
  type?: 'submit' | 'button';
  disabled?: boolean;
}
const ActionButton: React.FC<ActionButtonProps> = 
({ label, loadingLabel, isLoading, icon: Icon, variant = 'primary', ...props }) => {
    const variantClasses: Record<'primary' | 'danger', string> = {
        primary: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
    };
    const baseClasses = "flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

    return (
        <motion.button
            className={`${baseClasses} ${variantClasses[variant]}`}
            disabled={isLoading || props.disabled}
            whileHover={{ scale: !isLoading && !props.disabled ? 1.03 : 1 }}
            whileTap={{ scale: !isLoading && !props.disabled ? 0.97 : 1 }}
            {...props}
        >
            <Icon size={18} />
            {isLoading ? loadingLabel : label}
        </motion.button>
    );
};

interface ProfileSettingsProps {
    user: FirebaseUser | null;
}
const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
    const [newName, setNewName] = useState(user?.displayName || '');
    const [isUpdatingName, setIsUpdatingName] = useState(false);

    const handleNameUpdate = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newName.trim()) return;

        setIsUpdatingName(true);
        try {
            await updateProfile(user, { displayName: newName });
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { name: newName });
            toast.success('Nama berhasil diperbarui!');
        } catch (error) {
            console.error("Error updating name: ", error);
            toast.error('Gagal memperbarui nama.');
        } finally {
            setIsUpdatingName(false);
        }
    }, [user, newName]);
    
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl font-bold mb-1 text-white">Informasi Profil</h2>
            <p className="text-gray-400 mb-6">Perbarui nama tampilan dan email Anda.</p>
            <form onSubmit={handleNameUpdate} className="space-y-6">
                <InputField icon={Mail} type="email" value={user?.email || ''} disabled readOnly />
                <InputField icon={User} type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama Tampilan Baru" />
                <div className="pt-2">
                    <ActionButton
                        type="submit"
                        label="Simpan Perubahan"
                        loadingLabel="Menyimpan..."
                        isLoading={isUpdatingName}
                        icon={Save}
                    />
                </div>
            </form>
        </motion.div>
    );
};

interface SecuritySettingsProps {
    user: FirebaseUser | null;
}
const SecuritySettings: React.FC<SecuritySettingsProps> = ({ user }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handlePasswordUpdate = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !currentPassword || !newPassword) {
            toast.warn('Harap isi semua kolom kata sandi.');
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const credential = EmailAuthProvider.credential(user.email!, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            toast.success('Kata sandi berhasil diperbarui!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            console.error("Error updating password: ", error);
            toast.error('Gagal memperbarui. Periksa kembali sandi Anda saat ini.');
        } finally {
            setIsUpdatingPassword(false);
        }
    }, [user, currentPassword, newPassword]);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl font-bold mb-1 text-white">Keamanan Akun</h2>
            <p className="text-gray-400 mb-6">Ubah kata sandi Anda secara berkala untuk menjaga keamanan akun.</p>
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <InputField icon={Lock} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Kata Sandi Saat Ini" required />
                <InputField icon={KeyRound} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Kata Sandi Baru" required />
                <div className="pt-2">
                     <ActionButton
                        type="submit"
                        label="Ganti Kata Sandi"
                        loadingLabel="Memperbarui..."
                        isLoading={isUpdatingPassword}
                        icon={Shield}
                    />
                </div>
            </form>
        </motion.div>
    );
};

interface DeleteAccountSettingsProps {
    openModal: () => void;
}
const DeleteAccountSettings: React.FC<DeleteAccountSettingsProps> = ({ openModal }) => {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl font-bold mb-1 text-red-400">Zona Berbahaya</h2>
            <p className="text-gray-400 mb-6">Tindakan ini tidak dapat diurungkan. Semua data Anda akan dihapus secara permanen.</p>
            <ActionButton
                onClick={openModal}
                label="Hapus Akun Saya"
                loadingLabel="Menghapus..."
                isLoading={false}
                icon={Trash2}
                variant="danger"
            />
        </motion.div>
    );
};

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: FirebaseUser | null;
}
const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate();
    const [deletePassword, setDeletePassword] = useState('');
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const handleDeleteAccount = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !deletePassword) {
            toast.warn("Harap masukkan kata sandi Anda untuk konfirmasi.");
            return;
        }

        setIsDeletingAccount(true);
        try {
            const credential = EmailAuthProvider.credential(user.email!, deletePassword);
            await reauthenticateWithCredential(user, credential);
            await deleteDoc(doc(db, 'users', user.uid));
            await deleteUser(user);
            toast.success('Akun berhasil dihapus!');
            navigate('/login');
        } catch (error) {
            console.error("Error deleting account: ", error);
            toast.error('Gagal menghapus akun. Kata sandi salah.');
        } finally {
            setIsDeletingAccount(false);
            setDeletePassword('');
            onClose();
        }
    }, [user, deletePassword, navigate, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-gray-800 rounded-2xl border border-red-500/30 shadow-xl p-8 max-w-md w-full"
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-6">
                                <AlertTriangle className="h-8 w-8 text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Anda Yakin?</h3>
                            <p className="text-gray-400 mb-6">Tindakan ini bersifat permanen. Untuk melanjutkan, masukkan kata sandi Anda.</p>
                        </div>
                        <form onSubmit={handleDeleteAccount} className="space-y-4">
                            <InputField 
                                icon={Lock}
                                type="password" 
                                value={deletePassword} 
                                onChange={(e) => setDeletePassword(e.target.value)}
                                placeholder="Konfirmasi Kata Sandi"
                                required
                            />
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-5 rounded-lg transition-colors">Batal</button>
                                <ActionButton
                                    type="submit"
                                    label="Hapus Akun Permanen"
                                    loadingLabel="Menghapus..."
                                    isLoading={isDeletingAccount}
                                    icon={Trash2}
                                    variant="danger"
                                />
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-2xl border border-white/10 shadow-xl p-8 max-w-sm w-full text-center"
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-500/10 mb-6">
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Konfirmasi Logout</h3>
            <p className="text-gray-400 mb-8">Apakah Anda yakin ingin keluar dari sesi ini?</p>
            <div className="flex justify-center gap-4">
              <button onClick={onClose} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-colors">Batal</button>
              <ActionButton onClick={onConfirm} label="Keluar" loadingLabel="Keluar..." isLoading={false} icon={LogOut} variant="danger"/>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
);
  

// =================================================================================
// 2. KOMPONEN UTAMA HALAMAN SETTINGS
// =================================================================================

function SettingsPage() {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [activeTab, setActiveTab] = useState('profile');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogout = useCallback(async () => {
      try {
        await signOut(auth);
        toast.success("Anda berhasil logout.");
        navigate('/login');
      } catch (error) {
        console.error("Error signing out: ", error);
        toast.error("Gagal untuk logout.");
      }
    }, [navigate]);

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileSettings user={user} />;
            case 'security': return <SecuritySettings user={user} />;
            case 'delete': return <DeleteAccountSettings openModal={() => setIsDeleteModalOpen(true)} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 text-white font-sans relative overflow-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px]"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex items-center mb-10"
                >
                    <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors mr-6 p-2 rounded-full hover:bg-gray-800" title="Kembali ke Dashboard">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Pengaturan Akun</h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <motion.aside 
                        className="lg:col-span-3"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 border border-white/10 space-y-1 sticky top-8">
                            <div className="flex flex-col items-center p-4 mb-4 text-center">
                                <Avatar name={user?.displayName || 'Pengguna'} />
                                <h2 className="text-xl font-bold mt-4 text-white truncate max-w-full">{user?.displayName || 'Pengguna'}</h2>
                                <p className="text-sm text-gray-400 truncate max-w-full">{user?.email}</p>
                            </div>
                            <NavItem icon={User} label="Profil" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                            <NavItem icon={Shield} label="Keamanan" isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                            
                            <hr className="border-gray-700/60 my-2" />
                            
                            <NavItem icon={Trash2} label="Hapus Akun" isActive={activeTab === 'delete'} onClick={() => setActiveTab('delete')} variant="danger" />
                            
                             <button
                                onClick={() => setIsLogoutModalOpen(true)}
                                className="flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
                            >
                                <LogOut size={22} className="mr-4" />
                                <span className="text-md">Logout</span>
                            </button>
                        </div>
                    </motion.aside>

                    <motion.main 
                        className="lg:col-span-9"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10 min-h-[400px] shadow-2xl shadow-black/20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {renderContent()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.main>
                </div>
            </div>
            
            <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} user={user} />
            <LogoutConfirmModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogout} />
        </div>
    );
}

export default memo(SettingsPage);