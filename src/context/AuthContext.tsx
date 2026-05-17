import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'kierownik' | 'magister' | 'technik' | 'pomoc' | 'sprzataczka';
  telefon: string;
  stanowisko: string;
  dzial: string;
  normahGodzin: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Symulacja logowania - w realnej aplikacji byłby API call
    if (email === 'test@apteka.pl' && password === 'password123') {
      const mockUser: User = {
        id: '1',
        email: 'test@apteka.pl',
        name: 'Jan Kowalski',
        role: 'technik',
        telefon: '+48 123 456 789',
        stanowisko: 'Technik Farmaceutyczny',
        dzial: 'Apteka Ogólna',
        normahGodzin: 40,
      };
      setUser(mockUser);
    } else {
      throw new Error('Nieprawidłowe dane logowania');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth musi być używany wewnątrz AuthProvider');
  }
  return context;
};
