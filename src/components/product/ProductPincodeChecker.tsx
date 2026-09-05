'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { lookupPincode, validateIndianPincode } from '@/context/AddressContext';

export function ProductPincodeChecker() {
  const [pincode, setPincode] = useState('560001');
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    valid: boolean;
    message: string;
    city?: string;
  }>({
    checked: true,
    valid: true,
    message: 'Standard Delivery within 3-4 business days. COD available.',
    city: 'Bengaluru, Karnataka',
  });

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateIndianPincode(pincode)) {
      setPincodeStatus({
        checked: true,
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code.',
      });
      return;
    }

    const loc = lookupPincode(pincode);
    setPincodeStatus({
      checked: true,
      valid: true,
      message: 'Delivering within 3-5 business days. Free shipping on orders above ₹499. COD Available.',
      city: loc ? `${loc.city}, ${loc.state}` : 'India',
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-ayur-border space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-ayur-charcoal-900">
        <MapPin className="w-4 h-4 text-ayur-green-800" />
        <span>Delivery Availability & PIN Code Check</span>
      </div>
      <form onSubmit={handleCheckPincode} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit PIN code"
          className="flex-1 px-3 py-2 text-xs bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-ayur-charcoal-800 text-white rounded-md text-xs font-semibold tracking-wider hover:bg-ayur-charcoal-900 transition-colors uppercase"
        >
          Check
        </button>
      </form>
      {pincodeStatus.checked && (
        <div
          className={`text-xs p-2.5 rounded-md ${
            pincodeStatus.valid
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <p className="font-semibold">{pincodeStatus.city || 'Deliverable'}</p>
          <p className="text-[11px] mt-0.5">{pincodeStatus.message}</p>
        </div>
      )}
    </div>
  );
}
