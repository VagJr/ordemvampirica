// SocialCore.js — Camada Social, Multiplayer Co-op e Economia P2P
// SANGUINIS: Ordem Vampírica

class SocialCore {
    constructor(shadowCore) {
        this.core = shadowCore;
        this.comitivas = {}; // id -> { id, liderId, liderNome, nome, membros: [ids], criadoEm }
        this.convitesComitiva = {}; // convidadoId -> [ { comitivaId, liderNome, comitivaNome, data } ]
        this.sessoesTroca = {}; // id -> { id, j1, j2, atualizadoEm }
        this.contratosMercenarios = []; // [ { id, criadorId, criadorNome, tipo, titulo, descricao, recompensaGts, requisito, status, aceitoPor, criadoEm } ]
        this.contratoIdCounter = 1;
        this.caldeirao = {
            acumulado: 0,
            meta: 5000,
            eclipseAtivoAte: 0,
            doadores: {}
        };
        this.mensagensProximidade2D = []; // [ { jogadorId, nome, texto, x, y, tempo } ]
    }

    carregarEstado(dados) {
        if (!dados) return;
        if (dados.contratosMercenarios) this.contratosMercenarios = dados.contratosMercenarios;
        if (dados.contratoIdCounter) this.contratoIdCounter = dados.contratoIdCounter;
        if (dados.caldeirao) this.caldeirao = dados.caldeirao;
    }

    salvarEstado() {
        return {
            contratosMercenarios: this.contratosMercenarios,
            contratoIdCounter: this.contratoIdCounter,
            caldeirao: this.caldeirao
        };
    }

    // =========================================================================
    // 🐺 1. COMITIVAS DA NOITE (HUNTING PARTY / SQUAD CO-OP)
    // =========================================================================

    obterComitivaDoJogador(vampiroId) {
        for (const cid in this.comitivas) {
            const c = this.comitivas[cid];
            if (c.membros.includes(vampiroId)) return c;
        }
        return null;
    }

    criarComitiva(liderId, nomePersonalizado = null) {
        const lider = this.core.vampiros[liderId];
        if (!lider) return { erro: "Iniciado não encontrado." };

        const existente = this.obterComitivaDoJogador(liderId);
        if (existente) return { erro: "Já lideras ou pertences a uma Comitiva." };

        const cid = 'comitiva_' + Math.random().toString(36).substring(2, 9);
        const nome = (nomePersonalizado && nomePersonalizado.trim()) ? nomePersonalizado.trim() : `Matilha de ${lider.nome}`;

        const novaComitiva = {
            id: cid,
            liderId: lider.id,
            liderNome: lider.nome,
            nome,
            membros: [lider.id],
            criadoEm: new Date().toISOString(),
            danoBonus: 0.15, // +15% de dano coletivo
            drenoCompartilhado: 0.25 // 25% do sangue drenado vai para aliados feridos
        };

        this.comitivas[cid] = novaComitiva;
        return { sucesso: true, relato: `Comitiva [${nome}] fundada sob a tua liderança!`, comitiva: this.formatarComitiva(novaComitiva) };
    }

    convidarParaComitiva(liderId, convidadoId) {
        const lider = this.core.vampiros[liderId];
        const convidado = this.core.vampiros[convidadoId];
        if (!lider || !convidado) return { erro: "Vampiro alvo inexistente." };

        const comitiva = this.obterComitivaDoJogador(liderId);
        if (!comitiva) return { erro: "Precisas fundar uma Comitiva antes de convidar aliados." };
        if (comitiva.liderId !== liderId) return { erro: "Apenas o Alfa da Comitiva pode recrutar novos membros." };
        if (comitiva.membros.length >= 4) return { erro: "A Comitiva já atingiu a capacidade máxima de 4 caçadores." };
        if (comitiva.membros.includes(convidadoId)) return { erro: "O vampiro já faz parte da tua Comitiva." };

        const comitivaConvidado = this.obterComitivaDoJogador(convidadoId);
        if (comitivaConvidado) return { erro: "O alvo já faz parte de outra Comitiva." };

        if (!this.convitesComitiva[convidadoId]) this.convitesComitiva[convidadoId] = [];
        this.convitesComitiva[convidadoId] = this.convitesComitiva[convidadoId].filter(c => c.comitivaId !== comitiva.id);
        this.convitesComitiva[convidadoId].push({
            comitivaId: comitiva.id,
            liderNome: lider.nome,
            comitivaNome: comitiva.nome,
            data: Date.now()
        });

        return { sucesso: true, relato: `Convocaste [${convidado.nome}] para unir-se à [${comitiva.nome}]!` };
    }

    aceitarConviteComitiva(convidadoId, comitivaId) {
        const convidado = this.core.vampiros[convidadoId];
        if (!convidado) return { erro: "Iniciado inexistente." };

        const comitiva = this.comitivas[comitivaId];
        if (!comitiva) return { erro: "Esta Comitiva já foi dispersada pelas cinzas." };
        if (comitiva.membros.length >= 4) return { erro: "A Comitiva já está repleta (máx 4)." };

        const atual = this.obterComitivaDoJogador(convidadoId);
        if (atual) return { erro: "Deves deixar a tua comitiva atual primeiro." };

        comitiva.membros.push(convidadoId);
        if (this.convitesComitiva[convidadoId]) {
            this.convitesComitiva[convidadoId] = this.convitesComitiva[convidadoId].filter(c => c.comitivaId !== comitivaId);
        }

        return { sucesso: true, relato: `Agora marchas sob o estandarte da [${comitiva.nome}]!`, comitiva: this.formatarComitiva(comitiva) };
    }

    sairDaComitiva(vampiroId) {
        const comitiva = this.obterComitivaDoJogador(vampiroId);
        if (!comitiva) return { erro: "Não pertences a nenhuma Comitiva." };

        comitiva.membros = comitiva.membros.filter(id => id !== vampiroId);

        if (comitiva.membros.length === 0) {
            delete this.comitivas[comitiva.id];
            return { sucesso: true, relato: "Comitiva dispersada." };
        } else if (comitiva.liderId === vampiroId) {
            comitiva.liderId = comitiva.membros[0];
            const novoLider = this.core.vampiros[comitiva.liderId];
            if (novoLider) comitiva.liderNome = novoLider.nome;
            return { sucesso: true, relato: `Deixaste a comitiva. A liderança foi transferida para [${comitiva.liderNome}].` };
        }

        return { sucesso: true, relato: `Deixaste a Comitiva [${comitiva.nome}].` };
    }

    formatarComitiva(c) {
        if (!c) return null;
        const membrosFormatados = c.membros.map(mid => {
            const mem = this.core.vampiros[mid];
            if (!mem) return null;
            return {
                id: mem.id,
                nome: mem.nome,
                raca: mem.raca,
                nivel: mem.nivel,
                hpAtual: mem.hpAtual,
                hpMax: mem.hpMax,
                sangue: mem.sangue,
                furia: mem.pontosAcao,
                furiaMax: mem.maxAcao,
                isLider: mem.id === c.liderId,
                pos2D: this.core.mundo2D ? this.core.mundo2D.jogadores[mid] : null
            };
        }).filter(Boolean);

        return {
            id: c.id,
            nome: c.nome,
            liderId: c.liderId,
            liderNome: c.liderNome,
            membros: membrosFormatados,
            totalMembros: membrosFormatados.length,
            danoBonus: c.danoBonus,
            buffAtivo: "Aura de Matilha (+15% Dano, Dreno Partilhado)"
        };
    }

    distribuirDrenoCoop(drenadorId, totalGts) {
        const comitiva = this.obterComitivaDoJogador(drenadorId);
        if (!comitiva || comitiva.membros.length <= 1) return 0;

        const parcelaPartilhada = Math.floor(totalGts * comitiva.drenoCompartilhado);
        const aliados = comitiva.membros.filter(id => id !== drenadorId && this.core.vampiros[id]);
        if (aliados.length === 0) return 0;

        const gtsPorAliado = Math.floor(parcelaPartilhada / aliados.length);
        if (gtsPorAliado <= 0) return 0;

        aliados.forEach(aid => {
            const aliado = this.core.vampiros[aid];
            aliado.sangue = (aliado.sangue || 0) + gtsPorAliado;
            const cura = Math.min(aliado.hpMax - aliado.hpAtual, Math.floor(gtsPorAliado * 0.4));
            if (cura > 0) aliado.hpAtual += cura;
        });

        return parcelaPartilhada;
    }

    // =========================================================================
    // 🩸 2. VÍNCULOS DE SANGUE (BLOOD BONDS ENTRE JOGADORES)
    // =========================================================================

    forjarVinculoSangue(origemId, parceiroId) {
        const o = this.core.vampiros[origemId];
        const p = this.core.vampiros[parceiroId];
        if (!o || !p) return { erro: "Vampiros inválidos." };
        if (origemId === parceiroId) return { erro: "Não podes vincular-te a ti mesmo." };

        if (!o.vinculosSangue) o.vinculosSangue = [];
        if (!p.vinculosSangue) p.vinculosSangue = [];

        if (o.vinculosSangue.some(v => v.parceiroId === parceiroId)) {
            return { erro: `Já possuis um Vínculo de Sangue com [${p.nome}].` };
        }

        const novoElo = {
            parceiroId: p.id,
            parceiroNome: p.nome,
            data: new Date().toISOString(),
            gtsTrocados: 0,
            nivelElo: 1
        };

        const novoEloInverso = {
            parceiroId: o.id,
            parceiroNome: o.nome,
            data: new Date().toISOString(),
            gtsTrocados: 0,
            nivelElo: 1
        };

        o.vinculosSangue.push(novoElo);
        p.vinculosSangue.push(novoEloInverso);
        this.core._salvarBancoDeDados();

        this.core._registrarEventoEspecial('global', 'VÍNCULO DE SANGUE', `[${o.nome}] e [${p.nome}] selaram suas veias num Vínculo Eterno!`, true);
        return { sucesso: true, relato: `As tuas veias agora ressoam com as de [${p.nome}]! Desbloqueaste Transfusão Vital e Ressonância de Fúria.` };
    }

    transfusaoEmergencial(doadorId, parceiroId, quantiaGts) {
        const doador = this.core.vampiros[doadorId];
        const receptor = this.core.vampiros[parceiroId];
        if (!doador || !receptor) return { erro: "Participantes inválidos." };

        const qtd = Math.floor(Number(quantiaGts));
        if (isNaN(qtd) || qtd <= 0) return { erro: "Volume de sangue inválido." };
        if ((doador.sangue || 0) < qtd + 100) return { erro: "Precisas manter uma reserva vital mínima de 100 Gts." };

        const temVinculo = (doador.vinculosSangue || []).some(v => v.parceiroId === parceiroId);
        if (!temVinculo) return { erro: "Transfusões a distância exigem um Vínculo de Sangue selado." };

        doador.sangue -= qtd;
        receptor.sangue = (receptor.sangue || 0) + qtd;

        const curaPossivel = receptor.hpMax - receptor.hpAtual;
        const curaEfetiva = Math.min(curaPossivel, Math.floor(qtd * 0.75));
        if (curaEfetiva > 0) receptor.hpAtual += curaEfetiva;

        const elo = doador.vinculosSangue.find(v => v.parceiroId === parceiroId);
        if (elo) elo.gtsTrocados = (elo.gtsTrocados || 0) + qtd;

        this.core._salvarBancoDeDados();
        return {
            sucesso: true,
            relato: `Transfundiste ${qtd} Gts de Vitae para [${receptor.nome}] (Restaurou ${curaEfetiva} HP)!`,
            sangueRestante: doador.sangue
        };
    }

    // =========================================================================
    // 📜 3. MURAL DE CONTRATOS & MERCENÁRIOS P2P (BOUNTY BOARD)
    // =========================================================================

    listarContratos() {
        return this.contratosMercenarios.filter(c => c.status === 'aberto' || c.status === 'aceito');
    }

    publicarContrato(criadorId, tipo, titulo, descricao, recompensaGts, requisito) {
        const criador = this.core.vampiros[criadorId];
        if (!criador) return { erro: "Criador inválido." };

        const recompensa = Math.floor(Number(recompensaGts));
        if (isNaN(recompensa) || recompensa < 200) return { erro: "A recompensa mínima de um contrato é 200 Gts." };
        if ((criador.sangue || 0) < recompensa) return { erro: "Sangue insuficiente para caução do contrato." };

        criador.sangue -= recompensa;

        const cid = 'cnt_' + (this.contratoIdCounter++);
        const contrato = {
            id: cid,
            criadorId: criador.id,
            criadorNome: criador.nome,
            tipo: tipo || 'coleta',
            titulo: (titulo || 'Ordem da Noite').trim(),
            descricao: (descricao || 'Cumpra a tarefa para receber o sangue em custódia.').trim(),
            recompensaGts: recompensa,
            requisito: requisito || { item: 'ferroNegro', qtd: 20 },
            status: 'aberto',
            aceitoPor: null,
            aceitoPorNome: null,
            criadoEm: new Date().toISOString()
        };

        this.contratosMercenarios.unshift(contrato);
        this.core._salvarBancoDeDados();

        this.core._registrarEventoEspecial('global', 'CONTRATO DA CORTE', `[${criador.nome}] afixou o contrato [${contrato.titulo}] valendo ${recompensa} Gts!`);
        return { sucesso: true, relato: `Contrato [${contrato.titulo}] afixado no Mural Mercenário com ${recompensa} Gts em custódia.`, contrato };
    }

    aceitarContrato(mercenarioId, contratoId) {
        const m = this.core.vampiros[mercenarioId];
        if (!m) return { erro: "Mercenário inválido." };

        const c = this.contratosMercenarios.find(x => x.id === contratoId && x.status === 'aberto');
        if (!c) return { erro: "Contrato indisponível ou já reclamado." };
        if (c.criadorId === mercenarioId) return { erro: "Não podes aceitar o teu próprio contrato." };

        c.status = 'aceito';
        c.aceitoPor = m.id;
        c.aceitoPorNome = m.nome;
        this.core._salvarBancoDeDados();

        return { sucesso: true, relato: `Assumiste a missão [${c.titulo}]. Entrega o encargo para reclamar ${c.recompensaGts} Gts!`, contrato: c };
    }

    cumprirContrato(mercenarioId, contratoId) {
        const m = this.core.vampiros[mercenarioId];
        if (!m) return { erro: "Mercenário não reconhecido." };

        const c = this.contratosMercenarios.find(x => x.id === contratoId);
        if (!c || c.status !== 'aceito' || c.aceitoPor !== mercenarioId) {
            return { erro: "Contrato não encontrado ou não atribuído a ti." };
        }

        const criador = this.core.vampiros[c.criadorId];

        if (c.tipo === 'coleta' && c.requisito) {
            const { item, qtd } = c.requisito;
            const estoqueInv = (m.inventario && m.inventario[item]) || 0;
            const estoqueMat = (m.materiais && m.materiais[item]) || 0;
            const estoqueTotal = estoqueInv + estoqueMat;
            if (estoqueTotal < qtd) {
                return { erro: `Recursos insuficientes. Precisas de ${qtd}x [${item}], mas possuis apenas ${estoqueTotal}.` };
            }
            if (estoqueInv >= qtd) {
                m.inventario[item] -= qtd;
            } else {
                const resto = qtd - estoqueInv;
                if (m.inventario) m.inventario[item] = 0;
                if (m.materiais) m.materiais[item] = (m.materiais[item] || 0) - resto;
            }
            if (criador) {
                if (!criador.materiais) criador.materiais = {};
                criador.materiais[item] = (criador.materiais[item] || 0) + qtd;
            }
        }

        m.sangue = (m.sangue || 0) + c.recompensaGts;
        this.core.ganharXP(m.id, Math.floor(c.recompensaGts * 0.5));
        c.status = 'cumprido';
        c.concluidoEm = new Date().toISOString();

        this.core._salvarBancoDeDados();
        this.core._registrarEventoEspecial('global', 'CONTRATO HONRADO', `[${m.nome}] cumpriu o contrato [${c.titulo}] de [${c.criadorNome}] e recebeu ${c.recompensaGts} Gts!`);

        return {
            sucesso: true,
            relato: `Missão cumprida! Recebeste ${c.recompensaGts} Gts e honraste a tua palavra perante a Corte.`,
            sangueAtual: m.sangue
        };
    }

    // =========================================================================
    // 🤝 4. TROCA DIRETA SEGURA ENTRE JOGADORES (P2P TRADE WINDOW)
    // =========================================================================

    iniciarTroca(jogador1Id, jogador2Id) {
        const j1 = this.core.vampiros[jogador1Id];
        const j2 = this.core.vampiros[jogador2Id];
        if (!j1 || !j2) return { erro: "Participantes inválidos." };
        if (jogador1Id === jogador2Id) return { erro: "Não podes negociar contigo mesmo." };

        const tid = 'trade_' + Math.random().toString(36).substring(2, 9);
        this.sessoesTroca[tid] = {
            id: tid,
            j1: { id: j1.id, nome: j1.nome, itens: [], gts: 0, travado: false, confirmado: false },
            j2: { id: j2.id, nome: j2.nome, itens: [], gts: 0, travado: false, confirmado: false },
            criadoEm: Date.now()
        };

        return { sucesso: true, sessao: this.sessoesTroca[tid] };
    }

    atualizarOfertaTroca(sessaoId, jogadorId, itemIds = [], gts = 0) {
        const s = this.sessoesTroca[sessaoId];
        if (!s) return { erro: "Sessão de troca expirada." };

        const participante = (s.j1.id === jogadorId) ? s.j1 : (s.j2.id === jogadorId ? s.j2 : null);
        if (!participante) return { erro: "Não pertences a esta troca." };

        const vamp = this.core.vampiros[jogadorId];
        const gtsVal = Math.max(0, Math.min(Math.floor(Number(gts) || 0), vamp.sangue || 0));
        const itensReais = (vamp.bolsa || []).filter(item => itemIds.includes(item.id));

        participante.itens = itensReais;
        participante.gts = gtsVal;
        s.j1.travado = false; s.j1.confirmado = false;
        s.j2.travado = false; s.j2.confirmado = false;

        return { sucesso: true, sessao: s };
    }

    travarOfertaTroca(sessaoId, jogadorId) {
        const s = this.sessoesTroca[sessaoId];
        if (!s) return { erro: "Sessão de troca inválida." };

        if (s.j1.id === jogadorId) s.j1.travado = true;
        else if (s.j2.id === jogadorId) s.j2.travado = true;
        else return { erro: "Iniciado não participante." };

        return { sucesso: true, sessao: s };
    }

    confirmarTroca(sessaoId, jogadorId) {
        const s = this.sessoesTroca[sessaoId];
        if (!s) return { erro: "Sessão encerrada." };
        if (!s.j1.travado || !s.j2.travado) return { erro: "Ambos os vampiros devem travar as ofertas antes de confirmar." };

        if (s.j1.id === jogadorId) s.j1.confirmado = true;
        else if (s.j2.id === jogadorId) s.j2.confirmado = true;

        if (s.j1.confirmado && s.j2.confirmado) {
            const v1 = this.core.vampiros[s.j1.id];
            const v2 = this.core.vampiros[s.j2.id];

            v1.sangue = (v1.sangue || 0) - s.j1.gts + s.j2.gts;
            v2.sangue = (v2.sangue || 0) - s.j2.gts + s.j1.gts;

            s.j1.itens.forEach(item => {
                const idx = v1.bolsa.findIndex(b => b.id === item.id);
                if (idx >= 0) {
                    const obj = v1.bolsa.splice(idx, 1)[0];
                    v2.bolsa.push(obj);
                }
            });

            s.j2.itens.forEach(item => {
                const idx = v2.bolsa.findIndex(b => b.id === item.id);
                if (idx >= 0) {
                    const obj = v2.bolsa.splice(idx, 1)[0];
                    v1.bolsa.push(obj);
                }
            });

            delete this.sessoesTroca[sessaoId];
            this.core._salvarBancoDeDados();
            this.core._registrarEventoEspecial('global', 'PACTO MERCANTIL P2P', `[${v1.nome}] e [${v2.nome}] selaram uma troca direta de artefatos com sucesso.`);

            return { sucesso: true, concluida: true, relato: "Troca mercantil selada e artefatos transferidos!" };
        }

        return { sucesso: true, concluida: false, sessao: s };
    }

    // =========================================================================
    // 🩸 5. GRANDE CALDEIRÃO DA EGRÉGORA (ECLIPSE COLETIVO)
    // =========================================================================

    doarParaCaldeirao(vampiroId, quantiaGts) {
        const v = this.core.vampiros[vampiroId];
        if (!v) return { erro: "Fantasma." };

        const qtd = Math.floor(Number(quantiaGts));
        if (isNaN(qtd) || qtd <= 0) return { erro: "Volume de sangue inválido." };
        if ((v.sangue || 0) < qtd) return { erro: "Não possuis Vitae suficiente." };

        v.sangue -= qtd;
        this.caldeirao.acumulado += qtd;
        this.caldeirao.doadores[v.id] = (this.caldeirao.doadores[v.id] || 0) + qtd;
        this.core.ganharXP(v.id, Math.floor(qtd * 0.3));

        let eclipseAtivado = false;
        if (this.caldeirao.acumulado >= this.caldeirao.meta) {
            this.caldeirao.acumulado = 0;
            this.caldeirao.eclipseAtivoAte = Date.now() + (25 * 60 * 1000); // 25 minutos
            eclipseAtivado = true;
            this.core._registrarEventoEspecial('global', '🌑 O ECLIPSE DA NOITE ETERNA DESPERTOU', 
                `O Grande Caldeirão da Egrégora transbordou com o sangue dos iniciados! Todos os vampiros recebem o Manto do Eclipse (+30% XP, +100% Drops de Coleta, +25% Dano).`, true);
        }

        this.core._salvarBancoDeDados();
        return {
            sucesso: true,
            relato: eclipseAtivado 
                ? `🩸 A tua oferenda de ${qtd} Gts fez o Caldeirão transbordar! O ECLIPSE DA NOITE ETERNA FOI DESENCADEADO!`
                : `Ofereceste ${qtd} Gts ao Caldeirão Cósmico (${this.caldeirao.acumulado}/${this.caldeirao.meta} Gts).`,
            caldeirao: this.caldeirao,
            eclipseAtivado
        };
    }

    obterStatusCaldeirao() {
        const ativo = this.caldeirao.eclipseAtivoAte > Date.now();
        const tempoRestanteSegundos = ativo ? Math.floor((this.caldeirao.eclipseAtivoAte - Date.now()) / 1000) : 0;
        return {
            acumulado: this.caldeirao.acumulado,
            meta: this.caldeirao.meta,
            eclipseAtivo: ativo,
            tempoRestanteSegundos,
            progressoPercentual: Math.min(100, Math.floor((this.caldeirao.acumulado / this.caldeirao.meta) * 100))
        };
    }

    // =========================================================================
    // 💬 6. BALÕES DE PROXIMIDADE 2D NO CANVAS
    // =========================================================================

    adicionarFalaProximidade(jogadorId, texto) {
        const v = this.core.vampiros[jogadorId];
        if (!v || !texto) return null;

        const pos = this.core.mundo2D?.jogadores[jogadorId] || { x: 40, y: 40 };
        const msg = {
            jogadorId: v.id,
            nome: v.nome,
            texto: texto.slice(0, 90),
            x: pos.x,
            y: pos.y,
            timestamp: Date.now()
        };

        this.mensagensProximidade2D.push(msg);
        if (this.mensagensProximidade2D.length > 30) this.mensagensProximidade2D.shift();
        return msg;
    }
}

module.exports = SocialCore;
