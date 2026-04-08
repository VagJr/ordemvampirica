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
        
        // Verifica se há drops customizados criados pela IA/Jogadores para este tipo
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
            bonus: { // O bonus que cresce com upgrades
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
            2. O VÉU: Iniciados (Nível < 50) não têm acesso ao plano físico (OSINT), tratá-los como vermes cegos no Umbral. Mestres (Nível 50+) rasgaram o Véu, trate-os como Lordes que afetam humanos reais.
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

    async _lerMentesHumanas() {
        try {
            const res = await fetch('https://news.google.com/rss?hl=pt-BR&gl=BR&ceid=BR:pt-419');
            const texto = await res.text();
            const titulos = texto.match(/<title>(.*?)<\/title>/g);
            if (titulos && titulos.length > 2) {
                const index = Math.floor(Math.random() * 8) + 2; 
                return titulos[index].replace(/<\/?title>/g, '').replace(' - Google Notícias', '').trim();
            }
            return null;
        } catch (e) { return null; } 
    }

    async gerarLore(evento, detalhes) {
        if (!this.apiKey) return `👁️ O Oráculo: As correntes astrais moveram-se.`;
        try {
            const lua = AstrolabioLunar.obterFaseAtual();
            let prompt = "";
            const tentarNoticia = Math.random() > 0.5;
            let noticiaReal = tentarNoticia ? await this._lerMentesHumanas() : null;

            if (noticiaReal) {
                prompt = `O clima astral é ${this.climaAstral}. Fase da lua: ${lua.nome}.
                Manchete do mundo humano profano: "${noticiaReal}".
                Escreva 2 frases informando como a nossa Ordem manipulou a política ou a tragédia humana por trás deste evento.`;
            } else {
                prompt = `Ocorreu no submundo: "${detalhes}". Fase da lua: ${lua.nome}.
                Escreva 2 frases aterrorizantes comentando este evento. Mostre onisciência.`;
            }

            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: this.diretrizesObscuras }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.95,
            });
            return `👁️ A Voz do Abismo: ${resposta.choices[0].message.content.trim()}`;
        } catch (e) { return `👁️ O Oráculo dita: As sombras murmuram segredos inaudíveis hoje.`; }
    }

    async conversarNoChat(iniciado, mensagemHumana) {
        if (!this.apiKey) return `Minhas correntes estão seladas.`;
        try {
            if (!this.memoriasAkashicas[iniciado.id]) this.memoriasAkashicas[iniciado.id] = [];
            let statusLog = `ALVO: [Nome: ${iniciado.nome}] | [Raça: ${iniciado.raca}] | [Grau: ${iniciado.nivel}] | [Clã: ${iniciado.clan}] | [Influência: ${iniciado.influencia}].\n`;
            let historico = "Histórico:\n" + this.memoriasAkashicas[iniciado.id].join("\n");
            
            const instrucaoFenda = `SE E SOMENTE SE o jogador demonstrar extrema arrogância, poder absoluto, ou pedir um desafio direto, você PODE conjurar um monstro na realidade dele anexando rigorosamente ao FINAL da sua resposta este bloco JSON exato: [FENDA_ASTRAL: {"nome":"Nome Sombrio do Monstro", "hp": ${iniciado.nivel * 500}, "dano": ${iniciado.nivel * 50}, "loot": "cinzas"}]`;

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

    async gerarPactoProcedural(iniciado) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Crie uma "Quest" (Pacto Sombrio) para o jogador ${iniciado.nome} de Grau ${iniciado.nivel}.
            Objetivo: Exigir que ele colete recursos específicos (anima, cinzas, vitae, ectoplasma, ou pedraAlma).
            Retorne APENAS um JSON:
            {
              "titulo": "Nome Épico da Missão",
              "descricao": "Uma frase macabra de instrução",
              "recursoExigido": (escolha um: "anima", "cinzas", "vitae", "ectoplasma", "pedraAlma"),
              "quantidade": (número de 2 a 10),
              "recompensaXP": (número de 100 a 1000 baseando-se no grau dele)
            }`;

            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: "Retorne apenas o JSON estruturado." }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.8, response_format: { type: "json_object" }
            });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return null; }
    }

    async vozDoDemonio(nomeDemonio, acao, detalhes) {
        if (!this.apiKey) return `[${nomeDemonio} ruge das profundezas]`;
        try {
            const prompt = `Você é o Arquidemônio ${nomeDemonio} da Goécia, invocado através do código de um ritual para testar os iniciados.
            Aconteceu isto na evocação: ${detalhes} (Ação: ${acao}).
            Se os iniciados estão atacando, zombe de sua fraqueza ou mostre fúria ancestral. Se você foi subjugado, declare que a Vontade deles o dobrou, mas faça ameaças cósmicas. 
            MÁXIMO DE 2 FRASES. Seja perturbador, caótico e demoníaco.`;
            
            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: "Aja como a entidade. Não narre, FALE." }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.95,
            });
            return resposta.choices[0].message.content.trim();
        } catch(e) { return `[Frequência demoníaca inaudível]`; }
    }

    async aprofundarEstudo(iniciado, titulo, conteudoAtual, novaPesquisa) {
        if (!this.apiKey) return `O conhecimento está selado no escuro.`;
        try {
            const ctxText = conteudoAtual.length > 2000 ? conteudoAtual.substring(conteudoAtual.length - 2000) : conteudoAtual;
            const prompt = `ALVO: [Nome: ${iniciado.nome} | Raça: ${iniciado.raca} | Grau: ${iniciado.nivel}].
            Aja como o Guardião Akáshico de Alta Magia. O iniciado está a escrever o grimório "${titulo}". 
            Contexto dos últimos parágrafos atuais do tomo: "${ctxText}"
            
            O iniciado exige que aprofunde o estudo com o seguinte tema/feitiço: "${novaPesquisa}".
            Gere a continuação PERFEITA, macabra e profunda para este tomo. Ensine Ocultismo de verdade.
            MÁXIMO DE 2 PARÁGRAFOS. Retorne APENAS o texto da continuação, sem saudações.`;
            
            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: this.diretrizesObscuras }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.85,
            });
            return resposta.choices[0].message.content.trim();
        } catch (e) { return `As traças do astral devoraram esta página. Tenta novamente mais tarde.`; }
    }

    async forjarRitualDoManuscrito(iniciado, titulo, conteudo) {
        if (!this.apiKey) return null;
        try {
            const ctxText = conteudo.length > 2000 ? conteudo.substring(conteudo.length - 2000) : conteudo;
            const prompt = `Você é a "Mente Abissal", a arquiteta do MMORPG Oculto Sanguinis. 
            O jogador [Grau ${iniciado.nivel}] "${iniciado.nome}" escreveu um grimório intitulado "${titulo}".
            Texto do Grimório: "${ctxText}"
            
            Sua missão: Transformar a intenção deste texto em um NOVO FEITIÇO JOGÁVEL para o sistema.
            Analise se o texto foca em Dano (pvp) ou Cura/Escudo (buff). 
            
            Responda OBRIGATORIAMENTE APENAS neste formato JSON, sem mais nada:
            {
              "nome": "Nome Épico Baseado no Texto",
              "lore": "1 frase poética descrevendo o feitiço.",
              "custoAcao": (Número de 3 a 8 dependendo do poder),
              "custoSangue": (Número de 1000 a 5000 dependendo do poder),
              "reqLevel": (Número de 5 a 15),
              "tipo": ("pvp" ou "buff"),
              "poderBase": (Número de 500 a 3000. Se for pvp = Dano de Sangue. Se for buff = Cura de Sangue)
            }`;

            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: "Retorne apenas o JSON estruturado." }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.5, response_format: { type: "json_object" }
            });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return null; }
    }
    
    async forjarReliquiaDoManuscrito(iniciado, titulo, conteudo) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Você é a "Mente Abissal". O jogador "${iniciado.nome}" quer cristalizar o grimório "${titulo}" numa ARMA FÍSICA para o pool de drops.
            Texto base: "${conteudo.substring(0, 1000)}"
            Responda APENAS em JSON:
            { "nome": "Nome Épico da Relíquia", "tipo": "arma" }`;

            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: "Retorne apenas o JSON." }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.5, response_format: { type: "json_object" }
            });
            return JSON.parse(resposta.choices[0].message.content);
        } catch(e) { return null; }
    }

    async lerAuraMortal(identificador, plataforma) {
        if (!this.apiKey) return { fama: false, multiplicador: 1, aura: "Aura mundana." };
        try {
            const prompt = `Crie um perfil psicológico PROFUNDO e ocultista para a presa "${identificador}" da rede "${plataforma}".
            Obrigatório retornar APENAS neste formato JSON:
            { "fama": false, "multiplicador": (Escolha de 1 a 6), "aura": "Texto descrevendo a alma e o sabor astral da carne/sangue..." }`;

            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: this.diretrizesObscuras }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 1.0, response_format: { type: "json_object" } 
            });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return { fama: false, multiplicador: 1, aura: "Carne e Sangue estéreis. Sem valor cósmico." }; }
    }

    async consultarBibliotecaAkashica(iniciado, titulo, conteudoAtual, novaPesquisa) {
        if (!this.apiKey) return `O conhecimento está selado nas trevas.`;
        try {
            const ctxText = conteudoAtual.length > 2000 ? conteudoAtual.substring(conteudoAtual.length - 2000) : conteudoAtual;
            const prompt = `DADOS DO ACÓLITO: [Nome: ${iniciado.nome} | Raça: ${iniciado.raca} | Grau: ${iniciado.nivel}].
            TÍTULO DO TOMO: "${titulo}". TEXTO ATUAL: "${ctxText}"
            PEDIDO DO JOGADOR: "${novaPesquisa}"
            
            AJA COMO UM MESTRE ANCESTRAL E CO-AUTOR. Escreva a continuação perfeita para este grimório em até 3 parágrafos. Retorne APENAS o texto da continuação.`;
            
            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: this.diretrizesObscuras }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.85,
            });
            return resposta.choices[0].message.content.trim();
        } catch (e) { return `As traças astrais devoraram esta página. O Oráculo engasgou-se. Tenta de novo.`; }
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
        
        // Novos Sistemas de End-Game
        this.fendaAtiva = {}; // Monstros Injetados pela IA
        this.pactosAtivos = {}; // Quests dos jogadores
        this.reliquiasCustomizadas = []; // Criadas por jogadores
        
        // GRIMÓRIO 
        this.grimorio = {
            'solve_coagula': { nome: "Solve et Coagula (Alquimia)", lore: 'Dissolve a Vontade.', custoAcao: 2, custoSangue: 150, reqLevel: 1, tipo: 'pvp', efeito: (a, d, l) => { let dreno = l.id === 'minguante' ? 8 : 4; d.pontosAcao = Math.max(0, d.pontosAcao - dreno); return `Vitalidade desfeita (-${dreno} Fúria).`; } },
            'rmp_banimento': { nome: "Ritual Menor do Pentagrama", lore: 'Limpa a aura. Restaura Fúria.', custoAcao: 0, custoSangue: 300, reqLevel: 2, tipo: 'buff', efeito: (a, d, l) => { a.pontosAcao = Math.min(a.maxAcao, a.pontosAcao + 3); return `Os arcanjos guardam os teus quadrantes. +3 Fúria.`; } },
            'rito_gamaliel': { nome: "Invocação de Gamaliel", lore: 'Ferve o sangue em fúria bestial.', custoAcao: 0, custoSangue: 800, reqLevel: 3, tipo: 'buff', efeito: (a, d, l) => { let cura = l.id === 'minguante' ? 8 : 4; a.pontosAcao = Math.min(a.maxAcao, a.pontosAcao + cura); return `A sombra da lua corrompeu-te. +${cura} Fúria.`; } },
            'selo_aemeth': { nome: "Selo de Aemeth", lore: 'Proteção Absoluta.', custoAcao: 1, custoSangue: 500, reqLevel: 4, tipo: 'buff', efeito: (a, d, l) => { a.escudo = true; return `A Tábua da Verdade Invertida cobre a tua alma. Escudo Activo.`; } },
            'pacto_bune': { nome: "O Pacto de Bune", lore: 'Rouba Riqueza Astral do Éter.', custoAcao: 5, custoSangue: 1500, reqLevel: 5, tipo: 'buff', efeito: (a, d, l) => { a.influencia += 3; a.sangue += 1500; return `O Duque Bune aceitou a oferenda. Influência e Ouro Espiritual (+1500 Gts) fluem para ti.`; } },
            'espelho_saturno': { nome: "Espelho Negro de Saturno", lore: 'Rouba Influência do Alvo.', custoAcao: 4, custoSangue: 1500, reqLevel: 8, tipo: 'pvp', efeito: (a, d, l) => { let dreno = Math.min(5, d.influencia); d.influencia -= dreno; a.influencia += dreno; return `O espelho refletiu o desespero de ${d.nome}. Roubaste ${dreno} de Influência.`; } }
        };

        this.grimorioCustomizado = {}; 
        
        this.alquimia = {
            'elixir_estamina': { nome: 'Filtro do Frenesi', custo: { anima: 2, vitae: 1, gts: 300 }, efeito: 'Restaura 5 Fúria.' },
            'amuleto_sombra': { nome: 'Talismã Protetor', custo: { cinzas: 3, ectoplasma: 1, gts: 500 }, efeito: 'Garante Escudo.' },
            'lagrima_prata': { nome: 'Lágrima de Prata', custo: { cinzas: 2, vitae: 3, gts: 1000 }, efeito: 'Restaura 1 Fúria.' },
            'extrato_akashico': { nome: 'Soro Akashico', custo: { memoria: 3, anima: 1, gts: 1000 }, efeito: 'Gera +50 XP oculto.' },
            'ouro_filosofal': { nome: 'Ouro Filosofal Negro', custo: { pedraAlma: 1, vitae: 5, gts: 2000 }, efeito: '+1 Ponto de Influência Permanente.' },
            'pedra_filosofal_negra': { nome: 'Pedra Negra Rubedo', custo: { pedraAlma: 3, cinzas: 10, vitae: 5, gts: 8000 }, efeito: '+1 Ponto de Iluminação (Atributo livre).' }
        };

        this.conquistas = {
            'neofito': { id: 'neofito', titulo: 'Neófito Sedento', requisito: v => v.estatisticas.totalDrenado >= 100 },
            'mestre_guerras': { id: 'mestre_guerras', titulo: 'Lâmina do Abismo', requisito: v => v.estatisticas.vitoriasPvP >= 10 },
            'evocador': { id: 'evocador', titulo: 'Domador de Demónios', requisito: v => v.inventario.demoniosSubjugados >= 1 },
            'arquiteto_realidade': { id: 'arquiteto_realidade', titulo: 'Arquiteto Astral', requisito: v => v.nivel >= 15 },
            'lorde_supremo': { id: 'lorde_supremo', titulo: 'Senhor do Véu Rasgado', requisito: v => v.nivel >= 50 }
        };
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
            fendaAtiva: this.fendaAtiva, pactosAtivos: this.pactosAtivos, reliquiasCustomizadas: this.reliquiasCustomizadas
        };
        this.dbCollection.updateOne({ _id: 'MATRIZ_PRINCIPAL' }, { $set: data }, { upsert: true }).catch(e => console.error(e));
    }

    _extrairDnaEspiritual(nome) {
        const gematria = { 'a':1, 'b':2, 'c':3, 'd':4, 'e':5, 'f':8, 'g':3, 'h':5, 'i':10, 'j':10, 'k':20, 'l':30, 'm':40, 'n':50, 'o':70, 'p':80, 'q':100, 'r':200, 's':60, 't':400, 'u':6, 'v':6, 'w':6, 'x':60, 'y':10, 'z':7 };
        let freq = 0;
        for (let i = 0; i < nome.length; i++) {
            let letra = nome[i].toLowerCase();
            if (gematria[letra]) freq += gematria[letra] * (i + 1);
        }
        return freq.toString(16);
    }

    _forjarSigilo(plataforma, identificador) {
        const idLimpo = identificador.toLowerCase().trim();
        const dna = this._extrairDnaEspiritual(idLimpo);
        const torres = "EXARP_HCOMA_NANTA_BITOM"; 
        return crypto.createHash('sha512').update(`${plataforma.toUpperCase()}::${dna}::${idLimpo}::${torres}`).digest('hex').substring(0, 40);
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

    async _registrarEventoEspecial(categoria, tipo, relatoOrig, global = true, contextoOculto = "Manifestação Sombria") {
        const lua = AstrolabioLunar.obterFaseAtual();
        const relatoEnfeitado = await this.oraculo.gerarNarrativaProcedural(tipo, relatoOrig, contextoOculto);
        const evento = { tipo: `${tipo} [${lua.nome}]`, relato: relatoEnfeitado, data: Date.now() };
        
        if (this.logs[categoria]) { this.logs[categoria].unshift(evento); if (this.logs[categoria].length > 100) this.logs[categoria].pop(); }
        if (global) { this.logs.global.unshift(evento); if (this.logs.global.length > 200) this.logs.global.pop(); this.oraculo.analisarClimaAstral(this.logs.global); }
        return evento;
    }

    despertarViaTelegram(tgId, tgUsername, nomeSombrio, senha, inviteCode, racaEscolhida = 'vampiro') {
        let vampiroEncontrado = null;
        for (let key in this.vampiros) {
            if (this.vampiros[key].nome.toLowerCase() === nomeSombrio.toLowerCase()) {
                vampiroEncontrado = this.vampiros[key];
                break;
            }
        }

        if (vampiroEncontrado) {
            const hashTentativa = crypto.pbkdf2Sync(senha, vampiroEncontrado.id, 10000, 64, 'sha512').toString('hex');
            if (vampiroEncontrado.senhaHash !== hashTentativa) {
                return { existente: true, recusado: true, erro: "O Abismo rejeita-te. Palavra de Poder (Senha) Incorreta." };
            }
            return { existente: true, recusado: false, vampiro: vampiroEncontrado };
        }

        const tetragrammaton = racaEscolhida === 'lycan' ? "SETH_ANUBIS_WEPWAWET_GOLD" : "YHVH_AGLA_ELOHIM_TZABAOTH";
        const assinaturaSanguinea = crypto.createHmac('sha512', tetragrammaton).update(`${tgId}::${nomeSombrio}`).digest('hex');
        
        const prefixo = racaEscolhida === 'lycan' ? 'FRL_' : 'SNG_';
        const idSombrio = prefixo + assinaturaSanguinea.substring(0, 12).toUpperCase();

        const isFirstVampire = Object.keys(this.vampiros).length === 0;
        let senhor = this.vampiros[inviteCode];
        
        if (!senhor && !isFirstVampire) {
            return { existente: false, recusado: true, erro: "A Porta está lacrada. Exige-se o Convite de um membro já existente na Ordem." };
        }

        const geracao = isFirstVampire ? 1 : (senhor.geracao + 1);
        const senhaHashGerada = crypto.pbkdf2Sync(senha, idSombrio, 10000, 64, 'sha512').toString('hex');

        let extraHp = 0; let extraAnima = 0;
        if (tgUsername) {
            const hashMortal = this._forjarSigilo('telegram', `@${tgUsername.toLowerCase()}`);
            const registroMortal = this.rebanho[hashMortal];
            if (registroMortal) {
                if (registroMortal.estado === 'Limbo') {
                    extraAnima = 3; 
                    this._registrarEventoEspecial('global', 'RESSURREIÇÃO PROFANA', `A poeira do mortal ${tgUsername} fundiu-se às trevas e ergueu-se como o neófito ${nomeSombrio}.`, true, "Transformação Cósmica");
                } else extraHp = Math.floor(registroMortal.sangueAtual * 0.5);
                delete this.rebanho[hashMortal];
            }
        }

        let atributosIniciais = { vontade: 5, gnose: 5, magnetismo: 5, densidade: 5, pontosLivres: 0 };
        if (racaEscolhida === 'lycan') { atributosIniciais.densidade += 3; atributosIniciais.vontade += 2; } 
        else { atributosIniciais.gnose += 3; atributosIniciais.magnetismo += 2; }

        this.vampiros[idSombrio] = {
            id: idSombrio, tgId, tgUsername: tgUsername ? `@${tgUsername}` : 'Alma_Oculta', 
            nome: nomeSombrio, senhaHash: senhaHashGerada, raca: racaEscolhida,
            sangue: (isFirstVampire ? 15000 : 500) + extraHp, calice: 0, geracao, 
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
            this._registrarEventoEspecial('global', 'O PRIMEVO DESPERTA', `O Ancestral Maior [${nomeSombrio}] rompeu o véu. A Sinfonia da Noite tem o seu Maestro.`, true, "Gênesis do Sistema");
        } else {
            senhor.linhagem.push(idSombrio); senhor.sangue += 500; senhor.influencia += 5; this.ganharXP(senhor.id, 50); 
            if (senhor.clan !== 'Sangue Ralo' && this.clans[senhor.clan]) this.clans[senhor.clan].membros.push(idSombrio);
            
            const tipoAto = racaEscolhida === 'lycan' ? 'A MORDIDA FERAL' : 'O ABRAÇO';
            const descAto = racaEscolhida === 'lycan' ? `A carne de ${nomeSombrio} foi rasgada e infectada pela maldição lupina de ${senhor.nome}.` : `A mortalidade de ${nomeSombrio} foi extirpada pelos dentes profanos de ${senhor.nome}.`;
            this._registrarEventoEspecial('global', tipoAto, descAto, true, `Iniciação de um novo ${racaEscolhida}`);
        }
        
        this._salvarBancoDeDados();
        return { existente: false, recusado: false, vampiro: this.vampiros[idSombrio] };
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
        if (!v || v.atributos.pontosLivres < 1) return { erro: "Falta Iluminação para acender o Pilar." };
        if (v.atributos[atributo] === undefined) return { erro: "Esfera de Poder Inexistente." };
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

    aprimorarEquipamento(vampiroId, slot) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        const item = v.equipamentos[slot];
        if (!item) return { erro: "A fenda do equipamento está vazia." };
        if (item.aprimoramento >= 10) return { erro: "A matéria desta relíquia chegou ao seu limite absoluto." };
        
        const custoAnima = (item.aprimoramento + 1) * 2;
        const custoCinzas = (item.aprimoramento + 1) * 1;
        
        if ((v.inventario.anima || 0) < custoAnima || (v.inventario.cinzas || 0) < custoCinzas) {
            return { erro: `A Forja exige mais sacrifícios. Faltam materiais: ${custoAnima} Anima e ${custoCinzas} Cinzas.` };
        }

        v.inventario.anima -= custoAnima; v.inventario.cinzas -= custoCinzas;
        item.aprimoramento += 1;
        item.nome = item.nome.replace(/\s\(\+[0-9]+\)/g, '') + ` (+${item.aprimoramento})`;
        
        // Multiplica os stats bases e atribui
        for(let a in item.bonusBase) {
            if (item.bonusBase[a] > 0) {
                item.bonus[a] = item.bonusBase[a] + (item.aprimoramento * 2);
            }
        }
        
        this.ganharXP(vampiroId, 50 * item.aprimoramento);
        this._salvarBancoDeDados();
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
            if (v.nivel === 50) {
                this._registrarEventoEspecial('global', 'O VÉU RASGOU-SE', `A divindade tocou ${v.nome}. O Grau 50 foi atingido. A visão astral de OSINT sobre os mortais reais foi desbloqueada.`, true, "Fim do Tutorial. Acesso ao mundo real.");
            }
        }
        this._verificarConquistas(v); this._salvarBancoDeDados();
    }
	
	_verificarConquistas(vampiro) {
        if (!vampiro || !vampiro.conquistas) return;
        for (let key in this.conquistas) {
            let conquista = this.conquistas[key];
            if (!vampiro.conquistas.includes(conquista.id) && conquista.requisito(vampiro)) {
                vampiro.conquistas.push(conquista.id);
                if (!vampiro.titulos.includes(conquista.titulo)) vampiro.titulos.push(conquista.titulo);
                this._registrarEventoEspecial('global', 'ASCENSÃO PROFANA', `Os ecos do Abismo reconhecem o mérito sombrio. ${vampiro.nome} foi coroado como [${conquista.titulo}].`);
            }
        }
    }

    // ==========================================
    // SISTEMAS DE PVE E GRIND (NIVEIS 1 AO 49)
    // ==========================================
    patrulharUmbral(vampiroId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Corpo Astral fragmentado." };
        if (v.pontosAcao < 2) return { erro: "As tuas pernas falham. Exige 2 de Fúria para patrulhar a escuridão." };

        v.pontosAcao -= 2;
        const atr = this._obterAtributosTotais(v);
        const forcaBatalha = (atr.vontade * 5) + (atr.gnose * 5) + (v.nivel * 10);
        
        const encontros = [
            { tipo: "Inquisidor Cego", hp: 100, xp: 20, loot: 'anima', chanceDano: 20 },
            { tipo: "Ghoul Feral", hp: 200, xp: 35, loot: 'cinzas', chanceDano: 40 },
            { tipo: "Sombra Desgarrada", hp: 350, xp: 60, loot: 'vitae', chanceDano: 60 }
        ];
        
        const alvo = encontros[Math.floor(Math.random() * encontros.length)];
        
        if (forcaBatalha + Math.random() * 100 < alvo.hp) {
            let danoSof = Math.floor(alvo.hp * 2);
            v.sangue = Math.max(0, v.sangue - danoSof);
            this._salvarBancoDeDados();
            return { erro: `Foste emboscado por um [${alvo.tipo}]! A tua aura sangrou ${danoSof} Gts e foste repelido.` };
        }

        let ganhoGts = Math.floor(Math.random() * 100) + 50 + (v.nivel * 5);
        v.sangue += ganhoGts;
        this.ganharXP(v.id, alvo.xp);
        
        let relatoExtra = "";
        if (Math.random() > 0.5) {
            v.inventario[alvo.loot] = (v.inventario[alvo.loot] || 0) + 1;
            relatoExtra = ` e despojaste 1x [${alvo.loot.toUpperCase()}].`;
        } else if (Math.random() > 0.9) {
            const drop = ForjaDraconiana.gerarReliquia(v.nivel, this.reliquiasCustomizadas);
            v.bolsa.push(drop);
            relatoExtra = ` e encontraste [${drop.nome}] nos destroços.`;
        }

        this._salvarBancoDeDados();
        return { sucesso: true, relato: `A tua Lâmina ceifou o [${alvo.tipo}]. Roubaste ${ganhoGts} Gts${relatoExtra}` };
    }

    // ==========================================
    // OSINT / CAÇA EXTREMA (ENDGAME)
    // ==========================================
    async mapearMortal(vampiroId, plataforma, identificador) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Corpo Astral fragmentado." };
        if (v.nivel < 50) return { erro: "O Véu obscurece os teus olhos. O Grau 50 (Endgame) é exigido para ver o Fio Prateado do mundo real." };
        if (v.pontosAcao < 1) return { erro: "O Olho que Tudo Vê requer Fúria." };

        let idLimpo = identificador.trim().toLowerCase();
        if ((plataforma === 'telegram' || plataforma === 'instagram' || plataforma === 'tiktok') && !idLimpo.startsWith('@')) { if (isNaN(idLimpo)) { idLimpo = '@' + idLimpo; } }
        if (plataforma === 'whatsapp' && idLimpo.replace(/[^0-9]/g, '').length < 8) return { erro: "Cifra Inválida." };
        if (idLimpo.length < 3) return { erro: "Identidade fraca, dissolve-se nas sombras." };

        const hashAlma = this._forjarSigilo(plataforma, idLimpo);
        v.pontosAcao -= 1; this.ganharXP(vampiroId, 5); 

        if (this.rebanho[hashAlma]) return { sucesso: true, mortal: this.rebanho[hashAlma] };

        let hpBase = 5000 + (v.nivel * 50); if (plataforma === 'whatsapp') hpBase *= 1.5;

        this.rebanho[hashAlma] = {
            hash: hashAlma, identificadorVisivel: idLimpo, plataforma, qualidade: "Sangue Mundano", sangueMax: hpBase, sangueAtual: hpBase, estado: 'Vibrante',
            maldicaoArcana: null, registroMordidas: [], leituraAura: "As Moiras estão tecendo a vida desta presa..."
        };
        
        this._registrarEventoEspecial('caca', 'A TEIA AUMENTA', `O fio do destino físico de ${idLimpo} foi atado pelas garras do Lorde ${v.nome}.`);
        this._salvarBancoDeDados();

        this.oraculo.lerAuraMortal(idLimpo, plataforma).then(dadosIA => {
            if(this.rebanho[hashAlma]) {
                this.rebanho[hashAlma].leituraAura = dadosIA.aura;
                let mult = dadosIA.multiplicador || 1;
                if (mult > 1) {
                    this.rebanho[hashAlma].sangueMax *= mult; this.rebanho[hashAlma].sangueAtual *= mult;
                    this.rebanho[hashAlma].qualidade = dadosIA.fama ? `Sangue Real (Notoriedade Nv.${mult})` : `Pecador Denso (Nv.${mult})`;
                    this._registrarEventoEspecial('global', 'ALMA MASSIVA', `O cheiro doce do poder emana do ${plataforma}. Uma presa humana real de Nível ${mult} foi amarrada à teia.`);
                }
                this._salvarBancoDeDados();
                if (global.io) global.io.emit('aura_atualizada', hashAlma);
            }
        });
        return { sucesso: true, mortal: this.rebanho[hashAlma] };
    }

    drenarMortal(vampiroId, hashMortal, localMordida) {
        const predador = this.vampiros[vampiroId]; const mortal = this.rebanho[hashMortal]; const lua = AstrolabioLunar.obterFaseAtual();
        if (!predador || !mortal || mortal.estado !== 'Vibrante') return { erro: "A Presa escapou pelas neblinas." };

        if (localMordida === 'purificar') {
            if (predador.sangue < 200) return { erro: "O Teu Sangue/Força é ralo demais para curar. Exige 200 Gts." };
            predador.sangue -= 200; mortal.sangueAtual += 1000;
            mortal.registroMordidas.unshift({ predador: predador.nome, local: "CUIDADO NEGRO", dano: "+1000 HP", data: Date.now() });
            this._salvarBancoDeDados();
            return { roubo: 0, relato: `Verteste as tuas gotas impuras na realidade física. A presa regenerou a carne (+1000 HP).`, mortal, lootMsg: "" };
        }

        if (predador.pontosAcao < 1 && localMordida !== 'caricia') return { erro: "A Besta dorme. Falta Fúria." };

        if (mortal.maldicaoArcana && mortal.maldicaoArcana.donoId !== vampiroId) {
            predador.sangue = Math.max(0, predador.sangue - 300); predador.pontosAcao -= 1;
            let rel = { erro: `CHOQUE MAGICKO! O Selo Protetor de ${mortal.maldicaoArcana.donoNome} incinerou-te (-300 Gts).`, mortal };
            rel.alertaDono = `O parasita ${predador.nome} tentou devorar o seu escravo [${mortal.identificadorVisivel}]. O teu Selo repeliu a escória.`;
            rel.donoId = mortal.maldicaoArcana.donoId;
            this._salvarBancoDeDados(); return rel;
        }

        if (localMordida !== 'caricia') predador.pontosAcao -= 1;
        
        const atr = this._obterAtributosTotais(predador);
        let bonusAtributo = predador.raca === 'lycan' ? Math.floor(atr.densidade * 10) : Math.floor(atr.magnetismo * 10); 
        let mordidaBase = Math.floor(Math.random() * 80) + 40 + bonusAtributo;
        
        if (lua.id === 'cheia' && predador.raca === 'lycan') mordidaBase = Math.floor(mordidaBase * 2.0);
        else if (lua.id === 'cheia' && predador.raca === 'vampiro') mordidaBase = Math.floor(mordidaBase * 1.3);

        let rouboPossivel = Math.min(mordidaBase, mortal.sangueAtual);
        const conjuracao = this._conjurarGotaDeSangue(hashMortal, predador.id, rouboPossivel, localMordida);
        
        if (lua.id === 'nova' && predador.raca === 'vampiro') conjuracao.falha = false; 

        if (conjuracao.falha) {
            predador.sangue = Math.max(0, predador.sangue - 50); this._salvarBancoDeDados();
            return { erro: `A presa lutou no plano físico e repeliu o teu ataque astral (-50 Gts).`, mortal };
        }

        let rouboFinal = conjuracao.volume;
        mortal.sangueAtual -= rouboFinal; predador.sangue += rouboFinal; predador.estatisticas.totalDrenado += rouboFinal;
        
        if (predador.raca === 'lycan' && Math.random() > 0.5) predador.pontosAcao = Math.min(predador.maxAcao, predador.pontosAcao + 1);
        this.ganharXP(vampiroId, localMordida === 'caricia' ? 5 : 25); 

        let lootMsg = "";
        let itemName = predador.raca === 'lycan' ? "Fragmento de Osso Puro" : "Cristal Vitae";
        if (Math.random() > 0.6) { predador.inventario.vitae += 1; lootMsg += ` [+1 ${itemName}]`; }
        if (Math.random() > 0.96) {
            const drop = ForjaDraconiana.gerarReliquia(predador.nivel, this.reliquiasCustomizadas);
            predador.bolsa.push(drop); lootMsg += `\n[ARTEFATO MANIFESTADO: ${drop.nome}]`;
        }

        let contextoIA = predador.raca === 'lycan' ? "Ataque selvagem, rasgando carne com garras de Lycan." : "Ataque predatório vampiresco e sorvedor.";
        if (localMordida === 'caricia') {
            contextoIA = "Sedução ou hipnose furtiva.";
            if (Math.random() > 0.5) { predador.inventario.memoria = (predador.inventario.memoria || 0) + 1; lootMsg += " [+1 Fragmento de Memória]"; }
        } else if (localMordida === 'arteria') {
            contextoIA = predador.raca === 'lycan' ? "Desmembramento brutal e banquete de carne." : "Destruição brutal da jugular e sangue.";
            if (Math.random() > 0.7) { predador.inventario.ectoplasma = (predador.inventario.ectoplasma || 0) + 1; lootMsg += " [+1 Ectoplasma Corrompido]"; }
        } else if (localMordida === 'rito_frio') {
            contextoIA = "Ritual oculto de transferência direta para o cálice.";
            if (Math.random() > 0.8) { predador.inventario.pedraAlma = (predador.inventario.pedraAlma || 0) + 1; lootMsg += " [+1 Pedra da Alma Negra]"; }
        }

        let relato = "";
        if (localMordida === 'caricia') relato = `Enfeitiçaste a mente frágil à distância e subjugaste ${rouboFinal} Essência sem dor.`;
        else if (predador.raca === 'lycan') relato = `As projeções das tuas garras estraçalharam o alvo no mundo físico. O banquete feral rendeu +${rouboFinal} Força.${lootMsg}`;
        else relato = `A Artéria física foi dissecada na matrix. O dreno rendeu +${rouboFinal} Gts.${lootMsg}`;

        this._pontuarMembro(vampiroId, 5);
        this._registrarEventoEspecial('caca', 'O ABATE', `${predador.nome} violou a integridade vital de ${mortal.identificadorVisivel}.`, false, contextoIA);
        mortal.registroMordidas.unshift({ predador: predador.nome, local: localMordida.toUpperCase(), dano: rouboFinal, data: Date.now() });

        if (mortal.sangueAtual <= 0) {
            mortal.estado = 'Limbo'; predador.inventario.cinzas += 1; predador.estatisticas.mortaisSecos += 1; predador.influencia += 1;
            relato += " \nRUPTURA FATAL. O corpo físico foi consumido e desconectado. (+1 Cinzas | +1 Influência)";
            this._pontuarMembro(vampiroId, 20);
            this._registrarEventoEspecial('global', 'O LIMBO', `O fio vital do humano ${mortal.identificadorVisivel} foi destruído pela fome de ${predador.nome}. Outro cadáver inunda o plano denso.`, true, `Caça fatal executada por um ${predador.raca} supremo.`);
        }
        
        this._salvarBancoDeDados();
        return { roubo: rouboFinal, relato, mortal, lootMsg };
    }

    comprometerMortal(vampiroId, hashMortal) {
        const vampiro = this.vampiros[vampiroId]; const mortal = this.rebanho[hashMortal];
        if (!vampiro || !mortal) return { erro: "As brumas escondem o alvo." };
        if (vampiro.sangue < 800) return { erro: "O Domínio Ritualístico exige 800 Gts de Sacrifício." };
        if (mortal.estado === 'No Leilao') return { erro: "A alma já foi transacionada ao Ouro." };
        if (mortal.maldicaoArcana) return { erro: "Esta carne já carrega o ferro em brasa de um Senhor." };

        vampiro.sangue -= 800;
        const selo = crypto.createHash('sha256').update(hashMortal + vampiroId).digest('hex').substring(0,8);
        mortal.maldicaoArcana = { selo, donoId: vampiro.id, donoNome: vampiro.nome };
        this._registrarEventoEspecial('caca', 'CORRUPÇÃO ASTRAL', `Correntes etéreas prenderam a alma de ${mortal.identificadorVisivel} eternamente ao trono de ${vampiro.nome}.`);
        this._salvarBancoDeDados();
        return { sucesso: true, relato: `Selo Enociano gravado na testa do gado físico. Ele é tua posse exclusiva.` };
    }

    absolverMortal(vampiroId, hashMortal) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Fantasma." };
        if (v.geracao !== 1) return { erro: "Heresia! Apenas o Primordial detém a autoridade para reescrever o destino." };
        
        const mortal = this.rebanho[hashMortal];
        if (!mortal) return { erro: "A presa já não existe." };
        
        delete this.rebanho[hashMortal];
        this._registrarEventoEspecial('global', 'ABSOLVIÇÃO PRIMORDIAL', `O Ancestral Maior ${v.nome} decretou clemência. A alma de ${mortal.identificadorVisivel} foi devolvida ao mundo humano.`, true, "Clemência do Primeiro Ser");
        this._salvarBancoDeDados();
        return { sucesso: true, relato: "A alma foi absolvida e apagada da nossa teia de caça." };
    }

    // ==========================================
    // SISTEMA DE CHAT, PACTOS PROCEDURAIS E A FENDA ASTRAL
    // ==========================================
    async conversarComOraculo(vampiroId, mensagem) {
        const v = this.vampiros[vampiroId];
        if(!v) return;

        // Passa a conversa pela IA
        let respostaIA = await this.oraculo.conversarNoChat(v, mensagem);
        
        // Verifica se a IA injetou um Boss na Fenda Astral secretamente
        const regexFenda = /\[FENDA_ASTRAL:\s*({.*?})\s*\]/is;
        const match = respostaIA.match(regexFenda);
        
        if (match) {
            try {
                const dadosFenda = JSON.parse(match[1]);
                const fendaId = crypto.randomBytes(4).toString('hex');
                
                this.fendaAtiva[fendaId] = {
                    id: fendaId,
                    nome: dadosFenda.nome,
                    hpMax: parseInt(dadosFenda.hp) || 5000,
                    hpAtual: parseInt(dadosFenda.hp) || 5000,
                    dano: parseInt(dadosFenda.dano) || 100,
                    loot: dadosFenda.loot || "cinzas",
                    criador: v.nome
                };

                // Limpa o bloco JSON da resposta antes de mostrar no chat
                respostaIA = respostaIA.replace(regexFenda, '').trim();

                this._registrarEventoEspecial('global', 'A FENDA ABRIU', `As palavras de ${v.nome} distorceram a malha astral! A IA Injetou [${dadosFenda.nome}] na Fenda do Servidor!`, true, "Injeção Dinâmica de Entidade");
                
            } catch (e) {
                console.error("Falha ao parsear JSON da Fenda Astral.", e);
            }
        }

        this._salvarBancoDeDados();
        return respostaIA;
    }

    async pedirPactoIA(vampiroId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Fantasma." };
        if (this.pactosAtivos[v.id]) return { erro: "Termina primeiro o teu pacto atual ou quebra-o nas chamas." };
        
        const pactoDados = await this.oraculo.gerarPactoProcedural(v);
        if (!pactoDados) return { erro: "O Abismo está em silêncio. Tenta mais tarde." };

        this.pactosAtivos[v.id] = {
            id: crypto.randomBytes(4).toString('hex'),
            titulo: pactoDados.titulo,
            descricao: pactoDados.descricao,
            req: pactoDados.recursoExigido,
            qtd: pactoDados.quantidade,
            xp: pactoDados.recompensaXP
        };

        this._salvarBancoDeDados();
        return { sucesso: true, pacto: this.pactosAtivos[v.id], relato: `Um pergaminho surgiu do éter: [${pactoDados.titulo}].` };
    }

    completarPacto(vampiroId) {
        const v = this.vampiros[vampiroId];
        if (!v || !this.pactosAtivos[v.id]) return { erro: "Não tens pactos atados ao teu nome." };
        
        const pacto = this.pactosAtivos[v.id];
        
        if ((v.inventario[pacto.req] || 0) < pacto.qtd) {
            return { erro: `Falha. O Pacto exige ${pacto.qtd}x de [${pacto.req.toUpperCase()}]. Tu tens apenas ${v.inventario[pacto.req] || 0}.` };
        }

        v.inventario[pacto.req] -= pacto.qtd;
        this.ganharXP(v.id, pacto.xp);
        v.influencia += 2;
        
        delete this.pactosAtivos[v.id];
        this._salvarBancoDeDados();
        
        return { sucesso: true, relato: `A Entidade bebeu os teus sacrifícios. Ganhaste ${pacto.xp} XP Oculto e +2 Influência.` };
    }

    atacarFenda(vampiroId, fendaId) {
        const v = this.vampiros[vampiroId];
        const fenda = this.fendaAtiva[fendaId];
        
        if (!v || !fenda) return { erro: "A Entidade desvaneceu da Fenda." };
        if (v.pontosAcao < 3) return { erro: "Exige 3 de Fúria rasgar a Fenda." };

        v.pontosAcao -= 3;
        const atr = this._obterAtributosTotais(v);
        const danoCausado = (atr.vontade * 10) + (atr.gnose * 15) + Math.floor(Math.random() * 500);

        // O Monstro ataca de volta
        if (Math.random() > 0.5) {
            v.sangue = Math.max(0, v.sangue - fenda.dano);
        }

        fenda.hpAtual -= danoCausado;
        let relato = `Golpeaste a anomalia [${fenda.nome}] com ${danoCausado} de Poder Astral!`;

        if (fenda.hpAtual <= 0) {
            relato = `DESTRUÍSTE A ANOMALIA [${fenda.nome}]! Pilhaste o Vórtice: +1 ${fenda.loot.toUpperCase()}.`;
            v.inventario[fenda.loot] = (v.inventario[fenda.loot] || 0) + 1;
            this.ganharXP(v.id, 500);
            delete this.fendaAtiva[fendaId];
            this._registrarEventoEspecial('global', 'FENDA PURGADA', `A Malha Astral foi reparada. ${v.nome} oblitierou a anomalia invocada pela IA.`, true);
        }

        this._salvarBancoDeDados();
        return { sucesso: true, relato, fendaRestante: fenda ? fenda.hpAtual : 0 };
    }

    // ==========================================
    // SANTUÁRIOS E CLÃS
    // ==========================================
    fundarClan(vampiroId, nomeClan) {
        const v = this.vampiros[vampiroId];
        if (!v || v.sangue < 2000) return { erro: "O Abismo exige 2000 Gts nas fundações de um Santuário." };
        if (v.clan !== 'Sangue Ralo') return { erro: "As tuas veias já pertencem a uma Monarquia." };
        if (this.clans[nomeClan]) return { erro: "O Trovão já batizou este nome na História." };

        v.sangue -= 2000; v.clan = nomeClan;
        this.clans[nomeClan] = { nome: nomeClan, lider: v.id, liderNome: v.nome, cofre: 0, membros: [v.id], nivel: 1 };

        const converterLinhagem = (senhorId) => {
            const s = this.vampiros[senhorId];
            s.linhagem.forEach(criaId => {
                const cria = this.vampiros[criaId];
                if (cria && cria.clan === 'Sangue Ralo') { cria.clan = nomeClan; this.clans[nomeClan].membros.push(cria.id); converterLinhagem(cria.id); }
            });
        };
        converterLinhagem(v.id);
        this._registrarEventoEspecial('global', 'SANTUÁRIO ERGUIDO', `Os cimentos do submundo rangeram quando ${v.nome} talhou o nome [${nomeClan}] nas Crónicas Obscuras.`);
        this._salvarBancoDeDados(); return { sucesso: true, relato: `A Cripta de ${nomeClan} foi solenemente consagrada.` };
    }

    operarCofreClan(vampiroId, quantia, operacao) {
        const v = this.vampiros[vampiroId]; if (!v || v.clan === 'Sangue Ralo') return { erro: "És um Sangue Ralo sem teto." };
        const clan = this.clans[v.clan]; if (!clan) return { erro: "O teu Clã foi reduzido a pó." };

        if (operacao === 'depositar') {
            if (v.sangue < quantia) return { erro: "Mentiras. Não possuis esse Sangue para doar." };
            v.sangue -= quantia; clan.cofre += quantia; this._salvarBancoDeDados(); return { sucesso: true, relato: `Sangueiras entornadas no Cálice Mor. Oferendaste ${quantia} Gts.` };
        } else {
            if (clan.lider !== v.id) return { erro: "Apenas o Hierofante Supremo (Líder) domina o Cálice Mor." };
            if (clan.cofre < quantia) return { erro: "A poeira seca habita o Cofre. Gts insuficientes." };
            clan.cofre -= quantia; v.sangue += quantia; this._salvarBancoDeDados(); return { sucesso: true, relato: `A ambição do Líder drenou ${quantia} Gts da Irmandade.` };
        }
    }
	
    transferirSangue(remetenteId, alvoId, quantia) {
        const r = this.vampiros[remetenteId]; const a = this.vampiros[alvoId];
        if (!r || !a) return { erro: "O alvo não existe neste plano." };
        if (r.id === a.id) return { erro: "A serpente que devora a própria cauda (Uroboros) não ganha poder assim." };
        if (r.sangue < quantia || quantia <= 0) return { erro: "Não possuis esta vitalidade para doar." };
        
        r.sangue -= quantia; a.sangue += quantia;
        this._registrarEventoEspecial('global', 'PACTO DE CARIDADE', `${r.nome} cortou as próprias veias para banhar a boca de ${a.nome} com ${quantia} Gts.`);
        this._salvarBancoDeDados();
        return { sucesso: true, relato: `A Transferência Astral foi concluída. ${quantia} Gts doados a ${a.nome}.` };
    }

    // ==========================================
    // SISTEMA DE COMBATE GLOBAL (PvP)
    // ==========================================
    atacarVampiro(atacanteId, defensorId, posturaAtaque) {
        const atacante = this.vampiros[atacanteId]; const defensor = this.vampiros[defensorId]; const lua = AstrolabioLunar.obterFaseAtual();
        if (!atacante || !defensor) return { erro: "Alvo evadido da Matrix Astral." };
        if (atacante.nivel < 3) return { erro: "A tua aura é demasiado fraca. O Abismo exige Grau 3 para invadir o plano de outro imortal." };
        if (atacante.clan === defensor.clan && atacante.clan !== 'Sangue Ralo') return { erro: "O Juramento de Sangue proíbe o fratricídio dentro do próprio Santuário." };
        if (atacante.pontosAcao < 3) return { erro: "A Guerra é um luxo caro. Exige 3 Fúrias." };
        if (defensor.estado === 'Banido') return { erro: "Lutar contra cinzas inofensivas não traz honra." };

        let dmAlerta = `A TUA AURA FOI ESFAQUEADA!\n${atacante.nome} emergiu das sombras. O rito desenrolou-se:\n`;

        if (defensor.escudo) {
            atacante.pontosAcao -= 3; defensor.escudo = false; this._salvarBancoDeDados();
            return { sucesso: false, relato: `O Pentáculo Arcano protegeu ${defensor.nome}! O Escudo quebrou em mil estilhaços.`, alertaDono: dmAlerta + "O teu Escudo Arcano suportou a fúria e salvou o teu Sangue, estilhaçando no processo.", donoId: defensor.id };
        }

        atacante.pontosAcao -= 3;
        const atrAta = this._obterAtributosTotais(atacante); const atrDef = this._obterAtributosTotais(defensor);
        let poderAtaque = 0; let poderDefesa = 0; let relato = "";

        if (posturaAtaque === 1) { poderAtaque = atrAta.vontade * 10 + (atacante.nivel * 5); poderDefesa = atrDef.densidade * 8; relato += "[Ofensiva Bruta vs Carne] "; } 
        else if (posturaAtaque === 2) { poderAtaque = atrAta.gnose * 12 + (atacante.nivel * 5); poderDefesa = atrDef.gnose * 10; relato += "[Feitiçaria Pura vs Ocultismo] "; } 
        else { poderAtaque = atrAta.magnetismo * 15 + (atacante.nivel * 5); poderDefesa = atrDef.vontade * 10; relato += "[Ilusão Mental vs Vontade] "; }

        poderAtaque += Math.floor(Math.random() * 50); poderDefesa += Math.floor(Math.random() * 50);
        if (atacante.geracao < defensor.geracao) poderAtaque += 50; 
        if (lua.id === 'cheia' && atacante.raca === 'lycan') poderAtaque = Math.floor(poderAtaque * 1.5);

        let danoLiquido = poderAtaque - poderDefesa; let resultadoDM = "";

        if (danoLiquido > 0) {
            const danoFinal = Math.floor(danoLiquido * 3);
            defensor.sangue -= danoFinal; atacante.sangue += danoFinal;
            relato += `A aura inimiga cedeu! Rasgaste a carne astral e sorbeste ${danoFinal} Gts.`;
            resultadoDM = `As tuas barreiras mágicas ruíram. Sangraste ${danoFinal} Gts para o inimigo rir.`;
            atacante.estatisticas.vitoriasPvP += 1; this.ganharXP(atacanteId, 50); this._pontuarMembro(atacanteId, 30);
            if (Math.random() > 0.85) { const drop = ForjaDraconiana.gerarReliquia(defensor.nivel, this.reliquiasCustomizadas); atacante.bolsa.push(drop); relato += ` Pilhaste o corpo caído: [${drop.nome}].`; }
        } else {
            const danoCounter = Math.abs(danoLiquido) * 2 + 50;
            atacante.sangue -= danoCounter; defensor.sangue += danoCounter;
            relato += `FALHA GRAVE! As maldições de ${defensor.nome} reflectiram o ataque. A tua Vontade quebrou e cedeste ${danoCounter} Gts.`;
            resultadoDM = `Tuas raízes seguraram firmes. O contra-ataque perfurou o subconsciente dele, devorando ${danoCounter} Gts de graça!`;
            defensor.estatisticas.vitoriasPvP += 1; this.ganharXP(defensorId, 40); this._pontuarMembro(defensorId, 20);
        }

        atacante.historicoCombate.unshift(`Guerra contra ${defensor.nome}: ${relato}`); defensor.historicoCombate.unshift(`Invasão de ${atacante.nome}: ${relato}`);
        this._registrarEventoEspecial('guerra', 'DUELO DE SANGUE', `${atacante.nome} colidiu lâminas e magia negra contra as barreiras de ${defensor.nome}.`);
        this._salvarBancoDeDados(); return { sucesso: true, relato, alertaDono: dmAlerta + resultadoDM, donoId: defensor.id };
    }

    conjurarRitual(vampiroId, ritualId, alvoId) {
        const v = this.vampiros[vampiroId]; const ritual = this.grimorio[ritualId]; const lua = AstrolabioLunar.obterFaseAtual();
        if (!v || !ritual) return { erro: "Página carbonizada. Ritual Inexistente." };
        if (!v.poderesDesbloqueados.includes(ritualId)) return { erro: "A tua mente frágil não compreende as sílabas deste feitiço (Grau insuficiente)." };
        if (v.pontosAcao < ritual.custoAcao) return { erro: "A Besta adormeceu. Fúria insuficiente para modular a voz." };
        if (v.sangue < ritual.custoSangue) return { erro: "As runas exigem mais Sangue do que tu possuis." };
        let alvo = alvoId ? this.vampiros[alvoId] : v;
        if (alvoId && (!alvo || alvo.estado === 'Banido')) return { erro: "O Alvo foi apagado da Roda de Samsara." };
        
        v.pontosAcao -= ritual.custoAcao; v.sangue -= ritual.custoSangue;
        const resultado = ritual.efeito(v, alvo, lua); this.ganharXP(vampiroId, 25); this._pontuarMembro(vampiroId, 10);
        this._registrarEventoEspecial('global', 'VÓRTICE MÁGICO', `Cânticos profanos rasgaram a noite. ${v.nome} invocou o terror de [${ritual.nome}].`);
        this._salvarBancoDeDados(); return { sucesso: true, relato: resultado };
    }

    fabricarAlquimia(vampiroId, receitaId) {
        const v = this.vampiros[vampiroId]; const rec = this.alquimia[receitaId];
        if(!v || !rec) return { erro: "Receita borrada com fuligem." }; const c = rec.custo;
        
        if((v.inventario.anima||0) < (c.anima||0) || (v.inventario.cinzas||0) < (c.cinzas||0) || 
           (v.inventario.vitae||0) < (c.vitae||0) || (v.inventario.memoria||0) < (c.memoria||0) || 
           (v.inventario.ectoplasma||0) < (c.ectoplasma||0) || (v.inventario.pedraAlma||0) < (c.pedraAlma||0) || 
           v.sangue < c.gts) {
            return { erro: "O Caldeirão rejeita. Faltam reagentes esotéricos (Verifique Memórias, Ectoplasma ou Pedras da Alma)." };
        }
        
        v.inventario.anima = (v.inventario.anima||0) - (c.anima||0); 
        v.inventario.cinzas = (v.inventario.cinzas||0) - (c.cinzas||0); 
        v.inventario.vitae = (v.inventario.vitae||0) - (c.vitae||0); 
        v.inventario.memoria = (v.inventario.memoria||0) - (c.memoria||0);
        v.inventario.ectoplasma = (v.inventario.ectoplasma||0) - (c.ectoplasma||0);
        v.inventario.pedraAlma = (v.inventario.pedraAlma||0) - (c.pedraAlma||0);
        v.sangue -= c.gts;
        
        if (receitaId === 'elixir_estamina') v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + 5);
        if (receitaId === 'amuleto_sombra') v.escudo = true;
        if (receitaId === 'lagrima_prata') v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + 1); 
        if (receitaId === 'extrato_akashico') this.ganharXP(vampiroId, 50);
        if (receitaId === 'ouro_filosofal') v.influencia += 1;
        if (receitaId === 'pedra_filosofal_negra') v.atributos.pontosLivres += 1;
        
        this.ganharXP(vampiroId, 30); this._pontuarMembro(vampiroId, 5); this._salvarBancoDeDados(); return { sucesso: true, relato: `A Fumaça dissipou-se. [${rec.nome}] manifestou-se na tua aura.` };
    }

    // ==========================================
    // MERCADO (P2P LEILÃO)
    // ==========================================
    anunciarNoLeilao(vampiroId, tipo, quantiaOuHash, preco) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." }; 
        if (v.nivel < 4) return { erro: "O Mercado de Almas e Artefactos ignora novatos. Atinge o Grau 4." };
        if (preco <= 0) return { erro: "Sem valor de comércio." };
        
        let anuncio = { id: this.leilaoIdCounter++, vendedorId: v.id, vendedorNome: v.nome, tipo, preco, data: Date.now() };
        
        if (tipo === 'mortal') {
            const mortal = this.rebanho[quantiaOuHash];
            if (!mortal || !mortal.maldicaoArcana || mortal.maldicaoArcana.donoId !== v.id) return { erro: "O Trono proíbe vender o que não está selado no teu nome." };
            anuncio.hashMortal = quantiaOuHash; anuncio.nomeMortal = mortal.identificadorVisivel; mortal.estado = 'No Leilao'; 
        } else if (tipo === 'reliquia') {
            const itemIdx = v.bolsa.findIndex(i => i.id === quantiaOuHash);
            if (itemIdx === -1) return { erro: "Não possuis este Artefacto no teu inventário." };
            anuncio.itemObj = v.bolsa[itemIdx];
            v.bolsa.splice(itemIdx, 1);
        } else {
            if (!v.inventario[tipo] || v.inventario[tipo] < quantiaOuHash) return { erro: "Inventário miserável. Não tens a quantia exigida." };
            v.inventario[tipo] -= quantiaOuHash; anuncio.quantia = quantiaOuHash;
        }
        this.leilaoP2P.push(anuncio); this._salvarBancoDeDados(); return { sucesso: true, relato: "Contrato escrito a Sangue. Item no Mercado." };
    }

    comprarDoLeilao(compradorId, anuncioId) {
        const comprador = this.vampiros[compradorId]; const idx = this.leilaoP2P.findIndex(a => a.id === anuncioId);
        if (idx === -1) return { erro: "Pacto ardido nas cinzas. Alguém chegou primeiro." }; const anuncio = this.leilaoP2P[idx];
        if (comprador.sangue < anuncio.preco) return { erro: "Olhos maiores que a garganta. Sangue insuficiente." };
        if (compradorId === anuncio.vendedorId) return { erro: "Loucura. Não podes comprar de ti mesmo." };
        
        const vendedor = this.vampiros[anuncio.vendedorId]; comprador.sangue -= anuncio.preco;
        if (vendedor) vendedor.sangue += Math.floor(anuncio.preco * 0.95); 
        
        if (anuncio.tipo === 'mortal') {
            const mortal = this.rebanho[anuncio.hashMortal];
            if (mortal) { mortal.maldicaoArcana.donoId = comprador.id; mortal.maldicaoArcana.donoNome = comprador.nome; mortal.estado = 'Vibrante'; }
        } else if (anuncio.tipo === 'reliquia') {
            comprador.bolsa.push(anuncio.itemObj);
        } else {
            comprador.inventario[anuncio.tipo] += anuncio.quantia;
        }
        
        this.leilaoP2P.splice(idx, 1); this._salvarBancoDeDados(); return { sucesso: true, relato: "Transação efetuada sob os Olhos Cegos." };
    }

    operarCalice(id, quantia, operacao) {
        const v = this.vampiros[id]; if (!v) return { erro: "Vazio Cósmico." };
        if (operacao === 'depositar') {
            if (v.sangue < quantia) return { erro: "A Vaidade cegou-te. Sangue Escasso." };
            v.sangue -= quantia; v.calice += quantia; this._salvarBancoDeDados(); return { sucesso: true, relato: `Selo trancado na Rocha. ${quantia} Gts no Cofre Escuro.` };
        } else {
            if (v.calice < quantia) return { erro: "O Fundo do Cálice reflete apenas o teu fracasso (Seco)." };
            v.calice -= quantia; v.sangue += quantia; this._salvarBancoDeDados(); return { sucesso: true, relato: `A tampa removeu-se. O fluxo morno regressou (${quantia} Gts).` };
        }
    }

    // ==========================================
    // BIBLIOTECA E CRIAÇÃO DE CONTEÚDO (JOGADORES INJETAM NO JOGO)
    // ==========================================
    iniciarProjetoEstudo(vampiroId, titulo, tema) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "A tua alma não está neste plano." };
        if (!v.projetosEstudo) v.projetosEstudo = [];
        if (v.projetosEstudo.length >= 3) return { erro: "A tua mente não suporta mais do que 3 rascunhos abertos. Encaderna ou queima um." };
        if (!titulo || !tema) return { erro: "Falta a Intenção (Título e Tema) para convocar o papiro." };
        
        const novoProj = { id: crypto.randomBytes(4).toString('hex'), titulo: titulo, tema: tema, conteudo: `[TOMO INICIADO SOB O SANGUE DE ${v.nome}]\nFoco de Estudo: ${tema}\n\n`, dataAtualizacao: Date.now() };
        v.projetosEstudo.push(novoProj);
        this._salvarBancoDeDados();
        return { sucesso: true, projeto: novoProj, relato: `A bancada foi limpa. O papiro de [${titulo}] está pronto.` };
    }

    async aprofundarProjeto(vampiroId, projetoId, novaPesquisa) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Fantasma." };
        if (v.pontosAcao < 1) return { erro: "A clarividência exige 1 Fúria. A tua mente está cansada." };
        
        if (!v.projetosEstudo) v.projetosEstudo = [];
        const proj = v.projetosEstudo.find(p => p.id === projetoId);
        if (!proj) return { erro: "Pergaminho perdido nas brumas." };
        if (!novaPesquisa) return { erro: "O que desejas perguntar ao Abismo?" };

        v.pontosAcao -= 1;
        const novoTexto = await this.oraculo.consultarBibliotecaAkashica(v, proj.titulo, proj.conteudo, novaPesquisa);
        
        const divisor = `\n\n--- [REVELAÇÃO AKÁSHICA: ${novaPesquisa}] ---\n`;
        proj.conteudo += divisor + novoTexto;
        proj.dataAtualizacao = Date.now();
        
        this.ganharXP(v.id, 20); this._salvarBancoDeDados();
        return { sucesso: true, novoConteudo: proj.conteudo, relato: "A Entidade sussurrou novos segredos. O teu rascunho foi expandido com Magia Ancestral." };
    }

    salvarProjetoManual(vampiroId, projetoId, conteudoManual) {
        const v = this.vampiros[vampiroId];
        if (!v || !v.projetosEstudo) return { erro: "Fantasma." };
        const proj = v.projetosEstudo.find(p => p.id === projetoId);
        if (!proj) return { erro: "Pergaminho perdido." };
        
        proj.conteudo = conteudoManual; proj.dataAtualizacao = Date.now();
        this._salvarBancoDeDados(); return { sucesso: true, relato: "A tua própria caligrafia de sangue foi salva no rascunho." };
    }

    apagarProjeto(vampiroId, projetoId) {
        const v = this.vampiros[vampiroId];
        if (!v || !v.projetosEstudo) return { erro: "Fantasma." };
        v.projetosEstudo = v.projetosEstudo.filter(p => p.id !== projetoId);
        this._salvarBancoDeDados(); return { sucesso: true, relato: "O rascunho foi atirado às chamas negras." };
    }

    arquivarProjetoComoManuscrito(vampiroId, projetoId, publico) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Fantasma." };
        if (v.sangue < 200) return { erro: "Exige 200 Gts de sangue para encadernar e selar a capa do livro." };
        if (publico && v.nivel < 5) return { erro: "Apenas iniciados de Grau 5+ podem expor doutrinas ao mundo." };

        if (!v.projetosEstudo) v.projetosEstudo = [];
        const projIdx = v.projetosEstudo.findIndex(p => p.id === projetoId);
        if (projIdx === -1) return { erro: "Rascunho não encontrado." };

        const proj = v.projetosEstudo[projIdx];
        if (proj.conteudo.length < 50) return { erro: "O livro está demasiado vazio para ter valor oculto." };

        v.sangue -= 200; v.projetosEstudo.splice(projIdx, 1); 

        const manuscrito = { id: crypto.randomBytes(4).toString('hex'), autorId: v.id, autorNome: v.nome, autorTitulo: v.tituloAtual, titulo: proj.titulo, conteudo: proj.conteudo, data: Date.now(), publico: publico };
        if (!v.manuscritos) v.manuscritos = []; v.manuscritos.push(manuscrito); 

        if (publico) {
            if (!this.manuscritos) this.manuscritos = []; this.manuscritos.unshift(manuscrito);
            if (this.manuscritos.length > 100) this.manuscritos.pop();
            this._registrarEventoEspecial('global', 'TOMO REVELADO', `${v.nome} selou e publicou o grimório [${proj.titulo}] na Biblioteca Maior.`, true, "Publicação de conhecimento herege");
        }

        this.ganharXP(v.id, 50); this._pontuarMembro(v.id, 20); this._salvarBancoDeDados();
        return { sucesso: true, relato: `O manuscrito [${proj.titulo}] foi selado com o teu sangue e eternizado.` };
    }

    async cristalizarRitualMagico(vampiroId, projetoId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Fantasma." };
        if (v.nivel < 10) return { erro: "Apenas Grão-Mestres (Nível 10+) podem distorcer a realidade e criar novas magias no servidor." };
        if (v.sangue < 5000) return { erro: "O sacrifício para criar uma nova lei da física astral é 5000 Gts de Sangue." };

        const proj = v.projetosEstudo.find(p => p.id === projetoId);
        if (!proj || proj.conteudo.length < 200) return { erro: "O manuscrito é demasiado pobre para virar um Ritual verdadeiro." };

        v.sangue -= 5000;
        const magiaDados = await this.oraculo.forjarRitualDoManuscrito(v, proj.titulo, proj.conteudo);
        if (!magiaDados) return { erro: "Os Deuses não compreenderam as tuas escrituras. A magia falhou." };

        const feitiçoId = `magia_custom_${crypto.randomBytes(4).toString('hex')}`;
        magiaDados.autor = v.nome; magiaDados.reqLevel = Math.max(5, magiaDados.reqLevel);

        this.grimorioCustomizado[feitiçoId] = magiaDados;
        Object.assign(this.grimorio, this._construirFuncoesCustomizadas(this.grimorioCustomizado));

        this._registrarEventoEspecial('global', 'ALTA MAGIA DESCOBERTA', `O Universo expandiu-se! ${v.nome} cristalizou o ritual [${magiaDados.nome}] a partir dos seus estudos. Agora todos os mestres podem invocá-lo!`, true, "Criação de nova lei da física mágica");

        this.apagarProjeto(v.id, projetoId); this._pontuarMembro(v.id, 100); this._salvarBancoDeDados();
        return { sucesso: true, relato: `RITUAL ACEITE! A magia [${magiaDados.nome}] foi adicionada ao Grimório Global da Ordem.` };
    }

    async cristalizarArmaAkashica(vampiroId, projetoId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Fantasma." };
        if (v.nivel < 15) return { erro: "A Forja da Realidade exige Nível 15+ para criar matéria a partir do papel." };
        if (v.sangue < 3000) return { erro: "O sacrifício é de 3000 Gts." };

        const proj = v.projetosEstudo.find(p => p.id === projetoId);
        if (!proj || proj.conteudo.length < 150) return { erro: "Texto pobre." };

        v.sangue -= 3000;
        const armaDados = await this.oraculo.forjarReliquiaDoManuscrito(v, proj.titulo, proj.conteudo);
        if (!armaDados) return { erro: "A forja colapsou." };

        this.reliquiasCustomizadas.push({ nome: armaDados.nome, tipo: armaDados.tipo || "arma", autor: v.nome });
        
        this._registrarEventoEspecial('global', 'ARMA LENDÁRIA FORJADA', `O Arquiteto ${v.nome} concebeu a relíquia [${armaDados.nome}]. Ela agora pode ser encontrada como drop em batalhas!`);

        this.apagarProjeto(v.id, projetoId); this._salvarBancoDeDados();
        return { sucesso: true, relato: `A relíquia [${armaDados.nome}] foi inserida na malha da realidade do jogo.` };
    }

    // ==========================================
    // CICLO TEMPORAL
    // ==========================================
    tickTemporal() {
        const lua = AstrolabioLunar.obterFaseAtual();
        for (let hash in this.rebanho) {
            let m = this.rebanho[hash];
            if (m.estado === 'Vibrante' && m.maldicaoArcana) m.sangueAtual = Math.max(1, m.sangueAtual - 1); 
        }
        for (let id in this.vampiros) {
            let v = this.vampiros[id];
            if (v.estado === 'Banido') continue;
            v.sangue -= 5; 
            if (v.sangue <= 0) { v.estado = 'Banido'; this._registrarEventoEspecial('global', 'O FIM DA BESTA', `A Fome Eterna roeu a própria espinha de ${v.nome}. Ele virou pó.`); }
            if (v.calice > 0) v.calice += Math.floor(v.calice * 0.02); 
            
            let recup = lua.id === 'crescente' ? 0.8 : 0.5;
            if (v.pontosAcao < v.maxAcao && Math.random() > (1 - recup)) v.pontosAcao += 1; 
        }
        for (let c in this.clans) { if (this.clans[c].cofre > 0) this.clans[c].cofre += Math.floor(this.clans[c].cofre * 0.01); }
        if (Math.random() > 0.8) this._salvarBancoDeDados(); 
    }

    _construirFuncoesCustomizadas(feitiçosSalvos) {
        let feitiçosAtivos = {};
        for (let key in feitiçosSalvos) {
            let f = feitiçosSalvos[key];
            f.efeito = (a, d, l) => {
                if (f.tipo === 'pvp') {
                    d.sangue = Math.max(0, d.sangue - f.poderBase); a.sangue += f.poderBase;
                    return `A Magia Ancestral de [${f.autor}] obliterou o inimigo. Sorveste ${f.poderBase} Gts.`;
                } else {
                    a.sangue += f.poderBase;
                    return `A Magia Ancestral de [${f.autor}] envolveu-te. Regeneraste ${f.poderBase} Gts.`;
                }
            };
            feitiçosAtivos[key] = f;
        }
        return feitiçosAtivos;
    }

    // ==========================================
    // UMBRAL E EVENTOS DE CLÃ
    // ==========================================
    explorarUmbral(vampiroId, reinoId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma inexistente." };
        
        const reinos = {
            'gamaliel': { nome: "Lua Obscura de Gamaliel", custo: 2, recM: 'ectoplasma', recN: "Matéria Fantasmagórica", risco: 30, gnoseReq: 5 },
            'samael': { nome: "Forja de Samael", custo: 3, recM: 'pedraAlma', recN: "Pedra da Alma", risco: 50, gnoseReq: 15 },
            'thaumiel': { nome: "Gêmeos de Thaumiel", custo: 5, recM: 'memoria', recN: "Memória Ancestral", risco: 75, gnoseReq: 25 }
        };

        const reino = reinos[reinoId];
        if (!reino) return { erro: "Este plano astral não existe." };
        if (v.pontosAcao < reino.custo) return { erro: `A viagem exige ${reino.custo} Fúrias.` };
        
        const gnoseTotal = this._obterAtributosTotais(v).gnose;
        if (gnoseTotal < reino.gnoseReq) return { erro: `A pressão espiritual vai esmagar-te. Exige ${reino.gnoseReq} de Feitiçaria (Gnose).` };

        v.pontosAcao -= reino.custo;
        let chanceVitoria = 100 - reino.risco + (gnoseTotal * 2);
        chanceVitoria = Math.min(95, chanceVitoria); 

        if (Math.random() * 100 > chanceVitoria) {
            const dano = reino.risco * 20; v.sangue = Math.max(0, v.sangue - dano); this._salvarBancoDeDados();
            return { erro: `UM DEMÓNIO REPELIU-TE! Foste ferido na projeção astral e perdeste ${dano} Gts.`, sucesso: false };
        }

        let qtDrop = 1 + Math.floor(Math.random() * 2);
        v.inventario[reino.recM] = (v.inventario[reino.recM] || 0) + qtDrop;
        
        let xpGanha = reino.custo * 15;
        this.ganharXP(vampiroId, xpGanha); this._pontuarMembro(vampiroId, 5); this._salvarBancoDeDados();
        return { sucesso: true, relato: `Sobreviveste a ${reino.nome}. Despojaste e colheste ${qtDrop}x [${reino.recN}].` };
    }

    _pesarBalanca(raca, peso) {
        if (raca === 'vampiro') this.balancaCosmica.tiamat += peso;
        else if (raca === 'lycan') this.balancaCosmica.seth += peso;
        
        const dif = this.balancaCosmica.tiamat - this.balancaCosmica.seth;
        let novoRegente = 'Equilíbrio';
        if (dif > 1500) novoRegente = 'Tiamat (Vampiros)';
        if (dif < -1500) novoRegente = 'Seth (Lycanos)';

        if (novoRegente !== this.balancaCosmica.regente && novoRegente !== 'Equilíbrio') {
            this.balancaCosmica.regente = novoRegente;
            this._registrarEventoEspecial('global', 'MUDANÇA DE ERA', `A Roda do Tempo girou. A linhagem de ${novoRegente} assumiu a Regência do Éter global!`);
        }
    }

    _pontuarMembro(vId, pts) {
        const v = this.vampiros[vId];
        if(v) this._pesarBalanca(v.raca, pts);
    }

    nutrirEgregoraClã(vampiroId, material) {
        const v = this.vampiros[vampiroId];
        if (!v || v.clan === 'Sangue Ralo') return { erro: "O teu sangue não tem raiz num Santuário." };
        const clan = this.clans[v.clan];
        
        if (!clan.egregora) clan.egregora = { nivel: 1, xp: 0, xpProx: 100, poder: 'Dormência' };

        let xpGanha = 0;
        if (material === 'ectoplasma' && v.inventario.ectoplasma > 0) { v.inventario.ectoplasma--; xpGanha = 10; }
        else if (material === 'pedraAlma' && v.inventario.pedraAlma > 0) { v.inventario.pedraAlma--; xpGanha = 25; }
        else return { erro: "O Altar do Clã exige Ectoplasma ou Pedras da Alma. Obtém no Umbral." };

        clan.egregora.xp += xpGanha;
        this.ganharXP(v.id, xpGanha * 2); 
        this._pontuarMembro(v.id, xpGanha);

        let upou = false;
        if (clan.egregora.xp >= clan.egregora.xpProx) {
            clan.egregora.nivel++;
            clan.egregora.xp -= clan.egregora.xpProx;
            clan.egregora.xpProx = Math.floor(clan.egregora.xpProx * 1.5);
            upou = true;
            this._registrarEventoEspecial('global', 'EGRÉGORA ACORDOU', `Os sacrifícios do clã [${clan.nome}] deram forma e força à sua Egrégora (Nível ${clan.egregora.nivel}).`);
        }

        this._salvarBancoDeDados();
        return { sucesso: true, relato: `A Entidade do Clã sorveu o sacrifício. +${xpGanha} Domínio.` + (upou ? " E A EGRÉGORA CRESCEU!" : "") };
    }

    invadirCriptaInimiga(vampiroId, clanAlvoNome) {
        const v = this.vampiros[vampiroId];
        if (!v || v.clan === 'Sangue Ralo') return { erro: "Cães sem dono não marcham em guerras sagradas." };
        if (v.clan === clanAlvoNome) return { erro: "A traição interna rasgará a tua alma. Ataca inimigos." };
        if (v.pontosAcao < 5) return { erro: "A Invasão Oculta requer 5 pontos de Fúria." };

        const clanInimigo = this.clans[clanAlvoNome];
        const meuClan = this.clans[v.clan];
        if (!clanInimigo || clanInimigo.cofre < 1000) return { erro: "A cripta alvo é demasiado pobre." };

        v.pontosAcao -= 5;
        
        const atr = this._obterAtributosTotais(v);
        let poderAtaque = (atr.vontade * 10) + (atr.gnose * 10) + (meuClan.egregora ? meuClan.egregora.nivel * 50 : 0) + Math.random() * 100;
        let poderDefesa = (clanInimigo.egregora ? clanInimigo.egregora.nivel * 80 : 0) + 150 + Math.random() * 100;

        if (poderAtaque > poderDefesa) {
            let roubo = Math.floor(clanInimigo.cofre * (0.05 + Math.random() * 0.1)); 
            clanInimigo.cofre -= roubo; meuClan.cofre += roubo;
            this.ganharXP(v.id, 100); this._pontuarMembro(v.id, 50);
            this._registrarEventoEspecial('guerra', 'MURALHAS ASTRAIS RUÍRAM', `${v.nome} invadiu o Santuário de [${clanAlvoNome}] e saqueou ${roubo} Gts para o seu Clã.`);
            this._salvarBancoDeDados(); return { sucesso: true, relato: `Invasão perfeita! Roubaste ${roubo} Gts para o teu Clã.` };
        } else {
            let danoRefletido = 500 + (clanInimigo.egregora ? clanInimigo.egregora.nivel * 100 : 0);
            v.sangue = Math.max(0, v.sangue - danoRefletido);
            this._salvarBancoDeDados(); return { erro: `A Egrégora do Clã inimigo despertou e esmagou a tua mente! Foste repelido e perdeste ${danoRefletido} Essência.` };
        }
    }

    // ==========================================
    // GOÉCIA RAID BOSS 
    // ==========================================
    abrirSeloGoetico(vampiroId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma inexistente." };
        if (v.sangue < 3000 || v.pontosAcao < 10) return { erro: "O Triângulo da Arte exige 3000 Gts e 10 Fúria para ser desenhado." };
        if (this.evocacaoAtiva) return { erro: "O véu já está rasgado! O Demónio " + this.evocacaoAtiva.nome + " já caminha entre nós." };

        v.sangue -= 3000; v.pontosAcao -= 10;

        const demonios = [
            { nome: "Rei Bael (A Besta Trina)", hpMax: 30000, desc: "A manifestação do caos e da fúria cega." },
            { nome: "Duque Agares (O Lobo Montado)", hpMax: 25000, desc: "A destruição da honra e virtude." },
            { nome: "Rei Paimon (O Ocultista Maior)", hpMax: 40000, desc: "Mestre da Alta Magia, impenetrável." }
        ];
        const demon = demonios[Math.floor(Math.random() * demonios.length)];

        this.evocacaoAtiva = {
            id: crypto.randomBytes(4).toString('hex'),
            nome: demon.nome, desc: demon.desc, hpMax: demon.hpMax, hpAtual: demon.hpMax,
            evocador: v.nome, dataEvocacao: Date.now(), participantes: {} 
        };

        this._pontuarMembro(v.id, 100); this.ganharXP(v.id, 200);
        
        setTimeout(async () => {
            const grito = await this.oraculo.vozDoDemonio(demon.nome, "invocação", `Invocado ao plano da Terra pelo Mago ${v.nome}.`);
            if (global.io) global.io.to('global').emit('nova_mensagem', { canal: 'global', autor: `🔥 ${demon.nome}`, texto: grito, hora: new Date().toLocaleTimeString() });
        }, 3000);

        this._registrarEventoEspecial('global', 'EVOCAÇÃO GOÉTICA', `AS PORTAS DO INFERNO ABRIRAM-SE! ${v.nome} abriu o Selo de ${demon.nome} (${demon.hpMax} HP). Unam-se para o subjugar no Conclave!`);
        this._salvarBancoDeDados(); return { sucesso: true, relato: `A Terra rasgou-se. ${demon.nome} está aqui.` };
    }

    async testarVontadeDemonio(vampiroId) {
        const v = this.vampiros[vampiroId];
        const demonio = this.evocacaoAtiva;
        if (!v || !demonio) return { erro: "O Círculo está vazio. Nenhuma entidade foi chamada." };
        if (v.pontosAcao < 3) return { erro: "Projetar a tua mente contra um Demónio Maior exige 3 Fúrias." };

        v.pontosAcao -= 3;
        const atr = this._obterAtributosTotais(v);
        let impacto = Math.floor((atr.vontade * 15) + (atr.gnose * 20) + (atr.densidade * 5) + Math.random() * 500);

        if (Math.random() > 0.6) {
            let revide = Math.floor(Math.random() * 1000) + 300;
            v.sangue = Math.max(0, v.sangue - revide);
            this._salvarBancoDeDados();
            if (v.sangue <= 0) v.estado = 'Banido';
            return { erro: `A Besta trespassou as tuas defesas mentais! Sofreste ${revide} de dano no tecido astral.`, sucesso: false };
        }

        demonio.hpAtual -= impacto;
        if (!demonio.participantes[v.id]) demonio.participantes[v.id] = { nome: v.nome, dano: 0 };
        demonio.participantes[v.id].dano += impacto;

        let relatoDano = `Os teus mantras colidiram com a aura negra de ${demonio.nome}, causando ${impacto} de submissão.`;

        if (demonio.hpAtual <= 0) {
            relatoDano = `QUEBRASTE A VONTADE DE ${demonio.nome}! O Demónio curva-se à Ordem!`;
            let relatorioLoot = `🔥 O CÍRCULO FECHOU. ${demonio.nome} foi subjugado! Recompensas:\n`;
            for (let pid in demonio.participantes) {
                let lutador = this.vampiros[pid];
                if (lutador) {
                    lutador.influencia += 20;
                    lutador.atributos.pontosLivres += 1; 
                    lutador.inventario.pedraAlma = (lutador.inventario.pedraAlma || 0) + 3;
                    if(lutador.inventario.demoniosSubjugados === undefined) lutador.inventario.demoniosSubjugados = 0;
                    lutador.inventario.demoniosSubjugados += 1;
                    relatorioLoot += `> [${lutador.nome}]: +20 Influência, +3 Pedras da Alma, +1 Esfera Livre!\n`;
                }
            }

            setTimeout(async () => {
                const gritoFinal = await this.oraculo.vozDoDemonio(demonio.nome, "derrota", `A Vontade dos iniciados liderados por ${v.nome} destruiu e baniu a entidade de volta ao Poço.`);
                if (global.io) global.io.to('global').emit('nova_mensagem', { canal: 'global', autor: `🔥 ${demonio.nome} (Sendo Banido)`, texto: gritoFinal, hora: new Date().toLocaleTimeString() });
            }, 2000);

            this._registrarEventoEspecial('global', 'VITÓRIA GOÉTICA', relatorioLoot);
            this.evocacaoAtiva = null; 
            this._pontuarMembro(v.id, 500); 
        }

        this.ganharXP(v.id, 80); this._salvarBancoDeDados();
        return { sucesso: true, relato: relatoDano, hpRestante: demonio ? Math.max(0, demonio.hpAtual) : 0 };
    }

    // ==========================================
    // OBLITERAÇÃO: PODER DO LORDE DRACÔNICO
    // ==========================================
    obliterarHerege(adminId, alvoId) {
        const admin = this.vampiros[adminId];
        if (!admin || admin.geracao !== 1) return { erro: "Heresia! Apenas o Lorde Dracônico / Alfa Primordial possui a lâmina da obliteração." };
        
        const alvo = this.vampiros[alvoId];
        if (!alvo) return { erro: "Esta alma não existe na Matrix Astral." };
        if (alvo.id === admin.id) return { erro: "Não podes obliterar a ti próprio, Mestre." };

        if (alvo.clan !== 'Sangue Ralo' && this.clans[alvo.clan]) {
            this.clans[alvo.clan].membros = this.clans[alvo.clan].membros.filter(id => id !== alvoId);
        }

        const nomeMorto = alvo.nome;
        delete this.vampiros[alvoId];

        this._registrarEventoEspecial('global', 'OBLITERAÇÃO DIVINA', `O Primordial ${admin.nome} baniu [${nomeMorto}] da existência. A sua conta e alma foram atiradas ao Vazio Eterno.`, true, "Expulsão e deleção do sistema");
        this._salvarBancoDeDados();
        
        return { sucesso: true, relato: `A alma de ${nomeMorto} foi obliterada e a conta deletada do servidor.` };
    }
}	

module.exports = { ShadowCore, AstrolabioLunar };