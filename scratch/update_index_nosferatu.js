const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const normHtml = html.replace(/\r\n/g, '\n');

const markerStart = "PORTAL NOSFERATU — OSINT FUNCTIONS";
const idxStart = normHtml.indexOf(markerStart);

// Encontra o fim da função executarAcaoKarmica
const markerEnd = "ocultoAlert(\"O Véu rejeitou a ação kármica.\");\n        }\n    }";
const idxEnd = normHtml.indexOf(markerEnd);

console.log('idxStart:', idxStart, 'idxEnd:', idxEnd);

if (idxStart !== -1 && idxEnd !== -1) {
    // Recua até o início da linha de comentário
    const lineStart = normHtml.lastIndexOf('\n', idxStart - 1);
    const endPos = idxEnd + markerEnd.length;

    const newJs = `    // ==========================================
    // PORTAL NOSFERATU — OSINT & EMANAÇÕES ASTRAIS
    // ==========================================
    let alvosNosferatuCache = [];
    let esferaAtivaAlvo = {};

    function obterBadgeEstadoAstral(estado) {
        if (!estado) estado = 'Vigília Mundana';
        if (estado.includes('Lilith')) return '<span class="nosf-state-badge badge-bencao">💖 ' + estado + '</span>';
        if (estado.includes('Enfeitiçado')) return '<span class="nosf-state-badge badge-enfeiticado">💘 ' + estado + '</span>';
        if (estado.includes('Onírica') || estado.includes('Kármico')) return '<span class="nosf-state-badge badge-onirica">⚡ ' + estado + '</span>';
        if (estado.includes('Atormentado')) return '<span class="nosf-state-badge badge-atormentado">🩸 ' + estado + '</span>';
        if (estado.includes('Limbo')) return '<span class="nosf-state-badge badge-limbo">🕳️ ' + estado + '</span>';
        if (estado.includes('Tártaro')) return '<span class="nosf-state-badge badge-tartaro">🔥 ' + estado + '</span>';
        return '<span class="nosf-state-badge badge-vigilia">👁️ ' + estado + '</span>';
    }

    function obterIconeElemento(el) {
        const icones = { 'Fogo': '🔥', 'Água': '💧', 'Terra': '🌿', 'Ar': '💨', 'Éter': '🪐', 'Vácuo': '🕳️' };
        return (icones[el] || '🌌') + ' ' + (el || 'Éter');
    }

    async function rasgarVeuNosferatu() {
        if (!meuVampiro || (!meuVampiro.admin && meuVampiro.geracao !== 1 && meuVampiro.nivel < 99)) {
            return ocultoAlert("Heresia. Apenas Mestres Supremos Nv.99 podem rasgar o Véu.");
        }

        const nomeReal = document.getElementById('nosf-nome-real').value.trim();
        const instagram = document.getElementById('nosf-instagram').value.trim();
        const twitter = document.getElementById('nosf-twitter').value.trim();
        const urlPerfil = document.getElementById('nosf-url-perfil').value.trim();
        const notas = document.getElementById('nosf-notas').value.trim();

        if (!nomeReal && !instagram && !twitter && !urlPerfil) {
            return ocultoAlert("O Véu exige ao menos um fragmento de identidade para ser rasgado.");
        }

        const container = document.getElementById('nosf-dossie-conteudo');
        const resultBox = document.getElementById('nosf-resultado');
        resultBox.style.display = 'block';
        container.innerHTML = '<div style="padding:15px;color:#d080ff;text-align:center;"><div style="animation:pulseRed 1.5s infinite;font-size:1.1em;font-family:\\'Cinzel\\',serif;">🕸️ A MENTE ABISSAL ESTÁ VASCULHANDO O ÉTER...</div><div style="font-size:0.8em;color:#888;margin-top:5px;">Consultando Wikipedia, DuckDuckGo, Notícias Globais e sintetizando qualidades no Groq...</div></div>';

        playSfx('magia');
        showJuiceNotif("VÉU RASGANDO", "Pesquisa pública real e forja de qualidades em andamento...");

        try {
            const res = await fetch('/api/nosferatu/rasgar_veu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify({
                    adminId: meuVampiro.id,
                    nomeReal, instagram, twitter, urlPerfil, notas
                })
            });

            const raw = await res.text();
            let dados = {};
            try { dados = raw ? JSON.parse(raw) : {}; }
            catch (_) { dados = { erro: "Resposta inválida do servidor (HTTP " + res.status + ")." }; }

            if (!res.ok || dados.erro) {
                const mensagem = dados.erro || ("Falha HTTP " + res.status);
                const detalhe = dados.detalhe ? ("\\n" + dados.detalhe) : '';
                container.innerHTML = '<div style="padding:12px;color:#ff7788;white-space:pre-wrap;">' + mensagem + detalhe + '</div>';
                ocultoAlert(mensagem);
                return;
            }

            const d = dados.dossie;
            container.innerHTML = \`
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #3a1060; padding-bottom:8px; margin-bottom:12px;">
                    <div>
                        <h4 style="color:#fff; font-family:'Cinzel',serif; margin:0; font-size:1.15em;">\${d.nomeAstral || nomeReal}</h4>
                        <div style="font-size:0.8em; color:#d080ff; font-style:italic;">\${d.arquetipoAbissal || 'O Viajante do Véu'}</div>
                    </div>
                    <div>\${obterBadgeEstadoAstral(d.estadoAstral)}</div>
                </div>

                <div class="nosf-grid-metricas">
                    <div class="nosf-metric-card">
                        <div class="nosf-metric-title">⚖️ Peso Kármico</div>
                        <div class="nosf-metric-val">\${d.pesoKarmico} / 100</div>
                    </div>
                    <div class="nosf-metric-card">
                        <div class="nosf-metric-title">🕯️ Alma</div>
                        <div class="nosf-metric-val" style="color:\${d.corAlma || '#d080ff'}; font-size:0.82em;">\${d.essencia}</div>
                    </div>
                    <div class="nosf-metric-card">
                        <div class="nosf-metric-title">🩸 Corrupção</div>
                        <div class="nosf-metric-val" style="color:\${d.taxaCorrupcao > 60 ? '#ff4444' : '#00ff88'}">\${d.taxaCorrupcao}%</div>
                    </div>
                    <div class="nosf-metric-card">
                        <div class="nosf-metric-title">🌌 Elemento</div>
                        <div class="nosf-metric-val">\${obterIconeElemento(d.ressonanciaElemental)}</div>
                    </div>
                    <div class="nosf-metric-card">
                        <div class="nosf-metric-title">🔮 Afinidade</div>
                        <div class="nosf-metric-val" style="font-size:0.82em;">\${d.afinidadeOculta || 'Magnetismo'}</div>
                    </div>
                    <div class="nosf-metric-card">
                        <div class="nosf-metric-title">👑 Vaso Influência</div>
                        <div class="nosf-metric-val">\${d.vasoInfluencia || 50}%</div>
                    </div>
                    <div class="nosf-metric-card">
                        <div class="nosf-metric-title">🛡️ Resist. Psíquica</div>
                        <div class="nosf-metric-val">\${d.resistenciaPsiquica || 50}%</div>
                    </div>
                    <div class="nosf-metric-card">
                        <div class="nosf-metric-title">👁️ Vulnerabilidade</div>
                        <div class="nosf-metric-val">\${d.vulnerabilidadeEspiritual || 50}%</div>
                    </div>
                    <div class="nosf-metric-card">
                        <div class="nosf-metric-title">☯️ Polaridade</div>
                        <div class="nosf-metric-val" style="font-size:0.82em;">\${d.polaridadeAlma || 'Penumbra'}</div>
                    </div>
                    <div class="nosf-metric-card">
                        <div class="nosf-metric-title">🩸 Pureza Sangue</div>
                        <div class="nosf-metric-val">\${d.purezaSangue || 50}%</div>
                    </div>
                    <div class="nosf-metric-card">
                        <div class="nosf-metric-title">🎵 Frequência</div>
                        <div class="nosf-metric-val">\${d.frequenciaVibracionalHz || 528} Hz</div>
                    </div>
                    <div class="nosf-metric-card">
                        <div class="nosf-metric-title">🔒 Sigilo Astral</div>
                        <div class="nosf-metric-val" style="font-size:0.75em; font-family:monospace;">\${d.sigilo ? d.sigilo.substring(0, 10) + '...' : 'N/A'}</div>
                    </div>
                </div>

                <div style="margin-top:15px;padding:12px;background:#0a0015;border-left:3px solid var(--magia);border-radius:3px;">
                    <div style="color:var(--magia);font-weight:bold;margin-bottom:5px;font-family:'Cinzel',serif;">📖 Análise da Mente Abissal</div>
                    <div style="color:#bbb;line-height:1.6;white-space:pre-wrap;font-size:0.92em;">\${d.analiseIA}</div>
                </div>
            \`;

            document.getElementById('nosf-nome-real').value = '';
            document.getElementById('nosf-instagram').value = '';
            document.getElementById('nosf-twitter').value = '';
            document.getElementById('nosf-url-perfil').value = '';
            document.getElementById('nosf-notas').value = '';

            if (d.alvoId) {
                const idx = alvosNosferatuCache.findIndex(x => x.alvoId === d.alvoId || x.nomeAstral.toLowerCase() === d.nomeAstral.toLowerCase());
                if (idx >= 0) alvosNosferatuCache[idx] = d;
                else alvosNosferatuCache.push(d);
                renderizarAlvosNosferatu();
            }
        } catch (e) {
            container.innerHTML = '<div style="padding:12px;color:#ff7788;">Falha de rede: ' + (e?.message || 'erro desconhecido') + '</div>';
            ocultoAlert("A pesquisa externa falhou. Veja o erro no painel.");
        }
    }

    function trocarEsferaAcao(alvoId, esfera) {
        esferaAtivaAlvo[alvoId] = esfera;
        renderizarAlvosNosferatu();
    }

    function toggleDetalhesAlvo(idEl) {
        const el = document.getElementById(idEl);
        if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }

    function renderizarAlvosNosferatu() {
        const lista = document.getElementById('nosf-lista-alvos');
        if (!lista) return;
        if (!alvosNosferatuCache || alvosNosferatuCache.length === 0) {
            lista.innerHTML = '<p style="color:#555; font-style:italic; text-align:center; padding:15px;">Nenhum alvo rasgado do Véu ainda...</p>';
            return;
        }

        lista.innerHTML = alvosNosferatuCache.map((a, i) => {
            const esfera = esferaAtivaAlvo[a.alvoId] || 'carinhosa';
            const idPainel = 'nosf-detalhe-' + i;
            const idHist = 'nosf-hist-' + i;
            const idDossie = 'nosf-dossie-box-' + i;

            return \`
                <div style="background:#090014; border:1px solid rgba(147,51,234,0.3); border-radius:6px; padding:12px; margin-bottom:14px; box-shadow:0 0 15px rgba(0,0,0,0.6);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                        <div>
                            <span style="font-size:1.1em; font-weight:bold; color:#fff; font-family:'Cinzel',serif;">\${a.nomeAstral}</span>
                            <span style="font-size:0.8em; color:#d080ff; font-style:italic; margin-left:6px;">• \${a.arquetipoAbissal || 'O Viajante'}</span>
                            <div style="font-size:0.75em; color:#888; margin-top:2px;">
                                Elemento: \${obterIconeElemento(a.ressonanciaElemental)} | Afinidade: \${a.afinidadeOculta || 'Magnetismo'} | Peso: \${a.pesoKarmico} | Corrupção: \${a.taxaCorrupcao}%
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                            \${obterBadgeEstadoAstral(a.estadoAstral)}
                            <button class="nosf-action-btn" onclick="toggleDetalhesAlvo('\${idPainel}')" style="padding:4px 8px;" title="Ver/Ocultar Métricas e Ações">⚡ Ações</button>
                            <button class="nosf-action-btn" onclick="toggleDetalhesAlvo('\${idDossie}')" style="padding:4px 8px;" title="Ver Dossiê">📖 Dossiê</button>
                            <button class="nosf-action-btn" onclick="toggleDetalhesAlvo('\${idHist}')" style="padding:4px 8px;" title="Histórico de Ritos">📜 Histórico</button>
                        </div>
                    </div>

                    <!-- PAINEL EXPANSÍVEL DE AÇÕES & MÉTRICAS -->
                    <div id="\${idPainel}" style="display:block; margin-top:12px; border-top:1px solid #200035; padding-top:10px;">
                        <div class="nosf-grid-metricas">
                            <div class="nosf-metric-card">
                                <div class="nosf-metric-title">👑 Vaso Influência</div>
                                <div class="nosf-metric-val">\${a.vasoInfluencia || 50}%</div>
                            </div>
                            <div class="nosf-metric-card">
                                <div class="nosf-metric-title">🛡️ Resist. Psíquica</div>
                                <div class="nosf-metric-val">\${a.resistenciaPsiquica || 50}%</div>
                            </div>
                            <div class="nosf-metric-card">
                                <div class="nosf-metric-title">👁️ Vulnerabilidade</div>
                                <div class="nosf-metric-val">\${a.vulnerabilidadeEspiritual || 50}%</div>
                            </div>
                            <div class="nosf-metric-card">
                                <div class="nosf-metric-title">🎵 Frequência</div>
                                <div class="nosf-metric-val">\${a.frequenciaVibracionalHz || 528} Hz</div>
                            </div>
                        </div>

                        <!-- ABAS DAS 4 ESFERAS -->
                        <div class="nosf-esfera-tabs">
                            <button class="nosf-tab-btn \${esfera === 'carinhosa' ? 'active' : ''}" onclick="trocarEsferaAcao('\${a.alvoId}', 'carinhosa')">💖 Bênçãos</button>
                            <button class="nosf-tab-btn \${esfera === 'influencia' ? 'active' : ''}" onclick="trocarEsferaAcao('\${a.alvoId}', 'influencia')">⚡ Influências</button>
                            <button class="nosf-tab-btn \${esfera === 'malefica' ? 'active' : ''}" onclick="trocarEsferaAcao('\${a.alvoId}', 'malefica')">🩸 Maléficas</button>
                            <button class="nosf-tab-btn \${esfera === 'limbo' ? 'active' : ''}" onclick="trocarEsferaAcao('\${a.alvoId}', 'limbo')">🕳️ Limbo</button>
                        </div>

                        <!-- CAMPO DE INTENÇÃO PERSONALIZADA -->
                        <div style="margin-bottom:8px;">
                            <input type="text" id="nosf-intencao-\${a.alvoId}" placeholder="Intenção oculta personalizada para este rito (opcional)..." style="width:100%; background:#06000d; border:1px solid #331045; color:#d080ff; padding:7px 10px; font-size:0.8em; border-radius:3px;">
                        </div>

                        <!-- BOTÕES DA ESFERA SELECIONADA -->
                        <div class="nosf-acoes-grid">
                            \${esfera === 'carinhosa' ? \`
                                <button class="btn-acao-karmica btn-acao-carinhosa" onclick="executarAcaoKarmica('\${a.alvoId}', 'toque_seda')">
                                    <span>🌸 Toque de Seda Astral <small style="display:block; font-size:0.75em; opacity:0.8;">Acalma a mente, restaura serenidade e sono reparador (+15% Resistência)</small></span>
                                    <span style="font-weight:bold; color:#ff99cc;">300 Gts</span>
                                </button>
                                <button class="btn-acao-karmica btn-acao-carinhosa" onclick="executarAcaoKarmica('\${a.alvoId}', 'bencao_lilith')">
                                    <span>🛡️ Manto Protetor de Lilith <small style="display:block; font-size:0.75em; opacity:0.8;">Escudo áurico contra inveja e ataques astrais externos (Abençoado)</small></span>
                                    <span style="font-weight:bold; color:#ff99cc;">600 Gts</span>
                                </button>
                                <button class="btn-acao-karmica btn-acao-carinhosa" onclick="executarAcaoKarmica('\${a.alvoId}', 'flor_sangue')">
                                    <span>🌹 Flor de Sangue (Magnetismo Afetivo) <small style="display:block; font-size:0.75em; opacity:0.8;">Desperta súbita onda de calor, ternura e empatia pelo Mestre</small></span>
                                    <span style="font-weight:bold; color:#ff99cc;">500 Gts</span>
                                </button>
                                <button class="btn-acao-karmica btn-acao-carinhosa" onclick="executarAcaoKarmica('\${a.alvoId}', 'musa_noturna')">
                                    <span>✨ Musa das Trevas (Iluminação Criativa) <small style="display:block; font-size:0.75em; opacity:0.8;">Inspiração artística visceral, lampejos intuitivos e 741Hz</small></span>
                                    <span style="font-weight:bold; color:#ff99cc;">400 Gts</span>
                                </button>
                            \` : ''}

                            \${esfera === 'influencia' ? \`
                                <button class="btn-acao-karmica btn-acao-influencia" onclick="executarAcaoKarmica('\${a.alvoId}', 'sugestao_onirica')">
                                    <span>💤 Sugestão Onírica Direcionada <small style="display:block; font-size:0.75em; opacity:0.8;">Injeta ideia durante o sono; o mortal crê que partiu dele</small></span>
                                    <span style="font-weight:bold; color:#80dfff;">700 Gts</span>
                                </button>
                                <button class="btn-acao-karmica btn-acao-influencia" onclick="executarAcaoKarmica('\${a.alvoId}', 'eco_egregora')">
                                    <span>🔔 Eco da Egrégora (Sincronicidades) <small style="display:block; font-size:0.75em; opacity:0.8;">Números repetidos (333, 666), déjà vu e chamado invisível</small></span>
                                    <span style="font-weight:bold; color:#80dfff;">500 Gts</span>
                                </button>
                                <button class="btn-acao-karmica btn-acao-influencia" onclick="executarAcaoKarmica('\${a.alvoId}', 'espelho_ilusorio')">
                                    <span>🪞 Espelho Ilusório (Distorção) <small style="display:block; font-size:0.75em; opacity:0.8;">Faz o mortal duvidar de certezas mundanas e desconfiar da realidade</small></span>
                                    <span style="font-weight:bold; color:#80dfff;">650 Gts</span>
                                </button>
                                <button class="btn-acao-karmica btn-acao-influencia" onclick="executarAcaoKarmica('\${a.alvoId}', 'laco_obsessao')">
                                    <span>🔗 Laço de Obsessão Astral <small style="display:block; font-size:0.75em; opacity:0.8;">Fio de prata kármico: pensamentos do alvo fixam-se no Mestre</small></span>
                                    <span style="font-weight:bold; color:#80dfff;">900 Gts</span>
                                </button>
                            \` : ''}

                            \${esfera === 'malefica' ? \`
                                <button class="btn-acao-karmica btn-acao-malefica" onclick="executarAcaoKarmica('\${a.alvoId}', 'pesadelo_abissal')">
                                    <span>👁️ Invasão de Pesadelos (Paralisia) <small style="display:block; font-size:0.75em; opacity:0.8;">Paralisia noturna, sombras nos cantos e pavor gelado</small></span>
                                    <span style="font-weight:bold; color:#ff7777;">800 Gts</span>
                                </button>
                                <button class="btn-acao-karmica btn-acao-malefica" onclick="executarAcaoKarmica('\${a.alvoId}', 'drenagem_voraz')">
                                    <span>🩸 Drenagem Voraz de Alma <small style="display:block; font-size:0.75em; opacity:0.8;">Suga a vitalidade do alvo e CONVERTE em +1000 Gts de Sangue para o Mestre!</small></span>
                                    <span style="font-weight:bold; color:#00ff88;">+1000 Gts</span>
                                </button>
                                <button class="btn-acao-karmica btn-acao-malefica" onclick="executarAcaoKarmica('\${a.alvoId}', 'olho_seth')">
                                    <span>⚡ Olho de Seth (Desfortuna & Ruína) <small style="display:block; font-size:0.75em; opacity:0.8;">Semeia entropia negativa: quebra de aparelhos, atrasos e discórdia</small></span>
                                    <span style="font-weight:bold; color:#ff7777;">1000 Gts</span>
                                </button>
                                <button class="btn-acao-karmica btn-acao-malefica" onclick="executarAcaoKarmica('\${a.alvoId}', 'acoite_sombra')">
                                    <span>🗡️ Açoite de Sangue Negro <small style="display:block; font-size:0.75em; opacity:0.8;">Ruptura da blindagem áurica, fadiga instantânea e dor fantasma</small></span>
                                    <span style="font-weight:bold; color:#ff7777;">1200 Gts</span>
                                </button>
                            \` : ''}

                            \${esfera === 'limbo' ? \`
                                <button class="btn-acao-karmica btn-acao-limbo" onclick="executarAcaoKarmica('\${a.alvoId}', 'banir_ao_limbo')">
                                    <span>🕳️ Banimento ao Limbo Astral <small style="display:block; font-size:0.75em; opacity:0.8;">Arrasta o duplo para o Vazio Cinzento; congela sua aura e anula resistências</small></span>
                                    <span style="font-weight:bold; color:#c084fc;">2000 Gts</span>
                                </button>
                                <button class="btn-acao-karmica btn-acao-limbo" onclick="executarAcaoKarmica('\${a.alvoId}', 'condenar_ao_tartaro')">
                                    <span>🔥 Condenação ao Tártaro Cósmico <small style="display:block; font-size:0.75em; opacity:0.8;">A pena capital: acorrenta a alma no poço ardente de Tiamat</small></span>
                                    <span style="font-weight:bold; color:#ef4444;">3000 Gts</span>
                                </button>
                                <button class="btn-acao-karmica btn-acao-limbo" onclick="executarAcaoKarmica('\${a.alvoId}', 'resgatar_do_limbo')">
                                    <span>🕊️ Resgate & Absolvição Soberana <small style="display:block; font-size:0.75em; opacity:0.8;">Misericórdia do Mestre: resgata a alma de volta à Vigília e purifica o carma</small></span>
                                    <span style="font-weight:bold; color:#00ff88;">500 Gts</span>
                                </button>
                            \` : ''}
                        </div>
                    </div>

                    <!-- DOSSIÊ DA MENTE ABISSAL -->
                    <div id="\${idDossie}" style="display:none; margin-top:10px; border-top:1px dashed #300045; padding-top:8px; font-size:0.85em; color:#bbb; line-height:1.5; max-height:220px; overflow-y:auto; white-space:pre-wrap;">
                        \${a.analiseIA || 'Nenhuma análise detalhada armazenada.'}
                    </div>

                    <!-- HISTÓRICO DE AÇÕES DESTE ALVO -->
                    <div id="\${idHist}" style="display:none; margin-top:10px; border-top:1px dashed #300045; padding-top:8px; font-size:0.8em;">
                        <strong style="color:var(--magia); font-family:'Cinzel',serif;">📜 Histórico de Emanações Astrais:</strong>
                        <div style="max-height:160px; overflow-y:auto; margin-top:6px;">
                            \${(!a.historicoAcoes || a.historicoAcoes.length === 0) 
                                ? '<div style="color:#666; font-style:italic;">Nenhum rito emitido ainda.</div>'
                                : a.historicoAcoes.map(h => \`
                                    <div style="padding:4px 0; border-bottom:1px solid #1a0025;">
                                        <span style="color:#888;">[\${new Date(h.data).toLocaleTimeString()}]</span>
                                        <strong style="color:#d080ff;">\${h.nome || h.acao}</strong>
                                        <div style="color:#bbb; font-size:0.9em;">\${h.relato}</div>
                                    </div>
                                \`).join('')}
                        </div>
                    </div>
                </div>
            \`;
        }).join('');
    }

    async function executarAcaoKarmica(alvoId, acao) {
        if (!meuVampiro) return;
        
        const inputIntencao = document.getElementById('nosf-intencao-' + alvoId);
        const intencaoPersonalizada = inputIntencao ? inputIntencao.value.trim() : '';

        playSfx('magia');
        try {
            const res = await fetch('/api/nosferatu/acao_karmica', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: meuVampiro.id, alvoId, acao, intencaoPersonalizada })
            });
            const dados = await res.json();
            if (dados.erro) return ocultoAlert(dados.erro);

            if (inputIntencao) inputIntencao.value = '';

            // Atualiza alvo no cache
            if (dados.alvo) {
                const idx = alvosNosferatuCache.findIndex(x => x.alvoId === dados.alvo.alvoId || x.nomeAstral.toLowerCase() === dados.alvo.nomeAstral.toLowerCase());
                if (idx >= 0) alvosNosferatuCache[idx] = dados.alvo;
                renderizarAlvosNosferatu();
            }

            abismoVoid();
            showJuiceNotif("EMANATION RITUAL", dados.relato || "A ação kármica ressoou nas dimensões.");
            sussurroDemonioBrasil(dados.relato || "O karma foi invocado.");
            ocultoAlert(dados.relato);
            syncStatus();
        } catch(e) {
            ocultoAlert("O Véu rejeitou a ação kármica.");
        }
    }`;

    const before = normHtml.substring(0, lineStart + 1);
    const after = normHtml.substring(endPos);
    fs.writeFileSync('index.html', before + newJs + after, 'utf8');
    console.log('SUCCESS: index.html JS replaced!');
} else {
    console.error('FAILED to find markers.');
}
