'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Address } from '@/types';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { insforge } from '@/lib/insforge';
import { mapDbUserAddressToAddress, DbUserAddress } from '@/types/database';

export * from '@/services/address';

interface AddressContextType {
  addresses: Address[];
  defaultAddress: Address | null;
  addAddress: (addr: Omit<Address, 'id'>) => Promise<Address>;
  updateAddress: (id: string, addr: Partial<Address>) => Promise<void> | void;
  deleteAddress: (id: string) => Promise<void> | void;
  setDefaultAddress: (id: string) => Promise<void> | void;
  refreshAddresses: () => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const fetchAddresses = async () => {
    const userId = user?.id;
    if (!isAuthenticated || !userId) {
      setAddresses([]);
      return;
    }

    try {
      const { data, error } = await insforge.database
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map((d: DbUserAddress) => mapDbUserAddressToAddress(d));
        setAddresses(mapped);
      } else if (error) {
        console.warn('user_addresses fetch error:', error);
      }
    } catch (err) {
      console.warn('user_addresses sync error:', err);
    }
  };

  // Sync with InsForge user_addresses when authenticated
  useEffect(() => {
    fetchAddresses();
  }, [isAuthenticated, user?.id]);

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;

  const addAddress = async (addr: Omit<Address, 'id'>): Promise<Address> => {
    const tempId = 'addr-' + Date.now();
    const isFirst = addresses.length === 0;
    const isDef = isFirst ? true : !!addr.isDefault;
    const newAddress: Address = {
      ...addr,
      id: tempId,
      isDefault: isDef,
    };

    setAddresses((prev) => {
      if (isDef) {
        return [...prev.map((a) => ({ ...a, isDefault: false })), newAddress];
      }
      return [...prev, newAddress];
    });

    if (isAuthenticated && user?.id) {
      try {
        if (isDef) {
          await insforge.database
            .from('user_addresses')
            .update({ is_default: false })
            .eq('user_id', user.id);
        }

        const { data, error } = await insforge.database
          .from('user_addresses')
          .insert({
            user_id: user.id,
            full_name: addr.fullName,
            phone_number: addr.phone,
            address_line1: addr.addressLine1,
            address_line2: addr.addressLine2 || null,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            is_default: isDef,
          })
          .select();

        if (!error && data && data.length > 0) {
          const realDbAddr = mapDbUserAddressToAddress(data[0] as DbUserAddress);
          setAddresses((prev) =>
            prev.map((a) => (a.id === tempId ? realDbAddr : a))
          );
          showToast('Delivery address saved successfully.', 'success');
          return realDbAddr;
        }
      } catch (e) {
        console.warn('Error inserting user_address:', e);
      }
    }

    showToast('Delivery address saved successfully.', 'success');
    return newAddress;
  };

  const updateAddress = (id: string, addr: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...addr };
        }
        if (addr.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );

    if (isAuthenticated && user?.id) {
      const updateData: any = {};
      if (addr.fullName) updateData.full_name = addr.fullName;
      if (addr.phone) updateData.phone_number = addr.phone;
      if (addr.addressLine1) updateData.address_line1 = addr.addressLine1;
      if (addr.addressLine2 !== undefined) updateData.address_line2 = addr.addressLine2;
      if (addr.city) updateData.city = addr.city;
      if (addr.state) updateData.state = addr.state;
      if (addr.pincode) updateData.pincode = addr.pincode;
      if (addr.isDefault !== undefined) updateData.is_default = addr.isDefault;

      if (addr.isDefault) {
        insforge.database
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .then(() => {
            insforge.database
              .from('user_addresses')
              .update(updateData)
              .eq('id', id)
              .eq('user_id', user.id)
              .then();
          });
      } else {
        insforge.database
          .from('user_addresses')
          .update(updateData)
          .eq('id', id)
          .eq('user_id', user.id)
          .then();
      }
    }

    showToast('Address updated.', 'success');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (isAuthenticated && user?.id) {
      insforge.database
        .from('user_addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
        .then();
    }
    showToast('Address removed.', 'info');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );

    if (isAuthenticated && user?.id) {
      insforge.database
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .then(() => {
          insforge.database
            .from('user_addresses')
            .update({ is_default: true })
            .eq('id', id)
            .eq('user_id', user.id)
            .then();
        });
    }

    showToast('Default delivery address updated.', 'success');
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        defaultAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        refreshAddresses: fetchAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
}

export const useAddresses = useAddress;
