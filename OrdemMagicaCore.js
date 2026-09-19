// OrdemMagicaCore.js - Sistema Lapidado de Ordens Iniciáticas, Santuários, Provações,
// Matriz Mágica Exclusiva por Ordem (IA Guia) e Biblioteca Oculta
const crypto = require('crypto');

// ============================================================================
// 1. OS 10 GRAUS TRADICIONAIS DA HIERARQUIA HERMÉTICA / ASTRUM ARGENTUM
// ============================================================================
const GRAUS_INICIATICOS = [
    { grau: 0, titulo: "Neófito", sfera: "Malkuth", reqGnose: 0, reqXp: 0, descricao: "O aspirante que atravessa o limiar do Umbral, renunciando à ilusão profana.", provaDescricao: "Não há provação para o primeiro passo." },
    { grau: 1, titulo: "Zelator", sfera: "Yesod", reqGnose: 25, reqXp: 500, descricao: "O guardião dos alicerces terrestres e dos mistérios vitais do sangue.", provaDescricao: "Demonstrar conhecimento sobre os fundamentos lunares e as correntes vitais de Yesod." },
    { grau: 2, titulo: "Theoricus", sfera: "Hod", reqGnose: 60, reqXp: 1200, descricao: "O vidente das correntes astrais e da geometria das sombras.", provaDescricao: "Decifrar uma cifra hermética baseada nas 8 esferas de Hod e a lógica mercurial." },
    { grau: 3, titulo: "Practicus", sfera: "Netzach", reqGnose: 100, reqXp: 2500, descricao: "O alquimista das transmutações e dos elixires viscerais.", provaDescricao: "Resolver uma equação alquímica de transmutação envolvendo as 7 operações da Grande Obra." },
    { grau: 4, titulo: "Philosophus", sfera: "Tiphereth (Portal)", reqGnose: 150, reqXp: 4500, descricao: "O tecelão do fogo sagrado e das chaves salomônicas.", provaDescricao: "Atravessar o Portal de Paroketh respondendo sobre o equilíbrio das forças cósmicas." },
    { grau: 5, titulo: "Adeptus Minor", sfera: "Tiphereth", reqGnose: 220, reqXp: 7500, descricao: "O místico que alcançou o Conhecimento e Conversação com a Sombra Primordial.", provaDescricao: "Invocar o nome da Sombra Interior e demonstrar domínio sobre o K&C do Sagrado Anjo." },
    { grau: 6, titulo: "Adeptus Major", sfera: "Geburah", reqGnose: 300, reqXp: 12000, descricao: "O senhor da vontade marcial, executor da justiça mágica e do combate rítmico.", provaDescricao: "Responder sobre a natureza da Vontade Verdadeira e o uso da força de Geburah." },
    { grau: 7, titulo: "Adeptus Exemptus", sfera: "Chesed", reqGnose: 400, reqXp: 18000, descricao: "O legislador do silêncio que compreendeu a soberania sobre a carne e a matéria.", provaDescricao: "Dissertar sobre a Lei da Misericórdia, o paradoxo do poder e a natureza de Chesed." },
    { grau: 8, titulo: "Magister Templi", sfera: "Binah", reqGnose: 520, reqXp: 26000, descricao: "O mestre supremo do Templo, que verteu todo o seu sangue no Cálice de Babalon.", provaDescricao: "Verter toda a compreensão da Grande Mãe e do Cálice de Binah; a prova do Abismo." },
    { grau: 9, titulo: "Magus", sfera: "Chokmah", reqGnose: 680, reqXp: 36000, descricao: "A palavra viva da criação mágica; a sua fala transmuta a realidade do jogo.", provaDescricao: "Pronunciar a Palavra Mágica pessoal que resume toda a tua Vontade cósmica." },
    { grau: 10, titulo: "Ipsissimus", sfera: "Kether", reqGnose: 900, reqXp: 50000, descricao: "A consciência imutável unificada ao Vazio Primordial. O Soberano da Ordem.", provaDescricao: "A provação final: o silêncio absoluto perante o vazio de Kether. Não há respostas; apenas ser." }
];

// ============================================================================
// 2. TIERS DE SANTUÁRIO / TEMPLO DA ORDEM
// ============================================================================
const SANTUARIO_TIERS = [
    { tier: 1, nome: "Atrium das Sombras", custoVitae: 0, custoAnima: 0, custoCinzas: 0, bonus: { descricao: "Nenhum bônus adicional. O Templo básico.", gnoseEstudoBonus: 0, furiaRegenBonus: 0, defesaTerritorial: 0 } },
    { tier: 2, nome: "Câmara de Reflexão", custoVitae: 5000, custoAnima: 10, custoCinzas: 20, bonus: { descricao: "+10% Gnose em estudos da Biblioteca.", gnoseEstudoBonus: 0.10, furiaRegenBonus: 0, defesaTerritorial: 0 } },
    { tier: 3, nome: "Templo Interior dos Elementos", custoVitae: 15000, custoAnima: 30, custoCinzas: 50, bonus: { descricao: "+15% regen Fúria na Egrégora e +5% Gnose.", gnoseEstudoBonus: 0.05, furiaRegenBonus: 0.15, defesaTerritorial: 5 } },
    { tier: 4, nome: "Sanctum Sanctorum Salomônico", custoVitae: 40000, custoAnima: 80, custoCinzas: 120, bonus: { descricao: "Desbloqueia Ritos Maiores e Nós de Alta Magia na Matriz.", gnoseEstudoBonus: 0.10, furiaRegenBonus: 0.10, defesaTerritorial: 15, desbloqueiaAltaMagia: true } },
    { tier: 5, nome: "Templo Primordial de Kether", custoVitae: 100000, custoAnima: 200, custoCinzas: 300, bonus: { descricao: "Imunidade territorial a hereges. Canalização máxima. +20% tudo.", gnoseEstudoBonus: 0.20, furiaRegenBonus: 0.20, defesaTerritorial: 30, imunidadeTerritorial: true, canalizacaoMaxima: true } }
];

// ============================================================================
// 3. CARGOS DO CONSELHO INICIÁTICO
// ============================================================================
const CARGOS_CONSELHO = {
    hierofante: { titulo: "Hierofante / Magister", descricao: "Líder soberano. Sanciona leis, ritos e nomeações.", grauMinimo: 8, icone: "👑", poder: "decretar, nomear, expulsar" },
    guardiao_limiar: { titulo: "Guardião do Limiar", descricao: "Defensor do Santuário e campeão de PvP da Ordem.", grauMinimo: 5, icone: "🛡️", poder: "defender territórios, bonus de defesa +20%" },
    chanceler_livros: { titulo: "Chanceler dos Livros", descricao: "Curador da Biblioteca e dos Estudos Esotéricos.", grauMinimo: 4, icone: "📜", poder: "aprovar teses, bonus gnose +15% em estudos" },
    grao_alquimista: { titulo: "Grão-Alquimista", descricao: "Regente da Egrégora e das transmutações da Ordem.", grauMinimo: 6, icone: "⚗️", poder: "gerenciar egrégora, bonus transmutação +20%" }
};

// ============================================================================
// 4. TRADIÇÕES ANCESTRAIS (para IA Guia da Matriz Mágica)
// ============================================================================
const TRADICOES_ANCESTRAIS = {
    agrippa: { nome: "Filosofia Oculta de Agrippa", grimorio: "De Occulta Philosophia", era: "Renascimento", foco: "Magia Natural, Celestial e Cerimonial", sigiloBase: "☿" },
    salomao: { nome: "Clavículas de Salomão", grimorio: "Clavicula Salomonis / Goetia", era: "Medieval", foco: "Invocação, Selamento e Proteção Angélica/Demoníaca", sigiloBase: "✡️" },
    picatrix: { nome: "Picatrix — Ghāyat al-Ḥakīm", grimorio: "Picatrix", era: "Séc. X-XI", foco: "Magia Astral, Talismãs Planetários e Alquimia Estelar", sigiloBase: "🌟" },
    enoquiano: { nome: "Sistema Enoquiano de Dee", grimorio: "Liber Loagaeth / Heptarchia Mystica", era: "Elizabetano", foco: "Comunicação Angélica, Torres de Vigia e Aethyrs", sigiloBase: "🔷" },
    qliphoth: { nome: "Qliphoth — As Cascas do Abismo", grimorio: "Liber 231 / Sefer ha-Zohar Inverso", era: "Cabalística", foco: "Sombras Sephiróticas, Túneis de Set e Dreno Cósmico", sigiloBase: "🕳️" },
    hermetismo: { nome: "Hermetismo Universal", grimorio: "Corpus Hermeticum / Liber 777", era: "Helenístico", foco: "Correspondências Universais, Transmutação e Ascensão", sigiloBase: "🔯" },
    abramelin: { nome: "Magia Sagrada de Abramelin", grimorio: "O Livro da Magia Sagrada de Abramelin, o Mago", era: "Séc. XV", foco: "K&C do Sagrado Anjo Guardião, Quadrados Mágicos", sigiloBase: "✨" }
};

// ============================================================================
// 5. TIPOS DE VÍNCULOS MÁGICOS (para nós da Matriz)
// ============================================================================
const VINCULOS_MAGICOS = {
    alquimia: { nome: "Transmutação Alquímica", efeito: "Bônus em transmutações de recursos", icone: "⚗️", cor: "#FFD700" },
    protecao_santuario: { nome: "Proteção de Santuário", efeito: "Reduz dano recebido por membros no território", icone: "🛡️", cor: "#4169E1" },
    dreno_cosmico: { nome: "Dreno Cósmico", efeito: "Drena vitae de inimigos derrotados em combate", icone: "🩸", cor: "#8B0000" },
    manto_astral: { nome: "Manto Astral Coletivo", efeito: "Escudo passivo para todos os membros online", icone: "🌀", cor: "#9B59B6" },
    ressonancia: { nome: "Ressonância de Poder", efeito: "Amplifica dano mágico de todos os membros", icone: "⚡", cor: "#FF4500" },
    territorio_sagrado: { nome: "Território Sagrado", efeito: "Projeta proteção no mapa 2D ao redor do santuário", icone: "🏛️", cor: "#2ECC71" },
    maldicao_carmica: { nome: "Maldição Cármica", efeito: "Debuff permanente em hereges marcados", icone: "💀", cor: "#1C1C1C" },
    cura_egregora: { nome: "Cura da Egrégora", efeito: "Regeneração passiva de HP para membros", icone: "💚", cor: "#00FF7F" }
};

// ============================================================================
// 6. MOTOR DE MAGIA EM CÓDIGO SEGURO (Mantido para compat. + usado pelo novo sistema)
// ============================================================================
class CodeMagicEngine {
    constructor(ordemCore) {
        this.core = ordemCore;
        this.operadores = ['TRANSMUTAR', 'CANALIZAR_EGREGORA', 'DOBRA_ASTRAL', 'MALDICAO_VAMPIRICA', 'INVOCAR_FORJA_VIVA', 'RESONANCIA_COSMICA'];
    }

    validarFormula(formulaTexto) {
        if (!formulaTexto || typeof formulaTexto !== 'string') {
            return { valida: false, erro: "A fórmula de magia em código está vazia." };
        }
        const linhas = formulaTexto.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//') && !l.startsWith('#'));
        if (linhas.length === 0) return { valida: false, erro: "Nenhuma instrução mágica detectada." };
        if (linhas.length > 20) return { valida: false, erro: "A densidade da fórmula excede o limite astral (máx 20 nós de comando)." };

        const comandosValidados = [];
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i];
            const match = linha.match(/^([A-Z_]+)\s*\((.*)\);?$/);
            if (!match) return { valida: false, erro: `Sintaxe herética na linha ${i + 1}: "${linha}". Use OPERADOR(arg1, arg2, ...);` };
            const op = match[1];
            if (!this.operadores.includes(op)) return { valida: false, erro: `Operador desconhecido "${op}" na linha ${i + 1}. Operadores: ${this.operadores.join(', ')}` };
            const args = this._parseArgs(match[2]);
            comandosValidados.push({ op, args, linhaOriginal: linha });
        }
        return { valida: true, comandos: comandosValidados };
    }

    _parseArgs(argsStr) {
        if (!argsStr || !argsStr.trim()) return [];
        const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|([^,]+)/g;
        const matches = [];
        let m;
        while ((m = regex.exec(argsStr)) !== null) {
            let val = m[1] !== undefined ? m[1] : (m[2] !== undefined ? m[2] : m[3]);
            val = val.trim();
            if (/^-?\d+(\.\d+)?$/.test(val)) val = Number(val);
            matches.push(val);
        }
        return matches;
    }

    async executarFormula(feitico, invocador, contexto = {}) {
        const parseRes = this.validarFormula(feitico.codigoFormula);
        if (!parseRes.valida) return { sucesso: false, erro: parseRes.erro };

        const custoGts = feitico.custoSangue || 500;
        const custoFuria = feitico.custoFuria || 3;
        if ((invocador.sangue || 0) < custoGts) return { sucesso: false, erro: `Exige ${custoGts} Gts de Vitae.` };
        if ((invocador.pontosAcao || 0) < custoFuria) return { sucesso: false, erro: `Exige ${custoFuria} Fúria.` };

        invocador.sangue -= custoGts;
        invocador.pontosAcao -= custoFuria;
        const logsExecucao = [];
        const efeitosAplicados = { recursosTransmutados: {}, buffsAplicados: [], anomalias2D: [], reliquiasForjadas: [] };

        try {
            for (const cmd of parseRes.comandos) {
                switch (cmd.op) {
                    case 'TRANSMUTAR': {
                        const [orig, dest, qtd] = cmd.args;
                        const q = Math.max(1, Math.min(100, parseInt(qtd) || 1));
                        if (!invocador.inventario) invocador.inventario = {};
                        if (!invocador.materiais) invocador.materiais = {};
                        let temOrigem = false;
                        if (orig === 'vitae' || orig === 'sangue') {
                            const custoVit = q * 300;
                            if ((invocador.sangue || 0) >= custoVit) { invocador.sangue -= custoVit; temOrigem = true; }
                        } else if (invocador.inventario[orig] !== undefined && invocador.inventario[orig] >= q) {
                            invocador.inventario[orig] -= q; temOrigem = true;
                        } else if (invocador.materiais[orig] !== undefined && invocador.materiais[orig] >= q) {
                            invocador.materiais[orig] -= q; temOrigem = true;
                        }
                        if (temOrigem) {
                            const ganhoQtd = Math.max(1, Math.floor(q * (1 + (invocador.grauOrdem || 1) * 0.1)));
                            if (dest === 'vitae' || dest === 'sangue') { invocador.sangue = (invocador.sangue || 0) + (ganhoQtd * 350); }
                            else if (['anima', 'cinzas', 'ectoplasma', 'pedraAlma'].includes(dest)) { invocador.inventario[dest] = (invocador.inventario[dest] || 0) + ganhoQtd; }
                            else { invocador.materiais[dest] = (invocador.materiais[dest] || 0) + ganhoQtd; }
                            efeitosAplicados.recursosTransmutados[`${orig}->${dest}`] = ganhoQtd;
                            logsExecucao.push(`Transmutado: ${q}x [${orig}] ➔ +${ganhoQtd}x [${dest}]`);
                        } else { logsExecucao.push(`Transmutação parcial: Insuficiente [${orig}].`); }
                        break;
                    }
                    case 'CANALIZAR_EGREGORA': {
                        const [ordemId, tipo, intensidade] = cmd.args;
                        const ordem = this.core.ordens[ordemId || invocador.ordemId];
                        const pwr = Math.max(50, Math.min(2000, parseInt(intensidade) || 150));
                        if (ordem && (ordem.egregora?.vitae || 0) >= 100) {
                            ordem.egregora.vitae -= 100;
                            if (tipo === 'cura') { invocador.hpAtual = Math.min(invocador.hpMax || 1000, (invocador.hpAtual || 0) + pwr); logsExecucao.push(`Egrégora: +${pwr} HP.`); }
                            else if (tipo === 'furia') { invocador.pontosAcao = Math.min(invocador.maxAcao || 100, (invocador.pontosAcao || 0) + 10); logsExecucao.push(`Egrégora: +10 Fúria.`); }
                            else { invocador.escudoAstral = (invocador.escudoAstral || 0) + pwr; logsExecucao.push(`Escudo Astral: +${pwr}.`); }
                        } else {
                            invocador.hpAtual = Math.min(invocador.hpMax || 1000, (invocador.hpAtual || 0) + Math.floor(pwr / 2));
                            logsExecucao.push(`Canalização interior: +${Math.floor(pwr / 2)} HP.`);
                        }
                        break;
                    }
                    case 'DOBRA_ASTRAL': {
                        const [x, y, raio, tipo] = cmd.args;
                        const posX = Math.max(0, Math.min(100, parseInt(x) || 50));
                        const posY = Math.max(0, Math.min(100, parseInt(y) || 50));
                        const r = Math.max(2, Math.min(15, parseInt(raio) || 5));
                        const anomalia = { id: crypto.randomBytes(4).toString('hex'), nome: `Dobra Astral de ${invocador.nome}`, tipo: tipo || "santuario", x: posX, y: posY, raio: r, criador: invocador.nome, criadoEm: Date.now(), duracaoMs: 600000 };
                        if (!this.core.anomalias2D) this.core.anomalias2D = [];
                        this.core.anomalias2D.push(anomalia);
                        if (this.core.anomalias2D.length > 20) this.core.anomalias2D.shift();
                        efeitosAplicados.anomalias2D.push(anomalia);
                        logsExecucao.push(`Dobra Astral em (${posX}, ${posY}) [Raio ${r}].`);
                        break;
                    }
                    case 'MALDICAO_VAMPIRICA': {
                        const [alvoNome, efeito, duracao] = cmd.args;
                        logsExecucao.push(`Maldição selada em [${alvoNome}]: ${efeito || 'dreno'} por ${duracao || 3} turnos.`);
                        break;
                    }
                    case 'INVOCAR_FORJA_VIVA': {
                        const [slot, pwr2, arquetipo] = cmd.args;
                        const nivelBase = Math.max(1, Math.min(100, (invocador.nivel || 1) + (invocador.grauOrdem || 1) * 2));
                        const novaReliquia = {
                            id: crypto.randomBytes(4).toString('hex'), nome: `Relíquia Viva de ${feitico.nome || 'Hermetismo'}`, slot: slot || 'arma',
                            arquetipo: arquetipo || 'Ocultismo (Mago)', raridade: 'Mítica', nivel: nivelBase,
                            bonus: { vontade: nivelBase * 4, gnose: nivelBase * 6, magnetismo: nivelBase * 3, densidade: nivelBase * 4 },
                            durabilidade: 150, durabilidadeMax: 150, dataCriacao: Date.now(), forjador: invocador.nome
                        };
                        if (!invocador.bolsa) invocador.bolsa = [];
                        if (invocador.bolsa.length < 25) { invocador.bolsa.push(novaReliquia); efeitosAplicados.reliquiasForjadas.push(novaReliquia); logsExecucao.push(`Relíquia [${novaReliquia.nome}] forjada!`); }
                        else { invocador.sangue = (invocador.sangue || 0) + 500; logsExecucao.push(`Bolsa cheia! +500 Gts.`); }
                        break;
                    }
                    case 'RESONANCIA_COSMICA': {
                        logsExecucao.push(`Ressonância Cósmica: +25% dano mágico por 15 min.`);
                        invocador.buffRessonanciaAte = Date.now() + 900000;
                        break;
                    }
                }
            }
            feitico.usosTotais = (feitico.usosTotais || 0) + 1;
            feitico.ultimoUso = Date.now();
            return { sucesso: true, relato: `Magia [${feitico.nome}] executada com sucesso!`, logs: logsExecucao, efeitos: efeitosAplicados };
        } catch (err) {
            console.error("[CODE-MAGIC ERROR]:", err);
            return { sucesso: false, erro: `Entropia astral: ${err.message}`, logs: logsExecucao };
        }
    }
}

// ============================================================================
// 7. CLASSE CENTRAL: ORDEM MÁGICA — LAPIDADA COM SANTUÁRIOS, CARGOS,
//    PROVAÇÕES, RITOS COLETIVOS E MATRIZ MÁGICA EXCLUSIVA (IA GUIA)
// ============================================================================
class OrdemMagicaCore {
    _resolverVampiro(entidade) {
        if (!entidade) return null;
        if (typeof entidade === 'string') {
            if (this.shadowCore?.vampiros?.[entidade]) return this.shadowCore.vampiros[entidade];
            if (entidade === 'O_PRIMORDIAL') {
                return {
                    id: 'O_PRIMORDIAL',
                    nome: 'O Alfa Primordial',
                    ordemId: 'ordo_sanguinis_aeternum',
                    grauOrdem: 10,
                    nivel: 50,
                    sangue: 100000,
                    pontosAcao: 100,
                    maxAcao: 100,
                    atributos: { gnose: 100, vontade: 100, densidade: 100 }
                };
            }
            return null;
        }
        return entidade;
    }

    constructor(shadowCore) {
        this.shadowCore = shadowCore;
        this.ordens = {};
        this.bibliotecaTomos = [];
        this.feitiçosEmCodigo = {};
        this.anomalias2D = [];
        this.codeEngine = new CodeMagicEngine(this);
        this.provacoesAtivas = {}; // { vampiroId: { enigma, grauAlvo, ordemId, timestamp } }
        this.ritosAtivos = {};     // { ordemId: { tipo, iniciadoEm, duracaoMs, efeitos } }

        this._inicializarOrdemPrimordial();
    }

    _inicializarOrdemPrimordial() {
        const idPrimordial = "ordo_sanguinis_aeternum";
        this.ordens[idPrimordial] = {
            id: idPrimordial,
            nome: "Ordo Hermetica Sanguinis Aeternum",
            lema: "Per Sanguinem Ad Astra, Per Tenebras Ad Lucem",
            sigilo: "🔯",
            fundadorId: "O_PRIMORDIAL",
            fundadorNome: "O Alfa Primordial",
            criadoEm: new Date().toISOString(),
            santuarioNome: "Catedral da Meia-Noite",
            santuarioTier: 3,
            conselho: {
                hierofante: "O_PRIMORDIAL",
                guardiao_limiar: null,
                chanceler_livros: null,
                grao_alquimista: null
            },
            egregora: { vitae: 15000, anima: 50, cinzas: 80, poderTotal: 3500 },
            membros: {
                "O_PRIMORDIAL": { nome: "O Alfa Primordial", grau: 10, dataIngresso: Date.now(), contribuicaoGts: 100000, cargo: "hierofante" }
            },
            decretosAtivos: [
                { id: "dec_1", titulo: "Pacto de Não-Agressão entre Adeptos", efeito: "+15% de XP em estudos herméticos", ativo: true }
            ],
            matrizMagica: {},  // { noId: { nomeMagico, tradicao, vinculoTipo, efeitoAutoritativo, sigilo, ativo, sintonizados[] } }
            ritosRealizados: 0,
            ultimoRito: null
        };

        this.bibliotecaTomos.push({
            id: "tomo_caibalion_primordial",
            titulo: "As Sete Leis Herméticas do Sangue e da Matéria",
            autor: "O Alfa Primordial", autorId: "O_PRIMORDIAL",
            tema: "Hermetismo Universal", grauMinimo: 0,
            notaAkashica: 100, gnoseConcedida: 50, xpEstudo: 400,
            conteudo: "1. O Todo é Mente; o Universo é Mental.\n2. O que está em cima é como o que está embaixo.\n3. Nada repousa; tudo se move; tudo vibra.\n4. Tudo é Duplo; tudo tem dois polos.\n5. Tudo tem fluxo e refluxo.\n6. Toda Causa tem seu Efeito; todo Efeito tem sua Causa.\n7. O Gênero está em tudo; tudo tem o seu princípio masculino e feminino.",
            dataPublicacao: new Date().toISOString(), estudantes: []
        });
    }

    // ==========================================
    // GERENCIAMENTO DE ORDENS INICIÁTICAS
    // ==========================================
    criarOrdem(fundadorParam, dados = {}) {
        const fundador = this._resolverVampiro(fundadorParam);
        if (!fundador) return { erro: "Invocador inexistente." };
        if ((fundador.nivel || 1) < 10) return { erro: "Apenas vampiros de Nível 10+ podem fundar uma Ordem Mística." };
        if (fundador.ordemId && this.ordens[fundador.ordemId]) {
            return { erro: "Já pertences a uma Ordem. Renuncie antes de fundar outra." };
        }

        const custoFundacaoGts = 10000;
        const custoAnima = 5;
        if ((fundador.sangue || 0) < custoFundacaoGts || (fundador.inventario?.anima || 0) < custoAnima) {
            return { erro: `Fundar exige ${custoFundacaoGts} Gts e ${custoAnima} Anima.` };
        }

        fundador.sangue -= custoFundacaoGts;
        fundador.inventario.anima -= custoAnima;

        const ordemId = "ordem_" + crypto.randomBytes(4).toString('hex');
        const novaOrdem = {
            id: ordemId,
            nome: dados.nome || "Ordem das Sombras Eternas",
            lema: dados.lema || "Solve et Coagula",
            sigilo: dados.sigilo || "👁️",
            fundadorId: fundador.id,
            fundadorNome: fundador.nome,
            criadoEm: new Date().toISOString(),
            santuarioNome: dados.santuario || "Templo Oculto do Vazio",
            santuarioTier: 1,
            conselho: {
                hierofante: fundador.id,
                guardiao_limiar: null,
                chanceler_livros: null,
                grao_alquimista: null
            },
            egregora: { vitae: 2000, anima: 5, cinzas: 10, poderTotal: 500 },
            membros: {
                [fundador.id]: { nome: fundador.nome, grau: 8, dataIngresso: Date.now(), contribuicaoGts: custoFundacaoGts, cargo: "hierofante" }
            },
            decretosAtivos: [],
            matrizMagica: {},
            ritosRealizados: 0,
            ultimoRito: null
        };

        this.ordens[ordemId] = novaOrdem;
        fundador.ordemId = ordemId;
        fundador.grauOrdem = 8;

        this.shadowCore._registrarEventoEspecial('global', 'ORDEM MÍSTICA FUNDADA', `O Magister [${fundador.nome}] ergueu o Templo: [${novaOrdem.nome}]! Sigilo: ${novaOrdem.sigilo}`, true);
        this.shadowCore._salvarBancoDeDados();
        return { sucesso: true, ordem: novaOrdem, relato: `A Ordem [${novaOrdem.nome}] foi inscrita nos Anais do Éter!` };
    }

    iniciarNeofito(mestreParam, ordemIdOuAlvo, juramentoSangue) {
        const mestre = this._resolverVampiro(mestreParam);
        if (!mestre) return { erro: "Mestre não encontrado." };
        let alvoId = (typeof juramentoSangue === 'string' && ordemIdOuAlvo.startsWith('ordem_')) ? mestre.id : (typeof ordemIdOuAlvo === 'string' && !ordemIdOuAlvo.startsWith('ordem_') ? ordemIdOuAlvo : juramentoSangue || ordemIdOuAlvo);
        if (typeof ordemIdOuAlvo === 'string' && ordemIdOuAlvo.startsWith('ordem_') && mestreParam !== ordemIdOuAlvo) {
            alvoId = mestre.id;
            const ordemAlvo = this.ordens[ordemIdOuAlvo];
            if (!ordemAlvo) return { erro: "Ordem não encontrada." };
            if (mestre.ordemId && this.ordens[mestre.ordemId]) return { erro: "Já pertences a uma Ordem." };
            ordemAlvo.membros[mestre.id] = { nome: mestre.nome, grau: 0, dataIngresso: Date.now(), contribuicaoGts: 0, cargo: null };
            mestre.ordemId = ordemAlvo.id;
            mestre.grauOrdem = 0;
            this.shadowCore._registrarEventoEspecial('global', 'JURAMENTO INICIÁTICO', `[${mestre.nome}] ingressou como Neófito 0° na [${ordemAlvo.nome}]!`, true);
            this.shadowCore._salvarBancoDeDados();
            return { sucesso: true, relato: `[${mestre.nome}] foi consagrado Neófito 0° na Ordem [${ordemAlvo.nome}]!` };
        }
        if (!mestre.ordemId || !this.ordens[mestre.ordemId]) return { erro: "Não pertences a uma Ordem Iniciática." };
        const ordem = this.ordens[mestre.ordemId];
        const mestreGrau = ordem.membros[mestre.id]?.grau || 0;
        if (mestreGrau < 5) return { erro: "Grau 5+ necessário para conferir a Iniciação." };

        const alvo = this.shadowCore.vampiros[alvoId];
        if (!alvo) return { erro: "Acólito não localizado." };
        if (alvo.ordemId && this.ordens[alvo.ordemId]) return { erro: `[${alvo.nome}] já fez votos.` };

        ordem.membros[alvo.id] = { nome: alvo.nome, grau: 0, dataIngresso: Date.now(), contribuicaoGts: 0, cargo: null };
        alvo.ordemId = ordem.id;
        alvo.grauOrdem = 0;

        this.shadowCore._registrarEventoEspecial('global', 'JURAMENTO INICIÁTICO', `[${alvo.nome}] ingressou como Neófito 0° na [${ordem.nome}]!`, true);
        this.shadowCore._salvarBancoDeDados();
        return { sucesso: true, relato: `[${alvo.nome}] aceito como Neófito 0° por ${mestre.nome}.` };
    }

    promoverGrau(mestreParam, ordemIdOuAlvo, membroIdParam) {
        const mestre = this._resolverVampiro(mestreParam);
        if (!mestre) return { erro: "Mestre não encontrado." };
        const alvoId = membroIdParam || ordemIdOuAlvo;
        if (!mestre.ordemId || !this.ordens[mestre.ordemId]) return { erro: "Ordem inválida." };
        const ordem = this.ordens[mestre.ordemId];
        const mestreMembro = ordem.membros[mestre.id];
        if (!mestreMembro || mestreMembro.grau < 7) return { erro: "Grau 7+ necessário para promover." };

        const alvoMembro = ordem.membros[alvoId];
        if (!alvoMembro) return { erro: "Membro não encontrado." };
        const grauAtual = alvoMembro.grau;
        if (grauAtual >= 10) return { erro: "Grau Supremo já atingido." };
        if (grauAtual >= mestreMembro.grau) return { erro: "Não podes promover igual ou superior." };

        const prox = GRAUS_INICIATICOS[grauAtual + 1];
        const alvoVampiro = this.shadowCore.vampiros[alvoId];
        const atr = this.shadowCore._obterAtributosTotais(alvoVampiro);
        if ((atr.gnose || 10) < prox.reqGnose) {
            return { erro: `Falta Gnose: ${prox.reqGnose} necessário (atual: ${atr.gnose || 10}).` };
        }

        alvoMembro.grau += 1;
        if (alvoVampiro) alvoVampiro.grauOrdem = alvoMembro.grau;

        this.shadowCore._registrarEventoEspecial('global', 'ASCENSÃO DE GRAU', `[${alvoMembro.nome}] ascendeu a ${prox.titulo} ${alvoMembro.grau}° na [${ordem.nome}]!`, true);
        this.shadowCore._salvarBancoDeDados();
        return { sucesso: true, novoGrau: alvoMembro.grau, titulo: prox.titulo, relato: `[${alvoMembro.nome}] ascendeu a ${prox.titulo} ${alvoMembro.grau}°!` };
    }

    doarEgregora(vampiroParam, ordemIdOuDoacoes, quantiaVitae) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Iniciado não encontrado." };
        let doacoes = {};
        if (typeof ordemIdOuDoacoes === 'object') doacoes = ordemIdOuDoacoes;
        else if (quantiaVitae !== undefined) doacoes = { gts: parseInt(quantiaVitae) || 0 };
        else if (!isNaN(Number(ordemIdOuDoacoes))) doacoes = { gts: parseInt(ordemIdOuDoacoes) || 0 };
        if (!vampiro.ordemId || !this.ordens[vampiro.ordemId]) return { erro: "Não pertences a uma Ordem." };
        const ordem = this.ordens[vampiro.ordemId];

        const gts = Math.max(0, parseInt(doacoes.gts) || 0);
        const anima = Math.max(0, parseInt(doacoes.anima) || 0);
        const cinzas = Math.max(0, parseInt(doacoes.cinzas) || 0);
        if (gts === 0 && anima === 0 && cinzas === 0) return { erro: "Nenhuma oferenda." };
        if ((vampiro.sangue || 0) < gts) return { erro: `Vitae insuficiente (${vampiro.sangue} Gts).` };
        if ((vampiro.inventario?.anima || 0) < anima) return { erro: `Anima insuficiente.` };
        if ((vampiro.inventario?.cinzas || 0) < cinzas) return { erro: `Cinzas insuficientes.` };

        vampiro.sangue -= gts;
        if (anima > 0) vampiro.inventario.anima -= anima;
        if (cinzas > 0) vampiro.inventario.cinzas -= cinzas;

        ordem.egregora.vitae = (ordem.egregora.vitae || 0) + gts;
        ordem.egregora.anima = (ordem.egregora.anima || 0) + anima;
        ordem.egregora.cinzas = (ordem.egregora.cinzas || 0) + cinzas;
        ordem.egregora.poderTotal = (ordem.egregora.poderTotal || 0) + Math.floor(gts / 10) + (anima * 50) + (cinzas * 30);

        if (ordem.membros[vampiro.id]) ordem.membros[vampiro.id].contribuicaoGts = (ordem.membros[vampiro.id].contribuicaoGts || 0) + gts;

        this.shadowCore.ganharXP(vampiro.id, Math.floor(gts / 20) + (anima * 40));
        this.shadowCore._salvarBancoDeDados();
        return { sucesso: true, egregora: ordem.egregora, relato: `Oferenda depositada! Egrégora: ${ordem.egregora.poderTotal} Poder Cósmico.` };
    }

    proclamarDecreto(mestreParam, tituloOuOrdem, tituloDecretoOuTexto, textoDecreto) {
        const mestre = this._resolverVampiro(mestreParam);
        if (!mestre) return { erro: "Mestre não encontrado." };
        let titulo = tituloOuOrdem;
        let efeitoDesc = tituloDecretoOuTexto;
        if (textoDecreto !== undefined) { titulo = tituloDecretoOuTexto; efeitoDesc = textoDecreto; }
        if (!mestre.ordemId || !this.ordens[mestre.ordemId]) return { erro: "Sem Ordem." };
        const ordem = this.ordens[mestre.ordemId];
        const grau = ordem.membros[mestre.id]?.grau || 0;
        if (grau < 6) return { erro: "Grau 6°+ exigido para Decretos." };

        const novoDec = {
            id: "dec_" + crypto.randomBytes(3).toString('hex'),
            titulo: titulo || "Decreto Solene do Santuário",
            efeito: efeitoDesc || "+10% em transmutações",
            proclamador: mestre.nome, data: Date.now(), ativo: true
        };
        if (!ordem.decretosAtivos) ordem.decretosAtivos = [];
        ordem.decretosAtivos.unshift(novoDec);
        if (ordem.decretosAtivos.length > 5) ordem.decretosAtivos.pop();

        this.shadowCore._registrarEventoEspecial('global', 'DECRETO', `[${mestre.nome}] proclamou: "${novoDec.titulo}" (${novoDec.efeito})!`, true);
        this.shadowCore._salvarBancoDeDados();
        return { sucesso: true, decreto: novoDec, relato: `Decreto "${novoDec.titulo}" registrado!` };
    }

    // ==========================================
    // EVOLUÇÃO DO SANTUÁRIO (TIERS 1-5)
    // ==========================================
    evoluirSantuario(vampiroParam) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Vampiro não encontrado." };
        if (!vampiro.ordemId || !this.ordens[vampiro.ordemId]) return { erro: "Não pertences a uma Ordem." };
        const ordem = this.ordens[vampiro.ordemId];

        // Só Hierofante ou Grão-Alquimista podem evoluir
        const membro = ordem.membros[vampiro.id];
        if (!membro) return { erro: "Não és membro desta Ordem." };
        if (membro.cargo !== 'hierofante' && membro.cargo !== 'grao_alquimista' && membro.grau < 8) {
            return { erro: "Apenas o Hierofante, o Grão-Alquimista ou Mestres 8°+ podem evoluir o Santuário." };
        }

        const tierAtual = ordem.santuarioTier || 1;
        if (tierAtual >= 5) return { erro: "O Santuário já atingiu o Templo Primordial de Kether (Tier 5). Perfeição absoluta." };

        const proxTier = SANTUARIO_TIERS[tierAtual]; // tier index = next tier (0-based current is tier-1)
        if (!proxTier) return { erro: "Tier seguinte não definido." };

        // Verificar recursos da Egrégora
        const ego = ordem.egregora;
        if ((ego.vitae || 0) < proxTier.custoVitae) return { erro: `Egrégora precisa de ${proxTier.custoVitae} Vitae (tem ${ego.vitae}).` };
        if ((ego.anima || 0) < proxTier.custoAnima) return { erro: `Egrégora precisa de ${proxTier.custoAnima} Anima (tem ${ego.anima}).` };
        if ((ego.cinzas || 0) < proxTier.custoCinzas) return { erro: `Egrégora precisa de ${proxTier.custoCinzas} Cinzas (tem ${ego.cinzas}).` };

        // Consumir recursos
        ego.vitae -= proxTier.custoVitae;
        ego.anima -= proxTier.custoAnima;
        ego.cinzas -= proxTier.custoCinzas;

        ordem.santuarioTier = tierAtual + 1;
        ordem.santuarioNome = proxTier.nome;

        this.shadowCore._registrarEventoEspecial('global', 'SANTUÁRIO EVOLUÍDO', `O Templo da [${ordem.nome}] ascendeu ao Tier ${ordem.santuarioTier}: [${proxTier.nome}]!`, true);
        this.shadowCore._salvarBancoDeDados();

        return {
            sucesso: true,
            novoTier: ordem.santuarioTier,
            nomeDoTier: proxTier.nome,
            bonus: proxTier.bonus,
            relato: `O Santuário ascendeu a [${proxTier.nome}] (Tier ${ordem.santuarioTier})! ${proxTier.bonus.descricao}`
        };
    }

    obterInfoSantuario(ordemId) {
        const ordem = this.ordens[ordemId];
        if (!ordem) return { erro: "Ordem não encontrada." };
        const tierAtual = ordem.santuarioTier || 1;
        const tierInfo = SANTUARIO_TIERS[tierAtual - 1];
        const proxTier = tierAtual < 5 ? SANTUARIO_TIERS[tierAtual] : null;
        return {
            sucesso: true,
            tierAtual, nomeAtual: tierInfo?.nome || ordem.santuarioNome,
            bonusAtual: tierInfo?.bonus || {},
            proximoTier: proxTier ? { tier: tierAtual + 1, nome: proxTier.nome, custo: { vitae: proxTier.custoVitae, anima: proxTier.custoAnima, cinzas: proxTier.custoCinzas }, bonus: proxTier.bonus } : null,
            todosOsTiers: SANTUARIO_TIERS
        };
    }

    // ==========================================
    // CARGOS DO CONSELHO INICIÁTICO
    // ==========================================
    nomearCargo(vampiroParam, membroAlvoId, cargoKey) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Vampiro não encontrado." };
        if (!vampiro.ordemId || !this.ordens[vampiro.ordemId]) return { erro: "Sem Ordem." };
        const ordem = this.ordens[vampiro.ordemId];

        // Só o Hierofante pode nomear
        if (ordem.conselho?.hierofante !== vampiro.id && (ordem.membros[vampiro.id]?.grau || 0) < 8) {
            return { erro: "Apenas o Hierofante ou Mestres 8°+ podem nomear cargos do Conselho." };
        }

        if (!CARGOS_CONSELHO[cargoKey]) return { erro: `Cargo "${cargoKey}" inválido. Válidos: ${Object.keys(CARGOS_CONSELHO).join(', ')}` };
        const cargoInfo = CARGOS_CONSELHO[cargoKey];

        const alvoMembro = ordem.membros[membroAlvoId];
        if (!alvoMembro) return { erro: "Membro não encontrado na Ordem." };
        if (alvoMembro.grau < cargoInfo.grauMinimo) return { erro: `O cargo de ${cargoInfo.titulo} exige Grau ${cargoInfo.grauMinimo}°+.` };

        // Remover cargo anterior do membro anterior (se houver)
        const anteriorId = ordem.conselho?.[cargoKey];
        if (anteriorId && ordem.membros[anteriorId]) {
            ordem.membros[anteriorId].cargo = null;
        }

        // Nomear
        if (!ordem.conselho) ordem.conselho = {};
        ordem.conselho[cargoKey] = membroAlvoId;
        alvoMembro.cargo = cargoKey;

        this.shadowCore._registrarEventoEspecial('global', 'NOMEAÇÃO DO CONSELHO', `[${alvoMembro.nome}] foi nomeado ${cargoInfo.icone} ${cargoInfo.titulo} da [${ordem.nome}]!`, true);
        this.shadowCore._salvarBancoDeDados();
        return { sucesso: true, cargo: cargoInfo, membro: alvoMembro.nome, relato: `${alvoMembro.nome} é agora ${cargoInfo.titulo}!` };
    }

    obterConselho(ordemId) {
        const ordem = this.ordens[ordemId];
        if (!ordem) return { erro: "Ordem não encontrada." };
        const conselho = {};
        for (const [key, cargoInfo] of Object.entries(CARGOS_CONSELHO)) {
            const membroId = ordem.conselho?.[key];
            const membro = membroId ? ordem.membros[membroId] : null;
            conselho[key] = { ...cargoInfo, ocupante: membro ? { id: membroId, nome: membro.nome, grau: membro.grau } : null };
        }
        return { sucesso: true, conselho };
    }

    // ==========================================
    // PROVAÇÃO INICIÁTICA (EXAME DA SOMBRA via IA)
    // ==========================================
    async requererProvacao(vampiroParam) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Vampiro não encontrado." };
        if (!vampiro.ordemId || !this.ordens[vampiro.ordemId]) return { erro: "Não pertences a uma Ordem." };
        const ordem = this.ordens[vampiro.ordemId];
        const membro = ordem.membros[vampiro.id];
        if (!membro) return { erro: "Não és membro." };

        const grauAtual = membro.grau;
        if (grauAtual >= 10) return { erro: "Já atingiste o Grau Supremo de Ipsissimus 10°." };
        const proxGrau = GRAUS_INICIATICOS[grauAtual + 1];

        // Verificar requisitos de Gnose e XP
        const atr = this.shadowCore._obterAtributosTotais(vampiro);
        if ((atr.gnose || 10) < proxGrau.reqGnose) return { erro: `Gnose insuficiente: ${atr.gnose || 10}/${proxGrau.reqGnose}.` };
        if ((vampiro.xp || 0) < proxGrau.reqXp) return { erro: `XP insuficiente: ${vampiro.xp || 0}/${proxGrau.reqXp}.` };

        // Verificar se já tem uma provação ativa
        if (this.provacoesAtivas[vampiro.id]) return { erro: "Já tens uma Provação Iniciática em andamento. Responde antes de solicitar outra." };

        // Gerar enigma com a IA Oráculo
        let enigma = {};
        try {
            const prompt = `Gere um enigma místico e hermético para a Provação Iniciática do grau ${proxGrau.titulo} (${proxGrau.sfera}). Contexto: ${proxGrau.provaDescricao}. O enigma deve ter: 1) Uma pergunta esotérica profunda (máx 200 chars), 2) Uma dica sutil (máx 80 chars), 3) Três palavras-chave que uma resposta correta deve conter pelo menos uma. Responda EXCLUSIVAMENTE em JSON: {"pergunta":"...", "dica":"...", "palavrasChave":["...", "...", "..."]}`;
            const resIA = await this.shadowCore.oraculo.consultarOraculo(vampiro, prompt);
            try {
                const jsonMatch = resIA.texto.match(/\{[\s\S]*\}/);
                if (jsonMatch) enigma = JSON.parse(jsonMatch[0]);
            } catch (e) { /* fallback */ }
        } catch (e) { /* fallback */ }

        // Fallback robusto se IA falhar
        if (!enigma.pergunta) {
            const enigmasFallback = {
                1: { pergunta: "Qual é o nome da fundação lunar que sustenta toda a Árvore da Vida no plano astral?", dica: "A nona esfera...", palavrasChave: ["yesod", "lua", "fundação", "astral"] },
                2: { pergunta: "Hod e Netzach representam duas polaridades. Qual é o princípio que as une no Pilar do Equilíbrio?", dica: "Mercúrio e Vênus...", palavrasChave: ["tiphereth", "equilíbrio", "beleza", "harmonia"] },
                3: { pergunta: "Na Alquimia Hermética, quais são as três operações primordiais antes da Pedra Filosofal?", dica: "Nigredo, Albedo...", palavrasChave: ["nigredo", "albedo", "rubedo", "solve", "coagula"] },
                4: { pergunta: "O Véu de Paroketh separa quais seções da Árvore da Vida, e o que simboliza a sua travessia?", dica: "O portal entre a personalidade e o eu superior...", palavrasChave: ["personalidade", "superior", "tiphereth", "paroketh", "iluminação"] },
                5: { pergunta: "O que significa a fórmula do Conhecimento e Conversação do Sagrado Anjo Guardião segundo Abramelin?", dica: "18 meses de retiro...", palavrasChave: ["anjo", "guardião", "vontade", "verdadeira", "sagrado", "abramelin"] },
                6: { pergunta: "Geburah é a severidade da Vontade. Como se manifesta a Vontade Verdadeira (Thelema) na prática mágica?", dica: "Cada ser tem um caminho único...", palavrasChave: ["thelema", "vontade", "verdadeira", "caminho", "estrela"] },
                7: { pergunta: "Chesed é a misericórdia. Qual é o paradoxo entre poder absoluto e compaixão na magia cerimonial?", dica: "O mago que tudo pode, mas se contém...", palavrasChave: ["misericórdia", "compaixão", "poder", "chesed", "equilíbrio"] },
                8: { pergunta: "Binah é o Cálice da Grande Mãe. O que significa 'verter o sangue no Cálice de Babalon'?", dica: "A dissolução do ego no Abismo...", palavrasChave: ["babalon", "ego", "abismo", "dissolução", "sacrifício", "binah"] },
                9: { pergunta: "Chokmah é a Sabedoria primordial. Qual é a tua Palavra Mágica — a síntese da tua Vontade cósmica?", dica: "Uma única palavra que resume o teu propósito...", palavrasChave: ["palavra", "vontade", "propósito", "mágica"] },
                10: { pergunta: "Kether é o Vazio Primordial. Não há pergunta. Apenas silêncio. O que resta quando tudo é dissolvido?", dica: "...", palavrasChave: ["nada", "vazio", "silêncio", "ser", "unidade", "kether"] }
            };
            enigma = enigmasFallback[grauAtual + 1] || enigmasFallback[1];
        }

        // Registrar provação ativa
        this.provacoesAtivas[vampiro.id] = {
            enigma,
            grauAlvo: grauAtual + 1,
            ordemId: ordem.id,
            timestamp: Date.now()
        };

        return {
            sucesso: true,
            enigma: { pergunta: enigma.pergunta, dica: enigma.dica },
            grauAlvo: proxGrau,
            relato: `A Provação Iniciática para ${proxGrau.titulo} ${grauAtual + 1}° começou! Responde ao enigma da Sombra.`
        };
    }

    async responderProvacao(vampiroParam, resposta) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Vampiro não encontrado." };
        const provacao = this.provacoesAtivas[vampiro.id];
        if (!provacao) return { erro: "Não tens nenhuma Provação ativa." };

        const respostaLower = (resposta || '').toLowerCase().trim();
        if (!respostaLower || respostaLower.length < 5) return { erro: "Resposta muito breve. O Oráculo exige reflexão." };

        // Verificar palavras-chave
        const palavras = provacao.enigma.palavrasChave || [];
        const acertou = palavras.some(p => respostaLower.includes(p.toLowerCase()));

        // Também consultar a IA para avaliação qualitativa (se disponível)
        let notaIA = 0;
        let comentarioIA = "";
        try {
            const prompt = `O aspirante respondeu "${resposta}" ao enigma: "${provacao.enigma.pergunta}". As palavras-chave esperadas eram: ${palavras.join(', ')}. A resposta é satisfatória para ascender no grau hermético? Responda EXCLUSIVAMENTE em JSON: {"aprovado": true/false, "nota": 0-100, "comentario":"..."}`;
            const resIA = await this.shadowCore.oraculo.consultarOraculo(vampiro, prompt);
            try {
                const jsonMatch = resIA.texto.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const avaliacao = JSON.parse(jsonMatch[0]);
                    notaIA = avaliacao.nota || 0;
                    comentarioIA = avaliacao.comentario || "";
                    if (avaliacao.aprovado) notaIA = Math.max(notaIA, 60);
                }
            } catch (e) { /* fallback */ }
        } catch (e) { /* fallback */ }

        // Decisão: aprovado se palavras-chave bateram OU nota IA >= 50
        const aprovado = acertou || notaIA >= 50;

        // Limpar provação ativa
        delete this.provacoesAtivas[vampiro.id];

        if (aprovado) {
            const ordem = this.ordens[provacao.ordemId];
            if (ordem && ordem.membros[vampiro.id]) {
                ordem.membros[vampiro.id].grau = provacao.grauAlvo;
                vampiro.grauOrdem = provacao.grauAlvo;
                const grauInfo = GRAUS_INICIATICOS[provacao.grauAlvo];

                // Bônus de ascensão
                const bonusGnose = Math.floor(provacao.grauAlvo * 5);
                const bonusXP = provacao.grauAlvo * 200;
                if (!vampiro.atributos) vampiro.atributos = {};
                vampiro.atributos.gnose = (vampiro.atributos.gnose || 10) + bonusGnose;
                this.shadowCore.ganharXP(vampiro.id, bonusXP);

                this.shadowCore._registrarEventoEspecial('global', 'PROVAÇÃO SUPERADA', `[${vampiro.nome}] superou a Provação e ascendeu a ${grauInfo.titulo} ${provacao.grauAlvo}°!`, true);
                this.shadowCore._salvarBancoDeDados();

                return {
                    sucesso: true, aprovado: true,
                    novoGrau: provacao.grauAlvo, titulo: grauInfo.titulo,
                    bonusGnose, bonusXP,
                    comentarioIA: comentarioIA || "O Oráculo reconhece a tua sabedoria.",
                    relato: `Ascensão! Passaste na Provação e agora és ${grauInfo.titulo} ${provacao.grauAlvo}°! +${bonusGnose} Gnose, +${bonusXP} XP.`
                };
            }
        }

        return {
            sucesso: true, aprovado: false,
            comentarioIA: comentarioIA || "A Sombra não reconheceu a tua resposta. Medita e tenta novamente.",
            relato: "A Provação falhou. O véu permanece cerrado. Estuda mais e tenta outra vez."
        };
    }

    // ==========================================
    // RITOS COLETIVOS DA ORDEM
    // ==========================================
    iniciarRitoColetivo(vampiroParam, tipoRito) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Vampiro não encontrado." };
        if (!vampiro.ordemId || !this.ordens[vampiro.ordemId]) return { erro: "Sem Ordem." };
        const ordem = this.ordens[vampiro.ordemId];
        const membro = ordem.membros[vampiro.id];
        if (!membro || membro.grau < 5) return { erro: "Grau 5°+ necessário para iniciar Ritos Coletivos." };

        // Cooldown: 2 horas entre ritos
        if (ordem.ultimoRito && (Date.now() - ordem.ultimoRito < 2 * 60 * 60 * 1000)) {
            const restante = Math.ceil((2 * 60 * 60 * 1000 - (Date.now() - ordem.ultimoRito)) / 60000);
            return { erro: `O Éter ainda vibra do rito anterior. Espera ${restante} minutos.` };
        }

        const custoVitae = 2000;
        if ((ordem.egregora.vitae || 0) < custoVitae) return { erro: `A Egrégora precisa de ${custoVitae} Vitae para o rito.` };
        ordem.egregora.vitae -= custoVitae;

        const duracaoMs = 2 * 60 * 60 * 1000; // 2 horas
        let efeitos = {};
        let descricao = "";

        switch (tipoRito) {
            case 'egregora_lunar':
                efeitos = { xpBonus: 0.15, gnoseBonus: 0.10, tipo: 'egregora_lunar' };
                descricao = "Rito da Egrégora Lunar — +15% XP e +10% Gnose por 2 horas para todos os irmãos.";
                break;
            case 'manto_protetor':
                efeitos = { defesaBonus: 0.20, escudoPassivo: 150, tipo: 'manto_protetor' };
                descricao = "Manto Protetor da Ordem — +20% defesa e Escudo Passivo de 150 pontos por 2 horas.";
                break;
            case 'furia_ancestral':
                efeitos = { danoBonus: 0.15, furiaRegenBonus: 0.25, tipo: 'furia_ancestral' };
                descricao = "Fúria Ancestral dos Primordiais — +15% dano e +25% regen Fúria por 2 horas.";
                break;
            default:
                return { erro: "Tipo de rito inválido. Opções: egregora_lunar, manto_protetor, furia_ancestral." };
        }

        this.ritosAtivos[ordem.id] = {
            tipo: tipoRito,
            iniciadoEm: Date.now(),
            duracaoMs,
            efeitos,
            iniciadoPor: vampiro.nome
        };
        ordem.ultimoRito = Date.now();
        ordem.ritosRealizados = (ordem.ritosRealizados || 0) + 1;

        // Aplicar escudo passivo a todos os membros (se manto_protetor)
        if (tipoRito === 'manto_protetor') {
            for (const [memId] of Object.entries(ordem.membros)) {
                const v = this.shadowCore.vampiros[memId];
                if (v) v.escudoAstral = (v.escudoAstral || 0) + (efeitos.escudoPassivo || 0);
            }
        }

        this.shadowCore._registrarEventoEspecial('global', 'RITO COLETIVO', `[${vampiro.nome}] invocou o ${descricao.split('—')[0].trim()} na [${ordem.nome}]!`, true);
        this.shadowCore._salvarBancoDeDados();

        return { sucesso: true, rito: this.ritosAtivos[ordem.id], descricao, relato: descricao };
    }

    obterRitoAtivo(ordemId) {
        const rito = this.ritosAtivos[ordemId];
        if (!rito) return { ativo: false };
        if (Date.now() > rito.iniciadoEm + rito.duracaoMs) {
            delete this.ritosAtivos[ordemId];
            return { ativo: false, expirado: true };
        }
        return { ativo: true, rito, tempoRestanteMs: (rito.iniciadoEm + rito.duracaoMs) - Date.now() };
    }

    // ==========================================
    // MATRIZ MÁGICA EXCLUSIVA DA ORDEM (IA GUIA)
    // O coração do novo sistema: a IA canaliza a intenção do jogador,
    // extrai essência dos grimórios e injeta nós autoritativos na Matriz.
    // ==========================================
    async canalizarMagiaParaOrdem(vampiroParam, dadosRito = {}) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Vampiro não encontrado." };
        if (!vampiro.ordemId || !this.ordens[vampiro.ordemId]) return { erro: "Sem Ordem." };
        const ordem = this.ordens[vampiro.ordemId];
        const membro = ordem.membros[vampiro.id];
        if (!membro || membro.grau < 3) return { erro: "Grau 3° (Practicus) necessário para canalizar na Matriz." };

        const tradicaoKey = dadosRito.tradicao || 'hermetismo';
        const tradicao = TRADICOES_ANCESTRAIS[tradicaoKey];
        if (!tradicao) return { erro: `Tradição "${tradicaoKey}" desconhecida. Opções: ${Object.keys(TRADICOES_ANCESTRAIS).join(', ')}` };

        const intencao = (dadosRito.intencao || '').trim();
        if (!intencao || intencao.length < 10) return { erro: "A intenção mística deve ter pelo menos 10 caracteres." };

        const vinculoTipo = dadosRito.vinculoTipo || 'ressonancia';
        if (!VINCULOS_MAGICOS[vinculoTipo]) return { erro: `Vínculo "${vinculoTipo}" inválido. Opções: ${Object.keys(VINCULOS_MAGICOS).join(', ')}` };

        // Verificar Tier do Santuário para Alta Magia
        if (['maldicao_carmica', 'territorio_sagrado'].includes(vinculoTipo) && (ordem.santuarioTier || 1) < 4) {
            return { erro: `Nós de ${VINCULOS_MAGICOS[vinculoTipo].nome} exigem Sanctum Sanctorum Salomônico (Tier 4+).` };
        }

        // Custos: da Egrégora
        const custoVitae = 1500 + (membro.grau * 200);
        if ((ordem.egregora.vitae || 0) < custoVitae) return { erro: `Egrégora precisa de ${custoVitae} Vitae.` };
        ordem.egregora.vitae -= custoVitae;

        // Limite de nós por Tier
        const maxNos = (ordem.santuarioTier || 1) * 3 + 2; // Tier 1: 5, Tier 5: 17
        const nosAtuais = Object.keys(ordem.matrizMagica || {}).length;
        if (nosAtuais >= maxNos) return { erro: `A Matriz atingiu ${maxNos} nós (limite do Tier ${ordem.santuarioTier}). Evolua o Santuário.` };

        // IA Guia: Consultar Oráculo para gerar o nó
        let noGerado = {};
        try {
            const prompt = `Gera um nó mágico para a Matriz Oculta de uma Ordem vampírica. Tradição: ${tradicao.nome} (${tradicao.grimorio}). Intenção do adepto: "${intencao}". Tipo de vínculo: ${VINCULOS_MAGICOS[vinculoTipo].nome}. Gera um JSON com: {"nomeMagico": "nome esotérico do nó", "descricao": "descrição mística de 1-2 frases", "sigiloEnochiano": "3-5 chars de glifos", "poderBase": número_50_a_300, "efeitoTexto": "descrição do efeito no jogo"}`;
            const resIA = await this.shadowCore.oraculo.consultarOraculo(vampiro, prompt);
            try {
                const jsonMatch = resIA.texto.match(/\{[\s\S]*\}/);
                if (jsonMatch) noGerado = JSON.parse(jsonMatch[0]);
            } catch (e) { /* fallback */ }
        } catch (e) { /* fallback */ }

        // Fallback robusto
        if (!noGerado.nomeMagico) {
            const nomesFallback = {
                alquimia: "Pedra Filosofal Sanguínea",
                protecao_santuario: "Escudo Seráfico de Metatron",
                dreno_cosmico: "Sifão de Lilith Noturna",
                manto_astral: "Manto de Choronzon Invertido",
                ressonancia: "Harmonia das Esferas de Pitágoras",
                territorio_sagrado: "Selo Territorial de Salomão",
                maldicao_carmica: "Marca de Caim Primordial",
                cura_egregora: "Bálsamo da Rosa-Cruz"
            };
            noGerado = {
                nomeMagico: nomesFallback[vinculoTipo] || `Nó de ${tradicao.nome}`,
                descricao: `Canalização de ${tradicao.nome} para ${VINCULOS_MAGICOS[vinculoTipo].nome}, forjada pela vontade do adepto.`,
                sigiloEnochiano: tradicao.sigiloBase + crypto.randomBytes(2).toString('hex').toUpperCase(),
                poderBase: 80 + (membro.grau * 15),
                efeitoTexto: VINCULOS_MAGICOS[vinculoTipo].efeito
            };
        }

        // Construir o nó autoritativo
        const noId = "no_" + crypto.randomBytes(4).toString('hex');
        const novoNo = {
            id: noId,
            nomeMagico: noGerado.nomeMagico,
            descricao: noGerado.descricao || intencao,
            tradicao: tradicaoKey,
            tradicaoNome: tradicao.nome,
            grimorioOrigem: tradicao.grimorio,
            vinculoTipo,
            vinculoNome: VINCULOS_MAGICOS[vinculoTipo].nome,
            vinculoIcone: VINCULOS_MAGICOS[vinculoTipo].icone,
            vinculoCor: VINCULOS_MAGICOS[vinculoTipo].cor,
            efeitoTexto: noGerado.efeitoTexto || VINCULOS_MAGICOS[vinculoTipo].efeito,
            sigiloEnochiano: noGerado.sigiloEnochiano || tradicao.sigiloBase,
            poderBase: Math.max(50, Math.min(500, parseInt(noGerado.poderBase) || 100)),
            canalizador: vampiro.nome,
            canalizadorId: vampiro.id,
            canalizadoEm: Date.now(),
            ativo: true,
            sintonizados: [vampiro.id], // O canalizador é automaticamente sintonizado
            efeitoAutoritativo: this._gerarEfeitoAutoritativo(vinculoTipo, parseInt(noGerado.poderBase) || 100, ordem.santuarioTier || 1)
        };

        if (!ordem.matrizMagica) ordem.matrizMagica = {};
        ordem.matrizMagica[noId] = novoNo;

        // Bônus ao canalizador
        const gnoseGanha = Math.floor((novoNo.poderBase / 10) + membro.grau * 2);
        if (!vampiro.atributos) vampiro.atributos = {};
        vampiro.atributos.gnose = (vampiro.atributos.gnose || 10) + gnoseGanha;
        this.shadowCore.ganharXP(vampiro.id, novoNo.poderBase * 3);

        this.shadowCore._registrarEventoEspecial('global', 'NÓ MÁGICO CANALIZADO', `[${vampiro.nome}] canalizou [${novoNo.nomeMagico}] na Matriz da [${ordem.nome}]! Tradição: ${tradicao.nome}. Vínculo: ${VINCULOS_MAGICOS[vinculoTipo].icone} ${VINCULOS_MAGICOS[vinculoTipo].nome}.`, true);
        this.shadowCore._salvarBancoDeDados();

        return {
            sucesso: true,
            no: novoNo,
            gnoseGanha,
            relato: `O nó [${novoNo.nomeMagico}] foi gravado na Matriz Oculta da Ordem! ${novoNo.sigiloEnochiano} ${VINCULOS_MAGICOS[vinculoTipo].icone} +${gnoseGanha} Gnose.`
        };
    }

    /**
     * Gera o efeito autoritativo (modificadores matemáticos seguros) baseado no tipo de vínculo
     */
    _gerarEfeitoAutoritativo(vinculoTipo, poderBase, santuarioTier) {
        const mult = 1 + (santuarioTier * 0.1);
        const poder = Math.floor(poderBase * mult);

        switch (vinculoTipo) {
            case 'alquimia': return { tipo: 'bonus_transmutacao', valor: Math.floor(poder * 0.15), descricao: `+${Math.floor(poder * 0.15)}% em transmutações` };
            case 'protecao_santuario': return { tipo: 'reducao_dano', valor: Math.floor(poder * 0.08), descricao: `Reduz ${Math.floor(poder * 0.08)}% dano no território` };
            case 'dreno_cosmico': return { tipo: 'dreno_vitae', valor: Math.floor(poder * 0.5), descricao: `Drena ${Math.floor(poder * 0.5)} Vitae de inimigos derrotados` };
            case 'manto_astral': return { tipo: 'escudo_passivo', valor: Math.floor(poder * 0.3), descricao: `Escudo passivo de ${Math.floor(poder * 0.3)} HP para membros` };
            case 'ressonancia': return { tipo: 'bonus_dano_magico', valor: Math.floor(poder * 0.12), descricao: `+${Math.floor(poder * 0.12)}% dano mágico` };
            case 'territorio_sagrado': return { tipo: 'zona_protegida', raio: Math.max(3, Math.floor(poder / 30)), descricao: `Zona protegida de raio ${Math.max(3, Math.floor(poder / 30))} no mapa 2D` };
            case 'maldicao_carmica': return { tipo: 'debuff_herege', valor: Math.floor(poder * 0.10), descricao: `Hereges sofrem -${Math.floor(poder * 0.10)}% em todos os atributos` };
            case 'cura_egregora': return { tipo: 'regen_passivo', valor: Math.floor(poder * 0.4), descricao: `Regenera ${Math.floor(poder * 0.4)} HP/min para membros sintonizados` };
            default: return { tipo: 'generico', valor: poder, descricao: `Efeito genérico de poder ${poder}` };
        }
    }

    /**
     * Sintonizar um membro com um nó da Matriz para receber seus efeitos
     */
    sintonizarNo(vampiroParam, noId) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Vampiro não encontrado." };
        if (!vampiro.ordemId || !this.ordens[vampiro.ordemId]) return { erro: "Sem Ordem." };
        const ordem = this.ordens[vampiro.ordemId];
        if (!ordem.membros[vampiro.id]) return { erro: "Não és membro." };

        const no = ordem.matrizMagica?.[noId];
        if (!no) return { erro: "Nó mágico não encontrado na Matriz." };
        if (!no.ativo) return { erro: "Este nó está inativo." };

        if (!no.sintonizados) no.sintonizados = [];
        if (no.sintonizados.includes(vampiro.id)) return { erro: "Já estás sintonizado com este nó." };

        // Limite de sintonizações por vampiro: grau + 2
        const grauMembro = ordem.membros[vampiro.id].grau || 0;
        const maxSintonizacoes = grauMembro + 2;
        let sintonizacoesAtuais = 0;
        for (const n of Object.values(ordem.matrizMagica || {})) {
            if (n.sintonizados?.includes(vampiro.id)) sintonizacoesAtuais++;
        }
        if (sintonizacoesAtuais >= maxSintonizacoes) return { erro: `Limite de ${maxSintonizacoes} sintonizações (Grau ${grauMembro}°). Dessintroniza outro nó primeiro.` };

        no.sintonizados.push(vampiro.id);

        // Aplicar efeito imediato se aplicável
        if (no.efeitoAutoritativo?.tipo === 'escudo_passivo') {
            vampiro.escudoAstral = (vampiro.escudoAstral || 0) + (no.efeitoAutoritativo.valor || 0);
        }

        this.shadowCore._salvarBancoDeDados();
        return {
            sucesso: true,
            no,
            relato: `Sintonizado com [${no.nomeMagico}]! ${no.vinculoIcone} ${no.efeitoAutoritativo?.descricao || no.efeitoTexto}`
        };
    }

    /**
     * Obter a Matriz Mágica completa de uma Ordem
     */
    obterMatriz(ordemId) {
        const ordem = this.ordens[ordemId];
        if (!ordem) return { erro: "Ordem não encontrada." };
        return {
            sucesso: true,
            ordemNome: ordem.nome,
            santuarioTier: ordem.santuarioTier || 1,
            maxNos: (ordem.santuarioTier || 1) * 3 + 2,
            nosAtuais: Object.keys(ordem.matrizMagica || {}).length,
            matriz: ordem.matrizMagica || {},
            nos: Object.values(ordem.matrizMagica || {}),
            tradicoesDisponiveis: TRADICOES_ANCESTRAIS,
            vinculosDisponiveis: VINCULOS_MAGICOS
        };
    }

    /**
     * Obter os efeitos ativos de todos os nós sintonizados por um vampiro
     */
    obterEfeitosAtivos(vampiroId) {
        const vampiro = this._resolverVampiro(vampiroId);
        if (!vampiro || !vampiro.ordemId) return { efeitos: [], totalPoder: 0 };
        const ordem = this.ordens[vampiro.ordemId];
        if (!ordem) return { efeitos: [], totalPoder: 0 };

        const efeitos = [];
        let totalPoder = 0;
        for (const no of Object.values(ordem.matrizMagica || {})) {
            if (no.ativo && no.sintonizados?.includes(vampiro.id || vampiroId)) {
                efeitos.push({
                    noId: no.id,
                    nomeMagico: no.nomeMagico,
                    vinculo: no.vinculoNome,
                    icone: no.vinculoIcone,
                    efeito: no.efeitoAutoritativo
                });
                totalPoder += no.poderBase || 0;
            }
        }

        // Incluir efeito do rito coletivo ativo (se houver)
        const rito = this.obterRitoAtivo(ordem.id);
        if (rito.ativo) {
            efeitos.push({
                noId: 'rito_coletivo',
                nomeMagico: `Rito: ${rito.rito.tipo.replace(/_/g, ' ')}`,
                vinculo: 'Rito Coletivo',
                icone: '🔮',
                efeito: rito.rito.efeitos
            });
        }

        return { efeitos, totalPoder };
    }

    // ==========================================
    // BIBLIOTECA OCULTA DE TESES & ESTUDOS VIVOS
    // ==========================================
    async submeterTese(vampiroParam, dadosOuTitulo, esferaParam, corpoTextoParam) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Autor não encontrado." };
        let dados = dadosOuTitulo;
        if (typeof dadosOuTitulo === 'string') {
            dados = { titulo: dadosOuTitulo, tema: esferaParam || "Hermetismo", conteudo: corpoTextoParam || "" };
        }
        const titulo = (dados.titulo || '').trim();
        const tema = (dados.tema || '').trim();
        const conteudo = (dados.conteudo || '').trim();

        if (!titulo || !tema || conteudo.length < 50) return { erro: "Título, Tema e pelo menos 50 chars de reflexão." };

        const custoGts = 500;
        if ((vampiro.sangue || 0) < custoGts) return { erro: `Exige ${custoGts} Gts.` };
        vampiro.sangue -= custoGts;

        // Bônus do Chanceler dos Livros
        let bonusChancel = 0;
        if (vampiro.ordemId && this.ordens[vampiro.ordemId]) {
            const ordem = this.ordens[vampiro.ordemId];
            const membro = ordem.membros[vampiro.id];
            if (membro?.cargo === 'chanceler_livros') bonusChancel = 15;
            // Bônus do tier do santuário
            const tierInfo = SANTUARIO_TIERS[(ordem.santuarioTier || 1) - 1];
            if (tierInfo?.bonus?.gnoseEstudoBonus) bonusChancel += Math.floor(tierInfo.bonus.gnoseEstudoBonus * 100);
        }

        const avaliacao = await this.shadowCore.oraculo.avaliarEstudoAkashico(vampiro, titulo, conteudo, tema);
        const nota = Math.min(100, (avaliacao.nota || 70) + bonusChancel);
        const gnoseGanha = Math.max(5, Math.floor(nota / 5));
        const xpGanho = Math.max(100, Math.floor(nota * 6));

        const tomoId = "tomo_" + crypto.randomBytes(4).toString('hex');
        const novoTomo = {
            id: tomoId, titulo, autor: vampiro.nome, autorId: vampiro.id,
            ordemId: vampiro.ordemId || null, tema,
            notaAkashica: nota, gnoseConcedida: gnoseGanha, xpEstudo: xpGanho,
            conteudo: conteudo + (avaliacao.texto ? `\n\n[GLOSA DO ORÁCULO]: ${avaliacao.texto}` : ''),
            dataPublicacao: new Date().toISOString(), estudantes: [vampiro.id]
        };

        this.bibliotecaTomos.unshift(novoTomo);
        if (this.bibliotecaTomos.length > 50) this.bibliotecaTomos.pop();

        this.shadowCore.ganharXP(vampiro.id, xpGanho);
        if (!vampiro.atributos) vampiro.atributos = {};
        vampiro.atributos.gnose = (vampiro.atributos.gnose || 10) + gnoseGanha;

        this.shadowCore._registrarEventoEspecial('global', 'TOMO SAGRADO', `"${titulo}" de [${vampiro.nome}]! Nota: ${nota}/100 (+${gnoseGanha} Gnose)!`, true);
        this.shadowCore._salvarBancoDeDados();

        return { sucesso: true, tomo: novoTomo, nota, gnoseGanha, relato: `Tese aprovada! Nota ${nota}/100. +${gnoseGanha} Gnose, +${xpGanho} XP.` };
    }

    estudarTomo(vampiroParam, tomoId) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Estudante não encontrado." };
        const tomo = this.bibliotecaTomos.find(t => t.id === tomoId);
        if (!tomo) return { erro: "Tomo não encontrado." };
        if (!tomo.estudantes) tomo.estudantes = [];
        if (tomo.estudantes.includes(vampiro.id)) return { erro: "Já assimilaste este tomo." };
        if ((vampiro.pontosAcao || 0) < 2) return { erro: "Exige 2 Fúria." };
        vampiro.pontosAcao -= 2;

        tomo.estudantes.push(vampiro.id);

        // Bônus do santuário
        let bonusMult = 1;
        if (vampiro.ordemId && this.ordens[vampiro.ordemId]) {
            const tierInfo = SANTUARIO_TIERS[(this.ordens[vampiro.ordemId].santuarioTier || 1) - 1];
            if (tierInfo?.bonus?.gnoseEstudoBonus) bonusMult += tierInfo.bonus.gnoseEstudoBonus;
        }

        const ganhoXp = Math.floor(tomo.xpEstudo * 0.5 * bonusMult);
        const ganhoGnose = Math.max(1, Math.floor(tomo.gnoseConcedida * 0.4 * bonusMult));

        this.shadowCore.ganharXP(vampiro.id, ganhoXp);
        if (!vampiro.atributos) vampiro.atributos = {};
        vampiro.atributos.gnose = (vampiro.atributos.gnose || 10) + ganhoGnose;
        this.shadowCore._salvarBancoDeDados();

        return { sucesso: true, relato: `Estudaste [${tomo.titulo}]! +${ganhoGnose} Gnose, +${ganhoXp} XP.` };
    }

    // ==========================================
    // FORJA E REGISTRO DE MAGIA EM CÓDIGO (Legado — mantido para compatibilidade)
    // ==========================================
    forjarFeiticoEmCodigo(vampiroParam, dados = {}) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Criador não encontrado." };
        const nome = (dados.nome || '').trim();
        const formula = (dados.codigoFormula || '').trim();
        if (!nome || !formula) return { erro: "Nome e Fórmula obrigatórios." };
        const validacao = this.codeEngine.validarFormula(formula);
        if (!validacao.valida) return { erro: `Sintaxe Arcana: ${validacao.erro}` };

        const custoGts = 1500;
        if ((vampiro.sangue || 0) < custoGts) return { erro: `Exige ${custoGts} Gts.` };
        vampiro.sangue -= custoGts;

        const feiticoId = "magcode_" + crypto.randomBytes(4).toString('hex');
        const novoFeitico = {
            id: feiticoId, nome, desc: dados.desc || "Feitiço vivo.", codigoFormula: formula,
            criadorId: vampiro.id, criadorNome: vampiro.nome, ordemId: vampiro.ordemId || null,
            custoSangue: parseInt(dados.custoSangue) || 400, custoFuria: parseInt(dados.custoFuria) || 3,
            icone: dados.icone || "⚡", usosTotais: 0, criadoEm: Date.now()
        };

        this.feitiçosEmCodigo[feiticoId] = novoFeitico;
        if (!vampiro.magiasEmCodigo) vampiro.magiasEmCodigo = [];
        vampiro.magiasEmCodigo.push(feiticoId);

        this.shadowCore._registrarEventoEspecial('global', 'MAGIA EM CÓDIGO', `[${vampiro.nome}] forjou [${novoFeitico.nome}]!`, true);
        this.shadowCore._salvarBancoDeDados();
        return { sucesso: true, feitico: novoFeitico, relato: `Feitiço [${novoFeitico.nome}] forjado!` };
    }

    async conjurarFeiticoEmCodigo(vampiroParam, feiticoId, contexto = {}) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Invocador não encontrado." };
        const feitico = this.feitiçosEmCodigo[feiticoId];
        if (!feitico) return { erro: "Feitiço não registrado." };
        const resultado = await this.codeEngine.executarFormula(feitico, vampiro, contexto);
        this.shadowCore._salvarBancoDeDados();
        return resultado;
    }

    listarBiblioteca(esfera = null) {
        if (esfera) return this.bibliotecaTomos.filter(t => t.tema === esfera || t.esfera === esfera);
        return this.bibliotecaTomos;
    }

    listarOrdens() {
        return Object.values(this.ordens).map(o => ({
            id: o.id, nome: o.nome, lema: o.lema, sigilo: o.sigilo,
            santuarioNome: o.santuarioNome || o.santuario, santuarioTier: o.santuarioTier || 1,
            fundadorNome: o.fundadorNome,
            membrosQtd: Object.keys(o.membros || {}).length,
            egregoraPoder: o.egregora?.poderTotal || 0,
            decretosQtd: (o.decretosAtivos || []).length,
            nosMatriz: Object.keys(o.matrizMagica || {}).length,
            ritosRealizados: o.ritosRealizados || 0
        }));
    }

    listarFeiticos(vampiroId = null) {
        if (!vampiroId) return Object.values(this.feitiçosEmCodigo);
        return Object.values(this.feitiçosEmCodigo).filter(f => f.criadorId === vampiroId);
    }

    // ==========================================
    // PERSISTÊNCIA
    // ==========================================
    salvarEstado() {
        return {
            ordens: this.ordens,
            bibliotecaTomos: this.bibliotecaTomos,
            feitiçosEmCodigo: this.feitiçosEmCodigo,
            anomalias2D: this.anomalias2D,
            provacoesAtivas: this.provacoesAtivas,
            ritosAtivos: this.ritosAtivos
        };
    }

    carregarEstado(dados = {}) {
        if (dados.ordens) this.ordens = dados.ordens;
        if (dados.bibliotecaTomos) this.bibliotecaTomos = dados.bibliotecaTomos;
        if (dados.feitiçosEmCodigo) this.feitiçosEmCodigo = dados.feitiçosEmCodigo;
        if (dados.anomalias2D) this.anomalias2D = dados.anomalias2D;
        if (dados.provacoesAtivas) this.provacoesAtivas = dados.provacoesAtivas;
        if (dados.ritosAtivos) this.ritosAtivos = dados.ritosAtivos;
    }
}

module.exports = {
    OrdemMagicaCore,
    CodeMagicEngine,
    GRAUS_INICIATICOS,
    SANTUARIO_TIERS,
    CARGOS_CONSELHO,
    TRADICOES_ANCESTRAIS,
    VINCULOS_MAGICOS
};

