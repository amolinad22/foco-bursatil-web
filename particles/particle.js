// particles/particle.js

import { MOUSE_REPULSION_RADIUS, MOUSE_REPULSION_STRENGTH } from './config.js';

// Array que contiene todas las instancias de partículas. Se exporta para que renderer.js pueda dibujar.
export let particles = [];

// Estado para la posición del ratón
let mouse = { x: null, y: null };

/**
 * @description Clase que define una partícula con posición, velocidad y métodos de actualización.
 */
class Particle {
    constructor(x, y, vx, vy) {
        this.x = x; // Posición X
        this.y = y; // Posición Y
        this.vx = vx; // Velocidad X
        this.vy = vy; // Velocidad Y
    }

    /**
     * @description Aplica la física y la repulsión del ratón a la partícula.
     */
    update() {
        // Mover la partícula
        this.x += this.vx;
        this.y += this.vy;

        // Rebotar en los bordes de la pantalla
        if (this.x < 0 || this.x > window.innerWidth) {
            this.vx *= -1;
        }
        if (this.y < 0 || this.y > window.innerHeight) {
            this.vy *= -1;
        }

        // --- Lógica de Repulsión del Ratón ---
        if (mouse.x !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < MOUSE_REPULSION_RADIUS) {
                // Calcular la fuerza de repulsión
                const force = (MOUSE_REPULSION_RADIUS - distance) / MOUSE_REPULSION_RADIUS * MOUSE_REPULSION_STRENGTH;
                
                // Aplicar la fuerza en la dirección opuesta al ratón
                const angle = Math.atan2(dy, dx);
                this.vx += Math.cos(angle) * force;
                this.vy += Math.sin(angle) * force;
            }
        }
    }
}

/**
 * @description Crea e inicializa el array de partículas.
 * @param {number} count - Número de partículas a crear.
 * @param {number} speed - Velocidad base para las partículas.
 */
export function initializeParticles(count, speed) {
    particles = [];
    for (let i = 0; i < count; i++) {
        // Posición inicial aleatoria
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        // Velocidad inicial aleatoria y pequeña
        const vx = (Math.random() - 0.5) * speed / 10;
        const vy = (Math.random() - 0.5) * speed / 10;
        
        particles.push(new Particle(x, y, vx, vy));
    }
}

/**
 * @description Itera sobre todas las partículas y llama a su método update.
 */
export function updateAllParticles() {
    for (const particle of particles) {
        particle.update();
    }
}

/**
 * @description Listener de movimiento del ratón que actualiza la posición global.
 * @param {MouseEvent} event - Evento del ratón.
 */
export function handleMouseMove(event) { // <--- ESTA FUNCIÓN ESTABA AUSENTE O NO EXPORTADA
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}
