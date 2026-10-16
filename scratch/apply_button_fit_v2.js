const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
console.log('Original length:', html.length);

// 1. Upgrade renderizarHabilidadesArena
const oldRenderHabsStart = html.indexOf('function renderizarHabilidadesArena()');
if (oldRenderHabsStart !== -1) {
    const oldRenderHabsEnd = html.indexOf('async function usarPoderAkashicoArena', oldRenderHabsStart);
    if (oldRenderHabsEnd !== -1) {
        const newRenderHabs = `function renderizarHabilidadesArena() {
        const el = document.getElementById('arena-habilidades-dinamicas');
        if (!el) return;
        if (!meuVampiro || !meuVampiro.habilidadesAtivas || meuVampiro.habilidadesAtivas.length === 0) {
            el.innerHTML = \`<div style="grid-column: span 4; font-size:0.72rem; color:#888; text-align:center; padding:6px; background:rgba(20,5,10,0.5); border:1px dashed #4a131b; border-radius:6px; font-family:'Cinzel', serif;">Nenhum poder akáshico equipado no Grimório</div>\`;
            return;
        }
        el.innerHTML = meuVampiro.habilidadesAtivas.map(h => {
            const furia = h.custoFuria || 2;
            const gts = h.custoGts || 50;
            const cor = h.cor_hex || '#9333ea';
            return \`<button class="btn-hab-akashic" onclick="usarPoderAkashicoArena('\${h.id}')" title="\${h.nome} - Custo: \${furia} Fúria, \${gts} Gts" style="--hab-cor:\${cor};">
                <span class="hab-furia-pill">\${furia}⚡</span>
                <span class="hab-icon">\${h.icone || '🔮'}</span>
                <span class="hab-name">\${h.nome}</span>
                <span class="hab-cost">\${gts}🩸</span>
            </button>\`;
        }).join('');
    }

    `;
        html = html.substring(0, oldRenderHabsStart) + newRenderHabs + html.substring(oldRenderHabsEnd);
        console.log('✅ 1. renderizarHabilidadesArena successfully updated with card-slot architecture.');
    } else {
        console.error('⚠️ Could not find end of renderizarHabilidadesArena');
    }
} else {
    console.error('⚠️ Could not find function renderizarHabilidadesArena');
}

// 2. Upgrade deck buttons HTML
const deckStart = html.indexOf('<!-- AÇÕES VISCERAIS ESPECIAIS');
if (deckStart !== -1) {
    const deckEnd = html.indexOf('</div>\n    </div>\n\t\n\t<!-- Ritual Camara', deckStart);
    if (deckEnd !== -1) {
        const newDeckHtml = `<!-- AÇÕES VISCERAIS ESPECIAIS (GRID 2x2 ERGONÔMICO MODERNO) -->
            <div id="arena-acoes-viscerais" class="arena-viscerais-row">
                <button class="btn btn-action-visceral btn-visceral-pesado" onclick="executarAcaoCombateAvancada('golpe_pesado')">
                    <span class="btn-v-icon">💥</span>
                    <div class="btn-v-body">
                        <span class="btn-v-title">Golpe Pesado</span>
                        <span class="btn-v-sub">Quebra Postura</span>
                    </div>
                </button>
                <button class="btn btn-action-visceral btn-visceral-parry" onclick="executarAcaoCombateAvancada('parry_perfeito')">
                    <span class="btn-v-icon">🛡️</span>
                    <div class="btn-v-body">
                        <span class="btn-v-title">Parada & Contra</span>
                        <span class="btn-v-sub">Bloqueio & Parry</span>
                    </div>
                </button>
                <button id="btn-arena-visceral" class="btn btn-action-visceral btn-visceral-fatal oculto" onclick="executarAcaoCombateAvancada('golpe_visceral')">
                    <span class="btn-v-icon">🩸</span>
                    <div class="btn-v-body">
                        <span class="btn-v-title">GOLPE VISCERAL</span>
                        <span class="btn-v-sub">Execução (3.5x)</span>
                    </div>
                </button>
                <button class="btn btn-action-visceral btn-visceral-codigo" onclick="executarMagiaCodigoNoCombate()">
                    <span class="btn-v-icon">⚡</span>
                    <div class="btn-v-body">
                        <span class="btn-v-title">Magia do Código</span>
                        <span class="btn-v-sub">Conjuração IA</span>
                    </div>
                </button>
            </div>
            
            <!-- TRÍADE PRINCIPAL DE COMBATE (CORTAR / PARRY / DISSIPAR) -->
            <div class="arena-botoes">
                <button id="btn-atk-tut" class="btn-combat btn-combat-atk" onclick="acaoVisceral('ataque')">
                    <span class="btn-c-icon">⚔️</span>
                    <span class="btn-c-label">CORTAR</span>
                    <span class="btn-c-sub">Ataque</span>
                </button>
                <button id="btn-def-tut" class="btn-combat btn-combat-def" onclick="acaoVisceral('defesa')">
                    <span class="btn-c-icon">🛡️</span>
                    <span class="btn-c-label">PARRY</span>
                    <span class="btn-c-sub">Defesa</span>
                </button>
                <button id="btn-mag-tut" class="btn-combat btn-combat-mag" onclick="acaoVisceral('magia')">
                    <span class="btn-c-icon">🔮</span>
                    <span class="btn-c-label">DISSIPAR</span>
                    <span class="btn-c-sub">Magia</span>
                </button>
            </div>
            
            <!-- LINHA UTILITÁRIA DUPLA (CURAR NO CÁLICE + RECUAR/FUGIR) -->
            <div class="arena-util-row">
                <button id="btn-heal-combat" class="btn-heal-combat" onclick="curarNoCombate()">
                    <span class="btn-u-icon">🍷</span>
                    <div class="btn-u-body">
                        <span class="btn-u-title">Beber Cálice</span>
                        <span class="btn-u-sub">Curar Vida</span>
                    </div>
                </button>
                <button id="btn-flee-tut" class="btn-flee" onclick="abortarCombateManual()">
                    <span class="btn-u-icon">🚪</span>
                    <div class="btn-u-body">
                        <span class="btn-u-title">Recuar</span>
                        <span class="btn-u-sub">Fugir da Luta</span>
                    </div>
                </button>
            </div>
            
        `;
        html = html.substring(0, deckStart) + newDeckHtml + html.substring(deckEnd);
        console.log('✅ 2. Deck HTML updated with 2-tier sub-labels, icons, and body containers.');
    } else {
        console.error('⚠️ Could not find end of deck controls HTML');
    }
} else {
    console.error('⚠️ Could not find start of deck controls HTML');
}

// 3. Upgrade CSS styles
const cssMarker = '/* Grade de Poderes Akáshicos (Slot Moderno RPG) */';
const cssStart = html.indexOf(cssMarker);
if (cssStart !== -1) {
    const cssEnd = html.indexOf('.slash-effect {', cssStart);
    if (cssEnd !== -1) {
        const modernCss = `/* Grade de Poderes Akáshicos (Slot Moderno RPG) */
        .arena-habs-grid {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 5px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        .btn-hab-akashic {
            background: linear-gradient(180deg, #1f072e 0%, #0d0115 100%) !important;
            border: 1px solid var(--hab-cor, #9333ea) !important;
            border-radius: 7px !important;
            color: #fff !important;
            padding: 3px 2px 2px 2px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: space-between !important;
            cursor: pointer !important;
            height: 50px !important;
            min-height: 50px !important;
            max-height: 50px !important;
            min-width: 0 !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.6), 0 0 6px rgba(147, 51, 234, 0.25) !important;
            box-sizing: border-box !important;
            position: relative !important;
            overflow: hidden !important;
            transition: transform 0.12s, border-color 0.2s, box-shadow 0.2s !important;
            user-select: none !important;
        }

        .btn-hab-akashic:active {
            transform: scale(0.94) !important;
            border-color: #00e1d9 !important;
            box-shadow: 0 0 12px rgba(0, 225, 217, 0.4) !important;
        }

        .btn-hab-akashic .hab-furia-pill {
            position: absolute !important;
            top: 2px !important;
            right: 2px !important;
            font-size: 0.54rem !important;
            color: #f59e0b !important;
            background: rgba(0, 0, 0, 0.82) !important;
            padding: 1px 3px !important;
            border-radius: 3px !important;
            border: 1px solid rgba(245, 158, 11, 0.4) !important;
            font-weight: 700 !important;
            line-height: 1 !important;
            white-space: nowrap !important;
            z-index: 2 !important;
        }

        .btn-hab-akashic .hab-icon {
            font-size: 1.15rem !important;
            line-height: 1 !important;
            margin-top: 1px !important;
            filter: drop-shadow(0 0 4px rgba(147, 51, 234, 0.7)) !important;
        }

        .btn-hab-akashic .hab-name {
            font-size: clamp(0.58rem, 1.9vw, 0.68rem) !important;
            font-weight: 700 !important;
            color: #f3e8ff !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            width: 100% !important;
            max-width: 100% !important;
            line-height: 1.1 !important;
            text-align: center !important;
            font-family: 'Cinzel', serif !important;
            padding: 0 2px !important;
            box-sizing: border-box !important;
        }

        .btn-hab-akashic .hab-cost {
            font-size: 0.56rem !important;
            color: #ff6b6b !important;
            font-weight: 700 !important;
            line-height: 1 !important;
            white-space: nowrap !important;
            background: rgba(0, 0, 0, 0.65) !important;
            padding: 1px 4px !important;
            border-radius: 3px !important;
            border: 1px solid rgba(255, 30, 47, 0.25) !important;
        }

        /* Ações Viscerais (Grid 2x2 Ergonômico com Ícone + Coluna de Texto) */
        .arena-viscerais-row {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 5px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        .btn-action-visceral {
            flex: 1 1 calc(50% - 3px) !important;
            min-width: 130px !important;
            padding: 4px 8px !important;
            height: 38px !important;
            min-height: 38px !important;
            max-height: 38px !important;
            border-radius: 6px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 7px !important;
            box-sizing: border-box !important;
            cursor: pointer !important;
            text-shadow: 0 1px 2px #000 !important;
            transition: transform 0.1s, filter 0.15s, box-shadow 0.15s !important;
            user-select: none !important;
            overflow: hidden !important;
        }

        .btn-action-visceral:active {
            transform: scale(0.96) !important;
        }

        .btn-visceral-pesado {
            background: linear-gradient(180deg, #351015 0%, #170407 100%) !important;
            border: 1px solid var(--sangue) !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5), inset 0 0 8px rgba(138, 3, 3, 0.3) !important;
        }

        .btn-visceral-parry {
            background: linear-gradient(180deg, #151d30 0%, #080c16 100%) !important;
            border: 1px solid #486e9e !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5), inset 0 0 8px rgba(89, 133, 197, 0.25) !important;
        }

        .btn-visceral-fatal {
            background: linear-gradient(180deg, #9a0812 0%, #450207 100%) !important;
            border: 1px solid #ffd700 !important;
            box-shadow: 0 0 14px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(255, 0, 0, 0.6) !important;
            animation: visceralPulseGlow 0.6s infinite alternate !important;
        }

        .btn-visceral-codigo {
            background: linear-gradient(180deg, #092625 0%, #031212 100%) !important;
            border: 1px solid #00b3ad !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5), inset 0 0 8px rgba(0, 225, 217, 0.25) !important;
        }

        .btn-action-visceral .btn-v-icon {
            font-size: 1.15rem !important;
            line-height: 1 !important;
            flex-shrink: 0 !important;
            filter: drop-shadow(0 0 4px rgba(0,0,0,0.8)) !important;
        }

        .btn-action-visceral .btn-v-body {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: flex-start !important;
            min-width: 0 !important;
            flex: 1 !important;
            overflow: hidden !important;
            line-height: 1.15 !important;
        }

        .btn-action-visceral .btn-v-title {
            font-size: clamp(0.7rem, 2.3vw, 0.78rem) !important;
            font-weight: 700 !important;
            color: #fff !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            width: 100% !important;
            font-family: 'Cinzel', serif !important;
            letter-spacing: 0.3px !important;
        }

        .btn-action-visceral .btn-v-sub {
            font-size: 0.58rem !important;
            color: #ffaa55 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            width: 100% !important;
            font-weight: 600 !important;
            opacity: 0.9 !important;
            letter-spacing: 0.2px !important;
        }

        .btn-visceral-fatal .btn-v-title { color: #ffffaa !important; }
        .btn-visceral-fatal .btn-v-sub { color: #fff !important; }

        /* Botões Principais de Combate - Micro-Stack Ergonômico Tátil */
        .arena-botoes {
            display: grid !important;
            grid-template-columns: 1fr 1fr 1fr !important;
            gap: 6px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        .btn-combat {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 1px !important;
            height: 52px !important;
            min-height: 52px !important;
            max-height: 52px !important;
            padding: 3px 2px !important;
            border: 2px solid !important;
            border-radius: 7px !important;
            box-sizing: border-box !important;
            cursor: pointer !important;
            user-select: none !important;
            transition: all 0.12s ease !important;
            text-transform: uppercase !important;
            font-family: 'Cinzel', serif !important;
            overflow: hidden !important;
            min-width: 0 !important;
        }

        .btn-combat:active {
            transform: scale(0.94) !important;
            filter: brightness(1.3) !important;
        }

        .btn-combat .btn-c-icon {
            font-size: 1.15rem !important;
            line-height: 1 !important;
            filter: drop-shadow(0 0 5px rgba(0,0,0,0.9)) !important;
        }

        .btn-combat .btn-c-label {
            font-size: clamp(0.76rem, 2.6vw, 0.88rem) !important;
            font-weight: 900 !important;
            letter-spacing: 1px !important;
            line-height: 1.1 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            max-width: 100% !important;
        }

        .btn-combat .btn-c-sub {
            font-size: 0.54rem !important;
            font-weight: 700 !important;
            letter-spacing: 0.6px !important;
            line-height: 1 !important;
            opacity: 0.75 !important;
            white-space: nowrap !important;
            text-transform: uppercase !important;
        }

        .btn-combat-atk {
            background: linear-gradient(180deg, #2c050a 0%, #130103 100%) !important;
            border-color: #ff1e2f !important;
            color: #fff !important;
            box-shadow: 0 0 14px rgba(255, 30, 47, 0.3), inset 0 0 8px rgba(255, 30, 47, 0.2) !important;
            text-shadow: 0 0 8px rgba(255, 30, 47, 0.8) !important;
        }
        .btn-combat-def {
            background: linear-gradient(180deg, #181f2b 0%, #0a0d13 100%) !important;
            border-color: #7da6cf !important;
            color: #fff !important;
            box-shadow: 0 0 14px rgba(125, 166, 207, 0.3), inset 0 0 8px rgba(125, 166, 207, 0.2) !important;
            text-shadow: 0 0 8px rgba(125, 166, 207, 0.8) !important;
        }
        .btn-combat-mag {
            background: linear-gradient(180deg, #260c3b 0%, #0e0318 100%) !important;
            border-color: #b066ff !important;
            color: #fff !important;
            box-shadow: 0 0 14px rgba(176, 102, 255, 0.3), inset 0 0 8px rgba(176, 102, 255, 0.2) !important;
            text-shadow: 0 0 8px rgba(176, 102, 255, 0.8) !important;
        }

        /* Linha Utilitária Dupla */
        .arena-util-row {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        .btn-heal-combat, .btn-flee {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 7px !important;
            height: 38px !important;
            min-height: 38px !important;
            max-height: 38px !important;
            padding: 3px 8px !important;
            border-radius: 6px !important;
            font-family: 'Cinzel', serif !important;
            box-sizing: border-box !important;
            cursor: pointer !important;
            transition: all 0.12s ease !important;
            user-select: none !important;
            min-width: 0 !important;
            overflow: hidden !important;
        }

        .btn-heal-combat:active, .btn-flee:active {
            transform: scale(0.96) !important;
        }

        .btn-heal-combat {
            background: linear-gradient(180deg, #4f080e 0%, #200205 100%) !important;
            border: 1px solid var(--sangue-claro) !important;
            color: #fff !important;
            box-shadow: 0 0 10px rgba(255, 30, 47, 0.25) !important;
        }

        .btn-flee {
            background: linear-gradient(180deg, #1a080b 0%, #0a0204 100%) !important;
            border: 1px solid #663339 !important;
            color: #ddd !important;
        }

        .btn-heal-combat .btn-u-icon, .btn-flee .btn-u-icon {
            font-size: 1.1rem !important;
            line-height: 1 !important;
            flex-shrink: 0 !important;
        }

        .btn-heal-combat .btn-u-body, .btn-flee .btn-u-body {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: flex-start !important;
            min-width: 0 !important;
            overflow: hidden !important;
            line-height: 1.15 !important;
        }

        .btn-heal-combat .btn-u-title, .btn-flee .btn-u-title {
            font-size: clamp(0.7rem, 2.3vw, 0.78rem) !important;
            font-weight: 700 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            color: #fff !important;
            letter-spacing: 0.3px !important;
        }

        .btn-heal-combat .btn-u-sub, .btn-flee .btn-u-sub {
            font-size: 0.56rem !important;
            color: #ff9999 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            letter-spacing: 0.2px !important;
        }
        .btn-flee .btn-u-sub { color: #aaa !important; }
        
        `;
        html = html.substring(0, cssStart) + modernCss + html.substring(cssEnd);
        console.log('✅ 3. Combat buttons CSS updated with high-end responsive styling.');
    } else {
        console.error('⚠️ Could not find end of CSS block');
    }
} else {
    console.error('⚠️ Could not find start of CSS block');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Completed! New index.html length:', html.length);
