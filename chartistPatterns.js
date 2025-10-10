// Archivo chartistPatterns.js - Lógica y datos para todos los gráficos de análisis técnico

// --- Variables globales para instancias de Chart.js ---
let currentCharts = {}; // Almacena todas las instancias de Chart para destruirlas fácilmente
let patternChartInstance = null;
let trendChannelChartInstance = null;
let reversalSimulatorChartInstance = null;
let cupHandleSimulatorChartInstance = null;

// --- Datos de Gráficos ---

const initialSimData = {
    labels: Array.from({length: 12}, (_, i) => i + 1),
    price: [100, 102, 99, 104, 101, 106, 103, 100, 98, 100, 96, 94]
};

const initialChannelSimData = {
    labels: Array.from({length: 15}, (_, i) => i + 1),
    price: [100, 102, 101, 104, 103, 106, 105, 108, 107, 110, 109, 112, 111, 114, 113]
};

const initialReversalSimData = {
    labels: Array.from({length: 11}, (_, i) => i + 1),
    priceDoubleTop: [100, 101, 99, 101, 96, 100, 101, 99, 101, 96, 98],
    priceDoubleBottom: [100, 99, 101, 99, 104, 100, 99, 101, 99, 104, 102]
};

const initialCupSimData = {
    labels: Array.from({length: 17}, (_, i) => i + 1),
    price: [100, 98, 92, 88, 85, 87, 90, 95, 98, 100, 98, 95, 97, 99, 98, 100, 100],
    volume: [150, 140, 130, 120, 110, 120, 130, 140, 150, 180, 160, 150, 140, 150, 160, 190, 200] // Volumen simulado
};

// --- Estado de Simulación (Globales) ---
let triangleSimState = { breakout: false, stoploss: false, target: false };
let trendChannelSimState = { breakout: false, stoploss: false, target: false };
let reversalSimState = { type: 'top', breakout: false, stoploss: false, target: false };
let cupHandleSimState = { breakout: false, stoploss: false, target: false };

// --- Constantes de Descripción ---

const FIBONACCI_DESCRIPTIONS = {
    intro: "La herramienta de retroceso de Fibonacci se basa en la secuencia de Fibonacci. En el trading, se utiliza para identificar posibles niveles de soporte y resistencia después de un movimiento de precio significativo.",
    retrace: "Los niveles de retroceso más comunes (38.2%, 50%, 61.8%) actúan como posibles áreas donde el precio puede 'descansar' o revertirse antes de continuar la tendencia principal. Es una herramienta predictiva clave.",
    extension: "Los niveles de extensión (como 161.8%, 261.8%) se utilizan para establecer objetivos de ganancia (targets) una vez que el precio ha superado los niveles de retroceso y ha continuado la tendencia principal."
};

// --- Configuración Común de Chart.js ---

const chartDefaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(23, 27, 33, 0.8)',
            titleColor: '#fff',
            bodyColor: '#ccc',
            borderColor: '#60a5fa',
            borderWidth: 1,
        },
        annotation: {
            annotations: {},
        }
    },
    scales: {
        x: {
            title: { display: true, text: 'Tiempo/Punto', color: '#DBDBDB' },
            ticks: { color: '#DBDBDB' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        y: {
            title: { display: true, text: 'Precio', color: '#DBDBDB' },
            ticks: { color: '#DBDBDB' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
    }
};

// --- Funciones de Creación de Gráficos ---

function createBasePriceChart(canvasId, data, title) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return null;

    const newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Precio',
                data: data.price,
                borderColor: '#60a5fa',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#60a5fa',
                tension: 0.1
            }]
        },
        options: {
            ...chartDefaultOptions,
            plugins: {
                ...chartDefaultOptions.plugins,
                title: { display: true, text: title, color: '#fff', font: { size: 16 } }
            }
        }
    });
    currentCharts[canvasId] = newChart;
    return newChart;
}

function createSimulatorChart(canvasId, data, title) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return null;

    const newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Precio',
                data: data.price,
                borderColor: '#60a5fa',
                borderWidth: 2,
                pointRadius: (context) => (context.dataIndex > 11 ? 5 : 3),
                pointBackgroundColor: (context) => (context.dataIndex > 11 ? 'yellow' : '#60a5fa'),
                tension: 0.1
            }]
        },
        options: {
            ...chartDefaultOptions,
            animation: { duration: 500 },
            plugins: {
                ...chartDefaultOptions.plugins,
                title: { display: true, text: title, color: '#fff', font: { size: 16 } }
            },
            scales: {
                ...chartDefaultOptions.scales,
                y: { ...chartDefaultOptions.scales.y, min: 90, max: 110 }
            }
        }
    });
    currentCharts[canvasId] = newChart;
    return newChart;
}

function createTrendChannelSimulatorChart() {
    const ctx = document.getElementById('trend-channel-simulator-chart')?.getContext('2d');
    if (!ctx) return;

    trendChannelChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: initialChannelSimData.labels,
            datasets: [{
                label: 'Precio',
                data: initialChannelSimData.price,
                borderColor: '#10b981',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#10b981',
                tension: 0.1
            }]
        },
        options: {
            ...chartDefaultOptions,
            animation: { duration: 500 },
            plugins: {
                ...chartDefaultOptions.plugins,
                title: { display: true, text: 'Simulador de Canal Ascendente', color: '#fff', font: { size: 16 } },
                annotation: {
                    annotations: {
                        lineA: { type: 'line', scaleID: 'y', value: 100, endValue: 113, xMin: 1, xMax: 15, borderColor: '#facc15', borderWidth: 2, label: { content: 'Soporte', enabled: true, position: 'start', backgroundColor: 'rgba(250,204,21,0.5)', color: '#fff' }},
                        lineB: { type: 'line', scaleID: 'y', value: 102, endValue: 115, xMin: 1, xMax: 15, borderColor: '#facc15', borderWidth: 2, label: { content: 'Resistencia', enabled: true, position: 'end', backgroundColor: 'rgba(250,204,21,0.5)', color: '#fff' }}
                    }
                }
            },
            scales: {
                ...chartDefaultOptions.scales,
                y: { ...chartDefaultOptions.scales.y, min: 95, max: 120 }
            }
        }
    });
    currentCharts['trend-channel-simulator-chart'] = trendChannelChartInstance;
}

function createReversalSimulatorChart() {
    const ctx = document.getElementById('reversal-simulator-chart')?.getContext('2d');
    if (!ctx) return;

    reversalSimulatorChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: initialReversalSimData.labels,
            datasets: [{
                label: 'Precio',
                data: initialReversalSimData.priceDoubleTop,
                borderColor: '#f87171',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#f87171',
                tension: 0.1
            }]
        },
        options: {
            ...chartDefaultOptions,
            animation: { duration: 500 },
            plugins: {
                ...chartDefaultOptions.plugins,
                title: { display: true, text: 'Simulador de Doble Techo', color: '#fff', font: { size: 16 } },
                annotation: {
                    annotations: {
                        neckline: { type: 'line', yMin: 96, yMax: 96, borderColor: '#60a5fa', borderWidth: 2 }
                    }
                }
            },
            scales: {
                ...chartDefaultOptions.scales,
                y: { ...chartDefaultOptions.scales.y, min: 90, max: 105 }
            }
        }
    });
    currentCharts['reversal-simulator-chart'] = reversalSimulatorChartInstance;
}

function createCupHandleSimulatorChart() {
    const ctx = document.getElementById('cup-handle-simulator-chart')?.getContext('2d');
    if (!ctx) return;

    cupHandleSimulatorChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: initialCupSimData.labels,
            datasets: [
                {
                    label: 'Precio',
                    data: initialCupSimData.price,
                    borderColor: '#60a5fa',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#60a5fa',
                    tension: 0.2,
                    yAxisID: 'y'
                },
                {
                    label: 'Volumen',
                    data: initialCupSimData.volume,
                    type: 'bar',
                    backgroundColor: 'rgba(34, 197, 94, 0.5)',
                    borderColor: 'rgba(34, 197, 94, 0.8)',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            ...chartDefaultOptions,
            animation: { duration: 500 },
            plugins: {
                ...chartDefaultOptions.plugins,
                title: { display: true, text: 'Simulador de Taza con Asa', color: '#fff', font: { size: 16 } },
                legend: { display: true, labels: { color: '#DBDBDB' } },
                annotation: {
                    annotations: {
                        neckline: { type: 'line', yMin: 100, yMax: 100, borderColor: '#facc15', borderWidth: 2 }
                    }
                }
            },
            scales: {
                x: chartDefaultOptions.scales.x,
                y: { ...chartDefaultOptions.scales.y, min: 80, max: 110, position: 'left', title: { display: true, text: 'Precio', color: '#fff' } },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    min: 0,
                    max: 300,
                    title: { display: true, text: 'Volumen', color: '#fff' },
                    ticks: { color: '#DBDBDB' }
                }
            }
        }
    });
    currentCharts['cup-handle-simulator-chart'] = cupHandleSimulatorChartInstance;
}

// --- Funciones de Utilidad ---

// Exportada: Limpia TODAS las instancias de Chart.js
export function destroyAllCharts() {
    Object.keys(currentCharts).forEach(key => {
        if (currentCharts[key]) {
            currentCharts[key].destroy();
            currentCharts[key] = null;
        }
    });
    currentCharts = {};
    patternChartInstance = null;
    trendChannelChartInstance = null;
    reversalSimulatorChartInstance = null;
    cupHandleSimulatorChartInstance = null;
}

// Exportada: Limpia solo los gráficos de patrones chartistas (para navegación interna)
export function destroyChartistCharts() {
    const chartKeys = [
        'symmetric-triangle-chart', 'trend-channel-chart', 'reversal-patterns-chart', 'cup-handle-chart',
        'triangle-simulator-chart', 'trend-channel-simulator-chart', 'reversal-simulator-chart', 'cup-handle-simulator-chart'
    ];
    chartKeys.forEach(key => {
        if (currentCharts[key]) {
            currentCharts[key].destroy();
            currentCharts[key] = null;
        }
    });
    patternChartInstance = null;
    trendChannelChartInstance = null;
    reversalSimulatorChartInstance = null;
    cupHandleSimulatorChartInstance = null;
}

// Lógica interactiva para gráficos estáticos
function setupInteractiveChart(chartId, descriptionElementId, descriptions, defaultKey) {
    const chart = currentCharts[chartId];
    if (!chart) return;

    const descriptionElement = document.getElementById(descriptionElementId);
    if (!descriptionElement) return;

    const navButtons = document.querySelectorAll(`#${chartId}-nav button`);

    const updateContent = (key) => {
        descriptionElement.innerHTML = descriptions[key] || descriptions[defaultKey];
        navButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`button[data-step="${key}"]`).classList.add('active');
        
        // Limpiar anotaciones antes de aplicar las nuevas
        chart.options.plugins.annotation.annotations = {};
        
        // Lógica específica para cada tipo de gráfico (se asume que la lógica se aplica aquí)
        // Ejemplo para Gráficos de Patrones (Reversal/Cup, etc.) si fueran interactivos
        
        chart.update();
    };

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const key = button.dataset.step;
            updateContent(key);
        });
    });

    updateContent(defaultKey);
}

// --- Setup de Secciones de Estudio (Exportadas) ---

export function setupSRStudy() {
    createBasePriceChart('sr-chart-1', { labels: [1,2,3,4,5,6,7,8,9,10], price: [100, 95, 100, 95, 100, 95, 100, 95, 100, 95] }, 'Soporte y Resistencia Horizontal');
    createBasePriceChart('sr-chart-2', { labels: [1,2,3,4,5,6,7,8,9,10], price: [100, 102, 98, 104, 96, 106, 94, 108, 92, 110] }, 'Soporte y Resistencia Dinámico (Canal)');
}

export function setupFibonacciRetracementStudy() {
    const data = {
        labels: Array.from({length: 10}, (_, i) => i + 1),
        price: [100, 105, 110, 115, 120, 118, 116, 115, 114, 115]
    };
    
    const ctx = document.getElementById('fibonacci-chart')?.getContext('2d');
    if (!ctx) return;

    const fibonacciChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Precio',
                data: data.price,
                borderColor: '#ef4444',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#ef4444',
                tension: 0.1
            }]
        },
        options: {
            ...chartDefaultOptions,
            plugins: {
                ...chartDefaultOptions.plugins,
                title: { display: true, text: 'Retroceso de Fibonacci (Ejemplo)', color: '#fff', font: { size: 16 } },
                annotation: {
                    annotations: {
                        level_100: { type: 'line', yMin: 100, yMax: 100, borderColor: '#fff', borderWidth: 1, label: { content: '0% (100)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0.5)' }},
                        level_786: { type: 'line', yMin: 104.28, yMax: 104.28, borderColor: '#d946ef', borderWidth: 1, label: { content: '23.6% (104.28)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0.5)' }},
                        level_618: { type: 'line', yMin: 108.84, yMax: 108.84, borderColor: '#a78bfa', borderWidth: 1, label: { content: '38.2% (108.84)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0.5)' }},
                        level_500: { type: 'line', yMin: 110, yMax: 110, borderColor: '#facc15', borderWidth: 1, label: { content: '50.0% (110)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0.5)' }},
                        level_382: { type: 'line', yMin: 111.16, yMax: 111.16, borderColor: '#4ade80', borderWidth: 1, label: { content: '61.8% (111.16)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0.5)' }},
                        level_0: { type: 'line', yMin: 120, yMax: 120, borderColor: '#fff', borderWidth: 1, label: { content: '100% (120)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0.5)' }},
                    }
                }
            },
            scales: {
                ...chartDefaultOptions.scales,
                y: { ...chartDefaultOptions.scales.y, min: 95, max: 125 }
            }
        }
    });
    currentCharts['fibonacci-chart'] = fibonacciChartInstance;
    
    // Configurar interactividad
    setupInteractiveChart('fibonacci-chart', 'fibonacci-description', FIBONACCI_DESCRIPTIONS, 'intro');
}

export function setupSymmetricTriangleStudy() {
    patternChartInstance = createBasePriceChart('symmetric-triangle-chart', initialSimData, 'Patrón Triángulo Simétrico');
    setupTriangleSimulator();
}

export function setupTrendChannelStudy() {
    patternChartInstance = createBasePriceChart('trend-channels-chart', initialChannelSimData, 'Patrón Canal Ascendente');
    setupTrendChannelSimulator();
}

export function setupReversalStudy() {
    createReversalSimulatorChart(); // Simulación inicia aquí
    // El gráfico estático no es necesario ya que el simulador es el foco principal
}

export function setupCupHandleStudy() {
    createCupHandleSimulatorChart(); // Simulación inicia aquí
    // El gráfico estático no es necesario ya que el simulador es el foco principal
}

// --- Simuladores de Patrones ---

function setupTriangleSimulator() {
    triangleSimState = { breakout: false, stoploss: false, target: false };
    const chart = createSimulatorChart('triangle-simulator-chart', initialSimData, 'Simulador de Triángulo Simétrico');
    if (!chart) return;

    // Anotaciones iniciales del triángulo
    chart.options.plugins.annotation.annotations = {
        lineA: { type: 'line', xMin: 1, xMax: 11, yMin: 104, yMax: 96, borderColor: '#facc15', borderWidth: 2, label: { content: 'Resistencia Dinámica', enabled: true, position: 'end', backgroundColor: 'rgba(250,204,21,0.5)' } },
        lineB: { type: 'line', xMin: 1, xMax: 11, yMin: 98, yMax: 99.5, borderColor: '#facc15', borderWidth: 2, label: { content: 'Soporte Dinámico', enabled: true, position: 'end', backgroundColor: 'rgba(250,204,21,0.5)' } }
    };
    chart.update();

    const steps = Array.from({length: 5}, (_, i) => document.getElementById(`triangle-step-${i + 1}`));
    const buttons = {
        breakout: document.getElementById('simulate-triangle-breakout'),
        stoploss: document.getElementById('show-triangle-stoploss'),
        target: document.getElementById('calculate-triangle-target'),
        reset: document.getElementById('reset-triangle-simulation')
    };

    const updateUI = () => {
        steps[1].classList.toggle('opacity-50', triangleSimState.breakout);
        steps[2].classList.toggle('opacity-50', !triangleSimState.breakout);
        steps[3].classList.toggle('opacity-50', !triangleSimState.breakout || triangleSimState.stoploss);
        steps[4].classList.toggle('opacity-50', !triangleSimState.stoploss || triangleSimState.target);

        buttons.breakout.disabled = triangleSimState.breakout;
        buttons.stoploss.disabled = !triangleSimState.breakout || triangleSimState.stoploss;
        buttons.target.disabled = !triangleSimState.stoploss || triangleSimState.target;
    };

    const reset = () => {
        triangleSimState = { breakout: false, stoploss: false, target: false };
        setupTriangleSimulator(); // Re-ejecutar la inicialización para limpiar el gráfico
        updateUI();
    };

    buttons.reset.addEventListener('click', reset);

    buttons.breakout.addEventListener('click', () => {
        if (triangleSimState.breakout) return;
        triangleSimState.breakout = true;

        chart.data.labels.push(13, 14);
        chart.data.datasets[0].data.push(92, 90); // Ruptura bajista (simétrica)

        chart.options.plugins.annotation.annotations.entry = { type: 'point', xValue: 12, yValue: 94, backgroundColor: 'red', radius: 6 };
        chart.update();
        updateUI();
    });

    buttons.stoploss.addEventListener('click', () => {
        if (!triangleSimState.breakout || triangleSimState.stoploss) return;
        triangleSimState.stoploss = true;

        chart.options.plugins.annotation.annotations.stoploss = { type: 'line', yMin: 98, yMax: 98, borderColor: 'orange', borderDash: [6,6] };
        chart.update();
        updateUI();
    });

    buttons.target.addEventListener('click', () => {
        if (!triangleSimState.stoploss || triangleSimState.target) return;
        triangleSimState.target = true;

        const annotations = chart.options.plugins.annotation.annotations;
        const basePrice = 104 - 98; // Altura del inicio del patrón
        const targetPrice = 94 - basePrice; // Precio de ruptura (94) - Altura
        
        // Medida de Altura
        annotations.heightMeasure = {
            type: 'line',
            xMin: 1, 
            xMax: 1,
            yMin: 98,
            yMax: 104,
            borderColor: '#a78bfa',
            borderWidth: 2,
            borderDash: [6, 6],
            label: { content: 'Altura', enabled: true, position: 'center', backgroundColor: 'rgba(0,0,0,0.5)', color: '#a78bfa', font: {size: 10}}
        };

        // Proyección del Objetivo
        annotations.target = {
            type: 'line',
            yMin: targetPrice,
            yMax: targetPrice,
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 2,
            borderDash: [6, 6]
        };

        chart.options.scales.y.min = targetPrice - 5;
        chart.update();
        updateUI();
    });

    updateUI();
}

function setupTrendChannelSimulator() {
    trendChannelSimState = { breakout: false, stoploss: false, target: false };
    createTrendChannelSimulatorChart(); // Re-inicializa el gráfico con las anotaciones base

    const steps = Array.from({length: 5}, (_, i) => document.getElementById(`channel-step-${i + 1}`));
    const buttons = {
        breakout: document.getElementById('simulate-channel-breakout'),
        stoploss: document.getElementById('show-channel-stoploss'),
        target: document.getElementById('calculate-channel-target'),
        reset: document.getElementById('reset-channel-simulation'),
    };

    const updateUI = () => {
        steps[1].classList.toggle('opacity-50', trendChannelSimState.breakout);
        steps[2].classList.toggle('opacity-50', !trendChannelSimState.breakout);
        steps[3].classList.toggle('opacity-50', !trendChannelSimState.breakout || trendChannelSimState.stoploss);
        steps[4].classList.toggle('opacity-50', !trendChannelSimState.stoploss || trendChannelSimState.target);

        buttons.breakout.disabled = trendChannelSimState.breakout;
        buttons.stoploss.disabled = !trendChannelSimState.breakout || trendChannelSimState.stoploss;
        buttons.target.disabled = !trendChannelSimState.stoploss || trendChannelSimState.target;
    };

    const reset = () => {
        trendChannelSimState = { breakout: false, stoploss: false, target: false };
        createTrendChannelSimulatorChart();
        updateUI();
    };

    buttons.reset.addEventListener('click', reset);

    buttons.breakout.addEventListener('click', () => {
        if (trendChannelSimState.breakout) return;
        trendChannelSimState.breakout = true;
        const chart = trendChannelChartInstance;

        // Ruptura alcista del canal
        chart.data.labels.push(16, 17);
        chart.data.datasets[0].data.push(116, 118);
        chart.options.plugins.annotation.annotations.entry = { type: 'point', xValue: 15, yValue: 114, backgroundColor: 'green', radius: 6 };
        chart.update();
        updateUI();
    });

    buttons.stoploss.addEventListener('click', () => {
        if (!trendChannelSimState.breakout || trendChannelSimState.stoploss) return;
        trendChannelSimState.stoploss = true;
        const chart = trendChannelChartInstance;

        // Stop loss justo debajo de la resistencia anterior del canal (proyectada al punto 15)
        const resistancePriceAtBreakout = 102 + (115 - 102) / 14 * 14; // Linealmente proyectado a x=15
        chart.options.plugins.annotation.annotations.stoploss = { type: 'line', yMin: resistancePriceAtBreakout, yMax: resistancePriceAtBreakout, borderColor: 'orange', borderDash: [6,6] };
        chart.update();
        updateUI();
    });

    buttons.target.addEventListener('click', () => {
        if (!trendChannelSimState.stoploss || trendChannelSimState.target) return;
        trendChannelSimState.target = true;
        const chart = trendChannelChartInstance;
        const annotations = chart.options.plugins.annotation.annotations;

        // Cálculo del target: Proyectar la anchura del canal desde el punto de ruptura
        const channelWidth = 2; // (102 - 100) en el punto 1
        const breakoutPrice = chart.data.datasets[0].data[14]; // 113
        const targetPrice = breakoutPrice + channelWidth; // 113 + 2 = 115

        // Proyección de la anchura para visualización
        annotations.widthMeasure = {
            type: 'line',
            xMin: 1, 
            xMax: 1,
            yMin: 100, // Soporte inicial
            yMax: 102, // Resistencia inicial
            borderColor: '#a78bfa',
            borderWidth: 2,
            borderDash: [6, 6],
            label: { content: 'Anchura', enabled: true, position: 'center', backgroundColor: 'rgba(0,0,0,0.5)', color: '#a78bfa', font: {size: 10}}
        };

        // Línea de objetivo
        annotations.target = {
            type: 'line',
            yMin: targetPrice,
            yMax: targetPrice,
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 2,
            borderDash: [6, 6]
        };

        chart.options.scales.y.max = targetPrice + 5;
        chart.update();
        updateUI();
    });

    updateUI();
}

export function setupReversalStudy() {
    setupReversalSimulator();
}

function setupReversalSimulator() {
    reversalSimState = { type: 'top', breakout: false, stoploss: false, target: false };
    createReversalSimulatorChart();

    const steps = Array.from({length: 5}, (_, i) => document.getElementById(`reversal-step-${i + 1}`));
    const step1Text = document.getElementById('reversal-step-1-text');
    const buttons = {
        toggle: document.getElementById('toggle-reversal-type'),
        breakout: document.getElementById('simulate-reversal-breakout'),
        stoploss: document.getElementById('show-reversal-stoploss'),
        target: document.getElementById('calculate-reversal-target'),
        reset: document.getElementById('reset-reversal-simulation'),
    };

    const updateUI = () => {
        steps[1].classList.toggle('opacity-50', reversalSimState.breakout);
        steps[2].classList.toggle('opacity-50', !reversalSimState.breakout);
        steps[3].classList.toggle('opacity-50', !reversalSimState.breakout || reversalSimState.stoploss);
        steps[4].classList.toggle('opacity-50', !reversalSimState.stoploss || reversalSimState.target);

        buttons.breakout.disabled = reversalSimState.breakout;
        buttons.stoploss.disabled = !reversalSimState.breakout || reversalSimState.stoploss;
        buttons.target.disabled = !reversalSimState.stoploss || reversalSimState.target;
    };

    const reset = () => {
        reversalSimState = { type: 'top', breakout: false, stoploss: false, target: false };
        createReversalSimulatorChart();
        reversalSimulatorChartInstance.data.datasets[0].data = [...initialReversalSimData.priceDoubleTop];
        reversalSimulatorChartInstance.options.plugins.annotation.annotations = { neckline: { type: 'line', yMin: 96, yMax: 96, borderColor: '#60a5fa' } };
        reversalSimulatorChartInstance.options.scales.y.min = 90;
        reversalSimulatorChartInstance.options.scales.y.max = 105;
        reversalSimulatorChartInstance.update();
        
        // Sincronizar UI
        buttons.toggle.textContent = 'Alternar a Doble Suelo';
        if(step1Text) {
            step1Text.textContent = 'El precio ha formado un posible doble techo. Identifica el "cuello" (neckline).';
        }
        updateUI();
    };

    buttons.reset.addEventListener('click', reset);

    buttons.toggle.addEventListener('click', () => {
        if (reversalSimState.breakout) return;
        reversalSimState.type = reversalSimState.type === 'top' ? 'bottom' : 'top';
        const isTop = reversalSimState.type === 'top';
        buttons.toggle.textContent = isTop ? 'Alternar a Doble Suelo' : 'Alternar a Doble Techo';
        
        if(step1Text) {
            step1Text.textContent = isTop
            ? 'El precio ha formado un posible doble techo. Identifica el "cuello" (neckline).'
            : 'El precio ha formado un posible doble suelo. Identifica el "cuello" (neckline).';
        }
        
        const chart = reversalSimulatorChartInstance;
        chart.data.labels = [...initialReversalSimData.labels]; // Restablecer labels
        chart.data.datasets[0].data = isTop ? [...initialReversalSimData.priceDoubleTop] : [...initialReversalSimData.priceDoubleBottom];
        
        // Ajustar el neckline y los límites del eje Y
        chart.options.plugins.annotation.annotations = { neckline: { type: 'line', yMin: isTop ? 96 : 104, yMax: isTop ? 96 : 104, borderColor: '#60a5fa' } };
        chart.options.scales.y.min = isTop ? 90 : 95;
        chart.options.scales.y.max = isTop ? 105 : 110;

        chart.update();
    });

    buttons.breakout.addEventListener('click', () => {
        if (reversalSimState.breakout) return;
        reversalSimState.breakout = true;
        const chart = reversalSimulatorChartInstance;
        const isTop = reversalSimState.type === 'top';

        // Extensión de datos para la ruptura
        chart.data.labels.push(12, 13);
        
        // Ruptura (Bajista para Doble Techo, Alcista para Doble Suelo)
        chart.data.datasets[0].data.push(isTop ? 94 : 106, isTop ? 92 : 108); 
        
        // Punto de entrada (cierre de la vela de ruptura)
        chart.options.plugins.annotation.annotations.entry = { type: 'point', xValue: 11, yValue: isTop ? 94 : 106, backgroundColor: isTop ? 'red' : 'green', radius: 6 };
        chart.update();
        updateUI();
    });

    buttons.stoploss.addEventListener('click', () => {
        if (!reversalSimState.breakout || reversalSimState.stoploss) return;
        reversalSimState.stoploss = true;
        const chart = reversalSimulatorChartInstance;
        const isTop = reversalSimState.type === 'top';

        // Stop loss: ligeramente por encima del neckline roto (Doble Techo) o por debajo (Doble Suelo)
        chart.options.plugins.annotation.annotations.stoploss = { type: 'line', yMin: isTop ? 101.5 : 98.5, yMax: isTop ? 101.5 : 98.5, borderColor: 'orange', borderDash: [6,6] };
        chart.update();
        updateUI();
    });

    buttons.target.addEventListener('click', () => {
        if (!reversalSimState.stoploss || reversalSimState.target) return;
        reversalSimState.target = true;
        const chart = reversalSimulatorChartInstance;
        const annotations = chart.options.plugins.annotation.annotations;
        const isTop = reversalSimState.type === 'top';

        const necklinePrice = isTop ? 96 : 104;
        const peakOrTroughPrice = isTop ? 101 : 99; 
        const height = Math.abs(necklinePrice - peakOrTroughPrice);
        const targetPrice = isTop ? necklinePrice - height : necklinePrice + height;

        // Medir la altura del patrón
        annotations.heightMeasure = {
            type: 'line',
            xMin: 4, 
            xMax: 4,
            yMin: necklinePrice,
            yMax: peakOrTroughPrice,
            borderColor: '#a78bfa',
            borderWidth: 2,
            borderDash: [6, 6],
            label: { content: 'Altura', enabled: true, position: 'center', backgroundColor: 'rgba(0,0,0,0.5)', color: '#a78bfa', font: {size: 10}}
        };

        // Proyectar la altura desde el punto de ruptura
        annotations.heightProjection = {
            type: 'line',
            xMin: 11, 
            xMax: 11,
            yMin: necklinePrice,
            yMax: targetPrice,
            borderColor: '#a78bfa',
            borderWidth: 2,
            borderDash: [6, 6]
        };

        // Línea de objetivo
        annotations.target = { 
            type: 'line', 
            yMin: targetPrice, 
            yMax: targetPrice, 
            borderColor: 'rgb(34, 197, 94)', 
            borderWidth: 2, 
            borderDash: [6, 6] 
        };

        // Ajustar el eje Y para que se vea el target
        chart.options.scales.y.min = isTop ? targetPrice - 5 : chart.options.scales.y.min;
        chart.options.scales.y.max = isTop ? chart.options.scales.y.max : targetPrice + 5;
        
        chart.update();
        updateUI();
    });

    reset(); // Inicializar con el estado de Doble Techo
}

export function setupCupHandleSimulator() {
    createCupHandleSimulatorChart();

    const steps = Array.from({length: 5}, (_, i) => document.getElementById(`cup-handle-step-${i + 1}`));
    const buttons = {
        breakout: document.getElementById('simulate-cup-breakout'),
        stoploss: document.getElementById('show-cup-stoploss'),
        target: document.getElementById('calculate-cup-target'),
        reset: document.getElementById('reset-cup-simulation'),
    };

    const updateUI = () => {
        steps[1].classList.toggle('opacity-50', cupHandleSimState.breakout);
        steps[2].classList.toggle('opacity-50', !cupHandleSimState.breakout);
        steps[3].classList.toggle('opacity-50', !cupHandleSimState.breakout || cupHandleSimState.stoploss);
        steps[4].classList.toggle('opacity-50', !cupHandleSimState.stoploss || cupHandleSimState.target);

        buttons.breakout.disabled = cupHandleSimState.breakout;
        buttons.stoploss.disabled = !cupHandleSimState.breakout || cupHandleSimState.stoploss;
        buttons.target.disabled = !cupHandleSimState.stoploss || cupHandleSimState.target;
    };

    const reset = () => {
        cupHandleSimState = { breakout: false, stoploss: false, target: false };
        // Destruir y recrear el gráfico para limpiar datos y anotaciones
        if (cupHandleSimulatorChartInstance) cupHandleSimulatorChartInstance.destroy();
        createCupHandleSimulatorChart();
        updateUI();
    };

    buttons.reset.addEventListener('click', reset);

    buttons.breakout.addEventListener('click', () => {
        if (cupHandleSimState.breakout) return;
        cupHandleSimState.breakout = true;
        const chart = cupHandleSimulatorChartInstance;

        // Ruptura Alcista
        chart.data.labels.push(18, 19);
        chart.data.datasets[0].data.push(105, 108);
        chart.data.datasets[1].data.push(280, 250); // Aumento de volumen en la ruptura
        
        chart.options.plugins.annotation.annotations.entry = { type: 'point', xValue: 17, yValue: 100, backgroundColor: 'rgba(34, 197, 94, 0.8)', radius: 6 };
        chart.update();
        updateUI();
    });

    buttons.stoploss.addEventListener('click', () => {
        if (!cupHandleSimState.breakout || cupHandleSimState.stoploss) return;
        cupHandleSimState.stoploss = true;
        const chart = cupHandleSimulatorChartInstance;
        
        // Stop loss: Ligeramente debajo del punto más bajo del "Asa"
        const handleLow = Math.min(...initialCupSimData.price.slice(11)); // Mínimo de 95
        chart.options.plugins.annotation.annotations.stoploss = { type: 'line', yMin: handleLow - 1, yMax: handleLow - 1, borderColor: 'rgb(239, 68, 68)', borderDash: [6,6]};
        chart.update();
        updateUI();
    });

    buttons.target.addEventListener('click', () => {
        if (!cupHandleSimState.stoploss || cupHandleSimState.target) return;
        cupHandleSimState.target = true;
        const chart = cupHandleSimulatorChartInstance;
        const annotations = chart.options.plugins.annotation.annotations;
        
        const cupHigh = 100; // Nivel de resistencia del "Asa"
        const cupLow = 85;   // Fondo de la "Taza"
        const cupDepth = cupHigh - cupLow; // 15 puntos
        const breakoutPrice = 100;
        const targetPrice = breakoutPrice + cupDepth; // 100 + 15 = 115

        // Medir la profundidad de la Taza
        annotations.depthMeasure = {
            type: 'line',
            xMin: 6,
            xMax: 6,
            yMin: cupLow,
            yMax: cupHigh,
            borderColor: '#a78bfa',
            borderWidth: 2,
            borderDash: [6, 6],
            label: { content: 'Profundidad', enabled: true, position: 'center', backgroundColor: 'rgba(0,0,0,0.5)', color: '#a78bfa', font: {size: 10}}
        };

        // Proyectar el objetivo desde el punto de ruptura
        annotations.depthProjection = {
            type: 'line',
            xMin: 17,
            xMax: 17,
            yMin: breakoutPrice,
            yMax: targetPrice,
            borderColor: '#a78bfa',
            borderWidth: 2,
            borderDash: [6, 6]
        };

        annotations.target = { 
            type: 'line', 
            yMin: targetPrice, 
            yMax: targetPrice, 
            borderColor: 'rgb(34, 197, 94)', 
            borderWidth: 2, 
            borderDash: [6, 6]
        };

        chart.options.scales.y.max = targetPrice + 5;
        chart.update();
        updateUI();
    });

    reset();
}
