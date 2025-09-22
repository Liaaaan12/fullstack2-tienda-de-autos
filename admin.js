document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.main-content');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    // Función para cargar la página
    const loadPage = async (pageName) => {
        try {
            const response = await fetch(`${pageName}.html`);
            if (!response.ok) {
                throw new Error(`No se pudo cargar la página: ${response.statusText}`);
            }
            const html = await response.text();
            mainContent.innerHTML = html;
        } catch (error) {
            console.error('Error al cargar la página:', error);
            mainContent.innerHTML = '<div class="error-message">Hubo un error al cargar el contenido. Por favor, intenta de nuevo.</div>';
        }
    };

    // Manejador de eventos para los enlaces de la barra lateral
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.closest('a').dataset.page;
            
            // Elimina la clase 'active' de todos los enlaces
            sidebarLinks.forEach(item => item.classList.remove('active'));
            
            // Añade la clase 'active' al enlace clicado
            e.target.closest('a').classList.add('active');

            // Carga la página correspondiente si el enlace tiene el atributo data-page
            if (page) {
                loadPage(page);
            }
        });
    });

    // Lógica para el botón de "Cerrar Sesión"
    const logoutLink = document.querySelector('.logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Aquí iría tu lógica real de cierre de sesión (ej. eliminar token, etc.)
            alert('Has cerrado la sesión del administrador.');
            window.location.href = '../index.html'; // Redirige a la página principal de la tienda
        });
    }

    // Cargar la página de dashboard por defecto al iniciar
    loadPage('dashboard');
});