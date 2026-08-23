import { useEffect, useState } from "react";

export type CustomerUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

const CUSTOMER_USERS_KEY = "primo_customer_users";
const CURRENT_CUSTOMER_KEY = "primo_current_customer";

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("primo_customer_auth_update"));
  } catch (e) {
    console.error("Storage error", e);
  }
}

export function useCustomerAuth() {
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() =>
    getStorage<CustomerUser | null>(CURRENT_CUSTOMER_KEY, null),
  );

  useEffect(() => {
    const handleUpdate = () => {
      setCurrentUser(getStorage<CustomerUser | null>(CURRENT_CUSTOMER_KEY, null));
    };

    window.addEventListener("primo_customer_auth_update", handleUpdate);
    return () => window.removeEventListener("primo_customer_auth_update", handleUpdate);
  }, []);

  const register = (name: string, email: string, _password?: string) => {
    const users = getStorage<CustomerUser[]>(CUSTOMER_USERS_KEY, []);
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    const user: CustomerUser = existing ?? {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name,
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    if (!existing) {
      users.push(user);
      setStorage(CUSTOMER_USERS_KEY, users);
    }

    setStorage(CURRENT_CUSTOMER_KEY, user);
    return user;
  };

  const login = (email: string, _password?: string) => {
    const users = getStorage<CustomerUser[]>(CUSTOMER_USERS_KEY, []);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      setStorage(CURRENT_CUSTOMER_KEY, user);
      return user;
    }

    // Auto-create account if new
    const newUser: CustomerUser = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name: email.split("@")[0] || "Reader",
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setStorage(CUSTOMER_USERS_KEY, users);
    setStorage(CURRENT_CUSTOMER_KEY, newUser);
    return newUser;
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_CUSTOMER_KEY);
      window.dispatchEvent(new Event("primo_customer_auth_update"));
    }
  };

  return {
    user: currentUser,
    isLoggedIn: Boolean(currentUser),
    login,
    register,
    logout,
  };
}
