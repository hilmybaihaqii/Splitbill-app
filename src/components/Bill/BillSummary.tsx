import { useEffect, memo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Percent, ConciergeBell, TicketPercent, Calculator } from 'lucide-react';
import type { FC } from 'react';

const formatRupiah = (value: number | string): string => {
  if (value === 0 || value === '' || isNaN(Number(value))) return '';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(value));
};
const cleanRupiah = (formattedValue: string): number => Number(formattedValue.replace(/[^0-9]/g, '')) || 0;

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
interface Bill {
  taxPercent: number;
  serviceFee: number;
  discount?: string;
}
interface Totals {
  subtotal: number;
  tax: number;
  service: number;
  discount: number;
  grandTotal: number;
}
interface BillSummaryProps {
  bill: Bill;
  totals: Totals;
  items: Item[];
  onUpdate: (field: keyof Bill, value: string | number) => void;
  onCalculate: () => void;
  canCalculate: boolean;
}

const BillSummary: FC<BillSummaryProps> = memo(({ bill, totals, items, onUpdate, onCalculate, canCalculate }) => {
  const taxRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (taxRef.current) taxRef.current.value = bill.taxPercent.toString();
    if (serviceRef.current) serviceRef.current.value = formatRupiah(bill.serviceFee);
    if (discountRef.current) discountRef.current.value = bill.discount || '';
  }, [bill]);
  
  const handleTaxBlur = useCallback(() => {
    if (taxRef.current) {
      const value = parseFloat(taxRef.current.value);
      if (!isNaN(value)) {
        onUpdate('taxPercent', value);
      } else {
        taxRef.current.value = bill.taxPercent.toString();
      }
    }
  }, [onUpdate, bill.taxPercent]);

  const handleServiceBlur = useCallback(() => {
    if (serviceRef.current) {
      const rawValue = cleanRupiah(serviceRef.current.value);
      onUpdate('serviceFee', rawValue);
      serviceRef.current.value = formatRupiah(rawValue);
    }
  }, [onUpdate]);

  const handleDiscountBlur = useCallback(() => {
    if (discountRef.current) {
      onUpdate('discount', discountRef.current.value);
    }
  }, [onUpdate]);

  const InputRow = ({ icon, label, children }: { icon: React.ReactNode, label: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-4 py-2">
      <label className="flex items-center gap-3 text-sm text-gray-400 whitespace-nowrap">
        {icon}
        <span>{label}</span>
      </label>
      {children}
    </div>
  );

  return (
    <motion.div 
      className="mt-6 space-y-4 bg-gray-800/40 border border-white/10 rounded-xl p-5 backdrop-blur-sm shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {items.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-200 mb-2">Item Details</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-400">
                <span className="flex-grow pr-2">{item.name} <span className="text-gray-500">({item.quantity}x)</span></span>
                <span className="flex-shrink-0">{formatRupiah(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <hr className="border-dashed border-gray-700 mt-4" />
        </div>
      )}

      <div>
        <InputRow icon={<Percent size={16} />} label="Tax">
          <div className="flex items-center gap-2">
            <input 
              ref={taxRef}
              type="text"
              defaultValue={bill.taxPercent}
              onBlur={handleTaxBlur} 
              placeholder="12" 
              className="w-20 p-2 bg-gray-800/60 border border-white/10 rounded-md text-right text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            />
            <span className="text-gray-400">%</span>
          </div>
        </InputRow>
        <InputRow icon={<ConciergeBell size={16} />} label="Service Fee">
          <input 
            ref={serviceRef}
            type="text" 
            defaultValue={formatRupiah(bill.serviceFee)}
            onBlur={handleServiceBlur} 
            placeholder="Rp. 10.000" 
            className="w-28 p-2 bg-gray-800/60 border border-white/10 rounded-md text-right text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
          />
        </InputRow>
        <InputRow icon={<TicketPercent size={16} />} label="Discount">
          <input 
            ref={discountRef}
            type="text" 
            defaultValue={bill.discount || ''}
            onBlur={handleDiscountBlur} 
            placeholder="10%" 
            className="w-28 p-2 bg-gray-800/60 border border-white/10 rounded-md text-right text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
          />
        </InputRow>
      </div>

      <hr className="border-dashed border-gray-700" />
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal</span>
          <span className="text-white font-medium">{formatRupiah(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Tax ({bill.taxPercent || 0}%)</span>
          <span className="font-medium">+ {formatRupiah(totals.tax)}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Service Fee</span>
          <span className="font-medium">+ {formatRupiah(totals.service)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-red-400">
            <span className="font-medium">Discount</span>
            <span className="font-medium">- {formatRupiah(totals.discount)}</span>
          </div>
        )}
      </div>

      <div className="pt-3 flex justify-between items-center border-t-2 border-white/10">
        <span className="font-bold text-base text-emerald-300 uppercase tracking-wider">Grand Total</span>
        <span className="font-extrabold text-xl text-white tracking-tight">{formatRupiah(totals.grandTotal)}</span>
      </div>
      
      <motion.button 
        onClick={onCalculate} 
        disabled={!canCalculate} 
        className="w-full relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3.5 rounded-lg text-lg transition-all duration-300 shadow-xl shadow-emerald-500/20 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:from-gray-700 disabled:to-gray-600 disabled:hover:from-gray-700 disabled:hover:to-gray-600 flex items-center justify-center gap-2 overflow-hidden group" 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
      >
        <Calculator size={20} />
        SPLIT THE BILL
        <span className="absolute inset-0 w-full h-full bg-white opacity-10 blur-xl group-hover:opacity-0 transition-opacity duration-300"></span>
      </motion.button>
    </motion.div>
  );
});

export default BillSummary;