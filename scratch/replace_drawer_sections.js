const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const startMarker = '<div id="mobile-drawer">';
const endMarker = '<!-- MODAL DAS 4 CONSCIÊNCIAS CÓSMICAS (IA) -->';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker, startIdx);

console.log('startIdx:', startIdx, 'endIdx:', endIdx);

if (startIdx === -1 || endIdx === -1) {
    console.error('ERROR: markers not found!');
    process.exit(1);
}

const newMobileDrawerHtml = `<div id="mobile-drawer">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--ouro-sombra); padding-bottom: 10px; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.35rem;">📜</span>
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
                <button class="dock-btn" onclick="nav('ordem'); fecharMobileDrawer();"><span style="color:#d4af37;">🏛️</span> Ordem Iniciática (0°-10°)</button>
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
                <button class="dock-btn" onclick="nav('clan'); fecharMobileDrawer();"><span>🛡️</span> Santuário da Ordem</button>
                <button class="dock-btn" onclick="nav('reinos'); fecharMobileDrawer();"><span>👑</span> Domínios & Reinos</button>
                <button class="dock-btn" onclick="nav('panteao'); fecharMobileDrawer();"><span>⚡</span> Panteão Divino</button>
                <button class="dock-btn" onclick="nav('social'); fecharMobileDrawer();"><span style="color:#ff79c6;">🐺</span> Social & Co-op (Comitivas)</button>
                <button class="dock-btn" onclick="nav('mundo2d'); fecharMobileDrawer();"><span style="color:#0f5;">🌌</span> Mundo 2D Sandbox</button>
            </div>

            <!-- SESSÃO 5: ARCANO SUPERIOR -->
            <div class="dock-category">
                <div class="dock-cat-header">ARCANO SUPERIOR</div>
                <button class="dock-btn" onclick="abrirConsciencias(); fecharMobileDrawer();"><span style="color:var(--magia);">🌌</span> 4 Consciências Cósmicas</button>
                <button class="dock-btn" onclick="abrirSettings(); fecharMobileDrawer();"><span>⚙️</span> Ajustes, Áudio & Gráficos</button>
            </div>
        </div>
    </div>

    `;

html = html.substring(0, startIdx) + newMobileDrawerHtml + html.substring(endIdx);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully replaced #mobile-drawer HTML! New length:', html.length);
