# WooCommerce Leon - Frontend

Frontend de la aplicación de e-commerce WooCommerce Leon, construido con React Vite y Tailwind CSS.

## Características

- 🛒 Catálogo de productos con búsqueda y filtros
- 🛒 Carrito de compras funcional
- 👤 Sistema de autenticación de usuarios
- 📍 Geolocalización con Google Maps API
- 📱 Diseño responsivo
- 🎨 Interfaz moderna con Tailwind CSS
- ⚡ Rendimiento optimizado con Vite

## Tecnologías Utilizadas

- **React 18** - Framework de JavaScript
- **Vite** - Herramienta de construcción
- **React Router** - Enrutamiento
- **Tailwind CSS** - Framework de CSS
- **Axios** - Cliente HTTP
- **Google Maps API** - Geolocalización

## Requisitos Previos

- Node.js 18+
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd Woocommerce-Leon/frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Configurar tu Google Maps API Key en `.env`:
```
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

5. Iniciar servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Configuración

### Variables de Entorno

- `VITE_API_URL` - URL de la API de Laravel (default: http://localhost:8000/api)
- `VITE_GOOGLE_MAPS_API_KEY` - API Key de Google Maps
- `VITE_APP_NAME` - Nombre de la aplicación
- `VITE_APP_URL` - URL de la aplicación frontend

### Google Maps API

Para obtener una API Key de Google Maps:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Crea una API Key con restricciones apropiadas
5. Añade la API Key a tu archivo `.env`

## Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── ProductList.jsx
│   │   ├── Cart.jsx
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── context/           # Contextos de React
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/             # Páginas de la aplicación
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/          # Servicios de API
│   │   ├── api.js
│   │   └── maps.js
│   ├── utils/             # Utilidades
│   ├── hooks/             # Hooks personalizados
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Funcionalidades

### 🏠 Catálogo de Productos
- Vista en grid con diseño responsivo
- Búsqueda por nombre y descripción
- Filtro por categoría
- Ordenamiento por nombre, precio y stock
- Indicadores de stock y disponibilidad

### 🛒 Carrito de Compras
- Agregar/eliminar productos
- Actualizar cantidades
- Cálculo automático de totales
- Integración con geolocalización para entrega

### 👤 Autenticación
- Registro e inicio de sesión
- Tokens JWT con Laravel Sanctum
- Protección de rutas
- Perfil de usuario

### 📍 Geolocalización
- Detección automática de ubicación
- Autocompletado de direcciones
- Verificación de área de entrega
- Cálculo de tiempo de entrega

### 📱 Diseño Responsivo
- Mobile-first approach
- Navegación adaptativa
- Optimizado para todos los dispositivos

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar construcción de producción
- `npm run lint` - Ejecutar linter

## Integración con Backend

El frontend está configurado para comunicarse con el backend Laravel a través de:

- **API REST** en `/api`
- **Autenticación** con tokens Bearer
- **CORS** configurado para permitir peticiones del frontend

## Despliegue

### Producción
1. Construir la aplicación:
```bash
npm run build
```

2. Desplegar los archivos de la carpeta `dist/`

3. Configurar las variables de entorno de producción

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Desplegar la carpeta dist/
```

## Contribución

1. Fork del proyecto
2. Crear rama de feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit de cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Soporte

Para soporte o preguntas:
- 📧 Email: info@woocommerce-leon.com
- 🌐 Web: www.woocommerce-leon.com
- 📱 Teléfono: +593 9 8765 4321

---

**Desarrollado con ❤️ para WooCommerce Leon**