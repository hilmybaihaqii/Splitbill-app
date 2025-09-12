import { MinusCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';
import type { FC } from 'react';

interface Item {
  id: string;
  name: string;
  quantity: number;
}
interface Participant {
  id: string;
  name: string;
  assignments: { [itemId: string]: number };
}

interface AssignmentsSectionProps {
  items: Item[];
  participants: Participant[];
  onAssignItem: (participantId: string, itemId: string, change: 1 | -1) => void;
}

const AssignmentsSection: FC<AssignmentsSectionProps> = memo(({ items, participants, onAssignItem }) => {
  return (
    <div className="mb-6 pb-4">
      <h2 className="text-xl font-bold text-white mb-3">Assign Items</h2>
      <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
        {items.length === 0 && (
          <p className="text-gray-500 text-center py-4">Tambahkan item untuk memulai</p>
        )}
        
        <AnimatePresence>
          {items.map((item: Item) => {
            const totalAssigned = participants.reduce((s: number, p: Participant) => s + (p.assignments?.[item.id] || 0), 0);
            const canAssignMore = totalAssigned < item.quantity;
            const progress = item.quantity > 0 ? (totalAssigned / item.quantity) * 100 : 0;

            const assignedParticipants = participants.filter((p: Participant) => (p.assignments?.[item.id] || 0) > 0);
            
            return (
              <motion.div 
                key={item.id} 
                className="p-4 rounded-lg border border-white/10 bg-gray-800/60"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1.5">
                      <p className="font-semibold text-white">{item.name}</p>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${canAssignMore ? 'bg-gray-700 text-gray-300' : 'bg-emerald-800/60 text-emerald-300'}`}>
                          {totalAssigned}/{item.quantity}
                      </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs text-gray-400 font-semibold mb-2">ASSIGNED TO:</h4>
                  <div className="flex flex-wrap gap-2 min-h-[2rem]">
                    <AnimatePresence>
                      {assignedParticipants.length > 0 ? (
                        assignedParticipants.map((p: Participant) => {
                          const qty = p.assignments?.[item.id] || 0;
                          return (
                            <motion.div 
                                key={p.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2 text-sm bg-emerald-900/70 text-emerald-300 rounded-full pl-3 pr-2 py-1"
                            >
                              <span>{p.name} <span className="text-emerald-500 font-semibold">x{qty}</span></span>
                              <motion.button 
                                onClick={() => onAssignItem(p.id, item.id, -1)} 
                                className="text-emerald-400 hover:text-white transition-colors"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <MinusCircle size={18} />
                              </motion.button>
                            </motion.div>
                          );
                        })
                      ) : (
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-gray-500 italic px-2 py-1"
                        >Not assigned to anyone yet.</motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                {canAssignMore && participants.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-dashed border-gray-700">
                    <h4 className="text-xs text-gray-400 font-semibold mb-2">AVAILABLE TO ASSIGN:</h4>
                    <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {participants.map((p: Participant) => {
                        const isAssigned = (p.assignments?.[item.id] || 0) > 0;
                        return (
                          <motion.button 
                            key={p.id} 
                            onClick={() => onAssignItem(p.id, item.id, 1)}
                            className={`flex items-center gap-2 text-sm text-gray-300 rounded-full px-3 py-1 transition-colors ${isAssigned ? 'bg-gray-700/50' : 'bg-gray-700 hover:bg-emerald-600 hover:text-white'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={!canAssignMore || isAssigned}
                          >
                            <Plus size={14} />
                            <span>{p.name}</span>
                          </motion.button>
                        );
                      })}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default AssignmentsSection;