import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../data/products";
import {
  loadState,
  saveState,
  resetToSeed as resetToSeedState,
  type Brand,
  type Category,
  type PartType,
  type Settings,
  type StoreState,
} from "../data/store";

interface StoreContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  partTypes: PartType[];
  settings: Settings;
  getProduct: (id: string) => Product | undefined;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetToSeed: () => void;
  replaceState: (state: StoreState) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(loadState);

  // Persist on every change. This is the seam that becomes an API call once a
  // real backend lands — the component-facing API below stays the same.
  useEffect(() => {
    saveState(state);
  }, [state]);

  const getProduct = (id: string) => state.products.find((p) => p.id === id);

  const addProduct = (product: Product) =>
    setState((s) => ({ ...s, products: [product, ...s.products] }));

  const updateProduct = (product: Product) =>
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === product.id ? product : p)),
    }));

  const deleteProduct = (id: string) =>
    setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));

  const addCategory = (category: Category) =>
    setState((s) => ({ ...s, categories: [...s.categories, category] }));

  const updateCategory = (category: Category) =>
    setState((s) => ({
      ...s,
      categories: s.categories.map((c) => (c.id === category.id ? category : c)),
    }));

  const deleteCategory = (id: string) =>
    setState((s) => ({ ...s, categories: s.categories.filter((c) => c.id !== id) }));

  const updateSettings = (patch: Partial<Settings>) =>
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));

  const resetToSeed = () => setState(resetToSeedState());

  const replaceState = (next: StoreState) => setState(next);

  return (
    <StoreContext.Provider
      value={{
        products: state.products,
        categories: state.categories,
        brands: state.brands,
        partTypes: state.partTypes,
        settings: state.settings,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        resetToSeed,
        replaceState,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
