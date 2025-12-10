import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { apiService } from './services/api';

// Componentes
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import Footer from './components/Footer';

// Componente de protección de rutas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente de protección para administradores
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated && isAdmin() ? children : <Navigate to="/login" />;
};

// Componente principal con contenido
const MainContent = () => {
  const { user, isAuthenticated } = useAuth();
  const { loadCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState('products');

  // Cargar categorías
  useEffect(() => {
    loadCategories();
  }, []);

  // Cargar carrito cuando el usuario inicia sesión
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart(user.id);
    }
  }, [isAuthenticated, user, loadCart]);

  const loadCategories = async () => {
    try {
      const categoriesData = await apiService.categories.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    const result = await loadCart.addToCart(product);
    if (result.success) {
      // Mostrar notificación de éxito
      showNotification(`${product.name} agregado al carrito`, 'success');
    } else {
      showNotification(result.error || 'Error al agregar al carrito', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    // Crear notificación simple (podrías usar una librería como react-toastify)
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        user={user}
        isAuthenticated={isAuthenticated}
        cartItemCount={loadCart.itemCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <ProductList 
              onAddToCart={handleAddToCart}
              categories={categories}
            />
          } />
          
          <Route path="/products" element={
            <ProductList 
              onAddToCart={handleAddToCart}
              categories={categories}
            />
          } />
          
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas de administrador */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>
                <p className="text-gray-600">Panel de administración en construcción...</p>
              </div>
            </AdminRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

// Componente App principal
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;