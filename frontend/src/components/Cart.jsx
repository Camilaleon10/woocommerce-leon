import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { mapsService } from '../services/maps';

const Cart = () => {
  const { 
    cartItems, 
    loading, 
    getCartSummary, 
    updateItemQuantity, 
    removeFromCart,
    clearCart 
  } = useCart();
  
  const { user, isAuthenticated } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [addressInput, setAddressInput] = useState(null);

  const cartSummary = getCartSummary();

  // Cargar ubicación del usuario
  useEffect(() => {
    if (isAuthenticated && showCheckout) {
      getUserLocation();
    }
  }, [isAuthenticated, showCheckout]);

  // Inicializar autocomplete de dirección
  useEffect(() => {
    if (showCheckout && addressInput) {
      mapsService.initialize().then(() => {
        mapsService.initializeAutocomplete(addressInput);
      });
    }
  }, [showCheckout, addressInput]);

  const getUserLocation = async () => {
    try {
      setLoadingLocation(true);
      const location = await mapsService.getCurrentLocation();
      setUserLocation(location);
      
      // Obtener dirección a partir de coordenadas
      const addressData = await mapsService.reverseGeocode(location.lat, location.lng);
      setDeliveryAddress(addressData.formattedAddress);
      
      // Verificar si está dentro del área de entrega
      const storeLocation = { lat: -2.196160, lng: -79.886207 }; // Coordenadas de ejemplo (Guayaquil)
      const deliveryCheck = mapsService.isWithinDeliveryArea(
        location.lat, 
        location.lng, 
        storeLocation.lat, 
        storeLocation.lng
      );
      
      setDeliveryInfo({
        ...deliveryCheck,
        estimatedTime: mapsService.calculateDeliveryTime(deliveryCheck.distance),
        available: mapsService.isDeliveryAvailable(),
      });
      
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleAddressChange = async (event) => {
    if (event.target.value) {
      setDeliveryAddress(event.target.value);
    }
  };

  const handleAddressSelect = async () => {
    try {
      const place = mapsService.getPlaceFromAutocomplete();
      setDeliveryAddress(place.formattedAddress);
      
      // Verificar distancia para entrega
      const storeLocation = { lat: -2.196160, lng: -79.886207 };
      const deliveryCheck = mapsService.isWithinDeliveryArea(
        place.lat, 
        place.lng, 
        storeLocation.lat, 
        storeLocation.lng
      );
      
      setDeliveryInfo({
        ...deliveryCheck,
        estimatedTime: mapsService.calculateDeliveryTime(deliveryCheck.distance),
        available: mapsService.isDeliveryAvailable(),
      });
      
    } catch (error) {
      console.error('Error seleccionando dirección:', error);
      alert('Por favor selecciona una dirección válida');
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateItemQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto del carrito?')) {
      await removeFromCart(itemId);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para realizar el pedido');
      return;
    }
    
    if (!deliveryAddress) {
      alert('Por favor ingresa una dirección de entrega');
      return;
    }
    
    if (deliveryInfo && !deliveryInfo.isWithinRange) {
      alert('La dirección seleccionada está fuera del área de entrega');
      return;
    }
    
    // Aquí iría la lógica de procesamiento del pedido
    alert('Pedido procesado con éxito');
    clearCart();
    setShowCheckout(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Debes <a href="/login" className="underline">iniciar sesión</a> para ver tu carrito de compras.</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500">Agrega algunos productos para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mi Carrito</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Productos ({cartItems.length})</h2>
            
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                loading={loading}
              />
            ))}
          </div>
        </div>

        {/* Resumen y checkout */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
            
            {/* Totales */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${cartSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>
                  {cartSummary.deliveryFee === 0 ? 'Gratis' : `$${cartSummary.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>IVA (12%):</span>
                <span>${cartSummary.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">${cartSummary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Botón de checkout */}
            {!showCheckout ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Proceder al Checkout
              </button>
            ) : (
              <div className="space-y-4">
                {/* Información de entrega */}
                <div>
                  <h3 className="font-semibold mb-2">Dirección de Entrega</h3>
                  
                  {/* Botón de usar ubicación actual */}
                  <button
                    onClick={getUserLocation}
                    disabled={loadingLocation}
                    className="w-full mb-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loadingLocation ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
                  </button>
                  
                  {/* Input para dirección manual */}
                  <div className="relative">
                    <input
                      ref={setAddressInput}
                      type="text"
                      value={deliveryAddress}
                      onChange={handleAddressChange}
                      placeholder="Ingresa tu dirección"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddressSelect}
                      className="absolute right-2 top-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Verificar
                    </button>
                  </div>
                </div>

                {/* Información de entrega */}
                {deliveryInfo && (
                  <div className={`p-3 rounded-md ${
                    deliveryInfo.isWithinRange 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <p className="font-semibold">
                      {deliveryInfo.isWithinRange ? '✓ Entrega disponible' : '✗ Fuera del área de entrega'}
                    </p>
                    <p className="text-sm">
                      Distancia: {deliveryInfo.distance} km
                    </p>
                    <p className="text-sm">
                      Tiempo estimado: {deliveryInfo.estimatedTime}
                    </p>
                    <p className="text-sm">
                      {mapsService.getDeliveryAvailabilityMessage()}
                    </p>
                  </div>
                )}

                {/* Botón de confirmar pedido */}
                <button
                  onClick={handleCheckout}
                  disabled={!deliveryInfo || !deliveryInfo.isWithinRange}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar Pedido
                </button>
                
                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para item del carrito
const CartItem = ({ item, onQuantityChange, onRemove, loading }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    setIsUpdating(true);
    await onQuantityChange(item.id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    await onRemove(item.id);
    setIsUpdating(false);
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      {/* Imagen del producto */}
      <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Información del producto */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.product?.name}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)} c/u</p>
        {item.product?.stock <= 5 && (
          <p className="text-orange-600 text-sm">¡Últimas {item.product.stock} unidades!</p>
        )}
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          -
        </button>
        
        <span className="w-12 text-center">{item.quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating || item.quantity >= item.product?.stock}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* Total y eliminar */}
      <div className="text-right">
        <p className="font-semibold text-lg">${item.total.toFixed(2)}</p>
        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default Cart;