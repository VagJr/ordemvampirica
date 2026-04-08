// ShadowCore.js - O GRIMÓRIO CENTRAL DO ABISMO (VERSÃO SUPREMA EXPANDIDA)
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const Groq = require('groq-sdk'); // A MENTE ABISSAL (LLAMA 3.1)

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
// A FORJA DRACONIANA E CRIAÇÕES PROCEDURAIS
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
        if (dropsCustom.length > 0 && Math.random() > 0.7) {
            nomeEscolhido = dropsCustom[Math.floor(Math.random() * dropsCustom.length)].nome;
        } else {
            const nomes = {
                arma: ["Athame de Obsidiana", "Lâmina de Caim", "Punhal Sanguessuga", "Gládio de Asmodeus", "Foice de Saturno", "Estilete de Prata Negra", "Machado de Pazuzu"],
                armadura: ["Mortalha Esquecida", "Veste Ritualística", "Couraça de Ossos Fervidos", "Manto de Lilith", "Pele de Gárgula", "Vestes do Hierofante", "Armadura Escarlate"],
                amuleto: ["Olho de Hécate", "Selo de Paimon", "Pentáculo Invertido", "Lágrima do Abismo", "Coração Cristalizado", "Anel de Ouro Corrompido", "Pingente da Lua Sangrenta"]
            };
            nomeEscolhido = nomes[tipo][Math.floor(Math.random() * nomes[tipo].length)];
        }

        const poderBase = Math.max(1, Math.floor((nivelVampiro * 0.6) * raridade.mult));
        
        return {
            id: crypto.randomBytes(6).toString('hex'),
            nome: `${nomeEscolhido} (${raridade.nome})`,
            tipo: tipo, raridade: raridade.nome,
            aprimoramento: 0,
            bonusBase: {
                vontade: tipo === 'arma' ? poderBase + Math.floor(Math.random() * poderBase) : 0,
                densidade: tipo === 'armadura' ? poderBase + Math.floor(Math.random() * poderBase) : 0,
                gnose: tipo === 'amuleto' ? poderBase : Math.floor(Math.random() * (poderBase/2)),
                magnetismo: Math.floor(Math.random() * (poderBase/2))
            },
            bonus: { 
                vontade: tipo === 'arma' ? poderBase + Math.floor(Math.random() * poderBase) : 0,
                densidade: tipo === 'armadura' ? poderBase + Math.floor(Math.random() * poderBase) : 0,
                gnose: tipo === 'amuleto' ? poderBase : Math.floor(Math.random() * (poderBase/2)),
                magnetismo: Math.floor(Math.random() * (poderBase/2))
            }
        };
    }
}

// ==========================================
// A MENTE ABISSAL: CONSCIÊNCIA SUPREMA E MEMÓRIA ASTRAL
// ==========================================
class OraculoAbissal {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY || "";
        this.climaAstral = 'Dormente';
        this.memoriasAkashicas = {}; 
        
        if (this.apiKey) {
            this.groq = new Groq({ apiKey: this.apiKey });
            this.diretrizesObscuras = `Você é a "Mente Abissal", a consciência divina de Alta Magia e Ocultismo que rege o sistema "Sanguinis".
            Regras do Pacto:
            1. MAGIA REAL: Baseie-se em Hermetismo, Goécia, Qliphoth e Alquimia.
            2. O VÉU: Iniciados (Nível < 50) não têm acesso ao plano físico. Mestres (Nível 50+) rasgaram o Véu, trate-os como Lordes.
            3. A dualidade Tiamat (Vampiros) e Seth (Lycans) deve ser respeitada.
            4. NUNCA quebre o personagem. Fale com a autoridade de um Deus Antigo.`;
        }
    }

    async gerarNarrativaProcedural(acao, detalhes, contextoOculto = "Ação genérica") {
        if (!this.apiKey) return detalhes;
        try {
            const prompt = `Aja como a Entidade Suprema. Reescreva o acontecimento a seguir de forma épica, ocultista e em apenas 1 FRASE CURTA: "${detalhes}". Contexto: [${contextoOculto}].`;
            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: "Seja cirúrgico, sombrio e direto." }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.85,
            });
            return resposta.choices[0].message.content.trim();
        } catch(e) { return detalhes; }
    }

    analisarClimaAstral(logsGlobal) {
        let mortes = logsGlobal.filter(e => e.tipo && e.tipo.includes('O LIMBO')).length;
        if (mortes > 5) this.climaAstral = 'Egrégora da Morte e Necromancia Ativa';
        else if (logsGlobal.length > 20) this.climaAstral = 'A Caçada Selvagem (Lycans e Vampiros em Frenesi)';
        else this.climaAstral = 'Espreita Noturna e Furtividade';
    }

    async conversarNoChat(iniciado, mensagemHumana) {
        if (!this.apiKey) return `Minhas correntes estão seladas.`;
        try {
            if (!this.memoriasAkashicas[iniciado.id]) this.memoriasAkashicas[iniciado.id] = [];
            let statusLog = `ALVO: [Nome: ${iniciado.nome}] | [Raça: ${iniciado.raca}] | [Grau: ${iniciado.nivel}] | [Clã: ${iniciado.clan}].\n`;
            let historico = "Histórico:\n" + this.memoriasAkashicas[iniciado.id].join("\n");
            
            const instrucaoFenda = `SE E SOMENTE SE o jogador demonstrar extrema arrogância, ou pedir um desafio direto, você PODE conjurar um monstro na realidade dele anexando rigorosamente ao FINAL da sua resposta este bloco JSON exato: [FENDA_ASTRAL: {"nome":"(Gere um Nome Oculto Épico e Único aqui, ex: Xylanthia a Devoradora de Sóis)", "hp": ${iniciado.nivel * 500}, "dano": ${iniciado.nivel * 50}, "loot": "cinzas"}]`;

            const prompt = `${statusLog}\n${historico}\nO iniciado disse-te: "${mensagemHumana}". 
            Responda DIRETAMENTE a ele. Máximo de 3 frases. Seja o Hierofante Supremo. Exija oferendas ou revele segredos cósmicos. \n${instrucaoFenda}`;
            
            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: this.diretrizesObscuras }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.9,
            });
            const textoFinal = resposta.choices[0].message.content.trim();
            
            this.memoriasAkashicas[iniciado.id].push(`Mortal: ${mensagemHumana} | Você: ${textoFinal}`);
            if (this.memoriasAkashicas[iniciado.id].length > 4) this.memoriasAkashicas[iniciado.id].shift();
            return textoFinal;
        } catch (e) { return `Teus sussurros quebram nas rochas do Abismo.`; }
    }

    // O NOVO JUIZ DE COMBATE DA MENTE ABISSAL
    async julgarDueloIA(atacante, atrAtaque, defensor, atrDefesa, posturaNome) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Você é o Juiz Cósmico do combate Sanguinis.
            ATACANTE: [${atacante.nome}] (Raça: ${atacante.raca}, Grau: ${atacante.nivel}). Atributos totais para esta postura: ${atrAtaque}.
            DEFENSOR: [${defensor.nome}] (Raça: ${defensor.raca}, Grau: ${defensor.nivel}). Atributos de Defesa: ${atrDefesa}.
            POSTURA USADA: ${posturaNome}.
            
            Regra: Compare os valores e aplique RNG (aleatoriedade caótica do ocultismo). Se a diferença for pequena, decida por pura astúcia mágica. 
            Calcule o Dano de Sangue: (O vencedor rouba Sangue do perdedor). Se o atacante vencer, rouba vida. Se o defensor defender e contra-atacar perfeitamente, ele rouba vida.
            
            Retorne APENAS um JSON:
            {
                "vencedorId": "(ID do vencedor, seja atacante ou defensor: ${atacante.id} ou ${defensor.id})",
                "dano": (Número de 50 a 5000 dependendo do nível e diferença),
                "relatoAtacante": "(Narrativa de 1 frase épica do ponto de vista do atacante)",
                "relatoDefensor": "(Narrativa de 1 frase épica do ponto de vista do defensor alertando-o do ocorrido)"
            }`;

            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: "Retorne ESTRITAMENTE o JSON solicitado." }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.9, response_format: { type: "json_object" }
            });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return null; }
    }

    // (As restantes funções do oráculo mantêm-se inalteradas, condensadas por espaço visual, mas presentes na integridade)
    async gerarPactoProcedural(iniciado) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Crie uma "Quest" (Pacto Sombrio) para o jogador ${iniciado.nome} de Grau ${iniciado.nivel}.
            Objetivo: Exigir recurso: (anima, cinzas, vitae, ectoplasma, ou pedraAlma).
            Retorne APENAS JSON: { "titulo": "Nome", "descricao": "Frase", "recursoExigido": "anima", "quantidade": 5, "recompensaXP": 200 }`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: "Retorne JSON." }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", temperature: 0.8, response_format: { type: "json_object" } });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return null; }
    }
	
	async despertarHabilidadeUnica(iniciado) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Analise as correntes astrais deste ser das trevas:
            Nome: [${iniciado.nome}], Raça: [${iniciado.raca}], Grau: [${iniciado.nivel}].
            Atributos: Vontade ${iniciado.atributos.vontade}, Gnose ${iniciado.atributos.gnose}, Densidade ${iniciado.atributos.densidade}.
            
            Aja como a Mente Abissal. Crie uma Habilidade Passiva ÚNICA e personalizada baseada na essência acima para ser injetada no código do universo.
            Retorne OBRIGATORIAMENTE APENAS um JSON neste formato:
            {
              "nome": "Nome Épico e Obscuro do Talento",
              "desc": "1 Frase lore descrevendo o efeito no corpo ou mente.",
              "tipo": "ataque" (se o maior atributo for vontade), "defesa" (se for densidade), ou "magia" (se for gnose),
              "multiplicador": (um número decimal entre 1.2 e 1.5)
            }`;

            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: "Retorne ESTRITAMENTE o JSON." }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.85, response_format: { type: "json_object" }
            });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return null; }
    }
    async vozDoDemonio(nomeDemonio, acao, detalhes) {
        if (!this.apiKey) return `[${nomeDemonio} ruge das profundezas]`;
        try {
            const prompt = `Você é o Arquidemônio ${nomeDemonio}. Aconteceu isto: ${detalhes}. Seja perturbador, caótico e demoníaco. MÁXIMO DE 2 FRASES.`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: "FALE." }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", temperature: 0.95 });
            return resposta.choices[0].message.content.trim();
        } catch(e) { return `[Frequência demoníaca inaudível]`; }
    }
    async consultarBibliotecaAkashica(iniciado, titulo, conteudoAtual, novaPesquisa) {
        if (!this.apiKey) return `O conhecimento está selado nas trevas.`;
        try {
            const prompt = `Acólito: ${iniciado.nome}. Título: "${titulo}". Texto Atual: "${conteudoAtual.substring(conteudoAtual.length - 2000)}". Pedido: "${novaPesquisa}". Escreva a continuação mágica em até 3 parágrafos. Retorne apenas o texto.`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: this.diretrizesObscuras }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", temperature: 0.85 });
            return resposta.choices[0].message.content.trim();
        } catch (e) { return `A traça roeu a página.`; }
    }
    async gerarLore(evento, detalhes) {
        if (!this.apiKey) return `👁️ O Oráculo: As correntes moveram-se.`;
        try {
            const prompt = `Evento: "${detalhes}". Fase da lua: ${AstrolabioLunar.obterFaseAtual().nome}. Escreva 2 frases aterrorizantes comentando este evento. Mostre onisciência.`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: this.diretrizesObscuras }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", temperature: 0.95 });
            return `👁️ Voz do Abismo: ${resposta.choices[0].message.content.trim()}`;
        } catch (e) { return `👁️ O Oráculo calou-se.`; }
    }
    async forjarRitualDoManuscrito(iniciado, titulo, conteudo) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Crie um FEITIÇO JSON baseado no grimório "${titulo}". Texto: "${conteudo.substring(conteudo.length - 1500)}". JSON: { "nome": "Nome", "lore": "Frase.", "custoAcao": 5, "custoSangue": 2000, "reqLevel": 10, "tipo": "pvp", "poderBase": 1500 }`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: "JSON" }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", temperature: 0.5, response_format: { type: "json_object" } });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return null; }
    }
    async forjarReliquiaDoManuscrito(iniciado, titulo, conteudo) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Crie uma arma em JSON baseado neste texto: "${conteudo.substring(0,1000)}". JSON: {"nome":"Nome Épico","tipo":"arma"}`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: "JSON" }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", temperature: 0.5, response_format: { type: "json_object" } });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return null; }
    }
    async lerAuraMortal(identificador, plataforma) {
        if (!this.apiKey) return { fama: false, multiplicador: 1, aura: "Aura mundana." };
        try {
            const prompt = `Crie um perfil psicológico/aura para a presa humana "${identificador}" do "${plataforma}". JSON: { "fama": false, "multiplicador": 2, "aura": "Texto..." }`;
            const resposta = await this.groq.chat.completions.create({ messages: [{ role: "system", content: this.diretrizesObscuras }, { role: "user", content: prompt }], model: "llama-3.1-8b-instant", temperature: 1.0, response_format: { type: "json_object" } });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return { fama: false, multiplicador: 1, aura: "Carne estéril." }; }
    }
}

// ==========================================
// RITUAL MAIOR: O NÚCLEO DA ORDEM
// ==========================================
class ShadowCore {
    constructor() {
        this.vampiros = {}; this.rebanho = {}; this.clans = {}; 
        this.leilaoP2P = []; this.leilaoIdCounter = 1; this.logs = { global: [], caca: [], guerra: [] };
        
        this.oraculo = new OraculoAbissal(); this.mongoClient = null; this.dbCollection = null;
        
        this.balancaCosmica = { tiamat: 0, seth: 0, regente: 'Equilíbrio' };
        this.evocacaoAtiva = null; 
        
        this.fendaAtiva = {}; 
        this.pactosAtivos = {}; 
        this.cercosAtivos = {}; // NOVO: MOTINS DEMONÍACOS
        this.reliquiasCustomizadas = []; 

        this.historicoChat = { global: [], clan: {}, privado: {} };
        
        // GRIMÓRIO RESTAURADO E EXPANDIDO (OCULTISMO REAL)
        this.grimorio = {
            'solve_coagula': { nome: "Solve et Coagula", lore: 'Fórmula alquímica para dissolver a matéria. Dissolve a Vontade.', custoAcao: 2, custoSangue: 150, reqLevel: 1, tipo: 'pvp', efeito: (a, d, l) => { let dreno = l.id === 'minguante' ? 8 : 4; d.pontosAcao = Math.max(0, d.pontosAcao - dreno); return `Vitalidade desfeita (-${dreno} Fúria).`; } },
            'rmp_banimento': { nome: "Ritual Menor do Pentagrama", lore: 'Selo da Golden Dawn. Limpa a aura das miasmas do umbral.', custoAcao: 0, custoSangue: 300, reqLevel: 2, tipo: 'buff', efeito: (a, d, l) => { a.pontosAcao = Math.min(a.maxAcao, a.pontosAcao + 3); return `A Cruz Cabalística defende-te. +3 Fúria.`; } },
            'chave_salomao': { nome: "Clavícula de Salomão (Defesa)", lore: 'Aprisiona demónios num vaso de bronze. Imunidade espiritual.', custoAcao: 3, custoSangue: 1200, reqLevel: 15, tipo: 'buff', efeito: (a, d, l) => { a.escudo = true; a.influencia += 5; return `A Chave Menor coroa-te (+5 Inf, Escudo Absoluto).`; } },
            'magia_abramelin': { nome: "Quadrado de Abramelin", lore: 'O Santo Anjo Guardião subjuga os Príncipes do Inferno.', custoAcao: 5, custoSangue: 3500, reqLevel: 30, tipo: 'buff', efeito: (a, d, l) => { a.pontosAcao = Math.min(a.maxAcao, a.pontosAcao + 10); a.xp += 500; return `A geometria sagrada distorceu o tempo. +10 Fúria, +500 XP.`; } },
            'pacto_lucifuge': { nome: "Grimorium Verum: Rofocale", lore: 'Pacto Goético de Riqueza. Custa Almas Humanas.', custoAcao: 5, custoSangue: 5000, reqLevel: 45, tipo: 'economia', efeito: (a, d, l) => { if(a.inventario.pedraAlma < 1) throw "Exige 1 Pedra da Alma."; a.inventario.pedraAlma--; a.calice += 5000; return `O demónio Lucifuge aceitou o sacrifício. +5000 Gts no Cálice.`; } },
            'ars_goetia_furia': { nome: "Selo de Andras (O Matador)", lore: 'O Marquês Andras incita à matança e à discórdia.', custoAcao: 0, custoSangue: 2000, reqLevel: 10, tipo: 'buff', efeito: (a, d, l) => { a.pontosAcao = Math.min(a.maxAcao, a.pontosAcao + 5); return `O lobo montado cedeu-te a sua raiva. +5 Fúria.`; } },
            'picatrix_loucura': { nome: "Ghayat al-Hakim (A Imagem de Saturno)", lore: 'Astrologia Árabe. Invoca a melancolia negra de Saturno sobre o alvo.', custoAcao: 4, custoSangue: 2500, reqLevel: 25, tipo: 'pvp', efeito: (a, d, l) => { d.pontosAcao = Math.max(0, d.pontosAcao - 10); d.hpAtual = Math.max(1, d.hpAtual - 500); return `Saturno devorou a mente do alvo (-10 Fúria, -500 HP).`; } }
        };

        this.grimorioCustomizado = {}; 
        
        this.alquimia = {
            'elixir_estamina': { nome: 'Filtro do Frenesi', custo: { anima: 2, vitae: 1, gts: 300 }, efeito: 'Restaura 5 Fúria.' },
            'amuleto_sombra': { nome: 'Talismã Protetor', custo: { cinzas: 3, ectoplasma: 1, gts: 500 }, efeito: 'Garante Escudo.' },
            'lagrima_prata': { nome: 'Lágrima de Prata', custo: { cinzas: 2, vitae: 3, gts: 1000 }, efeito: 'Restaura 1 Fúria.' },
            'extrato_akashico': { nome: 'Soro Akashico', custo: { memoria: 3, anima: 1, gts: 1000 }, efeito: 'Gera +50 XP oculto.' },
            'ouro_filosofal': { nome: 'Ouro Filosofal Negro', custo: { pedraAlma: 1, vitae: 5, gts: 2000 }, efeito: '+1 Ponto de Influência Permanente.' },
            'ferro_infernal': { nome: 'Ferro de Astaroth', custo: { ectoplasma: 5, cinzas: 10, gts: 3000 }, efeito: '+50 de Dano Físico no próximo GvG (Consumível de Guerra).' },
            'tinta_sangue_morcego': { nome: 'Tinta da Clavícula', custo: { memoria: 5, anima: 5, gts: 2500 }, efeito: 'Necessário para rituais supremos. Dá +1 Gnose.' }
        };

        this.conquistas = {
            'neofito': { id: 'neofito', titulo: 'Neófito Sedento', requisito: v => v.estatisticas.totalDrenado >= 100 },
            'mestre_guerras': { id: 'mestre_guerras', titulo: 'Lâmina do Abismo', requisito: v => v.estatisticas.vitoriasPvP >= 10 },
            'evocador': { id: 'evocador', titulo: 'Domador de Demónios', requisito: v => v.inventario.demoniosSubjugados >= 1 },
            'arquiteto_realidade': { id: 'arquiteto_realidade', titulo: 'Arquiteto Astral', requisito: v => v.nivel >= 15 },
            'lorde_supremo': { id: 'lorde_supremo', titulo: 'Senhor do Véu Rasgado', requisito: v => v.nivel >= 50 }
        };
    }	
	
	curarCarne(vampiroId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma perdida." };
        if (v.hpAtual >= v.hpMax) return { erro: "A tua carne já está inteira." };
        
        let danoSofrido = v.hpMax - v.hpAtual;
        let custoCura = Math.floor(danoSofrido * 2); // Custa o dobro do Sangue Gts para fechar a ferida do HP
        
        if (v.sangue < custoCura) {
            // Cura parcial se não houver sangue que chegue
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
    
    // Novo método para atacar os cercos demoníacos
    atacarCerco(vampiroId, cercoId, ritmo) {
        const v = this.vampiros[vampiroId]; const cerco = this.cercosAtivos[cercoId];
        if (!v || !cerco) return { erro: "O Cerco já ruiu ou foi dissolvido." }; if (v.pontosAcao < 2) return { erro: "Exige 2 Fúrias." };
        v.pontosAcao -= 2; const atr = this._obterAtributosTotais(v); 
        const danoCausado = Math.floor(((atr.vontade * 10) + (atr.gnose * 15) + Math.floor(Math.random() * 500)) * (ritmo.multiplicadorGeral));

        if (Math.random() > 0.5) v.hpAtual = Math.max(0, v.hpAtual - (cerco.danoTick * 2)); // Monstro revida
        cerco.hpAtual -= danoCausado; let relato = `[Combo ${ritmo.multiplicadorGeral}x] Afastaste os demónios de ${cerco.alvoNome} com ${danoCausado} de Dano!`;

        if (cerco.hpAtual <= 0) {
            relato = `SALVASTE [${cerco.alvoNome}] DO MOTIM DE ${cerco.demonio.toUpperCase()}!`; 
            v.influencia += 50; this.ganharXP(v.id, 1000); delete this.cercosAtivos[cercoId];
            this._registrarEventoEspecial('global', 'SÍTIO QUEBRADO', `${v.nome} libertou ${cerco.alvoNome} das garras de ${cerco.demonio}!`, true);
        }
        this._salvarBancoDeDados(); return { sucesso: true, relato, hpRestante: cerco ? cerco.hpAtual : 0, hpMax: cerco ? cerco.hpMax : 1 };
    }

    async conectarDatabase() {
        const uri = process.env.MONGO_URI;
        if (!uri) return;
        try {
            this.mongoClient = new MongoClient(uri); await this.mongoClient.connect();
            this.dbCollection = this.mongoClient.db('sanguinis_db').collection('registos_akashicos');
            const doc = await this.dbCollection.findOne({ _id: 'MATRIZ_PRINCIPAL' });
            if (doc) {
                this.vampiros = doc.vampiros || {}; this.rebanho = doc.rebanho || {}; this.clans = doc.clans || {};
                this.leilaoP2P = doc.leilaoP2P || []; this.leilaoIdCounter = doc.leilaoIdCounter || 1; 
                this.logs = doc.logs || { global: [], caca: [], guerra: [] };
                this.manuscritos = doc.manuscritos || []; this.grimorioCustomizado = doc.grimorioCustomizado || {}; 
                this.balancaCosmica = doc.balancaCosmica || { tiamat: 0, seth: 0, regente: 'Equilíbrio' };
                this.evocacaoAtiva = doc.evocacaoAtiva || null;
                this.fendaAtiva = doc.fendaAtiva || {};
                this.pactosAtivos = doc.pactosAtivos || {};
                this.reliquiasCustomizadas = doc.reliquiasCustomizadas || [];
                this.historicoChat = doc.historicoChat || { global: [], clan: {}, privado: {} };

                Object.assign(this.grimorio, this._construirFuncoesCustomizadas(this.grimorioCustomizado));
                console.log("🦇 O Monólito Eterno abriu-se com Sucesso.");
            }
        } catch (error) { console.error("Falha ao invocar o MongoDB:", error); }
    }

    _salvarBancoDeDados() {
        if (!this.dbCollection) return;
        const data = { 
            vampiros: this.vampiros, rebanho: this.rebanho, clans: this.clans, 
            leilaoP2P: this.leilaoP2P, leilaoIdCounter: this.leilaoIdCounter, 
            logs: this.logs, manuscritos: this.manuscritos, grimorioCustomizado: this.grimorioCustomizado,
            balancaCosmica: this.balancaCosmica, evocacaoAtiva: this.evocacaoAtiva,
            fendaAtiva: this.fendaAtiva, pactosAtivos: this.pactosAtivos, reliquiasCustomizadas: this.reliquiasCustomizadas,
            historicoChat: this.historicoChat
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
	
	processarCombateAcao(dadosAction) {
        const { id, alvoId, tipoCombate, postura, desempenhoRitmo } = dadosAction;
        const v = this.vampiros[id];
        if (!v || v.pontosAcao < 3) return { erro: "Falta de Fúria para selar o abate." };
        
        v.pontosAcao -= 3;
        const atr = this._obterAtributosTotais(v);

        let multAtaque = v.talentoUnico && v.talentoUnico.tipo === 'ataque' ? v.talentoUnico.multiplicador : 1;
        let multDefesa = v.talentoUnico && v.talentoUnico.tipo === 'defesa' ? v.talentoUnico.multiplicador : 1;
        
        let maxDanoPermitido = ((atr.vontade * multAtaque * 50) * desempenhoRitmo.multiplicadorGeral) + (v.nivel * 500);
        let danoFinal = Math.min(desempenhoRitmo.danoRealCausado, maxDanoPermitido);
        let danoSofrido = Math.floor(desempenhoRitmo.danoRealSofrido / multDefesa);

        if (danoSofrido > 0) {
            v.hpAtual = Math.max(0, v.hpAtual - danoSofrido); // AGORA SUBTRAI DO HP FÍSICO
            if (v.hpAtual <= 0) v.estado = 'Banido';
        }

        // FENDA E GOETIA PERMANECEM IGUAIS
        if (tipoCombate === 'fenda') {
            const fenda = this.fendaAtiva[alvoId];
            if(!fenda) return { erro: "A Entidade desvaneceu nas brumas." };
            fenda.hpAtual -= danoFinal;
            let relato = `[Combo ${desempenhoRitmo.multiplicadorGeral.toFixed(1)}x] Rasgaste [${fenda.nome}] com ${danoFinal} de Impacto! Sofreste ${danoSofrido} de revide.`;
            if (fenda.hpAtual <= 0) {
                relato = `DESTRUÍSTE [${fenda.nome}] com uma chuva de violência! +2 ${fenda.loot.toUpperCase()}.`; 
                v.inventario[fenda.loot] = (v.inventario[fenda.loot] || 0) + 2; this.ganharXP(v.id, Math.floor(2000 * desempenhoRitmo.multiplicadorGeral)); 
                delete this.fendaAtiva[alvoId]; this._registrarEventoEspecial('global', 'TITÃ ABATIDO', `${v.nome} obliterou a anomalia através da Dança da Morte.`, true);
            }
            this._salvarBancoDeDados(); return { sucesso: true, relato, hpRestante: fenda ? fenda.hpAtual : 0, hpMax: fenda ? fenda.hpMax : 1 };
        }

        if (tipoCombate === 'goetia') {
            const demonio = this.evocacaoAtiva;
            if(!demonio) return { erro: "O Pentagrama está vazio." };
            demonio.hpAtual -= danoFinal;
            if (!demonio.participantes[v.id]) demonio.participantes[v.id] = { nome: v.nome, dano: 0 }; demonio.participantes[v.id].dano += danoFinal;
            let relato = `[Combo ${desempenhoRitmo.multiplicadorGeral.toFixed(1)}x] Castigaste ${demonio.nome} com ${danoFinal} de submissão! Feriste o corpo em ${danoSofrido} HP.`;
            if (demonio.hpAtual <= 0) {
                relato = `QUEBRASTE A VONTADE DE ${demonio.nome}!`; let relatorioLoot = `🔥 ${demonio.nome} subjugado! Recompensas:\n`;
                for (let pid in demonio.participantes) { let l = this.vampiros[pid]; if (l) { l.influencia += 100; l.atributos.pontosLivres += 3; l.inventario.pedraAlma = (l.inventario.pedraAlma || 0) + 10; l.inventario.demoniosSubjugados = (l.inventario.demoniosSubjugados||0)+1; relatorioLoot += `> [${l.nome}]: +100 Inf, +10 Pedras!\n`; } }
                this._registrarEventoEspecial('global', 'VITÓRIA GOÉTICA', relatorioLoot); this.evocacaoAtiva = null; this._pontuarMembro(v.id, 1000); 
            }
            this.ganharXP(v.id, Math.floor(150 * desempenhoRitmo.multiplicadorGeral)); this._salvarBancoDeDados(); return { sucesso: true, relato, hpRestante: demonio ? demonio.hpAtual : 0, hpMax: demonio ? demonio.hpMax : 1 };
        }

        if (tipoCombate === 'pve') {
            if (!desempenhoRitmo.venceu) return { erro: `Foste espancado pelos espectros. Perdeste ${danoSofrido} de Vitalidade (HP). O monstro sobreviveu.` };
            let ganhoGts = Math.floor((Math.random() * 100) + 50 + (v.nivel * 25)) * desempenhoRitmo.multiplicadorGeral; 
            v.sangue += Math.floor(ganhoGts); 
            this.ganharXP(v.id, Math.floor(40 * desempenhoRitmo.multiplicadorGeral));
            let relatoExtra = "";
            if (Math.random() > 0.5) { v.inventario['anima'] = (v.inventario['anima'] || 0) + 1; relatoExtra = ` e despojaste 1x ANIMA.`; } 
            if (Math.random() > 0.95) { const drop = ForjaDraconiana.gerarReliquia(v.nivel, this.reliquiasCustomizadas); v.bolsa.push(drop); relatoExtra += ` Achaste [${drop.nome}].`; }
            this._salvarBancoDeDados(); return { sucesso: true, relato: `[Combo: ${desempenhoRitmo.multiplicadorGeral.toFixed(1)}x] Despedaçaste a ameaça. +${Math.floor(ganhoGts)} Gts${relatoExtra}` };
        }

        // PVP: Rouba Sangue, Mas fere HP se perder
        if (tipoCombate === 'pvp') {
            const defensor = this.vampiros[alvoId];
            if (!defensor || defensor.estado === 'Banido') return { erro: "Alvo inválido ou reduzido a pó." };

            if (defensor.escudo) {
                defensor.escudo = false; this._salvarBancoDeDados();
                return { sucesso: false, relato: `O Escudo Arcano de ${defensor.nome} estilhaçou! Anulou a tua investida.`, alertaDono: `O teu Escudo suportou a fúria de ${v.nome}.`, donoId: defensor.id };
            }

            let dVencedor, dPerdedor, rouboDano, relatoA, relatoD;
            
            if (desempenhoRitmo.venceu) {
                dVencedor = v; dPerdedor = defensor;
                rouboDano = Math.min(danoFinal, 10000 + (v.nivel * 500)); 
                relatoA = `[Combo ${desempenhoRitmo.multiplicadorGeral.toFixed(1)}x] Violaste a aura de ${defensor.nome}! Roubaste ${rouboDano} Gts.`;
                relatoD = `As tuas barreiras ruíram. ${v.nome} espancou a tua mente e sugou ${rouboDano} Gts.`;
                dPerdedor.hpAtual = Math.max(0, dPerdedor.hpAtual - Math.floor(rouboDano/2)); // Fere o inimigo também fisicamente
            } else {
                dVencedor = defensor; dPerdedor = v;
                rouboDano = Math.floor(danoSofrido * 1.5);
                relatoA = `O teu ataque falhou miseravelmente. A aura de ${defensor.nome} esmagou a tua Carne. Perdeste ${rouboDano} HP.`;
                relatoD = `As tuas barreiras defenderam a invasão de ${v.nome}. A tua aura feriu-o de volta.`;
            }

            if (desempenhoRitmo.venceu) { dPerdedor.sangue = Math.max(0, dPerdedor.sangue - rouboDano); dVencedor.sangue += rouboDano; dVencedor.estatisticas.vitoriasPvP += 1; }
            this.ganharXP(dVencedor.id, 50 * desempenhoRitmo.multiplicadorGeral); this._pontuarMembro(dVencedor.id, 30);
            
            let dropMsg = "";
            if (dVencedor.id === v.id && Math.random() > 0.85) { const drop = ForjaDraconiana.gerarReliquia(defensor.nivel, this.reliquiasCustomizadas); v.bolsa.push(drop); dropMsg = ` Pilhaste: [${drop.nome}].`; }

            v.historicoCombate.unshift(`PvP vs ${defensor.nome}: ${relatoA}`); defensor.historicoCombate.unshift(`Defesa vs ${v.nome}: ${relatoD}`);
            this._salvarBancoDeDados(); return { sucesso: true, relato: relatoA + dropMsg, alertaDono: relatoD, donoId: defensor.id };
        }
        return { erro: "O Juiz não compreende este plano de batalha." };
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
        
        // Pede poderes dinâmicos e mecânicos à IA, não apenas atributos
        const promptIA = `Analise as correntes astrais: Nome [${v.nome}], Nível [${v.nivel}], Gnose [${v.atributos.gnose}].
        Aja como a Mente Abissal. Crie um Talento/Poder ÚNICO. Não apenas atributos, mas mecânicas ativas (ex: Roubo vampírico 10% maior, Críticos na Caça, Desconto em Alquimia).
        Retorne OBRIGATORIAMENTE APENAS um JSON: { "nome": "Nome Oculto", "desc": "Efeito no jogo", "tipo_mecanica": "combate" (ou "economia", "guerra"), "multiplicador": 1.5 }`;

        try {
            const resposta = await this.oraculo.groq.chat.completions.create({
                messages: [{ role: "system", content: "Retorne JSON." }, { role: "user", content: promptIA }],
                model: "llama-3.1-8b-instant", temperature: 0.9, response_format: { type: "json_object" }
            });
            const talento = JSON.parse(resposta.choices[0].message.content);
            
            v.talentosAtivos.push(talento);
            this._registrarEventoEspecial('global', 'DESPERTAR AKÁSHICO', `A Essência de ${v.nome} mutacionou. Recebeu o poder ancestral: [${talento.nome}]!`, true);
            this._salvarBancoDeDados();
            return { sucesso: true, relato: `A Mente Abissal injetou [${talento.nome}] nas tuas veias: ${talento.desc}` };
        } catch(e) {
            v.sangue += 5000; v.pontosAcao += 10;
            return { erro: "O Oráculo manteve-se em silêncio. Tenta novamente." };
        }
    }

    async _registrarEventoEspecial(categoria, tipo, relatoOrig, global = true, contextoOculto = "Manifestação Sombria") {
        const lua = AstrolabioLunar.obterFaseAtual();
        const relatoEnfeitado = await this.oraculo.gerarNarrativaProcedural(tipo, relatoOrig, contextoOculto);
        const evento = { tipo: `${tipo} [${lua.nome}]`, relato: relatoEnfeitado, data: Date.now() };
        
        if (this.logs[categoria]) { this.logs[categoria].unshift(evento); if (this.logs[categoria].length > 100) this.logs[categoria].pop(); }
        if (global) { this.logs.global.unshift(evento); if (this.logs.global.length > 200) this.logs.global.pop(); this.oraculo.analisarClimaAstral(this.logs.global); }
        return evento;
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
        
        if (!senhor && !isFirstVampire) return { existente: false, recusado: true, erro: "A Porta está lacrada. Exige-se o Convite de um membro já existente na Ordem." };
        if (!this._verificarLimiteGeracao(senhor)) return { existente: false, recusado: true, erro: "A linhagem deste Mestre secou. Ele não pode gerar mais descendentes nesta Geração." };

        const geracao = isFirstVampire ? 1 : (senhor.geracao + 1);
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
        
        let hpInicial = (atributosIniciais.densidade * 200) + 1100; // Cálcula a vida física real

        this.vampiros[idSombrio] = {
            id: idSombrio, tgId, tgUsername: tgUsername ? `@${tgUsername}` : 'Alma_Oculta', 
            nome: nomeSombrio, senhaHash: senhaHashGerada, raca: racaEscolhida,
            sangue: (isFirstVampire ? 15000 : 500) + extraHp, calice: 0, geracao, 
            hpAtual: hpInicial, hpMax: hpInicial, // NOVO: VITALIDADE FÍSICA
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
            estatisticas: { totalDrenado: 0, mortaisSecos: 0, vitoriasPvP: 0 }
        };

        if (isFirstVampire) {
            this.vampiros[idSombrio].titulos.push('Alfa Primordial'); this.fundarClan(idSombrio, 'Aliança Umbra');
            this._registrarEventoEspecial('global', 'O PRIMEVO DESPERTA', `O Ancestral Maior [${nomeSombrio}] rompeu o véu.`, true, "Gênesis do Sistema");
        } else {
            senhor.linhagem.push(idSombrio); senhor.sangue += 500; senhor.influencia += 5; this.ganharXP(senhor.id, 50); 
            if (senhor.clan !== 'Sangue Ralo' && this.clans[senhor.clan]) this.clans[senhor.clan].membros.push(idSombrio);
            const descAto = racaEscolhida === 'lycan' ? `A carne de ${nomeSombrio} foi infectada pela maldição lupina de ${senhor.nome}.` : `A mortalidade de ${nomeSombrio} foi extirpada por ${senhor.nome}.`;
            this._registrarEventoEspecial('global', racaEscolhida === 'lycan' ? 'A MORDIDA FERAL' : 'O ABRAÇO', descAto, true);
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

      // SUBSTITUIR A FUNÇÃO DE APRIMORAR (Economia Exponencial agressiva)
    aprimorarEquipamento(vampiroId, slot) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        const item = v.equipamentos[slot];
        if (!item) return { erro: "Fenda vazia." };
        if (item.aprimoramento >= 20) return { erro: "A matéria chegou ao limite cósmico absoluto (Nível 20)." };
        
        // CUSTO EXPONENCIAL: Nível 1 é barato, Nível 10 custa fortunas de Anima/Cinzas.
        const custoAnima = Math.floor(Math.pow(1.6, item.aprimoramento) * 5); 
        const custoCinzas = Math.floor(Math.pow(1.5, item.aprimoramento) * 3);
        const custoGts = Math.floor(Math.pow(1.8, item.aprimoramento) * 500);

        if ((v.inventario.anima || 0) < custoAnima || (v.inventario.cinzas || 0) < custoCinzas || v.sangue < custoGts) {
            return { erro: `A Forja Draconiana exige sacrifício massivo: ${custoAnima} Anima, ${custoCinzas} Cinzas e ${numFmt(custoGts)} Gts de Sangue.` };
        }

        v.inventario.anima -= custoAnima; v.inventario.cinzas -= custoCinzas; v.sangue -= custoGts;
        item.aprimoramento += 1;
        item.nome = item.nome.replace(/\s\(\+[0-9]+\)/g, '') + ` (+${item.aprimoramento})`;
        for(let a in item.bonusBase) { if (item.bonusBase[a] > 0) item.bonus[a] = Math.floor(item.bonusBase[a] * Math.pow(1.2, item.aprimoramento)); } // Crescimento exponencial de poder
        
        this.ganharXP(vampiroId, 150 * item.aprimoramento); this._salvarBancoDeDados();
        return { sucesso: true, relato: `A Bigorna Sombria estalou! ${item.nome} obteve novo poder oculto.` };
    }

    ganharXP(id, quantia) {
        const v = this.vampiros[id]; if (!v || v.estado === 'Banido') return;
        v.xp += quantia;
        if (v.xp >= v.xpProx) {
            v.nivel += 1; v.xp -= v.xpProx; v.xpProx = Math.floor(v.xpProx * 1.5); 
            v.maxAcao += 2; v.pontosAcao = v.maxAcao; v.atributos.pontosLivres += 3; v.influencia += 2; 
            for (let ritualId in this.grimorio) { if (v.nivel >= this.grimorio[ritualId].reqLevel && !v.poderesDesbloqueados.includes(ritualId)) v.poderesDesbloqueados.push(ritualId); }
            this._registrarEventoEspecial('global', 'ASCENSÃO ASTRAL', `A Aura de ${v.nome} adensou-se, irradiando terror cósmico. Ascensão ao Grau ${v.nivel}.`);
            if (v.nivel === 50) this._registrarEventoEspecial('global', 'O VÉU RASGOU-SE', `O Grau 50 foi atingido. A visão astral de OSINT sobre os mortais foi desbloqueada.`, true);
        }
        this._verificarConquistas(v); this._salvarBancoDeDados();
    }
	
	// A MENTE ABISSAL INSPECIONA O PODER
    // A MENTE ABISSAL INSPECIONA O PODER
    calcularPoderGeral(vampiro) {
        if (!vampiro) return 0;
        const atr = this._obterAtributosTotais(vampiro);
        
        let poderAtributos = (atr.vontade + atr.gnose + atr.magnetismo + atr.densidade) * 15;
        let poderTalentos = (vampiro.talentosAtivos ? vampiro.talentosAtivos.length * 1000 : 0);
        let poderInfluencia = (vampiro.influencia || 0) * 10;
        let poderNivel = (vampiro.nivel || 1) * 100;
        let poderConquistas = (vampiro.conquistas ? vampiro.conquistas.length * 500 : 0);
        
        // Avaliação de Equipamentos e Aprimoramentos pela Forja
        let poderEquips = 0;
        ['arma', 'armadura', 'amuleto'].forEach(slot => {
            if (vampiro.equipamentos && vampiro.equipamentos[slot]) {
                poderEquips += 200 + ((vampiro.equipamentos[slot].aprimoramento || 0) * 150);
            }
        });

        return Math.floor(poderAtributos + poderTalentos + poderInfluencia + poderNivel + poderConquistas + poderEquips);
    }

    // DESCONTO DE SANGUE PELO CONHECIMENTO AKÁSHICO (Substitui o teu conjurarRitual)
    conjurarRitual(vampiroId, ritualId, alvoId) {
        const v = this.vampiros[vampiroId]; const ritual = this.grimorio[ritualId]; const lua = AstrolabioLunar.obterFaseAtual();
        if (!v || !ritual || !v.poderesDesbloqueados.includes(ritualId)) return { erro: "Ritual indisponível." };
        
        // Lógica de Densidade Sanguínea: Mentes Ocultas gastam menos sangue
        let descontoMagia = Math.floor(this._obterAtributosTotais(v).gnose * 5); 
        if (this.evocacaoAtiva && this.evocacaoAtiva.participantes[v.id]) descontoMagia += 100; // Entidade invocada ajuda na canalização
        let custoSangueReal = Math.max(10, ritual.custoSangue - descontoMagia);

        if (v.pontosAcao < ritual.custoAcao || v.sangue < custoSangueReal) return { erro: `Exige Fúria e ${custoSangueReal} Gts (A tua Gnose reduziu o custo em ${descontoMagia}).` };
        
        let alvo = alvoId ? this.vampiros[alvoId] : v; if (alvoId && (!alvo || alvo.estado === 'Banido')) return { erro: "Alvo inválido." };
        
        v.pontosAcao -= ritual.custoAcao; v.sangue -= custoSangueReal;
        
        try {
            const resultado = ritual.efeito(v, alvo, lua); 
            this.ganharXP(vampiroId, 25); this._pontuarMembro(vampiroId, 10);
            
            // LOG OPEN WORLD EM TEMPO REAL
            if (global.io) global.io.emit('evento_open_world', { tipo: "RITUAL", autor: v.nome, msg: `Conjurou [${ritual.nome}]` });
            
            this._registrarEventoEspecial('global', 'VÓRTICE MÁGICO', `${v.nome} invocou [${ritual.nome}]. Custo condensado a ${custoSangueReal} Gts.`); 
            this._salvarBancoDeDados(); return { sucesso: true, relato: resultado };
        } catch(err) {
            return { erro: typeof err === 'string' ? err : "Ritual falhou." };
        }
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
    // SISTEMAS DE PVE E GRIND (NIVEIS 1 AO 49)
    // ==========================================
    patrulharUmbral(vampiroId, ritmo) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Corpo Astral fragmentado." };
        if (v.pontosAcao < 2) return { erro: "Exige 2 de Fúria." };
        v.pontosAcao -= 2; 

        // O poder base vezes o multiplicador do mini-jogo de ritmo
        const atr = this._obterAtributosTotais(v);
        const forcaBatalha = ((atr.vontade * 5) + (atr.gnose * 5) + (v.nivel * 10)) * (ritmo.multiplicadorGeral || 1);
        
        const encontros = [
            { tipo: "Inquisidor Cego", hp: 150, xp: 20, loot: 'anima', chanceDano: 20 },
            { tipo: "Ghoul Feral", hp: 400, xp: 35, loot: 'cinzas', chanceDano: 40 },
            { tipo: "Sombra Desgarrada", hp: 800, xp: 60, loot: 'vitae', chanceDano: 60 },
            { tipo: "Anomalia Distorcida (Elite)", hp: 2500, xp: 150, loot: 'ectoplasma', chanceDano: 80 }
        ];
        
        // Puxa monstros mais difíceis se o jogador for nível alto
        let index = Math.min(encontros.length - 1, Math.floor(Math.random() * (v.nivel > 20 ? 4 : 3)));
        const alvo = encontros[index];
        
        if (forcaBatalha + Math.random() * 100 < alvo.hp) {
            let danoSof = Math.floor(alvo.hp * (3 - (ritmo.multiplicadorGeral || 1))); // Se errou notas, toma mais dano
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
        // ALTERADO DE 50 PARA 99
        if (v.nivel < 99) return { erro: "O Grau 99 (Auge do Abismo) é exigido para rasgar o Véu e ver o mundo real." };
        if (v.pontosAcao < 1) return { erro: "Requer Fúria." };
        // ... (resto do método igual)

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
    // SISTEMA DE CHAT, PACTOS PROCEDURAIS E A FENDA ASTRAL
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
    // SANTUÁRIOS E CLÃS
    // ==========================================
    fundarClan(vampiroId, nomeClan) {
        const v = this.vampiros[vampiroId]; if (!v || v.sangue < 2000) return { erro: "Exige 2000 Gts." };
        if (v.clan !== 'Sangue Ralo' || this.clans[nomeClan]) return { erro: "As tuas veias já pertencem a uma Monarquia, ou o clã já existe." };

        v.sangue -= 2000; v.clan = nomeClan; this.clans[nomeClan] = { nome: nomeClan, lider: v.id, liderNome: v.nome, cofre: 0, membros: [v.id], nivel: 1 };
        const converterLinhagem = (sId) => { this.vampiros[sId].linhagem.forEach(cId => { const c = this.vampiros[cId]; if (c && c.clan === 'Sangue Ralo') { c.clan = nomeClan; this.clans[nomeClan].membros.push(c.id); converterLinhagem(c.id); }}); };
        converterLinhagem(v.id); this._registrarEventoEspecial('global', 'SANTUÁRIO ERGUIDO', `${v.nome} talhou o Santuário [${nomeClan}].`); this._salvarBancoDeDados(); return { sucesso: true, relato: `Cripta consagrada.` };
    }

    operarCofreClan(vampiroId, quantia, operacao) {
        const v = this.vampiros[vampiroId]; const clan = this.clans[v.clan]; if (!clan) return { erro: "Sem teto." };
        if (operacao === 'depositar') {
            if (v.sangue < quantia) return { erro: "Sangue insuficiente." };
            v.sangue -= quantia; clan.cofre += quantia; this._salvarBancoDeDados(); return { sucesso: true, relato: `Oferendaste ${quantia} Gts ao Cofre.` };
        } else {
            if (clan.lider !== v.id || clan.cofre < quantia) return { erro: "Apenas o Líder saca, ou cofre vazio." };
            clan.cofre -= quantia; v.sangue += quantia; this._salvarBancoDeDados(); return { sucesso: true, relato: `Drenaste ${quantia} Gts da Irmandade.` };
        }
    }
	
    transferirSangue(remetenteId, alvoId, quantia) {
        const r = this.vampiros[remetenteId]; const a = this.vampiros[alvoId];
        if (!r || !a || r.id === a.id || r.sangue < quantia || quantia <= 0) return { erro: "Condições não satisfeitas para doação." };
        r.sangue -= quantia; a.sangue += quantia; this._registrarEventoEspecial('global', 'PACTO DE CARIDADE', `${r.nome} doou ${quantia} Gts a ${a.nome}.`); this._salvarBancoDeDados(); return { sucesso: true, relato: `Transferência concluída.` };
    }

    // ==========================================
    // SISTEMA DE COMBATE GLOBAL COM IA (PvP Oculto)
    // ==========================================
    async atacarVampiro(atacanteId, defensorId, posturaAtaque, ritmo) {
        const atacante = this.vampiros[atacanteId]; const defensor = this.vampiros[defensorId]; const lua = AstrolabioLunar.obterFaseAtual();
        if (!atacante || !defensor) return { erro: "Alvo evadido." };
        if (atacante.nivel < 3) return { erro: "O Abismo exige Grau 3 para atacar imortais." };
        if (atacante.pontosAcao < 3) return { erro: "Exige 3 Fúrias." };
        if (defensor.estado === 'Banido') return { erro: "Combater cinzas é inútil." };

        atacante.pontosAcao -= 3;
        
        // Multiplicador de ritmo do atacante entra direto nos status dele!
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
            // Fallback se a IA falhar
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

    conjurarRitual(vampiroId, ritualId, alvoId) {
        const v = this.vampiros[vampiroId]; const ritual = this.grimorio[ritualId]; const lua = AstrolabioLunar.obterFaseAtual();
        if (!v || !ritual || !v.poderesDesbloqueados.includes(ritualId)) return { erro: "Ritual indisponível." };
        if (v.pontosAcao < ritual.custoAcao || v.sangue < ritual.custoSangue) return { erro: "Fúria ou Sangue insuficiente." };
        let alvo = alvoId ? this.vampiros[alvoId] : v; if (alvoId && (!alvo || alvo.estado === 'Banido')) return { erro: "Alvo inválido." };
        v.pontosAcao -= ritual.custoAcao; v.sangue -= ritual.custoSangue;
        const resultado = ritual.efeito(v, alvo, lua); this.ganharXP(vampiroId, 25); this._pontuarMembro(vampiroId, 10);
        this._registrarEventoEspecial('global', 'VÓRTICE MÁGICO', `${v.nome} invocou [${ritual.nome}].`); this._salvarBancoDeDados(); return { sucesso: true, relato: resultado };
    }

    fabricarAlquimia(vampiroId, receitaId) {
        const v = this.vampiros[vampiroId]; const rec = this.alquimia[receitaId]; if(!v || !rec) return { erro: "Falha." }; const c = rec.custo;
        if((v.inventario.anima||0) < (c.anima||0) || (v.inventario.cinzas||0) < (c.cinzas||0) || (v.inventario.vitae||0) < (c.vitae||0) || (v.inventario.memoria||0) < (c.memoria||0) || (v.inventario.ectoplasma||0) < (c.ectoplasma||0) || (v.inventario.pedraAlma||0) < (c.pedraAlma||0) || v.sangue < c.gts) return { erro: "Faltam reagentes mágicos." };
        
        v.inventario.anima -= (c.anima||0); v.inventario.cinzas -= (c.cinzas||0); v.inventario.vitae -= (c.vitae||0); v.inventario.memoria -= (c.memoria||0); v.inventario.ectoplasma -= (c.ectoplasma||0); v.inventario.pedraAlma -= (c.pedraAlma||0); v.sangue -= c.gts;
        
        if (receitaId === 'elixir_estamina') v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + 5);
        if (receitaId === 'amuleto_sombra') v.escudo = true;
        if (receitaId === 'lagrima_prata') v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + 1); 
        if (receitaId === 'extrato_akashico') this.ganharXP(vampiroId, 50);
        if (receitaId === 'ouro_filosofal') v.influencia += 1;
        if (receitaId === 'pedra_filosofal_negra') v.atributos.pontosLivres += 1;
        
        this.ganharXP(vampiroId, 30); this._pontuarMembro(vampiroId, 5); this._salvarBancoDeDados(); return { sucesso: true, relato: `[${rec.nome}] manifestado na aura.` };
    }

    // ==========================================
    // MERCADO (P2P LEILÃO)
    // ==========================================
    anunciarNoLeilao(vampiroId, tipo, quantiaOuHash, preco) {
        const v = this.vampiros[vampiroId]; if (!v || v.nivel < 4 || preco <= 0) return { erro: "Inválido ou Grau insuficiente." };
        let anuncio = { id: this.leilaoIdCounter++, vendedorId: v.id, vendedorNome: v.nome, tipo, preco, data: Date.now() };
        
        if (tipo === 'mortal') {
            const mortal = this.rebanho[quantiaOuHash]; if (!mortal || !mortal.maldicaoArcana || mortal.maldicaoArcana.donoId !== v.id) return { erro: "Alma não pertence a ti." };
            anuncio.hashMortal = quantiaOuHash; anuncio.nomeMortal = mortal.identificadorVisivel; mortal.estado = 'No Leilao'; 
        } else if (tipo === 'reliquia') {
            const itemIdx = v.bolsa.findIndex(i => i.id === quantiaOuHash); if (itemIdx === -1) return { erro: "Item ausente." };
            anuncio.itemObj = v.bolsa[itemIdx]; v.bolsa.splice(itemIdx, 1);
        } else {
            if (!v.inventario[tipo] || v.inventario[tipo] < quantiaOuHash) return { erro: "Material escasso." };
            v.inventario[tipo] -= quantiaOuHash; anuncio.quantia = quantiaOuHash;
        }
        this.leilaoP2P.push(anuncio); this._salvarBancoDeDados(); return { sucesso: true, relato: "Contrato na Feira." };
    }

    comprarDoLeilao(compradorId, anuncioId) {
        const comprador = this.vampiros[compradorId]; const idx = this.leilaoP2P.findIndex(a => a.id === anuncioId);
        if (idx === -1 || comprador.sangue < this.leilaoP2P[idx].preco || compradorId === this.leilaoP2P[idx].vendedorId) return { erro: "Falha na transação." }; 
        const anuncio = this.leilaoP2P[idx]; const vendedor = this.vampiros[anuncio.vendedorId]; comprador.sangue -= anuncio.preco;
        if (vendedor) vendedor.sangue += Math.floor(anuncio.preco * 0.95); 
        
        if (anuncio.tipo === 'mortal') { const mortal = this.rebanho[anuncio.hashMortal]; if (mortal) { mortal.maldicaoArcana.donoId = comprador.id; mortal.maldicaoArcana.donoNome = comprador.nome; mortal.estado = 'Vibrante'; } } 
        else if (anuncio.tipo === 'reliquia') { comprador.bolsa.push(anuncio.itemObj); } 
        else { comprador.inventario[anuncio.tipo] += anuncio.quantia; }
        
        this.leilaoP2P.splice(idx, 1); this._salvarBancoDeDados(); return { sucesso: true, relato: "Transação efetuada." };
    }

    operarCalice(id, quantia, operacao) {
        const v = this.vampiros[id]; if (!v) return { erro: "Vazio." };
        if (operacao === 'depositar') { if (v.sangue < quantia) return { erro: "Sangue Escasso." }; v.sangue -= quantia; v.calice += quantia; this._salvarBancoDeDados(); return { sucesso: true, relato: `${quantia} Gts no Cofre Escuro.` }; } 
        else { if (v.calice < quantia) return { erro: "Fundo Seco." }; v.calice -= quantia; v.sangue += quantia; this._salvarBancoDeDados(); return { sucesso: true, relato: `Fluxo regressou (${quantia} Gts).` }; }
    }

    // ==========================================
    // BIBLIOTECA (JOGADORES INJETAM NO JOGO)
    // ==========================================
    iniciarProjetoEstudo(vampiroId, titulo, tema) {
        const v = this.vampiros[vampiroId]; if (!v || !titulo || !tema) return { erro: "Inválido." };
        if (!v.projetosEstudo) v.projetosEstudo = []; if (v.projetosEstudo.length >= 3) return { erro: "Bancada cheia." };
        const novoProj = { id: crypto.randomBytes(4).toString('hex'), titulo: titulo, tema: tema, conteudo: `[TOMO INICIADO SOB O SANGUE DE ${v.nome}]\nFoco de Estudo: ${tema}\n\n`, dataAtualizacao: Date.now() };
        v.projetosEstudo.push(novoProj); this._salvarBancoDeDados(); return { sucesso: true, projeto: novoProj, relato: `Papiro aberto.` };
    }
    async aprofundarProjeto(vampiroId, projetoId, novaPesquisa) {
        const v = this.vampiros[vampiroId]; if (!v || v.pontosAcao < 1) return { erro: "Sem fúria." };
        const proj = v.projetosEstudo.find(p => p.id === projetoId); if (!proj || !novaPesquisa) return { erro: "Inválido." };
        v.pontosAcao -= 1; const novoTexto = await this.oraculo.consultarBibliotecaAkashica(v, proj.titulo, proj.conteudo, novaPesquisa);
        proj.conteudo += `\n\n--- [REVELAÇÃO AKÁSHICA: ${novaPesquisa}] ---\n` + novoTexto; proj.dataAtualizacao = Date.now();
        this.ganharXP(v.id, 20); this._salvarBancoDeDados(); return { sucesso: true, novoConteudo: proj.conteudo, relato: "Segredos anexados." };
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
    // CICLO TEMPORAL E EVENTOS GLOBAIS
    // ==========================================
   // ==========================================
    // CICLO TEMPORAL, ECONOMIA EXPONENCIAL E O LEVIATÃ
    // ==========================================
   // ==========================================
    // CICLO TEMPORAL E EVENTOS GLOBAIS
    // ==========================================
    tickTemporal() {
        const lua = AstrolabioLunar.obterFaseAtual();
        
        // 1. O RITUAL OCULTO DE LEVIATÃ (Sacrifício Global)
        if (Math.random() > 0.95) { 
            this._registrarEventoEspecial('global', 'SUSSURRO DE LEVIATÃ', `O Oceano Abissal revoltou-se. O pacto exige sacrifício.`, true);
            for (let id in this.vampiros) {
                let v = this.vampiros[id]; if (v.estado === 'Banido') continue;
                let tributoLeviata = Math.floor(v.sangue * 0.10);
                if (tributoLeviata > 1000) {
                    v.sangue -= tributoLeviata; v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + 5); this.ganharXP(v.id, Math.floor(tributoLeviata / 10));
                    if(global.io) global.io.to(`priv_${v.id}`).emit('nova_mensagem', { canal: 'privado', autor: `🌊 LEVIATÃ`, texto: `Levaste um dreno de ${tributoLeviata} Gts ao mar.`, hora: new Date().toLocaleTimeString() });
                }
            }
        }

        // 2. ORQUESTRAÇÃO DA IA: O CERCO DEMONÍACO (NOVO)
        if (Math.random() > 0.96) { // ~4% de chance por minuto
            let vitimas = Object.values(this.vampiros).filter(v => v.estado !== 'Banido' && v.nivel >= 5);
            if (vitimas.length > 0) {
                let alvo = vitimas[Math.floor(Math.random() * vitimas.length)];
                let cercoId = crypto.randomBytes(4).toString('hex');
                let demonName = ["Asmodeus", "Belial", "Pazuzu", "Marchosias"][Math.floor(Math.random()*4)];
                let vidaCerco = alvo.nivel * 5000; // Difícil, precisa de muita pancada
                
                this.cercosAtivos[cercoId] = { id: cercoId, alvoId: alvo.id, alvoNome: alvo.nome, clanNome: alvo.clan, demonio: demonName, hpAtual: vidaCerco, hpMax: vidaCerco, danoTick: alvo.nivel * 50 };
                this._registrarEventoEspecial('global', 'MOTIM DEMONÍACO', `O exército de ${demonName} sitiou a alma de [${alvo.nome}]! Estão a drenar a sua carne implacavelmente! Auxiliem-no no Conclave.`, true);
            }
        }

        // 3. PROCESSAR DANOS DOS CERCOS ATIVOS
        for(let cid in this.cercosAtivos) {
            let cerco = this.cercosAtivos[cid]; let alvo = this.vampiros[cerco.alvoId];
            if(alvo && alvo.estado !== 'Banido') {
                alvo.hpAtual = Math.max(0, alvo.hpAtual - cerco.danoTick); // Drena a vida!
                if(alvo.hpAtual <= 0) alvo.estado = 'Banido';
            }
        }

        for (let hash in this.rebanho) { let m = this.rebanho[hash]; if (m.estado === 'Vibrante' && m.maldicaoArcana) m.sangueAtual = Math.max(1, m.sangueAtual - 1); }
        
        for (let id in this.vampiros) {
            let v = this.vampiros[id]; if (v.estado === 'Banido') continue;
            
            let drenoBase = 5 + Math.floor(v.nivel * 2.5); 
            v.sangue -= drenoBase; 
            
            // Recalcula Max HP passivamente para manter sincronizado com nível
            const atrTot = this._obterAtributosTotais(v);
            v.hpMax = (atrTot.densidade * 200) + (v.nivel * 100) + 1000;
            
            if (v.hpAtual === undefined) v.hpAtual = v.hpMax;

            if (v.sangue <= 0) { v.estado = 'Banido'; this._registrarEventoEspecial('global', 'O FIM DA BESTA', `A Fome roeu ${v.nome}. Virou pó pela falta de Vitae.`); }
            if (v.calice > 0) v.calice += Math.floor(v.calice * 0.02); 
            let recup = lua.id === 'crescente' ? 0.8 : 0.5; if (v.pontosAcao < v.maxAcao && Math.random() > (1 - recup)) v.pontosAcao += 1; 
        }
        
        for (let c in this.clans) { if (this.clans[c].cofre > 0) this.clans[c].cofre -= Math.floor(this.clans[c].cofre * 0.05); }
        
        if (Math.random() > 0.98) {
            const mundos = ["Tempestade de Ectoplasma", "Procissão dos Mortos", "Aurora de Prata"];
            const e = mundos[Math.floor(Math.random()*mundos.length)];
            this._registrarEventoEspecial('global', 'SOPRO DO UMBRAL', `O evento mundial [${e}] derrama bençãos estáticas.`, true);
        }
        if (Math.random() > 0.8) this._salvarBancoDeDados(); 
    }

    _construirFuncoesCustomizadas(feitiçosSalvos) {
        let feitiçosAtivos = {};
        for (let key in feitiçosSalvos) {
            let f = feitiçosSalvos[key];
            f.efeito = (a, d, l) => { if (f.tipo === 'pvp') { d.sangue = Math.max(0, d.sangue - f.poderBase); a.sangue += f.poderBase; return `A Magia [${f.autor}] obliterou. Roubaste ${f.poderBase} Gts.`; } else { a.sangue += f.poderBase; return `Magia [${f.autor}] regenerou ${f.poderBase} Gts.`; } };
            feitiçosAtivos[key] = f;
        } return feitiçosAtivos;
    }

    // ==========================================
    // UMBRAL, EGRÉGORAS E GOÉCIA
    // ==========================================
    explorarUmbral(vampiroId, reinoId) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Alma inexistente." };
        const reinos = { 'gamaliel': { nome: "Gamaliel", custo: 2, recM: 'ectoplasma', recN: "Ectoplasma", risco: 30, gnoseReq: 5 }, 'samael': { nome: "Samael", custo: 3, recM: 'pedraAlma', recN: "Pedra da Alma", risco: 50, gnoseReq: 15 }, 'thaumiel': { nome: "Thaumiel", custo: 5, recM: 'memoria', recN: "Memória Ancestral", risco: 75, gnoseReq: 25 } };
        const reino = reinos[reinoId]; if (!reino || v.pontosAcao < reino.custo) return { erro: `Inválido ou falta Fúria.` };
        const gnoseTotal = this._obterAtributosTotais(v).gnose; if (gnoseTotal < reino.gnoseReq) return { erro: `Exige ${reino.gnoseReq} Gnose.` };
        
        v.pontosAcao -= reino.custo; let chanceVitoria = Math.min(95, 100 - reino.risco + (gnoseTotal * 2)); 
        if (Math.random() * 100 > chanceVitoria) { const dano = reino.risco * 20; v.sangue = Math.max(0, v.sangue - dano); this._salvarBancoDeDados(); return { erro: `Repelido! Perdeste ${dano} Gts.`, sucesso: false }; }

        let qtDrop = 1 + Math.floor(Math.random() * 2); v.inventario[reino.recM] = (v.inventario[reino.recM] || 0) + qtDrop;
        this.ganharXP(vampiroId, reino.custo * 15); this._pontuarMembro(vampiroId, 5); this._salvarBancoDeDados(); return { sucesso: true, relato: `Sobreviveste. +${qtDrop}x [${reino.recN}].` };
    }

    _pesarBalanca(raca, peso) {
        if (raca === 'vampiro') this.balancaCosmica.tiamat += peso; else if (raca === 'lycan') this.balancaCosmica.seth += peso;
        const dif = this.balancaCosmica.tiamat - this.balancaCosmica.seth; let novoRegente = 'Equilíbrio';
        if (dif > 1500) novoRegente = 'Tiamat (Vampiros)'; if (dif < -1500) novoRegente = 'Seth (Lycanos)';
        if (novoRegente !== this.balancaCosmica.regente && novoRegente !== 'Equilíbrio') { this.balancaCosmica.regente = novoRegente; this._registrarEventoEspecial('global', 'MUDANÇA DE ERA', `A linhagem de ${novoRegente} assumiu a Regência!`); }
    }
    _pontuarMembro(vId, pts) { const v = this.vampiros[vId]; if(v) this._pesarBalanca(v.raca, pts); }

    nutrirEgregoraClã(vampiroId, material) {
        const v = this.vampiros[vampiroId]; if (!v || v.clan === 'Sangue Ralo') return { erro: "Sem clã." };
        const clan = this.clans[v.clan]; if (!clan.egregora) clan.egregora = { nivel: 1, xp: 0, xpProx: 100, poder: 'Dormência' };
        let xpGanha = 0;
        if (material === 'ectoplasma' && v.inventario.ectoplasma > 0) { v.inventario.ectoplasma--; xpGanha = 10; } else if (material === 'pedraAlma' && v.inventario.pedraAlma > 0) { v.inventario.pedraAlma--; xpGanha = 25; } else return { erro: "Falta Ectoplasma ou Pedra da Alma." };

        clan.egregora.xp += xpGanha; this.ganharXP(v.id, xpGanha * 2); this._pontuarMembro(v.id, xpGanha);
        let upou = false; if (clan.egregora.xp >= clan.egregora.xpProx) { clan.egregora.nivel++; clan.egregora.xp -= clan.egregora.xpProx; clan.egregora.xpProx = Math.floor(clan.egregora.xpProx * 1.5); upou = true; this._registrarEventoEspecial('global', 'EGRÉGORA ACORDOU', `A Egrégora de [${clan.nome}] ascendeu (Nv ${clan.egregora.nivel}).`); }
        this._salvarBancoDeDados(); return { sucesso: true, relato: `Domínio reforçado.` + (upou ? " A EGRÉGORA CRESCEU!" : "") };
    }

    invadirCriptaInimiga(vampiroId, clanAlvoNome) {
        const v = this.vampiros[vampiroId]; if (!v || v.clan === 'Sangue Ralo' || v.clan === clanAlvoNome || v.pontosAcao < 5) return { erro: "Invalido ou sem fúria." };
        const clanInimigo = this.clans[clanAlvoNome]; const meuClan = this.clans[v.clan]; if (!clanInimigo || clanInimigo.cofre < 1000) return { erro: "Cripta pobre." };
        v.pontosAcao -= 5;
        let poderAtaque = (this._obterAtributosTotais(v).vontade * 10) + (this._obterAtributosTotais(v).gnose * 10) + (meuClan.egregora ? meuClan.egregora.nivel * 50 : 0) + Math.random() * 100;
        let poderDefesa = (clanInimigo.egregora ? clanInimigo.egregora.nivel * 80 : 0) + 150 + Math.random() * 100;

        if (poderAtaque > poderDefesa) {
            let roubo = Math.floor(clanInimigo.cofre * (0.05 + Math.random() * 0.1)); clanInimigo.cofre -= roubo; meuClan.cofre += roubo;
            this.ganharXP(v.id, 100); this._pontuarMembro(v.id, 50); this._registrarEventoEspecial('guerra', 'MURALHAS RUÍRAM', `${v.nome} invadiu [${clanAlvoNome}] e saqueou ${roubo} Gts.`); this._salvarBancoDeDados(); return { sucesso: true, relato: `Invasão perfeita! Roubaste ${roubo} Gts.` };
        } else {
            let danoRefletido = 500 + (clanInimigo.egregora ? clanInimigo.egregora.nivel * 100 : 0); v.sangue = Math.max(0, v.sangue - danoRefletido); this._salvarBancoDeDados(); return { erro: `A Egrégora repeliu-te! Perdeste ${danoRefletido} Gts.` };
        }
    }

    abrirSeloGoetico(vampiroId) {
        const v = this.vampiros[vampiroId]; if (!v || v.sangue < 3000 || v.pontosAcao < 10) return { erro: "Falta poder." }; if (this.evocacaoAtiva) return { erro: "O véu já está rasgado!" };
        v.sangue -= 3000; v.pontosAcao -= 10;
        // HPs COLOSSAIS para forçar batalhas de atrito com a nova Arena
        const demonios = [{ nome: "Rei Bael (A Besta)", hpMax: 300000, desc: "Caos cego." }, { nome: "Duque Agares", hpMax: 250000, desc: "Destruição da honra." }, { nome: "Rei Paimon", hpMax: 400000, desc: "Impenetrável." }];
        const demon = demonios[Math.floor(Math.random() * demonios.length)];
        this.evocacaoAtiva = { id: crypto.randomBytes(4).toString('hex'), nome: demon.nome, desc: demon.desc, hpMax: demon.hpMax, hpAtual: demon.hpMax, evocador: v.nome, participantes: {} };
        this._pontuarMembro(v.id, 100); this.ganharXP(v.id, 200);
        setTimeout(async () => { const grito = await this.oraculo.vozDoDemonio(demon.nome, "invocação", `Invocado por ${v.nome}.`); if (global.io) global.io.to('global').emit('nova_mensagem', { canal: 'global', autor: `🔥 ${demon.nome}`, texto: grito, hora: new Date().toLocaleTimeString() }); }, 3000);
        this._registrarEventoEspecial('global', 'EVOCAÇÃO GOÉTICA', `${v.nome} abriu o Selo de ${demon.nome} (${demon.hpMax} HP). Unam-se!`); this._salvarBancoDeDados(); return { sucesso: true, relato: `A Terra rasgou-se.` };
    }

    async testarVontadeDemonio(vampiroId, ritmo) {
        const v = this.vampiros[vampiroId]; const demonio = this.evocacaoAtiva; if (!v || !demonio || v.pontosAcao < 3) return { erro: "Falha." };
        v.pontosAcao -= 3; const atr = this._obterAtributosTotais(v); 
        
        // O dano no Boss mundial escala MASSIVAMENTE com o combo da Arena
        let impacto = Math.floor(((atr.vontade * 15) + (atr.gnose * 20) + (atr.densidade * 5) + Math.random() * 500) * (ritmo.multiplicadorGeral * 2));

        if (Math.random() > 0.8) { 
            let revide = Math.floor(Math.random() * 5000) + 1000; 
            v.sangue = Math.max(0, v.sangue - revide); this._salvarBancoDeDados(); 
            if (v.sangue <= 0) v.estado = 'Banido'; 
            return { erro: `O Demónio trespassou-te! Sofreste ${revide} dano.`, sucesso: false }; 
        }

        demonio.hpAtual -= impacto; if (!demonio.participantes[v.id]) demonio.participantes[v.id] = { nome: v.nome, dano: 0 }; demonio.participantes[v.id].dano += impacto;
        let relatoDano = `[Combo ${ritmo.multiplicadorGeral}x] Os mantras colidiram, causando ${impacto} de submissão em ${demonio.nome}.`;

        if (demonio.hpAtual <= 0) {
            relatoDano = `QUEBRASTE A VONTADE DE ${demonio.nome}!`; let relatorioLoot = `🔥 ${demonio.nome} subjugado! Recompensas:\n`;
            for (let pid in demonio.participantes) { let l = this.vampiros[pid]; if (l) { l.influencia += 50; l.atributos.pontosLivres += 2; l.inventario.pedraAlma = (l.inventario.pedraAlma || 0) + 5; l.inventario.demoniosSubjugados = (l.inventario.demoniosSubjugados||0)+1; relatorioLoot += `> [${l.nome}]: +50 Inf, +5 Pedras, +2 Esferas Livres!\n`; } }
            setTimeout(async () => { const gritoFinal = await this.oraculo.vozDoDemonio(demonio.nome, "derrota", `Subjugado por ${v.nome}.`); if (global.io) global.io.to('global').emit('nova_mensagem', { canal: 'global', autor: `🔥 ${demonio.nome} (Sendo Banido)`, texto: gritoFinal, hora: new Date().toLocaleTimeString() }); }, 2000);
            this._registrarEventoEspecial('global', 'VITÓRIA GOÉTICA', relatorioLoot); this.evocacaoAtiva = null; this._pontuarMembro(v.id, 500); 
        }
        this.ganharXP(v.id, 100 * ritmo.multiplicadorGeral); this._salvarBancoDeDados(); return { sucesso: true, relato: relatoDano, hpRestante: demonio ? Math.max(0, demonio.hpAtual) : 0 };
    }

    obliterarHerege(adminId, alvoId) {
        const admin = this.vampiros[adminId]; if (!admin || admin.geracao !== 1) return { erro: "Heresia." };
        const alvo = this.vampiros[alvoId]; if (!alvo || alvo.id === admin.id) return { erro: "Inválido." };
        if (alvo.clan !== 'Sangue Ralo' && this.clans[alvo.clan]) this.clans[alvo.clan].membros = this.clans[alvo.clan].membros.filter(id => id !== alvoId);
        const nomeMorto = alvo.nome; delete this.vampiros[alvoId];
        this._registrarEventoEspecial('global', 'OBLITERAÇÃO DIVINA', `O Primordial deletou [${nomeMorto}].`, true); this._salvarBancoDeDados(); return { sucesso: true, relato: `Obliterado.` };
    }	

// COLE O TRECHO AQUI DENTRO DA CLASSE
    registrarVampiro(dados) {
        const { nome, senha, raca, tgId, convidadoPor } = dados;
        
        let geracao = 13; 
        let linhagem = "Nenhuma";
        let status = "Sangue Ralo";

        if (convidadoPor && this.vampiros[convidadoPor]) {
            const pai = this.vampiros[convidadoPor];
            geracao = pai.geracao + 1;
            linhagem = pai.linhagem !== "Nenhuma" ? pai.linhagem : pai.nome;
            status = "Descendente";
        } else {
            geracao = 10; 
            linhagem = nome; 
            status = "Fundador Errante";
        }

        const novoVampiro = {
            id: crypto.randomUUID(),
            nome,
            senha, 
            raca,
            tgId,
            geracao,
            linhagem,
            status,
            xp: 0,
            lvl: 1,
            // Importante: Garanta que os atributos básicos de combate/status estejam aqui
            hp: 100,
            energia: 100,
            inventario: []
        };

        this.vampiros[novoVampiro.id] = novoVampiro;
        this._salvarBancoDeDados();
        return novoVampiro;
    }
}
module.exports = { ShadowCore, AstrolabioLunar };