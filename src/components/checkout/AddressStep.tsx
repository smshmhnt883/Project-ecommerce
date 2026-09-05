'use client';

import React, { useState } from 'react';
import { MapPin, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import { INDIAN_STATES } from '@/context/AddressContext';

interface AddressStepProps {
  addresses: any[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  setCurrentStep: (step: 1 | 2 | 3 | 4) => void;
  user: any;
  addAddress: (addr: any) => Promise<any>;
  validateIndianPhone: (phone: string) => boolean;
  validateIndianPincode: (pin: string) => boolean;
  lookupPincode: (pin: string) => { city: string; state: string } | null;
}

export function AddressStep({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  setCurrentStep,
  user,
  addAddress,
  validateIndianPhone,
  validateIndianPincode,
  lookupPincode,
}: AddressStepProps) {
  const [showNewAddressForm, setShowNewAddressForm] = useState(addresses.length === 0);
  const [newAddrFullName, setNewAddrFullName] = useState(user?.name || '');
  const [newAddrPhone, setNewAddrPhone] = useState(user?.phone || '');
  const [newAddrLine1, setNewAddrLine1] = useState('');
  const [newAddrLine2, setNewAddrLine2] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrPincode, setNewAddrPincode] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');
  const [addrError, setAddrError] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const handlePincodeChange = (pin: string) => {
    const clean = pin.replace(/\D/g, '').slice(0, 6);
    setNewAddrPincode(clean);
    if (clean.length === 6) {
      const loc = lookupPincode(clean);
      if (loc) {
        setNewAddrCity(loc.city);
        setNewAddrState(loc.state);
      }
    }
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrError('');

    if (!newAddrFullName.trim()) {
      setAddrError('Full name is required.');
      return;
    }
    if (!validateIndianPhone(newAddrPhone)) {
      setAddrError('Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }
    if (!newAddrLine1.trim()) {
      setAddrError('Address line 1 is required.');
      return;
    }
    if (!validateIndianPincode(newAddrPincode)) {
      setAddrError('Please provide a valid 6-digit Indian PIN code.');
      return;
    }
    if (!newAddrCity.trim()) {
      setAddrError('City / Town is required.');
      return;
    }
    if (!newAddrState.trim()) {
      setAddrError('Please select a State or Union Territory.');
      return;
    }

    try {
      setIsSavingAddress(true);
      const created = await addAddress({
        fullName: newAddrFullName.trim(),
        phone: newAddrPhone.trim(),
        addressLine1: newAddrLine1.trim(),
        addressLine2: newAddrLine2.trim() || undefined,
        city: newAddrCity.trim(),
        state: newAddrState.trim(),
        pincode: newAddrPincode.trim(),
        landmark: newAddrLandmark.trim() || undefined,
        isDefault: true,
        type: 'home',
      });

      setSelectedAddressId(created.id);
      setShowNewAddressForm(false);
      setAddrError('');
    } catch (err: any) {
      setAddrError(err.message || 'Failed to save address.');
    } finally {
      setIsSavingAddress(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ayur-border shadow-soft space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-ayur-border pb-4">
        <div>
          <h2 className="font-serif text-lg sm:text-xl text-ayur-charcoal-900 font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-ayur-green-800" />
            <span>Step 1: Select Delivery Address</span>
          </h2>
          <p className="text-xs text-ayur-charcoal-600 mt-1">
            Choose where you would like your authentic Patanjali order delivered.
          </p>
        </div>
        {!showNewAddressForm && (
          <button
            type="button"
            onClick={() => setShowNewAddressForm(true)}
            className="text-xs font-semibold text-ayur-green-900 hover:text-ayur-green-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ayur-green-900/30 hover:bg-ayur-cream transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {!showNewAddressForm ? (
        addresses.length === 0 ? (
          <div className="py-10 px-4 text-center bg-ayur-cream/30 rounded-2xl border border-dashed border-ayur-border space-y-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-ayur-charcoal-400 border border-ayur-border shadow-xs">
              <MapPin className="w-6 h-6 text-ayur-green-900" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-ayur-charcoal-900">
                No Saved Delivery Address
              </h3>
              <p className="text-xs text-ayur-charcoal-600 mt-1 max-w-sm mx-auto">
                Please provide your delivery address to continue with your checkout.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewAddressForm(true)}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedAddressId === addr.id
                      ? 'border-ayur-green-900 bg-ayur-cream/30 shadow-xs'
                      : 'border-ayur-border bg-white hover:border-ayur-green-700/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-ayur-charcoal-900">
                        {addr.fullName}
                      </span>
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="accent-ayur-green-900 w-4 h-4 cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-ayur-charcoal-700 leading-relaxed">
                      {addr.addressLine1}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}
                    </p>
                    <p className="text-xs text-ayur-charcoal-700 mt-0.5">
                      {addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span>
                    </p>
                    <p className="text-[11px] text-ayur-charcoal-500 mt-1.5">
                      Phone: +91 {addr.phone}
                    </p>
                  </div>

                  {addr.isDefault && (
                    <span className="mt-3 inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                      Default Delivery Address
                    </span>
                  )}
                </label>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!selectedAddressId}
                className="px-8 py-3 bg-ayur-green-900 hover:bg-ayur-green-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 shadow-md"
              >
                <span>Continue to Delivery Options</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      ) : (
        <form onSubmit={handleSaveNewAddress} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ayur-charcoal-900">
              Add New Indian Delivery Address
            </h3>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowNewAddressForm(false)}
                className="text-xs text-ayur-charcoal-500 hover:text-ayur-charcoal-800 underline"
              >
                Cancel
              </button>
            )}
          </div>

          {addrError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{addrError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-medium text-ayur-charcoal-800 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newAddrFullName}
                onChange={(e) => setNewAddrFullName(e.target.value)}
                placeholder="e.g. Ramesh Chandra"
                className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
              />
            </div>
            <div>
              <label className="font-medium text-ayur-charcoal-800 block mb-1">
                10-Digit Mobile Number *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-2.5 bg-ayur-cream border border-r-0 border-ayur-border rounded-l-md text-ayur-charcoal-600 text-xs">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={newAddrPhone}
                  onChange={(e) => setNewAddrPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="flex-1 px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-r-md focus:outline-none focus:border-ayur-green-800"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="font-medium text-ayur-charcoal-800 block mb-1">
                Flat, House no., Building, Apartment *
              </label>
              <input
                type="text"
                required
                value={newAddrLine1}
                onChange={(e) => setNewAddrLine1(e.target.value)}
                placeholder="e.g. Flat 402, Lotus Residency"
                className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
              />
            </div>
            <div>
              <label className="font-medium text-ayur-charcoal-800 block mb-1">
                Area, Street, Sector, Village
              </label>
              <input
                type="text"
                value={newAddrLine2}
                onChange={(e) => setNewAddrLine2(e.target.value)}
                placeholder="e.g. 12th Main Road, Indiranagar"
                className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
              />
            </div>
            <div>
              <label className="font-medium text-ayur-charcoal-800 block mb-1">
                6-Digit PIN Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={newAddrPincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                placeholder="e.g. 560034"
                className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
              />
            </div>
            <div>
              <label className="font-medium text-ayur-charcoal-800 block mb-1">
                Town / City *
              </label>
              <input
                type="text"
                required
                value={newAddrCity}
                onChange={(e) => setNewAddrCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
              />
            </div>
            <div>
              <label className="font-medium text-ayur-charcoal-800 block mb-1">
                State / UT *
              </label>
              <select
                required
                value={newAddrState}
                onChange={(e) => setNewAddrState(e.target.value)}
                className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
              >
                <option value="">-- Select State / UT --</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="font-medium text-ayur-charcoal-800 block mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={newAddrLandmark}
                onChange={(e) => setNewAddrLandmark(e.target.value)}
                placeholder="e.g. Near BDA Complex"
                className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowNewAddressForm(false)}
                className="px-5 py-2.5 border border-ayur-border rounded-lg text-xs font-semibold text-ayur-charcoal-700 hover:bg-ayur-cream transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSavingAddress}
              className="px-6 py-2.5 bg-ayur-green-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-ayur-green-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSavingAddress ? 'Saving Address...' : 'Save Address & Use'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
