function loadHTML(id, filename, callback) {
    // 1. Pide el contenido del archivo (ej. footer.html)
    fetch(filename)
    .then(response => response.text())
    .then(data => {
        // 2. Pega el contenido dentro del elemento que tenga el 'id'
        document.getElementById(id).innerHTML = data;
        
        if (callback) { // Ejecuta la función de lógica, si existe
            callback();
        }

    })
    // 3. Si hay un error, lo muestra en la consola del navegador
    .catch(error => console.error('Error al cargar el HTML:', error));
}


// Cuando la página está lista, llama a la función para cargar los módulos
document.addEventListener('DOMContentLoaded', () => {
    // Le decimos: Busca el elemento con ID y pega el contenido
    loadHTML('footer-placeholder', 'includes/footer.html');
    loadHTML('header-placeholder', 'includes/header.html');
    
    // CARGA DE CONTENIDO PRINCIPAL: SOLUCIÓN FINAL AL PROBLEMA DE LOS CLICS
    loadHTML('content-placeholder', 'includes/content.html', () => { 
        // Despues de pegar content.html, cargamos y ejecutamos app.js
        import('./js/app.js')
            .then(module => {
                 module.initApp(); 
            })
            .catch(error => console.error('Error al cargar app.js:', error));
    });

});
