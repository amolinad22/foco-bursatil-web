// particles/config.js

/**
 * @file particles/config.js
 * @description Configuración centralizada para el sistema de partículas.
 * Aquí se definen todas las constantes globales.
 */

// Constantes del Canvas
export const CANVAS_ID = 'particle-canvas';
export const BACKGROUND_COLOR = '#f7f7ff'; // Blanco muy ligero para que el contenido resalte

// Constantes de las Partículas
export const PARTICLE_COUNT = 100; // Un número más moderado para empezar
export const PARTICLE_SIZE = 1; // Tamaño fijo en píxeles
export const BASE_SPEED = 0.2; // Velocidad de movimiento base (más lento para un efecto sutil)

// Opciones de apariencia (puedes expandir esto si usas más colores)
export const PARTICLE_COLOR = 'rgba(128, 128, 128, 0.7)'; // Gris suave y semitransparente

// --- Constantes de Conexión (Líneas) ---
export const CONNECTION_DISTANCE = 150; // Distancia máxima para dibujar una línea entre partículas (en píxeles)
export const LINE_COLOR = 'rgba(128, 128, 128, 0.1)'; // Líneas muy suaves y casi invisibles

// --- Constantes de Interacción con el Ratón ---
// Define el radio y la fuerza de la repulsión del ratón.
export const MOUSE_REPULSION_RADIUS = 120; // Radio de influencia del ratón.
export const MOUSE_REPULSION_STRENGTH = 0.5; // Fuerza con la que las partículas son empujadas.
