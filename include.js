function loadHTML(id, filename, callback) {
    // 1. Pide el contenido del archivo (ej. footer.html)
    fetch(filename)
    .then(response => response.text())
    .then(data => {
        // 2. Pega el contenido dentro del elemento que tenga el 'id'
        document.getElementById(id).innerHTML = data;
        
        if (callback) { // NUEVO: Ejecuta la función de lógica
            callback();
        }

    // Cuando la página está lista, llama a la función para cargar el 'footer.html'
document.addEventListener('DOMContentLoaded', () => {
    // Le decimos: Busca el elemento con ID 'footer-placeholder' y pega el contenido de 'footer.html'
    loadHTML('footer-placeholder', 'includes/footer.html');
    loadHTML('header-placeholder', 'includes/header.html');
    
    // ESTE ES EL CAMBIO CLAVE QUE RESUELVE EL PROBLEMA DE LOS CLICS
    loadHTML('content-placeholder', 'includes/content.html', () => { 
        // Despues de pegar content.html, cargamos y ejecutamos app.js
        import('./js/app.js')
            .then(module => {
                 module.initApp(); 
            })
            .catch(error => console.error('Error al cargar app.js:', error));
    });

});
});
