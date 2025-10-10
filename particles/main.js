/**
 * main.js
 * Punto de entrada principal para el sistema de partículas.
 * Se encarga de la inicialización, el bucle de animación y el manejo de eventos globales.
 */

// Importar módulos
import { initializeCanvas, resizeCanvas, drawParticles } from './particles/renderer.js';
import { createParticles, updateAllParticles, setMousePosition } from './particles/particle.js';
import { CANVAS_ID } from './particles/config.js';

// --- Estado Global ---
let particles = [];
let canvas;
let ctx;
let dimensions = { width: 0, height: 0 };

// -----------------------------------------------------------------------------
// FUNCIONES DE MANEJO DE EVENTOS
// -----------------------------------------------------------------------------

/**
 * Maneja el evento de redimensionamiento de la ventana.
 * Actualiza las dimensiones del canvas y recrea las partículas si es necesario.
 */
function handleResize() {
    dimensions = resizeCanvas();
    // Opcional: Recrear partículas en resize si quieres que se distribuyan de nuevo
    // particles = createParticles(dimensions.width, dimensions.height);
}

/**
 * Maneja el movimiento del ratón para la interacción con las partículas.
 * @param {MouseEvent} event
 */
function handleMouseMove(event) {
    // Pasar las coordenadas a la función del módulo particle.js
    setMousePosition(event.clientX, event.clientY);
}

/**
 * Configura los event listeners necesarios.
 */
function setupListeners() {
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
}

// -----------------------------------------------------------------------------
// BUCLE PRINCIPAL DE ANIMACIÓN
// -----------------------------------------------------------------------------

/**
 * Bucle de animación principal usando requestAnimationFrame.
 */
function animate() {
    // 1. Actualizar el estado de todas las partículas (posición, física, repulsión)
    updateAllParticles(particles, dimensions.width, dimensions.height);
    
    // 2. Dibujar el estado actualizado en el canvas
    drawParticles(particles);

    // 3. Solicitar el siguiente fotograma
    requestAnimationFrame(animate);
}

// -----------------------------------------------------------------------------
// INICIALIZACIÓN
// -----------------------------------------------------------------------------

/**
 * Función de inicio que se ejecuta cuando el DOM está listo.
 */
function init() {
    // 1. Inicializar Canvas
    const canvasObjects = initializeCanvas();
    canvas = canvasObjects.canvas;
    ctx = canvasObjects.ctx;

    if (!canvas || !ctx) {
        console.error("Fallo al inicializar Canvas. Revisar el index.html y config.js.");
        return;
    }

    // 2. Establecer el tamaño inicial y crear partículas
    handleResize();
    particles = createParticles(dimensions.width, dimensions.height);

    // 3. Configurar Listeners
    setupListeners();

    // 4. Iniciar el bucle de animación
    animate();
}

// Iniciar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', init);
