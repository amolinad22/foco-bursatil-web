import {
    destroyAllCharts,
    destroyChartistCharts,
    setupSRStudy,
    setupFibonacciRetracementStudy,
    setupSymmetricTriangleStudy,
    setupTrendChannelStudy,
    setupReversalStudy,
    setupCupHandleStudy
} from './chartistPatterns.js'; // Importa las funciones del módulo de gráficos

document.addEventListener('DOMContentLoaded', () => {
    // Definiciones de elementos del DOM
    const homePage = document.getElementById('home-page');
    const toolsPageContainer = document.getElementById('tools-page-container');
    const toolsContentContainer = document.getElementById('tools-content-container');
    const homeCardsGrid = document.getElementById('home-cards-grid');
    const homeIconBar = document.getElementById('home-icon-bar');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    const mobileNavLinksContainer = document.getElementById('mobile-nav-links');
    
    // Configuración de las herramientas disponibles
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

    // --- Funciones de Navegación de Educación (Usa funciones importadas) ---

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
                destroyAllCharts(); // Limpieza de todos los gráficos antes de cambiar de sección
                studies[currentStudyKey].btn?.classList.remove('active');
                studies[currentStudyKey].content?.classList.add('hidden');
            }

            studies[newKey].btn?.classList.add('active');
            studies[newKey].content?.classList.remove('hidden');

            // Asegurar que el DOM esté listo para inicializar los gráficos
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
                destroyChartistCharts(); // Limpieza solo de gráficos de patrones
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

        // Inicializar el primer patrón
        if (document.getElementById('symmetric-triangle-study-content')) {
            switchPattern('symmetric-triangle');
        }
    }

    // --- Funciones de UI y Carga de Widgets ---

    function createInitialUI() {
        // Crear tarjetas de inicio y enlaces móviles
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

        // Crear iconos del ticker (barra horizontal)
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

        // Duplicar iconos para el efecto de scroll infinito
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

        // Mostrar loader
        toolsContentContainer.innerHTML = `<div class="flex justify-center items-center h-64"><span class="loader"></span></div>`;

        // Simular carga de contenido
        setTimeout(() => {
            if (document.querySelector(`#template-${pageId}`)) {
                toolsContentContainer.innerHTML = template.innerHTML;
                loadWidgetsForContent(pageId);
                
                // Configurar botón de 'volver' específico de la página de agradecimiento
                if (pageId === 'gracias-page') {
                    document.getElementById('back-to-home-from-thanks').addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.hash = ''; 
                        history.replaceState(null, null, window.location.pathname);
                        returnToHome(false); 
                    });
                }
            }
        }, 500);

        // Activar el icono de la herramienta en el ticker
        document.querySelectorAll('.home-icon-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });

        window.scrollTo(0, 0);
    }

    function openMobileMenu() { mobileMenu.classList.remove('translate-x-full'); }
    function closeMobileMenu() { mobileMenu.classList.add('translate-x-full'); }

    // Función para cargar los widgets de TradingView
    function loadWidgetsForContent(pageId) {
        if (pageId === 'educacion-page') {
            setupEducationNavigation();
        }

        const widgetContainers = toolsContentContainer.querySelectorAll('.tradingview-widget-container__widget');
        widgetContainers.forEach(container => {
            const widgetType = container.dataset.widgetType;
            const widgetKey = `${pageId}-${widgetType}`;

            if (loadedWidgets.has(widgetKey)) return; // Evitar recarga

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
                // TradingView usa innerHTML para incrustar la configuración JSON
                script.innerHTML = JSON.stringify(config);
                container.innerHTML = '';
                container.appendChild(script);
                loadedWidgets.add(widgetKey);
            }
        });
    }

    // --- Funciones de Transición de Página ---

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

    // --- Listeners Globales ---

    // Listener para los botones de navegación (tarjetas, enlaces móviles, iconos del ticker)
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('.home-card-btn, .mobile-nav-link, .home-icon-link');
        if (target) {
            e.preventDefault();
            const pageId = target.dataset.page;
            showToolsPage(pageId);
            closeMobileMenu();
        }
    });

    // Listener para volver a la home desde el logo o el botón 'Volver'
    document.getElementById('logo-link').addEventListener('click', (e) => {
        e.preventDefault();
        returnToHome();
    });
    document.getElementById('back-to-home-btn').addEventListener('click', (e) => {
        e.preventDefault();
        returnToHome();
    });

    // Manejo del hash de la URL (si viene de un formulario exitoso)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('form') === 'success') {
        showToolsPage('gracias-page');
    }

    // Manejo del menú móvil
    mobileMenuButton.addEventListener('click', openMobileMenu);
    closeMobileMenuButton.addEventListener('click', closeMobileMenu);
    
    // --- Inicialización de la UI ---
    createInitialUI();

    // --- Animación de Partículas de Fondo ---
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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; // Partículas blancas muy tenues
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

            // Rebotar en los bordes
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

    // Iniciar la animación
    resizeCanvas();
    createParticles();
    animate();

}); // Fin de DOMContentLoaded
