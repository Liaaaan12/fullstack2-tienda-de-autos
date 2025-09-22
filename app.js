// app.js

document.addEventListener('DOMContentLoaded', () => {

    // Simulación de un carrito de compras y usuarios en el almacenamiento local
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Elementos del DOM para el carrito
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');

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

        users.push({ username, password, age });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registro exitoso. ¡Inicia sesión ahora!');
    };

    // Función para iniciar sesión
    window.loginUser = (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            alert('Inicio de sesión exitoso. ¡Bienvenido!');
            window.location.href = 'index.html';
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    };

    // Lógica para cerrar sesión
    window.logoutUser = () => {
        localStorage.removeItem('loggedInUser');
        alert('Has cerrado sesión.');
        window.location.href = 'index.html';
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

    // Cerrar el modal haciendo clic fuera de él
    window.onclick = function(event) {
        if (event.target == cartModal) {
            closeCart();
        }
    };

    // Inicializar el carrito al cargar la página
    renderCart();
});