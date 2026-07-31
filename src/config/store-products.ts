/**
 * Static store catalog (D6 — static config now, CMS later).
 * Display-only (D5): every card links to "Call to order" (tel:8798897732).
 */

export type StoreCategory = "clothes" | "products";

export interface StoreProduct {
  id: string;
  name: string;
  category: StoreCategory;
  price: number;
  image: string; // placeholder URL or emoji
  badge?: string;
  soldOut?: boolean;
}

export const STORE_PHONE = "8798897732";

export const storeProducts: StoreProduct[] = [
  {
    id: "cozy-winter-jacket",
    name: "Cozy Winter Jacket",
    category: "clothes",
    price: 899,
    image: "🧥",
    badge: "New",
  },
  {
    id: "rain-coat",
    name: "Rain Coat",
    category: "clothes",
    price: 749,
    image: "☔",
  },
  {
    id: "hypoallergenic-shampoo",
    name: "Hypoallergenic Shampoo",
    category: "products",
    price: 450,
    image: "🧴",
    badge: "Vet recommended",
  },
  {
    id: "tick-flea-spray",
    name: "Tick & Flea Spray",
    category: "products",
    price: 320,
    image: "🦠",
  },
];
