import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Calcular totales cuando cambian los items del carrito
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.total, 0);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal(total);
    setItemCount(count);
  }, [cartItems]);

  // Cargar carrito del usuario autenticado
  const loadCart = async (userId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const items = await apiService.cart.getByUser(userId);
      setCartItems(items);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agregar item al carrito
  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      
      // Verificar si el producto ya está en el carrito
      const existingItem = cartItems.find(item => item.product_id === product.id);
      
      if (existingItem) {
        // Actualizar cantidad si ya existe
        const updatedQuantity = existingItem.quantity + quantity;
        await updateItemQuantity(existingItem.id, updatedQuantity);
      } else {
        // Agregar nuevo item
        const cartItem = {
          product_id: product.id,
          quantity: quantity,
          user_id: JSON.parse(localStorage.getItem('user'))?.id,
        };
        
        const newItem = await apiService.cart.addItem(cartItem);
        setCartItems(prev => [...prev, { ...newItem, product }]);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad de un item
  const updateItemQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }
    
    try {
      setLoading(true);
      const updatedItem = await apiService.cart.updateItem(itemId, quantity);
      
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: updatedItem.quantity, total: updatedItem.total }
            : item
        )
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar item del carrito
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      await apiService.cart.removeItem(itemId);
      
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
    setCartTotal(0);
    setItemCount(0);
  };

  // Verificar stock antes de agregar al carrito
  const checkStock = (product, quantity) => {
    if (product.stock < quantity) {
      return {
        available: false,
        message: `Solo hay ${product.stock} unidades disponibles`,
      };
    }
    
    return { available: true };
  };

  // Obtener resumen del carrito
  const getCartSummary = () => {
    const subtotal = cartTotal;
    const deliveryFee = cartTotal > 50 ? 0 : 5; // Envío gratis sobre $50
    const tax = subtotal * 0.12; // 12% IVA en Ecuador
    const total = subtotal + deliveryFee + tax;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      deliveryFee: Math.round(deliveryFee * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      itemCount,
      itemDetails: cartItems.map(item => ({
        id: item.id,
        name: item.product?.name || 'Producto',
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    };
  };

  // Verificar si el carrito tiene productos con bajo stock
  const checkLowStock = () => {
    return cartItems.filter(item => item.product?.stock <= 5);
  };

  const value = {
    cartItems,
    loading,
    cartTotal,
    itemCount,
    loadCart,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    checkStock,
    getCartSummary,
    checkLowStock,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};