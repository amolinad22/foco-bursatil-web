// Constantes de la API
const API_KEY = ""; // La clave se proporcionará automáticamente en tiempo de ejecución
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/';
const MODEL_NAME = 'gemini-2.5-flash-preview-05-20';
const MAX_RETRIES = 5;

/**
 * Función para manejar la lógica de reintento con retroceso exponencial (Exponential Backoff).
 * Esto mejora la robustez de las llamadas de red.
 * @param {Function} fn - La función a ejecutar.
 * @param {number} retries - El número de reintentos restantes.
 * @returns {Promise<any>}
 */
async function fetchWithRetry(fn, retries = MAX_RETRIES) {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) {
            console.error("Error fatal en la llamada a la API después de múltiples reintentos.", error);
            throw new Error("El servicio de Gemini no está disponible en este momento. Inténtalo de nuevo más tarde.");
        }
        // Espera exponencial: 2^(MAX_RETRIES - retries) segundos
        const delay = Math.pow(2, MAX_RETRIES - retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(fn, retries - 1);
    }
}

/**
 * Llama a la API de Gemini para generar contenido de texto.
 *
 * @param {string} userQuery El prompt del usuario.
 * @param {boolean} useGrounding Indica si se debe usar la búsqueda de Google (grounding).
 * @returns {Promise<{text: string, sources: Array<{uri: string, title: string}>}>}
 */
export async function generateContent(userQuery, useGrounding) {
    const apiUrl = `${BASE_URL}${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    // Configuración del Payload
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
    };

    if (useGrounding) {
        // Agrega la herramienta de Google Search para grounding
        payload.tools = [{ "google_search": {} }];
    }

    const fetcher = async () => {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorBody}`);
        }

        return response.json();
    };

    const result = await fetchWithRetry(fetcher);
    const candidate = result.candidates?.[0];

    if (!candidate || !candidate.content?.parts?.[0]?.text) {
        throw new Error("Respuesta de la API incompleta o sin contenido de texto.");
    }

    const text = candidate.content.parts[0].text;
    let sources = [];

    // Extrae las fuentes si se usó grounding
    const groundingMetadata = candidate.groundingMetadata;
    if (groundingMetadata && groundingMetadata.groundingAttributions) {
        sources = groundingMetadata.groundingAttributions
            .map(attribution => ({
                uri: attribution.web?.uri,
                title: attribution.web?.title,
            }))
            .filter(source => source.uri && source.title);
    }

    return { text, sources };
}
