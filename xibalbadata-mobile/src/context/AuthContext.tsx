import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api, TOKEN_KEY } from '../api/client';

const USER_KEY = 'xd_user';

export type Usuario = {
  id_us: number;
  nombre: string;
  matricula?: string;
  telefono?: string;
  correo: string;
  rol: string; // 'administrador' | 'operador'
};

type AuthContextType = {
  usuario: Usuario | null;
  cargando: boolean;
  signIn: (correo: string, contrasena: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // Al abrir la app, restaura la sesión guardada
useEffect(() => {
  (async () => {
    try {
      const user = await SecureStore.getItemAsync(USER_KEY);
      if (user) setUsuario(JSON.parse(user));
    } finally {
      setCargando(false);
    }
  })();
}, []);

const signIn = async (correo: string, contrasena: string) => {
  const { data } = await api.post('/api/usuarios/login', { correo, contrasena });
  const user: Usuario = data;
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  setUsuario(user);
};

const signOut = async () => {
  await SecureStore.deleteItemAsync(USER_KEY);
  setUsuario(null);
};

  return (
    <AuthContext.Provider value={{ usuario, cargando, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}