// Servicio para manejar la geolocalización y Google Maps API

class MapsService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    this.map = null;
    this.marker = null;
    this.geocoder = null;
    this.autocomplete = null;
  }

  // Inicializar el servicio de Google Maps
  async initialize() {
    if (!this.apiKey) {
      console.warn('Google Maps API key no configurada');
      return false;
    }

    try {
      // Cargar Google Maps API
      await this.loadGoogleMaps();
      
      // Inicializar geocoder
      this.geocoder = new window.google.maps.Geocoder();
      
      return true;
    } catch (error) {
      console.error('Error al inicializar Google Maps:', error);
      return false;
    }
  }

  // Cargar dinámicamente Google Maps API
  loadGoogleMaps() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places&callback=initGoogleMaps`;
      
      window.initGoogleMaps = () => {
        delete window.initGoogleMaps;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Error al cargar Google Maps API'));
      };

      document.head.appendChild(script);
    });
  }

  // Obtener ubicación actual del usuario
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada por este navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(new Error(`Error de geolocalización: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutos
        }
      );
    });
  }

  // Geocodificación: convertir dirección a coordenadas
  async geocodeAddress(address) {
    if (!this.geocoder) {
      throw new Error('Geocoder no inicializado');
    }

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            formattedAddress: results[0].formatted_address,
            placeId: results[0].place_id,
          });
        } else {
          reject(new Error(`Geocodificación fallida: ${status}`));
        }
      });
    });
  }

  // Geocodificación inversa: convertir coordenadas a dirección
  async reverseGeocode(lat, lng) {
    if (!this.geocoder) {
      throw new Error('Geocoder no inicializado');
    }

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve({
            formattedAddress: results[0].formatted_address,
            addressComponents: results[0].address_components,
            placeId: results[0].place_id,
          });
        } else {
          reject(new Error(`Geocodificación inversa fallida: ${status}`));
        }
      });
    });
  }

  // Calcular distancia entre dos puntos (en kilómetros)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Redondear a 2 decimales
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Verificar si la ubicación está dentro del área de entrega
  isWithinDeliveryArea(userLat, userLng, storeLat, storeLng, maxDistance = 10) {
    const distance = this.calculateDistance(userLat, userLng, storeLat, storeLng);
    return {
      isWithinRange: distance <= maxDistance,
      distance: distance,
      maxDistance: maxDistance,
    };
  }

  // Inicializar autocomplete para dirección
  initializeAutocomplete(inputElement) {
    if (!window.google || !window.google.maps) {
      throw new Error('Google Maps API no cargada');
    }

    this.autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
      types: ['address'],
      componentRestrictions: { country: ['ec'] }, // Restringir a Ecuador
    });

    return this.autocomplete;
  }

  // Obtener dirección seleccionada del autocomplete
  getPlaceFromAutocomplete() {
    if (!this.autocomplete) {
      throw new Error('Autocomplete no inicializado');
    }

    const place = this.autocomplete.getPlace();
    
    if (!place.geometry) {
      throw new Error('Por favor selecciona una dirección de la lista');
    }

    return {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      formattedAddress: place.formatted_address,
      placeId: place.place_id,
      addressComponents: place.address_components,
    };
  }

  // Calcular tiempo de entrega estimado basado en distancia
  calculateDeliveryTime(distance) {
    // Suponiendo velocidad promedio de 40 km/h en ciudad
    const averageSpeed = 40; // km/h
    const baseTime = 15; // minutos base para preparación
    const travelTime = (distance / averageSpeed) * 60; // convertir a minutos
    
    const totalMinutes = baseTime + travelTime;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes} minutos`;
    }
  }

  // Verificar disponibilidad de entrega en horario actual
  isDeliveryAvailable() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Domingo = 0, Lunes = 1, ..., Sábado = 6
    const isWeekend = day === 0 || day === 6;
    
    // Horario de entrega: Lunes a Viernes 8am-8pm, Sábados 9am-6pm
    if (isWeekend) {
      return hour >= 9 && hour < 18;
    } else {
      return hour >= 8 && hour < 20;
    }
  }

  // Obtener mensaje de disponibilidad de entrega
  getDeliveryAvailabilityMessage() {
    if (this.isDeliveryAvailable()) {
      return 'Entrega disponible actualmente';
    } else {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      if (day === 0 || day === 6) {
        return 'Entrega disponible de 9am a 6pm';
      } else {
        return 'Entrega disponible de 8am a 8pm';
      }
    }
  }
}

// Exportar instancia única del servicio
export const mapsService = new MapsService();
export default mapsService;