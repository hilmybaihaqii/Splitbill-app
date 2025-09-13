import { useState, memo, useCallback } from 'react';
import { Plus, Trash2, X, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FC } from 'react';

const formatRupiah = (value: number): string => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
const cleanRupiah = (formattedValue: string): number => Number(formattedValue.replace(/[^0-9]/g, '')) || 0;

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ItemsSectionProps {
  items: Item[];
  onAddItem: (newItem: Omit<Item, 'id'>) => void;
  onDeleteItem: (id: string) => void;
}

const ItemsSection: FC<ItemsSectionProps> = memo(({ items, onAddItem, onDeleteItem }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemPriceNum, setNewItemPriceNum] = useState(0);
  
  const [newItemQty, setNewItemQty] = useState<number | ''>('');

  const resetForm = useCallback(() => {
    setNewItemName('');
    setNewItemPrice('');
    setNewItemPriceNum(1);
    setNewItemQty('');
    setIsFormVisible(false);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPriceNum || !newItemQty) return;
    
    onAddItem({ name: newItemName.trim(), price: newItemPriceNum, quantity: newItemQty });
    resetForm();
  }, [onAddItem, newItemName, newItemPriceNum, newItemQty, resetForm]);

  return (
    <div className="mb-6 pb-4 border-b border-dashed border-gray-700">
      <h2 className="text-xl font-bold text-gray-200 mb-3">Items</h2>
      <div className={`hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-3 mb-2 transition-opacity duration-300 ${items.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
        <span className="table-header">Produk</span>
        <span className="table-header text-right">Harga Satuan</span>
        <span className="table-header text-center">Qty</span>
        <span className="table-header text-right">Subtotal</span>
        <span className="w-8"></span>
      </div>

      {/* Daftar Item */}
      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2">
        <AnimatePresence>
          {items.length > 0 ? (
            items.map((i) => (
              <motion.div
                key={i.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className="bg-gray-800/50 rounded-lg p-3"
              >
                <div className="grid grid-cols-2 sm:grid-cols-[1fr_auto_auto_auto_auto] items-center gap-x-4 gap-y-2">
                  <span className="text-gray-200 font-medium break-words col-span-1">{i.name}</span>
                  <motion.button 
                    onClick={() => onDeleteItem(i.id)} 
                    className="text-gray-500 hover:text-red-500 transition-colors justify-self-end sm:order-last"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Hapus ${i.name}`}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                  <div className="text-gray-400 text-sm sm:hidden">
                    {i.quantity}x @ {formatRupiah(i.price)}
                  </div>
                  <span className="text-gray-400 text-right hidden sm:block">{formatRupiah(i.price)}</span>
                  <span className="text-gray-200 font-semibold text-center hidden sm:block">{i.quantity}</span>
                  <span className="text-emerald-400 font-medium text-right">{formatRupiah(i.price * i.quantity)}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="no-items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4 text-gray-500"
            >
              Belum ada item
            </motion.div>
          )}
        </AnimatePresence>
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
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input 
                type="text" 
                value={newItemName} 
                onChange={(e) => setNewItemName(e.target.value)} 
                placeholder="Nama Item (cth: Nasi Goreng)" 
                className="form-input w-full flex-grow" 
                required 
                autoFocus
              />
              <div className="flex gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  value={newItemPrice}
                  onChange={(e) => {
                    const numValue = cleanRupiah(e.target.value);
                    setNewItemPriceNum(numValue);
                    setNewItemPrice(numValue > 0 ? new Intl.NumberFormat('id-ID').format(numValue) : '');
                  }}
                  placeholder="Harga"
                  className="form-input w-full sm:w-32 text-right"
                  required
                />
                <input 
                  type="number" 
                  value={newItemQty} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewItemQty(val === '' ? '' : Math.max(1, parseInt(val, 10)));
                  }}
                  className="form-input w-full sm:w-20 text-center" 
                  placeholder="Qty"
                  min="1"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-1">
              <motion.button 
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16}/> Batal
              </motion.button>
              <motion.button 
                type="submit"
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={16}/> Simpan Item
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <motion.button
            layout
            onClick={() => {
              setIsFormVisible(true);
              setNewItemQty(1);
            }}
            className="w-full text-center p-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-emerald-400 hover:border-emerald-600 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusCircle size={18} />
            Tambah Item Baru
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ItemsSection;
