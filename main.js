// main.js - Lógica principal y orquestación

// --- IMPORTS: Importamos funciones y datos de los módulos ---
// Las rutas asumen que los archivos .js están dentro de la carpeta 'particles/'
import { initializeCanvas, drawParticles } from './particles/renderer.js';
import { initializeParticles, updateAllParticles, handleMouseMove, particles } from './particles/particle.js';
import { PARTICLE_COUNT, BASE_SPEED } from './particles/config.js';

// --- BUUCLE DE ANIMACIÓN ---

/**
 * @description Función principal del bucle de animación (60 FPS).
 */
function animate() {
    // 1. Dibuja las partículas (limpia el canvas y dibuja)
    drawParticles();

    // 2. Actualiza la posición y velocidad de las partículas
    updateAllParticles();

    // 3. Solicita el siguiente fotograma para el loop
    requestAnimationFrame(animate);
}

// --- INICIALIZACIÓN ---

/**
 * @description Inicializa la aplicación después de que el DOM está completamente cargado.
 */
function initializeApp() {
    // 1. Inicializa el canvas y establece listeners de redimensionamiento
    initializeCanvas();

    // 2. Inicializa las partículas (crea el array de objetos Particle)
    initializeParticles(PARTICLE_COUNT, BASE_SPEED);
    
    // 3. Inicia el bucle de animación
    animate();
}

// --- LISTENERS ---

// Escucha el evento de movimiento del ratón para actualizar la posición
window.addEventListener('mousemove', handleMouseMove);

// Inicia la aplicación al cargar la ventana
window.onload = initializeApp;
