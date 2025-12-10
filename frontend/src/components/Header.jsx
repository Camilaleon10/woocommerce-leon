import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ user, isAuthenticated, cartItemCount, currentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-gray-800">WooCommerce Leon</span>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`text-gray-600 hover:text-blue-600 transition-colors ${
                isActive('/') || isActive('/products') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Productos
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/cart"
                className={`text-gray-600 hover:text-blue-600 transition-colors relative ${
                  isActive('/cart') ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                Carrito
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated && user?.is_admin && (
              <Link
                to="/admin"
                className={`text-gray-600 hover:text-blue-600 transition-colors ${
                  isActive('/admin') ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                Administración
              </Link>
            )}
          </nav>

          {/* Menu de usuario */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 invisible group-hover:visible">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mis Pedidos
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón menu móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-blue-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="py-4 space-y-3">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Productos
              </Link>
              
              {isAuthenticated && (
                <Link
                  to="/cart"
                  className="block px-4 py-2 text-gray-600 hover:text-blue-600 relative"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Carrito
                  {cartItemCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}
              
              {isAuthenticated && user?.is_admin && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Administración
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Bienvenido, {user?.name}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-600 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-gray-600 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;