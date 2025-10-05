function loadHTML(id, filename) {
  // 1. Pide el contenido del archivo (ej. footer.html)
  fetch(filename)
    .then(response => response.text())
    .then(data => {
      // 2. Pega el contenido dentro del elemento que tenga el 'id'
      document.getElementById(id).innerHTML = data;
    })
    // 3. Si hay un error, lo muestra en la consola del navegador
    .catch(error => console.error('Error al cargar el HTML:', error));
}

// Cuando la página está lista, llama a la función para cargar el 'footer.html'
document.addEventListener('DOMContentLoaded', () => {
    // Le decimos: Busca el elemento con ID 'footer-placeholder' y pega el contenido de 'footer.html'
   loadHTML('footer-placeholder', 'includes/footer.html');
  loadHTML('header-placeholder', 'includes/header.html');
  loadHTML('content-placeholder', 'includes/content.html');
});
