// src/components/bill/ParticipantsSection.tsx

import { useState, memo } from 'react';
import { PlusCircle, Trash2, UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FC } from 'react';

interface Participant {
  id: string;
  name: string;
  email?: string;
}

interface ParticipantsSectionProps {
  participants: Participant[];
  onAddParticipant: (data: { name?: string; email?: string }, type: 'guest' | 'registered') => void;
  onDeleteParticipant: (id: string) => void;
}

const getInitial = (name: string) => (name ? name[0].toUpperCase() : '?');

const ParticipantsSection: FC<ParticipantsSectionProps> = memo(({ participants, onAddParticipant, onDeleteParticipant }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [participantType, setParticipantType] = useState<'guest' | 'registered'>('guest');

  const resetForm = () => {
    setNewParticipantName('');
    setNewParticipantEmail('');
    setParticipantType('guest');
    setIsFormVisible(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (participantType === 'guest') {
      if (!newParticipantName) return;
      onAddParticipant({ name: newParticipantName }, 'guest');
    } else {
      if (!newParticipantEmail) return;
      onAddParticipant({ email: newParticipantEmail }, 'registered');
    }
    resetForm();
  };

  return (
    <div className="mb-6 pb-4 border-b border-dashed border-gray-700">
      <h2 className="text-xl font-bold text-white mb-3">Participants</h2>

      <div className="space-y-2 mb-4 max-h-32 overflow-y-auto pr-2">
        <AnimatePresence>
          {participants.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              className="flex justify-between items-center p-3 bg-gray-800/60 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-800/50 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-300">{getInitial(p.name)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  {p.email && <p className="text-xs text-gray-500 truncate">{p.email}</p>}
                </div>
              </div>
              <motion.button 
                onClick={() => onDeleteParticipant(p.id)} 
                className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-red-500/10 transition-colors flex-shrink-0 ml-2"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 size={16} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
        {participants.length === 0 && !isFormVisible && (
            <p className="text-sm text-center text-gray-500 py-2">Belum ada anggota nih...</p>
        )}
      </div>
      
      <AnimatePresence>
        {isFormVisible ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="p-2 bg-gray-800/60 border border-white/10 rounded-lg">
              <div className="relative flex items-center justify-center bg-gray-900 rounded-lg mb-2">
                {['guest', 'registered'].map((type) => (
                  <button 
                    type="button" 
                    key={type}
                    onClick={() => setParticipantType(type as 'guest' | 'registered')} 
                    className={`relative flex-1 p-2 rounded-md text-sm font-semibold transition-colors ${participantType === type ? 'text-white' : 'text-gray-400'}`}
                  >
                    <span className="relative z-10">
                        {type === 'guest' ? 'Tamu' : 'Terdaftar'}
                    </span>
                    {participantType === type && (
                        <motion.div 
                        layoutId="participantTypeGlider" 
                        className="absolute inset-0 bg-emerald-500 rounded-md z-0" 
                        />
                    )}
                  </button>
                ))}
              </div>
              
              <input
                type={participantType === 'guest' ? 'text' : 'email'}
                value={participantType === 'guest' ? newParticipantName : newParticipantEmail}
                onChange={(e) => participantType === 'guest' ? setNewParticipantName(e.target.value) : setNewParticipantEmail(e.target.value)}
                placeholder={participantType === 'guest' ? 'Nama Peserta' : 'Email Pengguna Terdaftar'}
                className="w-full bg-transparent p-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                required
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2">
                <motion.button 
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-700/50 hover:bg-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <X size={16}/> Batal
                </motion.button>
                <motion.button 
                    type="submit"
                    className="relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-xl shadow-emerald-500/20 overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <UserPlus size={16}/> Simpan Peserta
                    <span className="absolute inset-0 w-full h-full bg-white opacity-10 blur-xl group-hover:opacity-0 transition-opacity duration-300"></span>
                </motion.button>
            </div>
          </motion.form>
        ) : (
          <motion.button
            layout
            onClick={() => setIsFormVisible(true)}
            className="w-full text-center p-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-emerald-400 hover:border-emerald-600 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusCircle size={18} />
            Tambah Anggota
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ParticipantsSection;