const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// =========================================================================
// 1. ADICIONAR BOTÃO SOCIAL NO NAVBAR
// =========================================================================
const navButtonTarget = `<button class="realm-pill" data-realm="mundo2d" onclick="nav('mundo2d', this)" title="Mundo Aberto 2D Sandbox & Construção de Reinos">
                    <span class="realm-icon">🌌</span>
                    <span class="realm-label">Mundo 2D</span>
                </button>`;

const socialNavButton = `<button class="realm-pill" data-realm="mundo2d" onclick="nav('mundo2d', this)" title="Mundo Aberto 2D Sandbox & Construção de Reinos">
                    <span class="realm-icon">🌌</span>
                    <span class="realm-label">Mundo 2D</span>
                </button>
                <button class="realm-pill" data-realm="social" onclick="nav('social', this)" title="Comitivas da Noite, Vínculos de Sangue, Mural de Contratos e Caldeirão Coletivo" style="border-color:#ff007f; color:#ff79c6;">
                    <span class="realm-icon">🐺</span>
                    <span class="realm-label">Social & Co-op</span>
                </button>`;

if (!html.includes('data-realm="social"')) {
    html = html.replace(navButtonTarget, socialNavButton);
}

// =========================================================================
// 2. CSS STYLES PARA A CAMADA SOCIAL
// =========================================================================
const socialStyles = `
/* =================================================== */
/* ESTILOS DA CAMADA SOCIAL, CO-OP & TRADE P2P         */
/* =================================================== */
.social-subnav {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    background: #090204;
    padding: 8px;
    border: 1px solid #331518;
    border-radius: 8px;
}
.social-subnav-btn {
    background: #140508;
    border: 1px solid #4a1820;
    color: #ccc;
    padding: 8px 14px;
    border-radius: 6px;
    font-family: 'Cinzel', serif;
    font-size: 0.82rem;
    cursor: pointer;
    transition: all 0.2s;
}
.social-subnav-btn:hover {
    border-color: #ff007f;
    color: #fff;
    transform: translateY(-1px);
}
.social-subnav-btn.active {
    background: linear-gradient(135deg, #40051a 0%, #1a0208 100%);
    border-color: #ff007f;
    color: #ff79c6;
    box-shadow: 0 0 10px rgba(255, 0, 127, 0.35);
}
.party-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
    margin-top: 12px;
}
.party-card {
    background: linear-gradient(180deg, #120408 0%, #080103 100%);
    border: 1px solid #4a1520;
    border-radius: 8px;
    padding: 12px;
    position: relative;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    transition: all 0.2s;
}
.party-card:hover {
    border-color: #ff79c6;
}
.party-card.is-leader {
    border-color: #d4af37;
    box-shadow: 0 0 12px rgba(212, 175, 55, 0.2);
}
.party-hp-bar {
    height: 8px;
    background: #200508;
    border-radius: 4px;
    overflow: hidden;
    margin: 6px 0;
    border: 1px solid #400a10;
}
.party-hp-fill {
    height: 100%;
    background: linear-gradient(90deg, #8a0515 0%, #ff1744 100%);
    transition: width 0.3s;
}
.party-furia-bar {
    height: 6px;
    background: #051508;
    border-radius: 3px;
    overflow: hidden;
    border: 1px solid #0a3010;
}
.party-furia-fill {
    height: 100%;
    background: linear-gradient(90deg, #10ac84 0%, #2ed573 100%);
    transition: width 0.3s;
}
.contrato-card {
    background: #0d0406;
    border: 1px solid #3d151c;
    border-left: 4px solid var(--ouro);
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 10px;
    transition: all 0.2s;
}
.contrato-card:hover {
    border-color: var(--ouro);
    background: #15060a;
}
.cauldron-box {
    text-align: center;
    padding: 20px;
    background: radial-gradient(circle, #25020c 0%, #090103 100%);
    border: 2px solid #ff007f;
    border-radius: 12px;
    box-shadow: 0 0 25px rgba(255, 0, 127, 0.25);
    margin-bottom: 15px;
}
.cauldron-progress {
    height: 22px;
    background: #140206;
    border-radius: 11px;
    overflow: hidden;
    border: 1px solid #ff007f;
    margin: 15px 0;
    position: relative;
}
.cauldron-fill {
    height: 100%;
    background: linear-gradient(90deg, #800040 0%, #ff007f 50%, #ff5252 100%);
    transition: width 0.5s ease;
}
.trade-modal-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 15px;
}
@media(max-width: 600px) {
    .trade-modal-container { grid-template-columns: 1fr; }
}
`;

if (!html.includes('.social-subnav')) {
    html = html.replace('</style>', socialStyles + '\n</style>');
}

// =========================================================================
// 3. HTML DA ABA SOCIAL (#aba-social)
// =========================================================================
const abaSocialHTML = `
            <!-- ABA SOCIAL & CO-OP (COMITIVAS, VÍNCULOS, CONTRATOS E MULTIPLAYER) -->
            <div id="aba-social" class="aba oculto">
                <div class="card" style="border-color: #ff007f; background: linear-gradient(180deg, #180209 0%, #090103 100%); margin-bottom: 14px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                        <div>
                            <h2 style="font-family:'Cinzel',serif; color:#ff79c6; margin:0; font-size:1.4rem; display:flex; align-items:center; gap:8px;">
                                <span>🐺</span> ALIANÇA SOCIAL & CO-OP MULTIPLAYER
                            </h2>
                            <p style="margin:4px 0 0 0; font-size:0.8rem; color:#aaa;">
                                Unam as vossas forças nas sombras. Caçadas em matilha, contratos mercenários e o Grande Caldeirão da Egrégora.
                            </p>
                        </div>
                        <div style="display:flex; gap:8px;">
                            <button class="btn-magick" onclick="carregarPainelSocialCompleto()" style="padding:6px 14px; font-size:0.75rem; border-color:#00e5ff; color:#00e5ff;">🔄 Atualizar Status</button>
                        </div>
                    </div>
                </div>

                <!-- SUB-NAVEGAÇÃO SOCIAL -->
                <div class="social-subnav">
                    <button class="social-subnav-btn active" onclick="trocarAbaSocial('comitiva', this)">🐺 Comitiva da Noite (Party)</button>
                    <button class="social-subnav-btn" onclick="trocarAbaSocial('vinculos', this)">🩸 Vínculos de Sangue</button>
                    <button class="social-subnav-btn" onclick="trocarAbaSocial('contratos', this)">📜 Mural de Contratos P2P</button>
                    <button class="social-subnav-btn" onclick="trocarAbaSocial('caldeirao', this)">🌑 Caldeirão da Egrégora</button>
                    <button class="social-subnav-btn" onclick="trocarAbaSocial('roster', this)">👥 Vampiros no Véu</button>
                </div>

                <!-- 1. SEÇÃO COMITIVA DA NOITE -->
                <div id="social-sec-comitiva">
                    <div id="social-comitiva-container">
                        <!-- Conteúdo injetado via carregarStatusComitiva() -->
                    </div>
                </div>

                <!-- 2. SEÇÃO VÍNCULOS DE SANGUE -->
                <div id="social-sec-vinculos" style="display:none;">
                    <div class="card" style="border-color:#ff1744; background:#0c0205; margin-bottom:12px;">
                        <h3 style="color:#ff5252; margin-top:0; font-family:'Cinzel',serif;">🩸 VÍNCULOS ETERNOS DE SANGUE</h3>
                        <p style="font-size:0.8rem; color:#aaa;">
                            Um laço sagrado forjado entre dois vampiros. Permite <b>Transfusão Vital Imediata</b> (salvar aliados à distância) e <b>Ressonância de Fúria</b> em acertos críticos.
                        </p>
                        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">
                            <select id="sel-propor-vinculo" style="background:#150408; color:#fff; border:1px solid #4a1520; padding:6px; border-radius:4px; flex:1; min-width:200px;">
                                <option value="">-- Seleciona um vampiro para forjar vínculo --</option>
                            </select>
                            <button class="btn-magick" onclick="forjarVinculoSangueFront()" style="padding:6px 14px; font-size:0.75rem; border-color:#ff1744; color:#ff1744;">🩸 Forjar Vínculo de Sangue</button>
                        </div>
                    </div>
                    <div id="social-vinculos-lista" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:10px;">
                        <!-- Injetado dinamicamente -->
                    </div>
                </div>

                <!-- 3. SEÇÃO MURAL DE CONTRATOS MERCENÁRIOS -->
                <div id="social-sec-contratos" style="display:none;">
                    <div class="card" style="border-color:var(--ouro); background:#0c0802; margin-bottom:12px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                            <div>
                                <h3 style="color:var(--ouro); margin:0; font-family:'Cinzel',serif;">📜 MURAL MERCENÁRIO DA CORTE</h3>
                                <span style="font-size:0.75rem; color:#888;">Ordens de serviço entre jogadores. O sangue da recompensa fica em custódia segura até à entrega.</span>
                            </div>
                            <button class="btn-magick" onclick="abrirModalPublicarContrato()" style="padding:6px 14px; font-size:0.75rem; border-color:var(--ouro); color:var(--ouro);">➕ Afixar Novo Contrato</button>
                        </div>
                    </div>
                    <div id="social-contratos-lista">
                        <!-- Injetado dinamicamente -->
                    </div>
                </div>

                <!-- 4. SEÇÃO GRANDE CALDEIRÃO DA EGRÉGORA -->
                <div id="social-sec-caldeirao" style="display:none;">
                    <div class="cauldron-box">
                        <div style="font-size:3rem; margin-bottom:5px;">🌋</div>
                        <h2 style="color:#ff79c6; font-family:'Cinzel',serif; margin:0;">O GRANDE CALDEIRÃO CÓSMICO</h2>
                        <p style="font-size:0.85rem; color:#bbb; max-width:600px; margin:8px auto;">
                            Quando as oferendas coletivas de Vitae atingirem <b>5.000 Gts</b>, o Caldeirão transbordará e despertará o <b>Eclipse da Noite Eterna</b> para todos os vampiros do reino (+30% XP, +100% Drops e +25% Dano por 25 minutos)!
                        </p>
                        <div class="cauldron-progress">
                            <div id="caldeirao-fill-bar" class="cauldron-fill" style="width: 0%;"></div>
                        </div>
                        <div id="caldeirao-status-txt" style="font-size:0.95rem; font-weight:bold; color:var(--ouro); margin-bottom:12px;">0 / 5.000 Gts Acumulados (0%)</div>
                        
                        <div id="caldeirao-eclipse-banner" style="display:none; background:linear-gradient(90deg, #400515, #800040); border:1px solid #ff007f; padding:10px; border-radius:6px; margin-bottom:12px;">
                            <span style="font-size:1.1rem; color:#fff; font-weight:bold;">🌑 O ECLIPSE DA NOITE ETERNA ESTÁ ATIVO!</span>
                            <div id="caldeirao-timer" style="font-size:0.85rem; color:#ff79c6; margin-top:4px;">Tempo restante: 25m 00s</div>
                        </div>

                        <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                            <button class="btn-magick" onclick="doarCaldeiraoFront(100)" style="border-color:#ff1744; color:#ff1744; padding:8px 16px;">🩸 Doar 100 Gts</button>
                            <button class="btn-magick" onclick="doarCaldeiraoFront(500)" style="border-color:#ff007f; color:#ff007f; padding:8px 16px;">🩸 Doar 500 Gts</button>
                            <button class="btn-magick" onclick="doarCaldeiraoFront(1000)" style="border-color:var(--ouro); color:var(--ouro); padding:8px 16px;">👑 Doar 1.000 Gts</button>
                        </div>
                    </div>
                </div>

                <!-- 5. SEÇÃO VAMPIROS NO VÉU (ROSTER) -->
                <div id="social-sec-roster" style="display:none;">
                    <div class="card" style="border-color:#00e5ff; background:#020b12; margin-bottom:12px;">
                        <h3 style="color:#00e5ff; margin-top:0; font-family:'Cinzel',serif;">👥 VAMPIROS DESPERTOS NO REINO</h3>
                        <p style="font-size:0.75rem; color:#aaa;">Iniciados presentes na cidade, no abismo e nos ermos. Convoca-os para a tua matilha ou inicia trocas diretas.</p>
                    </div>
                    <div id="social-roster-lista" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:10px;">
                        <!-- Injetado dinamicamente -->
                    </div>
                </div>
            </div>
`;

if (!html.includes('id="aba-social"')) {
    html = html.replace('<!-- O MAPA DO REINO (HUB DE TERRITÓRIOS E MUNDO DE JOGO) -->', abaSocialHTML + '\n            <!-- O MAPA DO REINO (HUB DE TERRITÓRIOS E MUNDO DE JOGO) -->');
}

// =========================================================================
// 4. MODAL DE TROCA DIRETA P2P (#modal-troca-p2p)
// =========================================================================
const modalTrocaHTML = `
            <!-- MODAL DE TROCA DIRETA SEGURA P2P (TRADE WINDOW) -->
            <div id="modal-troca-p2p" class="oculto" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:1000002; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(6px);">
                <div class="card" style="width:90%; max-width:650px; background:#0a0204; border:2px solid var(--ouro); box-shadow:0 0 25px rgba(212,175,55,0.25);">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #331518; padding-bottom:8px;">
                        <h3 style="color:var(--ouro); margin:0; font-family:'Cinzel',serif;">🤝 PACTO MERCANTIL DIRETO (P2P)</h3>
                        <button onclick="fecharModalTroca()" style="background:none; border:none; color:#888; font-size:1.2rem; cursor:pointer;">✖</button>
                    </div>

                    <div class="trade-modal-container">
                        <!-- Lado do Jogador -->
                        <div style="background:#120306; border:1px solid #4a1520; border-radius:6px; padding:10px;">
                            <h4 style="color:#0f5; margin-top:0; font-size:0.85rem;" id="trade-meu-titulo">A Tua Oferta</h4>
                            <div style="font-size:0.75rem; color:#aaa; margin-bottom:5px;">Seleciona itens da tua bolsa:</div>
                            <div id="trade-meus-itens" style="max-height:160px; overflow-y:auto; display:grid; gap:5px; margin-bottom:10px;">
                                <!-- Itens da bolsa com checkbox -->
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <label style="font-size:0.75rem; color:var(--ouro);">Gts:</label>
                                <input type="number" id="trade-meus-gts" value="0" min="0" style="background:#050102; color:var(--ouro); border:1px solid #4a1520; padding:4px 8px; width:90px; border-radius:4px;" onchange="atualizarOfertaTrocaFront()">
                            </div>
                            <div style="margin-top:10px;">
                                <button id="trade-btn-travar" class="btn-magick" onclick="travarTrocaFront()" style="width:100%; border-color:#0f5; color:#0f5; font-size:0.75rem;">🔒 Travar Oferta</button>
                            </div>
                        </div>

                        <!-- Lado do Parceiro -->
                        <div style="background:#060812; border:1px solid #15224a; border-radius:6px; padding:10px;">
                            <h4 style="color:#00e5ff; margin-top:0; font-size:0.85rem;" id="trade-aliado-titulo">Oferta do Aliado</h4>
                            <div style="font-size:0.75rem; color:#aaa; margin-bottom:5px;">Itens oferecidos:</div>
                            <div id="trade-aliado-itens" style="max-height:160px; overflow-y:auto; display:grid; gap:5px; margin-bottom:10px;">
                                <p style="color:#555; font-size:0.75rem; text-align:center;">Nenhum item adicionado.</p>
                            </div>
                            <div style="font-size:0.75rem; color:var(--ouro);">
                                Gts Ofertados: <b id="trade-aliado-gts" style="color:#fff;">0 Gts</b>
                            </div>
                            <div id="trade-aliado-status" style="margin-top:10px; font-size:0.75rem; color:#ff9800; font-weight:bold; text-align:center; padding:6px; background:#101015; border-radius:4px;">
                                ⏳ Modificando oferta...
                            </div>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px; border-top:1px solid #331518; padding-top:10px;">
                        <button onclick="fecharModalTroca()" class="btn-magick" style="border-color:#ff3838; color:#ff3838; font-size:0.75rem;">Cancelar</button>
                        <button id="trade-btn-confirmar" class="btn-magick" onclick="confirmarTrocaFront()" disabled style="border-color:#555; color:#555; font-size:0.8rem; padding:8px 20px;">✅ Confirmar e Selar Troca</button>
                    </div>
                </div>
            </div>

            <!-- MODAL PUBLICAR CONTRATO -->
            <div id="modal-publicar-contrato" class="oculto" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:1000002; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(6px);">
                <div class="card" style="width:90%; max-width:480px; background:#0c0406; border:2px solid var(--ouro);">
                    <h3 style="color:var(--ouro); margin-top:0; font-family:'Cinzel',serif;">📜 PUBLICAR ORDEM MERCENÁRIA</h3>
                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
                        <label style="font-size:0.75rem; color:#aaa;">Título do Contrato:</label>
                        <input type="text" id="novo-cnt-titulo" placeholder="Ex: Fornecimento de Ferro Negro" style="background:#150508; color:#fff; border:1px solid #4a1520; padding:6px; border-radius:4px;">
                        
                        <label style="font-size:0.75rem; color:#aaa;">Descrição:</label>
                        <textarea id="novo-cnt-desc" rows="2" placeholder="Descreva os termos da ordem..." style="background:#150508; color:#fff; border:1px solid #4a1520; padding:6px; border-radius:4px;"></textarea>

                        <div style="display:flex; gap:10px;">
                            <div style="flex:1;">
                                <label style="font-size:0.75rem; color:#aaa;">Material Exigido:</label>
                                <select id="novo-cnt-item" style="background:#150508; color:#fff; border:1px solid #4a1520; padding:6px; border-radius:4px; width:100%;">
                                    <option value="ferroNegro">Ferro Negro</option>
                                    <option value="pedra">Pedra Rúnica</option>
                                    <option value="mandragora">Mandrágora</option>
                                    <option value="beladona">Beladona</option>
                                    <option value="lotusNegro">Lótus Negro</option>
                                </select>
                            </div>
                            <div style="width:90px;">
                                <label style="font-size:0.75rem; color:#aaa;">Qtd:</label>
                                <input type="number" id="novo-cnt-qtd" value="20" min="1" style="background:#150508; color:#fff; border:1px solid #4a1520; padding:6px; border-radius:4px; width:100%;">
                            </div>
                        </div>

                        <label style="font-size:0.75rem; color:#aaa;">Recompensa em Gts (em custódia):</label>
                        <input type="number" id="novo-cnt-recompensa" value="500" min="200" style="background:#150508; color:var(--ouro); border:1px solid var(--ouro); padding:6px; border-radius:4px; font-weight:bold;">
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:15px;">
                        <button onclick="document.getElementById('modal-publicar-contrato').classList.add('oculto')" class="btn-magick" style="border-color:#888; color:#888;">Cancelar</button>
                        <button onclick="publicarContratoMercenarioFront()" class="btn-magick" style="border-color:var(--ouro); color:var(--ouro);">Afixar Ordem</button>
                    </div>
                </div>
            </div>
`;

if (!html.includes('id="modal-troca-p2p"')) {
    html = html.replace('<div id="modal-convite-coop"', modalTrocaHTML + '\n<div id="modal-convite-coop"');
}

// =========================================================================
// 5. ATUALIZAR NAVEGAÇÃO nav(abaId)
// =========================================================================
if (!html.includes("if (abaId === 'social' && typeof carregarPainelSocialCompleto === 'function')")) {
    html = html.replace(
        "if (abaId === 'mundo2d' && typeof inicializarMundo2D === 'function') {",
        "if (abaId === 'social' && typeof carregarPainelSocialCompleto === 'function') {\n            setTimeout(carregarPainelSocialCompleto, 50);\n        }\n        if (abaId === 'mundo2d' && typeof inicializarMundo2D === 'function') {"
    );
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html HTML and CSS injected successfully.');
