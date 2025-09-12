interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Participant {
  id: string;
  name: string;
  assignments: { [itemId: string]: number };
}

interface BillDetails {
  taxPercent: number;
  serviceFee: number;
  discount?: number;
}

export interface Result {
  id: string;
  name: string;
  total: number;
  items: { name: string; price: number; quantity: number }[];
  personalSubtotal: number;
  personalTax: number;
  personalService: number;
  personalDiscount: number;
}

export function calculateItemizedBill(
  participants: Participant[],
  items: Item[],
  billDetails: BillDetails
): Result[] {
  const results: Result[] = [];

  const grandSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTax = grandSubtotal * (billDetails.taxPercent / 100);
  const grandService = billDetails.serviceFee;
  const grandDiscount = billDetails.discount || 0;

  if (grandSubtotal === 0) return [];

  participants.forEach((participant) => {
    let personalSubtotal = 0;
    const personItems: { name: string; price: number; quantity: number }[] = [];

    for (const itemId in participant.assignments) {
      const quantityAssigned = participant.assignments[itemId];
      const item = items.find((i) => i.id === itemId);

      if (item) {
        const totalShares = participants.reduce(
          (acc, p) => acc + (p.assignments[itemId] || 0),
          0
        );

        if (totalShares > 0) {
          const costPerShare = (item.price * item.quantity) / totalShares;
          const costForItem = costPerShare * quantityAssigned;

          personalSubtotal += costForItem;
          personItems.push({
            name: item.name,
            price: costForItem,
            quantity: quantityAssigned,
          });
        }
      }
    }

    const proportion = grandSubtotal > 0 ? personalSubtotal / grandSubtotal : 0;

    const personalTax = grandTax * proportion;
    const personalService = grandService * proportion;
    const personalDiscount = grandDiscount * proportion;

    const finalTotal = personalSubtotal + personalTax + personalService - personalDiscount;

    results.push({
      id: participant.id,
      name: participant.name,
      total: finalTotal,
      items: personItems,
      personalSubtotal: personalSubtotal,
      personalTax,
      personalService,
      personalDiscount,
    });
  });

  return results;
}