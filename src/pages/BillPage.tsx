import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useBillData } from '../hooks/useBillData';
import { useBillActions } from '../hooks/useBillActions';
import { calculateDiscount } from '../utils/calculateDiscount';
import { calculateItemizedBill, type Result } from '../utils/itemizedCalculator';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import type { EnhancedResult } from '../types';

import CalculationResultModal from '../modal/CalculationResultModal';
import PrintableBillSummary from '../components/PrintableBillSummary';
import ParticipantsSection from '../components/Bill/ParticipantsSection';
import ItemsSection from '../components/Bill/ItemsSection';
import AssignmentsSection from '../components/Bill/AssignmentsSection';
import BillSummary from '../components/Bill/BillSummary';
import NotificationToast from '../components/NotificationToast'; 
import { motion } from 'framer-motion';
import { CircleDashed } from 'lucide-react';
import { toast } from 'react-toastify';

function BillPage() {
    const { billId } = useParams<{ billId: string }>();
    const { bill, items, participants, loading } = useBillData(billId);
    const actions = useBillActions(billId);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [results, setResults] = useState<EnhancedResult[]>([]);
    const printableRef = useRef<HTMLDivElement>(null);
    
    const location = useLocation();
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (location.state?.message) {
          setNotification({ message: location.state.message, type: location.state.type });
          const timer = setTimeout(() => setNotification(null), 4000);
          window.history.replaceState({}, document.title);
          return () => clearTimeout(timer);
        }
    }, [location.state]);

    const totals = useMemo(() => {
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        const discountValue = calculateDiscount(subtotal, bill?.discount || '');
        const tax = subtotal * ((bill?.taxPercent ?? 0) / 100);
        const service = bill?.serviceFee ?? 0;
        return { subtotal, tax, service, discount: discountValue, grandTotal: subtotal + tax + service - discountValue };
    }, [items, bill]);
    
    const handleCalculate = useCallback(() => {
        if (!participants.length || !items.length || !bill) {
          toast.error('Tambahkan minimal satu item & peserta!');
          return;
        }
        const calculatedResults = calculateItemizedBill(participants, items, {
            taxPercent: bill.taxPercent, serviceFee: bill.serviceFee, discount: totals.discount,
        });
        const enhancedResults: EnhancedResult[] = calculatedResults.map((res: Result) => { 
            const p = participants.find(p => p.id === res.id);
            return {
                ...res, id: p?.id || '', name: p?.name || '', isPaid: p?.paid || false,
                items: items.filter(item => (p?.assignments?.[item.id] || 0) > 0).map(item => ({ ...item, quantity: p?.assignments?.[item.id] || 0 })),
            };
        });
        setResults(enhancedResults);
        setIsResultModalOpen(true);
    }, [participants, items, bill, totals]);

    const handleModalDownload = useCallback(async () => {
        const toastId = toast.loading("Mendesain Invoice Profesional...");
        try {
            generateInvoicePDF(results, bill);
            toast.update(toastId, { render: "Invoice profesional berhasil dibuat!", type: "success", isLoading: false, autoClose: 5000 });
        } catch (error) {
            console.error('Gagal membuat PDF invoice:', error);
            toast.update(toastId, { render: "Gagal membuat invoice. Cek konsol.", type: "error", isLoading: false, autoClose: 5000 });
        }
    }, [results, bill]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900"><CircleDashed size={64} className="animate-spin text-gray-500" /></div>
    );
    if (!bill) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900"><p className="text-xl">Tagihan tidak ditemukan.</p><Link to="/dashboard" className="mt-4 text-emerald-400 hover:underline">Kembali ke Dashboard</Link></div>
    );

    return (
        <>
            <div className="min-h-screen w-full bg-gray-900 font-sans p-4 sm:p-8 flex justify-center items-center">
                <motion.div className="relative max-w-md w-full bg-gray-900 text-gray-300 rounded-lg p-6 sm:p-8" style={{ border: '1px dashed #4B5563', boxShadow: '0 0 40px rgba(0,255,100,0.1)', fontFamily: 'monospace' }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="flex justify-between items-center mb-6">
                        <Link to="/dashboard" className="text-gray-400 hover:text-green-500 transition-colors">&larr; Back</Link>
                        <h1 className="text-2xl font-extrabold text-green-400 text-center flex-grow">{bill.billName}</h1>
                        <p className="text-xs text-gray-500">#{billId?.substring(0, 8)}</p>
                    </div>
                    
                    <ParticipantsSection participants={participants} onAddParticipant={actions.onAddParticipant} onDeleteParticipant={actions.onDeleteParticipant} />
                    <ItemsSection items={items} onAddItem={actions.onAddItem} onDeleteItem={actions.onDeleteItem} />
                    <div className="mb-6 pb-4 border-b border-dashed border-gray-700">
                        <AssignmentsSection
                          items={items}
                          participants={participants}
                          onAssignItem={(pid, iid, change) => actions.onAssignItem(pid, iid, change, participants.find(p => p.id === pid)?.assignments || {})}
                        />
                    </div>
                    <BillSummary bill={bill} totals={totals} items={items} onUpdate={actions.onBillUpdate} onCalculate={handleCalculate} canCalculate={items.length > 0 && participants.length > 0} />
                </motion.div>
            </div>

            <div style={{ position: 'absolute', left: '-9999px' }}><div ref={printableRef}><PrintableBillSummary billName={bill.billName} results={results} /></div></div>
            <CalculationResultModal 
                isOpen={isResultModalOpen} 
                onClose={() => setIsResultModalOpen(false)} 
                results={results} 
                onDownload={handleModalDownload}
                onMarkAsPaid={(pid) => actions.onMarkAsPaid(pid, participants)} 
                onCancelPaid={(pid) => actions.onCancelPaid(pid, bill.status)} 
                billName={bill.billName} />

            <NotificationToast notification={notification} />
        </>
    );
}

export default BillPage;