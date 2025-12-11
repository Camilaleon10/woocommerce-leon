# Guía de Depuración - Comunicación con Backend Laravel

## 🔍 Problema Identificado

Las funciones del frontend no están enviando peticiones al backend Laravel cuando se realizan acciones como:
- Agregar productos al carrito
- Registrar nuevos usuarios
- Iniciar sesión
- Modificar cantidades del carrito

## 🛠️ Herramientas de Depuración

### 1. **Consola del Navegador**
Presiona F12 y ve a la pestaña "Console"

#### Busca estos mensajes:
```javascript
// Deberías ver estos mensajes al realizar acciones:
console.log('Intentando iniciar sesión:', email);
console.log('Intentando registrar usuario:', email);
console.log('Agregando producto al carrito:', productId);
console.log('Actualizando cantidad del item:', itemId, newQuantity);
console.log('Eliminando item del carrito:', itemId);
console.log('Vaciando carrito...');
```

#### Si NO ves estos mensajes:
Significa que las funciones no se están llamando correctamente.

### 2. **Pestaña Network**
En F12, ve a la pestaña "Network"

#### Busca estas peticiones:
- `POST /api/login` - Al iniciar sesión
- `POST /api/register` - Al registrar usuario
- `POST /api/cart-items` - Al agregar al carrito
- `PUT /api/cart-items/{id}` - Al actualizar cantidad
- `DELETE /api/cart-items/{id}` - Al eliminar item
- `DELETE /api/cart-items/clear` - Al vaciar carrito

#### Si NO ves estas peticiones:
Significa que el frontend no está comunicándose con el backend.

## 🔧 Pasos para Solucionar

### Paso 1: Verificar Funciones Globales

Abre `frontend/js/app.js` y verifica que estas funciones existan:
```javascript
window.showLoading
window.hideLoading
window.showNotification
window.showSection
```

### Paso 2: Verificar Importaciones

Abre `frontend/index.html` y verifica que todos los scripts se carguen:
```html
<script src="js/api.js"></script>
<script src="js/auth.js"></script>
<script src="js/cart.js"></script>
<script src="js/products.js"></script>
<script src="js/app.js"></script>
```

### Paso 3: Verificar Funciones de API

Abre `frontend/js/api.js` y verifica que las funciones estén definidas:
```javascript
// Deberían existir estas funciones:
window.fetchProducts
window.fetchCategories
window.login
window.register
window.addToCart
window.updateQuantity
window.removeFromCart
window.clearCart
window.getCurrentUser
```

### Paso 4: Probar Manualmente

En la consola del navegador, ejecuta estas funciones manualmente:

```javascript
// Probar login
window.login('admin@example.com', 'password');

// Probar obtener productos
window.fetchProducts().then(products => console.log(products));

// Probar obtener usuario actual
window.getCurrentUser().then(user => console.log(user));
```

## 🐛 Posibles Causas

### 1. **Errores de JavaScript**
- Error de sintaxis en algún archivo JS
- Funciones no definidas
- Variables no declaradas

### 2. **Problemas de Carga**
- Los scripts no se cargan en el orden correcto
- Errores en la importación de archivos

### 3. **Problemas de Red**
- El backend no está accesible
- Problemas de CORS
- Firewall bloqueando peticiones

### 4. **Problemas de Backend**
- Rutas no definidas correctamente
- Middleware bloqueando peticiones
- Base de datos no conectada

## 🎯 Soluciones Rápidas

### 1. **Limpiar Cache**
```bash
# Limpiar cache del navegador
Ctrl+Shift+R

# Limpiar localStorage
localStorage.clear();
```

### 2. **Verificar Orden de Carga**
Asegúrate que los scripts se carguen en este orden en `index.html`:
1. `api.js` (funciones de API)
2. `app.js` (funciones globales)
3. `auth.js` (autenticación)
4. `cart.js` (carrito)
5. `products.js` (productos)

### 3. **Verificar Consola de Errores**
Busca errores como:
- `ReferenceError: function is not defined`
- `TypeError: Cannot read property 'fetch' of undefined`
- `NetworkError: Failed to fetch`

## 📋 Checklist de Verificación

- [ ] La consola muestra mensajes de depuración
- [ ] La pestaña Network muestra peticiones al backend
- [ ] No hay errores de JavaScript en la consola
- [ ] Las funciones globales están accesibles
- [ ] Los scripts se cargan correctamente

## 🔄 Si el Problema Persiste

### 1. **Usar el Backend Directamente**
Prueba las rutas del backend directamente:
```bash
# Probar login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Probar obtener productos
curl http://localhost:8000/api/products
```

### 2. **Verificar Logs de Laravel**
```bash
php artisan tinker
# Revisar rutas
Route::list();
```

### 3. **Probar con Herramientas**
Usa Postman o Insomnia para probar las rutas del backend.

## 📞 Contacto para Soporte

Si después de seguir estos pasos el problema persiste:

1. **Captura de pantalla** de la consola con los errores
2. **Exporta los logs** del servidor Laravel
3. **Verifica el estado** de la base de datos

---

**Con esta guía podrás identificar exactamente dónde está el problema** 🔍