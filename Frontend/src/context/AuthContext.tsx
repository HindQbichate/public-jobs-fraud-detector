// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { DecodedToken, getUser, logout as clearSession } from "../services/authService";


type AuthContextType = {
  user: DecodedToken | null;
  setUser: (u: DecodedToken | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(getUser());

  const logout = () => {
    clearSession();
    setUser(null);
  };

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
