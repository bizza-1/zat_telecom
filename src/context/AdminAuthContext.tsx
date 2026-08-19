import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "./StoreContext";

interface AdminAuthContextType {
  authenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const ADMIN_SESSION_KEY = "zat_telecom_admin_session";
const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { settings } = useStore();
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem(ADMIN_SESSION_KEY) === "true");
  const login = (password: string) => {
    const valid = password === settings.adminPassword;
    if (valid) {
      localStorage.setItem(ADMIN_SESSION_KEY, "true");
      setAuthenticated(true);
    }
    return valid;
  };
  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthenticated(false);
  };
  return <AdminAuthContext.Provider value={{ authenticated, login, logout }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
}
