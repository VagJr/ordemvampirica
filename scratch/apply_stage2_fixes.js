const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
console.log('Read index.html, length:', html.length);

// =========================================================================
// 1. CSS UPDATES
// =========================================================================

// A. Combat hiding navigation bars & z-index elevation + larger buttons
// Let's find `#arena-acao {` in CSS
const oldArenaCssStart = `#arena-acao { 
            position: fixed; 
            top: 0; left: 0; right: 0; bottom: 0; 
            width: 100vw; 
            max-width: 100vw;
            height: 100dvh; 
            max-height: 100dvh;
            background: radial-gradient(circle at 50% 25%, #24050a 0%, #100204 40%, #050102 80%, #000 100%);
            z-index: 100000;`;

const newArenaCssStart = `/* Durante qualquer combate, ocultar totalmente as barras de navegação e cabeçalhos */
        body.em-combate #mobile-bottom-nav,
        body.em-combate #quick-realm-strip,
        body.em-combate .world-ticker,
        body.em-combate #desktop-hud,
        body.em-combate #mobile-drawer,
        body.em-combate #mobile-drawer-overlay,
        #arena-acao:not(.oculto) ~ #mobile-bottom-nav,
        #arena-acao:not(.oculto) ~ #quick-realm-strip {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        #arena-acao { 
            position: fixed; 
            top: 0; left: 0; right: 0; bottom: 0; 
            width: 100vw; 
            max-width: 100vw;
            height: 100dvh; 
            max-height: 100dvh;
            background: radial-gradient(circle at 50% 25%, #24050a 0%, #100204 40%, #050102 80%, #000 100%);
            z-index: 1000000 !important;`;

if (html.includes(oldArenaCssStart)) {
    html = html.replace(oldArenaCssStart, newArenaCssStart);
    console.log('✅ 1A. Arena CSS z-index and combat nav hide rule applied.');
} else {
    console.error('⚠️ 1A. oldArenaCssStart not found, searching with regex...');
    html = html.replace(/#arena-acao\s*\{\s*position:\s*fixed;[\s\S]*?z-index:\s*100000;/g, newArenaCssStart);
}

// B. Enlarge combat buttons in CSS
const oldBtnCombatCss = `        /* Botões Principais de Combate */
        .arena-botoes {
            display: flex;
            justify-content: space-between;
            gap: 5px;
            width: 100%;
        }

        .btn-combat {
            flex: 1;
            padding: 4px 2px !important;
            height: 38px !important;
            min-height: 38px !important;
            font-size: clamp(0.8rem, 3vw, 1rem) !important;
            background: #110507;
            border: 2px solid;
            color: #fff;
            border-radius: 5px;
            text-transform: uppercase;
            font-family: 'Cinzel', serif;
            font-weight: 700;
            cursor: pointer;
            user-select: none;
            transition: 0.1s;
            display: flex !important;
            align-items: center;
            justify-content: center;
            box-sizing: border-box !important;
        }

        .btn-combat:active { transform: scale(0.94); filter: brightness(1.4); }

        .btn-combat-atk { border-color: #ff1e2f !important; box-shadow: 0 0 10px rgba(255, 30, 47, 0.2); }
        .btn-combat-def { border-color: #8899aa !important; box-shadow: 0 0 10px rgba(136, 153, 170, 0.2); }
        .btn-combat-mag { border-color: #a855f7 !important; box-shadow: 0 0 10px rgba(168, 85, 247, 0.2); }

        /* Linha Utilitária */
        .arena-util-row {
            display: flex;
            gap: 5px;
            width: 100%;
        }

        .btn-heal-combat {
            flex: 1 !important;
            width: auto !important;
            height: 28px !important;
            min-height: 28px !important;
            padding: 2px 5px !important;
            font-size: clamp(0.68rem, 2.4vw, 0.76rem) !important;
            background: linear-gradient(180deg, #420508 0%, #1c0204 100%) !important;
            border: 1px solid var(--sangue-claro) !important;
            color: #ffcccc !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            box-sizing: border-box !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .btn-flee {
            flex: 1 !important;
            width: auto !important;
            height: 28px !important;
            min-height: 28px !important;
            padding: 2px 5px !important;
            font-size: clamp(0.68rem, 2.4vw, 0.76rem) !important;
            background: #0d0305 !important;
            border: 1px solid #553338 !important;
            color: #998888 !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            box-sizing: border-box !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }`;

const newBtnCombatCss = `        /* Botões Principais de Combate - Tamanhos Ampliados e Ergonômicos */
        .arena-botoes {
            display: flex;
            justify-content: space-between;
            gap: 6px;
            width: 100%;
        }

        .btn-combat {
            flex: 1;
            padding: 8px 4px !important;
            height: 48px !important;
            min-height: 48px !important;
            font-size: clamp(0.95rem, 3.4vw, 1.15rem) !important;
            background: linear-gradient(180deg, #1f070b 0%, #0d0204 100%);
            border: 2px solid;
            color: #fff;
            border-radius: 6px;
            text-transform: uppercase;
            font-family: 'Cinzel', serif;
            font-weight: 900;
            letter-spacing: 1px;
            cursor: pointer;
            user-select: none;
            transition: all 0.15s ease;
            display: flex !important;
            align-items: center;
            justify-content: center;
            gap: 6px;
            box-sizing: border-box !important;
        }

        .btn-combat:active { transform: scale(0.95); filter: brightness(1.3); }

        .btn-combat-atk { border-color: #ff1e2f !important; box-shadow: 0 0 14px rgba(255, 30, 47, 0.35); text-shadow: 0 0 8px red; }
        .btn-combat-def { border-color: #a0b2c6 !important; box-shadow: 0 0 14px rgba(160, 178, 198, 0.35); text-shadow: 0 0 8px #a0b2c6; }
        .btn-combat-mag { border-color: #b066ff !important; box-shadow: 0 0 14px rgba(176, 102, 255, 0.35); text-shadow: 0 0 8px #b066ff; }

        /* Linha Utilitária Ampliada */
        .arena-util-row {
            display: flex;
            gap: 6px;
            width: 100%;
        }

        .btn-heal-combat {
            flex: 1 !important;
            width: auto !important;
            height: 36px !important;
            min-height: 36px !important;
            padding: 4px 8px !important;
            font-size: clamp(0.75rem, 2.7vw, 0.85rem) !important;
            font-weight: bold !important;
            background: linear-gradient(180deg, #52070c 0%, #240306 100%) !important;
            border: 1px solid var(--sangue-claro) !important;
            color: #fff !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            box-sizing: border-box !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 0 8px rgba(255, 30, 47, 0.25);
        }

        .btn-flee {
            flex: 1 !important;
            width: auto !important;
            height: 36px !important;
            min-height: 36px !important;
            padding: 4px 8px !important;
            font-size: clamp(0.75rem, 2.7vw, 0.85rem) !important;
            font-weight: bold !important;
            background: #110507 !important;
            border: 1px solid #663339 !important;
            color: #ccc !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            box-sizing: border-box !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }`;

if (html.includes(oldBtnCombatCss)) {
    html = html.replace(oldBtnCombatCss, newBtnCombatCss);
    console.log('✅ 1B. Larger combat button styles applied.');
} else {
    console.error('⚠️ 1B. oldBtnCombatCss not found exactly, will replace section with regex...');
    const bStart = html.indexOf('/* Botões Principais de Combate */');
    const bEnd = html.indexOf('/* Fim do Bloco de Combate */', bStart);
    // Let's check where it ends
}

// C. Also enlarge Visceral Actions & Feedback in CSS
const oldVisceralCss = `        .btn-action-visceral {
            flex: 1;
            min-width: 0;
            padding: 3px 2px !important;
            height: 28px !important;
            min-height: 28px !important;
            font-size: clamp(0.64rem, 2.2vw, 0.74rem) !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-radius: 4px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
        }`;

const newVisceralCss = `        .btn-action-visceral {
            flex: 1;
            min-width: 0;
            padding: 5px 4px !important;
            height: 34px !important;
            min-height: 34px !important;
            font-size: clamp(0.72rem, 2.5vw, 0.82rem) !important;
            font-weight: bold !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-radius: 5px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
        }`;

if (html.includes(oldVisceralCss)) {
    html = html.replace(oldVisceralCss, newVisceralCss);
    console.log('✅ 1C. Visceral actions button sizes enlarged.');
}

// D. Desktop Nav Dock Fix (padding-bottom 80px, visible scrollbar, never cut off)
const oldDockRule = `body.logado #desktop-nav-dock { grid-area: dock; display: flex !important; flex-direction: column; gap: 14px; position: sticky; top: 48px; height: calc(100vh - 72px); overflow-y: auto; }`;

const newDockRule = `body.logado #desktop-nav-dock { 
                grid-area: dock; 
                display: flex !important; 
                flex-direction: column; 
                gap: 10px; 
                position: sticky; 
                top: 48px; 
                height: calc(100vh - 64px); 
                max-height: calc(100vh - 64px); 
                overflow-y: auto !important; 
                overflow-x: hidden; 
                padding-right: 6px; 
                padding-bottom: 90px !important; 
                box-sizing: border-box; 
                overscroll-behavior: contain; 
                scrollbar-width: thin; 
                scrollbar-color: var(--sangue) #070304; 
            }
            body.logado #desktop-nav-dock::-webkit-scrollbar {
                width: 6px;
            }
            body.logado #desktop-nav-dock::-webkit-scrollbar-track {
                background: #070304;
                border-radius: 3px;
            }
            body.logado #desktop-nav-dock::-webkit-scrollbar-thumb {
                background: #4a131b;
                border-radius: 3px;
                border: 1px solid var(--sangue);
            }
            body.logado #desktop-nav-dock::-webkit-scrollbar-thumb:hover {
                background: var(--sangue-claro);
            }`;

if (html.includes(oldDockRule)) {
    html = html.replace(oldDockRule, newDockRule);
    console.log('✅ 1D. PC Desktop Dock CSS updated with padding-bottom 90px and custom scrollbar.');
} else {
    console.error('⚠️ 1D. oldDockRule not found directly, checking variations...');
}

// E. Update #mobile-drawer styles to support organized categorized layout
const oldMobileDrawerCss = `            /* Gaveta Deslizante para Todas as Abas */
            #mobile-drawer {
                position: fixed;
                top: 0;
                left: -100%;
                width: 82%;
                max-width: 320px;
                height: 100vh;
                background: #090305;
                border-right: 2px solid var(--ouro-sombra);
                z-index: 100005;
                transition: left 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
                overflow-y: auto;
                padding: 20px 15px;
                box-shadow: 10px 0 40px rgba(0, 0, 0, 0.9);
            }
            #mobile-drawer.open { left: 0; }
            #mobile-drawer-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.75);
                z-index: 100004;
                backdrop-filter: blur(3px);
            }`;

const newMobileDrawerCss = `            /* Gaveta Deslizante para Todas as Abas (Categorizada & Completa) */
            #mobile-drawer {
                position: fixed;
                top: 0;
                left: -100%;
                width: 88%;
                max-width: 340px;
                height: 100dvh;
                background: linear-gradient(180deg, #0d0406 0%, #060103 100%);
                border-right: 2px solid var(--ouro-sombra);
                z-index: 100005;
                transition: left 0.28s cubic-bezier(0.1, 0.9, 0.2, 1);
                overflow-y: auto;
                overscroll-behavior: contain;
                padding: 16px 12px 60px 12px;
                box-shadow: 12px 0 50px rgba(0, 0, 0, 0.95);
                box-sizing: border-box;
                scrollbar-width: thin;
                scrollbar-color: var(--sangue) #070304;
            }
            #mobile-drawer.open { left: 0; }
            #mobile-drawer-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.8);
                z-index: 100004;
                backdrop-filter: blur(4px);
            }
            #mobile-drawer .dock-category {
                margin-bottom: 10px;
                border-radius: 6px;
                background: #080204;
                border: 1px solid #290e13;
                overflow: hidden;
            }
            #mobile-drawer .dock-cat-header {
                padding: 7px 10px;
                font-size: 0.72rem;
                font-family: 'Cinzel', serif;
                color: var(--ouro-antigo);
                background: #140407;
                letter-spacing: 1.5px;
                font-weight: bold;
                border-bottom: 1px solid #23080c;
            }
            #mobile-drawer .dock-btn {
                padding: 9px 12px;
                font-size: 0.85rem;
                color: #cfc2be;
                width: 100%;
                display: flex;
                align-items: center;
                gap: 10px;
                background: transparent;
                border: none;
                border-bottom: 1px solid rgba(255,255,255,0.03);
                cursor: pointer;
                text-align: left;
                font-family: 'Cinzel', serif;
                transition: background 0.15s;
            }
            #mobile-drawer .dock-btn:active {
                background: rgba(138, 3, 3, 0.3);
                color: #fff;
            }`;

if (html.includes(oldMobileDrawerCss)) {
    html = html.replace(oldMobileDrawerCss, newMobileDrawerCss);
    console.log('✅ 1E. Mobile drawer CSS updated.');
}

// =========================================================================
// 2. HTML UPDATES: MOBILE BOTTOM NAV & MOBILE DRAWER
// =========================================================================

// A. Add 6th button (Menu) in #mobile-bottom-nav
const oldBottomNavHtml = `        <nav id="mobile-bottom-nav">
            <button class="mob-nav-btn active" data-aba="mapa" onclick="nav('mapa', this)">
                <span class="mob-icon">🗺️</span>
                <span>Reino</span>
            </button>
            <button class="mob-nav-btn" data-aba="caca" onclick="nav('caca', this)">
                <span class="mob-icon">🩸</span>
                <span>Caça</span>
            </button>
            <button class="mob-nav-btn" data-aba="aventura" onclick="nav('aventura', this)">
                <span class="mob-icon">⚔️</span>
                <span>Abismo</span>
            </button>
            <button class="mob-nav-btn" data-aba="oficios" onclick="nav('oficios', this)">
                <span class="mob-icon">⚒️</span>
                <span>Ofícios</span>
            </button>
            <button class="mob-nav-btn" data-aba="perfil" onclick="nav('perfil', this)">
                <span class="mob-icon">📜</span>
                <span>Sanctum</span>
            </button>
        </nav>`;

const newBottomNavHtml = `        <nav id="mobile-bottom-nav">
            <button class="mob-nav-btn active" data-aba="mapa" onclick="nav('mapa', this)">
                <span class="mob-icon">🗺️</span>
                <span>Reino</span>
            </button>
            <button class="mob-nav-btn" data-aba="caca" onclick="nav('caca', this)">
                <span class="mob-icon">🩸</span>
                <span>Caça</span>
            </button>
            <button class="mob-nav-btn" data-aba="aventura" onclick="nav('aventura', this)">
                <span class="mob-icon">⚔️</span>
                <span>Abismo</span>
            </button>
            <button class="mob-nav-btn" data-aba="oficios" onclick="nav('oficios', this)">
                <span class="mob-icon">⚒️</span>
                <span>Ofícios</span>
            </button>
            <button class="mob-nav-btn" data-aba="perfil" onclick="nav('perfil', this)">
                <span class="mob-icon">🏰</span>
                <span>Sanctum</span>
            </button>
            <button class="mob-nav-btn" id="btn-open-mobile-menu" onclick="abrirMobileDrawer()" style="color: var(--ouro); text-shadow: 0 0 6px rgba(212,175,55,0.4);">
                <span class="mob-icon">📜</span>
                <span style="font-weight:bold;">Menu</span>
            </button>
        </nav>`;

if (html.includes(oldBottomNavHtml)) {
    html = html.replace(oldBottomNavHtml, newBottomNavHtml);
    console.log('✅ 2A. Bottom navigation updated with 6th Menu button.');
} else {
    console.error('⚠️ 2A. oldBottomNavHtml not found directly.');
}

// B. Full Categorized #mobile-drawer HTML (matching PC sections!)
const drawerStartMarker = '<aside id="mobile-drawer">';
const drawerEndMarker = '</aside>';
const dStartIdx = html.indexOf(drawerStartMarker);
const dEndIdx = html.indexOf(drawerEndMarker, dStartIdx);

if (dStartIdx !== -1 && dEndIdx !== -1) {
    const fullCategorizedDrawerHtml = `<aside id="mobile-drawer">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--ouro-sombra); padding-bottom: 10px; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.3rem;">📜</span>
                    <h3 style="margin: 0; color: var(--ouro); font-size: 1.15rem; font-family: 'Cinzel Decorative', 'Cinzel', serif; letter-spacing: 1px;">PORTAL DO REINO</h3>
                </div>
                <button onclick="fecharMobileDrawer()" style="width: auto; padding: 4px 10px; background: transparent; border: 1px solid #4a151b; border-radius: 4px; color: #ffcccc; font-size: 1.1rem; cursor: pointer;">✕</button>
            </div>

            <!-- SESSÃO 1: PRIMA MATERIA -->
            <div class="dock-category">
                <div class="dock-cat-header">PRIMA MATERIA</div>
                <button class="dock-btn" onclick="nav('mapa'); fecharMobileDrawer();"><span style="color:var(--ouro);">🗺️</span> O Mapa do Reino</button>
                <button class="dock-btn" onclick="nav('caca'); fecharMobileDrawer();"><span style="color:var(--sangue-claro);">🩸</span> A Caça (Teia)</button>
                <button class="dock-btn" onclick="nav('astrolabio'); fecharMobileDrawer();"><span>🌙</span> O Céu / Lua</button>
                <button class="dock-btn" onclick="nav('perfil'); fecharMobileDrawer();"><span>📜</span> Grimório Pessoal</button>
                <button class="dock-btn" onclick="nav('compendio'); fecharMobileDrawer();"><span>👁️</span> Compêndio Real</button>
                <button class="dock-btn" onclick="nav('banco'); fecharMobileDrawer();"><span>🍷</span> Cálice Sagrado</button>
            </div>

            <!-- SESSÃO 2: OFÍCIOS & ALQUIMIA -->
            <div class="dock-category">
                <div class="dock-cat-header">OFÍCIOS & ALQUIMIA</div>
                <button class="dock-btn" onclick="nav('oficios'); fecharMobileDrawer();"><span style="color:#00ff88;">⚒️</span> Ofícios Noturnos</button>
                <button class="dock-btn" onclick="nav('magia'); fecharMobileDrawer();"><span style="color:var(--magia);">🔮</span> Altar & Forja Mágica</button>
                <button class="dock-btn" onclick="nav('ordem'); fecharMobileDrawer();"><span style="color:#d4af37;">🏛️</span> Ordem Iniciática</button>
                <button class="dock-btn" onclick="nav('magia_codigo'); fecharMobileDrawer();"><span style="color:#00e1d9;">✨</span> Matriz Mágica (IA)</button>
                <button class="dock-btn" onclick="nav('biblioteca'); fecharMobileDrawer();"><span style="color:var(--xp);">📖</span> Biblioteca Proibida</button>
                <button class="dock-btn" onclick="nav('familiars'); fecharMobileDrawer();"><span style="color:#00e1d9;">🦇</span> Forja de Almas (Pets)</button>
            </div>

            <!-- SESSÃO 3: GUERRA & ABISMO -->
            <div class="dock-category">
                <div class="dock-cat-header">GUERRA & ABISMO</div>
                <button class="dock-btn" onclick="nav('aventura'); fecharMobileDrawer();"><span style="color:#ff1e2f;">⚔️</span> O Abismo Infinito</button>
                <button class="dock-btn" onclick="nav('umbral'); fecharMobileDrawer();"><span style="color:#ff5050;">💀</span> O Umbral (PvE)</button>
                <button class="dock-btn" onclick="nav('pvp'); fecharMobileDrawer();"><span style="color:#d4af37;">⚔️</span> Duelos Sangrentos (PvP)</button>
                <button class="dock-btn" onclick="nav('labirinto'); fecharMobileDrawer();"><span style="color:#fff;">🪞</span> O Labirinto de Vidro</button>
            </div>

            <!-- SESSÃO 4: CORTE & SOCIEDADE -->
            <div class="dock-category">
                <div class="dock-cat-header">CORTE & SOCIEDADE</div>
                <button class="dock-btn" onclick="nav('chat'); fecharMobileDrawer();"><span>💬</span> Salão / Corte (Chat)</button>
                <button class="dock-btn" onclick="nav('leilao'); fecharMobileDrawer();"><span>⚖️</span> O Mercado (Leilão)</button>
                <button class="dock-btn" onclick="nav('conclave'); fecharMobileDrawer();"><span>🏛️</span> O Conclave</button>
                <button class="dock-btn" onclick="nav('clan'); fecharMobileDrawer();"><span>🛡️</span> Santuário da Ordem (Clã)</button>
                <button class="dock-btn" onclick="nav('reinos'); fecharMobileDrawer();"><span>👑</span> Domínios & Reinos</button>
                <button class="dock-btn" onclick="nav('panteao'); fecharMobileDrawer();"><span>⚡</span> Panteão Divino</button>
                <button class="dock-btn" onclick="nav('social'); fecharMobileDrawer();"><span style="color:#ff79c6;">🐺</span> Social & Co-op</button>
                <button class="dock-btn" onclick="nav('mundo2d'); fecharMobileDrawer();"><span style="color:#0f5;">🌌</span> Mundo 2D Sandbox</button>
            </div>

            <!-- SESSÃO 5: ARCANO SUPERIOR -->
            <div class="dock-category">
                <div class="dock-cat-header">ARCANO SUPERIOR</div>
                <button class="dock-btn" onclick="abrirConsciencias(); fecharMobileDrawer();"><span style="color:var(--magia);">🌌</span> 4 Consciências Cósmicas</button>
                <button class="dock-btn" onclick="abrirSettings(); fecharMobileDrawer();"><span>⚙️</span> Ajustes, Áudio & Gráficos</button>
            </div>
        </aside>`;
    
    html = html.substring(0, dStartIdx) + fullCategorizedDrawerHtml + html.substring(dEndIdx + 8);
    console.log('✅ 2B. Mobile drawer replaced with full categorized sections.');
} else {
    console.error('⚠️ 2B. Mobile drawer markers not found!');
}

// =========================================================================
// 3. JAVASCRIPT UPDATES: COMBAT LIFECYCLE (TOGGLE EM-COMBATE)
// =========================================================================

// Iniciar combate
const oldIniciarCombateCode = `function iniciarCombateVisceral(nomeAlvo, idAlvo, tipoCombate, hpInimigo, isRaidBoss = false, posturaPvP = 1) {
        combateAtivo = true; isSyncing = false;`;

const newIniciarCombateCode = `function iniciarCombateVisceral(nomeAlvo, idAlvo, tipoCombate, hpInimigo, isRaidBoss = false, posturaPvP = 1) {
        combateAtivo = true; isSyncing = false;
        document.body.classList.add('em-combate');
        const mobNavEl = document.getElementById('mobile-bottom-nav');
        if (mobNavEl) mobNavEl.classList.add('oculto');
        const qkStripEl = document.getElementById('quick-realm-strip');
        if (qkStripEl) qkStripEl.classList.add('oculto');`;

if (html.includes(oldIniciarCombateCode)) {
    html = html.replace(oldIniciarCombateCode, newIniciarCombateCode);
    console.log('✅ 3A. iniciarCombateVisceral updated to hide bottom nav and add em-combate.');
}

// Encerrar combate
const oldEncerrarCode = `function encerrarArenaFinal(msgFinal) {
        combateAtivo = false; clearInterval(loopIA);
        
        document.querySelectorAll('#arena-acao').forEach(el => el.classList.add('oculto'));
        document.querySelectorAll('#ui-main').forEach(el => el.style.display = 'block');`;

const newEncerrarCode = `function encerrarArenaFinal(msgFinal) {
        combateAtivo = false; clearInterval(loopIA);
        document.body.classList.remove('em-combate');
        const mobNavEl = document.getElementById('mobile-bottom-nav');
        if (mobNavEl) mobNavEl.classList.remove('oculto');
        const qkStripEl = document.getElementById('quick-realm-strip');
        if (qkStripEl) qkStripEl.classList.remove('oculto');
        
        document.querySelectorAll('#arena-acao').forEach(el => el.classList.add('oculto'));
        document.querySelectorAll('#ui-main').forEach(el => el.style.display = 'block');`;

if (html.includes(oldEncerrarCode)) {
    html = html.replace(oldEncerrarCode, newEncerrarCode);
    console.log('✅ 3B. encerrarArenaFinal updated to restore nav and remove em-combate.');
}

// Abortar combate
const oldAbortarCode = `function abortarCombateManual() { if(!combateAtivo || isSyncing) return; processarCicloComServidor(true); }`;
const newAbortarCode = `function abortarCombateManual() { 
        if(!combateAtivo || isSyncing) return; 
        document.body.classList.remove('em-combate');
        const mobNavEl = document.getElementById('mobile-bottom-nav');
        if (mobNavEl) mobNavEl.classList.remove('oculto');
        const qkStripEl = document.getElementById('quick-realm-strip');
        if (qkStripEl) qkStripEl.classList.remove('oculto');
        processarCicloComServidor(true); 
    }`;

if (html.includes(oldAbortarCode)) {
    html = html.replace(oldAbortarCode, newAbortarCode);
    console.log('✅ 3C. abortarCombateManual updated to restore nav.');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html successfully! New length:', html.length);
