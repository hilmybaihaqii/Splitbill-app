import { useCallback } from 'react';
import { doc, collection, addDoc, updateDoc, deleteDoc, getDocs, where, query, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import type { Bill, Item, Participant } from '../types';

export function useBillActions(billId: string | undefined) {

    const onBillUpdate = useCallback(async (field: keyof Bill, value: string | number) => {
        if (!billId) return;
        await updateDoc(doc(db, 'bills', billId), { [field]: value });
        toast.success('Tagihan diperbarui!');
    }, [billId]);

    const onAddItem = useCallback(async (newItem: Omit<Item, 'id'>) => {
        if (!billId) return;
        await addDoc(collection(db, 'bills', billId, 'items'), newItem);
        toast.success('Item berhasil ditambahkan!');
    }, [billId]);

    const onDeleteItem = useCallback(async (id: string) => {
        if (!billId || !window.confirm('Hapus item ini? Penugasan item terkait akan hilang.')) return;
        await deleteDoc(doc(db, 'bills', billId, 'items', id));
        toast.success('Item berhasil dihapus!');
    }, [billId]);

    const onAddParticipant = useCallback(async (participantData: { name?: string; email?: string }, type: 'guest' | 'registered') => {
        if (!billId) return;
        try {
            const billRef = doc(db, 'bills', billId);
            let newParticipantId = '';
            if (type === 'registered' && participantData.email) {
                const q = query(collection(db, 'users'), where('email', '==', participantData.email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    await addDoc(collection(db, 'bills', billId, 'participants'), {
                        name: userDoc.data().name, email: userDoc.data().email, userId: userDoc.id, assignments: {}, paid: false,
                    });
                    newParticipantId = userDoc.id;
                    toast.success('Peserta terdaftar berhasil ditambahkan!');
                } else {
                    toast.error('Pengguna dengan email tersebut tidak ditemukan!');
                    return;
                }
            } else if (type === 'guest' && participantData.name) {
                const docRef = await addDoc(collection(db, 'bills', billId, 'participants'), {
                    name: participantData.name, assignments: {}, paid: false,
                });
                newParticipantId = docRef.id;
                toast.success('Peserta tamu berhasil ditambahkan!');
            }

            if (newParticipantId) {
                await updateDoc(billRef, { participantUids: arrayUnion(newParticipantId) });
            }
        } catch (e) {
            toast.error('Gagal menambahkan peserta.');
            console.error(e);
        }
    }, [billId]);

    const onDeleteParticipant = useCallback(async (id: string) => {
        if (!billId || !window.confirm('Hapus peserta ini?')) return;
        await deleteDoc(doc(db, 'bills', billId, 'participants', id));
        toast.success('Peserta berhasil dihapus!');
    }, [billId]);
    
    const onAssignItem = useCallback(async (participantId: string, itemId: string, change: 1 | -1, currentAssignments: { [key: string]: number }) => {
        if (!billId) return;
        const newAssignments = { ...currentAssignments };
        const currentQty = newAssignments[itemId] || 0;
        const nextQty = currentQty + change;

        if (nextQty <= 0) {
            delete newAssignments[itemId];
        } else {
            newAssignments[itemId] = nextQty;
        }

        const participantRef = doc(db, 'bills', billId, 'participants', participantId);
        await updateDoc(participantRef, { assignments: newAssignments });
    }, [billId]);

    const onMarkAsPaid = useCallback(async (participantId: string, allParticipants: Participant[]) => {
        if (!billId) return;
        const participantRef = doc(db, 'bills', billId, 'participants', participantId);
        await updateDoc(participantRef, { paid: true });

        const allNowPaid = allParticipants
            .map(p => (p.id === participantId ? { ...p, paid: true } : p))
            .every(p => p.paid);

        if (allNowPaid) {
            await updateDoc(doc(db, 'bills', billId), { status: 'paid' });
        }
        toast.success("Status pembayaran diperbarui!");
    }, [billId]);

    const onCancelPaid = useCallback(async (participantId: string, currentBillStatus?: 'paid' | 'unpaid') => {
        if (!billId) return;
        const participantRef = doc(db, 'bills', billId, 'participants', participantId);
        await updateDoc(participantRef, { paid: false });

        if (currentBillStatus === 'paid') {
            await updateDoc(doc(db, 'bills', billId), { status: 'unpaid' });
        }
        toast.info("Status pembayaran dibatalkan.");
    }, [billId]);

    return { onBillUpdate, onAddItem, onDeleteItem, onAddParticipant, onDeleteParticipant, onAssignItem, onMarkAsPaid, onCancelPaid };
}