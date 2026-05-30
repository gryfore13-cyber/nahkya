import { create } from 'zustand';
import { subscribeConfig, setConfig } from '@/lib/firebase/db';

export interface PricingRow {
  size: string;
  base: number;
  cost: number;
  margin: number;
  member: number;
  collector: number;
}

export interface AddOn {
  label: string;
  value: number;
  enabled: boolean;
}

interface PlatformSettings {
  pricing: PricingRow[];
  addOns: AddOn[];
  platformName: string;
  defaultLanguage: string;
  timezone: string;
  maintenanceMode: boolean;
  freeTierMaxSaves: number;
  autoSaveInterval: number;
  maxUploadSizeMb: number;
  twoFactorAuth: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  emailFromName: string;
  emailFromAddress: string;
  contactEmail: string;
  address: string[];
  socialHandle: string;
}

interface PlatformState extends PlatformSettings {
  isLoaded: boolean;
  updatePricingRow: (index: number, row: PricingRow) => void;
  updateAddOn: (index: number, addOn: AddOn) => void;
  updateSettings: (patch: Partial<PlatformSettings>) => void;
  reset: () => void;
}

const FALLBACK: PlatformSettings = {
  pricing: [
    { size: '70 x 70', base: 150, cost: 80, margin: 70, member: 150, collector: 135 },
    { size: '90 x 90', base: 180, cost: 95, margin: 85, member: 180, collector: 162 },
    { size: '100 x 100', base: 220, cost: 115, margin: 105, member: 220, collector: 198 },
    { size: '110 x 110', base: 250, cost: 130, margin: 120, member: 250, collector: 225 },
  ],
  addOns: [
    { label: 'Shipping', value: 15, enabled: true },
    { label: 'Rush Production', value: 30, enabled: true },
    { label: 'Gift Packaging', value: 8, enabled: true },
  ],
  platformName: 'Haus of Nahkya',
  defaultLanguage: 'English',
  timezone: 'Asia/Brunei',
  maintenanceMode: false,
  freeTierMaxSaves: 10,
  autoSaveInterval: 30,
  maxUploadSizeMb: 10,
  twoFactorAuth: true,
  sessionTimeoutMinutes: 60,
  maxLoginAttempts: 5,
  emailFromName: 'Haus of Nahkya',
  emailFromAddress: 'studio@nahkya.com',
  contactEmail: 'studio@nahkya.com',
  address: ['Unit 3, Simpang 127', 'Kampong Kiulap', 'Bandar Seri Begawan', 'Brunei Darussalam'],
  socialHandle: '@hausofnahkya',
};

export const usePlatformStore = create<PlatformState>((set, get) => ({
  ...FALLBACK,
  isLoaded: false,

  updatePricingRow: (index, row) => {
    const next = { pricing: get().pricing.map((r, i) => (i === index ? row : r)) };
    set(next);
    setConfig('platform', { ...get(), ...next });
  },

  updateAddOn: (index, addOn) => {
    const next = { addOns: get().addOns.map((a, i) => (i === index ? addOn : a)) };
    set(next);
    setConfig('platform', { ...get(), ...next });
  },

  updateSettings: (patch) => {
    const next = { ...get(), ...patch };
    set(next);
    setConfig('platform', next);
  },

  reset: () => {
    set(FALLBACK);
    setConfig('platform', FALLBACK);
  },
}));

subscribeConfig('platform', FALLBACK, (data) => {
  usePlatformStore.setState({ ...data, isLoaded: true });
});
