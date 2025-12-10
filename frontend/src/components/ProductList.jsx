import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const ProductList = ({ onAddToCart, categories }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  // Cargar productos
  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchTerm, sortBy, currentPage]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let filteredProducts = await apiService.products.getAll();
      
      // Filtrar por categoría
      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(
          product => product.category_id === parseInt(selectedCategory)
        );
      }
      
      // Filtrar por término de búsqueda
      if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Ordenar productos
      filteredProducts = sortProducts(filteredProducts, sortBy);
      
      setProducts(filteredProducts);
      setError(null);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'stock':
        return sorted.sort((a, b) => b.stock - a.stock);
      default:
        return sorted;
    }
  };

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filtros y búsqueda */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar productos
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categories?.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Nombre</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="stock">Stock</option>
            </select>
          </div>

          {/* Resultados */}
          <div className="flex items-end">
            <p className="text-sm text-gray-600">
              {products.length} productos encontrados
            </p>
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-3 py-2 rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* No hay productos */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron productos
          </p>
        </div>
      )}
    </div>
  );
};

// Componente para tarjeta de producto
const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await onAddToCart(product);
    setIsAdding(false);
  };

  const isInStock = product.stock > 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagen del producto (placeholder) */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Sin imagen</p>
        </div>
      </div>

      <div className="p-4">
        {/* Nombre del producto */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {product.name}
        </h3>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description || 'Sin descripción'}
        </p>

        {/* Categoría */}
        <div className="mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {product.category?.name || 'Sin categoría'}
          </span>
        </div>

        {/* Precio y stock */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-green-600">
              ${product.price.toFixed(2)}
            </p>
            <p className={`text-sm ${isLowStock ? 'text-orange-600' : 'text-gray-500'}`}>
              {isInStock ? (
                <>
                  Stock: {product.stock} {isLowStock && '(¡Últimas unidades!)'}
                </>
              ) : (
                <span className="text-red-600">Agotado</span>
              )}
            </p>
          </div>
        </div>

        {/* Botón de agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={!isInStock || isAdding}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            !isInStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isAdding
              ? 'bg-yellow-500 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isAdding ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Agregando...
            </span>
          ) : !isInStock ? (
            'Agotado'
          ) : (
            'Agregar al Carrito'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductList;