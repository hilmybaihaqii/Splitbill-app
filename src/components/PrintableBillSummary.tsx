import React from 'react';
import { type Result } from '../utils/itemizedCalculator';
import { memo } from 'react';

interface PrintableBillSummaryProps {
  billName: string;
  results: Result[];
}

const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const PrintableBillSummary: React.FC<PrintableBillSummaryProps> = memo(({ results, billName }) => {
  const grandTotal = results.reduce((sum, result) => sum + result.total, 0);

  return (
    <div className="p-8 bg-white text-gray-800 font-sans">
      <h1 className="text-3xl font-extrabold text-center mb-2">{billName}</h1>
      <p className="text-center text-sm text-gray-500 mb-6">Rangkuman Tagihan</p>
      
      {results.length > 0 ? (
        results.map((result) => (
          <div key={result.id} className="mb-6 p-4 border border-gray-300 rounded-lg">
            <h2 className="text-xl font-bold mb-3">{result.name}</h2>
            
            <div className="text-sm leading-relaxed mb-4">
              <strong>Items:</strong>
              <ul className="list-disc ml-5">
                {result.items.map((item, index) => (
                  <li key={index}>
                    {item.name} ({item.quantity}) - {formatRupiah(item.price)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1 text-sm mt-4 pt-3 border-t border-gray-300">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span>{formatRupiah(result.personalSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatRupiah(result.personalTax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee:</span>
                <span>{formatRupiah(result.personalService)}</span>
              </div>
              {result.personalDiscount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-{formatRupiah(result.personalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base mt-3 pt-3 border-t border-gray-500">
                <span>TOTAL:</span>
                <span>{formatRupiah(result.total)}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No results to display.</p>
      )}

      <div className="mt-6 pt-6 border-t-2 border-black text-center">
        <strong className="font-bold text-xl">GRAND TOTAL: {formatRupiah(grandTotal)}</strong>
      </div>
    </div>
  );
});

export default PrintableBillSummary;
