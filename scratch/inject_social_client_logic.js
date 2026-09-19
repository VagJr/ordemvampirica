const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const socialClientLogic = `
    // =========================================================================
    // CAMADA SOCIAL, CO-OP MULTIPLAYER & TRADE P2P
    // =========================================================================
    let comitivaAtualCache = null;
    let sessaoTrocaAtual = null;
    let baloesFala2D = []; // [ { x, y, texto, tempo, cor } ]

    function trocarAbaSocial(secId, btn) {
        document.querySelectorAll('.social-subnav-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');

        ['comitiva', 'vinculos', 'contratos', 'caldeirao', 'roster'].forEach(s => {
            const el = document.getElementById('social-sec-' + s);
            if (el) el.style.display = (s === secId) ? 'block' : 'none';
        });

        if (secId === 'comitiva') carregarStatusComitiva();
        if (secId === 'vinculos') carregarVinculosSangue();
        if (secId === 'contratos') carregarContratosMercenarios();
        if (secId === 'caldeirao') carregarStatusCaldeirao();
        if (secId === 'roster') carregarRosterJogadoresOnline();
    }

    async function carregarPainelSocialCompleto() {
        if (!meuVampiro) return;
        await Promise.all([
            carregarStatusComitiva(),
            carregarVinculosSangue(),
            carregarContratosMercenarios(),
            carregarStatusCaldeirao(),
            carregarRosterJogadoresOnline()
        ]);
    }

    // --- 1. COMITIVAS DA NOITE (HUNTING PARTY) ---
    async function carregarStatusComitiva() {
        if (!meuVampiro) return;
        try {
            const res = await fetch(\`/api/social/comitiva/status?id=\${meuVampiro.id}\`);
            const dados = await res.json();
            const container = document.getElementById('social-comitiva-container');
            if (!container) return;

            const c = dados.comitiva;
            comitivaAtualCache = c;

            if (!c) {
                container.innerHTML = \`
                    <div class="card" style="border-color:#4a1520; background:#0e0306; text-align:center; padding:25px;">
                        <div style="font-size:2.5rem; margin-bottom:8px;">🐺</div>
                        <h3 style="color:#ff79c6; font-family:'Cinzel',serif; margin:0;">És um Predador Solitário</h3>
                        <p style="font-size:0.85rem; color:#aaa; max-width:500px; margin:8px auto 16px auto;">
                            Funda uma <b>Comitiva da Noite</b> ou aguarda um chamado. Membros de comitiva partilham <b>+15% de Dano Coletivo</b>, <b>25% de Dreno Compartilhado</b> e disparam <b>Flanco de Matilha</b> contra monstros e chefes mundiais.
                        </p>
                        <div style="display:flex; justify-content:center; gap:8px; max-width:400px; margin:0 auto;">
                            <input type="text" id="inp-nome-comitiva" placeholder="Nome da tua Matilha..." style="background:#180509; color:#fff; border:1px solid #ff007f; padding:8px 12px; border-radius:4px; flex:1;">
                            <button class="btn-magick" onclick="criarComitivaFront()" style="border-color:#ff007f; color:#ff79c6; padding:8px 16px;">🐺 Fundar</button>
                        </div>
                    </div>
                \`;
            } else {
                let membrosHTML = (c.membros || []).map(m => {
                    const hpPerc = Math.min(100, Math.floor((m.hpAtual / m.hpMax) * 100));
                    const furiaPerc = Math.min(100, Math.floor((m.furia / (m.furiaMax || 10)) * 100));
                    const isEu = m.id === meuVampiro.id;
                    return \`
                        <div class="party-card \${m.isLider ? 'is-leader' : ''}">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-weight:bold; color:\${m.isLider ? 'var(--ouro)' : '#fff'}; font-size:0.9rem;">
                                    \${m.isLider ? '👑 ' : ''}\${m.nome} \${isEu ? '<span style="color:#ff79c6; font-size:0.75rem;">(Tu)</span>' : ''}
                                </span>
                                <span style="font-size:0.72rem; color:#888;">Grau \${m.nivel} (\${m.raca})</span>
                            </div>
                            
                            <div class="party-hp-bar">
                                <div class="party-hp-fill" style="width: \${hpPerc}%;"></div>
                            </div>
                            <div style="display:flex; justify-content:space-between; font-size:0.68rem; color:#aaa;">
                                <span>HP: \${m.hpAtual}/\${m.hpMax}</span>
                                <span>\${m.sangue} Gts</span>
                            </div>

                            <div class="party-furia-bar" style="margin-top:4px;">
                                <div class="party-furia-fill" style="width: \${furiaPerc}%;"></div>
                            </div>
                            <div style="font-size:0.65rem; color:#2ed573; margin-top:2px;">Fúria: \${m.furia}/\${m.furiaMax}</div>

                            <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:0.7rem; color:#00e5ff;">📍 \${m.pos2D ? 'Mundo 2D (' + m.pos2D.x + ', ' + m.pos2D.y + ')' : 'No Sanctum'}</span>
                                \${!isEu && m.pos2D ? \`<button class="btn-magick" onclick="teleporteComitivaFront('\${m.id}')" style="padding:2px 8px; font-size:0.65rem; border-color:#00e5ff; color:#00e5ff;">Passo Sombrio</button>\` : ''}
                            </div>
                        </div>
                    \`;
                }).join('');

                container.innerHTML = \`
                    <div class="card" style="border-color:#ff007f; background:#0c0205; margin-bottom:12px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                            <div>
                                <h3 style="color:#ff79c6; font-family:'Cinzel',serif; margin:0; font-size:1.15rem;">
                                    🐺 \${c.nome} <span style="font-size:0.75rem; color:var(--ouro); font-weight:normal;">[Líder: \${c.liderNome}]</span>
                                </h3>
                                <div style="font-size:0.75rem; color:#0f5; margin-top:3px;">
                                    ✨ \${c.buffAtivo}
                                </div>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button class="btn-magick" onclick="sairComitivaFront()" style="padding:5px 12px; font-size:0.72rem; border-color:#ff3838; color:#ff3838;">Sair da Comitiva</button>
                            </div>
                        </div>

                        \${c.isLider || c.liderId === meuVampiro.id ? \`
                            <div style="margin-top:10px; display:flex; gap:8px; align-items:center;">
                                <select id="sel-convidar-comitiva" style="background:#150408; color:#fff; border:1px solid #ff007f; padding:6px; border-radius:4px; flex:1;">
                                    <option value="">-- Convidar jogador online para a matilha --</option>
                                </select>
                                <button class="btn-magick" onclick="convidarParaComitivaFront()" style="padding:6px 14px; font-size:0.75rem; border-color:#ff007f; color:#ff79c6;">➕ Convidar</button>
                            </div>
                        \` : ''}
                    </div>

                    <div class="party-grid">
                        \${membrosHTML}
                    </div>
                \`;
            }
        } catch(e) {}
    }

    async function criarComitivaFront() {
        if (!meuVampiro) return;
        const nome = (document.getElementById('inp-nome-comitiva')?.value || '').trim();
        try {
            const res = await fetch('/api/social/comitiva/criar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: meuVampiro.id, nome })
            });
            const d = await res.json();
            if (d.erro) return ocultoAlert(d.erro);
            playSfx('uivo');
            showJuiceNotif("COMITIVA FUNDADA", d.relato);
            carregarStatusComitiva();
        } catch(e) { ocultoAlert("Falha ao criar comitiva."); }
    }

    async function convidarParaComitivaFront() {
        if (!meuVampiro) return;
        const convidadoId = document.getElementById('sel-convidar-comitiva')?.value;
        if (!convidadoId) return ocultoAlert("Seleciona um iniciado.");
        try {
            const res = await fetch('/api/social/comitiva/convidar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: meuVampiro.id, convidadoId })
            });
            const d = await res.json();
            if (d.erro) return ocultoAlert(d.erro);
            playSfx('magia');
            showJuiceNotif("CONVOCAÇÃO", d.relato);
        } catch(e) { ocultoAlert("Falha ao convidar."); }
    }

    async function sairComitivaFront() {
        if (!meuVampiro) return;
        const ok = await ocultoConfirm("Desejas romper com a tua Comitiva da Noite?");
        if (!ok) return;
        try {
            const res = await fetch('/api/social/comitiva/sair', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: meuVampiro.id })
            });
            const d = await res.json();
            if (d.erro) return ocultoAlert(d.erro);
            showJuiceNotif("COMITIVA", d.relato);
            carregarStatusComitiva();
        } catch(e) { ocultoAlert("Falha ao sair."); }
    }

    function teleporteComitivaFront(alvoId) {
        if (!meuVampiro) return;
        if (typeof socket !== 'undefined' && socket) {
            socket.emit('world2d_party_teleport', { id: meuVampiro.id, alvoId });
        }
        showJuiceNotif("PASSO SOMBRIO", "Translocaste-te pelas brumas até o teu aliado!");
        if (typeof nav === 'function') nav('mundo2d');
    }

    // --- 2. VÍNCULOS DE SANGUE ---
    async function carregarVinculosSangue() {
        if (!meuVampiro) return;
        const lista = document.getElementById('social-vinculos-lista');
        if (!lista) return;

        const vinculos = meuVampiro.vinculosSangue || [];
        if (vinculos.length === 0) {
            lista.innerHTML = \`<p style="color:#666; font-size:0.8rem; text-align:center; grid-column:span 2; padding:20px;">Nenhum Vínculo de Sangue selado ainda. Escolhe um iniciado acima para entrelaçar as vossas veias!</p>\`;
            return;
        }

        lista.innerHTML = vinculos.map(v => \`
            <div style="background:#110307; border:1px solid #ff1744; border-radius:6px; padding:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:#ff5252; font-weight:bold; font-size:0.9rem;">🩸 \${v.parceiroNome}</span>
                    <span style="font-size:0.72rem; color:var(--ouro);">Elo Grau \${v.nivelElo || 1}</span>
                </div>
                <div style="font-size:0.75rem; color:#aaa; margin:6px 0;">
                    Volume Transfundido: <b style="color:#fff;">\${v.gtsTrocados || 0} Gts</b>
                </div>
                <div style="font-size:0.7rem; color:#ff79c6; margin-bottom:8px;">
                    ✨ Ressonância: Salvação Vital à Distância (+75% HP)
                </div>
                <div style="display:flex; gap:6px;">
                    <button class="btn-magick" onclick="executarTransfusaoVitalFront('\${v.parceiroId}', 200)" style="padding:4px 8px; font-size:0.68rem; border-color:#ff1744; color:#ff1744;">Doar 200 Gts</button>
                    <button class="btn-magick" onclick="executarTransfusaoVitalFront('\${v.parceiroId}', 500)" style="padding:4px 8px; font-size:0.68rem; border-color:#ff007f; color:#ff007f;">Doar 500 Gts</button>
                    <button class="btn-magick" onclick="executarTransfusaoVitalFront('\${v.parceiroId}', 1000)" style="padding:4px 8px; font-size:0.68rem; border-color:var(--ouro); color:var(--ouro);">Doar 1.000 Gts</button>
                </div>
            </div>
        \`).join('');
    }

    async function forjarVinculoSangueFront() {
        if (!meuVampiro) return;
        const parceiroId = document.getElementById('sel-propor-vinculo')?.value;
        if (!parceiroId) return ocultoAlert("Seleciona um vampiro para forjar o vínculo.");
        try {
            const res = await fetch('/api/social/vinculo/forjar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: meuVampiro.id, parceiroId })
            });
            const d = await res.json();
            if (d.erro) return ocultoAlert(d.erro);
            playSfx('sangue');
            showJuiceNotif("VÍNCULO SELADO", d.relato);
            syncStatus();
            setTimeout(carregarVinculosSangue, 300);
        } catch(e) { ocultoAlert("Falha ao forjar vínculo."); }
    }

    async function executarTransfusaoVitalFront(parceiroId, quantiaGts) {
        if (!meuVampiro) return;
        try {
            const res = await fetch('/api/social/vinculo/transfusao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: meuVampiro.id, parceiroId, quantiaGts })
            });
            const d = await res.json();
            if (d.erro) return ocultoAlert(d.erro);
            playSfx('sangue');
            showJuiceNotif("TRANSFUSÃO VITAL", d.relato);
            if (d.sangueRestante !== undefined) meuVampiro.sangue = d.sangueRestante;
            syncUI();
            carregarVinculosSangue();
        } catch(e) { ocultoAlert("Falha na transfusão."); }
    }

    // --- 3. MURAL DE CONTRATOS MERCENÁRIOS ---
    async function carregarContratosMercenarios() {
        if (!meuVampiro) return;
        const lista = document.getElementById('social-contratos-lista');
        if (!lista) return;

        try {
            const res = await fetch('/api/social/contratos/listar');
            const d = await res.json();
            const contratos = d.contratos || [];

            if (contratos.length === 0) {
                lista.innerHTML = \`<p style="color:#666; font-size:0.8rem; text-align:center; padding:25px;">O Mural Mercenário está silencioso. Afixa a primeira ordem de serviço!</p>\`;
                return;
            }

            lista.innerHTML = contratos.map(c => {
                const isMeu = c.criadorId === meuVampiro.id;
                const isAceitoPorMim = c.aceitoPor === meuVampiro.id;
                return \`
                    <div class="contrato-card">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:6px;">
                            <div>
                                <h4 style="color:var(--ouro); margin:0; font-size:0.95rem;">📜 \${c.titulo}</h4>
                                <span style="font-size:0.72rem; color:#888;">Autor: \${c.criadorNome} \${isMeu ? '(Tu)' : ''} • Tipo: \${c.tipo}</span>
                            </div>
                            <div style="text-align:right;">
                                <span style="font-size:0.95rem; font-weight:bold; color:#0f5;">💰 \${c.recompensaGts} Gts</span>
                                <div style="font-size:0.68rem; color:\${c.status === 'aberto' ? '#ff9800' : '#00e5ff'};">
                                    [\${c.status.toUpperCase()}] \${c.aceitoPorNome ? 'por ' + c.aceitoPorNome : ''}
                                </div>
                            </div>
                        </div>

                        <p style="font-size:0.8rem; color:#ccc; margin:8px 0;">\${c.descricao}</p>
                        
                        \${c.requisito ? \`
                            <div style="background:#150508; border:1px dashed #4a1520; padding:6px 10px; border-radius:4px; font-size:0.75rem; color:var(--ouro); display:inline-block; margin-bottom:8px;">
                                Exigência: <b>\${c.requisito.qtd}x [\${c.requisito.item}]</b>
                            </div>
                        \` : ''}

                        <div style="display:flex; justify-content:flex-end; gap:8px;">
                            \${c.status === 'aberto' && !isMeu ? \`
                                <button class="btn-magick" onclick="aceitarContratoMercenarioFront('\${c.id}')" style="padding:4px 12px; font-size:0.72rem; border-color:#00e5ff; color:#00e5ff;">Assumir Contrato</button>
                            \` : ''}
                            \${isAceitoPorMim ? \`
                                <button class="btn-magick" onclick="cumprirContratoMercenarioFront('\${c.id}')" style="padding:4px 12px; font-size:0.72rem; border-color:#0f5; color:#0f5; font-weight:bold;">📦 Entregar Recursos e Reclamar Sangue</button>
                            \` : ''}
                        </div>
                    </div>
                \`;
            }).join('');
        } catch(e) {}
    }

    function abrirModalPublicarContrato() {
        const m = document.getElementById('modal-publicar-contrato');
        if (m) m.classList.remove('oculto');
    }

    async function publicarContratoMercenarioFront() {
        if (!meuVampiro) return;
        const titulo = document.getElementById('novo-cnt-titulo')?.value;
        const descricao = document.getElementById('novo-cnt-desc')?.value;
        const item = document.getElementById('novo-cnt-item')?.value;
        const qtd = parseInt(document.getElementById('novo-cnt-qtd')?.value || '20');
        const recompensaGts = parseInt(document.getElementById('novo-cnt-recompensa')?.value || '500');

        if (!titulo) return ocultoAlert("Dá um título ao teu contrato.");
        if (recompensaGts < 200) return ocultoAlert("Recompensa mínima de 200 Gts.");

        try {
            const res = await fetch('/api/social/contratos/publicar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: meuVampiro.id,
                    tipo: 'coleta',
                    titulo,
                    descricao,
                    recompensaGts,
                    requisito: { item, qtd }
                })
            });
            const d = await res.json();
            if (d.erro) return ocultoAlert(d.erro);
            playSfx('ouro');
            showJuiceNotif("CONTRATO PUBLICADO", d.relato);
            document.getElementById('modal-publicar-contrato').classList.add('oculto');
            syncStatus();
            carregarContratosMercenarios();
        } catch(e) { ocultoAlert("Falha ao publicar contrato."); }
    }

    async function aceitarContratoMercenarioFront(contratoId) {
        if (!meuVampiro) return;
        try {
            const res = await fetch('/api/social/contratos/aceitar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: meuVampiro.id, contratoId })
            });
            const d = await res.json();
            if (d.erro) return ocultoAlert(d.erro);
            playSfx('espada');
            showJuiceNotif("CONTRATO ASSUMIDO", d.relato);
            carregarContratosMercenarios();
        } catch(e) { ocultoAlert("Falha ao aceitar contrato."); }
    }

    async function cumprirContratoMercenarioFront(contratoId) {
        if (!meuVampiro) return;
        try {
            const res = await fetch('/api/social/contratos/cumprir', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: meuVampiro.id, contratoId })
            });
            const d = await res.json();
            if (d.erro) return ocultoAlert(d.erro);
            playSfx('ouro');
            showJuiceNotif("RECOMPENSA RECLAMADA", d.relato);
            syncStatus();
            carregarContratosMercenarios();
        } catch(e) { ocultoAlert("Falha ao entregar contrato."); }
    }

    // --- 4. GRANDE CALDEIRÃO DA EGRÉGORA ---
    async function carregarStatusCaldeirao() {
        try {
            const res = await fetch('/api/social/caldeirao/status');
            const d = await res.json();
            const bar = document.getElementById('caldeirao-fill-bar');
            const txt = document.getElementById('caldeirao-status-txt');
            const banner = document.getElementById('caldeirao-eclipse-banner');
            const timer = document.getElementById('caldeirao-timer');

            if (bar) bar.style.width = d.progressoPercentual + '%';
            if (txt) txt.innerHTML = \`\${d.acumulado} / \${d.meta} Gts Acumulados (\${d.progressoPercentual}%)\`;

            if (banner && timer) {
                if (d.eclipseAtivo) {
                    banner.style.display = 'block';
                    const mins = Math.floor(d.tempoRestanteSegundos / 60);
                    const secs = d.tempoRestanteSegundos % 60;
                    timer.innerText = \`Tempo restante: \${mins}m \${secs < 10 ? '0' + secs : secs}s\`;
                } else {
                    banner.style.display = 'none';
                }
            }
        } catch(e) {}
    }

    async function doarCaldeiraoFront(quantiaGts) {
        if (!meuVampiro) return;
        try {
            const res = await fetch('/api/social/caldeirao/doar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: meuVampiro.id, quantiaGts })
            });
            const d = await res.json();
            if (d.erro) return ocultoAlert(d.erro);
            playSfx(d.eclipseAtivado ? 'sino' : 'sangue');
            showJuiceNotif("OFERENDA AO CALDEIRÃO", d.relato);
            syncStatus();
            carregarStatusCaldeirao();
        } catch(e) { ocultoAlert("Falha na oferenda."); }
    }

    // --- 5. ROSTER DE VAMPIROS ONLINE ---
    async function carregarRosterJogadoresOnline() {
        if (!meuVampiro) return;
        const container = document.getElementById('social-roster-lista');
        const selVinculo = document.getElementById('sel-propor-vinculo');
        const selComitiva = document.getElementById('sel-convidar-comitiva');
        if (!container) return;

        try {
            const res = await fetch(\`/api/social/jogadores_online?meuId=\${meuVampiro.id}\`);
            const d = await res.json();
            const jogadores = d.jogadores || [];

            // Popula seletores
            if (selVinculo) {
                selVinculo.innerHTML = '<option value="">-- Seleciona um vampiro para forjar vínculo --</option>' +
                    jogadores.filter(j => j.id !== meuVampiro.id).map(j => \`<option value="\${j.id}">\${j.nome} (Grau \${j.nivel})</option>\`).join('');
            }
            if (selComitiva) {
                selComitiva.innerHTML = '<option value="">-- Convidar jogador online para a matilha --</option>' +
                    jogadores.filter(j => j.id !== meuVampiro.id).map(j => \`<option value="\${j.id}">\${j.nome} (Grau \${j.nivel})</option>\`).join('');
            }

            container.innerHTML = jogadores.map(j => {
                const isEu = j.id === meuVampiro.id;
                return \`
                    <div style="background:#0b0306; border:1px solid \${isEu ? '#ff007f' : '#331518'}; border-radius:6px; padding:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-weight:bold; color:\${isEu ? '#ff79c6' : 'var(--ouro)'}; font-size:0.88rem;">
                                \${j.raca === 'lycan' ? '🐺' : '🧛'} \${j.nome} \${isEu ? '(Tu)' : ''}
                            </span>
                            <span style="font-size:0.7rem; color:#888;">Grau \${j.nivel}</span>
                        </div>
                        <div style="font-size:0.72rem; color:#aaa; margin:4px 0;">
                            Clã: <span style="color:#00e5ff;">\${j.clan || 'Sem Clã'}</span>
                        </div>
                        <div style="font-size:0.7rem; color:#0f5; margin-bottom:8px;">
                            📍 \${j.pos2D ? j.pos2D.zona : 'No Sanctum'}
                        </div>
                        \${!isEu ? \`
                            <div style="display:flex; gap:5px; flex-wrap:wrap;">
                                <button class="btn-magick" onclick="iniciarTrocaDiretaFront('\${j.id}')" style="padding:3px 8px; font-size:0.68rem; border-color:var(--ouro); color:var(--ouro);">🤝 Trocar</button>
                                <button class="btn-magick" onclick="executarAcaoRosterRapida('convidar', '\${j.id}')" style="padding:3px 8px; font-size:0.68rem; border-color:#ff007f; color:#ff79c6;">🐺 Matilha</button>
                            </div>
                        \` : ''}
                    </div>
                \`;
            }).join('');
        } catch(e) {}
    }

    function executarAcaoRosterRapida(acao, alvoId) {
        if (acao === 'convidar') {
            const sel = document.getElementById('sel-convidar-comitiva');
            if (sel) sel.value = alvoId;
            convidarParaComitivaFront();
        }
    }

    // --- 6. TROCA DIRETA SEGURA P2P (TRADE WINDOW) ---
    async function iniciarTrocaDiretaFront(alvoId) {
        if (!meuVampiro) return;
        try {
            const res = await fetch('/api/social/trade/iniciar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: meuVampiro.id, alvoId })
            });
            const d = await res.json();
            if (d.erro) return ocultoAlert(d.erro);
            sessaoTrocaAtual = d.sessao;
            abrirModalTroca(d.sessao);
            showJuiceNotif("TROCA P2P", "Sessão mercantil aberta!");
        } catch(e) { ocultoAlert("Falha ao iniciar troca."); }
    }

    function abrirModalTroca(sessao) {
        const m = document.getElementById('modal-troca-p2p');
        if (!m) return;
        m.classList.remove('oculto');
        sessaoTrocaAtual = sessao;

        const containerMeus = document.getElementById('trade-meus-itens');
        if (containerMeus && meuVampiro) {
            containerMeus.innerHTML = (meuVampiro.bolsa || []).map(item => {
                const miniSvg = typeof obterSVGProceduralItem === 'function' ? obterSVGProceduralItem(item) : '⚔️';
                return \`
                    <label style="display:flex; align-items:center; gap:8px; background:#080204; border:1px solid #331518; padding:4px; border-radius:4px; cursor:pointer;">
                        <input type="checkbox" class="chk-trade-item" value="\${item.id}" onchange="atualizarOfertaTrocaFront()">
                        <div style="width:28px; height:28px;">\${miniSvg}</div>
                        <span style="font-size:0.75rem; color:\${item.corRaridade || 'var(--ouro)'};">\${item.nome}</span>
                    </label>
                \`;
            }).join('');
        }
    }

    function fecharModalTroca() {
        const m = document.getElementById('modal-troca-p2p');
        if (m) m.classList.add('oculto');
        sessaoTrocaAtual = null;
    }

    async function atualizarOfertaTrocaFront() {
        if (!sessaoTrocaAtual || !meuVampiro) return;
        const checks = Array.from(document.querySelectorAll('.chk-trade-item:checked')).map(c => c.value);
        const gts = parseInt(document.getElementById('trade-meus-gts')?.value || '0');

        try {
            const res = await fetch('/api/social/trade/ofertar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessaoId: sessaoTrocaAtual.id,
                    id: meuVampiro.id,
                    itemIds: checks,
                    gts
                })
            });
            const d = await res.json();
            if (d.sessao) sessaoTrocaAtual = d.sessao;
        } catch(e) {}
    }

    async function travarTrocaFront() {
        if (!sessaoTrocaAtual || !meuVampiro) return;
        try {
            const res = await fetch('/api/social/trade/travar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessaoId: sessaoTrocaAtual.id, id: meuVampiro.id })
            });
            const d = await res.json();
            if (d.sucesso) {
                playSfx('espada');
                document.getElementById('trade-btn-travar').innerText = "🔒 Oferta Travada";
                document.getElementById('trade-btn-travar').style.borderColor = "#ffd700";
                document.getElementById('trade-btn-travar').style.color = "#ffd700";
                sessaoTrocaAtual = d.sessao;
            }
        } catch(e) {}
    }

    async function confirmarTrocaFront() {
        if (!sessaoTrocaAtual || !meuVampiro) return;
        try {
            const res = await fetch('/api/social/trade/confirmar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessaoId: sessaoTrocaAtual.id, id: meuVampiro.id })
            });
            const d = await res.json();
            if (d.erro) return ocultoAlert(d.erro);
            if (d.concluida) {
                playSfx('ouro');
                showJuiceNotif("TROCA CONCLUÍDA", d.relato);
                fecharModalTroca();
                syncStatus();
            }
        } catch(e) { ocultoAlert("Falha ao confirmar troca."); }
    }

    // --- 7. BALÕES DE PROXIMIDADE 2D NO CANVAS ---
    async function enviarFalaProximidade2D(texto) {
        if (!meuVampiro || !texto || !texto.trim()) return;
        try {
            await fetch('/api/social/proximidade/falar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: meuVampiro.id, texto: texto.trim() })
            });
        } catch(e) {}
    }

    function registrarBalaoFala2D(msg) {
        if (!msg) return;
        baloesFala2D.push({
            x: msg.x,
            y: msg.y,
            jogadorId: msg.jogadorId,
            nome: msg.nome,
            texto: msg.texto,
            expiraEm: Date.now() + 6000
        });
    }

    // --- 8. ATAQUE AO CHEFE MUNDIAL AZAZEL NO 2D ---
    async function atacarBossMundial2D() {
        if (!meuVampiro) return;
        try {
            const res = await fetch('/api/mundo2d/atacar_boss', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: meuVampiro.id })
            });
            const d = await res.json();
            if (d.erro) return ocultoAlert(d.erro);
            playSfx(d.bossMorto ? 'sino' : 'espada');
            showJuiceNotif(d.bossMorto ? "AZAZEL ANIQUILADO!" : "GOLPE NO CHEFE MUNDIAL", d.relato);
            if (typeof triggerScreenShake === 'function') triggerScreenShake(8);
            syncStatus();
        } catch(e) { ocultoAlert("Falha ao golpear o chefe mundial."); }
    }

    // --- 9. SOCKET LISTENERS SOCIAIS ---
    if (typeof socket !== 'undefined' && socket) {
        socket.on('world2d_chat_bubble', (msg) => {
            registrarBalaoFala2D(msg);
        });

        socket.on('social_party_update', () => {
            carregarStatusComitiva();
        });

        socket.on('social_party_invite', (d) => {
            if (meuVampiro && d.convidadoId === meuVampiro.id) {
                playSfx('uivo');
                showJuiceNotif("CONVOCAÇÃO DE MATILHA", \`\${d.convite.liderNome} convidou-te para a comitiva!\`);
                carregarStatusComitiva();
            }
        });

        socket.on('social_caldeirao_update', () => {
            carregarStatusCaldeirao();
        });

        socket.on('social_eclipse_iniciado', (d) => {
            playSfx('sino');
            showJuiceNotif("🌑 ECLIPSE DESPERTOU", d.relato);
            carregarStatusCaldeirao();
        });

        socket.on('social_contratos_update', () => {
            carregarContratosMercenarios();
        });

        socket.on('social_trade_invite', (d) => {
            if (meuVampiro && d.alvoId === meuVampiro.id) {
                playSfx('ouro');
                sessaoTrocaAtual = d.sessao;
                abrirModalTroca(d.sessao);
            }
        });

        socket.on('social_trade_update', (sessao) => {
            if (sessaoTrocaAtual && sessaoTrocaAtual.id === sessao.id) {
                sessaoTrocaAtual = sessao;
                // Atualiza lado do parceiro
                const parceiro = (sessao.j1.id === meuVampiro.id) ? sessao.j2 : sessao.j1;
                const meu = (sessao.j1.id === meuVampiro.id) ? sessao.j1 : sessao.j2;
                
                const containerAliado = document.getElementById('trade-aliado-itens');
                if (containerAliado) {
                    if (parceiro.itens.length === 0) {
                        containerAliado.innerHTML = '<p style="color:#555; font-size:0.75rem; text-align:center;">Nenhum item ofertado.</p>';
                    } else {
                        containerAliado.innerHTML = parceiro.itens.map(it => {
                            const miniSvg = typeof obterSVGProceduralItem === 'function' ? obterSVGProceduralItem(it) : '⚔️';
                            return \`<div style="display:flex; align-items:center; gap:6px; background:#04060e; padding:3px 6px; border-radius:3px;"><div style="width:24px; height:24px;">\${miniSvg}</div><span style="font-size:0.75rem; color:\${it.corRaridade || '#d4af37'};">\${it.nome}</span></div>\`;
                        }).join('');
                    }
                }
                const gtsAliado = document.getElementById('trade-aliado-gts');
                if (gtsAliado) gtsAliado.innerText = (parceiro.gts || 0) + ' Gts';

                const statusAliado = document.getElementById('trade-aliado-status');
                if (statusAliado) {
                    statusAliado.innerText = parceiro.travado ? "🔒 Oferta Travada pelo Aliado" : "⏳ Modificando oferta...";
                    statusAliado.style.color = parceiro.travado ? "#0f5" : "#ff9800";
                }

                const btnConfirmar = document.getElementById('trade-btn-confirmar');
                if (btnConfirmar) {
                    if (meu.travado && parceiro.travado) {
                        btnConfirmar.disabled = false;
                        btnConfirmar.style.borderColor = "#0f5";
                        btnConfirmar.style.color = "#0f5";
                    } else {
                        btnConfirmar.disabled = true;
                        btnConfirmar.style.borderColor = "#555";
                        btnConfirmar.style.color = "#555";
                    }
                }
            }
        });
    }
`;

if (!html.includes('CAMADA SOCIAL, CO-OP MULTIPLAYER & TRADE P2P')) {
    html = html.replace(
        'function renderizarPaperdollEquipamentos() {',
        socialClientLogic + '\n    function renderizarPaperdollEquipamentos() {'
    );
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html client logic injected successfully.');
