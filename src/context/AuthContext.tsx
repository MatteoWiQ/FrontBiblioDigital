// Global
import { createContext, useState, useEffect,type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';


interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {

        const decoded: any = jwtDecode(token);
        setRole(decoded.rol || decoded.role || null); 
      } catch (error) {
        console.error("Token inválido", error);
        logout();
      }
    } else {
      setRole(null);
    }
  }, [token]);


  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };


  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
  <AuthContext.Provider value={{ token, role, login, logout }}>
    {children}
  </AuthContext.Provider>
);
};