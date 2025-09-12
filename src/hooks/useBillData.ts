import { useState, useEffect } from 'react';
import { doc, collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import type { Bill, Item, Participant } from '../types';

export function useBillData(billId: string | undefined) {
    const [bill, setBill] = useState<Bill | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!billId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const billRef = doc(db, 'bills', billId);
        const unsubscribeBill = onSnapshot(billRef, (docSnap) => {
            if (docSnap.exists()) {
                setBill(docSnap.data() as Bill);
            } else {
                setBill(null);
            }
            setLoading(false);
        });

        const itemsRef = collection(db, 'bills', billId, 'items');
        const unsubscribeItems = onSnapshot(query(itemsRef), (snapshot) => {
            setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Item[]);
        });

        const participantsRef = collection(db, 'bills', billId, 'participants');
        const unsubscribeParticipants = onSnapshot(query(participantsRef), (snapshot) => {
            setParticipants(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Participant[]);
        });

        return () => {
            unsubscribeBill();
            unsubscribeItems();
            unsubscribeParticipants();
        };
    }, [billId]);

    return { bill, items, participants, loading };
}