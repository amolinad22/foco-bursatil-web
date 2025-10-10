// Importamos la función central desde el módulo api.js
import { generateContent } from './api.js';

// Selectores del DOM
const promptInput = document.getElementById('prompt-input');
const generateButton = document.getElementById('generate-button');
const outputText = document.getElementById('output-text');
const outputLoading = document.getElementById('output-loading');
const sourcesContainer = document.getElementById('sources-container');
const sourcesList = document.getElementById('sources-list');
const useGroundingCheckbox = document.getElementById('use-grounding');

/**
 * Muestra u oculta el indicador de carga.
 * @param {boolean} isLoading - Si es true, muestra el spinner; si es false, lo oculta.
 */
function toggleLoading(isLoading) {
    generateButton.disabled = isLoading;
    // Cambiar el texto del botón
    generateButton.textContent = isLoading ? 'Generando...' : 'Generar Contenido';
    // Mostrar/ocultar el spinner
    outputLoading.classList.toggle('hidden', !isLoading);
    
    // Limpiar el estado anterior
    if (isLoading) {
        outputText.textContent = 'Generando respuesta...';
        sourcesContainer.classList.add('hidden');
        sourcesList.innerHTML = '';
    }
}

/**
 * Muestra el error en la interfaz de usuario.
 * @param {string} message - El mensaje de error.
 */
function displayError(message) {
    outputText.innerHTML = `<p class="text-red-600 font-semibold">Error: ${message}</p>`;
}

/**
 * Maneja el clic del botón de generación de contenido.
 */
async function handleGenerateClick() {
    const userQuery = promptInput.value.trim();
    // Leer el estado del checkbox de grounding
    const useGrounding = useGroundingCheckbox.checked;

    if (!userQuery) {
        displayError("Por favor, ingresa una solicitud antes de presionar Generar.");
        return;
    }

    toggleLoading(true);

    try {
        // Llama a la función importada desde api.js
        // Aquí es donde se hace la magia de la IA
        const { text, sources } = await generateContent(userQuery, useGrounding);

        // Mostrar el texto generado
        outputText.textContent = text; 

        // Mostrar las fuentes si existen y si se usó grounding
        if (sources.length > 0) {
            sourcesList.innerHTML = sources.map(source => 
                `<li><a href="${source.uri}" target="_blank" class="text-indigo-600 hover:text-indigo-800 hover:underline transition duration-150">${source.title}</a></li>`
            ).join('');
            sourcesContainer.classList.remove('hidden');
        } else {
            sourcesContainer.classList.add('hidden');
        }

    } catch (error) {
        console.error("Error al generar contenido:", error);
        displayError(error.message || "Ocurrió un error inesperado al comunicarse con la API.");
    } finally {
        toggleLoading(false);
    }
}

// Inicialización: Esperar a que la ventana cargue y añadir los escuchadores de eventos
window.onload = () => {
    generateButton.addEventListener('click', handleGenerateClick);
};
