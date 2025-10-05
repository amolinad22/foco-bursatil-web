// --- Módulo de Gráficos y Educación ---
let anatomyChartInstance = null;
let simulatorChartInstance = null;
let fibonacciChartInstance = null;
let srChartHorizontalInstance = null;
let srChartTrendInstance = null;
let trendChannelChartInstance = null;
let reversalChartInstance = null; 
let channelSimulatorChartInstance = null;
let reversalSimulatorChartInstance = null;
let cupHandleAnatomyChartInstance = null;
let cupHandleSimulatorChartInstance = null;

// --- Estados de los simuladores ---
let simState = {};
let cupHandleSimState = {};
let channelSimState = {};
let reversalSimState = {};

const chartDefaultOptions = {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: { display: false },
tooltip: { enabled: false },
annotation: { annotations: {} }
},
scales: {
x: {
grid: { color: 'rgba(255, 255, 255, 0.1)' },
ticks: { color: '#9ca3af', display: false }
},
y: {
grid: { color: 'rgba(255, 255, 255, 0.1)' },
ticks: { color: '#9ca3af' }
},
y1: {
type: 'linear',
display: true,
position: 'right',
grid: { drawOnChartArea: false },
ticks: { display: false }
}
}
};

const anatomyDescriptions = {
lines: {
title: 'Líneas de Tendencia Convergentes',
text: 'El patrón se define por dos líneas de tendencia que se mueven una hacia la otra. La línea superior (resistencia) conecta los máximos decrecientes, mientras que la línea inferior (soporte) conecta los mínimos crecientes.',
annotations: {
resistance: {
type: 'line', xMin: 1, xMax: 19, yMin: 111.5, yMax: 109.07, borderColor: 'rgb(239, 68, 68)', borderWidth: 2,
label: { content: 'Resistencia', enabled: true, position: 'start', backgroundColor: 'rgba(239, 68, 68, 0.7)', color: 'white', font: { size: 10 }, yAdjust: -10 }
},
support: {
type: 'line', xMin: 2, xMax: 18, yMin: 102, yMax: 109.06, borderColor: 'rgb(34, 197, 94)', borderWidth: 2,
label: { content: 'Soporte', enabled: true, position: 'start', backgroundColor: 'rgba(34, 197, 94, 0.7)', color: 'white', font: { size: 10 }, yAdjust: 10 }
}
}
},
points: {
title: 'Puntos de Contacto',
text: 'Para que el patrón sea válido, cada línea de tendencia debe ser tocada al menos dos veces. Estos puntos de contacto validan las zonas de soporte y resistencia que están comprimiendo el precio.',
annotations: {
resistanceLine: { type: 'line', xMin: 1, xMax: 19, yMin: 111.5, yMax: 109.07, borderColor: 'rgba(239, 68, 68, 0.3)', borderWidth: 2 },
supportLine: { type: 'line', xMin: 2, xMax: 18, yMin: 102, yMax: 109.06, borderColor: 'rgba(34, 197, 94, 0.3)', borderWidth: 2 },
point1: { type: 'point', xValue: 3, yValue: 108, backgroundColor: 'rgb(239, 68, 68)', radius: 6, borderColor: 'white', borderWidth: 2 },
point2: { type: 'point', xValue: 5, yValue: 110, backgroundColor: 'rgb(239, 68, 68)', radius: 6, borderColor: 'white', borderWidth: 2 },
point3: { type: 'point', xValue: 7, yValue: 111, backgroundColor: 'rgb(239, 68, 68)', radius: 6, borderColor: 'white', borderWidth: 2 },
point4: { type: 'point', xValue: 2, yValue: 102, backgroundColor: 'rgb(34, 197, 94)', radius: 6, borderColor: 'white', borderWidth: 2 },
point5: { type: 'point', xValue: 4, yValue: 104, backgroundColor: 'rgb(34, 197, 94)', radius: 6, borderColor: 'white', borderWidth: 2 },
point6: { type: 'point', xValue: 6, yValue: 106, backgroundColor: 'rgb(34, 197, 94)', radius: 6, borderColor: 'white', borderWidth: 2 },
}
},
volume: {
title: 'Volumen Decreciente',
text: 'Una característica clave es la disminución del volumen de negociación a medida que el patrón se desarrolla. Esto indica que tanto compradores como vendedores están perdiendo convicción, esperando una señal clara antes de comprometerse.',
annotations: {
resistanceLine: { type: 'line', xMin: 1, xMax: 19, yMin: 111.5, yMax: 109.07, borderColor: 'rgba(239, 68, 68, 0.3)', borderWidth: 2 },
supportLine: { type: 'line', xMin: 2, xMax: 18, yMin: 102, yMax: 109.06, borderColor: 'rgba(34, 197, 94, 0.3)', borderWidth: 2 },
volumeTrend: { type: 'line', xMin: 1, xMax: 19, yMin: 230, yMax: 50, borderColor: 'rgb(253, 224, 71)', borderWidth: 2, scaleID: 'y1' }
}
},
breakout: {
title: 'La Ruptura (Breakout)',
text: 'La ruptura ocurre cuando el precio se mueve decisivamente por encima de la línea de resistencia o por debajo de la línea de soporte, usualmente acompañado de un aumento significativo en el volumen. Esto señala el fin de la consolidación.',
annotations: {
resistanceLine: { type: 'line', xMin: 1, xMax: 19, yMin: 111.5, yMax: 109.07, borderColor: 'rgba(239, 68, 68, 0.3)', borderWidth: 2 },
supportLine: { type: 'line', xMin: 2, xMax: 18, yMin: 102, yMax: 109.06, borderColor: 'rgba(34, 197, 94, 0.3)', borderWidth: 2 },
breakoutArrow: { type: 'arrow', xMin: 19.5, xMax: 21, yMin: 109.5, yMax: 111.5, end: 'end', borderColor: '#a78bfa', borderWidth: 3 },
volumeSpike: { type: 'box', xMin: 19.5, xMax: 20.5, yMin: 0, yMax: 250, scaleID: 'y1', backgroundColor: 'rgba(167, 139, 250, 0.4)' }
}
}
};

const anatomyLabels = Array.from({ length: 25 }, (_, i) => i + 1);
const anatomyPriceData = [100, 105, 102, 108, 104, 110, 106, 111, 108, 110, 108.5, 109.5, 108.8, 109.2, 109, 109.1, 109.05, 109.08, 109.06, 109.07, 112, 111, 114, 113, 115];
const anatomyVolumeData = [150, 180, 160, 200, 170, 220, 180, 230, 190, 150, 140, 130, 120, 110, 100, 90, 80, 70, 60, 50, 250, 220, 280, 240, 300];

const initialSimData = {
labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
price: [50, 52, 49, 51.5, 49.5, 51, 50, 50.8, 50.2, 50.7, 50.3, 50.6, 50.4, 50.5, 50.45],
volume: [100, 120, 90, 110, 80, 95, 70, 80, 65, 70, 60, 65, 55, 60, 50]
};

const trendChannelData = {
labels: Array.from({ length: 30 }, (_, i) => i + 1),
priceUp: [10, 12, 11, 14, 13, 16, 15, 18, 17, 20, 19, 22, 21, 24, 23, 26, 25, 28, 27, 30, 29, 32, 31, 34, 33, 36, 35, 38, 37, 40],
priceDown: [40, 38, 39, 36, 37, 34, 35, 32, 33, 30, 31, 28, 29, 26, 27, 24, 25, 22, 23, 20, 21, 18, 19, 16, 17, 14, 15, 12, 13, 10]
};

const trendChannelDescriptions = {
'channel-up': {
title: 'Canal de Tendencia Alcista',
text: 'Un canal alcista se forma cuando el precio se mueve entre dos líneas paralelas con pendiente positiva. La línea inferior actúa como soporte dinámico y la superior como resistencia dinámica. Los traders buscan oportunidades de compra cerca de la línea de soporte y de venta cerca de la resistencia.',
annotations: {
support: { type: 'line', xMin: 0, xMax: 29, yMin: 10, yMax: 37, borderColor: 'rgb(34, 197, 94)', borderWidth: 2 },
resistance: { type: 'line', xMin: 0, xMax: 29, yMin: 12, yMax: 39, borderColor: 'rgb(239, 68, 68)', borderWidth: 2 }
},
data: trendChannelData.priceUp
},
'channel-down': {
title: 'Canal de Tendencia Bajista',
text: 'Un canal bajista se forma cuando el precio se mueve entre dos líneas paralelas con pendiente negativa. La línea superior actúa como resistencia dinámica y la inferior como soporte dinámico. Los traders pueden buscar oportunidades de venta cerca de la resistencia y de compra cerca del soporte.',
annotations: {
resistance: { type: 'line', xMin: 0, xMax: 29, yMin: 40, yMax: 13, borderColor: 'rgb(239, 68, 68)', borderWidth: 2 },
support: { type: 'line', xMin: 0, xMax: 29, yMin: 38, yMax: 11, borderColor: 'rgb(34, 197, 94)', borderWidth: 2 }
},
data: trendChannelData.priceDown
}
};

const fibonacciData = {
labels: Array.from({ length: 30 }, (_, i) => i + 1),
price: [100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 148, 145, 142, 140, 138, 135, 133, 131, 130, 132, 135, 138, 140, 142, 145, 148, 150, 152, 155],
high: 150,
low: 100
};

const fibonacciDescriptions = {
levels: {
title: 'Niveles Clave de Fibonacci',
text: 'Los niveles de retroceso más utilizados son el 23.6%, 38.2%, 50%, 61.8% y 78.6%. Aunque existen varios niveles, los más usados y observados por los traders son el **50% y 61.8%**, que a menudo actúan como zonas de reversión importantes.',
annotations: {
line1: { type: 'line', yMin: fibonacciData.high, yMax: fibonacciData.high, borderColor: '#7C3AED', borderWidth: 2, label: { content: '100.0% (150)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0)', color: '#7C3AED', font: { size: 10 }}},
line2: { type: 'line', yMin: fibonacciData.high - (fibonacciData.high - fibonacciData.low) * 0.236, yMax: fibonacciData.high - (fibonacciData.high - fibonacciData.low) * 0.236, borderColor: '#60A5FA', borderWidth: 1, label: { content: '23.6% (138.2)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0)', color: '#60A5FA', font: { size: 10 }}},
line3: { type: 'line', yMin: fibonacciData.high - (fibonacciData.high - fibonacciData.low) * 0.382, yMax: fibonacciData.high - (fibonacciData.high - fibonacciData.low) * 0.382, borderColor: '#FCD34D', borderWidth: 1, label: { content: '38.2% (130.9)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0)', color: '#FCD34D', font: { size: 10 }}},
line4: { type: 'line', yMin: fibonacciData.high - (fibonacciData.high - fibonacciData.low) * 0.5, yMax: fibonacciData.high - (fibonacciData.high - fibonacciData.low) * 0.5, borderColor: '#F97316', borderWidth: 2, label: { content: '50.0% (125)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0)', color: '#F97316', font: { size: 10 }}},
line5: { type: 'line', yMin: fibonacciData.high - (fibonacciData.high - fibonacciData.low) * 0.618, yMax: fibonacciData.high - (fibonacciData.high - fibonacciData.low) * 0.618, borderColor: '#F43F5E', borderWidth: 2, label: { content: '61.8% (119.1)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0)', color: '#F43F5E', font: { size: 10 }}},
line6: { type: 'line', yMin: fibonacciData.high - (fibonacciData.high - fibonacciData.low) * 0.786, yMax: fibonacciData.high - (fibonacciData.high - fibonacciData.low) * 0.786, borderColor: '#84CC16', borderWidth: 1, label: { content: '78.6% (110.7)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0)', color: '#84CC16', font: { size: 10 }}},
line7: { type: 'line', yMin: fibonacciData.low, yMax: fibonacciData.low, borderColor: '#7C3AED', borderWidth: 2, label: { content: '0.0% (100)', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0)', color: '#7C3AED', font: { size: 10 }}},
}
},
trend: {
title: 'Identificación de la Tendencia Inicial',
text: 'Para usar los retrocesos de Fibonacci, primero debes identificar un movimiento de precio significativo (impulsivo). En una tendencia alcista, se traza la herramienta desde un mínimo hasta un máximo. En el gráfico, se muestra un movimiento inicial desde un mínimo de 100 a un máximo de 150.',
annotations: {
trendLine: { type: 'line', xMin: 0, xMax: 10, yMin: 100, yMax: 150, borderColor: '#60a5fa', borderWidth: 3 }
}
},
retrace: {
title: 'La Zona de Retroceso',
text: 'Una vez que la tendencia inicial termina, el precio a menudo "retrocede" o se mueve en la dirección opuesta. La teoría de Fibonacci sugiere que el precio encontrará soporte en uno de los niveles clave antes de reanudar la tendencia original. En el gráfico interactivo, puedes ver el área donde el precio podría rebotar.',
annotations: {
trendLine: { type: 'line', xMin: 0, xMax: 10, yMin: 100, yMax: 150, borderColor: 'rgba(96, 165, 250, 0.3)', borderWidth: 3 },
retraceArea: { type: 'box', xMin: 10, xMax: 20, yMin: 119.1, yMax: 130.9, backgroundColor: 'rgba(244, 63, 94, 0.2)', borderColor: 'transparent', label: { content: 'Zona de Retroceso', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0)', color: '#F43F5E', font: { size: 10 } }}
}
}
};

const srHorizontalDescriptions = {
'support-horizontal': {
title: 'Nivel de Soporte',
text: 'Un soporte es un nivel de precio en el que la demanda es lo suficientemente fuerte como para detener o revertir una caída, actuando como un "piso" para el precio. En este gráfico, la línea verde representa el soporte horizontal.',
annotations: {
supportLine: { type: 'line', xMin: 0, xMax: 24, yMin: 100, yMax: 100, borderColor: 'rgb(34, 197, 94)', borderWidth: 2, label: { content: 'Soporte', enabled: true, position: 'start', backgroundColor: 'rgba(34, 197, 94, 0.7)', color: 'white', font: { size: 10 }, yAdjust: 10 }}
}
},
'resistance-horizontal': {
title: 'Nivel de Resistencia',
text: 'Una resistencia es un nivel de precio en el que la oferta es lo suficientemente fuerte como para detener o revertir un aumento de precio, actuando como un "techo". En este gráfico, la línea roja representa la resistencia horizontal.',
annotations: {
resistanceLine: { type: 'line', xMin: 0, xMax: 24, yMin: 125, yMax: 125, borderColor: 'rgb(239, 68, 68)', borderWidth: 2, label: { content: 'Resistencia', enabled: true, position: 'end', backgroundColor: 'rgba(239, 68, 68, 0.7)', color: 'white', font: { size: 10 }, yAdjust: -10 }}
}
}
};

const srTrendDescriptions = {
'trend-up-sr': {
title: 'Tendencia Alcista',
text: 'Una tendencia alcista se caracteriza por una serie de mínimos y máximos cada vez más altos. La línea de tendencia alcista se dibuja uniendo al menos dos mínimos crecientes y actúa como un soporte dinámico para el precio.',
annotations: {
trendLine: { type: 'line', xMin: 0, xMax: 24, yMin: 90, yMax: 140, borderColor: 'rgb(34, 197, 94)', borderWidth: 2, label: { content: 'Tendencia Alcista', enabled: true, position: 'start', backgroundColor: 'rgba(34, 197, 94, 0.7)', color: 'white', font: { size: 10 } } },
point1: { type: 'point', xValue: 0, yValue: 90, backgroundColor: 'rgb(34, 197, 94)', radius: 6, borderColor: 'white', borderWidth: 2},
point2: { type: 'point', xValue: 6, yValue: 115, backgroundColor: 'rgb(34, 197, 94)', radius: 6, borderColor: 'white', borderWidth: 2},
point3: { type: 'point', xValue: 10, yValue: 130, backgroundColor: 'rgb(34, 197, 94)', radius: 6, borderColor: 'white', borderWidth: 2}
}
},
'trend-down-sr': {
title: 'Tendencia Bajista',
text: 'Una tendencia bajista se caracteriza por una serie de máximos y mínimos cada vez más bajos. La línea de tendencia bajista se dibuja uniendo al menos dos máximos descendentes y actúa como una resistencia dinámica para el precio.',
annotations: {
trendLine: { type: 'line', xMin: 0, xMax: 24, yMin: 140, yMax: 90, borderColor: 'rgb(239, 68, 68)', borderWidth: 2, label: { content: 'Tendencia Bajista', enabled: true, position: 'end', backgroundColor: 'rgba(239, 68, 68, 0.7)', color: 'white', font: { size: 10 } } },
point1: { type: 'point', xValue: 0, yValue: 140, backgroundColor: 'rgb(239, 68, 68)', radius: 6, borderColor: 'white', borderWidth: 2},
point2: { type: 'point', xValue: 5, yValue: 125, backgroundColor: 'rgb(239, 68, 68)', radius: 6, borderColor: 'white', borderWidth: 2},
point3: { type: 'point', xValue: 9, yValue: 105, backgroundColor: 'rgb(239, 68, 68)', radius: 6, borderColor: 'white', borderWidth: 2}
}
}
};

const srHorizontalData = {
labels: Array.from({ length: 25 }, (_, i) => i + 1),
price: [105, 110, 108, 115, 118, 125, 122, 128, 125, 120, 115, 110, 105, 100, 105, 110, 115, 120, 115, 110, 105, 100, 105, 110, 108]
};

const srTrendData = {
labels: Array.from({ length: 25 }, (_, i) => i + 1),
price: [90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 130, 125, 120, 115, 110, 105, 100, 95, 90, 85, 90, 85, 80, 75, 80]
};

const reversalData = {
labels: Array.from({ length: 30 }, (_, i) => i + 1),
priceDoubleTop: [100, 105, 108, 105, 110, 107, 109, 106, 104, 98, 95, 92, 89, 86, 83, 80, 77, 74, 71, 68],
priceDoubleBottom: [80, 75, 72, 75, 71, 74, 70, 73, 76, 80, 83, 86, 89, 92, 95, 98, 101, 104, 107, 110]
};
const reversalDescriptions = {
'double-top': {
title: 'Patrón de Doble Techo',
text: 'El Doble Techo es un patrón de reversión bajista que se forma después de una tendencia alcista. Se caracteriza por dos máximos casi idénticos separados por un mínimo. La ruptura por debajo del nivel de "cuello" (el mínimo intermedio) confirma la reversión.',
annotations: {
peak1: { type: 'point', xValue: 4, yValue: 110, backgroundColor: 'rgb(239, 68, 68)', radius: 6, borderColor: 'white', borderWidth: 2 },
peak2: { type: 'point', xValue: 7, yValue: 109, backgroundColor: 'rgb(239, 68, 68)', radius: 6, borderColor: 'white', borderWidth: 2 },
neckline: { type: 'line', xMin: 0, xMax: 9, yMin: 104, yMax: 104, borderColor: '#60a5fa', borderWidth: 2 }
},
data: reversalData.priceDoubleTop
},
'double-bottom': {
title: 'Patrón de Doble Suelo',
text: 'El Doble Suelo es un patrón de reversión alcista que se forma después de una tendencia bajista. Se caracteriza por dos mínimos casi idénticos separados por un máximo. La ruptura por encima del nivel de "cuello" (el máximo intermedio) confirma la reversión.',
annotations: {
trough1: { type: 'point', xValue: 4, yValue: 71, backgroundColor: 'rgb(34, 197, 94)', radius: 6, borderColor: 'white', borderWidth: 2 },
trough2: { type: 'point', xValue: 7, yValue: 70, backgroundColor: 'rgb(34, 197, 94)', radius: 6, borderColor: 'white', borderWidth: 2 },
neckline: { type: 'line', xMin: 0, xMax: 9, yMin: 76, yMax: 76, borderColor: '#60a5fa', borderWidth: 2 }
},
data: reversalData.priceDoubleBottom
}
};

const channelSimulatorData = {
labels: Array.from({ length: 25 }, (_, i) => i + 1),
priceUp: [100, 102, 101, 104, 103, 106, 105, 108, 107, 110, 109, 112, 111, 114, 113, 116, 115, 118, 117, 120, 119, 122, 121, 124, 123],
priceDown: [120, 118, 119, 116, 117, 114, 115, 112, 113, 110, 111, 108, 109, 106, 107, 104, 105, 102, 103, 100, 101, 98, 99, 96, 97]
};

const initialReversalSimData = {
labels: Array.from({ length: 11 }, (_, i) => i + 1),
priceDoubleTop: [90, 95, 100, 97, 101, 98, 100.5, 96, 95, 96, 95.5],
priceDoubleBottom: [110, 105, 100, 103, 99, 102, 99.5, 104, 105, 104, 104.5]
};
        

const cupHandleAnatomyData = {
labels: Array.from({ length: 22 }, (_, i) => i + 1),
price: [100, 95, 91, 88, 86, 85, 85, 86, 88, 91, 95, 100, 98, 96, 97, 95, 98, 105, 108, 110, 109, 112],
volume: [150, 120, 110, 100, 90, 80, 85, 90, 100, 110, 130, 160, 100, 80, 85, 75, 90, 250, 220, 200, 180, 190]
};
        

const initialCupSimData = {
labels: Array.from({ length: 17 }, (_, i) => i + 1),
price: [100, 95, 91, 88, 86, 85, 85, 86, 88, 91, 95, 100, 98, 96, 97, 95, 98],
volume: [150, 120, 110, 100, 90, 80, 85, 90, 100, 110, 130, 160, 100, 80, 85, 75, 90]
};

const cupHandleDescriptions = {
cup: {
title: 'La Taza (The Cup)',
text: 'Una formación en "U" que representa una consolidación. El precio desciende y luego sube gradualmente, mostrando que los compradores absorben la venta. Idealmente, la profundidad de la taza no debería corregir más del 30% al 50% del impulso alcista previo.',
annotations: {
cupShape: {
type: 'box',
xMin: 1, xMax: 11, yMin: 85, yMax: 100,
backgroundColor: 'rgba(59, 130, 246, 0.1)',
borderColor: 'rgba(59, 130, 246, 0.5)',
borderWidth: 2,
borderDash: [6, 6]
}
}
},
handle: {
title: 'El Asa (The Handle)',
text: 'Una breve y ligera tendencia a la baja después de la taza. El volumen tiende a disminuir, indicando que la presión de venta se está agotando.',
annotations: {
handleShape: {
type: 'box',
xMin: 11, xMax: 16, yMin: 95, yMax: 100,
backgroundColor: 'rgba(239, 68, 68, 0.1)',
borderColor: 'rgba(239, 68, 68, 0.5)',
borderWidth: 2,
borderDash: [6, 6]
}
}
},
neckline: {
title: 'Línea de Resistencia (Neckline)',
text: 'Una línea horizontal trazada en los picos de la taza. El precio debe romper este nivel para que el patrón se confirme.',
annotations: {
neckline: {
type: 'line',
yMin: 100, yMax: 100,
borderColor: 'rgb(239, 68, 68)',
borderWidth: 2,
label: { content: 'Resistencia', enabled: true, position: 'start', backgroundColor: 'rgba(239, 68, 68, 0.7)', color: 'white', font: { size: 10 }, yAdjust: -10 }
}
}
},
breakout: {
title: 'La Ruptura (Breakout)',
text: 'Ocurre cuando el precio cierra decisivamente por encima de la línea de resistencia, idealmente con un aumento de volumen. Esto señala la continuación de la tendencia alcista.',
annotations: {
neckline: { type: 'line', yMin: 100, yMax: 100, borderColor: 'rgba(239, 68, 68, 0.3)', borderWidth: 2 },
breakoutArrow: { type: 'arrow', xMin: 16.5, xMax: 17.5, yMin: 100, yMax: 105, end: 'end', borderColor: '#a78bfa', borderWidth: 3 }
}
}
};

// --- Funciones para crear y gestionar los gráficos de cada estudio ---

function createCupHandleAnatomyChart() {
const ctx = document.getElementById('cupHandleAnatomyChart');
if (!ctx) return;
if (cupHandleAnatomyChartInstance) cupHandleAnatomyChartInstance.destroy();
cupHandleAnatomyChartInstance = new Chart(ctx.getContext('2d'), {
type: 'line',
data: {
labels: cupHandleAnatomyData.labels,
datasets: [{
label: 'Precio',
data: cupHandleAnatomyData.price,
borderColor: '#60a5fa',
tension: 0.4,
fill: false,
yAxisID: 'y'
}, {
label: 'Volumen',
data: cupHandleAnatomyData.volume,
type: 'bar',
backgroundColor: '#4b5563',
yAxisID: 'y1'
}]
},
options: {
...chartDefaultOptions,
scales: { ...chartDefaultOptions.scales, y: { ...chartDefaultOptions.scales.y, min: 80, max: 115 } },
}
});
}
        

function createAnatomyChart() {
const anatomyCtx = document.getElementById('anatomyChart');
if (!anatomyCtx) return;
const context = anatomyCtx.getContext('2d');
if (anatomyChartInstance) anatomyChartInstance.destroy();
anatomyChartInstance = new Chart(context, {
type: 'line',
data: {
labels: anatomyLabels,
datasets: [
{ label: 'Precio', data: anatomyPriceData, borderColor: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.1)', fill: true, tension: 0.1, yAxisID: 'y' },
{ label: 'Volumen', data: anatomyVolumeData, type: 'bar', backgroundColor: '#4b5563', yAxisID: 'y1' }
]
},
options: {
...chartDefaultOptions,
scales: { ...chartDefaultOptions.scales, y: { ...chartDefaultOptions.scales.y, min: 98, max: 116 } },
}
});
}

function createSimulatorChart() {
const simulatorCtx = document.getElementById('simulatorChart');
if (!simulatorCtx) return;
const context = simulatorCtx.getContext('2d');
if (simulatorChartInstance) simulatorChartInstance.destroy();
simulatorChartInstance = new Chart(context, {
type: 'line',
data: {
labels: [...initialSimData.labels],
datasets: [
{ label: 'Precio', data: [...initialSimData.price], borderColor: '#60a5fa', tension: 0.1, yAxisID: 'y' },
{ label: 'Volumen', data: [...initialSimData.volume], type: 'bar', backgroundColor: '#4b5563', yAxisID: 'y1' }
]
},
options: {
...chartDefaultOptions,
scales: { ...chartDefaultOptions.scales, y: { ...chartDefaultOptions.scales.y, min: 48, max: 58 } },
plugins: { ...chartDefaultOptions.plugins, annotation: { annotations: {
resistance: { type: 'line', xMin: 1, xMax: 14, yMin: 52, yMax: 50.45, borderColor: 'rgb(239, 68, 68)', borderWidth: 2 },
support: { type: 'line', xMin: 2, xMax: 14, yMin: 49, yMax: 50.45, borderColor: 'rgb(34, 197, 94)', borderWidth: 2 }
} } }
}
});
}

function createTrendChannelChart() {
const channelCtx = document.getElementById('trendChannelChart');
if (!channelCtx) return;
const context = channelCtx.getContext('2d');
if (trendChannelChartInstance) trendChannelChartInstance.destroy();
trendChannelChartInstance = new Chart(context, {
type: 'line',
data: {
labels: trendChannelData.labels,
datasets: [
{
label: 'Precio',
data: trendChannelData.priceUp,
borderColor: '#60a5fa',
fill: false,
tension: 0.1,
}
]
},
options: {
...chartDefaultOptions,
scales: {
...chartDefaultOptions.scales,
y: { ...chartDefaultOptions.scales.y, min: 5, max: 45 }
},
}
});
}

function createReversalChart() {
const reversalCtx = document.getElementById('reversalChart');
if (!reversalCtx) return;
const context = reversalCtx.getContext('2d');
if (reversalChartInstance) reversalChartInstance.destroy();
reversalChartInstance = new Chart(context, {
type: 'line',
data: {
labels: reversalData.labels,
datasets: [{
label: 'Precio',
data: reversalData.priceDoubleTop,
borderColor: '#60a5fa',
fill: false,
tension: 0.1,
yAxisID: 'y',
}]
},
options: {
...chartDefaultOptions,
scales: {
...chartDefaultOptions.scales,
y: { ...chartDefaultOptions.scales.y, min: 65, max: 115 }
},
}
});
}

function createFibonacciChart() {
const fibonacciCtx = document.getElementById('fibonacciChart');
if (!fibonacciCtx) return;
const context = fibonacciCtx.getContext('2d');
if (fibonacciChartInstance) fibonacciChartInstance.destroy();
fibonacciChartInstance = new Chart(context, {
type: 'line',
data: {
labels: fibonacciData.labels,
datasets: [{
label: 'Precio',
data: fibonacciData.price,
borderColor: '#60a5fa',
fill: false,
tension: 0.1,
yAxisID: 'y',
}]
},
options: {
...chartDefaultOptions,
scales: {
...chartDefaultOptions.scales,
y: { ...chartDefaultOptions.scales.y, min: 90, max: 160 }
},
}
});
}

function createSRChartHorizontal() {
const srCtx = document.getElementById('srChartHorizontal');
if (!srCtx) return;
const context = srCtx.getContext('2d');
if (srChartHorizontalInstance) srChartHorizontalInstance.destroy();
srChartHorizontalInstance = new Chart(context, {
type: 'line',
data: {
labels: srHorizontalData.labels,
datasets: [{
label: 'Precio',
data: srHorizontalData.price,
borderColor: '#60a5fa',
fill: false,
tension: 0.1,
yAxisID: 'y',
}]
},
options: {
...chartDefaultOptions,
scales: {
...chartDefaultOptions.scales,
y: { ...chartDefaultOptions.scales.y, min: 90, max: 140 }
},
}
});
}

function createSRChartTrend() {
const srCtx = document.getElementById('srChartTrend');
if (!srCtx) return;
const context = srCtx.getContext('2d');
if (srChartTrendInstance) srChartTrendInstance.destroy();
srChartTrendInstance = new Chart(context, {
type: 'line',
data: {
labels: srTrendData.labels,
datasets: [{
label: 'Precio',
data: srTrendData.price,
borderColor: '#60a5fa',
fill: false,
tension: 0.1,
yAxisID: 'y',
}]
},
options: {
...chartDefaultOptions,
scales: {
...chartDefaultOptions.scales,
y: { ...chartDefaultOptions.scales.y, min: 70, max: 150 }
},
}
});
}
        

function createChannelSimulatorChart() {
    const ctx = document.getElementById('channelSimulatorChart');
    if (!ctx) return;
    if (channelSimulatorChartInstance) channelSimulatorChartInstance.destroy();
    channelSimulatorChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: [...channelSimulatorData.labels],
            datasets: [{
                label: 'Precio',
                data: [...channelSimulatorData.priceUp],
                borderColor: '#60a5fa',
                tension: 0.1,
            }]
        },
        options: {
            ...chartDefaultOptions,
            scales: { ...chartDefaultOptions.scales, y: { ...chartDefaultOptions.scales.y, min: 90, max: 130 } },
        }
    });
}

        function createReversalSimulatorChart() {
            const ctx = document.getElementById('reversalSimulatorChart');
            if (!ctx) return;
            if (reversalSimulatorChartInstance) reversalSimulatorChartInstance.destroy();
            reversalSimulatorChartInstance = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: [...initialReversalSimData.labels],
                    datasets: [{
                        label: 'Precio',
                        data: [...initialReversalSimData.priceDoubleTop],
                        borderColor: '#60a5fa',
                        tension: 0.4,
                    }]
                },
                options: {
                    ...chartDefaultOptions,
                    scales: { ...chartDefaultOptions.scales, y: { ...chartDefaultOptions.scales.y, min: 85, max: 115 } },
                }
            });
        }

        function createCupHandleSimulatorChart() {
            const ctx = document.getElementById('cupHandleSimulatorChart');
            if (!ctx) return;
            if (cupHandleSimulatorChartInstance) cupHandleSimulatorChartInstance.destroy();
            cupHandleSimulatorChartInstance = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: [...initialCupSimData.labels],
                    datasets: [
                        { label: 'Precio', data: [...initialCupSimData.price], borderColor: '#60a5fa', tension: 0.4, yAxisID: 'y' },
                        { label: 'Volumen', data: [...initialCupSimData.volume], type: 'bar', backgroundColor: '#4b5563', yAxisID: 'y1' }
                    ]
                },
                options: {
                    ...chartDefaultOptions,
                    scales: { ...chartDefaultOptions.scales, y: { ...chartDefaultOptions.scales.y, min: 80, max: 120 } },
                    plugins: { ...chartDefaultOptions.plugins, annotation: { annotations: {
                        neckline: { type: 'line', yMin: 100, yMax: 100, borderColor: 'rgb(239, 68, 68)', borderWidth: 2 }
                    }}}
                }
            });
        }

        // --- Funciones de configuración para cada estudio ---

        function destroyAllCharts() {
            if (anatomyChartInstance) { anatomyChartInstance.destroy(); anatomyChartInstance = null; }
            if (simulatorChartInstance) { simulatorChartInstance.destroy(); simulatorChartInstance = null; }
            if (fibonacciChartInstance) { fibonacciChartInstance.destroy(); fibonacciChartInstance = null; }
            if (srChartHorizontalInstance) { srChartHorizontalInstance.destroy(); srChartHorizontalInstance = null; }
            if (srChartTrendInstance) { srChartTrendInstance.destroy(); srChartTrendInstance = null; }
            if (trendChannelChartInstance) { trendChannelChartInstance.destroy(); trendChannelChartInstance = null; }
            if (reversalChartInstance) { reversalChartInstance.destroy(); reversalChartInstance = null; }
            if (channelSimulatorChartInstance) { channelSimulatorChartInstance.destroy(); channelSimulatorChartInstance = null; }
            if (reversalSimulatorChartInstance) { reversalSimulatorChartInstance.destroy(); reversalSimulatorChartInstance = null; }
            if (cupHandleAnatomyChartInstance) { cupHandleAnatomyChartInstance.destroy(); cupHandleAnatomyChartInstance = null; }
            if (cupHandleSimulatorChartInstance) { cupHandleSimulatorChartInstance.destroy(); cupHandleSimulatorChartInstance = null; }
        }

        function destroyChartistCharts() {
            if (anatomyChartInstance) { anatomyChartInstance.destroy(); anatomyChartInstance = null; }
            if (simulatorChartInstance) { simulatorChartInstance.destroy(); simulatorChartInstance = null; }
            if (trendChannelChartInstance) { trendChannelChartInstance.destroy(); trendChannelChartInstance = null; }
            if (channelSimulatorChartInstance) { channelSimulatorChartInstance.destroy(); channelSimulatorChartInstance = null; }
            if (reversalChartInstance) { reversalChartInstance.destroy(); reversalChartInstance = null; }
            if (reversalSimulatorChartInstance) { reversalSimulatorChartInstance.destroy(); reversalSimulatorChartInstance = null; }
            if (cupHandleAnatomyChartInstance) { cupHandleAnatomyChartInstance.destroy(); cupHandleAnatomyChartInstance = null; }
            if (cupHandleSimulatorChartInstance) { cupHandleSimulatorChartInstance.destroy(); cupHandleSimulatorChartInstance = null; }
        }

        function updateDescription(el, desc) {
            el.classList.add('fade-out');
            setTimeout(() => {
                el.innerHTML = `<h3 class="font-bold text-white mb-2">${desc.title}</h3><p class="text-gray-300 text-sm">${desc.text}</p>`;
                el.classList.remove('fade-out');
            }, 300);
        }

        function setupInteractiveChart(chartInstance, buttonsElId, descriptionElId, descriptions) {
            const buttonsEl = document.getElementById(buttonsElId);
            const descriptionEl = document.getElementById(descriptionElId);
            if (!buttonsEl || !descriptionEl) return;

            const clickHandler = (e) => {
                const target = e.target.closest('button');
                if (target && !target.classList.contains('active')) {
                    const component = target.dataset.component;
                    buttonsEl.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                    target.classList.add('active');
                    const desc = descriptions[component];
                    updateDescription(descriptionEl, desc);
                    if (chartInstance) {
                        if (desc.data) {
                           chartInstance.data.datasets[0].data = desc.data;
                        }
                        chartInstance.options.plugins.annotation.annotations = desc.annotations || {};
                        chartInstance.update();
                    }
                }
            };
            buttonsEl.addEventListener('click', clickHandler);

            // Wait a moment for canvas to be ready before the initial click
            setTimeout(() => buttonsEl.querySelector('button')?.click(), 50);
        }


        function setupCupHandleStudy() {
            if (!document.getElementById('cupHandleAnatomyChart')) return;
            createCupHandleAnatomyChart();
            setupInteractiveChart(
                cupHandleAnatomyChartInstance,
                'cup-handle-anatomy-buttons',
                'cup-handle-anatomy-description',
                cupHandleDescriptions
            );
            setupCupHandleSimulator();
        }

        function setupSymmetricTriangleStudy() {
             if (!document.getElementById('anatomyChart')) return;
            createAnatomyChart();
            setupInteractiveChart(
                anatomyChartInstance,
                'anatomy-buttons',
                'anatomy-description',
                anatomyDescriptions
            );
            setupTriangleSimulator();
        }

        function setupTrendChannelStudy() {
            if (!document.getElementById('trendChannelChart')) return;
            createTrendChannelChart();
            setupInteractiveChart(
                trendChannelChartInstance,
                'trend-channel-buttons',
                'trend-channel-description',
                trendChannelDescriptions
            );
            setupChannelSimulator();
        }

        function setupReversalStudy() {
             if (!document.getElementById('reversalChart')) return;
            createReversalChart();
             setupInteractiveChart(
                reversalChartInstance,
                'reversal-buttons',
                'reversal-description',
                reversalDescriptions
            );
            setupReversalSimulator();
        }

        function setupFibonacciRetracementStudy() {
             if (!document.getElementById('fibonacciChart')) return;
            createFibonacciChart();
            setupInteractiveChart(
                fibonacciChartInstance,
                'fibonacci-buttons',
                'fibonacci-description',
                fibonacciDescriptions
            );
        }

        function setupSRStudy() {
            if (!document.getElementById('srChartHorizontal')) return;
            createSRChartHorizontal();
            createSRChartTrend();
            setupInteractiveChart(
                srChartHorizontalInstance,
                'sr-horizontal-buttons',
                'sr-horizontal-description',
                srHorizontalDescriptions
            );
            setupInteractiveChart(
                srChartTrendInstance,
                'sr-trend-buttons',
                'sr-trend-description',
                srTrendDescriptions
            );
        }

        // --- Implementaciones de Simuladores ---

        function setupTriangleSimulator() {
            createSimulatorChart();
            const steps = Array.from({length: 5}, (_, i) => document.getElementById(`step-${i + 1}`));
            const buttons = {
                breakout: document.getElementById('simulate-breakout'),
                stoploss: document.getElementById('show-stoploss'),
                target: document.getElementById('calculate-target'),
                reset: document.getElementById('reset-simulation'),
            };

            const updateUI = () => {
                steps[1].classList.toggle('opacity-50', simState.breakout);
                steps[2].classList.toggle('opacity-50', !simState.breakout);
                steps[3].classList.toggle('opacity-50', !simState.breakout || simState.stoploss);
                steps[4].classList.toggle('opacity-50', !simState.stoploss || simState.target);

                buttons.breakout.disabled = simState.breakout;
                buttons.stoploss.disabled = !simState.breakout || simState.stoploss;
                buttons.target.disabled = !simState.stoploss || simState.target;
            };

            const reset = () => {
                simState = { breakout: false, stoploss: false, target: false };
                createSimulatorChart();
                updateUI();
            };

            buttons.reset.addEventListener('click', reset);

            buttons.breakout.addEventListener('click', () => {
                if (simState.breakout) return;
                simState.breakout = true;
                const chart = simulatorChartInstance;
                chart.data.labels.push(16, 17, 18, 19);
                chart.data.datasets[0].data.push(52, 53.5, 54, 55); // Modificado para una ruptura tendencial
                chart.data.datasets[1].data.push(150, 180, 200, 190); // Aumento de volumen en la ruptura
                chart.options.plugins.annotation.annotations.entry = { type: 'point', xValue: 15, yValue: 52, backgroundColor: 'rgba(34, 197, 94, 0.8)', radius: 6 };
                chart.update();
                updateUI();
            });

            buttons.stoploss.addEventListener('click', () => {
                if (!simState.breakout || simState.stoploss) return;
                simState.stoploss = true;
                const chart = simulatorChartInstance;
                chart.options.plugins.annotation.annotations.stoploss = { type: 'line', yMin: 48.8, yMax: 48.8, borderColor: 'rgb(239, 68, 68)', borderWidth: 2, borderDash: [6, 6] };
                chart.update();
                updateUI();
            });

            buttons.target.addEventListener('click', () => {
                if (!simState.stoploss || simState.target) return;
                simState.target = true;
                const chart = simulatorChartInstance;
                const annotations = chart.options.plugins.annotation.annotations;

                const breakoutPrice = 50.45;
                const triangleHigh = 52;
                const triangleLow = 49;
                const triangleHeight = triangleHigh - triangleLow;
                const targetPrice = breakoutPrice + triangleHeight;

                // Añadir la línea que mide la altura en la base del triángulo
                annotations.heightMeasure = {
                    type: 'line',
                    xMin: 2,
                    xMax: 2,
                    yMin: triangleLow,
                    yMax: triangleHigh,
                    borderColor: '#a78bfa', // light purple
                    borderWidth: 2,
                    borderDash: [6, 6],
                    label: { content: 'Altura', enabled: true, position: 'start', backgroundColor: 'rgba(0,0,0,0.5)', color: '#a78bfa', font: {size: 10}}
                };

                // Añadir la proyección de la altura desde el punto de ruptura
                annotations.heightProjection = {
                    type: 'line',
                    xMin: 16,
                    xMax: 16,
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

                chart.options.scales.y.max = targetPrice + 2;
                chart.update();
                updateUI();
            });

            reset();
        }

        function setupChannelSimulator() {
            createChannelSimulatorChart();
            const buttons = {
                toggle: document.getElementById('toggle-channel-type'),
                trade: document.getElementById('simulate-channel-trade'),
                reset: document.getElementById('reset-channel-simulation'),
            };

            const reset = () => {
                channelSimState = { type: 'up', traded: false };
                createChannelSimulatorChart();
                channelSimulatorChartInstance.data.datasets[0].data = [...channelSimulatorData.priceUp];
                channelSimulatorChartInstance.options.plugins.annotation.annotations = {
                    support: { type: 'line', xMin: 0, xMax: 24, yMin: 100, yMax: 123, borderColor: 'rgb(34, 197, 94)' },
                    resistance: { type: 'line', xMin: 0, xMax: 24, yMin: 102, yMax: 125, borderColor: 'rgb(239, 68, 68)' }
                };
                channelSimulatorChartInstance.update();
                buttons.toggle.textContent = 'Alternar a Canal Bajista';
                buttons.trade.disabled = false;
            };

            buttons.reset.addEventListener('click', reset);

            buttons.toggle.addEventListener('click', () => {
                channelSimState.type = (channelSimState.type === 'up') ? 'down' : 'up';
                const isUp = channelSimState.type === 'up';
                buttons.toggle.textContent = isUp ? 'Alternar a Canal Bajista' : 'Alternar a Canal Alcista';
                const chart = channelSimulatorChartInstance;
                chart.data.datasets[0].data = isUp ? [...channelSimulatorData.priceUp] : [...channelSimulatorData.priceDown];
                chart.options.plugins.annotation.annotations = isUp ? {
                    support: { type: 'line', xMin: 0, xMax: 24, yMin: 100, yMax: 123, borderColor: 'rgb(34, 197, 94)' },
                    resistance: { type: 'line', xMin: 0, xMax: 24, yMin: 102, yMax: 125, borderColor: 'rgb(239, 68, 68)' }
                } : {
                    support: { type: 'line', xMin: 0, xMax: 24, yMin: 118, yMax: 95, borderColor: 'rgb(34, 197, 94)' },
                    resistance: { type: 'line', xMin: 0, xMax: 24, yMin: 120, yMax: 97, borderColor: 'rgb(239, 68, 68)' }
                };
                chart.update();
            });

            buttons.trade.addEventListener('click', () => {
                if (channelSimState.traded) return;
                channelSimState.traded = true;
                const chart = channelSimulatorChartInstance;
                const annotations = chart.options.plugins.annotation.annotations;
                if (channelSimState.type === 'up') {
                    annotations.buy = {type: 'point', xValue: 24, yValue: 123, backgroundColor: 'green', radius: 6};
                    annotations.profit = {type: 'point', xValue: 28, yValue: 129, backgroundColor: 'blue', radius: 6};
                    chart.data.labels.push(26,27,28,29);
                    chart.data.datasets[0].data.push(125,127,128,129);
                } else {
                    annotations.sell = {type: 'point', xValue: 24, yValue: 97, backgroundColor: 'red', radius: 6};
                    annotations.profit = {type: 'point', xValue: 28, yValue: 91, backgroundColor: 'blue', radius: 6};
                    chart.data.labels.push(26,27,28,29);
                    chart.data.datasets[0].data.push(95,93,92,91);
                }
                chart.update();
                buttons.trade.disabled = true;
            });

            reset();
        }

        function setupReversalSimulator() {
            createReversalSimulatorChart();
            const steps = Array.from({length: 4}, (_, i) => document.getElementById(`reversal-step-${i + 1}`));
            const step1Text = document.querySelector('#reversal-step-1 p.text-sm');
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

                 buttons.breakout.disabled = reversalSimState.breakout;
                 buttons.stoploss.disabled = !reversalSimState.breakout || reversalSimState.stoploss;
                 buttons.target.disabled = !reversalSimState.stoploss || reversalSimState.target;
            };

            const reset = () => {
                reversalSimState = { type: 'top', breakout: false, stoploss: false, target: false };
                createReversalSimulatorChart();
                reversalSimulatorChartInstance.data.datasets[0].data = [...initialReversalSimData.priceDoubleTop];
                reversalSimulatorChartInstance.options.plugins.annotation.annotations = { neckline: { type: 'line', yMin: 96, yMax: 96, borderColor: '#60a5fa' } };
                reversalSimulatorChartInstance.update();
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
                chart.data.datasets[0].data = isTop ? [...initialReversalSimData.priceDoubleTop] : [...initialReversalSimData.priceDoubleBottom];
                chart.options.plugins.annotation.annotations = { neckline: { type: 'line', yMin: isTop ? 96 : 104, yMax: isTop ? 96 : 104, borderColor: '#60a5fa' } };
                chart.update();
            });

            buttons.breakout.addEventListener('click', () => {
                if (reversalSimState.breakout) return;
                reversalSimState.breakout = true;
                const chart = reversalSimulatorChartInstance;
                const isTop = reversalSimState.type === 'top';
                chart.data.labels.push(12, 13);
                chart.data.datasets[0].data.push(isTop ? 94 : 106, isTop ? 92 : 108);
                chart.options.plugins.annotation.annotations.entry = { type: 'point', xValue: 11, yValue: isTop ? 94 : 106, backgroundColor: isTop ? 'red' : 'green', radius: 6 };
                chart.update();
                updateUI();
            });

            buttons.stoploss.addEventListener('click', () => {
                if (!reversalSimState.breakout || reversalSimState.stoploss) return;
                reversalSimState.stoploss = true;
                const chart = reversalSimulatorChartInstance;
                const isTop = reversalSimState.type === 'top';
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
                    xMin: 4, // Posición del primer pico/suelo
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
                    xMin: 11, // Punto de ruptura
                    xMax: 11,
                    yMin: necklinePrice,
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

                chart.options.scales.y.min = isTop ? targetPrice - 5 : chart.options.scales.y.min;
                chart.options.scales.y.max = isTop ? chart.options.scales.y.max : targetPrice + 5;
                chart.update();
                updateUI();
            });

            reset();
        }

        function setupCupHandleSimulator() {
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
                createCupHandleSimulatorChart();
                updateUI();
            };

            buttons.reset.addEventListener('click', reset);

            buttons.breakout.addEventListener('click', () => {
                if (cupHandleSimState.breakout) return;
                cupHandleSimState.breakout = true;
                const chart = cupHandleSimulatorChartInstance;
                chart.data.labels.push(18, 19);
                chart.data.datasets[0].data.push(105, 108);
                chart.data.datasets[1].data.push(280, 250);
                chart.options.plugins.annotation.annotations.entry = { type: 'point', xValue: 18, yValue: 105, backgroundColor: 'rgba(34, 197, 94, 0.8)', radius: 6 };
                chart.update();
                updateUI();
            });

            buttons.stoploss.addEventListener('click', () => {
                if (!cupHandleSimState.breakout || cupHandleSimState.stoploss) return;
                cupHandleSimState.stoploss = true;
                const chart = cupHandleSimulatorChartInstance;
                const handleLow = Math.min(...initialCupSimData.price.slice(11));
                chart.options.plugins.annotation.annotations.stoploss = { type: 'line', yMin: handleLow - 1, yMax: handleLow - 1, borderColor: 'rgb(239, 68, 68)', borderDash: [6,6]};
                chart.update();
                updateUI();
            });

            buttons.target.addEventListener('click', () => {
                if (!cupHandleSimState.stoploss || cupHandleSimState.target) return;
                cupHandleSimState.target = true;
                const chart = cupHandleSimulatorChartInstance;
                const annotations = chart.options.plugins.annotation.annotations;
                const cupHigh = 100;
                const cupLow = 85;
                const cupDepth = cupHigh - cupLow;
                const breakoutPrice = 100;
                const targetPrice = breakoutPrice + cupDepth;

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

        // --- Navegación Principal de Educación ---
        function setupEducationNavigation() {
            const studies = {
                'what-is-ta': { btn: document.getElementById('show-what-is-ta'), content: document.getElementById('what-is-ta-study'), init: () => {} },
                'chartist-patterns': { btn: document.getElementById('show-chartist-patterns'), content: document.getElementById('chartist-patterns-study'), init: setupChartistPatternNavigation },
                'sr': { btn: document.getElementById('show-sr-study'), content: document.getElementById('sr-study'), init: setupSRStudy },
                'fibonacci': { btn: document.getElementById('show-fibonacci-study'), content: document.getElementById('fibonacci-study'), init: setupFibonacciRetracementStudy }
            };

            let currentStudyKey = null;

            const switchStudy = (newKey) => {
                if (!studies[newKey] || newKey === currentStudyKey) return; 

                if (currentStudyKey && studies[currentStudyKey]) {
                    destroyAllCharts(); // Clean up before switching
                    studies[currentStudyKey].btn?.classList.remove('active');
                    studies[currentStudyKey].content?.classList.add('hidden');
                }

                studies[newKey].btn?.classList.add('active');
                studies[newKey].content?.classList.remove('hidden');

                // Use requestAnimationFrame to ensure the DOM is ready for the canvas to be found.
                requestAnimationFrame(() => {
                    studies[newKey].init();
                });

                currentStudyKey = newKey;
            };

            Object.keys(studies).forEach(key => {
                studies[key].btn?.addEventListener('click', () => switchStudy(key));
            });

            switchStudy('what-is-ta'); 
        }

        function setupChartistPatternNavigation() {
            const patterns = {
                'symmetric-triangle': { btn: document.getElementById('show-symmetric-triangle'), content: document.getElementById('symmetric-triangle-study-content'), init: setupSymmetricTriangleStudy },
                'trend-channels': { btn: document.getElementById('show-trend-channels'), content: document.getElementById('trend-channels-study-content'), init: setupTrendChannelStudy },
                'reversal-patterns': { btn: document.getElementById('show-reversal-patterns'), content: document.getElementById('reversal-patterns-study-content'), init: setupReversalStudy },
                'cup-handle': { btn: document.getElementById('show-cup-handle'), content: document.getElementById('cup-handle-study-content'), init: setupCupHandleStudy },
            };
            let currentPatternKey = null;

            const switchPattern = (newKey) => {
                 if (!patterns[newKey] || currentPatternKey === newKey) return;

                 if(currentPatternKey && patterns[currentPatternKey]){
                    destroyChartistCharts(); // Destroy only the charts in this section
                    patterns[currentPatternKey].btn?.classList.remove('active');
                    patterns[currentPatternKey].content?.classList.add('hidden');
                 }
                 patterns[newKey].btn?.classList.add('active');
                 patterns[newKey].content?.classList.remove('hidden');

                 requestAnimationFrame(() => {
                    patterns[newKey].init();
                 });

                 currentPatternKey = newKey;
            };

            Object.keys(patterns).forEach(key => {
                 patterns[key].btn?.addEventListener('click', () => switchPattern(key));
            });

            // Initialize the first pattern
            if (document.getElementById('symmetric-triangle-study-content')) {
                 switchPattern('symmetric-triangle');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const homePage = document.getElementById('home-page');
            const toolsPageContainer = document.getElementById('tools-page-container');
            const toolsContentContainer = document.getElementById('tools-content-container');
            const homeCardsGrid = document.getElementById('home-cards-grid');
            const homeIconBar = document.getElementById('home-icon-bar');
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const closeMobileMenuButton = document.getElementById('close-mobile-menu');
            const mobileNavLinksContainer = document.getElementById('mobile-nav-links');

            const tools = [
                { id: 'panorama-market-page', title: 'Panorama', description: 'Un vistazo general a los principales mercados y activos.', icon: `<img src="https://github.com/amolinad22/foco-bursatil-web/blob/main/images/panorama.jpeg?raw=true" alt="Icono de Panorama del Mercado" class="w-full h-full object-cover">` },
                { id: 'analisis-tecnico-page', title: 'Análisis Técnico', description: 'Herramientas visuales para analizar la acción del precio.', icon: `<img src="https://github.com/amolinad22/foco-bursatil-web/blob/main/images/analisis-tecnico.jpeg?raw=true" alt="Icono de Análisis Técnico" class="w-full h-full object-cover">` },
                { id: 'chile-market-page', title: 'Chile', description: 'Sigue de cerca el S&P IPSA y las acciones locales.', icon: `<img src="https://flagcdn.com/cl.svg" alt="Bandera de Chile" class="w-full h-full object-contain p-2">` },
                { id: 'usa-market-page', title: 'USA', description: 'Analiza los gigantes de Wall Street con nuestro mapa de calor.', icon: `<img src="https://flagcdn.com/us.svg" alt="Bandera de EE.UU." class="w-full h-full object-contain p-2">` },
                { id: 'crypto-page', title: 'Criptomonedas', description: 'Explora el mercado de criptomonedas con nuestro mapa de calor.', icon: `<img src="https://github.com/amolinad22/foco-bursatil-web/blob/main/images/criptomonedas.jpeg?raw=true" alt="Icono de Criptomonedas" class="w-full h-full object-cover">` },
                { id: 'noticias-page', title: 'Noticias', description: 'Las últimas noticias que mueven los mercados.', icon: `<img src="https://github.com/amolinad22/foco-bursatil-web/blob/main/images/noticias.jpeg?raw=true" alt="Icono de Noticias" class="w-full h-full object-cover">` },
                { id: 'calendario-page', title: 'Calendario', description: 'Anticípate a los eventos económicos clave.', icon: `<img src="https://github.com/amolinad22/foco-bursatil-web/blob/main/images/calendario.jpeg?raw=true" alt="Icono de Calendario" class="w-full h-full object-cover">` },
                { id: 'educacion-page', title: 'Educación', description: 'Aprende los conceptos clave para invertir con confianza.', icon: `<img src="https://github.com/amolinad22/foco-bursatil-web/blob/main/images/educacion.jpeg?raw=true" alt="Icono de Educación" class="w-full h-full object-cover">` },
                { id: 'contacto-page', title: 'Contacto', description: '¿Tienes dudas o sugerencias? Háznoslo saber.', icon: `<img src="https://github.com/amolinad22/foco-bursatil-web/blob/main/images/contacto.jpeg?raw=true" alt="Icono de Contacto" class="w-full h-full object-cover">` },
            ];

            const loadedWidgets = new Set();

            function createInitialUI() {
                tools.forEach((tool) => {
                    const card = document.createElement('div');
                    card.className = 'group bg-[#161B22] border border-gray-700 rounded-xl p-8 flex flex-col items-center text-center transform hover:-translate-y-2 transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10';
                    card.innerHTML = `<div class="h-16 w-16 mb-6 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-110 bg-gray-800 flex items-center justify-center">${tool.icon}</div><h3 class="text-xl font-semibold text-white mb-2">${tool.title}</h3><p class="text-gray-400 mb-6 flex-grow">${tool.description}</p><button data-page="${tool.id}" class="home-card-btn w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300">Ver Sección</button>`;
                    homeCardsGrid.appendChild(card);

                    const mobileLink = document.createElement('a');
                    mobileLink.href = '#';
                    mobileLink.className = 'mobile-nav-link text-gray-300 hover:text-white transition-colors py-2';
                    mobileLink.textContent = tool.title;
                    mobileLink.dataset.page = tool.id;
                    mobileNavLinksContainer.appendChild(mobileLink);
                });

                const createTickerIcon = (tool) => {
                    const iconLink = document.createElement('a');
                    iconLink.href = '#';
                    iconLink.className = 'home-icon-link flex flex-row items-center gap-2 group';
                    iconLink.dataset.page = tool.id;
                    iconLink.innerHTML = `
                        <div class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 flex-shrink-0 bg-gray-800 border-2 border-transparent group-hover:border-blue-500">
                           ${tool.icon}
                        </div>
                        <span class="text-xs text-gray-400 group-hover:text-white transition-colors whitespace-nowrap">${tool.title}</span>
                    `;
                    return iconLink;
                };

                tools.forEach(tool => homeIconBar.appendChild(createTickerIcon(tool)));
                tools.forEach(tool => homeIconBar.appendChild(createTickerIcon(tool)));
            }

            function showToolsPage(pageId) {
                homePage.style.display = 'none';
                toolsPageContainer.style.display = 'block';
                showToolContent(pageId);
            }

            function showToolContent(pageId) {
                const template = document.getElementById(`template-${pageId}`);
                if (!template) return;

                toolsContentContainer.innerHTML = `<div class="flex justify-center items-center h-64"><span class="loader"></span></div>`;

                setTimeout(() => {
                    if (document.querySelector(`#template-${pageId}`)) {
                        toolsContentContainer.innerHTML = template.innerHTML;
                        loadWidgetsForContent(pageId);
                        if (pageId === 'gracias-page') {
                            document.getElementById('back-to-home-from-thanks').addEventListener('click', (e) => {
                                e.preventDefault();
                                window.location.hash = ''; // Clear the hash
                                // Use replaceState to clean the URL without reloading
                                history.replaceState(null, null, window.location.pathname);
                                returnToHome(false); // Return home without fade
                            });
                        }
                    }
                }, 500); 

                document.querySelectorAll('.home-icon-link').forEach(link => {
                    link.classList.toggle('active', link.dataset.page === pageId);
                });

                window.scrollTo(0, 0);
            }

            function openMobileMenu() { mobileMenu.classList.remove('translate-x-full'); }
            function closeMobileMenu() { mobileMenu.classList.add('translate-x-full'); }

            function loadWidgetsForContent(pageId) {
                if (pageId === 'educacion-page') {
                    setupEducationNavigation();
                }

                const widgetContainers = toolsContentContainer.querySelectorAll('.tradingview-widget-container__widget');
                widgetContainers.forEach(container => {
                    const widgetType = container.dataset.widgetType;
                    const widgetKey = `${pageId}-${widgetType}`;

                    if (loadedWidgets.has(widgetKey)) return;

                    let config = {};
                    let scriptSrc = '';

                    switch(widgetType) {
                        case 'market-overview':
                            scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
                            config = { "colorTheme": "dark", "dateRange": "12M", "locale": "es", "largeChartUrl": "", "isTransparent": false, "showFloatingTooltip": true, "plotLineColorGrowing": "rgba(41, 98, 255, 1)", "plotLineColorFalling": "rgba(41, 98, 255, 1)", "gridLineColor": "rgba(240, 243, 250, 0)", "scaleFontColor": "#DBDBDB", "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)", "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)", "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)", "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)", "symbolActiveColor": "rgba(41, 98, 255, 0.12)", "tabs": [ { "title": "INDICES", "symbols": [ {"s": "CAPITALCOM:US500", "d": "S&P 500"}, {"s": "CAPITALCOM:US100", "d": "NASDAQ 100"}, {"s": "CAPITALCOM:US30", "d": "DOW JONES 30"}, {"s": "XETR:DAX", "d": "DAX"}, {"s": "BCS:SP_IPSA", "d": "IPSA"}, {"s": "BMFBOVESPA:IBOV", "d": "BOVESPA"}, {"s": "BCBA:IMV", "d": "MERVAL"} ], "originalTitle": "Indices" }, { "title": "COMMODITIES", "symbols": [ {"s": "CMCMARKETS:GOLD", "d": "ORO"}, {"s": "PYTH:WTI3!", "d": "PETROLEO"}, {"s": "CAPITALCOM:COPPER", "d": "COBRE"}, {"s": "CAPITALCOM:SILVER", "d": "PLATA"}, {"s": "CAPITALCOM:NATURALGAS", "d": "GAS NATURAL"} ], "originalTitle": "Futures" }, { "title": "DIVISAS", "symbols": [ {"s": "FX_IDC:USDCLP", "d": "USDCLP"}, {"s": "FX:EURUSD", "d": "EURUSD"}, {"s": "FX:USDJPY", "d": "USDJPY"}, {"s": "FX:GBPUSD", "d": "GBPUSD"}, {"s": "FX:USDCHF", "d": "USDCHF"} ], "originalTitle": "Forex" }, { "title": "CRIPTOMONEDAS", "symbols": [ {"s": "COINBASE:BTCUSD", "d": "BTCUSD"}, {"s": "COINBASE:ETHUSD", "d": "ETHUSD"}, {"s": "COINBASE:XRPUSD", "d": "XRPUSD"}, {"s": "CRYPTOCAP:TOTAL", "d": "Crypto Total Market Cap"} ] } ], "width": "100%", "height": "100%", "showSymbolLogo": true, "showChart": true };
                            break;
                        case 'advanced-chart':
                            scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
                            config = { "autosize": true, "symbol": "BCS:SP_IPSA", "interval": "D", "timezone": "America/Santiago", "theme": "dark", "style": "1", "locale": "es", "allow_symbol_change": true, "calendar": true, "details": true, "hotlist": true, "hide_side_toolbar": false, "studies": ["Volume@tv-basicstudies", "RSI@tv-basicstudies"] };
                            break;
                        case 'heatmap-cl':
                            scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
                            config = { "dataSource": "BCSSPIPSA", "blockSize": "market_cap_basic", "blockColor": "change", "grouping": "sector", "locale": "es", "symbolUrl": "", "colorTheme": "dark", "exchanges": [], "hasTopBar": true, "isDataSetEnabled": true, "isZoomEnabled": true, "hasSymbolTooltip": true, "isMonoSize": false, "width": "100%", "height": "100%" };
                            break;
                        case 'hotlists-cl':
                            scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js';
                            config = { "exchange": "BCS", "colorTheme": "dark", "dateRange": "12M", "showChart": true, "locale": "es", "isTransparent": true, "width": "100%", "height": "100%" };
                            break;
                        case 'heatmap-us':
                            scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
                            config = { "dataSource": "SPX500", "blockSize": "market_cap_basic", "blockColor": "change", "grouping": "sector", "locale": "es", "symbolUrl": "", "colorTheme": "dark", "exchanges": [], "hasTopBar": true, "isDataSetEnabled": true, "isZoomEnabled": true, "hasSymbolTooltip": true, "isMonoSize": false, "width": "100%", "height": "100%" };
                            break;
                        case 'hotlists-us':
                            scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js';
                            config = { "exchange": "US", "colorTheme": "dark", "dateRange": "12M", "showChart": true, "locale": "es", "isTransparent": true, "width": "100%", "height": "100%" };
                            break;
                        case 'timeline':
                            scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
                            config = { "feedMode": "all_symbols", "colorTheme": "dark", "isTransparent": true, "displayMode": "regular", "width": "100%", "height": "100%", "locale": "es" };
                            break;
                        case 'economic-calendar':
                            scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
                            config = { "colorTheme": "dark", "isTransparent": false, "locale": "es", "countryFilter": "", "importanceFilter": "0,1", "width": "100%", "height": "100%" };
                            break;
                        case 'crypto-coins-heatmap':
                            scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js';
                            config = { "dataSource": "Crypto", "blockSize": "market_cap_calc", "blockColor": "24h_close_change|5", "locale": "es", "symbolUrl": "", "colorTheme": "dark", "hasTopBar": true, "isDataSetEnabled": true, "isZoomEnabled": true, "hasSymbolTooltip": true, "isMonoSize": false, "width": "100%", "height": "100%" };
                            break;
                        case 'crypto-screener':
                            scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
                            config = { "defaultColumn": "overview", "screener_type": "crypto_mkt", "displayCurrency": "USD", "colorTheme": "dark", "isTransparent": false, "locale": "es", "width": "100%", "height": "100%" };
                            break;
                    }

                    if (scriptSrc) {
                        const script = document.createElement('script');
                        script.src = scriptSrc;
                        script.async = true;
                        script.innerHTML = JSON.stringify(config);
                        container.innerHTML = ''; 
                        container.appendChild(script);
                        loadedWidgets.add(widgetKey);
                    }
                });
            }

            createInitialUI();

            function returnToHome(useFade = true) {
                if (useFade) {
                    toolsPageContainer.classList.add('fade-out');
                    setTimeout(() => {
                        toolsPageContainer.style.display = 'none';
                        toolsPageContainer.classList.remove('fade-out');
                        homePage.style.display = 'block';
                        homePage.classList.add('fade-in');
                        document.querySelectorAll('.home-icon-link').forEach(link => {
                            link.classList.remove('active');
                        });
                    }, 300);
                } else {
                    toolsPageContainer.style.display = 'none';
                    homePage.style.display = 'block';
                    document.querySelectorAll('.home-icon-link').forEach(link => {
                        link.classList.remove('active');
                    });
                }
                window.scrollTo(0, 0);
            }

            document.body.addEventListener('click', (e) => {
                const target = e.target.closest('.home-card-btn, .mobile-nav-link, .home-icon-link');
                if (target) {
                    e.preventDefault();
                    const pageId = target.dataset.page;
                    showToolsPage(pageId);
                    closeMobileMenu();
                }
            });

            document.getElementById('logo-link').addEventListener('click', (e) => {
                e.preventDefault();
                returnToHome();
            });
            document.getElementById('back-to-home-btn').addEventListener('click', (e) => {
                e.preventDefault();
                returnToHome();
            });

             // Check for form success on page load
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('form') === 'success') {
                showToolsPage('gracias-page');
            }

            mobileMenuButton.addEventListener('click', openMobileMenu);
            closeMobileMenuButton.addEventListener('click', closeMobileMenu);

            const canvas = document.getElementById('particle-canvas');
            const ctx = canvas.getContext('2d');
            let particles = [];

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            function createParticles() {
                particles = [];
                let numberOfParticles = (canvas.height * canvas.width) / 9000;
                for(let i = 0; i < numberOfParticles; i++) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        vx: Math.random() * 0.5 - 0.25,
                        vy: Math.random() * 0.5 - 0.25,
                        radius: Math.random() * 1.5
                    });
                }
            }

            function drawParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            function updateParticles() {
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                });
            }

            function animate() {
                drawParticles();
                updateParticles();
                requestAnimationFrame(animate);
            }

            window.addEventListener('resize', () => {
                resizeCanvas();
                createParticles();
            });

            resizeCanvas();
            createParticles();
            animate();

        });
