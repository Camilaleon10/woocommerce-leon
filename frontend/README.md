# Frontend WooCommerce Leon - HTML, CSS y JavaScript

Este es el frontend de la aplicación WooCommerce Leon, desarrollado con HTML, CSS y JavaScript vanilla para comunicarse con el backend Laravel.

## Características

- 🛍️ Catálogo de productos con búsqueda y filtros
- 🛒 Carrito de compras funcional
- 👤 Sistema de autenticación de usuarios
- 📱 Diseño responsivo para todos los dispositivos
- 🎨 Interfaz moderna y atractiva
- 🔗 Integración completa con el backend Laravel

## Estructura del Proyecto

```
frontend/
├── index.html          # Página principal de la aplicación
├── README.md           # Este archivo
└── assets/             # Carpeta para imágenes y otros recursos (opcional)
```

## Requisitos Previos

1. **Servidor Backend Laravel**: Asegúrate de que el backend Laravel esté ejecutándose en `http://localhost:8000`
2. **Navegador Web Moderno**: Chrome, Firefox, Safari, Edge (con soporte para ES6+)
3. **Servidor Web Local**: Opcional, para servir los archivos estáticos

## Configuración

### 1. Configurar la API del Backend

Abre el archivo `index.html` y verifica que la URL de la API esté correctamente configurada:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### 2. Configurar Google Maps API (Opcional)

Si planeas usar la funcionalidad de geolocalización, configura tu API key de Google Maps:

```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&libraries=places"></script>
```

Reemplaza `TU_API_KEY` con tu clave de API de Google Maps.

## Cómo Ejecutar el Frontend

### Opción 1: Abrir directamente en el navegador

La forma más sencilla es abrir el archivo `index.html` directamente en tu navegador:

1. Abre tu navegador web
2. Arrastra y suelta el archivo `index.html` en la ventana del navegador
3. O haz doble clic en el archivo `index.html`

### Opción 2: Usar un servidor web local (Recomendado)

Para evitar problemas de CORS y tener una experiencia más similar a producción:

#### Usando Python (si tienes Python instalado):

```bash
# Python 3
python -m http.server 8001

# Python 2
python -m SimpleHTTPServer 8001
```

Luego abre `http://localhost:8001` en tu navegador.

#### Usando Node.js (si tienes Node.js instalado):

```bash
# Instalar servidor HTTP globalmente
npm install -g http-server

# Iniciar servidor en el directorio frontend
http-server -p 8001
```

Luego abre `http://localhost:8001` en tu navegador.

#### Usando PHP (si tienes PHP instalado):

```bash
php -S localhost:8001
```

Luego abre `http://localhost:8001` en tu navegador.

## Funcionalidades

### 1. Catálogo de Productos

- Visualización de todos los productos disponibles
- Búsqueda de productos por nombre o descripción
- Filtrado por categorías
- Ordenamiento por nombre o precio
- Indicadores de stock (disponible, bajo stock, agotado)

### 2. Carrito de Compras

- Agregar productos al carrito (requiere autenticación)
- Modificar cantidades de los productos
- Eliminar productos del carrito
- Cálculo automático de subtotal, IVA (12%) y envío
- Vaciar carrito completo

### 3. Autenticación de Usuarios

- Registro de nuevos usuarios
- Inicio de sesión
- Mantenimiento de sesión con localStorage
- Cierre de sesión

### 4. Diseño Responsivo

- Adaptación automática a diferentes tamaños de pantalla
- Navegación optimizada para móviles
- Interfaz táctil amigable

## API Endpoints Utilizados

El frontend se comunica con los siguientes endpoints del backend Laravel:

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/{id}` - Obtener un producto específico

### Categorías
- `GET /api/categories` - Obtener todas las categorías

### Autenticación
- `POST /api/register` - Registrar nuevo usuario
- `POST /api/login` - Iniciar sesión
- `GET /api/user` - Obtener usuario autenticado

### Carrito
- `POST /api/cart-items` - Agregar item al carrito
- `PUT /api/cart-items/{id}` - Actualizar cantidad de un item
- `DELETE /api/cart-items/{id}` - Eliminar item del carrito
- `DELETE /api/cart-items/clear` - Vaciar carrito

## Personalización

### Cambiar Colores y Estilos

Los estilos están definidos en la sección `<style>` del archivo `index.html`. Puedes modificar:

- **Colores principales**: Busca las variables CSS o los colores hexadecimales
- **Tipografía**: Modifica las fuentes importadas desde Google Fonts
- **Espaciado**: Ajusta los valores de padding y margin
- **Responsive**: Modifica los media queries para diferentes puntos de quiebre

### Agregar Nuevas Funcionalidades

Para agregar nuevas funcionalidades:

1. **HTML**: Agrega nuevos elementos en las secciones correspondientes
2. **CSS**: Añade estilos para los nuevos elementos
3. **JavaScript**: Implementa la lógica en las funciones existentes o crea nuevas

## Solución de Problemas

### Problemas Comunes

1. **Error de CORS**: Si recibes errores de CORS, asegúrate de:
   - El backend Laravel esté configurado para permitir solicitudes desde tu dominio
   - Estés usando un servidor web local en lugar de abrir el archivo directamente

2. **Error de Autenticación**: Si no puedes iniciar sesión:
   - Verifica que el backend esté funcionando correctamente
   - Revisa la consola del navegador para ver errores de red

3. **Productos no cargan**: Si el catálogo está vacío:
   - Asegúrate de que haya productos en la base de datos del backend
   - Verifica que la URL de la API sea correcta

### Depuración

Usa la consola de desarrollador de tu navegador (F12) para:
- Ver errores de JavaScript
- Inspeccionar solicitudes de red
- Revisar el estado de la aplicación

## Mejoras Futuras

Algunas mejoras que podrías implementar:

1. **Paginación**: Para manejar grandes cantidades de productos
2. **Detalles de producto**: Página individual para cada producto
3. **Gestión de direcciones**: Para envíos
4. **Procesamiento de pagos**: Integración con pasarelas de pago
5. **Historial de pedidos**: Ver pedidos anteriores
6. **Calificaciones y reseñas**: Sistema de valoración de productos
7. **Wishlist**: Lista de deseos de productos
8. **Comparación de productos**: Comparar características

## Contribución

Si deseas contribuir al proyecto:

1. Realiza un fork del repositorio
2. Crea una rama para tu funcionalidad
3. Realiza los cambios necesarios
4. Prueba thoroughly
5. Envía un pull request

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## Soporte

Si encuentras algún problema o tienes alguna pregunta:

1. Revisa esta documentación
2. Consulta la sección de solución de problemas
3. Abre un issue en el repositorio del proyecto

---

**Nota**: Este frontend está diseñado para funcionar específicamente con el backend Laravel de WooCommerce Leon. Asegúrate de tener ambos componentes correctamente configurados para un funcionamiento óptimo.