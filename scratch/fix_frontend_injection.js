const fs = require('fs');

const path = 'c:/ordemvampirica/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Injetar arena-acoes-viscerais antes de <div class="arena-botoes">
const arenaBotoesTag = '<div class="arena-botoes">';
if (!content.includes('id="arena-acoes-viscerais"')) {
    const arenaAcoesHtml = `
            <div id="arena-acoes-viscerais" style="display: flex; gap: 6px; justify-content: center; margin-bottom: 8px; flex-wrap: wrap;">
                <button class="btn" style="padding: 6px 12px; font-size: 0.8rem; background: #2c1216; border: 1px solid var(--sangue);" onclick="executarAcaoCombateAvancada('golpe_pesado')">💥 Golpe Pesado (-Postura)</button>
                <button class="btn" style="padding: 6px 12px; font-size: 0.8rem; background: #1a1a2e; border: 1px solid #5985c5;" onclick="executarAcaoCombateAvancada('parry_perfeito')">🛡️ Parada & Contra-Golpe</button>
                <button id="btn-arena-visceral" class="btn oculto" style="padding: 6px 14px; font-size: 0.85rem;" onclick="executarAcaoCombateAvancada('golpe_visceral')">🩸 GOLPE VISCERAL FATAL (3.5x)</button>
                <button class="btn" style="padding: 6px 12px; font-size: 0.8rem; background: #0b1a1a; border: 1px solid #00e1d9;" onclick="executarMagiaCodigoNoCombate()">⚡ Magia em Código</button>
            </div>
            `;
    content = content.replace(arenaBotoesTag, arenaAcoesHtml + '\n            ' + arenaBotoesTag);
}

// 2. Injetar o JavaScript do cliente antes do último </script>
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
    
    // Simula pulso de ritmo
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

const lastScriptIndex = content.lastIndexOf('</script>');
content = content.substring(0, lastScriptIndex) + jsCliente + '\n' + content.substring(lastScriptIndex);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed and fully injected client JS into index.html');
