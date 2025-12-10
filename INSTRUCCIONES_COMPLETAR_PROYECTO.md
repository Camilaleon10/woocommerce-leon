# Instrucciones para Completar el Proyecto WooCommerce Leon

## 🎯 Resumen del Proyecto

Has creado un sistema completo de e-commerce con:
- **Backend**: Laravel 11 con API RESTful
- **Frontend**: React Vite con Tailwind CSS
- **Geolocalización**: Google Maps API integrada
- **Autenticación**: Laravel Sanctum

## 📋 Pasos para Poner en Marcha

### 1. Configurar Backend Laravel

```bash
# Desde la raíz del proyecto (Woocommerce-Leon)
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
```

### 2. Instalar Dependencias del Frontend

```bash
# Desde la carpeta frontend
cd frontend
npm install
```

### 3. Configurar Variables de Entorno

#### Backend (.env)
```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Opcional: Configurar para MySQL
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=woocommerce_leon
# DB_USERNAME=root
# DB_PASSWORD=
```

#### Frontend (frontend/.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
```

### 4. Obtener Google Maps API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Habilita estas APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Crea una API Key con restricciones:
   - Aplicaciones web: `http://localhost:3000`
   - HTTP referers: `http://localhost:3000/*`

### 5. Iniciar Servidores

#### Terminal 1 - Backend Laravel
```bash
php artisan serve
# Disponible en: http://localhost:8000
```

#### Terminal 2 - Frontend React
```bash
cd frontend
npm run dev
# Disponible en: http://localhost:3000
```

## 🔧 Configuraciones Adicionales

### Instalar Paquete CORS para Laravel

```bash
composer require fruitcake/laravel-cors
```

### Actualizar Bootstrap de Laravel

En `bootstrap/app.php`, asegúrate de tener:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\IsAdmin::class,
    ]);
    
    $middleware->api(prepend: [
        \Fruitcake\Cors\HandleCors::class,
    ]);
})
```

### Instalar Tailwind CSS en Frontend

```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
```

## 🧪 Testing del Sistema

### 1. Probar Backend
```bash
php artisan serve
# Probar endpoints:
# GET http://localhost:8000/api/products
# GET http://localhost:8000/api/categories
# POST http://localhost:8000/api/login
```

### 2. Probar Frontend
```bash
cd frontend
npm run dev
# Acceder a http://localhost:3000
```

### 3. Crear Usuario de Prueba
```bash
php artisan tinker
# Ejecutar:
User::create([
    'name' => 'Admin User',
    'email' => 'admin@test.com',
    'password' => Hash::make('password'),
    'is_admin' => true
]);
```

## 📱 Funcionalidades Implementadas

### ✅ Backend Laravel
- [x] API RESTful completa
- [x] Autenticación con Sanctum
- [x] Middleware de administrador
- [x] Modelo de datos (Users, Products, Categories, CartItems)
- [x] Migraciones y seeders
- [x] Configuración CORS

### ✅ Frontend React
- [x] Catálogo de productos con búsqueda y filtros
- [x] Carrito de compras funcional
- [x] Sistema de autenticación
- [x] Geolocalización con Google Maps
- [x] Diseño responsivo con Tailwind CSS
- [x] Rutas protegidas
- [x] Contextos de React para estado global

### ✅ Integración Google Maps
- [x] Detección automática de ubicación
- [x] Autocompletado de direcciones
- [x] Verificación de área de entrega
- [x] Cálculo de distancia y tiempo de entrega

## 🚀 Despliegue

### Backend (Producción)
```bash
# Configurar variables de producción
# Configurar base de datos MySQL/PostgreSQL
# Configurar dominio en APP_URL
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend (Producción)
```bash
cd frontend
npm run build
# Desplegar carpeta dist/
```

## 🔍 Solución de Problemas Comunes

### CORS Errors
- Verificar que `fruitcake/laravel-cors` esté instalado
- Configurar `config/cors.php` correctamente
- Revisar middleware en `bootstrap/app.php`

### Google Maps API
- Verificar que la API Key sea válida
- Confirmar que las APIs estén habilitadas
- Revisar restricciones de dominio

### Autenticación
- Verificar que Laravel Sanctum esté configurado
- Revisar headers de autorización
- Limpiar localStorage si hay problemas

### Base de Datos
- Ejecutar `php artisan migrate:fresh --seed`
- Verificar permisos de la carpeta `database/`
- Configurar correctamente las variables de entorno

## 📚 Documentación Adicional

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google Maps API](https://developers.google.com/maps/documentation)

## 🎉 ¡Listo para Usar!

Una vez completados estos pasos, tendrás un sistema de e-commerce completamente funcional con:

- 📦 Gestión de productos
- 🛒 Carrito de compras
- 👥 Sistema de usuarios
- 📍 Entregas con geolocalización
- 📱 Interfaz moderna y responsiva
- 🔐 Sistema de autenticación seguro

**Usuarios de prueba creados por defecto:**
- **Administrador**: admin@example.com / password
- **Usuario**: test@example.com / password

---

¡Disfruta de tu tienda WooCommerce Leon! 🛍️