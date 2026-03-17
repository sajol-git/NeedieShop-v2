'use client';

import { bdDistricts } from '@/lib/districts';

interface DistrictDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function DistrictDropdown({ value, onChange }: DistrictDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-[#8B183A]/20 focus:border-[#8B183A] outline-none transition-all"
      required
    >
      <option value="">Select District</option>
      {bdDistricts.map((district) => (
        <option key={district} value={district}>
          {district}
        </option>
      ))}
    </select>
  );
}
