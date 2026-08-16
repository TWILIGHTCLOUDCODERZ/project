import { createContext, useContext, useState, type ReactNode } from 'react';

const SELLER_EMAIL = 'Tyson@gmail.com';
const SELLER_PASSWORD = 'Tyson@9999!@#';
const STORAGE_KEY = 'tcc_seller_session';

interface SellerUser {
  name: string;
  email: string;
  role: string;
}

interface SellerAuthContextValue {
  seller: SellerUser | null;
  login: (email: string, password: string) => Promise<void>;
  logOut: () => void;
}

const SellerAuthContext = createContext<SellerAuthContextValue | null>(null);

function readStoredSeller(): SellerUser | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'email' in parsed &&
      typeof parsed.email === 'string' &&
      parsed.email.toLowerCase() === SELLER_EMAIL.toLowerCase()
    ) {
      return parsed as SellerUser;
    }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  sessionStorage.removeItem(STORAGE_KEY);
  return null;
}

export function SellerAuthProvider({ children }: { children: ReactNode }) {
  const [seller, setSeller] = useState<SellerUser | null>(readStoredSeller);

  const login = async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    if (normalized === SELLER_EMAIL.toLowerCase() && password === SELLER_PASSWORD) {
      const user: SellerUser = { name: 'Tyson', email: SELLER_EMAIL, role: 'Executive Seller' };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setSeller(user);
    } else {
      throw new Error('invalid-credentials');
    }
  };

  const logOut = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSeller(null);
  };

  return (
    <SellerAuthContext.Provider value={{ seller, login, logOut }}>
      {children}
    </SellerAuthContext.Provider>
  );
}

export function useSellerAuth() {
  const ctx = useContext(SellerAuthContext);
  if (!ctx) throw new Error('useSellerAuth must be used inside SellerAuthProvider');
  return ctx;
}
