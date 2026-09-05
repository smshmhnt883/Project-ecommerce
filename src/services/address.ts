export interface PincodeLookupResult {
  pincode: string;
  city: string;
  state: string;
}

// Complete list of Indian States & Union Territories
export const INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

// Quick lookup dictionary for verified Indian Pincodes
export const INDIAN_PINCODES: Record<string, { city: string; state: string }> = {
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '110020': { city: 'South Delhi', state: 'Delhi' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '400050': { city: 'Mumbai Bandra', state: 'Maharashtra' },
  '560001': { city: 'Bengaluru', state: 'Karnataka' },
  '560034': { city: 'Bengaluru Koramangala', state: 'Karnataka' },
  '560103': { city: 'Bengaluru Bellandur', state: 'Karnataka' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '500001': { city: 'Hyderabad', state: 'Telangana' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat' },
  '249401': { city: 'Haridwar', state: 'Uttarakhand' },
  '249408': { city: 'Haridwar Shantikunj', state: 'Uttarakhand' },
  '248001': { city: 'Dehradun', state: 'Uttarakhand' },
  '302001': { city: 'Jaipur', state: 'Rajasthan' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh' },
  '122001': { city: 'Gurugram', state: 'Haryana' },
  '160017': { city: 'Chandigarh', state: 'Punjab' },
  '682001': { city: 'Kochi', state: 'Kerala' },
  '411001': { city: 'Pune', state: 'Maharashtra' },
  '751001': { city: 'Bhubaneswar', state: 'Odisha' },
};

export function lookupPincode(pincode: string): PincodeLookupResult | null {
  const clean = pincode.trim().replace(/\D/g, '');
  if (clean.length !== 6) return null;
  const match = INDIAN_PINCODES[clean];
  if (match) {
    return { pincode: clean, city: match.city, state: match.state };
  }
  return null;
}

export function validateIndianPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

export function validateIndianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(digits.slice(2));
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return /^[6-9]\d{9}$/.test(digits.slice(1));
  }
  return /^[6-9]\d{9}$/.test(digits);
}
