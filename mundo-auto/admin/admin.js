document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const path = window.location.pathname.split('/').pop();

    // Lógica para establecer el enlace activo
    sidebarLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (path.includes(linkPath)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Lógica para el botón de "Cerrar Sesión"
    const logoutLink = document.querySelector('.logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Lógica para cerrar sesión
            alert('Has cerrado la sesión del administrador.');
            window.location.href = '../cliente/mi-cuenta.html';
        });
    }
});