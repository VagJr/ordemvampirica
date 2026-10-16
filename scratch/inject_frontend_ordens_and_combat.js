const fs = require('fs');

const path = 'c:/ordemvampirica/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. INJETAR CSS DE ESTILOS VISCERAIS E TERMINAL DE CÓDIGO
const cssAdicional = `
        /* === ANIMAÇÕES E ESTILOS DE COMBATE VISCERAL E MAGIA EM CÓDIGO === */
        @keyframes screenShake {
            0% { transform: translate(0, 0) rotate(0deg); }
            20% { transform: translate(-7px, 6px) rotate(-1deg); }
            40% { transform: translate(7px, -7px) rotate(1.5deg); }
            60% { transform: translate(-5px, 4px) rotate(-0.5deg); }
            80% { transform: translate(5px, -4px) rotate(1deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes visceralPulseGlow {
            0% { box-shadow: 0 0 10px rgba(255, 30, 47, 0.6); border-color: #ff1e2f; }
            100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.9), 0 0 50px rgba(255, 30, 47, 0.8); border-color: #d4af37; transform: scale(1.02); }
        }

        .screen-shake {
            animation: screenShake 0.45s cubic-bezier(.36,.07,.19,.97) both !important;
        }

        .visceral-ready-btn {
            background: linear-gradient(135deg, #8a0303 0%, #ff1e2f 50%, #d4af37 100%) !important;
            color: #fff !important;
            font-weight: 900 !important;
            letter-spacing: 2px !important;
            animation: visceralPulseGlow 0.7s infinite alternate !important;
            border: 2px solid #d4af37 !important;
            cursor: pointer;
        }

        .code-editor-container {
            background: #050304;
            border: 1px solid var(--ouro-sombra);
            border-radius: 6px;
            font-family: 'Courier New', Courier, monospace;
            padding: 12px;
            color: #00ff88;
            position: relative;
        }

        .code-textarea {
            width: 100%;
            height: 140px;
            background: transparent;
            border: none;
            color: #00ff88;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.95rem;
            resize: vertical;
            outline: none;
            line-height: 1.4;
        }

        .code-operator-chip {
            display: inline-block;
            background: rgba(197, 160, 89, 0.15);
            border: 1px solid var(--ouro-sombra);
            color: var(--ouro);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            cursor: pointer;
            margin: 2px;
            transition: all 0.2s ease;
        }
        .code-operator-chip:hover {
            background: var(--ouro);
            color: #000;
            box-shadow: 0 0 10px var(--ouro);
        }

        .grau-badge-sphere {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            border: 2px solid var(--ouro);
            background: radial-gradient(circle, #2c1216 0%, #0d0608 100%);
            font-family: 'Cinzel', serif;
            font-weight: bold;
            color: var(--ouro);
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
        }
`;

if (!content.includes('screenShake')) {
    content = content.replace('</style>', cssAdicional + '\n</style>');
}

// 2. INJETAR BOTÕES NO DOCK DE NAVEGAÇÃO DESKTOP
const botoesDock = `
                <button class="dock-btn" data-aba="ordem" onclick="nav('ordem', this)"><span style="color:#d4af37;">🏛️</span> Ordem Iniciática (0°-10°)</button>
                <button class="dock-btn" data-aba="magia_codigo" onclick="nav('magia_codigo', this)"><span style="color:#00e1d9;">⚡</span> Magia em Código</button>`;

if (!content.includes('data-aba="ordem"')) {
    content = content.replace(
        '<button class="dock-btn" data-aba="biblioteca"',
        botoesDock + '\n                <button class="dock-btn" data-aba="biblioteca"'
    );
}

// 3. INJETAR BARRA DE POSTURA E ALERTA VISCERAL NO MODAL DE COMBATE
const bossHudOriginal = '<div class="hp-bar-container"><div id="arena-boss-hp-bar" class="hp-bar-fill hp-boss-fill"></div></div>\n                <div style="color: #888; font-size: 0.9rem;"><span id="arena-boss-hp-text">1000</span> HP</div>';

const bossHudComPostura = `<div class="hp-bar-container"><div id="arena-boss-hp-bar" class="hp-bar-fill hp-boss-fill"></div></div>
                <div style="color: #888; font-size: 0.85rem; display:flex; justify-content:space-between;">
                    <span>HP: <span id="arena-boss-hp-text">1000</span></span>
                    <span style="color: #ffaa00;">Postura: <span id="arena-boss-postura-text">100</span>%</span>
                </div>
                <div style="height: 6px; background: rgba(0,0,0,0.8); border: 1px solid #442200; border-radius: 3px; overflow: hidden; margin-top: 2px;">
                    <div id="arena-boss-postura-bar" style="height: 100%; width: 100%; background: linear-gradient(90deg, #ffcc00, #ff3300); transition: width 0.2s ease;"></div>
                </div>
                <div id="arena-alerta-visceral" class="oculto" style="color: #ffff00; font-weight: bold; font-size: 0.8rem; text-shadow: 0 0 10px #ff0000; animation: visceralPulseGlow 0.6s infinite alternate; margin-top: 3px; text-align: center;">
                    ⚡ GUARDA QUEBRADA! GOLPE VISCERAL DISPONÍVEL!
                </div>`;

if (!content.includes('id="arena-boss-postura-bar"')) {
    content = content.replace(bossHudOriginal, bossHudComPostura);
}

// Injetar botões de ação avançada na arena (Golpe Pesado, Parry, Golpe Visceral, Magia Código)
const habilidadesArenaOriginal = '<div id="arena-habilidades-dinamicas" style="display: flex; gap: 8px; justify-content: center; margin-top: 10px;"></div>';
const habilidadesArenaNova = `<div id="arena-habilidades-dinamicas" style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 10px;"></div>
        <div id="arena-acoes-viscerais" style="display: flex; gap: 6px; justify-content: center; margin-top: 8px; flex-wrap: wrap;">
            <button class="btn" style="padding: 6px 12px; font-size: 0.8rem; background: #2c1216; border: 1px solid var(--sangue);" onclick="executarAcaoCombateAvancada('golpe_pesado')">💥 Golpe Pesado (-Postura)</button>
            <button class="btn" style="padding: 6px 12px; font-size: 0.8rem; background: #1a1a2e; border: 1px solid #5985c5;" onclick="executarAcaoCombateAvancada('parry_perfeito')">🛡️ Parada & Contra-Golpe</button>
            <button id="btn-arena-visceral" class="btn oculto" style="padding: 6px 14px; font-size: 0.85rem;" onclick="executarAcaoCombateAvancada('golpe_visceral')">🩸 GOLPE VISCERAL FATAL (3.5x)</button>
            <button class="btn" style="padding: 6px 12px; font-size: 0.8rem; background: #0b1a1a; border: 1px solid #00e1d9;" onclick="executarMagiaCodigoNoCombate()">⚡ Magia em Código</button>
        </div>`;

if (!content.includes('id="arena-acoes-viscerais"')) {
    content = content.replace(habilidadesArenaOriginal, habilidadesArenaNova);
}

// 4. INJETAR SEÇÕES HTML DE: aba-ordem E aba-magia_codigo
const htmlNovasAbas = `
        <!-- ======================================================== -->
        <!-- ABA 1: ORDEM INICIÁTICA & HIERARQUIA HERMÉTICA (0° - 10°) -->
        <!-- ======================================================== -->
        <div id="aba-ordem" class="aba oculto">
            <div class="sub-nav-bar" data-domain="ordem">
                <button class="sub-nav-btn active" onclick="switchSubSection('ordem', 'ordem-sec-templo', this)">🏛️ Templo & Egrégora</button>
                <button class="sub-nav-btn" onclick="switchSubSection('ordem', 'ordem-sec-graus', this)">🔯 Graus Herméticos (0°-10°)</button>
                <button class="sub-nav-btn" onclick="switchSubSection('ordem', 'ordem-sec-decretos', this)">📜 Câmara de Decretos</button>
                <button class="sub-nav-btn" onclick="switchSubSection('ordem', 'ordem-sec-membros', this)">👥 Irmandade de Adeptos</button>
                <button class="sub-nav-btn" onclick="nav('magia_codigo')">⚡ Magia em Código</button>
            </div>

            <!-- SUB-SEÇÃO 1: TEMPLO & EGRÉGORA -->
            <div id="ordem-sec-templo" class="sub-section active">
                <div class="card" style="border-color: var(--ouro); background: radial-gradient(circle at 50% 0%, #1a080c 0%, #080304 100%);">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--ouro-sombra); padding-bottom: 10px; margin-bottom: 12px;">
                        <div>
                            <span id="ordem-sigilo-badge" style="font-size: 2rem; vertical-align: middle; margin-right: 8px;">👁️</span>
                            <span id="ordem-nome-header" style="font-family:'Cinzel', serif; font-size: 1.4rem; color: var(--ouro); font-weight: bold;">Carregando Ordem...</span>
                        </div>
                        <div id="ordem-grau-display" class="grau-badge-sphere" title="Teu Grau na Ordem">0°</div>
                    </div>
                    <p id="ordem-lema-display" style="font-style: italic; color: #aaa; text-align: center; margin: 0 0 15px 0;">"Solve et Coagula"</p>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin-bottom: 15px;">
                        <div style="background: #000; border: 1px solid var(--ouro-sombra); padding: 8px; text-align: center; border-radius: 4px;">
                            <div style="font-size: 0.75rem; color: #888;">Egrégora Vitae</div>
                            <div id="ordem-egregora-vitae" style="font-size: 1.3rem; color: var(--sangue-claro); font-weight: bold;">0</div>
                        </div>
                        <div style="background: #000; border: 1px solid var(--ouro-sombra); padding: 8px; text-align: center; border-radius: 4px;">
                            <div style="font-size: 0.75rem; color: #888;">Anima Consagrada</div>
                            <div id="ordem-egregora-anima" style="font-size: 1.3rem; color: #5985c5; font-weight: bold;">0</div>
                        </div>
                        <div style="background: #000; border: 1px solid var(--ouro-sombra); padding: 8px; text-align: center; border-radius: 4px;">
                            <div style="font-size: 0.75rem; color: #888;">Cinzas Sagradas</div>
                            <div id="ordem-egregora-cinzas" style="font-size: 1.3rem; color: #aaa; font-weight: bold;">0</div>
                        </div>
                        <div style="background: #000; border: 1px solid var(--ouro); padding: 8px; text-align: center; border-radius: 4px;">
                            <div style="font-size: 0.75rem; color: var(--ouro);">Poder Cósmico</div>
                            <div id="ordem-egregora-poder" style="font-size: 1.3rem; color: var(--ouro); font-weight: bold;">0</div>
                        </div>
                    </div>

                    <!-- DOAÇÃO À EGRÉGORA -->
                    <div style="background: rgba(14, 6, 8, 0.8); border: 1px dashed var(--ouro-sombra); padding: 12px; border-radius: 6px; margin-bottom: 15px;">
                        <h4 style="margin: 0 0 8px 0; color: var(--ouro); font-family: 'Cinzel', serif;">🩸 Sacrifício ao Altar da Egrégora</h4>
                        <p style="font-size: 0.85rem; color: #888; margin: 0 0 10px 0;">Verte a tua vitae no cálice sagrado da Ordem para expandir a egrégora mística e receber bônus de XP e proteção astral.</p>
                        <div style="display: flex; gap: 8px;">
                            <input type="number" id="input-doacao-egregora" placeholder="Quantia de Vitae (Gts)" min="100" step="100" style="flex: 1; padding: 8px; background: #000; border: 1px solid #333; color: #fff; border-radius: 4px;">
                            <button class="btn" style="background: var(--sangue); border: 1px solid var(--ouro);" onclick="doarEgregoraClient()">Consagrar Oferenda</button>
                        </div>
                    </div>

                    <!-- PAINEL DE FUNDAÇÃO (SE NÃO TIVER ORDEM) -->
                    <div id="painel-fundar-ordem" class="oculto" style="border-top: 1px solid var(--ouro-sombra); padding-top: 15px;">
                        <h3 style="color: var(--ouro); font-family: 'Cinzel', serif; text-align: center;">🏛️ Fundar um Templo Primordial</h3>
                        <p style="font-size: 0.85rem; color: #888; text-align: center;">Adeptos de Grau 10+ podem fundar uma Ordem Iniciática autêntica, estabelecendo santuários, juramentos de sangue e decretos para toda a posteridade (Custo: 10.000 Gts e 5 Anima).</p>
                        <div style="display: grid; gap: 8px; max-width: 500px; margin: 0 auto;">
                            <input type="text" id="novo-ordem-nome" placeholder="Nome da Ordem (Ex: Ordo Hermetica Astrum)" style="padding: 8px; background: #000; border: 1px solid #333; color: #fff; border-radius: 4px;">
                            <input type="text" id="novo-ordem-lema" placeholder="Lema Hermético em Latim (Ex: Ignis Natura Renovatur Integra)" style="padding: 8px; background: #000; border: 1px solid #333; color: #fff; border-radius: 4px;">
                            <input type="text" id="novo-ordem-santuario" placeholder="Nome do Santuário (Ex: Abadia das Trevas Eternas)" style="padding: 8px; background: #000; border: 1px solid #333; color: #fff; border-radius: 4px;">
                            <select id="novo-ordem-sigilo" style="padding: 8px; background: #000; border: 1px solid #333; color: #fff; border-radius: 4px;">
                                <option value="👁️">👁️ O Olho Que Tudo Vê</option>
                                <option value="🔯">🔯 Hexagrama Hermético</option>
                                <option value="🐍">🐍 Ouroboros da Eternidade</option>
                                <option value="⚡">⚡ Raio da Qliphoth</option>
                                <option value="🍷">🍷 O Santo Graal Negro</option>
                            </select>
                            <textarea id="novo-ordem-juramento" placeholder="Juramento de Sangue exigido aos novos Neófitos..." style="padding: 8px; background: #000; border: 1px solid #333; color: #fff; border-radius: 4px; height: 60px;"></textarea>
                            <button class="btn" style="background: linear-gradient(135deg, #8a0303, #d4af37); color: #fff; font-weight: bold; padding: 10px;" onclick="fundarOrdemClient()">Consagrar Fundação da Ordem</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SUB-SEÇÃO 2: GRAUS HERMÉTICOS -->
            <div id="ordem-sec-graus" class="sub-section">
                <div class="card">
                    <h3 style="color: var(--ouro); font-family: 'Cinzel', serif; text-align: center;">Os 10 Graus da Hierarquia Iniciática</h3>
                    <p style="font-size: 0.85rem; color: #888; text-align: center; margin-bottom: 15px;">Baseado na tradição hermética da Golden Dawn e Astrum Argentum. Cada grau requer Gnose profunda e feitos viscerais para a ascensão.</p>
                    <div id="lista-graus-iniciaticos" style="display: grid; gap: 8px;"></div>
                </div>
            </div>

            <!-- SUB-SEÇÃO 3: CÂMARA DE DECRETOS -->
            <div id="ordem-sec-decretos" class="sub-section">
                <div class="card">
                    <h3 style="color: var(--ouro); font-family: 'Cinzel', serif; text-align: center;">Decretos Ativos da Ordem</h3>
                    <p style="font-size: 0.85rem; color: #888; text-align: center;">Leis espirituais proclamadas pelos Magister Templi (Grau 6+) que concedem bônus para todos os membros da Ordem.</p>
                    <div id="lista-decretos-ordem" style="margin-bottom: 15px; display: grid; gap: 8px;"></div>

                    <div id="form-proclamar-decreto" class="oculto" style="border-top: 1px solid var(--ouro-sombra); padding-top: 12px;">
                        <h4 style="color: var(--ouro); margin: 0 0 8px 0;">📜 Proclamar Decreto Místico (Grau 6+)</h4>
                        <div style="display: grid; gap: 8px;">
                            <input type="text" id="decreto-titulo" placeholder="Título do Decreto (Ex: Decreto da Noite Eterna)" style="padding: 8px; background: #000; border: 1px solid #333; color: #fff; border-radius: 4px;">
                            <textarea id="decreto-texto" placeholder="Efeito Mágico e Proclamação Solene..." style="padding: 8px; background: #000; border: 1px solid #333; color: #fff; border-radius: 4px; height: 60px;"></textarea>
                            <button class="btn" style="background: var(--sangue); border: 1px solid var(--ouro);" onclick="proclamarDecretoClient()">Sancionar Decreto na Egrégora</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SUB-SEÇÃO 4: IRMANDADE DE ADEPTOS -->
            <div id="ordem-sec-membros" class="sub-section">
                <div class="card">
                    <h3 style="color: var(--ouro); font-family: 'Cinzel', serif; text-align: center;">Irmandade de Adeptos</h3>
                    <div id="lista-membros-ordem" style="display: grid; gap: 8px; margin-bottom: 15px;"></div>
                </div>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- ABA 2: STUDIO DE MAGIA EM CÓDIGO (ZERO-CRASH ENGINE)    -->
        <!-- ======================================================== -->
        <div id="aba-magia_codigo" class="aba oculto">
            <div class="sub-nav-bar" data-domain="magia_codigo">
                <button class="sub-nav-btn active" onclick="switchSubSection('magia_codigo', 'code-sec-forja', this)">⚡ Forja de Código</button>
                <button class="sub-nav-btn" onclick="switchSubSection('magia_codigo', 'code-sec-grimorio', this)">📖 Grimório em Código</button>
                <button class="sub-nav-btn" onclick="switchSubSection('magia_codigo', 'code-sec-docs', this)">📚 Operadores Místicos</button>
                <button class="sub-nav-btn" onclick="nav('ordem')">🏛️ Ordem Iniciática</button>
            </div>

            <!-- SUB-SEÇÃO 1: FORJA DE CÓDIGO ARCANO -->
            <div id="code-sec-forja" class="sub-section active">
                <div class="card" style="border-color: #00e1d9; background: radial-gradient(circle at 50% 0%, #061718 0%, #040203 100%);">
                    <h3 style="color: #00e1d9; font-family: 'Cinzel', serif; text-align: center; margin-top:0;">⚡ Terminal de Magia Viva em Código</h3>
                    <p style="font-size: 0.85rem; color: #888; text-align: center; margin-bottom: 10px;">
                        Programa feitiços diretamente na matriz do jogo. As instruções são validadas em tempo real com sandbox à prova de erros. A tua vontade se torna código vivo no servidor.
                    </p>

                    <!-- CHIPS DE OPERADORES RÁPIDOS -->
                    <div style="margin-bottom: 10px;">
                        <span style="font-size: 0.8rem; color: #aaa; margin-right: 5px;">Operadores Disponíveis:</span>
                        <span class="code-operator-chip" onclick="inserirComandoCodigo('TRANSMUTAR(\\"cinzas\\", \\"anima\\", 1);')">TRANSMUTAR</span>
                        <span class="code-operator-chip" onclick="inserirComandoCodigo('CANALIZAR_EGREGORA(1.2);')">CANALIZAR_EGREGORA</span>
                        <span class="code-operator-chip" onclick="inserirComandoCodigo('DOBRA_ASTRAL(\\"santuario\\", 6);')">DOBRA_ASTRAL</span>
                        <span class="code-operator-chip" onclick="inserirComandoCodigo('MALDICAO_VAMPIRICA(\\"alvo\\", \\"dreno\\");')">MALDICAO_VAMPIRICA</span>
                        <span class="code-operator-chip" onclick="inserirComandoCodigo('INVOCAR_FORJA_VIVA(\\"arma\\");')">INVOCAR_FORJA_VIVA</span>
                        <span class="code-operator-chip" onclick="inserirComandoCodigo('RESONANCIA_COSMICA(\\"Tiphereth\\", 10);')">RESONANCIA_COSMICA</span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                        <input type="text" id="code-feitico-nome" placeholder="Nome do Feitiço (Ex: Transmutação de Hermes)" style="padding: 8px; background: #000; border: 1px solid #333; color: #fff; border-radius: 4px;">
                        <select id="code-feitico-esfera" style="padding: 8px; background: #000; border: 1px solid #333; color: #fff; border-radius: 4px;">
                            <option value="Malkuth">Malkuth (Reino Físico)</option>
                            <option value="Yesod">Yesod (Fundamento Astral)</option>
                            <option value="Hod">Hod (Glória Intelectual)</option>
                            <option value="Netzach">Netzach (Vitória & Força)</option>
                            <option value="Tiphereth" selected>Tiphereth (Harmonia Solar)</option>
                            <option value="Geburah">Geburah (Poder Severo & Fogo)</option>
                            <option value="Chesed">Chesed (Misericórdia Cósmica)</option>
                        </select>
                    </div>

                    <!-- EDITOR DE CÓDIGO -->
                    <div class="code-editor-container">
                        <textarea id="code-formula-input" class="code-textarea" placeholder="// Digite a fórmula de magia em código aqui...&#10;TRANSMUTAR(\\"cinzas\\", \\"anima\\", 2);&#10;CANALIZAR_EGREGORA(1.5);&#10;RESONANCIA_COSMICA(\\"Tiphereth\\", 10);" oninput="verificarSintaxeAoDigitar()"></textarea>
                        <div id="code-syntax-feedback" style="font-size: 0.8rem; color: #00ff88; margin-top: 5px;">⚡ Sintaxe Pronta para Validação.</div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <div style="font-size: 0.8rem; color: #888;">Custo de Forja: 1.500 Gts</div>
                        <button class="btn" style="background: linear-gradient(135deg, #0b1a1a, #00e1d9); color: #000; font-weight: bold; border: 1px solid #00e1d9;" onclick="forjarMagiaCodigoClient()">⚡ Forjar Magia na Matrix</button>
                    </div>

                    <!-- LOGS DO CONSOLE ARCANO -->
                    <div style="margin-top: 15px;">
                        <div style="font-size: 0.75rem; color: #aaa; margin-bottom: 3px;">Saída do Terminal Astral:</div>
                        <div id="code-terminal-output" style="background: #000; border: 1px solid #222; border-radius: 4px; padding: 8px; font-family: monospace; font-size: 0.8rem; color: #00ff88; min-height: 60px; max-height: 120px; overflow-y: auto;">
                            [SISTEMA]: Motor de Magia em Código ativo. Conectado ao nó do Abismo.
                        </div>
                    </div>
                </div>
            </div>

            <!-- SUB-SEÇÃO 2: GRIMÓRIO DE MAGIAS EM CÓDIGO -->
            <div id="code-sec-grimorio" class="sub-section">
                <div class="card">
                    <h3 style="color: #00e1d9; font-family: 'Cinzel', serif; text-align: center;">Teu Grimório de Códigos Vivos</h3>
                    <p style="font-size: 0.85rem; color: #888; text-align: center;">Feitiços programados por ti que podem ser conjurados para transmutar materiais, alterar o mundo 2D e canalizar poder cósmico.</p>
                    <div id="lista-minhas-magias-codigo" style="display: grid; gap: 8px;"></div>
                </div>
            </div>

            <!-- SUB-SEÇÃO 3: DOCUMENTAÇÃO DE OPERADORES -->
            <div id="code-sec-docs" class="sub-section">
                <div class="card">
                    <h3 style="color: #00e1d9; font-family: 'Cinzel', serif; text-align: center;">Gramática Sagrada dos Operadores</h3>
                    <div id="lista-operadores-docs" style="display: grid; gap: 10px;"></div>
                </div>
            </div>
        </div>
`;

if (!content.includes('id="aba-ordem"')) {
    content = content.replace(
        '<div id="aba-umbral" class="aba oculto">',
        htmlNovasAbas + '\n        <div id="aba-umbral" class="aba oculto">'
    );
}

// 5. INJETAR JAVASCRIPT DO CLIENTE PARA ORDENS MÍSTICAS, MAGIA EM CÓDIGO E COMBATE
const jsCliente = `
// ============================================================================
// SISTEMAS CLIENTE: ORDENS INICIÁTICAS, MAGIA EM CÓDIGO & COMBATE VISCERAL
// ============================================================================

// --- ORDENS MÍSTICAS ---
async function carregarMinhaOrdem() {
    if (!meuVampiro) return;
    try {
        const res = await fetch('/api/ordem/minha/' + meuVampiro.id);
        const dados = await res.json();
        
        const nomeHeader = document.getElementById('ordem-nome-header');
        const grauDisplay = document.getElementById('ordem-grau-display');
        const lemaDisplay = document.getElementById('ordem-lema-display');
        const sigiloBadge = document.getElementById('ordem-sigilo-badge');
        const painelFundar = document.getElementById('painel-fundar-ordem');
        const formDecreto = document.getElementById('form-proclamar-decreto');

        if (dados.ordem) {
            if (nomeHeader) nomeHeader.innerText = dados.ordem.nome;
            if (grauDisplay) grauDisplay.innerText = dados.grau + '°';
            if (lemaDisplay) lemaDisplay.innerText = '"' + dados.ordem.lema + '"';
            if (sigiloBadge) sigiloBadge.innerText = dados.ordem.sigilo || '👁️';
            if (painelFundar) painelFundar.classList.add('oculto');

            safeSet('ordem-egregora-vitae', (dados.ordem.egregora?.vitae || 0).toLocaleString());
            safeSet('ordem-egregora-anima', dados.ordem.egregora?.anima || 0);
            safeSet('ordem-egregora-cinzas', dados.ordem.egregora?.cinzas || 0);
            safeSet('ordem-egregora-poder', (dados.ordem.egregora?.poderTotal || 0).toLocaleString());

            // Decretos
            const divDecretos = document.getElementById('lista-decretos-ordem');
            if (divDecretos) {
                divDecretos.innerHTML = (dados.ordem.decretosAtivos || []).map(d => \`
                    <div style="background: rgba(0,0,0,0.6); border: 1px solid var(--ouro-sombra); padding: 10px; border-radius: 4px;">
                        <div style="font-family: 'Cinzel', serif; color: var(--ouro); font-weight: bold;">📜 \${d.titulo}</div>
                        <div style="font-size: 0.85rem; color: #ddd; margin-top: 3px;">\${d.efeito}</div>
                        <div style="font-size: 0.75rem; color: #888; margin-top: 4px;">Proclamado por: \${d.proclamador}</div>
                    </div>
                \`).join('') || '<div style="color: #666; font-size: 0.85rem; text-align: center;">Nenhum decreto proclamado ainda.</div>';
            }

            // Form de decreto para Grau 6+
            if (formDecreto) {
                if (dados.grau >= 6) formDecreto.classList.remove('oculto');
                else formDecreto.classList.add('oculto');
            }

            // Membros
            const divMembros = document.getElementById('lista-membros-ordem');
            if (divMembros) {
                const membrosArr = Object.entries(dados.ordem.membros || {});
                divMembros.innerHTML = membrosArr.map(([mId, m]) => \`
                    <div style="display: flex; justify-content: space-between; align-items: center; background: #000; border: 1px solid #222; padding: 8px 12px; border-radius: 4px;">
                        <div>
                            <span style="color: var(--ouro); font-weight: bold;">[\${m.grau}°] \${m.nome}</span>
                            <span style="font-size: 0.75rem; color: #888; margin-left: 8px;">(Doou \${m.contribuicaoGts || 0} Gts)</span>
                        </div>
                        \${dados.grau >= 7 && m.grau < dados.grau ? \`<button class="btn" style="padding: 4px 8px; font-size: 0.75rem;" onclick="promoverMembroClient('\${mId}')">Ascender Grau</button>\` : ''}
                    </div>
                \`).join('');
            }

        } else {
            if (nomeHeader) nomeHeader.innerText = "Sem Ordem Iniciática";
            if (grauDisplay) grauDisplay.innerText = "0°";
            if (lemaDisplay) lemaDisplay.innerText = '"Renuncia à ilusão mundana e busca a Luz Hermética"';
            if (painelFundar) {
                if (meuVampiro.nivel >= 10) painelFundar.classList.remove('oculto');
                else painelFundar.classList.add('oculto');
            }
        }

        // Renderiza lista de Graus Herméticos
        renderizarGrausHermeticos(dados.todosGraus || [], dados.grau || 0);

    } catch(e) { console.error("Erro ao carregar ordem:", e); }
}

function renderizarGrausHermeticos(graus, meuGrau) {
    const container = document.getElementById('lista-graus-iniciaticos');
    if (!container) return;
    container.innerHTML = graus.map(g => {
        const alcancado = meuGrau >= g.grau;
        const eAtual = meuGrau === g.grau;
        return \`
            <div style="display: flex; align-items: center; gap: 12px; background: \${eAtual ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0,0,0,0.5)'}; border: 1px solid \${alcancado ? 'var(--ouro)' : '#333'}; padding: 10px; border-radius: 6px;">
                <div class="grau-badge-sphere" style="\${alcancado ? '' : 'border-color: #555; color: #555;'}">\${g.grau}°</div>
                <div style="flex: 1;">
                    <div style="color: \${alcancado ? 'var(--ouro)' : '#888'}; font-weight: bold; font-family: 'Cinzel', serif;">
                        \${g.titulo} \${eAtual ? '<span style="color: #00ff88; font-size: 0.75rem; margin-left: 6px;">● TEU GRAU ATUAL</span>' : ''}
                    </div>
                    <div style="font-size: 0.8rem; color: #bbb;">Esfera: \${g.sfera} | Req: \${g.reqGnose} Gnose</div>
                    <div style="font-size: 0.75rem; color: #777; margin-top: 2px;">\${g.descricao}</div>
                </div>
            </div>
        \`;
    }).join('');
}

async function fundarOrdemClient() {
    if (!meuVampiro) return;
    const nome = document.getElementById('novo-ordem-nome')?.value.trim();
    const lema = document.getElementById('novo-ordem-lema')?.value.trim();
    const santuario = document.getElementById('novo-ordem-santuario')?.value.trim();
    const sigilo = document.getElementById('novo-ordem-sigilo')?.value || '👁️';
    const juramento = document.getElementById('novo-ordem-juramento')?.value.trim();

    if (!nome) return ocultoAlert("Nome da Ordem obrigatório.");

    try {
        const res = await fetch('/api/ordem/criar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: meuVampiro.id, nome, lema, santuario, sigiloPrimordial: sigilo, juramentoSangue: juramento })
        });
        const d = await res.json();
        if (d.sucesso) {
            ocultoAlert("🏛️ " + d.relato);
            carregarMinhaOrdem();
        } else {
            ocultoAlert("⚠️ " + (d.erro || "Falha ao fundar ordem."));
        }
    } catch(e) { ocultoAlert("Erro de conexão ao plano astral."); }
}

async function doarEgregoraClient() {
    if (!meuVampiro) return;
    const qtd = parseInt(document.getElementById('input-doacao-egregora')?.value) || 0;
    if (qtd < 100) return ocultoAlert("Oferenda mínima de 100 Gts.");

    try {
        const res = await fetch('/api/ordem/doar_egregora', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: meuVampiro.id, quantiaVitae: qtd })
        });
        const d = await res.json();
        if (d.sucesso) {
            ocultoAlert("🩸 " + d.relato);
            document.getElementById('input-doacao-egregora').value = '';
            carregarMinhaOrdem();
        } else {
            ocultoAlert("⚠️ " + d.erro);
        }
    } catch(e) { ocultoAlert("Erro ao doar à egrégora."); }
}

async function proclamarDecretoClient() {
    if (!meuVampiro) return;
    const titulo = document.getElementById('decreto-titulo')?.value.trim();
    const texto = document.getElementById('decreto-texto')?.value.trim();
    if (!titulo || !texto) return ocultoAlert("Título e Efeito do Decreto são obrigatórios.");

    try {
        const res = await fetch('/api/ordem/decretar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: meuVampiro.id, tituloDecreto: titulo, textoDecreto: texto })
        });
        const d = await res.json();
        if (d.sucesso) {
            ocultoAlert("📜 " + d.relato);
            carregarMinhaOrdem();
        } else {
            ocultoAlert("⚠️ " + d.erro);
        }
    } catch(e) { ocultoAlert("Erro ao proclamar decreto."); }
}

async function promoverMembroClient(membroId) {
    if (!meuVampiro) return;
    try {
        const res = await fetch('/api/ordem/promover_grau', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: meuVampiro.id, membroId })
        });
        const d = await res.json();
        if (d.sucesso) {
            ocultoAlert("🔯 " + d.relato);
            carregarMinhaOrdem();
        } else {
            ocultoAlert("⚠️ " + d.erro);
        }
    } catch(e) { ocultoAlert("Erro ao ascender membro."); }
}

// --- MAGIA EM CÓDIGO (CODE-MAGIC ENGINE) ---
function inserirComandoCodigo(snippet) {
    const area = document.getElementById('code-formula-input');
    if (!area) return;
    area.value += (area.value.endsWith('\\n') || area.value === '' ? '' : '\\n') + snippet;
    verificarSintaxeAoDigitar();
}

async function verificarSintaxeAoDigitar() {
    const formula = document.getElementById('code-formula-input')?.value || '';
    const feedback = document.getElementById('code-syntax-feedback');
    if (!feedback) return;

    if (!formula.trim()) {
        feedback.innerText = "⚡ Insira instruções mágicas.";
        feedback.style.color = "#888";
        return;
    }

    try {
        const res = await fetch('/api/magia_codigo/validar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ formula })
        });
        const d = await res.json();
        if (d.valida) {
            feedback.innerText = "✓ Sintaxe Arcana Harmônica (" + (d.comandos?.length || 0) + " nós de comando válidos)";
            feedback.style.color = "#00ff88";
        } else {
            feedback.innerText = "✗ " + d.erro;
            feedback.style.color = "#ff4444";
        }
    } catch(e) {}
}

async function forjarMagiaCodigoClient() {
    if (!meuVampiro) return;
    const nome = document.getElementById('code-feitico-nome')?.value.trim();
    const esfera = document.getElementById('code-feitico-esfera')?.value || 'Tiphereth';
    const formula = document.getElementById('code-formula-input')?.value.trim();

    if (!nome || !formula) return ocultoAlert("Preenche o Nome e a Fórmula Arcana.");

    try {
        const res = await fetch('/api/magia_codigo/forjar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: meuVampiro.id, nome, esfera, codigoFormula: formula, custoSangue: 500, custoFuria: 2 })
        });
        const d = await res.json();
        if (d.sucesso) {
            ocultoAlert("⚡ " + d.relato);
            const terminal = document.getElementById('code-terminal-output');
            if (terminal) terminal.innerHTML += \`<br>> [SUCESSO]: Feitiço em Código [\${nome}] integrado à Matrix!\`;
            carregarMinhasMagiasCodigo();
        } else {
            ocultoAlert("⚠️ " + (d.erro || "Falha na forja em código."));
        }
    } catch(e) { ocultoAlert("Erro ao forjar magia em código."); }
}

async function carregarMinhasMagiasCodigo() {
    if (!meuVampiro) return;
    try {
        const res = await fetch('/api/magia_codigo/minhas/' + meuVampiro.id);
        const lista = await res.json();
        const container = document.getElementById('lista-minhas-magias-codigo');
        if (!container) return;

        if (!Array.isArray(lista) || lista.length === 0) {
            container.innerHTML = '<div style="color: #666; font-size: 0.85rem; text-align: center;">Ainda não forjaste nenhuma magia viva em código. Cria a tua primeira fórmula no terminal!</div>';
            return;
        }

        container.innerHTML = lista.map(m => \`
            <div style="background: rgba(0,0,0,0.7); border: 1px solid #00e1d9; border-radius: 6px; padding: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'Cinzel', serif; color: #00e1d9; font-weight: bold; font-size: 1.1rem;">⚡ \${m.nome}</span>
                    <span style="font-size: 0.75rem; color: #888;">Custo: \${m.custoSangue} Gts | \${m.custoFuria} Fúria</span>
                </div>
                <pre style="background: #050304; border: 1px solid #222; padding: 8px; font-size: 0.8rem; color: #00ff88; margin: 8px 0; border-radius: 4px; overflow-x: auto;">\${m.codigoFormula}</pre>
                <div style="display: flex; justify-content: flex-end;">
                    <button class="btn" style="background: linear-gradient(135deg, #0b1a1a, #00e1d9); color: #000; font-weight: bold; padding: 6px 14px;" onclick="executarMagiaCodigoClient('\${m.id}')">Executar no Servidor</button>
                </div>
            </div>
        \`).join('');

    } catch(e) { console.error("Erro ao listar magias em código:", e); }
}

async function carregarDocumentacaoOperadores() {
    try {
        const res = await fetch('/api/magia_codigo/operadores');
        const d = await res.json();
        const container = document.getElementById('lista-operadores-docs');
        if (!container || !d.operadores) return;

        container.innerHTML = d.operadores.map(op => \`
            <div style="background: rgba(0,0,0,0.6); border: 1px solid var(--ouro-sombra); padding: 10px; border-radius: 4px;">
                <div style="font-family: monospace; color: var(--ouro); font-weight: bold; font-size: 0.95rem;">\${op.op}</div>
                <div style="font-family: monospace; font-size: 0.8rem; color: #00e1d9; margin: 3px 0;">\${op.formato}</div>
                <div style="font-size: 0.8rem; color: #ccc;">\${op.desc}</div>
            </div>
        \`).join('');
    } catch(e) {}
}

async function executarMagiaCodigoClient(feiticoId) {
    if (!meuVampiro) return;
    try {
        const res = await fetch('/api/magia_codigo/executar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: meuVampiro.id, feiticoId, contexto: { pos2D: meuVampiro.posicao2D || { x: 50, y: 50 } } })
        });
        const d = await res.json();
        const terminal = document.getElementById('code-terminal-output');
        if (d.sucesso) {
            ocultoAlert("⚡ " + d.relato);
            if (terminal) {
                terminal.innerHTML += \`<br>> [EXECUTADO]: \${d.relato}\`;
                if (d.logs) d.logs.forEach(l => terminal.innerHTML += \`<br>  * \${l}\`);
            }
        } else {
            ocultoAlert("⚠️ " + d.erro);
            if (terminal) terminal.innerHTML += \`<br>> [FALHA]: \${d.erro}\`;
        }
    } catch(e) { ocultoAlert("Erro ao executar magia em código."); }
}

// --- INTEGRAÇÃO COM COMBATE VISCERAL ---
async function executarAcaoCombateAvancada(tipoAcao) {
    if (!combateDados || !combateDados.emCombate) return;
    
    // Dispara ação com tipo avançado
    combateDados.tipoAcaoAvancada = tipoAcao;
    
    // Simula pulso de ritmo se necessário
    const relatorio = {
        multiplicadorGeral: tipoAcao === 'parry_perfeito' ? 2.0 : (tipoAcao === 'golpe_pesado' ? 1.5 : (tipoAcao === 'golpe_visceral' ? 3.5 : 1.0)),
        danoRealCausado: tipoAcao === 'golpe_visceral' ? 1200 : (tipoAcao === 'golpe_pesado' ? 500 : (tipoAcao === 'parry_perfeito' ? 400 : 250)),
        danoRealSofrido: 0,
        sangueGastoMagia: 0,
        curaRuptura: tipoAcao === 'golpe_visceral' ? 300 : 0
    };

    const payload = {
        id: meuVampiro.id,
        alvoId: combateDados.alvoId,
        tipoCombate: combateDados.tipoCombate,
        postura: combateDados.posturaPvP,
        tipoAcao: tipoAcao,
        desempenhoRitmo: relatorio
    };

    try {
        const res = await fetch('/api/combate/action', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        const dados = await res.json();
        
        // Atualiza Postura HUD
        if (dados.posturaMax !== undefined) {
            const pct = Math.max(0, Math.min(100, (dados.posturaAtual / dados.posturaMax) * 100));
            const barraPostura = document.getElementById('arena-boss-postura-bar');
            const textoPostura = document.getElementById('arena-boss-postura-text');
            if (barraPostura) barraPostura.style.width = pct + '%';
            if (textoPostura) textoPostura.innerText = Math.round(pct);
        }

        // Alerta e Botão de Golpe Visceral
        const alertaVisceral = document.getElementById('arena-alerta-visceral');
        const btnVisceral = document.getElementById('btn-arena-visceral');
        if (dados.vulneravelVisceral) {
            if (alertaVisceral) alertaVisceral.classList.remove('oculto');
            if (btnVisceral) {
                btnVisceral.classList.remove('oculto');
                btnVisceral.classList.add('visceral-ready-btn');
            }
        } else {
            if (alertaVisceral) alertaVisceral.classList.add('oculto');
            if (btnVisceral) {
                btnVisceral.classList.add('oculto');
                btnVisceral.classList.remove('visceral-ready-btn');
            }
        }

        // Screen Shake e Efeitos Viscerais
        if (dados.visceral || dados.cinematica === 'visceral_blood_explosion' || dados.critico) {
            try { playSfx('espada'); } catch(e){}
            const arenaModal = document.getElementById('modal-combate');
            if (arenaModal) {
                arenaModal.classList.add('screen-shake');
                setTimeout(() => arenaModal.classList.remove('screen-shake'), 450);
            }
        }

        safeSet('arena-feedback', dados.relato, true);

        if (dados.finalizado) {
            encerrarArenaFinal(dados.relato);
        } else {
            combateDados.hpAtualInimigo = dados.hpRestante;
            combateDados.hpMaxInimigo = dados.hpMax || combateDados.hpMaxInimigo;
            atualizarFaseProceduralBoss();
        }

    } catch(e) { console.error("Erro na ação de combate:", e); }
}

function executarMagiaCodigoNoCombate() {
    nav('magia_codigo');
}
`;

if (!content.includes('carregarMinhaOrdem()')) {
    content = content.replace('// --- SOCKET LISTENERS ---', jsCliente + '\n// --- SOCKET LISTENERS ---');
}

// Chamar carregamento ao trocar de aba
if (!content.includes("if (abaId === 'ordem') carregarMinhaOrdem();")) {
    content = content.replace(
        "if (abaId === 'biblioteca') carregarBiblioteca();",
        "if (abaId === 'biblioteca') carregarBiblioteca();\n        if (abaId === 'ordem') carregarMinhaOrdem();\n        if (abaId === 'magia_codigo') { carregarMinhasMagiasCodigo(); carregarDocumentacaoOperadores(); }"
    );
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully injected Ordens Iniciaticas, Magia em Codigo, and Combat Visceral UI into index.html');
