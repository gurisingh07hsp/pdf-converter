"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type User = {
  _Id?: string;
  name: string;
  email: string;
  role?: string;
  bookings?: string[];
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  fetchUser: () => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user from backend
  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/me", {
        withCredentials: true,
      });
      console.log("user : ", res.data);
      setUser(res.data.user? res.data.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout function
  const logout = async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Custom Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
