import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un token almacenado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verificar si el token es válido
          const userData = await apiService.auth.getUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token inválido, limpiar almacenamiento
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.auth.login(credentials);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await apiService.auth.register(userData);
      
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.message || 'Error al registrar usuario';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función para actualizar datos del usuario
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Verificar si el usuario es administrador
  const isAdmin = () => {
    return user?.is_admin === true;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};