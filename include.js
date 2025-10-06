function loadHTML(id, filename) {
    // 1. Pide el contenido del archivo
    fetch(filename)
    .then(response => response.text())
    .then(data => {
        // 2. Pega el contenido
        document.getElementById(id).innerHTML = data;
    })
    .catch(error => console.error('Error al cargar el HTML:', error));
}


// Cuando la página está lista, llama a la función para cargar los módulos
document.addEventListener('DOMContentLoaded', () => {
    // Carga de todos los componentes
    loadHTML('footer-placeholder', 'includes/footer.html');
    loadHTML('header-placeholder', 'includes/header.html');
    loadHTML('content-placeholder', 'includes/content.html');
});
