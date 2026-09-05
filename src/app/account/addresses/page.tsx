'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, Home, Briefcase } from 'lucide-react';
import { AccountNav } from '@/components/account/AccountNav';
import { useAddresses, validateIndianPincode, validateIndianPhone, lookupPincode, INDIAN_STATES } from '@/context/AddressContext';
import { Address } from '@/types';

export default function SavedAddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingAddressId(null);
    setFullName('');
    setPhone('');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setPincode('');
    setLandmark('');
    setIsDefault(addresses.length === 0);
    setAddressType('home');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddressId(addr.id);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setAddressLine1(addr.addressLine1);
    setAddressLine2(addr.addressLine2 || '');
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setLandmark(addr.landmark || '');
    setIsDefault(addr.isDefault);
    setAddressType(addr.type);
    setFormError('');
    setIsModalOpen(true);
  };

  const handlePincodeChange = (val: string) => {
    const clean = val.replace(/\D/g, '');
    setPincode(clean);
    if (clean.length === 6) {
      const detected = lookupPincode(clean);
      if (detected) {
        setCity(detected.city);
        setState(detected.state);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Full name is required.');
      return;
    }
    if (!validateIndianPhone(phone)) {
      setFormError('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      return;
    }
    if (!validateIndianPincode(pincode)) {
      setFormError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    if (!addressLine1.trim() || !city.trim() || !state.trim()) {
      setFormError('Address, City, and State are required.');
      return;
    }

    if (editingAddressId) {
      updateAddress(editingAddressId, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        landmark: landmark.trim() || undefined,
        isDefault,
        type: addressType,
      });
    } else {
      addAddress({
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        landmark: landmark.trim() || undefined,
        isDefault,
        type: addressType,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="py-8 sm:py-12 bg-ayur-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal mb-8">
          Saved Delivery Addresses
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <AccountNav />
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Top Bar with Add Button */}
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-ayur-border shadow-soft">
              <div>
                <h3 className="font-serif text-base font-semibold text-ayur-charcoal-900">
                  Address Book ({addresses.length})
                </h3>
                <p className="text-xs text-ayur-charcoal-500">
                  Manage multiple shipping locations across India.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="px-4 py-2 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address Cards Grid or Empty State */}
            {addresses.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-ayur-border shadow-soft text-center space-y-4">
                <div className="w-14 h-14 bg-ayur-cream rounded-full flex items-center justify-center mx-auto text-ayur-charcoal-400 border border-ayur-border shadow-xs">
                  <MapPin className="w-7 h-7 text-ayur-green-900" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-ayur-charcoal-900 font-semibold">
                    No saved addresses
                  </h3>
                  <p className="text-xs text-ayur-charcoal-600 max-w-sm mx-auto mt-1">
                    You haven&apos;t saved any delivery addresses yet. Add an address for seamless pan-India delivery.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Your First Address</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white p-5 rounded-2xl border-2 flex flex-col justify-between shadow-soft transition-all ${
                    addr.isDefault ? 'border-ayur-green-900' : 'border-ayur-border'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {addr.type === 'home' ? (
                          <Home className="w-4 h-4 text-ayur-green-800" />
                        ) : (
                          <Briefcase className="w-4 h-4 text-ayur-green-800" />
                        )}
                        <span className="font-semibold text-sm text-ayur-charcoal-900">
                          {addr.fullName}
                        </span>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-ayur-charcoal-700 leading-relaxed">
                      {addr.addressLine1}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}
                    </p>
                    <p className="text-xs text-ayur-charcoal-700 mt-0.5">
                      {addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span>
                    </p>
                    {addr.landmark && (
                      <p className="text-[11px] text-ayur-charcoal-500 mt-0.5">
                        Landmark: {addr.landmark}
                      </p>
                    )}
                    <p className="text-xs text-ayur-charcoal-800 mt-2 font-medium">
                      Phone: +91 {addr.phone}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-ayur-border flex items-center justify-between text-xs">
                    {!addr.isDefault ? (
                      <button
                        type="button"
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-ayur-green-800 font-semibold hover:underline"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-medium">
                        Default for Checkout
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(addr)}
                        className="text-ayur-charcoal-600 hover:text-ayur-green-900 flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAddress(addr.id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-md max-w-lg w-full p-6 sm:p-8 shadow-xl border border-ayur-border z-10 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-ayur-charcoal-900 border-b border-ayur-border pb-3">
              {editingAddressId ? 'Edit Address' : 'Add New Indian Delivery Address'}
            </h3>

            {formError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-ayur-charcoal-800 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md"
                  />
                </div>
                <div>
                  <label className="font-medium text-ayur-charcoal-800 block mb-1">Mobile *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-medium text-ayur-charcoal-800 block mb-1">
                    Flat / House / Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md"
                  />
                </div>
                <div>
                  <label className="font-medium text-ayur-charcoal-800 block mb-1">
                    Street / Colony
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md"
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
                    value={pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-ayur-charcoal-800 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md"
                  />
                </div>
                <div>
                  <label className="font-medium text-ayur-charcoal-800 block mb-1">State / UT *</label>
                  <select
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md text-xs focus:outline-none focus:border-ayur-green-800"
                  >
                    <option value="">Select State / UT</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="default-check"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded text-ayur-green-900 accent-ayur-green-900"
                />
                <label htmlFor="default-check" className="text-xs text-ayur-charcoal-700 cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-ayur-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-ayur-border rounded-lg text-xs font-semibold text-ayur-charcoal-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-ayur-green-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-ayur-green-800"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
