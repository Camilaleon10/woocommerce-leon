# Frontend WooCommerce Leon

Frontend desarrollado con HTML, CSS y JavaScript vanilla para comunicarse con el backend Laravel de WooCommerce Leon.

## 📁 Estructura del Proyecto

```
frontend/
├── index.html          # Página principal de la aplicación
├── css/
│   └── style.css      # Estilos principales de la aplicación
├── js/
│   ├── api.js         # Funciones de comunicación con la API
│   ├── auth.js        # Lógica de autenticación
│   ├── cart.js        # Gestión del carrito de compras
│   ├── products.js    # Gestión de productos y filtros
│   └── app.js         # Funciones globales y utilidades
└── assets/
    └── images/         # Imágenes y recursos visuales
```

## 🚀 Cómo Usar

### 1. Requisitos Previos
- Backend Laravel funcionando en `http://localhost:8000`
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### 2. Iniciar el Frontend

#### Opción A: Abrir directamente
1. Abre tu navegador web
2. Arrastra el archivo `index.html` a la ventana del navegador
3. Listo para usar

#### Opción B: Servidor local (Recomendado)
```bash
# Con Python
cd frontend
python -m http.server 8001

# Con Node.js
cd frontend
npx http-server -p 8001

# Con PHP
cd frontend
php -S localhost:8001
```

Luego abre `http://localhost:8001` en tu navegador.

## 🔧 Configuración

### URL de la API
La URL del backend está configurada en `js/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

Si tu backend está en otro puerto, modifica esta línea.

## 📱 Funcionalidades

### 1. Catálogo de Productos
- Visualización de todos los productos disponibles
- Búsqueda en tiempo real con debounce
- Filtrado por categorías
- Ordenamiento por nombre o precio
- Indicadores de stock (disponible, bajo stock, agotado)

### 2. Carrito de Compras
- Agregar productos al carrito (requiere autenticación)
- Modificar cantidades de productos
- Eliminar productos del carrito
- Cálculo automático de subtotal, IVA (12%) y envío
- Vaciar carrito completo
- Persistencia de datos en el backend

### 3. Autenticación de Usuarios
- Registro de nuevos usuarios
- Inicio de sesión con tokens
- Mantenimiento de sesión con localStorage
- Cierre de sesión
- Protección de rutas

### 4. Diseño Responsivo
- Adaptación automática a diferentes tamaños de pantalla
- Navegación optimizada para móviles
- Interfaz táctil amigable

## 🔌 Comunicación con el Backend

### Endpoints Utilizados

#### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/{id}` - Obtener un producto específico

#### Categorías
- `GET /api/categories` - Obtener todas las categorías

#### Autenticación
- `POST /api/register` - Registrar nuevo usuario
- `POST /api/login` - Iniciar sesión
- `GET /api/user` - Obtener usuario autenticado
- `POST /api/logout` - Cerrar sesión

#### Carrito
- `POST /api/cart-items` - Agregar item al carrito
- `PUT /api/cart-items/{id}` - Actualizar cantidad
- `DELETE /api/cart-items/{id}` - Eliminar item
- `DELETE /api/cart-items/clear` - Vaciar carrito

## 🎨 Personalización

### Modificar Estilos
Edita el archivo `css/style.css` para personalizar:
- Colores y tipografía
- Espaciado y dimensiones
- Animaciones y transiciones
- Media queries para responsividad

### Modificar Funcionalidades
Edita los archivos JavaScript para agregar:
- Nuevas funcionalidades
- Modificar comportamiento existente
- Integrar con APIs adicionales

## 🔍 Depuración

### Consola del Navegador
Presiona F12 para abrir las herramientas de desarrollador:
- **Console**: Ver errores y mensajes de depuración
- **Network**: Ver peticiones HTTP y respuestas
- **Elements**: Inspeccionar HTML y CSS

### Modo Desarrollo
Los archivos JavaScript incluyen mensajes de depuración:
```javascript
console.log('Cargando productos...');
console.log('Usuario autenticado:', currentUser);
```

## 🛠️ Mantenimiento

### Actualizar Datos
Los productos y categorías se cargan dinámicamente desde el backend. Para actualizar:
1. Actualiza los datos en el backend Laravel
2. Refresca la página del frontend

### Limpiar Cache
- Limpia el cache del navegador (Ctrl+Shift+R)
- Limpia localStorage si es necesario

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Dispositivos
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Móvil (< 768px)

## 🚀 Despliegue

### Para Producción
1. Sube la carpeta `frontend` a tu servidor web
2. Configura un servidor web (Apache, Nginx)
3. Actualiza la URL de la API si es necesario
4. Configura HTTPS para producción

### Consideraciones
- Minifica CSS y JavaScript para producción
- Optimiza imágenes
- Configura cache HTTP
- Usa CDN para recursos estáticos

## 🔐 Seguridad

### Implementaciones
- Tokens de autenticación con Laravel Sanctum
- Validación de entradas de usuario
- Protección CSRF
- HTTPS en producción

### Recomendaciones
- No exponer credenciales en el frontend
- Validar todos los datos del lado del servidor
- Implementar rate limiting en el backend

## 🆘 Soporte

### Problemas Comunes
1. **Error de conexión**: Verifica que el backend esté funcionando
2. **CORS**: Configura correctamente los orígenes permitidos
3. **Autenticación**: Limpia localStorage si hay problemas
4. **Rendimiento**: Usa un servidor local para desarrollo

### Contacto
Para soporte técnico o reportar problemas:
1. Revisa la consola del navegador
2. Verifica los logs del backend Laravel
3. Documenta los pasos para reproducir el problema

---

**Este frontend está diseñado para funcionar perfectamente con el backend Laravel de WooCommerce Leon.** 🎯