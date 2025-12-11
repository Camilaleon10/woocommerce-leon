// ========================================
// VARIABLES GLOBALES DE CONTROL
// ========================================

let loadProductsCallCount = 0;
let loadCategoriesCallCount = 0;
let renderProductsCallCount = 0;
let filterProductsCallCount = 0;
let initializeAppCallCount = 0;

// Control de inicialización de la aplicación
let appInitialized = false;
let initializationAttempts = 0;
const MAX_INITIALIZATION_ATTEMPTS = 3;

// Control de peticiones a la API
let isProductsLoading = false;
let isCategoriesLoading = false;
let lastProductsRequest = 0;
let lastCategoriesRequest = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 segundo mínimo entre peticiones

// Datos globales
window.products = [];
window.categories = [];
window.cart = [];
window.currentUser = null;

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

// Mostrar/ocultar indicador de carga
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// ========================================
// FUNCIONES DE CARGA DE DATOS
// ========================================

// Función para cargar productos con mejor control de estado
async function loadProducts() {
    loadProductsCallCount++;
    
    if (isProductsLoading || Date.now() - lastProductsRequest < MIN_REQUEST_INTERVAL) {
        return;
    }
    
    isProductsLoading = true;
    lastProductsRequest = Date.now();
    showLoading();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('http://localhost:8000/api/products', { signal: controller.signal });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const products = await response.json();
        window.products = products;

        renderProducts();
    } catch (error) {
        window.products = getSampleProducts();  // Datos de muestra si hay error
        renderProducts();
    } finally {
        hideLoading();
        isProductsLoading = false;
    }
}

// Función para cargar categorías con mejor control de estado
async function loadCategories() {
    if (isCategoriesLoading || Date.now() - lastCategoriesRequest < MIN_REQUEST_INTERVAL) {
        return;
    }

    isCategoriesLoading = true;
    lastCategoriesRequest = Date.now();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('http://localhost:8000/api/categories', { signal: controller.signal });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const categories = await response.json();
        window.categories = categories;

        populateCategoryFilter();
    } catch (error) {
        window.categories = getSampleCategories();  // Datos de muestra si hay error
        populateCategoryFilter();
    } finally {
        isCategoriesLoading = false;
    }
}

// Función para cargar el carrito con detalles de productos
async function loadCart() {
    if (!window.currentUser) {
        window.cart = [];
        updateCartCount();
        return;
    }

    try {
        console.log('🛒 Cargando carrito desde el backend...');
        const response = await fetch(`http://localhost:8000/api/cart-items?user_id=${window.currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${window.currentUser.token}`
            }
        });

        if (!response.ok) {
            console.error('❌ Error en respuesta del backend:', response.status, response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cartItems = await response.json();
        console.log('📦 Items del carrito recibidos:', cartItems);
        
        if (!cartItems || cartItems.length === 0) {
            console.log('🛒 El carrito está vacío');
            window.cart = [];
            updateCartCount();
            return;
        }
        
        // El backend ya devuelve los productos con la relación cargada
        console.log('🛒 Carrito final con productos:', cartItems);
        window.cart = cartItems;
        updateCartCount();
    } catch (error) {
        console.error('❌ Error completo al cargar el carrito:', error);
        showNotification('Error al cargar el carrito: ' + error.message, 'error');
        window.cart = [];
        updateCartCount();
    }
}

// ========================================
// FUNCIONES DE RENDERIZADO
// ========================================

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    if (!window.products || window.products.length === 0) {
        productsGrid.innerHTML = '<div class="text-center">No hay productos disponibles</div>';
        return;
    }

    const productsHTML = window.products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="https://picsum.photos/300/200?random=${Math.random()}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
                <p class="product-description">${product.description || 'Sin descripción'}</p>
                <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');

    productsGrid.innerHTML = productsHTML;

    // Agregar event listeners a los botones de agregar al carrito
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            addToCart(productId);
        });
    });
}

function populateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    
    if (!window.categories || window.categories.length === 0) {
        return;
    }

    const categoriesHTML = window.categories.map(category => `
        <option value="${category.id}">${category.name}</option>
    `).join('');

    categoryFilter.innerHTML = '<option value="">Todas las categorías</option>' + categoriesHTML;
}

// ========================================
// FUNCIONES DEL CARRITO
// ========================================

async function addToCart(productId) {
    if (!window.currentUser) {
        showNotification('Debes iniciar sesión para agregar productos al carrito', 'error');
        showSection('login-section');
        return;
    }

    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (!button) return;

    // Prevenir múltiples clics
    if (button.disabled) {
        return;
    }

    button.disabled = true;
    button.textContent = 'Agregando...';

    try {
        const response = await fetch('http://localhost:8000/api/cart-items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.currentUser.token}`
            },
            body: JSON.stringify({
                user_id: window.currentUser.id,
                product_id: productId,
                quantity: 1
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const cartItem = await response.json();
        
        // Agregar el item al carrito global
        if (!window.cart) {
            window.cart = [];
        }
        window.cart.push(cartItem);
        
        showNotification('Producto agregado al carrito', 'success');
        updateCartCount();

    } catch (error) {
        showNotification('Error al agregar producto al carrito', 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Agregar al Carrito';
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = window.cart ? window.cart.length : 0;
    }
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;
    
    if (!window.cart || window.cart.length === 0) {
        cartItems.innerHTML = '<p>Tu carrito está vacío</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    const cartHTML = window.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.product ? item.product.name : 'Producto desconocido'}</h4>
                <p>Precio: $${item.product ? item.product.price : '0.00'}</p>
                <p>Cantidad: ${item.quantity || 1}</p>
            </div>
            <div class="cart-item-actions">
                <button class="remove-from-cart-btn" data-item-id="${item.id}">Eliminar</button>
            </div>
        </div>
    `).join('');

    cartItems.innerHTML = cartHTML;

    // Calcular total
    const total = window.cart.reduce((sum, item) => {
        const price = item.product ? item.product.price : 0;
        const quantity = item.quantity || 1;
        return sum + (price * quantity);
    }, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.itemId);
            removeFromCart(itemId);
        });
    });
}

async function removeFromCart(itemId) {
    if (!window.currentUser) return;

    try {
        const response = await fetch(`http://localhost:8000/api/cart-items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${window.currentUser.token}`
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        // Remover del carrito global
        window.cart = window.cart.filter(item => item.id !== itemId);
        
        showNotification('Producto eliminado del carrito', 'success');
        updateCartCount();
        displayCart();
    } catch (error) {
        showNotification('Error al eliminar producto del carrito', 'error');
    }
}

async function clearCart() {
    if (!window.currentUser) return;

    if (!confirm('¿Estás seguro de que quieres vaciar el carrito?')) return;

    try {
        // Eliminar todos los items del carrito
        const deletePromises = window.cart.map(item =>
            fetch(`http://localhost:8000/api/cart-items/${item.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${window.currentUser.token}`
                }
            })
        );

        await Promise.all(deletePromises);

        window.cart = [];
        showNotification('Carrito vaciado', 'success');
        updateCartCount();
        displayCart();
    } catch (error) {
        showNotification('Error al vaciar el carrito', 'error');
    }
}

function checkout() {
    if (!window.currentUser) {
        showNotification('Debes iniciar sesión para proceder al checkout', 'error');
        showSection('login-section');
        return;
    }

    if (!window.cart || window.cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }

    // Calcular total
    const total = window.cart.reduce((sum, item) => {
        const price = item.product ? item.product.price : 0;
        const quantity = item.quantity || 1;
        return sum + (price * quantity);
    }, 0);

    showNotification(`Procesando pago de $${total.toFixed(2)}`, 'success');
    
    // Aquí iría la lógica de checkout con pasarela de pago
    // Por ahora solo mostramos un mensaje
    setTimeout(() => {
        showNotification('Función de checkout no implementada aún', 'info');
    }, 2000);
}

// ========================================
// FUNCIONES DE AUTENTICACIÓN
// ========================================

async function login(email, password) {
    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        window.currentUser = data.user;
        localStorage.setItem('auth_token', data.token);
        
        updateUIForLoggedInUser();
        showNotification('Sesión iniciada correctamente', 'success');
        showSection('products-section');

    } catch (error) {
        showNotification('Error al iniciar sesión', 'error');
    }
}

async function register(name, email, password, passwordConfirmation) {
    try {
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        window.currentUser = data.user;
        localStorage.setItem('auth_token', data.token);
        
        updateUIForLoggedInUser();
        showNotification('Cuenta creada correctamente', 'success');
        showSection('products-section');

    } catch (error) {
        showNotification('Error al crear cuenta', 'error');
    }
}

async function logout() {
    try {
        if (window.currentUser && window.currentUser.token) {
            const response = await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${window.currentUser.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                showNotification(data.message || 'Sesión cerrada correctamente', 'success');
            } else {
                showNotification('Error al cerrar sesión en el servidor', 'error');
            }
        }
    } catch (error) {
        showNotification('Error al cerrar sesión', 'error');
    } finally {
        // Siempre limpiar datos locales
        window.currentUser = null;
        window.cart = [];
        localStorage.removeItem('auth_token');
        updateUIForLoggedOutUser();
        showSection('products-section');
    }
}

function updateUIForLoggedInUser() {
    document.getElementById('login-link').classList.add('hidden');
    document.getElementById('register-link').classList.add('hidden');
    document.getElementById('logout-link').classList.remove('hidden');
    
    // Mostrar enlace de admin solo si es administrador
    if (window.currentUser && window.currentUser.is_admin) {
        document.getElementById('admin-link').classList.remove('hidden');
    } else {
        document.getElementById('admin-link').classList.add('hidden');
    }
    
    // Cargar el carrito cuando el usuario inicia sesión
    loadCart();
}

function updateUIForLoggedOutUser() {
    document.getElementById('login-link').classList.remove('hidden');
    document.getElementById('register-link').classList.remove('hidden');
    document.getElementById('logout-link').classList.add('hidden');
    document.getElementById('admin-link').classList.add('hidden');
}

// ========================================
// FUNCIONES DE ADMINISTRACIÓN
// ========================================

// Función para determinar clase CSS según el stock
function getStockClass(stock) {
    if (!stock || stock === 0) return 'stock-out';
    if (stock <= 5) return 'stock-low';
    return 'stock-good';
}

function showAdminTab(tabName) {
    // Ocultar todos los contenidos de tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Quitar clase active de todos los botones
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar el tab seleccionado
    document.getElementById(`admin-${tabName}`).classList.remove('hidden');
    
    // Agregar clase active al botón seleccionado
    event.target.classList.add('active');
    
    // Cargar datos según el tab
    switch(tabName) {
        case 'products':
            loadAdminProducts();
            break;
        case 'categories':
            loadAdminCategories();
            break;
        case 'users':
            loadAdminUsers();
            break;
        case 'orders':
            loadAdminOrders();
            break;
    }
}

async function loadAdminProducts() {
    try {
        console.log('🔄 Cargando productos para admin...');
        const response = await fetch('http://localhost:8000/api/products', {
            headers: {
                'Authorization': `Bearer ${window.currentUser.token}`
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const products = await response.json();
        console.log('📦 Productos recibidos:', products);
        
        const productsList = document.getElementById('admin-products-list');
        if (!productsList) {
            console.error('❌ No se encontró el elemento admin-products-list');
            return;
        }
        
        const productsHTML = products.map(product => {
            // Validar que el producto tenga todos los datos necesarios
            if (!product || !product.name || !product.price) {
                console.warn('⚠️ Producto con datos incompletos:', product);
                return `
                <div class="admin-item">
                    <div class="admin-item-content">
                        <div class="admin-item-info">
                            <h4>Producto con datos incompletos</h4>
                            <p>Ver consola para más detalles</p>
                        </div>
                    </div>
                </div>
                `;
            }

            return `
            <div class="admin-item">
                ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" class="admin-item-image">` : ''}
                <div class="admin-item-content">
                    <div class="admin-item-info">
                        <h4>${product.name || 'Sin nombre'}</h4>
                        <p class="admin-item-price">Precio: $${parseFloat(product.price || 0).toFixed(2)}</p>
                        <p>Stock:
                            <span class="admin-item-stock ${getStockClass(product.stock || 0)}">
                                ${product.stock || 0} unidades
                            </span>
                        </p>
                        <p>Categoría: ${product.category ? product.category.name : 'Sin categoría'}</p>
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn btn-secondary" onclick="editProduct(${product.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        }).join('');
        
        console.log('🎨 HTML generado, actualizando DOM...');
        productsList.innerHTML = productsHTML;
        console.log('✅ Productos cargados exitosamente');
    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        showNotification('Error al cargar productos', 'error');
    }
}

async function loadAdminCategories() {
    try {
        const response = await fetch('http://localhost:8000/api/categories', {
            headers: {
                'Authorization': `Bearer ${window.currentUser.token}`
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const categories = await response.json();
        const categoriesList = document.getElementById('admin-categories-list');
        
        const categoriesHTML = categories.map(category => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h4>${category.name}</h4>
                    <p>${category.description || 'Sin descripción'}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-secondary" onclick="editCategory(${category.id})">Editar</button>
                    <button class="btn btn-danger" onclick="deleteCategory(${category.id})">Eliminar</button>
                </div>
            </div>
        `).join('');
        
        categoriesList.innerHTML = categoriesHTML;
    } catch (error) {
        showNotification('Error al cargar categorías', 'error');
    }
}

async function loadAdminUsers() {
    try {
        const response = await fetch('http://localhost:8000/api/users', {
            headers: {
                'Authorization': `Bearer ${window.currentUser.token}`
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const users = await response.json();
        const usersList = document.getElementById('admin-users-list');
        
        const usersHTML = users.map(user => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h4>${user.name}</h4>
                    <p>Email: ${user.email}</p>
                    <p>Rol: ${user.is_admin ? 'Administrador' : 'Usuario'}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-secondary" onclick="toggleUserRole(${user.id})">
                        ${user.is_admin ? 'Hacer Usuario' : 'Hacer Admin'}
                    </button>
                    <button class="btn btn-danger" onclick="deleteUser(${user.id})">Eliminar</button>
                </div>
            </div>
        `).join('');
        
        usersList.innerHTML = usersHTML;
    } catch (error) {
        showNotification('Error al cargar usuarios', 'error');
    }
}

async function loadAdminOrders() {
    const ordersList = document.getElementById('admin-orders-list');
    ordersList.innerHTML = '<p>Función de pedidos no implementada aún</p>';
}

// Funciones CRUD de productos
function showAddProductForm() {
    document.getElementById('product-form-container').classList.remove('hidden');
    document.getElementById('product-form-title').textContent = 'Agregar Nuevo Producto';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    loadCategoriesForProductForm();
}

function hideProductForm() {
    document.getElementById('product-form-container').classList.add('hidden');
    document.getElementById('product-form').reset();
    document.getElementById('image-preview').classList.add('hidden');
}

async function loadCategoriesForProductForm() {
    try {
        const response = await fetch('http://localhost:8000/api/categories', {
            headers: {
                'Authorization': `Bearer ${window.currentUser.token}`
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const categories = await response.json();
        const categorySelect = document.getElementById('product-category');
        
        const categoriesHTML = categories.map(category =>
            `<option value="${category.id}">${category.name}</option>`
        ).join('');
        
        categorySelect.innerHTML = '<option value="">Seleccionar categoría</option>' + categoriesHTML;
    } catch (error) {
        showNotification('Error al cargar categorías', 'error');
    }
}

async function saveProduct(event) {
    event.preventDefault();
    
    const productId = document.getElementById('product-id').value;
    const isEdit = productId !== '';
    
    const formData = new FormData();
    formData.append('name', document.getElementById('product-name').value);
    formData.append('slug', document.getElementById('product-slug').value);
    formData.append('description', document.getElementById('product-description').value);
    formData.append('category_id', document.getElementById('product-category').value);
    formData.append('price', document.getElementById('product-price').value);
    formData.append('stock', document.getElementById('product-stock').value);
    
    const imageInput = document.getElementById('product-image');
    if (imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
    }
    
    try {
        const url = isEdit
            ? `http://localhost:8000/api/products/${productId}`
            : 'http://localhost:8000/api/products';
            
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${window.currentUser.token}`
            },
            body: formData
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        showNotification(isEdit ? 'Producto actualizado correctamente' : 'Producto creado correctamente', 'success');
        hideProductForm();
        loadAdminProducts();
        
    } catch (error) {
        showNotification('Error al guardar producto', 'error');
    }
}

async function editProduct(id) {
    try {
        const response = await fetch(`http://localhost:8000/api/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${window.currentUser.token}`
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const product = await response.json();
        
        // Llenar el formulario con los datos del producto
        document.getElementById('product-form-container').classList.remove('hidden');
        document.getElementById('product-form-title').textContent = 'Editar Producto';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-slug').value = product.slug;
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        
        await loadCategoriesForProductForm();
        document.getElementById('product-category').value = product.category_id;
        
        // Mostrar imagen actual si existe
        if (product.image_url) {
            const preview = document.getElementById('image-preview');
            preview.querySelector('img').src = product.image_url;
            preview.classList.remove('hidden');
        }
        
    } catch (error) {
        showNotification('Error al cargar producto para editar', 'error');
    }
}

async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    try {
        const response = await fetch(`http://localhost:8000/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${window.currentUser.token}`
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        showNotification('Producto eliminado correctamente', 'success');
        loadAdminProducts();
        
    } catch (error) {
        showNotification('Error al eliminar producto', 'error');
    }
}

function showAddCategoryForm() {
    showNotification('Función de agregar categoría no implementada aún', 'info');
}

// Event listener para el formulario de productos
document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', saveProduct);
    }
    
    // Event listener para vista previa de imagen
    const imageInput = document.getElementById('product-image');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('image-preview');
                    preview.querySelector('img').src = e.target.result;
                    preview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

function editCategory(id) {
    showNotification('Función de editar categoría no implementada aún', 'info');
}

function deleteCategory(id) {
    showNotification('Función de eliminar categoría no implementada aún', 'info');
}

function toggleUserRole(id) {
    showNotification('Función de cambiar rol de usuario no implementada aún', 'info');
}

function deleteUser(id) {
    showNotification('Función de eliminar usuario no implementada aún', 'info');
}

// ========================================
// FUNCIONES DE NAVEGACIÓN
// ========================================

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Si se muestra la sección del carrito, cargar los datos del carrito
    if (sectionId === 'cart-section') {
        loadCart().then(() => {
            displayCart();
        });
    }
}

function showCart() {
    if (!window.currentUser) {
        showNotification('Debes iniciar sesión para ver tu carrito', 'error');
        showSection('login-section');
        return;
    }
    
    loadCart().then(() => {
        displayCart();
        showSection('cart-section');
    });
}

// ========================================
// DATOS DE MUESTRA (FALLBACK)
// ========================================

function getSampleProducts() {
    return [
        {
            id: 1,
            name: 'Producto de Ejemplo 1',
            description: 'Este es un producto de ejemplo',
            price: 29.99,
            category_id: 1
        },
        {
            id: 2,
            name: 'Producto de Ejemplo 2',
            description: 'Otro producto de ejemplo',
            price: 49.99,
            category_id: 2
        }
    ];
}

function getSampleCategories() {
    return [
        { id: 1, name: 'Categoría 1' },
        { id: 2, name: 'Categoría 2' }
    ];
}

// ========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ========================================

async function initializeApp() {
    initializeAppCallCount++;

    if (appInitialized) {
        return;
    }

    if (initializationAttempts >= MAX_INITIALIZATION_ATTEMPTS) {
        return;
    }

    initializationAttempts++;

    try {
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Verificar si el usuario está autenticado
        }

        await Promise.all([
            loadProducts(),
            loadCategories()
        ]);

        setupEventListeners();

        appInitialized = true;

        showSection('products-section');

    } catch (error) {
        showNotification('Error al inicializar la aplicación', 'error');
    }
}

function setupEventListeners() {
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('login-section');
        });
    }

    const registerLink = document.getElementById('register-link');
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('register-section');
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            login(email, password);
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const passwordConfirmation = document.getElementById('register-password-confirm').value;
            register(name, email, password, passwordConfirmation);
        });
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterProducts();
        });
    }

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            filterProducts();
        });
    }

    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Función para mostrar secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostrar la sección solicitada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}
