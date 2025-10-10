// main.js

// Importa todas las funciones y variables necesarias de los módulos
import { initializeParticles, updateAllParticles, handleMouseMove, particles } from './particles/particle.js';
import { drawParticles, setupCanvas, resizeCanvas } from './particles/renderer.js';
import { PARTICLE_COUNT, BASE_SPEED } from './particles/config.js';

let animationFrameId;

/**
 * @description Inicia el bucle de animación que dibuja y actualiza las partículas.
 */
function animate() {
    // 1. Limpia el canvas y dibuja las partículas y las líneas.
    drawParticles();
    
    // 2. Actualiza la posición y la física de todas las partículas.
    updateAllParticles();

    // 3. Solicita el siguiente fotograma para crear un bucle continuo.
    animationFrameId = requestAnimationFrame(animate);
}

/**
 * @description Función principal que inicializa el sistema.
 */
function init() {
    // 1. Configura el canvas (obtiene el contexto y establece el tamaño inicial)
    const setupSuccessful = setupCanvas();

    if (!setupSuccessful) {
        // Si el setup falla (ej. no encuentra el canvas), detenemos la inicialización.
        return;
    }

    // 2. Inicializa las partículas con las constantes de configuración.
    initializeParticles(PARTICLE_COUNT, BASE_SPEED);

    // 3. Añade el listener para el movimiento del ratón
    window.addEventListener('mousemove', handleMouseMove);

    // 4. Asegura que el canvas se redimensione y las partículas se creen de nuevo al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        resizeCanvas();
        initializeParticles(PARTICLE_COUNT, BASE_SPEED);
    });

    // 5. Inicia el bucle de animación.
    animate();
}

// Inicia el sistema una vez que la ventana y todos los scripts estén cargados.
window.onload = init;
