/**
 * particles/config.js
 * Configuración centralizada para el sistema de partículas.
 * Aquí se definen todas las constantes globales.
 */

// Constantes del Canvas
export const CANVAS_ID = 'particle-canvas';
export const BACKGROUND_COLOR = '#0a0a0e';

// Constantes de las Partículas
export const PARTICLE_COUNT = 500;
export const MAX_PARTICLE_SIZE = 3;
export const MIN_PARTICLE_SIZE = 1;
export const BASE_SPEED = 3.0; // Velocidad de movimiento base
// Opcional: define el radio de influencia del ratón para repulsión
export const MOUSE_ATTRACTION_RADIUS = 150; 
export const MOUSE_REPULSION_FORCE = 0.5;

// Variables físicas
export const GRAVITY = 0.05;
export const FRICTION = 0.99; // Factor de fricción para ralentizar la velocidad gradualmente

// Opciones de apariencia (puedes expandir esto si usas más colores)
export const PARTICLE_COLOR = 'rgba(255, 255, 255, 0.8)';
