import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de API
export const apiService = {
  // Autenticación
  auth: {
    login: async (credentials) => {
      try {
        const response = await api.post('/login', credentials);
        const { token, user } = response.data;
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    register: async (userData) => {
      try {
        const response = await api.post('/register', userData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    logout: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    },
    
    getUser: async () => {
      try {
        const response = await api.get('/user');
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  },

  // Productos
  products: {
    getAll: async () => {
      try {
        const response = await api.get('/products');
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    getById: async (id) => {
      try {
        const response = await api.get(`/products/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    create: async (productData) => {
      try {
        const response = await api.post('/products', productData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    update: async (id, productData) => {
      try {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    delete: async (id) => {
      try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  },

  // Categorías
  categories: {
    getAll: async () => {
      try {
        const response = await api.get('/categories');
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    getById: async (id) => {
      try {
        const response = await api.get(`/categories/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    create: async (categoryData) => {
      try {
        const response = await api.post('/categories', categoryData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    update: async (id, categoryData) => {
      try {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    delete: async (id) => {
      try {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  },

  // Carrito de compras
  cart: {
    getByUser: async (userId) => {
      try {
        const response = await api.get(`/cart-items?user_id=${userId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    addItem: async (cartItem) => {
      try {
        const response = await api.post('/cart-items', cartItem);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    updateItem: async (id, quantity) => {
      try {
        const response = await api.put(`/cart-items/${id}`, { quantity });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    removeItem: async (id) => {
      try {
        const response = await api.delete(`/cart-items/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  },
};

export default api;