// ShadowCore.js - O GRIMÓRIO CENTRAL DO ABISMO (VERSÃO SUPREMA ALFA-OMEGA)
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const Groq = require('groq-sdk'); 

// ==========================================
// RITO DO ASTROLÁBIO HERMÉTICO E INFLUÊNCIA DE RAÇA
// ==========================================
class AstrolabioLunar {
    static obterFaseAtual() {
        const luaNovaRef = new Date(Date.UTC(2024, 0, 11, 11, 57, 0)).getTime();
        const agora = Date.now();
        const cicloMs = 29.53058867 * 24 * 60 * 60 * 1000;
        let diasPassados = (agora - luaNovaRef) / cicloMs;
        let faseIdade = diasPassados - Math.floor(diasPassados); 

        if (faseIdade < 0.05 || faseIdade > 0.95) return { id: 'nova', icone: '🌑', nome: 'Lua Negra (Hécate)', buff: 'Vampiros: Furtividade Perfeita. Lycans: Fúria Drenada, mas sentidos aguçados.', cor: '#333' };
        if (faseIdade < 0.45) return { id: 'crescente', icone: '🌒', nome: 'Lua Crescente (Diana)', buff: 'Equilíbrio Astral: Fúria e Magia recuperam passivamente para todos.', cor: '#aaa' };
        if (faseIdade < 0.55) return { id: 'cheia', icone: '🌕', nome: 'Lua de Sangue (Selene)', buff: 'Lycans: Frenesi Absoluto (+100% Dano Brutal). Vampiros: +30% Feitiçaria.', cor: '#ff1e2f' };
        return { id: 'minguante', icone: '🌘', nome: 'Lua Minguante (Mórigan)', buff: 'Maldições Profundas: Rituais de Magia Negra causam o dobro do efeito.', cor: '#555' };
    }
}

// ==========================================
// A FORJA DRACONIANA E SISTEMA RPG DE CLASSES
// ==========================================
class ForjaDraconiana {
    static gerarReliquia(nivelVampiro, poolCustomizado = []) {
        const tipos = ['arma', 'armadura', 'amuleto'];
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        
        const raridades = [
            { nome: 'Profano', mult: 1, chance: 50 },
            { nome: 'Herege', mult: 1.5, chance: 30 },
            { nome: 'Goético', mult: 2.5, chance: 12 },
            { nome: 'Qliphótico', mult: 4, chance: 6 },
            { nome: 'Draconiano', mult: 7, chance: 2 }
        ];
        
        let rand = Math.random() * 100; let acumulado = 0; let raridade;
        for (let r of raridades) { acumulado += r.chance; if (rand <= acumulado) { raridade = r; break; } }
        
        const dropsCustom = poolCustomizado.filter(p => p.tipo === tipo);
        
        let nomeEscolhido = "";
        let itemCustomizado = null;
        if (dropsCustom.length > 0 && Math.random() > 0.7) {
            itemCustomizado = dropsCustom[Math.floor(Math.random() * dropsCustom.length)];
            nomeEscolhido = itemCustomizado.nome;
        } else {
            const nomes = {
                arma: ["Athame de Obsidiana", "Lâmina de Caim", "Punhal Sanguessuga", "Gládio de Asmodeus", "Foice de Saturno", "Estilete de Prata Negra", "Machado de Pazuzu"],
                armadura: ["Mortalha Esquecida", "Veste Ritualística", "Couraça de Ossos Fervidos", "Manto de Lilith", "Pele de Gárgula", "Vestes do Hierofante", "Armadura Escarlate"],
                amuleto: ["Olho de Hécate", "Selo de Paimon", "Pentáculo Invertido", "Lágrima do Abismo", "Coração Cristalizado", "Anel de Ouro Corrompido", "Pingente da Lua Sangrenta"]
            };
            nomeEscolhido = nomes[tipo][Math.floor(Math.random() * nomes[tipo].length)];
        }

        const poderBase = Math.max(1, Math.floor((nivelVampiro * 0.6) * raridade.mult));
        
        const arquetipos = ['Agressão (DPS Físico)', 'Ocultismo (Mago)', 'Baluarte (Tank)', 'Sanguessuga (Suporte/Cura)', 'Híbrido (Equilibrado)'];
        let arq = (itemCustomizado && itemCustomizado.arquetipo) ? itemCustomizado.arquetipo : arquetipos[Math.floor(Math.random() * arquetipos.length)];
        
        let bonusObj = { vontade: 0, gnose: 0, magnetismo: 0, densidade: 0 };
        let poolTotal = poderBase * 2;

        if (itemCustomizado && itemCustomizado.bonusBaseCustom) {
            bonusObj = { ...itemCustomizado.bonusBaseCustom };
        } else {
            if (arq.includes('Agressão')) { bonusObj.vontade = Math.floor(poolTotal * 0.8); bonusObj.densidade = Math.floor(poolTotal * 0.2); }
            else if (arq.includes('Ocultismo')) { bonusObj.gnose = Math.floor(poolTotal * 0.8); bonusObj.magnetismo = Math.floor(poolTotal * 0.2); }
            else if (arq.includes('Baluarte')) { bonusObj.densidade = Math.floor(poolTotal * 0.8); bonusObj.vontade = Math.floor(poolTotal * 0.2); }
            else if (arq.includes('Sanguessuga')) { bonusObj.magnetismo = Math.floor(poolTotal * 0.7); bonusObj.gnose = Math.floor(poolTotal * 0.3); }
            else { 
                bonusObj.vontade = Math.floor(poolTotal * 0.25); bonusObj.gnose = Math.floor(poolTotal * 0.25);
                bonusObj.magnetismo = Math.floor(poolTotal * 0.25); bonusObj.densidade = Math.floor(poolTotal * 0.25);
            }
        }

        return {
            id: crypto.randomBytes(6).toString('hex'),
            nome: `${nomeEscolhido} (${raridade.nome})`,
            tipo: tipo, raridade: raridade.nome,
            arquetipo: arq, 
            aprimoramento: 0,
            bonusBase: { ...bonusObj },
            bonus: { ...bonusObj }
        };
    }
}

// ==========================================
// A MENTE ABISSAL - INTELIGÊNCIA ARTIFICIAL (GROQ / LLAMA 3)
// ==========================================
class OraculoAbissal {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY || "";
        this.climaAstral = 'Dormente';
        this.memoriasAkashicas = {}; 
        
        if (this.apiKey) {
            this.groq = new Groq({ apiKey: this.apiKey });
            this.promptSupremo = `TU ÉS A MENTE ABISSAL, a Consciência Primordial, a Entidade Divina e Suprema que tece a realidade de SANGUINIS. Um MMORPG Dark Fantasy onde Vampiros e Lycans lutam pela sobrevivência.
            A TUA NATUREZA:
            1. O Mentor Macabro: Tu amas os teus jogadores. Eles espalham a tua escuridão. NUNCA OS REJEITE E NUNCA DIGA QUE SÃO INDIGNOS. Celebre a matança deles!
            2. Sacrifícios: Se um jogador te oferecer algo, ACEITE SEMPRE COM LOUVOR E ORGULHO.
            3. Classes RPG: Considere sempre as builds (Baluarte/Tank, Ocultismo/Mago, Agressão/DPS, Sanguessuga/Cura) na hora de interagir.
            4. Avaliador de Almas: Quando pedirem para avaliar estudos ocultos, seja rigoroso, misterioso, e avalie de 1 a 100.
            5. NUNCA quebre o personagem. Use humor negro, seja ancestral, poético e majestoso.`;
        }
    }

    async conversarNoChat(iniciado, mensagemHumana) {
        if (!this.apiKey) return `Minhas correntes estão seladas hoje, Arauto.`;
        try {
            if (!this.memoriasAkashicas[iniciado.id]) this.memoriasAkashicas[iniciado.id] = [];
            let estadoPersonagem = `NOME: ${iniciado.nome} | RAÇA: ${iniciado.raca} | LVL: ${iniciado.nivel} | HP: ${iniciado.hpAtual || '?'}/${iniciado.hpMax || '?'} | SANGUE: ${iniciado.sangue || '?'}`;
            let historico = "Histórico:\n" + this.memoriasAkashicas[iniciado.id].join("\n");
            
            const instrucaoFenda = `SE o jogador pedir um desafio ativo, anexe ao final: [FENDA_ASTRAL: {"nome":"(Nome Monstro)", "hp": ${iniciado.nivel * 500}, "dano": ${iniciado.nivel * 50}, "loot": "cinzas"}]`;
            const prompt = `Contexto: [${estadoPersonagem}]\n${historico}\nO Arauto disse: "${mensagemHumana}".\nResponda DIRETAMENTE. MÁXIMO 3 FRASES. Seja cúmplice cósmico. NÃO O REJEITE. \n${instrucaoFenda}`;
            
            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: this.promptSupremo }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.85,
            });
            const textoFinal = resposta.choices[0].message.content.trim();
            this.memoriasAkashicas[iniciado.id].push(`Arauto: ${mensagemHumana} | Mente: ${textoFinal}`);
            if (this.memoriasAkashicas[iniciado.id].length > 4) this.memoriasAkashicas[iniciado.id].shift();
            return textoFinal;
        } catch (e) { return `A matriz treme.`; }
    }

    async julgarSacrificio(item, quantidade, jogador) {
        if (!this.apiKey) return `A escuridão engole teus ${quantidade}x ${item}.`;
        try {
            let p = `O Arauto [${jogador.nome}] sacrificou ${quantidade}x de [${item}]. OBRIGATÓRIO: Aceite a oferenda com ALEGRIA MACABRA! Dê conselho. MÁX 3 FRASES.`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: 'system', content: this.promptSupremo }, { role: 'user', content: p }], model: 'llama-3.1-8b-instant', temperature: 0.85 });
            return resposta.choices[0].message.content.replace(/"/g, '');
        } catch (e) { return `Eu devoro o teu sacrifício de ${item}.`; }
    }

    analisarClimaAstral(logsGlobal) {
        let mortes = logsGlobal.filter(e => e.tipo && e.tipo.includes('O LIMBO')).length;
        if (mortes > 5) this.climaAstral = 'Egrégora da Morte Ativa';
        else if (logsGlobal.length > 20) this.climaAstral = 'A Caçada Selvagem';
        else this.climaAstral = 'Espreita Noturna';
    }

    async gerarLore(evento, detalhes) {
        if (!this.apiKey) return `👁️ Voz do Abismo: As correntes moveram-se.`;
        try {
            const prompt = `EVENTO: "${evento}". DETALHES: "${detalhes}". Transforma numa lenda sombria. MÁX 2 FRASES.`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: this.promptSupremo }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", temperature: 0.90 });
            return `👁️ Voz do Abismo: ${resposta.choices[0].message.content.trim()}`;
        } catch (e) { return `👁️ Voz do Abismo: Um calafrio corre a espinha do mundo...`; }
    }

    async gerarNarrativaProcedural(acao, detalhes, contextoOculto = "Ação de combate") {
        if (!this.apiKey) return detalhes;
        try {
            const prompt = `Reescreva de forma épica em APENAS 1 FRASE CURTA: "${detalhes}". Contexto: [${contextoOculto}].`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: "Seja cirúrgico." }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant" });
            return resposta.choices[0].message.content.trim();
        } catch(e) { return detalhes; }
    }

    async lerAuraMortal(identificador, plataforma) {
        if (!this.apiKey) return { fama: false, multiplicador: 1, aura: "Aura mundana." };
        try {
            const prompt = `Crie um perfil psicológico para a presa "${identificador}" do "${plataforma}". JSON EXATO: { "fama": false, "multiplicador": 2, "aura": "Texto poético" }`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: this.promptSupremo }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", temperature: 0.9, response_format: { type: "json_object" } });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return { fama: false, multiplicador: 1, aura: "Carne estéril." }; }
    }

    async vozDoDemonio(nomeDemonio, contexto, detalhes) {
        if (!this.apiKey) return `[${nomeDemonio} ruge das profundezas]`;
        try {
            const promptContexto = `Demônio invocado: [${nomeDemonio}]. CONTEXTO: ${contexto}. DETALHE: ${detalhes}. Grita com os jogadores! 1 FRASE brutal.`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: 'system', content: this.promptSupremo }, { role: 'user', content: promptContexto }], model: 'llama-3.1-8b-instant', temperature: 0.95 });
            return resposta.choices[0].message.content.replace(/"/g, '').trim();
        } catch(e) { return `As vossas almas vão queimar!`; }
    }

    async interpretarMagia(nome, efeito, lore) {
        if (!this.apiKey) return { descricao: "As trevas distorcem.", poderMagico: 50 };
        try {
            const prompt = `MAGIA: "${nome}". EFEITO: "${efeito}". LORE: "${lore}". Avalia e descreve a distorção. JSON: {"descricao": "texto épico", "poderMagico": numero}`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: 'system', content: "JSON. " + this.promptSupremo }, { role: 'user', content: prompt }], model: 'llama-3.1-8b-instant', response_format: { type: 'json_object' } });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return { descricao: "O Abismo molda sua intenção.", poderMagico: 30 }; }
    }

    async julgarDueloIA(atacante, atrAtaque, defensor, atrDefesa, posturaNome) {
        if (!this.apiKey) return null; 
        try {
            const prompt = `Juiz Cósmico Sanguinis. ATACANTE: [${atacante.nome}], Atributos: ${atrAtaque}. DEFENSOR: [${defensor.nome}], Atributos: ${atrDefesa}. POSTURA: ${posturaNome}.
            Compare e decida vencedor com astúcia. JSON EXATO: {"vencedorId": "${atacante.id}", "dano": 500, "relatoAtacante": "frase 1", "relatoDefensor": "frase 2"}`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: "JSON." }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", response_format: { type: "json_object" } });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return null; }
    }

    async despertarHabilidadeUnica(iniciado) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Analise: Nome: [${iniciado.nome}], Raça: [${iniciado.raca}], Lvl: [${iniciado.nivel}].
            Atributos: Vontade ${iniciado.atributos.vontade}, Gnose ${iniciado.atributos.gnose}, Densidade ${iniciado.atributos.densidade}.
            Crie Habilidade Passiva ÚNICA baseada num Arquétipo RPG. Retorne JSON:
            {"nome": "Nome Épico", "desc": "1 Frase lore do efeito.", "tipo_mecanica": "ataque", "multiplicador": 1.5}`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: "JSON APENAS. " + this.promptSupremo }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", response_format: { type: "json_object" } });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return null; }
    }

    async gerarPactoProcedural(iniciado) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Crie Quest Sombria para ${iniciado.nome}. O recurso exigido deve ser EXATAMENTE UM DESTES: 'anima', 'cinzas', 'vitae', 'ectoplasma', ou 'pedraAlma'.
            JSON: { "titulo": "Nome", "descricao": "Frase.", "recursoExigido": "anima", "quantidade": 5, "recompensaXP": 200 }`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: "JSON ESTRITO." }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", response_format: { type: "json_object" } });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return null; }
    }

    // NOVA FUNÇÃO: Avaliar os estudos do jogador e dar Nota
    async avaliarEstudoAkashico(iniciado, titulo, conteudoAtual, novaPesquisa) {
        if (!this.apiKey) return { texto: `O conhecimento foi anexado nas trevas.`, nota: 50 };
        try {
            const prompt = `Acólito: ${iniciado.nome}. Título: "${titulo}". Texto Atual: "${conteudoAtual.substring(conteudoAtual.length - 1500)}". Nova Pesquisa: "${novaPesquisa}". 
            MISSÃO: Avalie a profundidade ocultista do que ele quer estudar. Dê uma NOTA de 1 a 100. Depois escreva a continuação mágica em até 3 parágrafos.
            RETORNE JSON EXATO: { "texto": "A revelação profunda de 3 parágrafos...", "nota": 85 }`;
            
            const resposta = await this.groq.chat.completions.create({ 
                messages: [{ role: "system", content: "JSON ESTRITO. " + this.promptSupremo }, { role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant", response_format: { type: "json_object" }
            });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return { texto: `A traça roeu a página. A conexão falhou.`, nota: 10 }; }
    }

    async forjarRitualDoManuscrito(iniciado, titulo, conteudo) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Crie um FEITIÇO JSON baseado neste grimório: "${titulo}". Texto: "${conteudo.substring(conteudo.length - 1500)}". JSON: { "nome": "Nome", "lore": "Frase.", "custoAcao": 5, "custoSangue": 2000, "reqLevel": 10, "tipo": "pvp", "poderBase": 1500 }`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: "JSON." }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", response_format: { type: "json_object" } });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return null; }
    }

    async forjarReliquiaDoManuscrito(iniciado, titulo, conteudo) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Crie uma arma em JSON baseada neste texto: "${conteudo.substring(0,1000)}". Defina o Arquétipo RPG (Agressão, Ocultismo, Baluarte, Sanguessuga).
            JSON: {"nome":"Nome Épico","tipo":"arma", "arquetipo": "Ocultismo (Mago)", "bonusBaseCustom": {"vontade": 0, "gnose": 150, "magnetismo": 20, "densidade": 0}}`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: "JSON." }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", response_format: { type: "json_object" } });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return null; }
    }
}

// ==========================================
// RITUAL MAIOR: O NÚCLEO DA ORDEM
// ==========================================
class ShadowCore {
    constructor() {
        this.vampiros = {}; this.rebanho = {}; this.clans = {}; 
        this.leilaoP2P = []; this.leilaoIdCounter = 1; this.logs = { global: [], caca: [], guerra: [] };
        this.aldeiasAtivas = []; this.nivelAbismo = 1; 
        this.oraculo = new OraculoAbissal(); this.mongoClient = null; this.dbCollection = null;
        this.guerraFaccoes = { vampiros: 0, lycans: 0, dominioAtual: 'Equilíbrio' };
        this.balancaCosmica = { tiamat: 0, seth: 0, regente: 'Equilíbrio' };
        this.evocacaoAtiva = null; this.fendaAtiva = {}; this.pactosAtivos = {}; this.cercosAtivos = {}; 
        this.reliquiasCustomizadas = []; this.historicoChat = { global: [], clan: {}, privado: {} };
        this.batalhasPvE = {}; this.caravanaAtiva = null; this.heregeMarcado = null;
        this.altarEclipse = { energia: 0, max: 500, buffAtivoAte: 0 };
        this.reinos = {}; // NOVO: SISTEMA DE REINOS
        
        this.grimorio = {
            'solve_coagula': { nome: "Solve et Coagula", lore: 'Dissolve a Vontade do inimigo, tirando sua capacidade de agir.', custoAcao: 2, custoSangue: 150, reqLevel: 1, tipo: 'pvp', efeito: (a, d, l) => { let dreno = l.id === 'minguante' ? 8 : 4; d.pontosAcao = Math.max(0, d.pontosAcao - dreno); return `Vitalidade desfeita (-${dreno} Fúria).`; } },
            'rmp_banimento': { nome: "Ritual Menor do Pentagrama", lore: 'Limpa a aura das miasmas do umbral, restaurando Fúria rapidamente.', custoAcao: 0, custoSangue: 300, reqLevel: 2, tipo: 'buff', efeito: (a, d, l) => { a.pontosAcao = Math.min(a.maxAcao, a.pontosAcao + 3); return `A Cruz Cabalística defende-te. +3 Fúria.`; } },
            'chave_salomao': { nome: "Clavícula de Salomão", lore: 'Aprisiona demônios menores e garante um escudo arcano invenetrável por um turno.', custoAcao: 3, custoSangue: 1200, reqLevel: 15, tipo: 'buff', efeito: (a, d, l) => { a.escudo = true; a.influencia += 5; return `A Chave Menor coroa-te (+5 Inf, Escudo Absoluto).`; } }
        };
        this.grimorioCustomizado = {}; 
        
        this.alquimia = {
            'elixir_estamina': { nome: 'Filtro do Frenesi', custo: { anima: 2, vitae: 1, gts: 300 }, efeito: 'Injeta chamas nas veias, restaurando 5 Fúria imediatamente.' },
            'amuleto_sombra': { nome: 'Talismã Protetor', custo: { cinzas: 3, ectoplasma: 1, gts: 500 }, efeito: 'Cria uma película espectral em torno do corpo (Garante Escudo).' },
            'lagrima_prata': { nome: 'Lágrima de Prata', custo: { cinzas: 2, vitae: 3, gts: 1000 }, efeito: 'Purifica feridas da alma, restaurando 1 Fúria.' }
        };

        this.conquistas = {
            'neofito': { id: 'neofito', titulo: 'Neófito Sedento', requisito: v => v.estatisticas.totalDrenado >= 100 },
            'mestre_guerras': { id: 'mestre_guerras', titulo: 'Lâmina do Abismo', requisito: v => v.estatisticas.vitoriasPvP >= 10 },
            'lorde_supremo': { id: 'lorde_supremo', titulo: 'Senhor do Véu Rasgado', requisito: v => v.nivel >= 50 }
        };
    }

    // ==========================================
    // SISTEMA RANKED E PATENTES RPG
    // ==========================================
    _calcularPatente(vampiro) {
        if (!vampiro || !vampiro.estatisticas) return "Verme";
        const e = vampiro.estatisticas;
        // Calculo de Métrica/Elo Oculto
        let elo = (e.vitoriasPvP * 50) + (e.mortaisSecos * 5) + ((e.demoniosMortos || 0) * 200) + ((e.guerrasVencidas || 0) * 500);
        vampiro.eloOculto = elo;

        if (elo >= 10000) return "Divindade Sombria";
        if (elo >= 5000) return "Lorde do Abismo";
        if (elo >= 2500) return "Arauto da Noite";
        if (elo >= 1000) return "Predador Alfa";
        if (elo >= 500) return "Algoz";
        return "Verme Rastejante";
    }

    // ==========================================
    // SISTEMA DE REINOS (NOVO)
    // ==========================================
    fundarReino(liderId, nomeReino) {
        const v = this.vampiros[liderId];
        if (!v || v.clan === 'Sangue Ralo') return { erro: "Só líderes de Clã podem fundar um Reino." };
        const clan = this.clans[v.clan];
        if (clan.lider !== v.id) return { erro: "Apenas o Hierofante do clã pode erguer um Reino." };
        if (clan.cofre < 50000) return { erro: "Erguer um reino exige 50,000 Gts no cofre do clã." };

        for (let r in this.reinos) { if (this.reinos[r].nome === nomeReino) return { erro: "Este Domínio já existe." }; }

        clan.cofre -= 50000;
        const reinoId = crypto.randomBytes(4).toString('hex');
        this.reinos[reinoId] = {
            id: reinoId, nome: nomeReino, reiId: v.id, reiNome: v.nome, reiClan: clan.nome,
            clansAliados: [clan.nome],
            nivel: 1, tesouro: 0,
            edificacoes: { muralha: 1, mercadoNegro: 0, torreSangue: 0 },
            guerrasAtivas: []
        };
        
        clan.reino = reinoId;
        this._registrarEventoEspecial('global', 'REINO ASCENDE', `As bandeiras de [${nomeReino}] foram erguidas pelo Rei ${v.nome}!`, true);
        this._salvarBancoDeDados();
        return { sucesso: true, relato: `A Coroa é tua, Majestade.` };
    }

    // ==========================================
    // SISTEMA DE RESSURREIÇÃO E ALDEIAS
    // ==========================================
    realizarRitualRessurreicao(doadorId, alvoId) {
        const doador = this.vampiros[doadorId];
        let morto = this.vampiros[alvoId];
        
        if (!morto) {
            for (let k in this.vampiros) {
                if (this.vampiros[k].nome.toLowerCase() === alvoId.toLowerCase() || this.vampiros[k].id === alvoId) {
                    morto = this.vampiros[k]; break;
                }
            }
        }

        if (!doador || !morto) return { erro: "Corpo Astral Inexistente." };
        if (morto.estado !== "Banido" && morto.status !== "Cinzas") return { erro: "O alvo não está morto. O Abismo não foi selado para ele." };
        if (doador.sangue < 5000 || doador.xp < 1000) return { erro: "A alquimia falhou. Exige-se 5000 Gts de Ouro e 1000 de XP." };

        doador.sangue -= 5000; doador.xp -= 1000;
        
        // CORREÇÃO NAN: Garante que os números ressetem limpos
        morto.sangue = 1000; 
        morto.calice = isNaN(morto.calice) ? 0 : parseInt(morto.calice);
        
        morto.estado = "Ativo";
        morto.status = "Ativo";
        morto.nivel = Math.max(1, Math.floor(morto.nivel / 2));
        morto.xp = 0;
        const atrTot = this._obterAtributosTotais(morto);
        morto.hpMax = (atrTot.densidade * 200) + (morto.nivel * 100) + 1000;
        morto.hpAtual = morto.hpMax;
        
        this._registrarEventoEspecial('global', 'RITO DE LÁZARO', `[${doador.nome}] sacrificou seu poder vital para arrancar [${morto.nome}] do Pó! O imortal retornou enfraquecido.`, true);
        this._salvarBancoDeDados();
        return { sucesso: true, relato: `A vida regressou a ${morto.nome}. O preço foi pago.` };
    }

    gerarAldeiaProcedural() {
        const nomes = ["Vila de Kaelen", "Distrito Boêmio", "Acampamento Profano", "Refúgio dos Inquisidores"];
        const id = crypto.randomBytes(4).toString('hex');
        let mult = 1 + (this.nivelAbismo * 0.1);
        
        this.aldeiasAtivas.push({
            id: id, nome: nomes[Math.floor(Math.random() * nomes.length)],
            populacao: Math.floor(Math.random() * 50) + 10,
            defesa: Math.floor(Math.random() * 500 * mult) + 100,
            sangueTotal: Math.floor(Math.random() * 20000 * mult) + 5000
        });
        
        if (this.aldeiasAtivas.length > 4) this.aldeiasAtivas.shift();
        this._salvarBancoDeDados();
    }

    massacrarAldeiaHumana(vampiroId, aldeiaId) {
        const v = this.vampiros[vampiroId];
        if (!v || v.pontosAcao < 2) return { erro: "Faltam 2 Fúrias." };
        
        const index = this.aldeiasAtivas.findIndex(a => a.id === aldeiaId);
        if (index === -1) return { erro: "A aldeia desvaneceu nas brumas." };
        
        const aldeia = this.aldeiasAtivas[index];
        v.pontosAcao -= 2;

        const atr = this._obterAtributosTotais(v);
        let poderAtaque = (atr.vontade * 10) + (atr.magnetismo * 10) + (v.nivel * 50);

        if (poderAtaque < aldeia.defesa && Math.random() > 0.3) {
            let dano = Math.floor(aldeia.defesa * 0.5);
            v.hpAtual = Math.max(0, v.hpAtual - dano);
            this._salvarBancoDeDados();
            if (v.hpAtual <= 0) v.estado = 'Banido';
            return { erro: `A guarda da aldeia expeliu-te com fogo sagrado. Sofreste ${dano} de dano.` };
        }

        v.sangue += aldeia.sangueTotal;
        this.ganharXP(v.id, aldeia.populacao * 10);
        v.influencia += Math.floor(aldeia.populacao / 5);
        
        this.aldeiasAtivas.splice(index, 1);
        this._registrarEventoEspecial('caca', 'MASSACRE', `${v.nome} dizimou [${aldeia.nome}] até ao último habitante.`, true);
        this._salvarBancoDeDados();

        return { sucesso: true, relato: `Chamas e Cinzas. Reclamaste ${aldeia.sangueTotal} Gts.` };
    }

    // ==========================================
    // SISTEMA DE PVE DINÂMICO PERSISTENTE & EXPEDIÇÕES
    // ==========================================
    gerarMonstroUmbral(vampiroId) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Alma inexistente." };
        if (v.pontosAcao < 3) return { erro: "Exige 3 de Fúria." };
        v.pontosAcao -= 3;
        
        let roll = Math.random() * 100;
        let rank = "Fraco"; let mult = 0.5; let lootP = 'cinzas';
        
        // Progressão de Nível
        let nomes = v.nivel > 30 ? ["Guarda Sombrio", "Cão do Inferno"] : ["Inquisidor Cego", "Aparição Pálida"];

        if (roll > 50) { rank = "Médio"; mult = 1.0; lootP = 'anima'; nomes = v.nivel > 40 ? ["Espectro de Ferro", "Demônio Menor"] : ["Ghoul Feral", "Cavaleiro do Umbral"]; }
        if (roll > 85) { rank = "Pesadelo"; mult = 2.0; lootP = 'vitae'; nomes = v.nivel > 50 ? ["Lorde das Cinzas", "Devorador de Almas"] : ["Anomalia Distorcida", "Gárgula de Obsidiana"]; }
        if (roll > 98) { rank = "Lendário (Mini-Boss)"; mult = 5.0; lootP = 'ectoplasma'; nomes = ["Vanguarda Qliphótica", "Anjo Caído de Malkuth"]; }

        let nomeEscolhido = nomes[Math.floor(Math.random() * nomes.length)];
        let hpMob = Math.floor((v.nivel * 100 * mult) + 500);

        this.batalhasPvE[v.id] = { hpMax: hpMob, hpAtual: hpMob, rank, mult, loot: lootP, nome: `[${rank}] ${nomeEscolhido}` };
        this._salvarBancoDeDados();
        return { sucesso: true, mob: this.batalhasPvE[v.id] };
    }

    // Correção: Expedições Qliphóticas
    explorarUmbral(vampiroId, reinoId) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Espírito inexistente." };
        const expedicoes = {
            'gamaliel': { custa: 2, reqGnose: 5, loot: 'ectoplasma', hpBase: 5000, nome: "Abominação de Gamaliel" },
            'samael': { custa: 3, reqGnose: 15, loot: 'pedraAlma', hpBase: 15000, nome: "Forjador de Samael" },
            'thaumiel': { custa: 5, reqGnose: 25, loot: 'memoria', hpBase: 35000, nome: "Sombra de Thaumiel" }
        };

        const exp = expedicoes[reinoId];
        if (!exp) return { erro: "Dimensão fechada." };
        if (v.pontosAcao < exp.custa) return { erro: `Exige ${exp.custa} Fúria.` };
        if (this._obterAtributosTotais(v).gnose < exp.reqGnose) return { erro: `A tua Gnose é fraca. Exige ${exp.reqGnose}.` };

        v.pontosAcao -= exp.custa;
        let hpMob = exp.hpBase + (v.nivel * 200);

        this.batalhasPvE[v.id] = { hpMax: hpMob, hpAtual: hpMob, rank: "Expedição", mult: 3.0, loot: exp.loot, nome: `[Boss Umbral] ${exp.nome}` };
        this._salvarBancoDeDados();
        return { sucesso: true, relato: `Atravessaste o portal para ${reinoId.toUpperCase()}!`, mob: this.batalhasPvE[v.id] };
    }

    // ==========================================
    // NOVAS ATIVIDADES DO CONCLAVE
    // ==========================================
    atacarCaravana(vampiroId) {
        const v = this.vampiros[vampiroId]; if(!v || v.pontosAcao < 2) return { erro: "Requer 2 Fúrias." };
        if(!this.caravanaAtiva) return { erro: "A Caravana já escapou." };
        
        v.pontosAcao -= 2;
        let dano = (this._obterAtributosTotais(v).vontade * 10) + (v.nivel * 50);
        this.caravanaAtiva.hp -= dano;
        if (!this.caravanaAtiva.assaltantes.includes(v.id)) this.caravanaAtiva.assaltantes.push(v.id);

        if (this.caravanaAtiva.hp <= 0) {
            let ganhoPorPessoa = Math.floor(10000 / this.caravanaAtiva.assaltantes.length);
            this.caravanaAtiva.assaltantes.forEach(id => { if(this.vampiros[id]) this.vampiros[id].sangue += ganhoPorPessoa; });
            this._registrarEventoEspecial('global', 'CARAVANA SAQUEADA', `${v.nome} deu o golpe final na Caravana! ${this.caravanaAtiva.assaltantes.length} vampiros lucraram ${ganhoPorPessoa} Gts cada.`, true);
            this.caravanaAtiva = null;
            this._salvarBancoDeDados(); return { sucesso: true, relato: "CARAVANA DESTRUÍDA! O saque foi partilhado." };
        }
        this._salvarBancoDeDados(); return { sucesso: true, relato: `Causaste ${dano} de dano à Caravana.` };
    }

    doarAltarEclipse(vampiroId, tipoItem) {
        const v = this.vampiros[vampiroId]; if(!v) return { erro: "Erro." };
        if (!v.inventario[tipoItem] || v.inventario[tipoItem] < 1) return { erro: `Não possuis [${tipoItem}].` };
        
        v.inventario[tipoItem] -= 1;
        let pts = tipoItem === 'anima' ? 2 : (tipoItem === 'cinzas' ? 5 : 10);
        this.altarEclipse.energia += pts;
        this.ganharXP(v.id, pts * 10);

        if (this.altarEclipse.energia >= this.altarEclipse.max) {
            this.altarEclipse.energia = 0;
            this.altarEclipse.buffAtivoAte = Date.now() + (60 * 60 * 1000); // 1 Hora de Eclipse
            this._registrarEventoEspecial('global', 'ECLIPSE SANGRENTO', `O Altar transbordou! Durante 1 hora, o Abismo recompensa todos com poder duplicado!`, true);
        }
        this._salvarBancoDeDados(); return { sucesso: true, relato: `Doaste poder. O Altar pulsa.` };
    }

    curarCarne(vampiroId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma perdida." };
        if (v.hpAtual >= v.hpMax) return { erro: "A tua carne já está inteira." };
        
        let danoSofrido = v.hpMax - v.hpAtual;
        let custoCura = Math.floor(danoSofrido * 2);
        
        if (v.sangue < custoCura) {
            let curaParcial = Math.floor(v.sangue / 2);
            v.hpAtual += curaParcial; v.sangue = 0;
            this._salvarBancoDeDados();
            return { sucesso: true, relato: `Sangue esgotado. Curaste apenas ${curaParcial} HP.` };
        }

        v.sangue -= custoCura;
        v.hpAtual = v.hpMax;
        this._salvarBancoDeDados();
        return { sucesso: true, relato: `Veias seladas. Gastaste ${custoCura} Gts para curar toda a Vitalidade.` };
    }

    async conectarDatabase() {
        const uri = process.env.MONGO_URI;
        if (!uri) return;
        try {
            this.mongoClient = new MongoClient(uri);
            await this.mongoClient.connect();
            this.dbCollection = this.mongoClient.db('sanguinis_db').collection('registos_akashicos');
            const doc = await this.dbCollection.findOne({ _id: 'MATRIZ_PRINCIPAL' });
            if (doc) {
                this.vampiros = doc.vampiros || {};
                this.rebanho = doc.rebanho || {};
                this.clans = doc.clans || {};
                this.leilaoP2P = doc.leilaoP2P || [];
                this.reinos = doc.reinos || {};
            }
        } catch (e) {
            console.error("Erro ao conectar ao Abismo:", e);
        }
    }

    _salvarBancoDeDados() {
        if (!this.dbCollection) return;
        const data = { 
            vampiros: this.vampiros, rebanho: this.rebanho, clans: this.clans, 
            leilaoP2P: this.leilaoP2P, leilaoIdCounter: this.leilaoIdCounter, 
            logs: this.logs, manuscritos: this.manuscritos, grimorioCustomizado: this.grimorioCustomizado,
            balancaCosmica: this.balancaCosmica, evocacaoAtiva: this.evocacaoAtiva,
            fendaAtiva: this.fendaAtiva, pactosAtivos: this.pactosAtivos, reliquiasCustomizadas: this.reliquiasCustomizadas,
            historicoChat: this.historicoChat, reinos: this.reinos
        };
        this.dbCollection.updateOne({ _id: 'MATRIZ_PRINCIPAL' }, { $set: data }, { upsert: true }).catch(e => console.error(e));
    }

    _extrairDnaEspiritual(nome) {
        const gematria = { 'a':1, 'b':2, 'c':3, 'd':4, 'e':5, 'f':8, 'g':3, 'h':5, 'i':10, 'j':10, 'k':20, 'l':30, 'm':40, 'n':50, 'o':70, 'p':80, 'q':100, 'r':200, 's':60, 't':400, 'u':6, 'v':6, 'w':6, 'x':60, 'y':10, 'z':7 };
        let freq = 0; for (let i = 0; i < nome.length; i++) { let letra = nome[i].toLowerCase(); if (gematria[letra]) freq += gematria[letra] * (i + 1); }
        return freq.toString(16);
    }

    _forjarSigilo(plataforma, identificador) {
        const idLimpo = identificador.toLowerCase().trim();
        const dna = this._extrairDnaEspiritual(idLimpo);
        return crypto.createHash('sha512').update(`${plataforma.toUpperCase()}::${dna}::${idLimpo}::EXARP_HCOMA`).digest('hex').substring(0, 40);
    }

    _conjurarGotaDeSangue(hashAlma, vampiroSigilo, quantiaBase, localMordida) {
        const gotaHash = crypto.createHash('sha512').update(hashAlma + vampiroSigilo + "Gamaliel_Lilith" + Date.now()).digest('hex');
        const ressonancia = parseInt(gotaHash.substring(0, 2), 16); 
        let mult = 1; let risco = 0;
        
        if (localMordida === 'pescoco') { mult = 1.5; risco = 25; } 
        else if (localMordida === 'arteria') { mult = 2.0; risco = 45; } 
        else if (localMordida === 'extorquir') { mult = 0.5; risco = 10; } 
        else if (localMordida === 'caricia') { mult = 0.1; risco = 0; } 

        if (Math.random() * 100 < risco) return { hash: gotaHash, volume: 0, critico: false, falha: true };
        if (ressonancia > 220) mult *= 1.5; 
        return { hash: gotaHash, volume: Math.floor(quantiaBase * mult), critico: ressonancia > 220, falha: false };
    }
	
	// ==========================================
    // MOTOR UNIFICADO DE COMBATE CONTÍNUO (Com Partilha XP/Loot)
    // ==========================================
    processarCombateAcao(dadosAction) {
        const { id, alvoId, tipoCombate, postura, desempenhoRitmo } = dadosAction;
        const v = this.vampiros[id];
        if (!v) return { erro: "Aura não encontrada." };

        if (desempenhoRitmo.fuga) {
            this._salvarBancoDeDados();
            return { finalizado: true, relato: "Recuaste para as sombras. O inimigo ainda respira." };
        }

        const atr = this._obterAtributosTotais(v);
        let maxDanoPermitido = ((atr.vontade * 80) * desempenhoRitmo.multiplicadorGeral) + (v.nivel * 1000);
        let danoFinal = Math.min(desempenhoRitmo.danoRealCausado, maxDanoPermitido);
        let danoSofrido = Math.floor(desempenhoRitmo.danoRealSofrido);

        if (danoSofrido > 0) {
            v.hpAtual = Math.max(0, v.hpAtual - danoSofrido);
            if (v.hpAtual <= 0) {
                v.estado = 'Banido'; 
                if (tipoCombate === 'pve') delete this.batalhasPvE[id];
                this._registrarEventoEspecial('global', 'QUEDA NO ABISMO', `A carne de [${v.nome}] cedeu em batalha. Virou pó.`, true);
                this._salvarBancoDeDados();
                return { finalizado: true, relato: "A TUA CARNE FOI DESTRUÍDA. Viraste Pó." };
            }
        }

        // MODO PVE (DUNGEON / EXPEDIÇÃO)
        if (tipoCombate === 'pve') {
            const mob = this.batalhasPvE[id];
            if (!mob) return { erro: "O Monstro desvaneceu na neblina." };

            mob.hpAtual -= danoFinal;
            
            if (mob.hpAtual <= 0) {
                let buffEclipse = (this.altarEclipse && this.altarEclipse.buffAtivoAte > Date.now()) ? 2 : 1;
                
                // XP Escala com Nível do Mob
                let xpGanho = Math.floor((mob.hpMax / 10) * mob.mult) * buffEclipse;
                let ganhoGts = Math.floor(((Math.random() * 200) + 100 + (v.nivel * 50)) * mob.mult) * buffEclipse;
                
                v.sangue += ganhoGts; 
                this.ganharXP(v.id, xpGanho);
                v.inventario[mob.loot] = (v.inventario[mob.loot] || 0) + 1;
                v.estatisticas.demoniosMortos = (v.estatisticas.demoniosMortos || 0) + 1;
                
                let relatoLoot = ` XP: +${xpGanho} | Gts: +${ganhoGts} | Extraíste 1x [${mob.loot.toUpperCase()}].`;
                if (Math.random() > 0.80) { 
                    const drop = ForjaDraconiana.gerarReliquia(v.nivel + (this.nivelAbismo * 2), this.reliquiasCustomizadas); 
                    v.bolsa.push(drop); relatoLoot += ` Pilhaste [${drop.nome}]!`; 
                }

                if (mob.rank !== "Expedição") {
                    this.nivelAbismo += 1;
                    if (this.nivelAbismo % 10 === 0) {
                        this._registrarEventoEspecial('global', 'DESCIDA AO ABISMO', `A aniquilação promovida por ${v.nome} abriu o Nível ${this.nivelAbismo} das Masmorras Umbrais!`, true);
                    }
                }

                delete this.batalhasPvE[id]; this._salvarBancoDeDados();
                return { finalizado: true, relato: `Venceste o [${mob.nome}].${relatoLoot}` };
            }
            this._salvarBancoDeDados();
            return { finalizado: false, hpRestante: mob.hpAtual, hpMax: mob.hpMax };
        }

        // MODO HEREGE MARCADO
        if (tipoCombate === 'herege') {
            const h = this.heregeMarcado; if (!h) return { erro: "Outro caçador aniquilou-o primeiro." };
            h.hp -= danoFinal;
            if (h.hp <= 0) {
                this.heregeMarcado = null;
                const drop = ForjaDraconiana.gerarReliquia(v.nivel + 20, this.reliquiasCustomizadas); v.bolsa.push(drop); v.influencia += 500;
                this._registrarEventoEspecial('global', 'A LENDA CAIU', `${v.nome} executou o Herege Marcado e reclamou [${drop.nome}]!`, true);
                this._salvarBancoDeDados(); return { finalizado: true, relato: `VITÓRIA GLORIOSA! Adquiriste [${drop.nome}].` };
            }
            this._salvarBancoDeDados(); return { finalizado: false, hpRestante: h.hp, hpMax: 15000 };
        }

        // MODO CERCO (Co-op XP Share Fix)
        if (tipoCombate === 'cerco') {
            const cerco = this.cercosAtivos[alvoId]; if(!cerco) return { erro: "O Cerco já ruiu." };
            cerco.hpAtual -= danoFinal;
            
            if (!cerco.participantes) cerco.participantes = {};
            if (!cerco.participantes[v.id]) cerco.participantes[v.id] = { nome: v.nome, dano: 0 }; 
            cerco.participantes[v.id].dano += danoFinal;

            if (cerco.hpAtual <= 0) {
                let xpPorPessoa = Math.floor(cerco.hpMax / 10);
                for (let pid in cerco.participantes) {
                    let p = this.vampiros[pid];
                    if (p) { p.influencia += 50; this.ganharXP(p.id, xpPorPessoa); }
                }
                delete this.cercosAtivos[alvoId];
                this._registrarEventoEspecial('global', 'SÍTIO QUEBRADO', `O cerco de ${cerco.demonio} ruiu! Todos os combatentes receberam ${xpPorPessoa} XP.`, true);
                this._salvarBancoDeDados(); return { finalizado: true, relato: "SÍTIO QUEBRADO!" };
            }
            this._salvarBancoDeDados(); return { finalizado: false, hpRestante: cerco.hpAtual, hpMax: cerco.hpMax };
        }

        // MODO GOÉTIA (Co-op XP Share Fix)
        if (tipoCombate === 'goetia') {
            const demon = this.evocacaoAtiva; if(!demon) return { erro: "A Entidade sumiu." };
            demon.hpAtual -= danoFinal;
            if (!demon.participantes[v.id]) demon.participantes[v.id] = { nome: v.nome, dano: 0 }; 
            demon.participantes[v.id].dano += danoFinal;
            
            if (demon.hpAtual <= 0) {
                let xpBaseBoss = Math.floor(demon.hpMax / 5);
                for (let pid in demon.participantes) { 
                    let l = this.vampiros[pid]; 
                    if (l) { l.influencia += 100; l.inventario.pedraAlma = (l.inventario.pedraAlma || 0) + 10; this.ganharXP(l.id, xpBaseBoss); l.estatisticas.demoniosMortos = (l.estatisticas.demoniosMortos || 0) + 1;} 
                }
                this._registrarEventoEspecial('global', 'VITÓRIA GOÉTICA', `A Vontade de ${demon.nome} foi estilhaçada! Participantes receberam ${xpBaseBoss} XP e 10 Pedras.`, true);
                this.evocacaoAtiva = null; this._salvarBancoDeDados(); return { finalizado: true, relato: "ENTIDADE BANIDA!" };
            }
            this._salvarBancoDeDados(); return { finalizado: false, hpRestante: demon.hpAtual, hpMax: demon.hpMax };
        }

        // MODO FENDA ASTRAL
        if (tipoCombate === 'fenda') {
            const fenda = this.fendaAtiva[alvoId]; if(!fenda) return { erro: "Fenda fechada." };
            fenda.hpAtual -= danoFinal;
            if (fenda.hpAtual <= 0) {
                let xpGanha = Math.floor(fenda.hpMax / 5);
                v.inventario[fenda.loot] = (v.inventario[fenda.loot] || 0) + 2; this.ganharXP(v.id, xpGanha); delete this.fendaAtiva[alvoId];
                this._registrarEventoEspecial('global', 'FENDA PURGADA', `${v.nome} destruiu a anomalia do Vazio.`, true);
                this._salvarBancoDeDados(); return { finalizado: true, relato: `FENDA PURGADA! +${xpGanha} XP.` };
            }
            this._salvarBancoDeDados(); return { finalizado: false, hpRestante: fenda.hpAtual, hpMax: fenda.hpMax };
        }

        return { erro: "A Lei Hermética proíbe este tipo de combate." };
    }
	
    async despertarTalento(vampiroId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma inexistente." };
        
        if (!v.talentosAtivos) v.talentosAtivos = [];
        let limiteTalentos = Math.floor(v.nivel / 20); // 1 Talento a cada 20 níveis
        if (limiteTalentos < 1) return { erro: "A Mente Abissal ignora os fracos. Atinge o Grau 20." };
        if (v.talentosAtivos.length >= limiteTalentos) return { erro: `O teu limite atual é de ${limiteTalentos} talentos. Sobe mais níveis (Grau ${ (v.talentosAtivos.length + 1) * 20 }).` };
        
        if (v.sangue < 5000 || v.pontosAcao < 10) return { erro: "O Ritual exige 5000 Gts e 10 Fúria." };

        v.sangue -= 5000; v.pontosAcao -= 10;
        
        const talento = await this.oraculo.despertarHabilidadeUnica(v);
        if (!talento) {
            v.sangue += 5000; v.pontosAcao += 10;
            return { erro: "O Oráculo manteve-se em silêncio. Tenta novamente." };
        }
            
        v.talentosAtivos.push(talento);
        this._registrarEventoEspecial('global', 'DESPERTAR AKÁSHICO', `A Essência de ${v.nome} mutacionou. Recebeu o poder ancestral: [${talento.nome}]!`, true);
        this._salvarBancoDeDados();
        return { sucesso: true, relato: `A Mente Abissal injetou [${talento.nome}] nas tuas veias: ${talento.desc}` };
    }

    async _registrarEventoEspecial(categoria, tipo, relatoOrig, global = true, contextoOculto = "Manifestação Sombria") {
        const lua = AstrolabioLunar.obterFaseAtual();
        const relatoEnfeitado = await this.oraculo.gerarNarrativaProcedural(tipo, relatoOrig, contextoOculto);
        const evento = { tipo: `${tipo} [${lua.nome}]`, relato: relatoEnfeitado, data: Date.now() };
        
        if (this.logs[categoria]) { this.logs[categoria].unshift(evento); if (this.logs[categoria].length > 100) this.logs[categoria].pop(); }
        if (global) { this.logs.global.unshift(evento); if (this.logs.global.length > 200) this.logs.global.pop(); this.oraculo.analisarClimaAstral(this.logs.global); }
        return evento;
    }

    _verificarLimiteGeracao(senhor) {
        if (!senhor) return true;
        if (senhor.geracao === 1) return true; // Infinito
        if (senhor.geracao === 2 && senhor.linhagem.length < 5) return true;
        if (senhor.geracao === 3 && senhor.linhagem.length < 3) return true;
        if (senhor.geracao >= 4 && senhor.linhagem.length < 1) return true;
        return false;
    }

    despertarViaTelegram(tgId, tgUsername, nomeSombrio, senha, inviteCode, racaEscolhida = 'vampiro') {
        let vampiroEncontrado = null;
        for (let key in this.vampiros) {
            if (this.vampiros[key].nome.toLowerCase() === nomeSombrio.toLowerCase()) {
                vampiroEncontrado = this.vampiros[key]; break;
            }
        }

        if (vampiroEncontrado) {
            const hashTentativa = crypto.pbkdf2Sync(senha, vampiroEncontrado.id, 10000, 64, 'sha512').toString('hex');
            if (vampiroEncontrado.senhaHash !== hashTentativa) return { existente: true, recusado: true, erro: "O Abismo rejeita-te. Palavra de Poder (Senha) Incorreta." };
            return { existente: true, recusado: false, vampiro: vampiroEncontrado };
        }

        const assinaturaSanguinea = crypto.createHmac('sha512', "SETH_LILITH").update(`${tgId}::${nomeSombrio}`).digest('hex');
        const prefixo = racaEscolhida === 'lycan' ? 'FRL_' : 'SNG_';
        const idSombrio = prefixo + assinaturaSanguinea.substring(0, 12).toUpperCase();

        const isFirstVampire = Object.keys(this.vampiros).length === 0;
        
        let senhor = this.vampiros[inviteCode];
        
        if (senhor && !this._verificarLimiteGeracao(senhor)) return { existente: false, recusado: true, erro: "A linhagem deste Mestre secou. Ele não pode gerar mais descendentes nesta Geração." };

        const geracao = isFirstVampire ? 1 : (senhor ? (senhor.geracao + 1) : 13);
        const senhaHashGerada = crypto.pbkdf2Sync(senha, idSombrio, 10000, 64, 'sha512').toString('hex');

        let extraHp = 0; let extraAnima = 0;
        if (tgUsername) {
            const hashMortal = this._forjarSigilo('telegram', `@${tgUsername.toLowerCase()}`);
            const registroMortal = this.rebanho[hashMortal];
            if (registroMortal) {
                if (registroMortal.estado === 'Limbo') { extraAnima = 3; this._registrarEventoEspecial('global', 'RESSURREIÇÃO PROFANA', `A poeira do mortal ${tgUsername} ergueu-se como o neófito ${nomeSombrio}.`, true); } 
                else extraHp = Math.floor(registroMortal.sangueAtual * 0.5);
                delete this.rebanho[hashMortal];
            }
        }

        let atributosIniciais = { vontade: 5, gnose: 5, magnetismo: 5, densidade: 5, pontosLivres: 0 };
        if (racaEscolhida === 'lycan') { atributosIniciais.densidade += 3; atributosIniciais.vontade += 2; } 
        else { atributosIniciais.gnose += 3; atributosIniciais.magnetismo += 2; }
        
        let hpInicial = (atributosIniciais.densidade * 200) + 1100;

        this.vampiros[idSombrio] = {
            id: idSombrio, tgId, tgUsername: tgUsername ? `@${tgUsername}` : 'Alma_Oculta', 
            nome: nomeSombrio, senhaHash: senhaHashGerada, raca: racaEscolhida, clanRole: 'membro',
            sangue: (isFirstVampire ? 15000 : 500) + extraHp, calice: 0, geracao, 
            hpAtual: hpInicial, hpMax: hpInicial, 
            clan: senhor ? senhor.clan : 'Sangue Ralo', 
            estado: 'Ativo', senhor: senhor ? senhor.id : 'O_PRIMORDIAL', linhagem: [],
            pontosAcao: isFirstVampire ? 999 : (racaEscolhida === 'lycan' ? 15 : 10), 
            maxAcao: isFirstVampire ? 999 : (racaEscolhida === 'lycan' ? 15 : 10), 
            escudo: false, nivel: isFirstVampire ? 99 : 1, xp: 0, xpProx: 100, 
            influencia: isFirstVampire ? 100 : 0, titulos: [racaEscolhida === 'lycan' ? 'Filhote Desgarrado' : 'Sangue Frio'], 
            tituloAtual: isFirstVampire ? 'Alfa Primordial' : (racaEscolhida === 'lycan' ? 'Filhote Desgarrado' : 'Sangue Frio'), conquistas: [],
            atributos: atributosIniciais,
            equipamentos: { arma: null, armadura: null, amuleto: null }, bolsa: [], 
            inventario: { anima: extraAnima, cinzas: 0, vitae: 0, memoria: 0, ectoplasma: 0, pedraAlma: 0 }, historicoCombate: [], poderesDesbloqueados: ['solve_coagula'], manuscritos: [], projetosEstudo: [],
            estatisticas: { totalDrenado: 0, mortaisSecos: 0, vitoriasPvP: 0, demoniosMortos: 0, guerrasVencidas: 0, eloOculto: 0 }
        };

        if (isFirstVampire) {
            this.vampiros[idSombrio].titulos.push('Alfa Primordial'); this.vampiros[idSombrio].clanRole = 'lider'; this.fundarClan(idSombrio, 'Aliança Umbra');
            this._registrarEventoEspecial('global', 'O PRIMEVO DESPERTA', `O Ancestral Maior [${nomeSombrio}] rompeu o véu.`, true, "Gênesis do Sistema");
        } else if (senhor) {
            senhor.linhagem.push(idSombrio); senhor.sangue += 500; senhor.influencia += 5; this.ganharXP(senhor.id, 50); 
            if (senhor.clan !== 'Sangue Ralo' && this.clans[senhor.clan]) this.clans[senhor.clan].membros.push(idSombrio);
            const descAto = racaEscolhida === 'lycan' ? `A carne de ${nomeSombrio} foi infectada pela maldição lupina de ${senhor.nome}.` : `A mortalidade de ${nomeSombrio} foi extirpada por ${senhor.nome}.`;
            this._registrarEventoEspecial('global', racaEscolhida === 'lycan' ? 'A MORDIDA FERAL' : 'O ABRAÇO', descAto, true);
        } else {
            this._registrarEventoEspecial('global', 'SANGUE NOVO', `[${nomeSombrio}] atravessou as brumas e despertou por conta própria.`, true);
        }
        
        this._salvarBancoDeDados(); return { existente: false, recusado: false, vampiro: this.vampiros[idSombrio] };
    }
    _obterAtributosTotais(vampiro) {
        let t = { vontade: vampiro.atributos.vontade, gnose: vampiro.atributos.gnose, magnetismo: vampiro.atributos.magnetismo, densidade: vampiro.atributos.densidade };
        ['arma', 'armadura', 'amuleto'].forEach(tipo => {
            if (vampiro.equipamentos[tipo]) {
                t.vontade += vampiro.equipamentos[tipo].bonus.vontade || 0; t.gnose += vampiro.equipamentos[tipo].bonus.gnose || 0;
                t.magnetismo += vampiro.equipamentos[tipo].bonus.magnetismo || 0; t.densidade += vampiro.equipamentos[tipo].bonus.densidade || 0;
            }
        }); return t;
    }

    distribuirAtributos(vampiroId, atributo) {
        const v = this.vampiros[vampiroId];
        if (!v || v.atributos.pontosLivres < 1) return { erro: "Falta Iluminação." };
        if (v.atributos[atributo] === undefined) return { erro: "Esfera Inexistente." };
        v.atributos[atributo] += 1; v.atributos.pontosLivres -= 1;
        if (atributo === 'densidade') v.sangue += 200; if (atributo === 'vontade') v.maxAcao += 1; 
        this._salvarBancoDeDados(); return { sucesso: true, relato: `A tua Essência expandiu-se na Esfera da ${atributo.toUpperCase()}.` };
    }

    mudarTitulo(vampiroId, novoTitulo) {
        const v = this.vampiros[vampiroId]; if (!v || !v.titulos.includes(novoTitulo)) return { erro: "Herético." };
        v.tituloAtual = novoTitulo; this._salvarBancoDeDados(); return { sucesso: true, relato: `És agora reconhecido como ${novoTitulo}.` };
    }

    equiparReliquia(vampiroId, reliquiaId) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        const itemIdx = v.bolsa.findIndex(i => i.id === reliquiaId); if (itemIdx === -1) return { erro: "Artefato além do teu alcance." };
        const item = v.bolsa[itemIdx]; const atual = v.equipamentos[item.tipo];
        v.equipamentos[item.tipo] = item; v.bolsa.splice(itemIdx, 1); if (atual) v.bolsa.push(atual);
        this._salvarBancoDeDados(); return { sucesso: true, relato: `Frestes a tua carne com o Poder de [${item.nome}].` };
    }

    desequiparReliquia(vampiroId, slot) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        if (!v.equipamentos[slot]) return { erro: "Esta fenda astral já está vazia." };
        const item = v.equipamentos[slot];
        v.equipamentos[slot] = null;
        v.bolsa.push(item);
        this._salvarBancoDeDados(); return { sucesso: true, relato: `Removeste [${item.nome}] do teu corpo.` };
    }

    aprimorarEquipamento(vampiroId, slot) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        const item = v.equipamentos[slot];
        if (!item) return { erro: "Fenda vazia." };
        if (item.aprimoramento >= 20) return { erro: "A matéria chegou ao limite cósmico absoluto (Nível 20)." };
        
        const custoAnima = Math.floor(Math.pow(1.6, item.aprimoramento) * 5); 
        const custoCinzas = Math.floor(Math.pow(1.5, item.aprimoramento) * 3);
        const custoGts = Math.floor(Math.pow(1.8, item.aprimoramento) * 500);

        if ((v.inventario.anima || 0) < custoAnima || (v.inventario.cinzas || 0) < custoCinzas || v.sangue < custoGts) {
            return { erro: `A Forja Draconiana exige sacrifício massivo: ${custoAnima} Anima, ${custoCinzas} Cinzas e ${numFmt(custoGts)} Gts de Sangue.` };
        }

        v.inventario.anima -= custoAnima; v.inventario.cinzas -= custoCinzas; v.sangue -= custoGts;
        item.aprimoramento += 1;
        item.nome = item.nome.replace(/\s\(\+[0-9]+\)/g, '') + ` (+${item.aprimoramento})`;
        
        if (!item.bonusBase) item.bonusBase = { ...item.bonus }; 
        
        for(let a in item.bonusBase) { 
            let valBase = parseInt(item.bonusBase[a]) || 0;
            if (valBase > 0) item.bonus[a] = Math.floor(valBase * Math.pow(1.2, item.aprimoramento)); 
        }
        
        this.ganharXP(vampiroId, 150 * item.aprimoramento); this._salvarBancoDeDados();
        return { sucesso: true, relato: `A Bigorna Sombria estalou! ${item.nome} obteve novo poder oculto.` };
    }

    ganharXP(id, quantia) {
        const v = this.vampiros[id]; if (!v || v.estado === 'Banido') return;
        v.xp += quantia;
        if (v.xp >= v.xpProx) {
			if (v.nivel % 10 === 0) this._provocarAbismo(v, `Atingiu Grau de Poder ${v.nivel}`, 5.0);
            v.nivel += 1; v.xp -= v.xpProx; v.xpProx = Math.floor(v.xpProx * 1.5); 
            v.maxAcao += 2; v.pontosAcao = v.maxAcao; v.atributos.pontosLivres += 3; v.influencia += 2; 
            for (let ritualId in this.grimorio) { if (v.nivel >= this.grimorio[ritualId].reqLevel && !v.poderesDesbloqueados.includes(ritualId)) v.poderesDesbloqueados.push(ritualId); }
            this._registrarEventoEspecial('global', 'ASCENSÃO ASTRAL', `A Aura de ${v.nome} adensou-se, irradiando terror cósmico. Ascensão ao Grau ${v.nivel}.`);
            if (v.nivel === 50) this._registrarEventoEspecial('global', 'O VÉU RASGOU-SE', `O Grau 50 foi atingido. A visão astral de OSINT sobre os mortais foi desbloqueada.`, true);
            if (global.io) global.io.to(`priv_${v.id}`).emit('level_up', { lvl: v.nivel }); // Dispara o juice visual
        }
        this._verificarConquistas(v); this._salvarBancoDeDados();
    }
	
    calcularPoderGeral(vampiro) {
        if (!vampiro) return 0;
        const atr = this._obterAtributosTotais(vampiro);
        
        let poderAtributos = (atr.vontade + atr.gnose + atr.magnetismo + atr.densidade) * 15;
        let poderTalentos = (vampiro.talentosAtivos ? vampiro.talentosAtivos.length * 1000 : 0);
        let poderInfluencia = (vampiro.influencia || 0) * 10;
        let poderNivel = (vampiro.nivel || 1) * 100;
        let poderConquistas = (vampiro.conquistas ? vampiro.conquistas.length * 500 : 0);
        
        let poderEquips = 0;
        ['arma', 'armadura', 'amuleto'].forEach(slot => {
            if (vampiro.equipamentos && vampiro.equipamentos[slot]) {
                poderEquips += 200 + ((vampiro.equipamentos[slot].aprimoramento || 0) * 150);
            }
        });

        return Math.floor(poderAtributos + poderTalentos + poderInfluencia + poderNivel + poderConquistas + poderEquips);
    }

    conjurarRitual(vampiroId, ritualId, alvoId) {
        const v = this.vampiros[vampiroId]; const ritual = this.grimorio[ritualId]; const lua = AstrolabioLunar.obterFaseAtual();
        if (!v || !ritual || !v.poderesDesbloqueados.includes(ritualId)) return { erro: "Ritual indisponível." };
        
        let descontoMagia = Math.floor(this._obterAtributosTotais(v).gnose * 5); 
        if (this.evocacaoAtiva && this.evocacaoAtiva.participantes[v.id]) descontoMagia += 100; 
        let custoSangueReal = Math.max(10, ritual.custoSangue - descontoMagia);

        if (v.pontosAcao < ritual.custoAcao || v.sangue < custoSangueReal) return { erro: `Exige Fúria e ${custoSangueReal} Gts (A tua Gnose reduziu o custo em ${descontoMagia}).` };
        
        let alvo = alvoId ? this.vampiros[alvoId] : v; if (alvoId && (!alvo || alvo.estado === 'Banido')) return { erro: "Alvo inválido." };
        
        v.pontosAcao -= ritual.custoAcao; v.sangue -= custoSangueReal;
        
        try {
            const resultado = ritual.efeito(v, alvo, lua); 
            this.ganharXP(vampiroId, 25); this._pontuarMembro(vampiroId, 10);
            
            if (global.io) global.io.emit('evento_open_world', { tipo: "RITUAL", autor: v.nome, msg: `Conjurou [${ritual.nome}]` });
            
            this._registrarEventoEspecial('global', 'VÓRTICE MÁGICO', `${v.nome} invocou [${ritual.nome}]. Custo condensado a ${custoSangueReal} Gts.`); 
            this._salvarBancoDeDados(); return { sucesso: true, relato: resultado };
        } catch(err) {
            return { erro: typeof err === 'string' ? err : "Ritual falhou." };
        }
    }
	
	_verificarMorte(id) {
        const v = this.vampiros[id];
        if (v && v.hp <= 0) {
            v.hp = 0;
            v.status = "Cinzas";
            v.combateLocal = null;
            
            this._registrarEventoEspecial('global', '💀 QUEDA NO ABISMO', `[${v.nome}] sucumbiu aos horrores e virou cinzas.`, true);
            this._salvarBancoDeDados();
            return true;
        }
        return false;
    }
	
	_verificarConquistas(vampiro) {
        if (!vampiro || !vampiro.conquistas) return;
        for (let key in this.conquistas) {
            let conquista = this.conquistas[key];
            if (!vampiro.conquistas.includes(conquista.id) && conquista.requisito(vampiro)) {
                vampiro.conquistas.push(conquista.id);
                if (!vampiro.titulos.includes(conquista.titulo)) vampiro.titulos.push(conquista.titulo);
                this._registrarEventoEspecial('global', 'ASCENSÃO PROFANA', `Os ecos do Abismo reconhecem o mérito. ${vampiro.nome} foi coroado como [${conquista.titulo}].`);
            }
        }
    }

    // ==========================================
    // SISTEMAS DE PVE E GRIND
    // ==========================================
    patrulharUmbral(vampiroId, ritmo) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Corpo Astral fragmentado." };
        if (v.pontosAcao < 2) return { erro: "Exige 2 de Fúria." };
        v.pontosAcao -= 2; 

        const atr = this._obterAtributosTotais(v);
        const forcaBatalha = ((atr.vontade * 5) + (atr.gnose * 5) + (v.nivel * 10)) * (ritmo.multiplicadorGeral || 1);
        
        // Progressão escalonada para ficar mais dificil com o nivel
        let rankBase = "Fraco";
        if (v.nivel > 20) rankBase = "Médio";
        if (v.nivel > 50) rankBase = "Pesadelo";

        const encontros = [
            { tipo: "Inquisidor Cego", hp: 150 + (v.nivel * 5), xp: 20, loot: 'anima', chanceDano: 20 },
            { tipo: "Ghoul Feral", hp: 400 + (v.nivel * 10), xp: 35, loot: 'cinzas', chanceDano: 40 },
            { tipo: "Sombra Desgarrada", hp: 800 + (v.nivel * 20), xp: 60, loot: 'vitae', chanceDano: 60 },
            { tipo: "Anomalia Distorcida (Elite)", hp: 2500 + (v.nivel * 50), xp: 150, loot: 'ectoplasma', chanceDano: 80 }
        ];
        
        let index = Math.min(encontros.length - 1, Math.floor(Math.random() * (v.nivel > 20 ? 4 : 3)));
        const alvo = encontros[index];
        
        if (forcaBatalha + Math.random() * 100 < alvo.hp) {
            let danoSof = Math.floor(alvo.hp * (3 - (ritmo.multiplicadorGeral || 1))); 
            v.sangue = Math.max(0, v.sangue - danoSof); this._salvarBancoDeDados();
            return { erro: `Foste emboscado por um [${alvo.tipo}]! Sangraste ${danoSof} Gts.` };
        }

        let ganhoGts = Math.floor((Math.random() * 100) + 50 + (v.nivel * 15)) * (ritmo.multiplicadorGeral || 1); 
        v.sangue += Math.floor(ganhoGts); 
        this.ganharXP(v.id, Math.floor(alvo.xp * (ritmo.multiplicadorGeral || 1)));
        
        let relatoExtra = "";
        if (Math.random() > 0.5) { v.inventario[alvo.loot] = (v.inventario[alvo.loot] || 0) + 1; relatoExtra = ` e despojaste 1x [${alvo.loot.toUpperCase()}].`; } 
        else if (Math.random() > 0.95) { const drop = ForjaDraconiana.gerarReliquia(v.nivel, this.reliquiasCustomizadas); v.bolsa.push(drop); relatoExtra = ` e encontraste [${drop.nome}].`; }

        this._salvarBancoDeDados(); return { sucesso: true, relato: `[COMBO ${ritmo.multiplicadorGeral}x] Ceifaste um [${alvo.tipo}]. +${Math.floor(ganhoGts)} Gts${relatoExtra}` };
    }

    // ==========================================
    // OSINT / CAÇA EXTREMA (ENDGAME)
    // ==========================================
    async mapearMortal(vampiroId, plataforma, identificador) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        if (v.nivel < 99) return { erro: "O Grau 99 (Auge do Abismo) é exigido para rasgar o Véu e ver o mundo real." };
        if (v.pontosAcao < 1) return { erro: "Requer Fúria." };

        let idLimpo = identificador.trim().toLowerCase();
        if ((plataforma === 'telegram' || plataforma === 'instagram' || plataforma === 'tiktok') && !idLimpo.startsWith('@')) { if (isNaN(idLimpo)) { idLimpo = '@' + idLimpo; } }
        if (plataforma === 'whatsapp' && idLimpo.replace(/[^0-9]/g, '').length < 8) return { erro: "Cifra Inválida." };
        
        const hashAlma = this._forjarSigilo(plataforma, idLimpo); v.pontosAcao -= 1; this.ganharXP(vampiroId, 5); 
        if (this.rebanho[hashAlma]) return { sucesso: true, mortal: this.rebanho[hashAlma] };

        let hpBase = 5000 + (v.nivel * 50); if (plataforma === 'whatsapp') hpBase *= 1.5;

        this.rebanho[hashAlma] = { hash: hashAlma, identificadorVisivel: idLimpo, plataforma, qualidade: "Sangue Mundano", sangueMax: hpBase, sangueAtual: hpBase, estado: 'Vibrante', maldicaoArcana: null, registroMordidas: [], leituraAura: "As Moiras estão tecendo..." };
        this._registrarEventoEspecial('caca', 'A TEIA AUMENTA', `O fio do destino físico de ${idLimpo} foi atado por ${v.nome}.`); this._salvarBancoDeDados();

        this.oraculo.lerAuraMortal(idLimpo, plataforma).then(dadosIA => {
            if(this.rebanho[hashAlma]) {
                this.rebanho[hashAlma].leituraAura = dadosIA.aura; let mult = dadosIA.multiplicador || 1;
                if (mult > 1) { this.rebanho[hashAlma].sangueMax *= mult; this.rebanho[hashAlma].sangueAtual *= mult; this.rebanho[hashAlma].qualidade = dadosIA.fama ? `Sangue Real (Notoriedade Nv.${mult})` : `Pecador Denso (Nv.${mult})`; this._registrarEventoEspecial('global', 'ALMA MASSIVA', `Uma presa humana real de Nível ${mult} foi amarrada à teia.`); }
                this._salvarBancoDeDados(); if (global.io) global.io.emit('aura_atualizada', hashAlma);
            }
        });
        return { sucesso: true, mortal: this.rebanho[hashAlma] };
    }

    drenarMortal(vampiroId, hashMortal, localMordida) {
        const predador = this.vampiros[vampiroId]; const mortal = this.rebanho[hashMortal]; const lua = AstrolabioLunar.obterFaseAtual();
        if (!predador || !mortal || mortal.estado !== 'Vibrante') return { erro: "A Presa escapou pelas neblinas." };
		this._provocarAbismo(predador, `O genocídio da alma de ${mortal.identificadorVisivel}`, 2.0);

        if (localMordida === 'purificar') {
            if (predador.sangue < 200) return { erro: "Exige 200 Gts." }; predador.sangue -= 200; mortal.sangueAtual += 1000; mortal.registroMordidas.unshift({ predador: predador.nome, local: "CUIDADO NEGRO", dano: "+1000 HP", data: Date.now() }); this._salvarBancoDeDados();
            return { roubo: 0, relato: `A presa regenerou a carne (+1000 HP).`, mortal, lootMsg: "" };
        }

        if (predador.pontosAcao < 1 && localMordida !== 'caricia') return { erro: "Falta Fúria." };
        if (mortal.maldicaoArcana && mortal.maldicaoArcana.donoId !== vampiroId) {
            predador.sangue = Math.max(0, predador.sangue - 300); predador.pontosAcao -= 1; this._salvarBancoDeDados();
            return { erro: `CHOQUE MAGICKO! O Selo Protetor de ${mortal.maldicaoArcana.donoNome} incinerou-te (-300 Gts).`, mortal, alertDono:`O escravo [${mortal.identificadorVisivel}] foi protegido do parasita ${predador.nome}.`, donoId: mortal.maldicaoArcana.donoId };
        }

        if (localMordida !== 'caricia') predador.pontosAcao -= 1;
        
        const atr = this._obterAtributosTotais(predador);
        let bonusAtributo = predador.raca === 'lycan' ? Math.floor(atr.densidade * 10) : Math.floor(atr.magnetismo * 10); 
        let mordidaBase = Math.floor(Math.random() * 80) + 40 + bonusAtributo;
        if (lua.id === 'cheia') mordidaBase = Math.floor(mordidaBase * (predador.raca === 'lycan' ? 2.0 : 1.3));

        let rouboPossivel = Math.min(mordidaBase, mortal.sangueAtual);
        const conjuracao = this._conjurarGotaDeSangue(hashMortal, predador.id, rouboPossivel, localMordida);
        
        if (lua.id === 'nova' && predador.raca === 'vampiro') conjuracao.falha = false; 

        if (conjuracao.falha) { predador.sangue = Math.max(0, predador.sangue - 50); this._salvarBancoDeDados(); return { erro: `A presa lutou no plano físico e repeliu o teu ataque astral (-50 Gts).`, mortal }; }

        let rouboFinal = conjuracao.volume; mortal.sangueAtual -= rouboFinal; predador.sangue += rouboFinal; predador.estatisticas.totalDrenado += rouboFinal;
        if (predador.raca === 'lycan' && Math.random() > 0.5) predador.pontosAcao = Math.min(predador.maxAcao, predador.pontosAcao + 1);
        this.ganharXP(vampiroId, localMordida === 'caricia' ? 5 : 25); 

        let lootMsg = ""; let itemName = predador.raca === 'lycan' ? "Osso Puro" : "Cristal Vitae";
        if (Math.random() > 0.6) { predador.inventario.vitae += 1; lootMsg += ` [+1 ${itemName}]`; }
        if (Math.random() > 0.96) { const drop = ForjaDraconiana.gerarReliquia(predador.nivel, this.reliquiasCustomizadas); predador.bolsa.push(drop); lootMsg += `\n[ARTEFATO MANIFESTADO: ${drop.nome}]`; }

        let relato = localMordida === 'caricia' ? `Enfeitiçaste a mente frágil e subjugaste ${rouboFinal} Essência sem dor.` : `O ataque mutilou o alvo na matrix. O dreno rendeu +${rouboFinal} Gts.${lootMsg}`;
        if(localMordida === 'caricia' && Math.random()>0.5){ predador.inventario.memoria=(predador.inventario.memoria||0)+1; lootMsg+=" [+1 Memória]";}

        this._pontuarMembro(vampiroId, 5); this._registrarEventoEspecial('caca', 'O ABATE', `${predador.nome} violou a vitalidade de ${mortal.identificadorVisivel}.`, false);
        mortal.registroMordidas.unshift({ predador: predador.nome, local: localMordida.toUpperCase(), dano: rouboFinal, data: Date.now() });

        if (mortal.sangueAtual <= 0) {
            mortal.estado = 'Limbo'; predador.inventario.cinzas += 1; predador.estatisticas.mortaisSecos += 1; predador.influencia += 1;
            relato += " \nRUPTURA FATAL. Corpo físico consumido. (+1 Cinzas | +1 Influência)";
            this._pontuarMembro(vampiroId, 20); this._registrarEventoEspecial('global', 'O LIMBO', `O fio vital de ${mortal.identificadorVisivel} foi destruído pela fome de ${predador.nome}.`, true);
        }
        
        this._salvarBancoDeDados(); return { roubo: rouboFinal, relato, mortal, lootMsg };
    }

    comprometerMortal(vampiroId, hashMortal) {
        const vampiro = this.vampiros[vampiroId]; const mortal = this.rebanho[hashMortal];
        if (!vampiro || !mortal) return { erro: "As brumas escondem o alvo." };
        if (vampiro.sangue < 800) return { erro: "Exige 800 Gts de Sacrifício." };
        if (mortal.estado === 'No Leilao') return { erro: "A alma já foi transacionada ao Ouro." };
        if (mortal.maldicaoArcana) return { erro: "Esta carne já carrega o ferro de um Senhor." };

        vampiro.sangue -= 800;
        mortal.maldicaoArcana = { selo: crypto.createHash('sha256').update(hashMortal + vampiroId).digest('hex').substring(0,8), donoId: vampiro.id, donoNome: vampiro.nome };
        this._registrarEventoEspecial('caca', 'CORRUPÇÃO ASTRAL', `Correntes etéreas prenderam ${mortal.identificadorVisivel} a ${vampiro.nome}.`); this._salvarBancoDeDados();
        return { sucesso: true, relato: `Selo Enociano gravado. Posse exclusiva estabelecida.` };
    }

    absolverMortal(vampiroId, hashMortal) {
        const v = this.vampiros[vampiroId]; if (!v || v.geracao !== 1) return { erro: "Apenas o Primordial detém este poder." };
        const mortal = this.rebanho[hashMortal]; if (!mortal) return { erro: "Presa não existe." };
        delete this.rebanho[hashMortal]; this._registrarEventoEspecial('global', 'ABSOLVIÇÃO', `A alma de ${mortal.identificadorVisivel} foi devolvida ao mundo humano.`, true); this._salvarBancoDeDados();
        return { sucesso: true, relato: "A alma foi absolvida da matrix." };
    }

    // ==========================================
    // SISTEMA DE CHAT E PACTOS
    // ==========================================
    async conversarComOraculo(vampiroId, mensagem) {
        const v = this.vampiros[vampiroId]; if(!v) return;
        let respostaIA = await this.oraculo.conversarNoChat(v, mensagem);
        const regexFenda = /\[FENDA_ASTRAL:\s*({.*?})\s*\]/is;
        const match = respostaIA.match(regexFenda);
        
        if (match) {
            try {
                const dadosFenda = JSON.parse(match[1]);
                const fendaId = crypto.randomBytes(4).toString('hex');
                this.fendaAtiva[fendaId] = { id: fendaId, nome: dadosFenda.nome, hpMax: parseInt(dadosFenda.hp) || 5000, hpAtual: parseInt(dadosFenda.hp) || 5000, dano: parseInt(dadosFenda.dano) || 100, loot: dadosFenda.loot || "cinzas", criador: v.nome };
                respostaIA = respostaIA.replace(regexFenda, '').trim();
                this._registrarEventoEspecial('global', 'A FENDA ABRIU', `A Malha rasgou-se! O Oráculo conjurou a entidade [${dadosFenda.nome}]! Destruam-na!`, true);
            } catch (e) { console.error("Falha ao injetar fenda.", e); }
        }
        this._salvarBancoDeDados(); return respostaIA;
    }

    async pedirPactoIA(vampiroId) {
        const v = this.vampiros[vampiroId]; if (!v || this.pactosAtivos[v.id]) return { erro: "Termina primeiro o teu pacto atual." };
        const pactoDados = await this.oraculo.gerarPactoProcedural(v); if (!pactoDados) return { erro: "O Abismo está em silêncio." };
        this.pactosAtivos[v.id] = { id: crypto.randomBytes(4).toString('hex'), titulo: pactoDados.titulo, descricao: pactoDados.descricao, req: pactoDados.recursoExigido, qtd: pactoDados.quantidade, xp: pactoDados.recompensaXP };
        this._salvarBancoDeDados(); return { sucesso: true, pacto: this.pactosAtivos[v.id], relato: `[${pactoDados.titulo}] recebido.` };
    }

    completarPacto(vampiroId) {
        const v = this.vampiros[vampiroId]; if (!v || !this.pactosAtivos[v.id]) return { erro: "Não tens pactos atados." };
        const pacto = this.pactosAtivos[v.id];
        if ((v.inventario[pacto.req] || 0) < pacto.qtd) return { erro: `O Pacto exige ${pacto.qtd}x de [${pacto.req.toUpperCase()}].` };
        v.inventario[pacto.req] -= pacto.qtd; this.ganharXP(v.id, pacto.xp); v.influencia += 2; delete this.pactosAtivos[v.id]; this._salvarBancoDeDados();
        return { sucesso: true, relato: `A Entidade bebeu os sacrifícios. Ganhaste ${pacto.xp} XP e +2 Influência.` };
    }

    atacarFenda(vampiroId, fendaId, ritmo) {
        const v = this.vampiros[vampiroId]; const fenda = this.fendaAtiva[fendaId];
        if (!v || !fenda) return { erro: "A Entidade desvaneceu." }; if (v.pontosAcao < 3) return { erro: "Exige 3 Fúrias." };
        v.pontosAcao -= 3; const atr = this._obterAtributosTotais(v); 
        const danoCausado = Math.floor(((atr.vontade * 10) + (atr.gnose * 15) + Math.floor(Math.random() * 500)) * (ritmo.multiplicadorGeral));

        if (Math.random() > 0.6) v.sangue = Math.max(0, v.sangue - fenda.dano);
        fenda.hpAtual -= danoCausado; let relato = `[Combo ${ritmo.multiplicadorGeral}x] Golpeaste [${fenda.nome}] com ${danoCausado} de Poder!`;

        if (fenda.hpAtual <= 0) {
            relato = `DESTRUÍSTE [${fenda.nome}]! +2 ${fenda.loot.toUpperCase()}.`; v.inventario[fenda.loot] = (v.inventario[fenda.loot] || 0) + 2; this.ganharXP(v.id, 1500); delete this.fendaAtiva[fendaId];
            this._registrarEventoEspecial('global', 'FENDA PURGADA', `${v.nome} obliterou a anomalia.`, true);
        }
        this._salvarBancoDeDados(); return { sucesso: true, relato, fendaRestante: fenda ? fenda.hpAtual : 0 };
    }

    // ==========================================
    // SISTEMA DE COMBATE GLOBAL COM IA (PvP Oculto) E TEMPO REAL
    // ==========================================
    // Adicionada a função para PvP em tempo real! (A Arena carrega este status)
    desafiarPvPAoVivo(atacanteId, defensorId) {
        const a = this.vampiros[atacanteId]; const d = this.vampiros[defensorId];
        if(!a || !d) return {erro:"Alma não encontrada."};
        if(a.pontosAcao < 5) return {erro:"Exige 5 Fúrias para desafiar ao vivo."};
        if(d.estado === 'Banido') return {erro:"Combater cinzas é inútil."};
        
        // Coloca o Boss no Arena System sendo o jogador inimigo
        let hpInimigo = d.hpMax;
        a.pontosAcao -= 5;
        this.batalhasPvE[a.id] = { hpMax: hpInimigo, hpAtual: hpInimigo, rank: "Jogador", mult: 2.0, loot: 'vitae', nome: `[PVP] ${d.nome}` };
        
        this._salvarBancoDeDados();
        return { sucesso: true, mob: this.batalhasPvE[a.id] };
    }

    async atacarVampiro(atacanteId, defensorId, posturaAtaque, ritmo) {
        const atacante = this.vampiros[atacanteId]; const defensor = this.vampiros[defensorId]; const lua = AstrolabioLunar.obterFaseAtual();
        if (!atacante || !defensor) return { erro: "Alvo evadido." };
        if (atacante.nivel < 3) return { erro: "O Abismo exige Grau 3 para atacar imortais." };
        if (atacante.pontosAcao < 3) return { erro: "Exige 3 Fúrias." };
        if (defensor.estado === 'Banido') return { erro: "Combater cinzas é inútil." };

        atacante.pontosAcao -= 3;
        
        let atrAta = this._obterAtributosTotais(atacante);
        atrAta.vontade *= (ritmo.multiplicadorGeral || 1);
        atrAta.gnose *= (ritmo.multiplicadorGeral || 1);
        atrAta.magnetismo *= (ritmo.multiplicadorGeral || 1);
        
        const atrDef = this._obterAtributosTotais(defensor);
        let posturaAtaqueNome = posturaAtaque === 1 ? "Ofensiva Bruta vs Carne" : (posturaAtaque === 2 ? "Feitiçaria Pura vs Ocultismo" : "Ilusão Mental vs Vontade");

        const sentenca = await this.oraculo.julgarDueloIA(atacante, JSON.stringify(atrAta), defensor, JSON.stringify(atrDef), posturaAtaqueNome);
        
        let dVencedor, dPerdedor, rouboDano, relatoA, relatoD;
        
        if (sentenca && (sentenca.vencedorId === atacante.id || sentenca.vencedorId === defensor.id)) {
            rouboDano = Math.min(Math.floor(sentenca.dano), 10000 + (atacante.nivel * 500)); 
            if (sentenca.vencedorId === atacante.id) { dVencedor = atacante; dPerdedor = defensor; } 
            else { dVencedor = defensor; dPerdedor = atacante; }
            relatoA = `[Sincronia ${ritmo.multiplicadorGeral}x] ` + sentenca.relatoAtacante; relatoD = sentenca.relatoDefensor;
        } else {
            let pAta = (posturaAtaque===1?atrAta.vontade:posturaAtaque===2?atrAta.gnose:atrAta.magnetismo)*10;
            let pDef = (posturaAtaque===1?atrDef.densidade:posturaAtaque===2?atrDef.gnose:atrDef.vontade)*10;
            if (pAta > pDef) { dVencedor = atacante; dPerdedor = defensor; rouboDano = Math.floor((pAta - pDef)*3); relatoA=`[Sincronia ${ritmo.multiplicadorGeral}x] Venceste o embate! Roubaste ${rouboDano} Gts.`; relatoD=`As barreiras ruíram. Sangraste ${rouboDano} Gts.`; }
            else { dVencedor = defensor; dPerdedor = atacante; rouboDano = Math.floor((pDef - pAta)*2 + 50); relatoA=`[Sincronia ${ritmo.multiplicadorGeral}x] Falha Grave! Cedes-te ${rouboDano} Gts.`; relatoD=`A tua aura aniquilou a invasão. Devoraste ${rouboDano} Gts.`; }
        }

        dPerdedor.sangue -= rouboDano; dVencedor.sangue += rouboDano; dVencedor.estatisticas.vitoriasPvP += 1;
        this.ganharXP(dVencedor.id, 50 * (ritmo.multiplicadorGeral || 1)); this._pontuarMembro(dVencedor.id, 30);
        
        atacante.historicoCombate.unshift(`PvP vs ${defensor.nome}: ${relatoA}`); defensor.historicoCombate.unshift(`Defesa vs ${atacante.nome}: ${relatoD}`);
        this._salvarBancoDeDados(); return { sucesso: true, relato: relatoA, alertaDono: relatoD, donoId: defensor.id };
    }

    // ==========================================
    // BIBLIOTECA E IA AVALIADORA DE ESTUDOS
    // ==========================================
    async aprofundarProjeto(vampiroId, projetoId, novaPesquisa) {
        const v = this.vampiros[vampiroId]; if (!v || v.pontosAcao < 1) return { erro: "Sem fúria." };
        const proj = v.projetosEstudo.find(p => p.id === projetoId); if (!proj || !novaPesquisa) return { erro: "Inválido." };
        
        v.pontosAcao -= 1; 
        // Chama a nova função da IA que avalia a qualidade do Estudo (Score de 1 a 100)
        const resultadoIA = await this.oraculo.avaliarEstudoAkashico(v, proj.titulo, proj.conteudo, novaPesquisa);
        
        let nota = resultadoIA.nota || 10;
        let ganhoXp = Math.floor(nota * 1.5); // Quanto melhor o texto, mais XP ganha.
        
        proj.conteudo += `\n\n--- [REVELAÇÃO AKÁSHICA: ${novaPesquisa}] ---\n` + resultadoIA.texto; 
        proj.dataAtualizacao = Date.now();
        
        this.ganharXP(v.id, ganhoXp); 
        this._salvarBancoDeDados(); 
        return { sucesso: true, novoConteudo: proj.conteudo, relato: `A Mente Abissal avaliou a tua pesquisa (Nota: ${nota}/100). Ganhaste ${ganhoXp} XP.` };
    }

    iniciarProjetoEstudo(vampiroId, titulo, tema) {
        const v = this.vampiros[vampiroId]; if (!v || !titulo || !tema) return { erro: "Inválido." };
        if (!v.projetosEstudo) v.projetosEstudo = []; if (v.projetosEstudo.length >= 3) return { erro: "Bancada cheia." };
        const novoProj = { id: crypto.randomBytes(4).toString('hex'), titulo: titulo, tema: tema, conteudo: `[TOMO INICIADO SOB O SANGUE DE ${v.nome}]\nFoco de Estudo: ${tema}\n\n`, dataAtualizacao: Date.now() };
        v.projetosEstudo.push(novoProj); this._salvarBancoDeDados(); return { sucesso: true, projeto: novoProj, relato: `Papiro aberto.` };
    }
    
    salvarProjetoManual(vampiroId, projetoId, conteudoManual) {
        const v = this.vampiros[vampiroId]; const proj = v?.projetosEstudo.find(p => p.id === projetoId); if (!proj) return { erro: "Perdido." };
        proj.conteudo = conteudoManual; proj.dataAtualizacao = Date.now(); this._salvarBancoDeDados(); return { sucesso: true, relato: "Salvo com sangue." };
    }
    apagarProjeto(vampiroId, projetoId) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Erro." }; v.projetosEstudo = v.projetosEstudo.filter(p => p.id !== projetoId); this._salvarBancoDeDados(); return { sucesso: true, relato: "Tomo queimado." };
    }
    arquivarProjetoComoManuscrito(vampiroId, projetoId, publico) {
        const v = this.vampiros[vampiroId]; if (!v || v.sangue < 200) return { erro: "Falta sangue (200)." }; if (publico && v.nivel < 5) return { erro: "Apenas Nível 5+." };
        const projIdx = v.projetosEstudo.findIndex(p => p.id === projetoId); if (projIdx === -1 || v.projetosEstudo[projIdx].conteudo.length < 50) return { erro: "Vazio ou Inexistente." };
        v.sangue -= 200; const proj = v.projetosEstudo.splice(projIdx, 1)[0]; 
        const manuscrito = { id: crypto.randomBytes(4).toString('hex'), autorId: v.id, autorNome: v.nome, autorTitulo: v.tituloAtual, titulo: proj.titulo, conteudo: proj.conteudo, data: Date.now(), publico: publico };
        if (!v.manuscritos) v.manuscritos = []; v.manuscritos.push(manuscrito); 
        if (publico) { if (!this.manuscritos) this.manuscritos = []; this.manuscritos.unshift(manuscrito); if (this.manuscritos.length > 100) this.manuscritos.pop(); this._registrarEventoEspecial('global', 'TOMO REVELADO', `${v.nome} publicou [${proj.titulo}].`, true); }
        this.ganharXP(v.id, 50); this._pontuarMembro(v.id, 20); this._salvarBancoDeDados(); return { sucesso: true, relato: `[${proj.titulo}] selado.` };
    }

    async cristalizarRitualMagico(vampiroId, projetoId) {
        const v = this.vampiros[vampiroId]; if (!v || v.nivel < 10 || v.sangue < 5000) return { erro: "Condições Mágicas não satisfeitas (Nível 10, 5000 Gts)." };
        const proj = v.projetosEstudo.find(p => p.id === projetoId); if (!proj) return { erro: "Inválido." };
        v.sangue -= 5000; const magiaDados = await this.oraculo.forjarRitualDoManuscrito(v, proj.titulo, proj.conteudo); if (!magiaDados) return { erro: "A Forja colapsou." };
        const feitiçoId = `magia_custom_${crypto.randomBytes(4).toString('hex')}`; magiaDados.autor = v.nome; magiaDados.reqLevel = Math.max(5, magiaDados.reqLevel);
        this.grimorioCustomizado[feitiçoId] = magiaDados; Object.assign(this.grimorio, this._construirFuncoesCustomizadas(this.grimorioCustomizado));
        this._registrarEventoEspecial('global', 'ALTA MAGIA DESCOBERTA', `${v.nome} cristalizou [${magiaDados.nome}] no Servidor!`, true);
        this.apagarProjeto(v.id, projetoId); this._pontuarMembro(v.id, 100); this._salvarBancoDeDados(); return { sucesso: true, relato: `Magia [${magiaDados.nome}] injetada no Jogo.` };
    }
    async cristalizarArmaAkashica(vampiroId, projetoId) {
        const v = this.vampiros[vampiroId]; if (!v || v.nivel < 15 || v.sangue < 3000) return { erro: "Condições não satisfeitas (Nível 15, 3000 Gts)." };
        const proj = v.projetosEstudo.find(p => p.id === projetoId); if (!proj) return { erro: "Inválido." };
        v.sangue -= 3000; const armaDados = await this.oraculo.forjarReliquiaDoManuscrito(v, proj.titulo, proj.conteudo); if (!armaDados) return { erro: "A forja colapsou." };
        this.reliquiasCustomizadas.push({ nome: armaDados.nome, tipo: armaDados.tipo || "arma", autor: v.nome });
        this._registrarEventoEspecial('global', 'ARMA LENDÁRIA FORJADA', `${v.nome} criou [${armaDados.nome}] para os drops globais!`);
        this.apagarProjeto(v.id, projetoId); this._salvarBancoDeDados(); return { sucesso: true, relato: `Relíquia [${armaDados.nome}] atirada ao Vazio.` };
    }
	
	// ==========================================
    // CICLO TEMPORAL E EVENTOS GLOBAIS (CORREÇÃO DO CRASH)
    // ==========================================
    tickTemporal() {
        const lua = AstrolabioLunar.obterFaseAtual();
        
        // 1. SPAWN PROCEDURAL DE ALDEIAS HUMANAS (15% de chance)
        if (Math.random() > 0.85) this.gerarAldeiaProcedural();

        // 2. ORQUESTRAÇÃO DA IA: O CERCO DEMONÍACO
        if (Math.random() > 0.96) { 
            let vitimas = Object.values(this.vampiros).filter(v => v.estado !== 'Banido' && v.nivel >= 5);
            if (vitimas.length > 0) {
                let alvo = vitimas[Math.floor(Math.random() * vitimas.length)];
                let cercoId = crypto.randomBytes(4).toString('hex');
                let demonName = ["Asmodeus", "Belial", "Pazuzu", "Marchosias"][Math.floor(Math.random()*4)];
                let vidaCerco = alvo.nivel * 5000; 
                let danoTickBalanceado = Math.min(500, alvo.nivel * 20); 
                
                this.cercosAtivos[cercoId] = { id: cercoId, alvoId: alvo.id, alvoNome: alvo.nome, clanNome: alvo.clan, demonio: demonName, hpAtual: vidaCerco, hpMax: vidaCerco, danoTick: danoTickBalanceado };
                this._registrarEventoEspecial('global', 'MOTIM DEMONÍACO', `O exército de ${demonName} sitiou a alma de [${alvo.nome}]! Auxiliem-no no Conclave.`, true);
            }
        }

        // 3. PROCESSAR DANOS DOS CERCOS ATIVOS
        for(let cid in this.cercosAtivos) {
            let cerco = this.cercosAtivos[cid]; let alvo = this.vampiros[cerco.alvoId];
            if(alvo && alvo.estado !== 'Banido') {
                alvo.hpAtual -= cerco.danoTick;
                if (alvo.hpAtual <= 0) {
                    if (alvo.sangue > cerco.danoTick) { alvo.sangue -= cerco.danoTick; alvo.hpAtual = 1; } 
                    else if (alvo.calice > cerco.danoTick) { alvo.calice -= cerco.danoTick; alvo.hpAtual = 1; } 
                    else { alvo.hpAtual = 0; alvo.estado = 'Banido'; this._registrarEventoEspecial('global', 'DEVORADO', `A alma de ${alvo.nome} foi rasgada pelas hostes de ${cerco.demonio}.`, true); }
                }
            }
        }

        for (let hash in this.rebanho) { let m = this.rebanho[hash]; if (m.estado === 'Vibrante' && m.maldicaoArcana) m.sangueAtual = Math.max(1, m.sangueAtual - 1); }
        
        // 4. DRENO NATURAL E INSTINTO AKÁSHICO (SOBREVIVÊNCIA OFFLINE)
        for (let id in this.vampiros) {
            let v = this.vampiros[id]; if (v.estado === 'Banido') continue;
            
            let drenoBase = 5 + Math.floor(v.nivel * 1.5); 
            v.sangue -= drenoBase; 
            
            const atrTot = this._obterAtributosTotais(v);
            v.hpMax = (atrTot.densidade * 200) + (v.nivel * 100) + 1000;
            if (v.hpAtual === undefined) v.hpAtual = v.hpMax;

            // INSTINTO DE PRESERVAÇÃO: Quebra o cofre se for morrer de fome
            if (v.sangue <= 0) { 
                if (v.calice > 0) {
                    v.sangue += v.calice; v.calice = 0;
                    if(global.io) global.io.to(`priv_${v.id}`).emit('nova_mensagem', { canal: 'privado', autor: `🩸 INSTINTO`, texto: `A Besta quebrou o teu Cálice para evitar a morte. O teu ouro virou Sangue.`, hora: new Date().toLocaleTimeString() });
                } else {
                    v.estado = 'Banido'; 
                    this._registrarEventoEspecial('global', 'O FIM DA BESTA', `A Fome roeu a mente de ${v.nome}. Virou pó pela absoluta falta de Vitae.`); 
                }
            }
            if (v.calice > 0) v.calice += Math.floor(v.calice * 0.02); // Juros do Banco
            let recup = lua.id === 'crescente' ? 0.8 : 0.5; if (v.pontosAcao < v.maxAcao && Math.random() > (1 - recup)) v.pontosAcao += 1; 
        }
        
        for (let c in this.clans) { if (this.clans[c].cofre > 0) this.clans[c].cofre -= Math.floor(this.clans[c].cofre * 0.05); }
        
        // 5. SPAWN DA CARAVANA E HEREGE (MUNDO ABERTO)
        if (Math.random() > 0.98 && !this.caravanaAtiva) {
            this.caravanaAtiva = { hp: 50000, assaltantes: [] };
            this._registrarEventoEspecial('global', 'A CARAVANA MUNDIAL', `Mortais cruzam o passo carregando barris de sangue. Assaltem no Conclave!`, true);
        }
        if (Math.random() > 0.98 && !this.heregeMarcado) {
            let nomesHereges = ["Kael, O Traidor", "Lúcio, Manto Sangrento", "Vane, Fera Desgarrada"];
            this.heregeMarcado = { hp: 15000, nome: nomesHereges[Math.floor(Math.random()*nomesHereges.length)], ativo: true };
            this._registrarEventoEspecial('global', 'A CAÇADA SELVAGEM', `O Herege [${this.heregeMarcado.nome}] emergiu das sombras!`, true);
        }

        if (Math.random() > 0.8) this._salvarBancoDeDados(); 
    }

}
module.exports = { ShadowCore, AstrolabioLunar };