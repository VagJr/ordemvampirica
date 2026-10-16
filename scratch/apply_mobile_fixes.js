const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

console.log('Original length:', html.length);

// 1. Meta Viewport
const oldViewport = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';
const newViewport = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">';
if (!html.includes(oldViewport)) {
    console.error('ERROR: oldViewport not found!');
} else {
    html = html.replace(oldViewport, newViewport);
    console.log('1. Viewport replaced.');
}

// 2. Global html & body
const oldBodyStyle = `        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        
        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Crimson Text', serif;
            margin: 0;
            padding: 0;
            font-size: 16px;
            line-height: 1.5;
            background-image: radial-gradient(circle at 50% 0%, #170306 0%, #040203 70%, #000 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }`;

const newBodyStyle = `        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        
        html, body {
            max-width: 100vw;
            width: 100%;
            overflow-x: hidden;
            box-sizing: border-box;
        }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Crimson Text', serif;
            margin: 0;
            padding: 0;
            font-size: 16px;
            line-height: 1.5;
            background-image: radial-gradient(circle at 50% 0%, #170306 0%, #040203 70%, #000 100%);
            min-height: 100vh;
        }`;

if (!html.includes(oldBodyStyle)) {
    console.error('ERROR: oldBodyStyle not found!');
} else {
    html = html.replace(oldBodyStyle, newBodyStyle);
    console.log('2. Global body style replaced.');
}

// 3. .world-ticker base CSS
const oldTickerStyle = `        .world-ticker {
            position: fixed; top: 0; left: 0; width: 100%;
            background: linear-gradient(90deg, #150204 0%, #200408 50%, #150204 100%);
            border-bottom: 1px solid var(--ouro-sombra);
            color: var(--ouro); padding: 4px 10px; font-size: 0.82em;
            z-index: 1000; overflow: hidden; white-space: nowrap; font-family: 'Cinzel', serif;
            display: flex; justify-content: space-between; align-items: center;
        }
        .ticker-text { display: inline-block; padding-left: 100%; animation: scrollTicker 24s linear infinite; }
        @keyframes scrollTicker { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }`;

const newTickerStyle = `        .world-ticker {
            position: fixed; top: 0; left: 0; width: 100%; max-width: 100vw;
            background: linear-gradient(90deg, #150204 0%, #200408 50%, #150204 100%);
            border-bottom: 1px solid var(--ouro-sombra);
            color: var(--ouro); padding: 0 10px; font-size: 0.82em; height: 36px;
            z-index: 1000; overflow: hidden; white-space: nowrap; font-family: 'Cinzel', serif;
            display: flex; justify-content: space-between; align-items: center;
            box-sizing: border-box;
        }
        .ticker-text { 
            display: inline-block; 
            padding-left: 100%; 
            animation: scrollTicker 24s linear infinite; 
            white-space: nowrap;
            overflow: hidden;
            flex: 1;
            min-width: 0;
        }
        @keyframes scrollTicker { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }

        .world-ticker-actions {
            position: absolute;
            right: 10px;
            top: 4px;
            z-index: 1001;
            display: flex;
            gap: 5px;
            align-items: center;
        }
        .world-ticker-actions button {
            background: transparent;
            padding: 2px 8px;
            font-size: 0.7em;
            width: auto;
            margin: 0;
            white-space: nowrap;
        }`;

if (!html.includes(oldTickerStyle)) {
    console.error('ERROR: oldTickerStyle not found!');
} else {
    html = html.replace(oldTickerStyle, newTickerStyle);
    console.log('3. Ticker base style replaced.');
}

// 4. Mobile media query (@media (max-width: 1023px))
const oldMediaQuery = `        /* =================================================== */
        /* LAYOUT RESPONSIVO: MOBILE EXCLUSIVO (< 1024px)     */
        /* =================================================== */
        @media (max-width: 1023px) {
            body { padding-top: 36px; padding-bottom: 70px; }
            body.logado #ui-main:not(.oculto) { display: block !important; padding: 10px; }
            body:not(.logado) #ui-main { display: none !important; }
            #desktop-nav-dock, #desktop-side-panel, .desktop-only, .key-badge { display: none !important; }
            .tabs#nav-tabs { display: none !important; }`;

const newMediaQuery = `        /* =================================================== */
        /* LAYOUT RESPONSIVO: MOBILE EXCLUSIVO (< 1024px)     */
        /* =================================================== */
        @media (max-width: 1023px) {
            body { padding-top: 36px; padding-bottom: 70px; max-width: 100vw; overflow-x: hidden; }
            body.logado #ui-main:not(.oculto) { 
                display: block !important; 
                padding: 8px !important; 
                max-width: 100vw !important; 
                box-sizing: border-box !important; 
                overflow-x: hidden !important; 
            }
            body:not(.logado) #ui-main { display: none !important; }
            #desktop-nav-dock, #desktop-side-panel, .desktop-only, .key-badge { display: none !important; }
            .tabs#nav-tabs { display: none !important; }

            /* Ajustes finos do ticker no mobile - zero overflow horizontal */
            .world-ticker {
                height: 34px !important;
                padding: 0 6px !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                gap: 6px !important;
                max-width: 100vw !important;
                box-sizing: border-box !important;
            }
            .world-ticker .ticker-text {
                animation: none !important;
                padding-left: 0 !important;
                font-size: 0.75rem !important;
                text-overflow: ellipsis !important;
                overflow: hidden !important;
                white-space: nowrap !important;
                flex: 1 1 auto !important;
                min-width: 0 !important;
            }
            .world-ticker-actions {
                position: static !important;
                flex: 0 0 auto !important;
                display: flex !important;
                gap: 3px !important;
            }
            .world-ticker-actions button {
                padding: 2px 4px !important;
                font-size: 0.65rem !important;
                white-space: nowrap !important;
            }

            /* Painel Superior do Jogador (#desktop-hud) Anti-Overflow */
            #desktop-hud {
                padding: 8px 10px !important;
                margin-bottom: 10px !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
                overflow: hidden !important;
                border-radius: 6px !important;
            }
            .hud-main-grid {
                display: flex !important;
                justify-content: space-between !important;
                align-items: flex-start !important;
                gap: 8px !important;
                width: 100% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
            }
            .hud-player-profile {
                flex: 1 1 auto !important;
                min-width: 0 !important;
                overflow: hidden !important;
            }
            #ui-meu-nome {
                font-size: clamp(1.05rem, 4vw, 1.3rem) !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                max-width: 100% !important;
                line-height: 1.2 !important;
            }
            .hud-player-profile > div {
                font-size: 0.78rem !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                max-width: 100% !important;
            }
            .hud-player-vitals {
                flex: 0 0 auto !important;
                min-width: 0 !important;
                text-align: right !important;
                max-width: 48% !important;
            }
            .hud-player-vitals h2 {
                font-size: clamp(0.95rem, 3.8vw, 1.2rem) !important;
                margin: 0 !important;
                white-space: nowrap !important;
                line-height: 1.2 !important;
            }
            .hud-player-vitals > div {
                font-size: 0.78rem !important;
                white-space: nowrap !important;
            }
            .hud-calice-pill {
                font-size: 0.72rem !important;
                padding: 2px 5px !important;
                max-width: 100% !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                box-sizing: border-box !important;
                display: inline-block !important;
            }
            .quick-realm-strip {
                max-width: 100% !important;
                box-sizing: border-box !important;
                -webkit-overflow-scrolling: touch;
            }`;

if (!html.includes(oldMediaQuery)) {
    console.error('ERROR: oldMediaQuery not found!');
} else {
    html = html.replace(oldMediaQuery, newMediaQuery);
    console.log('4. Media query replaced.');
}

// 5. Combat CSS (lines ~658-685)
const oldCombatCss = `        /* Arena de Combate e Dungeons */
        #arena-acao { 
            position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
            width: 100vw; height: 100dvh; 
            background: #050000; z-index: 100000; 
            padding: env(safe-area-inset-top, 20px) 15px 15px 15px; 
            box-sizing: border-box; 
            display: flex; flex-direction: column; justify-content: space-between; 
            overflow: hidden; 
        }
        .hp-bar-container { background: #160508; height: 26px; width: 100%; border-radius: 4px; overflow: hidden; border: 1px solid #4a131b; position: relative; margin-bottom: 5px;}
        .hp-bar-fill { height: 100%; width: 100%; transition: width 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .hp-boss-fill { background: linear-gradient(90deg, #500, #ff1e2f); }
        .hp-player-fill { background: linear-gradient(90deg, #003, #5985c5); }

        .inimigo-container { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; min-height: 35vh; }
        .inimigo-sprite { font-size: 6.5rem; text-shadow: 0 0 30px var(--sangue); transition: transform 0.1s, filter 0.3s; user-select: none; z-index: 10002;}
        .inimigo-intent { margin-top: 15px; font-family: 'Cinzel', serif; font-size: 1.35rem; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 10px #000; z-index: 10002;}
        
        .intent-idle { color: #888; }
        .intent-ataque { color: #ff1e2f; animation: pulseRed 0.3s infinite; transform: scale(1.15); filter: drop-shadow(0 0 30px red);}
        .intent-magia { color: #d080ff; animation: pulsePurple 0.5s infinite; transform: scale(1.15); filter: drop-shadow(0 0 30px purple);}
        .intent-vulneravel { color: #0f5; text-shadow: 0 0 20px #0f5; filter: drop-shadow(0 0 20px #0f5) grayscale(1); transform: rotate(10deg);}
        .intent-sync { color: #fff; animation: pulseCyan 0.2s infinite; letter-spacing: 5px; }

        .arena-botoes { display: flex; justify-content: space-between; gap: 8px; width: 100%; margin-bottom: 10px;}
        .btn-combat { padding: 14px 8px; font-size: 1.1rem; flex: 1; background: #110507; border: 2px solid; color: #fff; border-radius: 6px; text-transform: uppercase; font-family: 'Cinzel', serif; cursor: pointer; user-select: none; transition: 0.1s;}
        .btn-combat:active { transform: scale(0.92); filter: brightness(1.4); }`;

const newCombatCss = `        /* =================================================== */
        /* ARENA DE COMBATE VISCERAL - ZERO SCROLL E ATMOSFERA */
        /* =================================================== */
        #arena-acao { 
            position: fixed; 
            top: 0; left: 0; right: 0; bottom: 0; 
            width: 100vw; 
            max-width: 100vw;
            height: 100dvh; 
            max-height: 100dvh;
            background: radial-gradient(circle at 50% 25%, #24050a 0%, #100204 40%, #050102 80%, #000 100%);
            z-index: 100000; 
            padding: max(6px, env(safe-area-inset-top, 6px)) max(8px, env(safe-area-inset-right, 8px)) max(6px, env(safe-area-inset-bottom, 6px)) max(8px, env(safe-area-inset-left, 8px)); 
            box-sizing: border-box; 
            display: flex; 
            flex-direction: column; 
            justify-content: space-between; 
            align-items: center;
            overflow: hidden; 
            user-select: none;
        }

        /* Ambient Background: Fim do fundo vazio */
        .arena-ambient-bg {
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: 1;
        }

        .arena-rune-circle {
            position: absolute;
            top: 25%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(85vw, 360px);
            height: min(85vw, 360px);
            border-radius: 50%;
            border: 1px dashed rgba(212, 175, 55, 0.12);
            box-shadow: inset 0 0 35px rgba(255, 30, 47, 0.1), 0 0 30px rgba(138, 3, 3, 0.12);
            animation: rotateRune 90s linear infinite;
        }
        .arena-rune-circle::before {
            content: '';
            position: absolute;
            inset: 18px;
            border-radius: 50%;
            border: 1px solid rgba(147, 51, 234, 0.1);
        }

        @keyframes rotateRune {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .arena-blood-mist {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, transparent 40%, rgba(10, 0, 2, 0.85) 90%);
        }

        /* HUD Superior */
        .arena-hud {
            width: 100%;
            max-width: 650px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            background: rgba(12, 4, 7, 0.88);
            border: 1px solid #301015;
            border-radius: 8px;
            padding: 5px 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.8), inset 0 0 10px rgba(138, 3, 3, 0.15);
            backdrop-filter: blur(8px);
            position: relative;
            z-index: 10;
            flex-shrink: 0;
            box-sizing: border-box;
        }

        .arena-hud-side {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
        }

        .arena-name-row {
            display: flex;
            align-items: center;
            gap: 4px;
            min-width: 0;
            overflow: hidden;
        }

        .arena-role-tag {
            font-size: 0.62rem;
            padding: 1px 4px;
            border-radius: 3px;
            border: 1px solid rgba(89, 133, 197, 0.4);
            color: #5985c5;
            font-family: 'Cinzel', serif;
            flex-shrink: 0;
        }

        .arena-fighter-name {
            font-size: clamp(0.8rem, 2.8vw, 1rem);
            margin: 0;
            color: var(--xp);
            font-family: 'Cinzel', serif;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0;
        }

        .hp-bar-container {
            background: #140407;
            height: 18px;
            width: 100%;
            border-radius: 3px;
            overflow: hidden;
            border: 1px solid #4a131b;
            position: relative;
            box-shadow: inset 0 0 6px rgba(0,0,0,0.9);
            margin-bottom: 2px;
        }

        .hp-bar-fill {
            height: 100%;
            width: 100%;
            transition: width 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .hp-boss-fill { background: linear-gradient(90deg, #500 0%, #c01020 50%, #ff1e2f 100%); }
        .hp-player-fill { background: linear-gradient(90deg, #0a1f44 0%, #1e5bb8 50%, #5985c5 100%); }

        .hp-bar-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.68rem;
            font-weight: bold;
            color: #fff;
            text-shadow: 1px 1px 2px #000, 0 0 4px #000;
            letter-spacing: 0.5px;
            pointer-events: none;
        }

        .arena-postura-row {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.65rem;
            color: #aaa;
            margin-top: 1px;
        }
        .arena-postura-track {
            flex: 1;
            height: 4px;
            background: rgba(0,0,0,0.8);
            border: 1px solid #442200;
            border-radius: 2px;
            overflow: hidden;
        }
        .arena-postura-fill {
            height: 100%;
            width: 100%;
            background: linear-gradient(90deg, #ffcc00, #ff3300);
            transition: width 0.2s ease;
        }
        .arena-postura-val {
            font-size: 0.65rem;
            color: #ffaa00;
            font-weight: bold;
            min-width: 28px;
            text-align: right;
        }

        #arena-alerta-visceral {
            background: rgba(255, 230, 0, 0.15);
            border: 1px solid #ffff00;
            border-radius: 3px;
            color: #ffff00;
            font-weight: bold;
            font-size: 0.68rem;
            text-shadow: 0 0 8px #ff0000;
            animation: visceralPulseGlow 0.6s infinite alternate;
            padding: 1px 4px;
            text-align: center;
            margin-top: 2px;
        }

        /* Palco Central do Inimigo */
        .inimigo-container {
            flex: 1 1 auto;
            min-height: 0;
            width: 100%;
            max-width: 650px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            padding: 2px 0;
            overflow: hidden;
            z-index: 5;
        }

        .arena-pedestal-shadow {
            position: absolute;
            bottom: 25%;
            width: min(70vw, 280px);
            height: 28px;
            background: radial-gradient(ellipse at center, rgba(138, 3, 3, 0.45) 0%, rgba(50, 0, 5, 0.2) 50%, transparent 80%);
            border-radius: 50%;
            pointer-events: none;
        }

        #arena-threat-level {
            position: absolute;
            top: 4px;
            left: 4px;
            font-family: 'Cinzel', serif;
            font-size: 0.7rem;
            font-weight: bold;
            background: rgba(10, 2, 4, 0.85);
            color: var(--ouro);
            padding: 2px 7px;
            border: 1px solid #331518;
            border-radius: 4px;
            backdrop-filter: blur(4px);
            z-index: 10;
        }

        .inimigo-sprite {
            font-size: clamp(3rem, 8.5vh, 5.2rem);
            line-height: 1;
            text-shadow: 0 0 25px var(--sangue);
            transition: transform 0.15s, filter 0.25s;
            user-select: none;
            z-index: 10;
            filter: drop-shadow(0 6px 12px rgba(0,0,0,0.8));
            animation: spriteFloat 3s ease-in-out infinite alternate;
        }

        @keyframes spriteFloat {
            0% { transform: translateY(0); }
            100% { transform: translateY(-5px); }
        }

        .inimigo-intent {
            margin-top: 4px;
            font-family: 'Cinzel', serif;
            font-size: clamp(0.78rem, 2.2vh, 0.95rem);
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            text-shadow: 0 0 8px #000;
            z-index: 10;
            background: rgba(0,0,0,0.6);
            padding: 1px 8px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.08);
        }

        .intent-idle { color: #888; }
        .intent-ataque { color: #ff1e2f; animation: pulseRed 0.3s infinite; transform: scale(1.15); filter: drop-shadow(0 0 30px red);}
        .intent-magia { color: #d080ff; animation: pulsePurple 0.5s infinite; transform: scale(1.15); filter: drop-shadow(0 0 30px purple);}
        .intent-vulneravel { color: #0f5; text-shadow: 0 0 20px #0f5; filter: drop-shadow(0 0 20px #0f5) grayscale(1); transform: rotate(10deg);}
        .intent-sync { color: #fff; animation: pulseCyan 0.2s infinite; letter-spacing: 5px; }

        .arena-combo-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-top: 4px;
            font-family: 'Cinzel', serif;
            font-size: 0.72rem;
            color: var(--ouro);
            background: rgba(20, 5, 8, 0.75);
            border: 1px solid var(--ouro-sombra);
            padding: 1px 8px;
            border-radius: 10px;
            z-index: 10;
        }
        .combo-label { font-size: 0.65rem; color: #aaa; letter-spacing: 1px; }
        .combo-count { font-size: 1rem; font-weight: bold; color: #fff; text-shadow: 0 0 8px var(--ouro); }

        /* Deck de Controles de Ação */
        .arena-controls-deck {
            width: 100%;
            max-width: 600px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            position: relative;
            z-index: 10;
            flex-shrink: 0;
            box-sizing: border-box;
        }

        /* Fita de Telemetria / Feedback */
        .arena-feedback-box {
            background: rgba(14, 4, 7, 0.92);
            border: 1px solid var(--sangue);
            border-radius: 5px;
            padding: 2px 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 6px;
            box-shadow: 0 0 10px rgba(0,0,0,0.8) inset;
            height: 28px;
            box-sizing: border-box;
        }

        #arena-feedback {
            font-weight: bold;
            font-size: clamp(0.72rem, 2.5vw, 0.85rem);
            text-shadow: 0 0 5px #000;
            color: #888;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
            min-width: 0;
        }

        #arena-ciclo-timer {
            color: #aaa;
            font-size: 0.7rem;
            white-space: nowrap;
            flex-shrink: 0;
            background: rgba(0,0,0,0.5);
            padding: 1px 5px;
            border-radius: 3px;
            border: 1px solid #331518;
        }

        /* Grade de Poderes Akáshicos */
        .arena-habs-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
            width: 100%;
        }

        .btn-hab-akashic {
            background: linear-gradient(180deg, #200835 0%, #0d0218 100%) !important;
            border: 1px solid #9333ea !important;
            border-radius: 4px !important;
            color: #fff !important;
            padding: 2px 2px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            height: 32px !important;
            min-height: 32px !important;
            box-shadow: 0 0 6px rgba(147, 51, 234, 0.3) !important;
            box-sizing: border-box !important;
        }
        .btn-hab-akashic span:first-child { font-size: 0.82rem !important; line-height: 1; }
        .btn-hab-akashic span:nth-child(2) { font-size: 0.6rem !important; max-width: 75px !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .btn-hab-akashic span:last-child { font-size: 0.55rem !important; }

        /* Ações Viscerais */
        .arena-viscerais-row {
            display: flex;
            gap: 4px;
            justify-content: center;
            align-items: center;
            width: 100%;
        }

        .btn-action-visceral {
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
        }

        .btn-visceral-fatal {
            background: linear-gradient(180deg, #990000 0%, #440000 100%) !important;
            border-color: #ffff00 !important;
            color: #ffff00 !important;
            animation: visceralPulseGlow 0.5s infinite alternate !important;
        }

        /* Botões Principais de Combate */
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

if (!html.includes(oldCombatCss)) {
    console.error('ERROR: oldCombatCss not found!');
} else {
    html = html.replace(oldCombatCss, newCombatCss);
    console.log('5. Combat CSS replaced.');
}

// 6. Arena HTML (lines ~2199-2263)
const oldArenaHtml = `    <!-- A ARENA VISCERAL DE COMBATE EM TEMPO REAL -->
    <div id="arena-acao" class="oculto">
        <div class="arena-hud">
            <div style="text-align: left;">
                <h3 style="color: var(--xp); margin:0; font-size: 1.2rem;" id="arena-jogador-nome">O Teu Sangue</h3>
                <div class="hp-bar-container"><div id="arena-player-hp-bar" class="hp-bar-fill hp-player-fill"></div></div>
                <div style="color: #888; font-size: 0.9rem;"><span id="arena-player-hp-text">1000</span> HP</div>
            </div>
            <div style="text-align: right;">
                <h3 style="color: var(--sangue-claro); margin:0; font-size: 1.2rem;" id="arena-alvo-nome">Entidade</h3>
                <div class="hp-bar-container"><div id="arena-boss-hp-bar" class="hp-bar-fill hp-boss-fill"></div></div>
                <div style="color: #888; font-size: 0.85rem; display:flex; justify-content:space-between;">
                    <span>HP: <span id="arena-boss-hp-text">1000</span></span>
                    <span style="color: #ffaa00;">Postura: <span id="arena-boss-postura-text">100</span>%</span>
                </div>
                <div style="height: 6px; background: rgba(0,0,0,0.8); border: 1px solid #442200; border-radius: 3px; overflow: hidden; margin-top: 2px;">
                    <div id="arena-boss-postura-bar" style="height: 100%; width: 100%; background: linear-gradient(90deg, #ffcc00, #ff3300); transition: width 0.2s ease;"></div>
                </div>
                <div id="arena-alerta-visceral" class="oculto" style="color: #ffff00; font-weight: bold; font-size: 0.8rem; text-shadow: 0 0 10px #ff0000; animation: visceralPulseGlow 0.6s infinite alternate; margin-top: 3px; text-align: center;">
                    ⚡ GUARDA QUEBRADA! GOLPE VISCERAL DISPONÍVEL!
                </div>
            </div>
        </div>
        
        <div class="inimigo-container" id="inimigo-zona" style="margin-bottom: 5px; flex: 1;">
            <div id="arena-threat-level" style="position:absolute; top: 10px; font-family: 'Cinzel', serif; font-size: 0.9em; font-weight: bold; background: rgba(0,0,0,0.8); padding: 5px 10px; border: 1px solid #333; border-radius: 5px;">Ameaça: Calculando...</div>
            <div class="inimigo-sprite" id="inimigo-icone">👹</div>
            <div class="inimigo-intent intent-idle" id="inimigo-status">A Espreitar...</div>
            <div style="color: var(--ouro); font-size: 1.2rem; font-family:'Cinzel',serif; text-shadow: 0 0 10px #000; margin-top:15px; z-index: 100006;">COMBO BRUTAL: <span id="arena-combo" style="font-size:2.5rem; color:#fff;">0</span></div>
        </div>
		
		<div id="seletor-alvo-pvp" class="oculto" style="margin-top: 10px; text-align: center; width: 100%;">
            <div style="font-size: 0.8em; color: var(--sangue-claro); margin-bottom: 3px; font-weight: bold;">ESCOLHE O TEU ALVO:</div>
            <select id="lista-alvos-pvp-dungeon" style="width: 80%; background: #110; border: 1px solid red; color: #fff; padding: 5px; font-family: 'Cinzel', serif;" onchange="combateAlvoId = this.value"></select>
        </div>

        <div style="max-width: 600px; width: 100%; margin: 0 auto; padding-bottom: 20px; z-index: 100005; position: relative; flex-shrink: 0;">
            
            <div style="background: #0a0202; border: 1px solid var(--sangue); border-radius: 5px; padding: 10px; margin-bottom: 15px; text-align: center; min-height: 60px; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 0 15px #000 inset;">
                <div id="arena-feedback" style="font-weight:bold; font-size:1.2rem; text-shadow: 0 0 5px #000; color: #888;">A LUTA COMEÇA!</div>
                <div id="arena-ciclo-timer" style="margin-top:5px; color:#aaa; font-size:0.8rem;">Próxima Sincronização: 10s</div>
            </div>
            
            <div id="arena-habilidades-dinamicas" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 10px;">
                <!-- Preenchido via JS -->
            </div>
            
            
            <div id="arena-acoes-viscerais" style="display: flex; gap: 6px; justify-content: center; margin-bottom: 8px; flex-wrap: wrap;">
                <button class="btn" style="padding: 6px 12px; font-size: 0.8rem; background: #2c1216; border: 1px solid var(--sangue);" onclick="executarAcaoCombateAvancada('golpe_pesado')">💥 Golpe Pesado (-Postura)</button>
                <button class="btn" style="padding: 6px 12px; font-size: 0.8rem; background: #1a1a2e; border: 1px solid #5985c5;" onclick="executarAcaoCombateAvancada('parry_perfeito')">🛡️ Parada & Contra-Golpe</button>
                <button id="btn-arena-visceral" class="btn oculto" style="padding: 6px 14px; font-size: 0.85rem;" onclick="executarAcaoCombateAvancada('golpe_visceral')">🩸 GOLPE VISCERAL FATAL (3.5x)</button>
                <button class="btn" style="padding: 6px 12px; font-size: 0.8rem; background: #0b1a1a; border: 1px solid #00e1d9;" onclick="executarMagiaCodigoNoCombate()">⚡ Magia em Código</button>
            </div>
            
            <div class="arena-botoes">
                <button id="btn-atk-tut" class="btn-combat" style="border-color: red;" onclick="acaoVisceral('ataque')">⚔️ CORTAR</button>
                <button id="btn-def-tut" class="btn-combat" style="border-color: gray;" onclick="acaoVisceral('defesa')">🛡️ PARRY</button>
                <button id="btn-mag-tut" class="btn-combat" style="border-color: purple;" onclick="acaoVisceral('magia')">🔮 DISSIPAR</button>
            </div>
            
            <button class="btn-heal-combat" onclick="curarNoCombate()">🩸 BEBER DO CÁLICE (Curar HP)</button>
            <button id="btn-flee-tut" class="btn-flee" onclick="abortarCombateManual()">Recuar das Brumas (Fugir)</button>
            
        </div>
    </div>`;

const newArenaHtml = `    <!-- A ARENA VISCERAL DE COMBATE EM TEMPO REAL -->
    <div id="arena-acao" class="oculto">
        <!-- AMBIÊNCIA GÓTICA E VISCERAL DE COMBATE (Fim do Fundo Vazio) -->
        <div class="arena-ambient-bg" aria-hidden="true">
            <div class="arena-rune-circle"></div>
            <div class="arena-blood-mist"></div>
        </div>

        <!-- 1. HUD SUPERIOR DE COMBATE (COMPACTO, RESPONSIVO, SEM QUEBRA) -->
        <div class="arena-hud">
            <!-- LADO DO JOGADOR -->
            <div class="arena-hud-side arena-hud-player">
                <div class="arena-name-row">
                    <span class="arena-role-tag">🩸 Tu</span>
                    <h3 class="arena-fighter-name" id="arena-jogador-nome">O Teu Sangue</h3>
                </div>
                <div class="hp-bar-container">
                    <div id="arena-player-hp-bar" class="hp-bar-fill hp-player-fill"></div>
                    <span class="hp-bar-overlay"><span id="arena-player-hp-text">1000</span> HP</span>
                </div>
            </div>

            <!-- LADO DO INIMIGO / ENTIDADE -->
            <div class="arena-hud-side arena-hud-enemy">
                <div class="arena-name-row" style="justify-content: flex-end;">
                    <h3 class="arena-fighter-name" id="arena-alvo-nome" style="color: var(--sangue-claro);">Entidade</h3>
                    <span class="arena-role-tag" style="border-color: var(--sangue); color: var(--sangue-claro);">💀 Alvo</span>
                </div>
                <div class="hp-bar-container">
                    <div id="arena-boss-hp-bar" class="hp-bar-fill hp-boss-fill"></div>
                    <span class="hp-bar-overlay">HP: <span id="arena-boss-hp-text">1000</span></span>
                </div>
                <div class="arena-postura-row">
                    <span>Postura</span>
                    <div class="arena-postura-track">
                        <div id="arena-boss-postura-bar" class="arena-postura-fill"></div>
                    </div>
                    <span class="arena-postura-val"><span id="arena-boss-postura-text">100</span>%</span>
                </div>
                <div id="arena-alerta-visceral" class="oculto">
                    ⚡ GUARDA QUEBRADA! GOLPE VISCERAL DISPONÍVEL!
                </div>
            </div>
        </div>
        
        <!-- 2. PALCO DO INIMIGO (CENTRO FLEXÍVEL, NUNCA FORÇA SCROLL) -->
        <div class="inimigo-container" id="inimigo-zona">
            <div class="arena-pedestal-shadow"></div>
            <div id="arena-threat-level">Ameaça: Calculando...</div>
            <div class="inimigo-sprite" id="inimigo-icone">👹</div>
            <div class="inimigo-intent intent-idle" id="inimigo-status">A Espreitar...</div>
            <div class="arena-combo-badge">
                <span class="combo-label">COMBO</span>
                <span id="arena-combo" class="combo-count">0</span>
            </div>
        </div>
		
		<div id="seletor-alvo-pvp" class="oculto" style="width: 100%; max-width: 600px; text-align: center; margin-bottom: 4px; z-index: 10;">
            <div style="font-size: 0.72rem; color: var(--sangue-claro); margin-bottom: 2px; font-weight: bold;">ESCOLHE O TEU ALVO:</div>
            <select id="lista-alvos-pvp-dungeon" style="width: 80%; max-width: 320px; background: #110; border: 1px solid red; color: #fff; padding: 4px; font-family: 'Cinzel', serif; font-size: 0.75rem;" onchange="combateAlvoId = this.value"></select>
        </div>

        <!-- 3. DECK TÁTICO DE COMBATE (BASE COMPACTA, ZERO SCROLL) -->
        <div class="arena-controls-deck">
            
            <!-- FEEDBACK E TELEMETRIA DA BATALHA -->
            <div class="arena-feedback-box">
                <div id="arena-feedback">A LUTA COMEÇA!</div>
                <div id="arena-ciclo-timer">10s</div>
            </div>
            
            <!-- PODERES AKÁSHICOS DINÂMICOS -->
            <div id="arena-habilidades-dinamicas" class="arena-habs-grid">
                <!-- Preenchido via JS -->
            </div>
            
            <!-- AÇÕES VISCERAIS ESPECIAIS -->
            <div id="arena-acoes-viscerais" class="arena-viscerais-row">
                <button class="btn btn-action-visceral" style="background: #2c1216; border: 1px solid var(--sangue);" onclick="executarAcaoCombateAvancada('golpe_pesado')">💥 Golpe Pesado</button>
                <button class="btn btn-action-visceral" style="background: #1a1a2e; border: 1px solid #5985c5;" onclick="executarAcaoCombateAvancada('parry_perfeito')">🛡️ Parada & Contra</button>
                <button id="btn-arena-visceral" class="btn btn-action-visceral btn-visceral-fatal oculto" onclick="executarAcaoCombateAvancada('golpe_visceral')">🩸 VISCERAL (3.5x)</button>
                <button class="btn btn-action-visceral" style="background: #0b1a1a; border: 1px solid #00e1d9;" onclick="executarMagiaCodigoNoCombate()">⚡ Magia Código</button>
            </div>
            
            <!-- TRÍADE PRINCIPAL DE COMBATE (CORTAR / PARRY / DISSIPAR) -->
            <div class="arena-botoes">
                <button id="btn-atk-tut" class="btn-combat btn-combat-atk" onclick="acaoVisceral('ataque')">⚔️ CORTAR</button>
                <button id="btn-def-tut" class="btn-combat btn-combat-def" onclick="acaoVisceral('defesa')">🛡️ PARRY</button>
                <button id="btn-mag-tut" class="btn-combat btn-combat-mag" onclick="acaoVisceral('magia')">🔮 DISSIPAR</button>
            </div>
            
            <!-- LINHA UTILITÁRIA DUPLA (CURAR NO CÁLICE + RECUAR/FUGIR) -->
            <div class="arena-util-row">
                <button class="btn-heal-combat" onclick="curarNoCombate()">🩸 Beber Cálice (Curar HP)</button>
                <button id="btn-flee-tut" class="btn-flee" onclick="abortarCombateManual()">Recuar das Brumas (Fugir)</button>
            </div>
            
        </div>
    </div>`;

if (!html.includes(oldArenaHtml)) {
    console.error('ERROR: oldArenaHtml not found!');
} else {
    html = html.replace(oldArenaHtml, newArenaHtml);
    console.log('6. Arena HTML replaced.');
}

// 7. World ticker & Desktop HUD HTML (lines ~2291-2315)
const oldHudHtml = `        <div class="world-ticker">
            <span class="ticker-text" id="world-ticker">As brumas encobrem a história do mundo.</span>
            <div style="position: absolute; right: 10px; top: 2px; z-index: 1001; display: flex; gap: 5px;">
                <button id="btn-top-consciencias" onclick="abrirConsciencias()" style="background: transparent; border: 1px solid var(--magia); color: var(--magia); padding: 2px 8px; font-size: 0.7em; width: auto; margin:0;">🌌 Consciências</button>
                <button id="btn-top-settings" onclick="abrirSettings()" style="background: transparent; border: 1px solid #777; color: #ccc; padding: 2px 8px; font-size: 0.7em; width: auto; margin:0;">⚙️ Opções</button>
                <button id="btn-tts" onclick="toggleTTS()" style="background: transparent; border: 1px solid var(--ouro); color: var(--ouro); padding: 2px 8px; font-size: 0.7em; width: auto; margin:0;">🔊 Voz IA</button>
                <button id="btn-voip" onclick="toggleVOIP()" style="background: transparent; border: 1px solid #0f5; color: #0f5; padding: 2px 8px; font-size: 0.7em; width: auto; margin:0;">🎤 Rádio OFF</button>
            </div>
        </div> 
        <header id="desktop-hud" class="card" style="padding: 10px 15px; border-bottom: 2px solid var(--sangue);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <div>
                    <h3 id="ui-meu-nome" style="margin:0; font-size: 1.5rem; text-shadow: 0 0 5px #000;"></h3>
                    <div style="font-size: 0.85em; color:var(--ouro); margin-bottom: 5px;">[<span id="ui-titulo">Sangue Frio</span>]</div>
                    <div style="font-size: 0.9em; color:#888;">Grau <span id="ui-nivel" class="xp-text"></span> | <span id="ui-patente" style="color:#d4af37;"></span></div>
                    <div style="font-size: 0.9em; color:#d080ff; font-weight:bold; margin-top: 5px;">👁️ Poder Avaliado: <span id="ui-poder-geral">0</span></div>
                </div>
                <div style="text-align: right;">
                    <h2 style="margin:0; color: #ff5050;">♥ <span id="ui-hp-atual">100</span>/<span id="ui-hp-max">100</span></h2>
                    <div style="font-size: 1.1em; font-family: 'Cinzel'; margin-top:3px;"><span id="ui-sangue" class="destaque"></span><span style="font-size:0.6em; color:#666;"> Gts Ouro</span></div>
                    <div style="font-size: 0.85em; color:#888;">Fúria: <span id="ui-acao" class="ouro"></span>/<span id="ui-max-acao"></span></div>
                    <div onclick="nav('banco')" style="cursor:pointer; font-size:0.82em; color:var(--sangue-claro); margin-top:3px; background:rgba(30,5,10,0.8); border:1px solid rgba(255,30,47,0.3); border-radius:4px; padding:2px 8px; display:inline-block;" title="Clique para abrir o Cálice de Sangue">🍷 Cálice: <b id="hdr-calice" style="color:#fff;">0</b> Gts <span style="font-size:0.75em; color:var(--ouro);">(+2%)</span></div>
                </div>
            </div>`;

const newHudHtml = `        <div class="world-ticker">
            <span class="ticker-text" id="world-ticker">As brumas encobrem a história do mundo.</span>
            <div class="world-ticker-actions">
                <button id="btn-top-consciencias" onclick="abrirConsciencias()" style="background: transparent; border: 1px solid var(--magia); color: var(--magia);" title="4 Consciências">🌌 Consc</button>
                <button id="btn-top-settings" onclick="abrirSettings()" style="background: transparent; border: 1px solid #777; color: #ccc;" title="Opções">⚙️ Opções</button>
                <button id="btn-tts" onclick="toggleTTS()" style="background: transparent; border: 1px solid var(--ouro); color: var(--ouro);" title="Voz IA">🔊 Voz</button>
                <button id="btn-voip" onclick="toggleVOIP()" style="background: transparent; border: 1px solid #0f5; color: #0f5;" title="Rádio">🎤 Rádio</button>
            </div>
        </div> 
        <header id="desktop-hud" class="card" style="padding: 10px 15px; border-bottom: 2px solid var(--sangue);">
            <div class="hud-main-grid">
                <div class="hud-player-profile">
                    <h3 id="ui-meu-nome" style="margin:0; font-size: 1.5rem; text-shadow: 0 0 5px #000;"></h3>
                    <div style="font-size: 0.85em; color:var(--ouro); margin-bottom: 3px;">[<span id="ui-titulo">Sangue Frio</span>]</div>
                    <div style="font-size: 0.88em; color:#888;">Grau <span id="ui-nivel" class="xp-text"></span> | <span id="ui-patente" style="color:#d4af37;"></span></div>
                    <div style="font-size: 0.88em; color:#d080ff; font-weight:bold; margin-top: 3px;">👁️ Poder: <span id="ui-poder-geral">0</span></div>
                </div>
                <div class="hud-player-vitals">
                    <h2 style="margin:0; color: #ff5050;">♥ <span id="ui-hp-atual">100</span>/<span id="ui-hp-max">100</span></h2>
                    <div style="font-size: 1.05em; font-family: 'Cinzel'; margin-top:2px;"><span id="ui-sangue" class="destaque"></span><span style="font-size:0.6em; color:#666;"> Gts</span></div>
                    <div style="font-size: 0.82em; color:#888;">Fúria: <span id="ui-acao" class="ouro"></span>/<span id="ui-max-acao"></span></div>
                    <div onclick="nav('banco')" class="hud-calice-pill" style="cursor:pointer; font-size:0.8em; color:var(--sangue-claro); margin-top:2px; background:rgba(30,5,10,0.8); border:1px solid rgba(255,30,47,0.3); border-radius:4px; padding:2px 6px; display:inline-block;" title="Clique para abrir o Cálice de Sangue">🍷 Cálice: <b id="hdr-calice" style="color:#fff;">0</b> Gts <span style="font-size:0.75em; color:var(--ouro);">(+2%)</span></div>
                </div>
            </div>`;

if (!html.includes(oldHudHtml)) {
    console.error('ERROR: oldHudHtml not found!');
} else {
    html = html.replace(oldHudHtml, newHudHtml);
    console.log('7. HUD and Ticker HTML replaced.');
}

// 8. JS iniciarCombateVisceral - zero forced scrolling
const oldScrollLogic = `        // CORREÇÃO: Abre a Arena e dá espaço extra de Scroll apenas se estiver em Modo Tutorial
        document.querySelectorAll('#arena-acao').forEach(el => {
            el.classList.remove('oculto');
            if (typeof passoAtualGuia !== 'undefined' && passoAtualGuia < passosGuiaInterativo.length) {
                el.style.overflowY = "auto";
                el.style.paddingBottom = "300px"; // Muito espaço no fundo para não cobrir o botão de recuar
            } else {
                el.style.overflowY = "hidden";
                el.style.paddingBottom = "10px";
            }
        });`;

const newScrollLogic = `        // Arena Responsiva 100dvh: Sem rolagem forçada, cabe perfeitamente em qualquer tela
        document.querySelectorAll('#arena-acao').forEach(el => {
            el.classList.remove('oculto');
            el.style.overflowY = "hidden";
            el.style.paddingBottom = "0px";
        });`;

if (!html.includes(oldScrollLogic)) {
    console.error('ERROR: oldScrollLogic not found!');
} else {
    html = html.replace(oldScrollLogic, newScrollLogic);
    console.log('8. Combat JS scroll logic replaced.');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html! New length:', html.length);
