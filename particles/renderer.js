/**
 * particles/renderer.js
 * Módulo de renderizado.
 * Se encarga de la inicialización del canvas, el redimensionamiento y el dibujo de las partículas.
 */
import { CANVAS_ID, BACKGROUND_COLOR } from './config.js';

let canvas;
let ctx;

/**
 * Inicializa el elemento canvas y el contexto 2D.
 * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}} El canvas y su contexto.
 */
export function initializeCanvas() {
    canvas = document.getElementById(CANVAS_ID);
    if (!canvas) {
        console.error(`Canvas no encontrado con ID: ${CANVAS_ID}`);
        return {};
    }
    
    // Obtener el contexto y configurar suavizado (si aplica)
    ctx = canvas.getContext('2d');

    // Estilos iniciales para que el canvas ocupe toda la ventana
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1'; // Asegura que esté detrás del contenido principal

    return { canvas, ctx };
}

/**
 * Ajusta el tamaño del canvas para que coincida con las dimensiones de la ventana.
 * @returns {{width: number, height: number}} Las nuevas dimensiones.
 */
export function resizeCanvas() {
    if (canvas) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Ajustar las dimensiones del canvas
        canvas.width = width;
        canvas.height = height;
        
        return { width, height };
    }
    return { width: 0, height: 0 };
}

/**
 * Dibuja todas las partículas en el canvas.
 * @param {import('./particle.js').Particle[]} particles - Array de objetos Particle.
 */
export function drawParticles(particles) {
    if (!ctx) return;
    
    // 1. Limpiar el canvas (fondo)
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Dibujar cada partícula
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.closePath();
    });

    // NOTA: Si tu código original de 2564 líneas incluía lógica para dibujar líneas
    // entre partículas cercanas, esa lógica debería ir aquí.
    
    // Ejemplo de lógica para conectar partículas:
    // drawConnections(particles, ctx); 
}

// /**
//  * (Opcional) Dibuja líneas de conexión entre partículas cercanas.
//  * Descomentar si tu código original incluía esta funcionalidad.
//  * @param {import('./particle.js').Particle[]} particles
//  * @param {CanvasRenderingContext2D} ctx
//  */
// function drawConnections(particles, ctx) {
//     const connectionDistance = 100; // Máxima distancia para conectar
//     ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
//     ctx.lineWidth = 0.5;

//     for (let i = 0; i < particles.length; i++) {
//         for (let j = i + 1; j < particles.length; j++) {
//             const p1 = particles[i];
//             const p2 = particles[j];

//             const dx = p1.x - p2.x;
//             const dy = p1.y - p2.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);

//             if (distance < connectionDistance) {
//                 ctx.globalAlpha = 1 - (distance / connectionDistance);
//                 ctx.beginPath();
//                 ctx.moveTo(p1.x, p1.y);
//                 ctx.lineTo(p2.x, p2.y);
//                 ctx.stroke();
//                 ctx.closePath();
//                 ctx.globalAlpha = 1; // Restablecer
//             }
//         }
//     }
// }
