import { type Result } from './utils/itemizedCalculator';

export interface Bill {
  billName: string;
  taxPercent: number;
  serviceFee: number;
  discount?: string;
  status?: 'paid' | 'unpaid';
  creatorUid: string;
  participantUids?: string[];
}

export interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Participant {
  id: string;
  name: string;
  assignments: { [itemId: string]: number };
  email?: string;
  userId?: string;
  paid?: boolean;
}

export interface EnhancedResult extends Result {
    id:string;
    name: string;
    isPaid: boolean;
    personalSubtotal: number;
    personalTax: number;
    personalService: number;
    total: number;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
}