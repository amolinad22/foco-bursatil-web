/**
 * particles/particle.js
 * Define la clase Particle y las funciones de manejo de su estado.
 */
import { GRAVITY, FRICTION, MAX_PARTICLE_SIZE, MIN_PARTICLE_SIZE, BASE_SPEED, PARTICLE_COLOR, PARTICLE_COUNT, MOUSE_ATTRACTION_RADIUS, MOUSE_REPULSION_FORCE } from './config.js';

// Estado global para la posición del ratón
let mouse = { x: null, y: null };

/**
 * Representa una partícula individual en el sistema.
 * Contiene su posición, velocidad, tamaño y color.
 */
export class Particle {
    constructor(x, y, vx, vy, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
    }

    /**
     * Aplica la física a la partícula: gravedad, fricción y atracción/repulsión del ratón.
     * @param {number} width - Ancho del canvas.
     * @param {number} height - Alto del canvas.
     */
    update(width, height) {
        
        // 1. Lógica de Interacción con el Ratón (si está activa)
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < MOUSE_ATTRACTION_RADIUS) {
                // Calcular el ángulo y la fuerza de repulsión
                const angle = Math.atan2(dy, dx);
                // La fuerza es inversamente proporcional a la distancia, siendo mayor cuanto más cerca está.
                const force = (MOUSE_ATTRACTION_RADIUS - distance) / MOUSE_ATTRACTION_RADIUS * MOUSE_REPULSION_FORCE;
                
                // Aplicar una fuerza de repulsión (aleja la partícula del ratón)
                this.vx -= Math.cos(angle) * force;
                this.vy -= Math.sin(angle) * force;
            }
        }

        // 2. Aplicar la gravedad (si es una simulación física)
        this.vy += GRAVITY;

        // 3. Aplicar la fricción (opcional)
        this.vx *= FRICTION;
        this.vy *= FRICTION;

        // 4. Actualizar la posición
        this.x += this.vx;
        this.y += this.vy;

        // 5. Verificar los límites del canvas
        this.checkBounds(width, height);
    }

    /**
     * Implementa la lógica de rebote en los bordes del canvas.
     * @param {number} width - Ancho del canvas.
     * @param {number} height - Alto del canvas.
     */
    checkBounds(width, height) {
        // Rebote horizontal
        if (this.x - this.radius < 0 || this.x + this.radius > width) {
            this.vx *= -1; // Invertir la velocidad
            this.x = Math.max(this.radius, Math.min(this.x, width - this.radius)); // Clamp position
        }

        // Rebote vertical
        if (this.y - this.radius < 0 || this.y + this.radius > height) {
            this.vy *= -0.8; // Rebote con pérdida de energía
            this.y = Math.max(this.radius, Math.min(this.y, height - this.radius)); // Clamp position
        }
    }
}

/**
 * Función exportada para que main.js pueda actualizar la posición del ratón.
 * @param {number} x - Coordenada X del ratón.
 * @param {number} y - Coordenada Y del ratón.
 */
export function setMousePosition(x, y) {
    mouse.x = x;
    mouse.y = y;
}

/**
 * Crea un array de partículas iniciales.
 * @param {number} width - Ancho inicial del canvas.
 * @param {number} height - Alto inicial del canvas.
 * @returns {Particle[]} El array de partículas.
 */
export function createParticles(width, height) {
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const radius = Math.random() * (MAX_PARTICLE_SIZE - MIN_PARTICLE_SIZE) + MIN_PARTICLE_SIZE;
        const x = Math.random() * width;
        const y = Math.random() * height;
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * BASE_SPEED * Math.random();
        const vy = Math.sin(angle) * BASE_SPEED * Math.random();
        
        particles.push(new Particle(x, y, vx, vy, radius, PARTICLE_COLOR));
    }
    return particles;
}

/**
 * Itera sobre todas las partículas y actualiza su estado.
 * @param {Particle[]} particles - Array de partículas.
 * @param {number} width - Ancho del canvas.
 * @param {number} height - Alto del canvas.
 */
export function updateAllParticles(particles, width, height) {
    particles.forEach(p => p.update(width, height));
}
