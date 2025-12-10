# Inicio Rápido - Frontend WooCommerce Leon

Guía rápida para poner en marcha el frontend de WooCommerce Leon con HTML, CSS y JavaScript vanilla.

## 🚀 Pasos para Empezar

### 1. Requisitos Previos

- Backend Laravel funcionando en `http://localhost:8000`
- Navegador web moderno
- (Opcional) Servidor web local para mejor experiencia

### 2. Iniciar el Backend Laravel

```bash
# En la raíz del proyecto Laravel
php artisan serve
```

Asegúrate de que el backend esté respondiendo en `http://localhost:8000`

### 3. Ejecutar el Frontend

#### Opción A: Abrir directamente (Más simple)

1. Abre tu navegador web
2. Haz doble clic en el archivo `frontend/index.html`
3. Listo! 🎉

#### Opción B: Servidor local (Recomendado)

```bash
# Entrar a la carpeta frontend
cd frontend

# Usar Python (si lo tienes instalado)
python -m http.server 8001

# O usar Node.js (si lo tienes instalado)
npx http-server -p 8001
```

Luego abre `http://localhost:8001` en tu navegador.

## 🛍️ Funcionalidades Disponibles

### 1. Catálogo de Productos
- Ver todos los productos disponibles
- Buscar productos por nombre
- Filtrar por categorías
- Ordenar por nombre o precio

### 2. Carrito de Compras
- Agregar productos (requiere login)
- Modificar cantidades
- Ver subtotal, IVA y envío
- Eliminar productos

### 3. Autenticación
- Registro de nuevos usuarios
- Inicio de sesión
- Mantenimiento de sesión

## 🔧 Configuración Básica

### API URL

Verifica que la URL de la API sea correcta en `index.html`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Google Maps (Opcional)

Si quieres usar geolocalización, configura tu API key:

```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&libraries=places"></script>
```

## 📱 Uso de la Aplicación

### Navegación

1. **Productos**: Página principal con el catálogo
2. **Carrito**: Ver y gestionar tu carrito de compras
3. **Login/Registro**: Acceder o crear una cuenta

### Flujo de Compra

1. Navega por los productos
2. Inicia sesión o regístrate
3. Agrega productos al carrito
4. Revisa tu carrito
5. Procede al checkout

## 🎨 Personalización Rápida

### Cambiar Colores

Busca estas líneas en el CSS dentro de `index.html`:

```css
/* Color principal */
.btn-primary { background: #2563eb; }

/* Color de éxito */
.notification { background: #10b981; }

/* Color de error */
.error { background: #ef4444; }
```

### Cambiar Logo

Modifica esta sección en el HTML:

```html
<div class="logo">
    <div class="logo-icon">W</div>
    <span>WooCommerce Leon</span>
</div>
```

## 🔍 Solución de Problemas

### Error de CORS
Si ves errores de CORS en la consola:
1. Asegúrate de que el backend Laravel esté configurado para CORS
2. Usa un servidor local en lugar de abrir el archivo directamente

### Productos no cargan
1. Verifica que el backend esté funcionando
2. Revisa la URL de la API
3. Mira la consola del navegador para errores

### Login no funciona
1. Verifica que el usuario exista en la base de datos
2. Revisa que el endpoint `/api/login` esté funcionando
3. Limpia el localStorage del navegador

## 📞 Soporte

Si tienes problemas:

1. Revisa la consola del navegador (F12)
2. Verifica que el backend esté funcionando
3. Consulta el archivo `README.md` para más detalles

## 🎯 Siguientes Pasos

Una vez que todo esté funcionando:

1. Personaliza el diseño según tu marca
2. Agrega tus productos en el backend
3. Configura las categorías
4. Prueba el flujo completo de compra

---

**¡Listo! Ya tienes tu frontend funcionando con HTML, CSS y JavaScript vanilla.** 🎉

Si necesitas más ayuda, consulta el archivo `README.md` completo.