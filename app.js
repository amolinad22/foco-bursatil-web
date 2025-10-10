// --- CONFIGURACIÓN DE DATOS GLOBALES ---

// Mapeo de herramientas de la aplicación
const TOOLS = {
    // Widgets de TradingView
    'panorama-market': { title: 'Panorama de Mercado', icon: 'zap', templateId: 'template-panorama-market-page', widgetType: 'market-overview', description: 'Visión general de índices, divisas y commodities globales.' },
    'analisis-tecnico': { title: 'Análisis Técnico', icon: 'bar-chart-3', templateId: 'template-analisis-tecnico-page', widgetType: 'advanced-chart', description: 'Gráficos avanzados para aplicar estrategias e indicadores.' },
    'chile-market': { title: 'Mercado Chileno (IPSA)', icon: 'flag', templateId: 'template-chile-market-page', widgetType: ['heatmap-cl', 'hotlists-cl'], description: 'Mapa de calor y análisis de las principales acciones IPSA.' },
    'usa-market': { title: 'Mercado USA (S&P 500)', icon: 'globe', templateId: 'template-usa-market-page', widgetType: ['heatmap-us', 'hotlists-us'], description: 'Seguimiento del S&P 500 y las acciones de mayor movimiento.' },
    'crypto': { title: 'Criptomonedas', icon: 'bitcoin', templateId: 'template-crypto-page', widgetType: ['crypto-coins-heatmap', 'crypto-screener'], description: 'Capitalización, rendimiento y screener del universo crypto.' },
    'noticias': { title: 'Noticias Globales', icon: 'newspaper', templateId: 'template-noticias-page', widgetType: 'timeline', description: 'Noticias económicas y financieras que impactan los mercados.' },
    'calendario': { title: 'Calendario Económico', icon: 'calendar', templateId: 'template-calendario-page', widgetType: 'economic-calendar', description: 'Eventos clave, anuncios y datos macroeconómicos.' },
    // Módulos de Contenido
    'educacion': { title: 'Educación y Estudios', icon: 'book-open', templateId: 'template-educacion-page', description: 'Módulos interactivos para aprender conceptos de AT.', module: './chartistPatterns.js' },
    'contacto': { title: 'Contacto', icon: 'mail', templateId: 'template-contacto-page', description: 'Envíanos tus dudas y sugerencias.' },
};

// --- IMPORTACIÓN DEL MÓDULO DE GRÁFICOS INTERACTIVOS (EDUCACIÓN) ---

let chartPatternsModule = null;
const loadChartPatternsModule = async () => {
    if (!chartPatternsModule) {
        try {
            // Importa dinámicamente el módulo para la página de educación
            chartPatternsModule = await import('./chartistPatterns.js');
        } catch (error) {
            console.error("Error al cargar el módulo chartistPatterns.js:", error);
        }
    }
};

// --- ESTADO Y UTILERÍAS ---

// Función de utilidad para crear elementos con clases
const createElement = (tag, classes = [], content = '') => {
    const el = document.createElement(tag);
    if (classes.length) el.className = classes.join(' ');
    if (content) el.innerHTML = content;
    return el;
};

// Mapa para almacenar instancias de TradingView para evitar recarga
const tradingViewInstances = new Map();

// --- LÓGICA DE TRADINGVIEW WIDGETS ---

// Función que inicializa los widgets de TradingView en un contenedor específico
const initializeTradingViewWidgets = (container) => {
    // Script de TradingView (solo se necesita importar una vez, pero lo inyectamos si no existe)
    if (!document.getElementById('tradingview-script')) {
        const script = document.createElement('script');
        script.id = 'tradingview-script';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-constructor.js?v=2024-10-10';
        script.async = true;
        document.body.appendChild(script);
    }
    
    // Encuentra todos los contenedores de widgets de TradingView en el DOM del contenido cargado
    const widgetContainers = container.querySelectorAll('.tradingview-widget-container__widget');
    
    widgetContainers.forEach((widgetElement) => {
        const widgetType = widgetElement.dataset.widgetType;
        if (tradingViewInstances.has(widgetType)) {
             // Si el widget ya fue cargado, no hacemos nada o limpiamos si es necesario.
             return; 
        }

        const containerId = `tv-container-${widgetType}-${Date.now()}`;
        widgetElement.id = containerId;
        
        let widgetConfig = {};

        // 1. Configuración general
        const baseConfig = {
            "width": "100%",
            "height": "100%",
            "locale": "es_LA",
            "is*/darkMode": true, // Asumimos modo oscuro
            "colorTheme": "dark",
            "autosize": true,
            "container_id": containerId,
        };

        // 2. Configuración específica por tipo de widget
        switch (widgetType) {
            case 'market-overview':
                widgetConfig = {
                    ...baseConfig,
                    "symbols": [
                        ["S&P 500", "SPX"],
                        ["NASDAQ 100", "NDX"],
                        ["Índice Dólar", "DXY"],
                        ["Oro", "GOLD"],
                        ["Petróleo WTI", "WTI"],
                        ["S&P IPSA", "IPSA"]
                    ],
                    "showFloatingToolbar": false,
                    "tabs": [{
                        "title": "Índices",
                        "symbols": [["S&P 500", "SPX"], ["NASDAQ 100", "NDX"], ["DAX", "DAX"], ["NIKKEI 225", "NKY"]],
                        "originalTitle": "Indices"
                    }, {
                        "title": "Divisas",
                        "symbols": [["EUR/USD", "EURUSD"], ["USD/CLP", "USDCLP"], ["USD/JPY", "USDJPY"]],
                        "originalTitle": "Forex"
                    }, {
                        "title": "Commodities",
                        "symbols": [["Oro", "GOLD"], ["Petróleo WTI", "WTI"], ["Cobre", "HG1!"]],
                        "originalTitle": "Commodities"
                    }]
                };
                break;
            case 'advanced-chart':
                widgetConfig = {
                    ...baseConfig,
                    "symbol": "NASDAQ:AAPL",
                    "interval": "D",
                    "range": "1Y",
                    "hide_side_toolbar": false,
                    "allow_symbol_change": true,
                    "studies": ["STD;MovAvgExponential"],
                    "show_popup_button": true,
                    "calendar": false,
                    "support_host": "https://www.tradingview.com"
                };
                break;
            case 'heatmap-cl': // Mapa de calor IPSA
                widgetConfig = {
                    ...baseConfig,
                    "dataSource": "IPSA",
                    "rowsPerColumn": "30",
                    "columns": ["basic", "performance"],
                    "performance": "1D",
                    "size": "big",
                    "header_color": "#161B22",
                };
                break;
            case 'hotlists-cl': // Hotlists IPSA
                widgetConfig = {
                    ...baseConfig,
                    "width": "100%",
                    "height": "100%",
                    "locale": "es_LA",
                    "largeChartUrl": "",
                    "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
                    "plotLineColorFalling": "rgba(41, 98, 255, 1)",
                    "gridLineColor": "rgba(240, 243, 250, 0)",
                    "scaleFontColor": "rgba(106, 109, 120, 1)",
                    "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
                    "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
                    "belowLineFillColorBottom": "rgba(41, 98, 255, 0)",
                    "symbolActiveColor": "rgba(41, 98, 255, 0.15)",
                    "tabs": [
                        {
                            "title": "IPSA",
                            "symbols": [
                                { "s": "BCS:ENELCHILE", "d": "Enel Chile S.A." },
                                { "s": "BCS:SQM_B", "d": "Sociedad Química y Minera de Chile S.A." },
                                { "s": "BCS:COPEC", "d": "Empresas Copec S.A." },
                                { "s": "BCS:FALABELLA", "d": "S.A.C.I. Falabella" },
                                { "s": "BCS:SANTANDER", "d": "Banco Santander Chile" }
                            ],
                            "originalTitle": "IPSA"
                        }
                    ],
                    "hotlist": "TOP_GAINERS_AND_LOSERS",
                    "dateRange": "12M",
                    "is*largeChart": true,
                };
                break;
            case 'heatmap-us': // Mapa de calor S&P 500
                widgetConfig = {
                    ...baseConfig,
                    "dataSource": "SP:SPX",
                    "rowsPerColumn": "30",
                    "columns": ["basic", "performance"],
                    "performance": "1D",
                    "size": "big",
                    "header_color": "#161B22",
                };
                break;
            case 'hotlists-us': // Hotlists USA
                widgetConfig = {
                    ...baseConfig,
                    "hotlist": "MostActive",
                    "dateRange": "1M",
                    "is*largeChart": true,
                };
                break;
            case 'crypto-coins-heatmap':
                widgetConfig = {
                    ...baseConfig,
                    "dataSource": "crypto",
                    "rowsPerColumn": "30",
                    "columns": ["basic", "performance"],
                    "performance": "1D",
                    "size": "big",
                    "header_color": "#161B22",
                };
                break;
            case 'crypto-screener':
                widgetConfig = {
                    ...baseConfig,
                    "width": "100%",
                    "height": "100%",
                    "defaultColumn": "market_cap",
                    "defaultScreen": "all_crypto_mcap",
                    "market": "crypto",
                    "showToolbar": true,
                    "is*desktop": true,
                    "is*popup": false,
                    "is*showFloatingToolbar": false,
                    "is*chartOnly": false,
                };
                break;
            case 'timeline':
                widgetConfig = {
                    ...baseConfig,
                    "feedMode": "all_symbols",
                    "is*symbolSearch": true,
                    "colorTheme": "dark",
                    "displayMode": "regular",
                    "is*pageView": true,
                    "utm_source": "yourwebsite.com",
                    "utm_medium": "widget",
                    "utm_campaign": "timeline",
                };
                break;
            case 'economic-calendar':
                widgetConfig = {
                    ...baseConfig,
                    "locale": "es_LA",
                    "width": "100%",
                    "height": "100%",
                    "is*defaultTimeZone": "exchange",
                    "is*colorTheme": "dark",
                    "is*importanceFilter": "0,1",
                    "is*countryFilter": "CL,US,MX,BR,AR,CO,ES",
                };
                break;
            default:
                console.warn(`Tipo de widget no configurado: ${widgetType}`);
                return;
        }

        // Crea el script y lo inyecta para cargar el widget
        const widgetScript = document.createElement('script');
        widgetScript.type = 'text/javascript';
        widgetScript.innerHTML = `
            new TradingView.widget(${JSON.stringify(widgetConfig)});
        `;
        widgetElement.appendChild(widgetScript);
        
        // Almacena la instancia
        tradingViewInstances.set(widgetType, widgetScript);
    });
};

// --- RENDERIZADO DE LA INTERFAZ ---

// 1. Dibuja las tarjetas de inicio
const renderHomeCards = () => {
    const grid = document.getElementById('home-cards-grid');
    if (!grid) return;
    grid.innerHTML = ''; // Limpia el contenedor

    Object.entries(TOOLS).forEach(([key, tool]) => {
        const card = createElement('div', ['bg-secondary-dark', 'p-6', 'rounded-xl', 'shadow-2xl', 'hover:shadow-accent-blue/30', 'hover:ring-2', 'hover:ring-accent-blue/50', 'transition-all', 'duration-300', 'cursor-pointer', 'border', 'border-gray-700']);
        card.dataset.toolKey = key; // Usamos el key para la navegación
        card.innerHTML = `
            <div class="flex items-center space-x-4 mb-4">
                <i data-lucide="${tool.icon}" class="w-8 h-8 text-accent-blue"></i>
                <h3 class="text-xl font-bold text-white">${tool.title}</h3>
            </div>
            <p class="text-gray-400 text-sm">${tool.description}</p>
        `;
        grid.appendChild(card);
    });
    // Vuelve a inicializar los iconos de lucide
    lucide.createIcons();
};

// 2. Dibuja la barra de iconos y el menú móvil
const renderNavElements = () => {
    const iconBar = document.getElementById('home-icon-bar');
    const mobileNavLinks = document.getElementById('mobile-nav-links');
    if (!iconBar || !mobileNavLinks) return;

    // Limpia
    iconBar.innerHTML = '';
    mobileNavLinks.innerHTML = '';

    const createLinkElement = (toolKey, tool, isMobile = false) => {
        if (isMobile) {
             const link = createElement('a', ['w-full', 'block', 'py-2', 'px-3', 'rounded-lg', 'text-gray-300', 'hover:bg-gray-700', 'transition-colors', 'home-icon-link']);
             link.href = `#${toolKey}`;
             link.innerHTML = `<i data-lucide="${tool.icon}" class="inline-block w-5 h-5 mr-3"></i>${tool.title}`;
             return link;
        } else {
            // Versión de barra de iconos (solo las primeras 8 herramientas)
            const div = createElement('div', ['home-icon-link', 'cursor-pointer']);
            div.dataset.toolKey = toolKey;
            div.innerHTML = `
                <div class="flex items-center space-x-2 p-1.5 border border-transparent rounded-full hover:border-accent-blue/50 transition-colors">
                    <i data-lucide="${tool.icon}" class="w-5 h-5 text-text-light"></i>
                    <span class="text-sm text-gray-400 font-medium">${tool.title}</span>
                </div>
            `;
            return div;
        }
    };

    // Renderiza la barra de iconos (versión Desktop)
    const iconKeys = Object.keys(TOOLS).slice(0, 8); // Solo las 8 principales para el ticker
    iconKeys.forEach(key => {
        iconBar.appendChild(createLinkElement(key, TOOLS[key], false));
    });
    // Duplicamos para el efecto de scroll infinito
    iconKeys.forEach(key => {
        iconBar.appendChild(createLinkElement(key, TOOLS[key], false));
    });
    
    // Renderiza los enlaces del menú móvil
    Object.entries(TOOLS).forEach(([key, tool]) => {
        mobileNavLinks.appendChild(createLinkElement(key, tool, true));
    });

    // Vuelve a inicializar los iconos de lucide
    lucide.createIcons();
};

// --- LÓGICA DE NAVEGACIÓN Y CARGA DE PÁGINAS ---

// Carga el contenido de una herramienta desde su plantilla
const loadToolContent = async (toolKey) => {
    const tool = TOOLS[toolKey];
    if (!tool) return;

    const container = document.getElementById('tools-content-container');
    const template = document.getElementById(tool.templateId);
    if (!container || !template) {
        console.error(`Plantilla no encontrada para la clave: ${toolKey}`);
        return;
    }
    
    // 1. Transición de salida
    container.classList.add('fade-out');
    
    // 2. Espera que termine la animación (300ms)
    await new Promise(resolve => setTimeout(resolve, 300));
    container.innerHTML = ''; // Limpia el contenido

    // 3. Clona la plantilla y la inserta
    const content = document.importNode(template.content, true);
    container.appendChild(content);

    // 4. Inicializa los iconos de Lucide dentro del nuevo contenido
    lucide.createIcons();

    // 5. Inicializa TradingView o Módulos JS si es necesario
    if (tool.widgetType) {
        initializeTradingViewWidgets(container);
    }
    if (tool.module) {
        await loadChartPatternsModule();
        // Llama a la función de inicialización del módulo de patrones chartistas (educación)
        if (chartPatternsModule && chartPatternsModule.initializeEducationPage) {
            chartPatternsModule.initializeEducationPage();
        }
    }

    // 6. Transición de entrada y elimina la clase fade-out
    container.classList.remove('fade-out');
    container.classList.add('fade-in');
    
    // Asegura que se muestren los contenedores correctos
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('tools-page-container').style.display = 'block';
    
    // Ajusta la barra de navegación para mostrar el botón "Volver a Home"
    document.getElementById('back-to-home-btn').style.display = 'block';

    // Oculta el menú móvil si estaba abierto
    closeMobileMenu();
};

// Vuelve a la página de inicio
const goHome = async () => {
    const container = document.getElementById('tools-content-container');
    
    // Transición de salida del contenido de herramientas
    container.classList.add('fade-out');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Oculta y limpia el contenedor de herramientas
    document.getElementById('tools-page-container').style.display = 'none';
    container.innerHTML = '';

    // Muestra la página de inicio con transición de entrada
    const homePage = document.getElementById('home-page');
    homePage.classList.remove('fade-out');
    homePage.classList.add('fade-in');
    homePage.style.display = 'block';
    
    // Oculta el botón "Volver a Home"
    document.getElementById('back-to-home-btn').style.display = 'none';
    
    // Restablece el hash de la URL
    window.location.hash = '';

    // Resetea clases activas
    document.querySelectorAll('.home-icon-link').forEach(link => link.classList.remove('active'));
};


// --- GESTIÓN DEL MENÚ MÓVIL ---

const openMobileMenu = () => {
    document.getElementById('mobile-menu').classList.remove('translate-x-full');
};

const closeMobileMenu = () => {
    document.getElementById('mobile-menu').classList.add('translate-x-full');
};

// --- GESTIÓN DE EVENTOS ---

const handleNavigation = (event, toolKey) => {
    // Si la navegación viene de un formulario (ej. Contacto), no hagas nada aquí.
    if (event && event.target.tagName === 'BUTTON' && event.target.closest('form')) {
        return;
    }
    
    const key = toolKey || event.currentTarget.dataset.toolKey;
    if (key) {
        // Actualiza el hash de la URL para permitir la navegación hacia atrás/adelante
        window.location.hash = key;
        
        // Resetea clases activas y establece la clase en el link de la barra de iconos
        document.querySelectorAll('.home-icon-link').forEach(link => link.classList.remove('active'));
        const activeLinks = document.querySelectorAll(`.home-icon-link[data-tool-key="${key}"]`);
        activeLinks.forEach(link => link.classList.add('active'));
        
        loadToolContent(key);
    }
};

const setupEventListeners = () => {
    // Escuchar clics en las tarjetas de la página principal
    document.getElementById('home-cards-grid').addEventListener('click', (event) => {
        const card = event.target.closest('[data-tool-key]');
        if (card) {
            handleNavigation(event, card.dataset.toolKey);
        }
    });

    // Escuchar clics en la barra de iconos del encabezado
    document.getElementById('home-icon-bar').addEventListener('click', (event) => {
        const link = event.target.closest('.home-icon-link');
        if (link) {
            handleNavigation(event, link.dataset.toolKey);
        }
    });
    
    // Escuchar clics en los enlaces del menú móvil
    document.getElementById('mobile-nav-links').addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (link && link.href) {
            const key = link.href.split('#')[1];
            if (key) handleNavigation(event, key);
        }
    });

    // Botones de navegación
    document.getElementById('logo-link').addEventListener('click', goHome);
    document.getElementById('back-to-home-btn').addEventListener('click', goHome);
    
    // Botones del menú móvil
    document.getElementById('mobile-menu-button').addEventListener('click', openMobileMenu);
    document.getElementById('close-mobile-menu').addEventListener('click', closeMobileMenu);
    
    // Manejo de la URL para navegación con historial
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash && TOOLS[hash]) {
            loadToolContent(hash);
        } else {
            goHome();
        }
    });

    // Manejo del formulario de contacto (ejemplo básico)
    document.getElementById('tools-page-container').addEventListener('submit', (event) => {
        if (event.target.tagName === 'FORM' && event.target.action.includes('?form=success')) {
            event.preventDefault();
            // Simular envío y mostrar la página de agradecimiento
            loadToolContent('gracias');
        }
    });
    
    // Manejo del botón "Volver a Home" de la página de agradecimiento
    document.getElementById('tools-page-container').addEventListener('click', (event) => {
        if (event.target.id === 'back-to-home-from-thanks') {
            goHome();
        }
    });
};

// --- ANIMACIÓN DE FONDO (CANVAS) ---

const initializeParticles = () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 0.8 + 0.1;
            this.speedX = Math.random() * 0.1 - 0.05;
            this.speedY = Math.random() * 0.1 - 0.05;
            this.color = 'rgba(96, 165, 250, ' + (Math.random() * 0.5 + 0.2) + ')'; // Accent Blue
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.1) this.size -= 0.0005;

            // Mantener partículas dentro de los límites
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Inicializa un número fijo de partículas
    const init = () => {
        particles = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000); // Densidad basada en el tamaño
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        // Conectar partículas cercanas con líneas sutiles
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(96, 165, 250, ${1 - (distance / 100)})`;
                    ctx.lineWidth = 0.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
        resizeCanvas();
        init(); // Reinicia las partículas al redimensionar
    });

    resizeCanvas();
    init();
    animate();
};


// --- FUNCIÓN DE INICIO ---
const initializeApp = () => {
    // 1. Dibuja la UI estática (tarjetas y barra de iconos)
    renderHomeCards();
    renderNavElements();
    
    // 2. Configura los listeners de eventos para la navegación
    setupEventListeners();

    // 3. Inicializa la animación de fondo
    initializeParticles();
    
    // 4. Comprueba la URL inicial para cargar la página correcta
    const initialHash = window.location.hash.substring(1);
    if (initialHash && TOOLS[initialHash]) {
        loadToolContent(initialHash);
    } else {
        goHome();
    }
};

// Inicia la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initializeApp);

// Exportar funciones para ser usadas en otros módulos (como chartistPatterns.js)
export { initializeTradingViewWidgets, loadChartPatternsModule };
