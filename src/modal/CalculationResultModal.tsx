import { motion, AnimatePresence } from 'framer-motion';
import { type Result } from '../utils/itemizedCalculator';
import React, { useState, useRef } from 'react';
import { X, Download, ClipboardCopy, CheckCircle, RotateCw, Undo2 } from 'lucide-react';

export interface EnhancedResult extends Result {
  id: string;
  isPaid: boolean;
  name: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  personalSubtotal: number;
  personalTax: number;
  personalService: number;
  total: number;
}

interface CalculationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: EnhancedResult[];
  onDownload: () => Promise<void>;
  onMarkAsPaid: (participantId: string) => Promise<void>;
  onCancelPaid: (participantId: string) => Promise<void>;
  billName: string;
}

const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const ParticipantCard: React.FC<{ 
  result: EnhancedResult; 
  onMarkAsPaid: (id: string) => Promise<void>;
  onCancelPaid: (id: string) => Promise<void>;
}> = ({ result, onMarkAsPaid, onCancelPaid }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMarkAsPaid = async () => {
    setIsPaying(true);
    await onMarkAsPaid(result.id);
    setIsPaying(false);
  };

  const handleCancelPaid = async () => {
    setIsCancelling(true);
    await onCancelPaid(result.id);
    setIsCancelling(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.total.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`p-4 bg-gray-800/60 rounded-lg mb-3 border border-white/10 transition-all duration-300 ${result.isPaid ? 'opacity-70 bg-emerald-800/20 border-emerald-500' : 'hover:border-emerald-500'}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">{result.name}</h3>
        {result.isPaid && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-900/50 px-3 py-1 rounded-full"><CheckCircle size={14} /> LUNAS</div>
            <motion.button 
              onClick={handleCancelPaid} 
              disabled={isCancelling}
              className="flex items-center gap-1.5 text-xs bg-yellow-900/60 text-yellow-400 hover:bg-yellow-800/80 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
              title="Batalkan Status Lunas"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCancelling ? (
                <RotateCw size={14} className="animate-spin" />
              ) : (
                <>
                  <Undo2 size={14} />
                  <span>Batalkan</span>
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>
      
      <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-gray-400 pl-1">
        {result.items.map((item, i) => (
          <li key={i}>
            {item.name} ({item.quantity}x) - {formatRupiah(item.price)}
          </li>
        ))}
      </ul>
      
      <div className="text-sm text-gray-400 space-y-1 mt-3 border-t border-dashed border-gray-700 pt-2">
        <div className="flex justify-between"><span>Subtotal Item:</span> <span>{formatRupiah(result.personalSubtotal)}</span></div>
        <div className="flex justify-between"><span>Pajak:</span> <span>{formatRupiah(result.personalTax)}</span></div>
        <div className="flex justify-between"><span>Service:</span> <span>{formatRupiah(result.personalService)}</span></div>
      </div>
      
      <div className="flex justify-between items-center font-bold text-lg pt-2 mt-2 border-t border-gray-600 text-emerald-400">
        <span>TOTAL:</span>
        <div className="flex items-center gap-3">
          <span>{formatRupiah(result.total)}</span>
          <motion.button 
            onClick={handleCopy} 
            className="text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <ClipboardCopy size={18} />}
          </motion.button>
        </div>
      </div>

      {!result.isPaid && (
        <motion.button
          onClick={handleMarkAsPaid}
          disabled={isPaying}
          className="w-full mt-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold py-2 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPaying ? <><RotateCw size={16} className="animate-spin" /> Memproses...</> : 'Tandai Sudah Lunas'}
        </motion.button>
      )}
    </motion.div>
  );
};


const CalculationResultModal: React.FC<CalculationResultModalProps> = ({ isOpen, onClose, results, onDownload, onMarkAsPaid, onCancelPaid, billName }) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSummaryCopied, setIsSummaryCopied] = useState(false);

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    await onDownload();
    setIsDownloading(false);
  };
  
  const grandTotal = results.reduce((sum, result) => sum + result.total, 0);

  const handleCopySummary = () => {
    let summaryText = `Rangkuman Tagihan: ${billName}\n\n`;
    results.forEach(result => {
      summaryText += `• ${result.name}: ${formatRupiah(result.total)}\n`;
    });
    summaryText += `\nGRAND TOTAL: ${formatRupiah(grandTotal)}`;

    navigator.clipboard.writeText(summaryText);
    setIsSummaryCopied(true);
    setTimeout(() => setIsSummaryCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-800/40 flex flex-col rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden relative border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6 border-b border-white/10 shrink-0">
              <motion.button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <X size={24} />
              </motion.button>
              <h2 className="text-2xl font-bold text-emerald-400">Hasil Perhitungan</h2>
              <p className="text-gray-400 text-sm">{billName}</p>
            </div>

            <div ref={modalContentRef} className="flex-grow p-6 overflow-y-auto">
              {results.length > 0 ? (
                results.map((result) => (
                  <ParticipantCard key={result.id} result={result} onMarkAsPaid={onMarkAsPaid} onCancelPaid={onCancelPaid} />
                ))
              ) : (
                <p className="text-center text-gray-500">Tidak ada hasil untuk ditampilkan.</p>
              )}
            </div>

            <div className="p-6 border-t border-white/10 bg-gray-900/80 backdrop-blur-sm shrink-0">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-white">GRAND TOTAL:</span>
                <span className="text-2xl font-bold text-emerald-300">{formatRupiah(grandTotal)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={handleCopySummary}
                  className="relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 overflow-hidden group disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSummaryCopied ? <CheckCircle size={18} /> : <ClipboardCopy size={18} />}
                  <span>{isSummaryCopied ? 'Tersalin!' : 'Salin Hasil'}</span>
                  <span className="absolute inset-0 w-full h-full bg-white opacity-10 blur-xl group-hover:opacity-0 transition-opacity duration-300"></span>
                </motion.button>
                <motion.button
                  onClick={handleDownloadClick}
                  disabled={isDownloading}
                  className="relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 overflow-hidden group disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isDownloading ? <RotateCw size={18} className="animate-spin" /> : <Download size={18} />}
                  <span>{isDownloading ? 'Menyiapkan...' : 'Unduh PDF'}</span>
                  <span className="absolute inset-0 w-full h-full bg-white opacity-10 blur-xl group-hover:opacity-0 transition-opacity duration-300"></span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalculationResultModal;