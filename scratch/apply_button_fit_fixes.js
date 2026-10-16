const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
console.log('Original length:', html.length);

// 1. Update renderizarHabilidadesArena with modern content structure
const oldRenderHabs = `        el.innerHTML = meuVampiro.habilidadesAtivas.map(h => {
            return \`<button class="btn-hab-akashic" onclick="usarPoderAkashicoArena('\${h.id}')" title="\${h.nome} - Custo: \${h.custoFuria || 2} Fúria, \${h.custoGts || 50} Gts">
                <span style="font-size:1.15rem;">\${h.icone || '🔮'}</span>
                <span style="font-size:0.72rem; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:85px;">\${h.nome}</span>
                <span style="font-size:0.65rem; color:#f59e0b;">\${h.custoFuria || 2}⚡|\${h.custoGts || 50}🩸</span>
            </button>\`;
        }).join('');`;

const newRenderHabs = `        el.innerHTML = meuVampiro.habilidadesAtivas.map(h => {
            return \`<button class="btn-hab-akashic" onclick="usarPoderAkashicoArena('\${h.id}')" title="\${h.nome} - Custo: \${h.custoFuria || 2} Fúria, \${h.custoGts || 50} Gts">
                <span class="hab-icon">\${h.icone || '🔮'}</span>
                <span class="hab-name">\${h.nome}</span>
                <span class="hab-cost">\${h.custoFuria || 2}⚡·\${h.custoGts || 50}🩸</span>
            </button>\`;
        }).join('');`;

if (html.includes(oldRenderHabs)) {
    html = html.replace(oldRenderHabs, newRenderHabs);
    console.log('✅ 1. renderizarHabilidadesArena updated with semantic classes.');
} else {
    console.error('⚠️ 1. oldRenderHabs not found directly, checking variations...');
    // regex fallback
    const rHabsRegex = /el\.innerHTML\s*=\s*meuVampiro\.habilidadesAtivas\.map\(h\s*=>\s*\{[\s\S]*?\}\)\.join\(''\);/;
    if (rHabsRegex.test(html)) {
        html = html.replace(rHabsRegex, newRenderHabs);
        console.log('✅ 1. renderizarHabilidadesArena updated via regex.');
    }
}

// 2. Update HTML of buttons inside .arena-controls-deck
const oldDeckControls = `            <!-- AÇÕES VISCERAIS ESPECIAIS -->
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
                <button id="btn-heal-combat" class="btn-heal-combat" onclick="curarNoCombate()">🩸 Beber Cálice (Curar HP)</button>
                <button id="btn-flee-tut" class="btn-flee" onclick="abortarCombateManual()">Recuar das Brumas (Fugir)</button>
            </div>`;

const newDeckControls = `            <!-- AÇÕES VISCERAIS ESPECIAIS (GRID 2x2 FLEXÍVEL MODERNO) -->
            <div id="arena-acoes-viscerais" class="arena-viscerais-row">
                <button class="btn btn-action-visceral" style="background: linear-gradient(180deg, #381318 0%, #1c070a 100%); border: 1px solid var(--sangue);" onclick="executarAcaoCombateAvancada('golpe_pesado')">
                    <span class="btn-v-icon">💥</span>
                    <span class="btn-v-title">Golpe Pesado</span>
                    <span class="btn-v-tag">(-Postura)</span>
                </button>
                <button class="btn btn-action-visceral" style="background: linear-gradient(180deg, #1b2238 0%, #0b101c 100%); border: 1px solid #5985c5;" onclick="executarAcaoCombateAvancada('parry_perfeito')">
                    <span class="btn-v-icon">🛡️</span>
                    <span class="btn-v-title">Parada & Contra</span>
                    <span class="btn-v-tag">(Parry)</span>
                </button>
                <button id="btn-arena-visceral" class="btn btn-action-visceral btn-visceral-fatal oculto" onclick="executarAcaoCombateAvancada('golpe_visceral')">
                    <span class="btn-v-icon">🩸</span>
                    <span class="btn-v-title">GOLPE VISCERAL</span>
                    <span class="btn-v-tag">(3.5x Dano)</span>
                </button>
                <button class="btn btn-action-visceral" style="background: linear-gradient(180deg, #0e2b29 0%, #051414 100%); border: 1px solid #00e1d9;" onclick="executarMagiaCodigoNoCombate()">
                    <span class="btn-v-icon">⚡</span>
                    <span class="btn-v-title">Magia em Código</span>
                    <span class="btn-v-tag">(IA)</span>
                </button>
            </div>
            
            <!-- TRÍADE PRINCIPAL DE COMBATE (CORTAR / PARRY / DISSIPAR) -->
            <div class="arena-botoes">
                <button id="btn-atk-tut" class="btn-combat btn-combat-atk" onclick="acaoVisceral('ataque')">
                    <span class="btn-c-icon">⚔️</span>
                    <span class="btn-c-label">CORTAR</span>
                </button>
                <button id="btn-def-tut" class="btn-combat btn-combat-def" onclick="acaoVisceral('defesa')">
                    <span class="btn-c-icon">🛡️</span>
                    <span class="btn-c-label">PARRY</span>
                </button>
                <button id="btn-mag-tut" class="btn-combat btn-combat-mag" onclick="acaoVisceral('magia')">
                    <span class="btn-c-icon">🔮</span>
                    <span class="btn-c-label">DISSIPAR</span>
                </button>
            </div>
            
            <!-- LINHA UTILITÁRIA DUPLA (CURAR NO CÁLICE + RECUAR/FUGIR) -->
            <div class="arena-util-row">
                <button id="btn-heal-combat" class="btn-heal-combat" onclick="curarNoCombate()">
                    <span class="btn-u-icon">🩸</span>
                    <span class="btn-u-text">Cálice (Curar HP)</span>
                </button>
                <button id="btn-flee-tut" class="btn-flee" onclick="abortarCombateManual()">
                    <span class="btn-u-icon">🚪</span>
                    <span class="btn-u-text">Recuar / Fugir</span>
                </button>
            </div>`;

if (html.includes(oldDeckControls)) {
    html = html.replace(oldDeckControls, newDeckControls);
    console.log('✅ 2. Deck buttons HTML updated with modern structured icons, titles and badges.');
} else {
    console.error('⚠️ 2. oldDeckControls not found directly!');
}

// 3. Update CSS styles for all combat buttons to make them modern, spacious and zero-cutoff
const oldButtonCssStart = `        /* Grade de Poderes Akáshicos */
        .arena-habs-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
            width: 100%;
        }`;

const oldButtonCssEnd = `        .btn-flee:hover {
            background: #19080b !important;
            border-color: #88444a !important;
        }`;

// Let's find from `/* Grade de Poderes Akáshicos */` to the end of `.btn-flee` block
const cssStartIdx = html.indexOf('/* Grade de Poderes Akáshicos */');
const cssEndIdx = html.indexOf('.slash-effect {', cssStartIdx);

if (cssStartIdx !== -1 && cssEndIdx !== -1) {
    const newButtonsCss = `/* Grade de Poderes Akáshicos (Slot Moderno RPG) */
        .arena-habs-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 5px;
            width: 100%;
            box-sizing: border-box;
        }

        .btn-hab-akashic {
            background: linear-gradient(180deg, #24083a 0%, #10021c 100%) !important;
            border: 1px solid #9333ea !important;
            border-radius: 6px !important;
            color: #fff !important;
            padding: 3px 4px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: space-between !important;
            cursor: pointer !important;
            height: 44px !important;
            min-height: 44px !important;
            box-shadow: 0 2px 8px rgba(147, 51, 234, 0.25) !important;
            box-sizing: border-box !important;
            position: relative !important;
            overflow: hidden !important;
            transition: transform 0.12s, border-color 0.2s, box-shadow 0.2s !important;
        }

        .btn-hab-akashic:active {
            transform: scale(0.94) !important;
            border-color: #00e1d9 !important;
        }

        .btn-hab-akashic .hab-icon {
            font-size: 1.05rem !important;
            line-height: 1 !important;
            filter: drop-shadow(0 0 4px rgba(147, 51, 234, 0.6));
        }

        .btn-hab-akashic .hab-name {
            font-size: clamp(0.6rem, 2vw, 0.72rem) !important;
            font-weight: 700 !important;
            color: #f3e8ff !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            max-width: 100% !important;
            line-height: 1.1 !important;
            text-align: center !important;
            font-family: 'Cinzel', serif !important;
        }

        .btn-hab-akashic .hab-cost {
            font-size: 0.58rem !important;
            color: #f59e0b !important;
            font-weight: 600 !important;
            letter-spacing: 0.5px !important;
            line-height: 1 !important;
            white-space: nowrap !important;
            background: rgba(0,0,0,0.5);
            padding: 1px 4px;
            border-radius: 3px;
        }

        /* Ações Viscerais (Grid 2x2 Flexível & Espaçoso - Zero Corte) */
        .arena-viscerais-row {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 5px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        .btn-action-visceral {
            flex: 1 1 calc(50% - 3px) !important;
            min-width: 0 !important;
            padding: 5px 8px !important;
            height: 34px !important;
            min-height: 34px !important;
            border-radius: 5px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 5px !important;
            box-sizing: border-box !important;
            cursor: pointer !important;
            text-shadow: 0 1px 2px #000 !important;
            transition: transform 0.1s, filter 0.15s !important;
        }

        .btn-action-visceral:active { transform: scale(0.96) !important; }

        .btn-action-visceral .btn-v-icon {
            font-size: 0.95rem !important;
            line-height: 1 !important;
            flex-shrink: 0 !important;
        }

        .btn-action-visceral .btn-v-title {
            font-size: clamp(0.72rem, 2.4vw, 0.82rem) !important;
            font-weight: bold !important;
            color: #fff !important;
            white-space: nowrap !important;
            font-family: 'Cinzel', serif !important;
        }

        .btn-action-visceral .btn-v-tag {
            font-size: 0.65rem !important;
            color: #ffaa55 !important;
            font-weight: normal !important;
            white-space: nowrap !important;
            opacity: 0.85 !important;
        }

        .btn-visceral-fatal {
            background: linear-gradient(180deg, #a0050e 0%, #4a0206 100%) !important;
            border-color: #ffff00 !important;
            color: #ffff00 !important;
            animation: visceralPulseGlow 0.5s infinite alternate !important;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.6) !important;
        }
        .btn-visceral-fatal .btn-v-tag { color: #ffffaa !important; }

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
            gap: 2px !important;
            height: 50px !important;
            min-height: 50px !important;
            padding: 4px 2px !important;
            border: 2px solid !important;
            border-radius: 6px !important;
            box-sizing: border-box !important;
            cursor: pointer !important;
            user-select: none !important;
            transition: all 0.12s ease !important;
            text-transform: uppercase !important;
            font-family: 'Cinzel', serif !important;
        }

        .btn-combat:active { transform: scale(0.94) !important; filter: brightness(1.3) !important; }

        .btn-combat .btn-c-icon {
            font-size: 1.25rem !important;
            line-height: 1 !important;
            filter: drop-shadow(0 0 6px rgba(0,0,0,0.8)) !important;
        }

        .btn-combat .btn-c-label {
            font-size: clamp(0.78rem, 2.7vw, 0.92rem) !important;
            font-weight: 900 !important;
            letter-spacing: 1px !important;
            line-height: 1.1 !important;
            white-space: nowrap !important;
        }

        .btn-combat-atk {
            background: linear-gradient(180deg, #2a0408 0%, #120103 100%) !important;
            border-color: #ff1e2f !important;
            color: #fff !important;
            box-shadow: 0 0 14px rgba(255, 30, 47, 0.3) !important;
            text-shadow: 0 0 8px rgba(255, 30, 47, 0.8) !important;
        }
        .btn-combat-def {
            background: linear-gradient(180deg, #181d26 0%, #0b0e14 100%) !important;
            border-color: #a0b2c6 !important;
            color: #fff !important;
            box-shadow: 0 0 14px rgba(160, 178, 198, 0.3) !important;
            text-shadow: 0 0 8px rgba(160, 178, 198, 0.8) !important;
        }
        .btn-combat-mag {
            background: linear-gradient(180deg, #240b38 0%, #0f0319 100%) !important;
            border-color: #b066ff !important;
            color: #fff !important;
            box-shadow: 0 0 14px rgba(176, 102, 255, 0.3) !important;
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
            gap: 6px !important;
            height: 36px !important;
            min-height: 36px !important;
            padding: 4px 8px !important;
            border-radius: 5px !important;
            font-family: 'Cinzel', serif !important;
            font-weight: 700 !important;
            font-size: clamp(0.75rem, 2.6vw, 0.85rem) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            box-sizing: border-box !important;
            cursor: pointer !important;
            transition: all 0.12s ease !important;
        }

        .btn-heal-combat:active, .btn-flee:active { transform: scale(0.96) !important; }

        .btn-heal-combat {
            background: linear-gradient(180deg, #52070c 0%, #240306 100%) !important;
            border: 1px solid var(--sangue-claro) !important;
            color: #fff !important;
            box-shadow: 0 0 10px rgba(255, 30, 47, 0.25) !important;
        }

        .btn-flee {
            background: linear-gradient(180deg, #18080b 0%, #0b0204 100%) !important;
            border: 1px solid #663339 !important;
            color: #ddd !important;
        }
        
        `;
    
    html = html.substring(0, cssStartIdx) + newButtonsCss + html.substring(cssEndIdx);
    console.log('✅ 3. Combat buttons CSS completely upgraded with modern responsive styling.');
} else {
    console.error('⚠️ 3. CSS markers not found!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Finished updating index.html! New length:', html.length);
