const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const startMarker = '<!-- A ARENA VISCERAL DE COMBATE EM TEMPO REAL -->';
const endMarker = '<!-- Ritual Camara movida para overlay absoluto';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker, startIdx);

console.log('startIdx:', startIdx, 'endIdx:', endIdx);

if (startIdx === -1 || endIdx === -1) {
    console.error('ERROR: markers not found!');
    process.exit(1);
}

const newArenaHtml = `<!-- A ARENA VISCERAL DE COMBATE EM TEMPO REAL -->
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
    </div>
	
	`;

html = html.substring(0, startIdx) + newArenaHtml + html.substring(endIdx);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully replaced Arena HTML! New length:', html.length);
