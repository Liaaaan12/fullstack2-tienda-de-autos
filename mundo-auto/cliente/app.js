// app.js

document.addEventListener('DOMContentLoaded', () => {

    // Simulación de un carrito de compras y usuarios en el almacenamiento local
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Elementos del DOM para el carrito y el modal de producto
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const productModal = document.getElementById('product-modal');
    const productDetailsContainer = document.getElementById('product-details');

    // Función para actualizar el estado del carrito en el almacenamiento local
    const updateCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    // --- Funcionalidades de Autenticación y Perfil ---

    // Función para registrar un usuario
    window.registerUser = (event) => {
        event.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const age = parseInt(document.getElementById('reg-age').value);

        if (age < 18) {
            alert('Debes ser mayor de 18 años para registrarte.');
            return;
        }

        const userExists = users.some(user => user.username === username);
        if (userExists) {
            alert('El nombre de usuario ya existe.');
            return;
        }

        users.push({ username, password, age, role: 'client' });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registro exitoso. ¡Inicia sesión ahora!');
    };

    // Función para iniciar sesión
    window.loginUser = (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Se verifica si la página actual es la de cliente o administrador
        const isClientLogin = window.location.pathname.includes('login-cliente.html');
        
        if (isClientLogin) {
            const user = users.find(user => user.username === username && user.password === password);
            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify({ ...user, role: 'client' }));
                alert('Inicio de sesión de cliente exitoso. ¡Bienvenido!');
                window.location.href = 'INDEX.html';
            } else {
                alert('Usuario o contraseña incorrectos.');
            }
        } else {
            if (username === 'admin' && password === 'admin') {
                const adminUser = { username: 'admin', role: 'admin' };
                localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
                alert('Inicio de sesión de administrador exitoso. ¡Bienvenido!');
                window.location.href = '../admin/admin.html';
            } else {
                alert('Usuario o contraseña incorrectos.');
            }
        }
    };

    // Lógica para cerrar sesión
    window.logoutUser = () => {
        localStorage.removeItem('loggedInUser');
        alert('Has cerrado sesión.');
        window.location.href = 'INDEX.html';
    };

    // --- Funcionalidades del Carrito de Compras ---

    // Función para agregar un producto al carrito
    window.addToCart = (product) => {
        const productInCart = cart.find(item => item.id === product.id);
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        alert(`${product.name} ha sido agregado al carrito.`);
        closeProductModal();
    };

    // Función para renderizar el carrito
    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="cart-item-details">
                        <h5>${item.name}</h5>
                        <p>${item.quantity} x $${item.price.toLocaleString('es-CL')} CLP</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Eliminar</button>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
                totalItems += item.quantity;
            });
        }
        cartTotalElement.textContent = `$${total.toLocaleString('es-CL')} CLP`;
        cartCountElement.textContent = totalItems;
    };

    // Función para eliminar un producto del carrito
    window.removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    };

    // Funciones para abrir y cerrar el modal del carrito
    window.openCart = () => {
        cartModal.style.display = 'flex';
        renderCart();
    };

    window.closeCart = () => {
        cartModal.style.display = 'none';
    };

    // --- Funcionalidades del Modal de Producto ---
    
    // Función para abrir el modal de producto
    window.openProductModal = (product) => {
        productDetailsContainer.innerHTML = `
            <div class="modal-product-image">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            <p>$${product.price.toLocaleString('es-CL')} CLP</p>
            <button class="add-to-cart-btn" onclick="addToCart({id: '${product.id}', name: '${product.name}', price: ${product.price}, img: '${product.img}'})">Añadir al Carrito</button>
        `;
        productModal.style.display = 'flex';
    };

    // Función para cerrar el modal de producto
    window.closeProductModal = () => {
        productModal.style.display = 'none';
    };

    // Cerrar los modales haciendo clic fuera de ellos
    window.onclick = function(event) {
        if (event.target == cartModal) {
            closeCart();
        }
        if (event.target == productModal) {
            closeProductModal();
        }
    };

    // Función para manejar el estado de la UI después de iniciar sesión
    const checkLoginStatus = () => {
        const miCuentaLink = document.querySelector('a[href="mi-cuenta.html"]');
        const logoutLink = document.getElementById('logout-link');

        if (loggedInUser && miCuentaLink) {
            // Usuario autenticado, muestra "Mi Perfil" y el enlace de cerrar sesión
            miCuentaLink.textContent = 'Mi Perfil';
            miCuentaLink.href = 'mi-perfil.html'; // Un enlace placeholder
            
            if (!logoutLink) {
                const nav = document.querySelector('header nav');
                const newLogoutLink = document.createElement('a');
                newLogoutLink.href = '#';
                newLogoutLink.id = 'logout-link';
                newLogoutLink.textContent = 'Cerrar Sesión';
                newLogoutLink.classList.add('cta-button');
                newLogoutLink.onclick = window.logoutUser;
                nav.appendChild(newLogoutLink);
            }
        } else if (!loggedInUser && miCuentaLink) {
            // Usuario no autenticado, muestra "Mi Cuenta"
            miCuentaLink.textContent = 'Mi Cuenta';
            miCuentaLink.href = 'mi-cuenta.html';
            if (logoutLink) {
                logoutLink.remove();
            }
        }
    };

    // Inicializar el carrito al cargar la página
    renderCart();

    // Comprueba el estado de inicio de sesión al cargar la página
    checkLoginStatus();
});