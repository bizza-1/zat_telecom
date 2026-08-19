// Local persistence layer for the ZAT Telecom store.
//
// This is the ONLY module that knows *where* data lives. Today it seeds from
// the static arrays in `products.ts` and persists to localStorage. When a real
// backend (PostgreSQL / Supabase) is introduced, swap the bodies of the
// load/save/reset functions here (and make the StoreContext mutations async) —
// the rest of the app keeps calling `useStore()` unchanged.

import {
  products as seedProducts,
  categories as seedCategories,
  brands as seedBrands,
  partTypes as seedPartTypes,
  whatsappNumber as seedWhatsAppNumber,
  type Product,
} from "./products";

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
  count: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  models: string[];
}

export interface PartType {
  id: string;
  name: string;
  icon: string;
}

export interface Settings {
  storeName: string;
  whatsappNumber: string;
  currencySymbol: string;
  deliveryFee: number;
  address: string;
  email: string;
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  /** Placeholder gate password — NOT real security. Replaced by real auth with the backend. */
  adminPassword: string;
}

export interface StoreState {
  version: number;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  partTypes: PartType[];
  settings: Settings;
}

export const STORAGE_KEY = "zat_telecom_store_v1";
const STORE_VERSION = 1;

export const defaultSettings: Settings = {
  storeName: "ZAT Telecom",
  whatsappNumber: seedWhatsAppNumber,
  currencySymbol: "₦",
  deliveryFee: 2500,
  address: "Lagos, Nigeria",
  email: "hello@zattelecom.com",
  socials: {},
  adminPassword: "zatadmin",
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** A fresh copy of the shipped seed data — never returns references into the seed arrays. */
export function getSeedState(): StoreState {
  return {
    version: STORE_VERSION,
    products: clone(seedProducts),
    categories: clone(seedCategories) as Category[],
    brands: clone(seedBrands) as Brand[],
    partTypes: clone(seedPartTypes) as PartType[],
    settings: { ...defaultSettings },
  };
}

/** Load persisted state, falling back to (and self-healing toward) the seed on any problem. */
export function loadState(): StoreState {
  if (typeof localStorage === "undefined") return getSeedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getSeedState();
    const parsed = JSON.parse(raw) as Partial<StoreState> | null;
    if (!parsed || !Array.isArray(parsed.products)) return getSeedState();
    return {
      version: STORE_VERSION,
      products: parsed.products as Product[],
      categories: Array.isArray(parsed.categories)
        ? (parsed.categories as Category[])
        : (clone(seedCategories) as Category[]),
      brands: Array.isArray(parsed.brands)
        ? (parsed.brands as Brand[])
        : (clone(seedBrands) as Brand[]),
      partTypes: Array.isArray(parsed.partTypes)
        ? (parsed.partTypes as PartType[])
        : (clone(seedPartTypes) as PartType[]),
      // Merge so settings keys added in later versions get sane defaults.
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return getSeedState();
  }
}

export function saveState(state: StoreState): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Most likely the ~5MB quota was hit by large base64 images.
    console.warn("ZAT store: could not persist state (storage full?).", err);
  }
}

export function resetToSeed(): StoreState {
  const seed = getSeedState();
  saveState(seed);
  return seed;
}
