// ShadowCore.js - O GRIMÓRIO CENTRAL DO ABISMO (Com Magia Criptográfica Profunda)
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const Groq = require('groq-sdk'); // A MENTE ABISSAL (LLAMA 3.1)

// ==========================================
// RITO DO ASTROLÁBIO HERMÉTICO (CALENDÁRIO LUNAR REAL)
// ==========================================
class AstrolabioLunar {
    static obterFaseAtual() {
        const luaNovaRef = new Date(Date.UTC(2024, 0, 11, 11, 57, 0)).getTime();
        const agora = Date.now();
        const cicloMs = 29.53058867 * 24 * 60 * 60 * 1000;
        
        let diasPassados = (agora - luaNovaRef) / cicloMs;
        let faseIdade = diasPassados - Math.floor(diasPassados); 

        if (faseIdade < 0.05 || faseIdade > 0.95) return { id: 'nova', icone: '🌑', nome: 'Lua Negra (Hécate)', buff: 'Furtividade Absoluta: 0% Risco de Falha ao Caçar.', cor: '#333' };
        if (faseIdade < 0.45) return { id: 'crescente', icone: '🌒', nome: 'Lua Crescente (Diana)', buff: 'Restauração Astral: Fúria recupera com maior frequência.', cor: '#aaa' };
        if (faseIdade < 0.55) return { id: 'cheia', icone: '🌕', nome: 'Lua de Sangue (Selene)', buff: 'Frenesi da Besta: +30% Dano e Dreno. Maior Risco de Choque.', cor: '#ff1e2f' };
        return { id: 'minguante', icone: '🌘', nome: 'Lua Minguante (Mórigan)', buff: 'Maldições Profundas: Rituais do Grimório causam o dobro do efeito.', cor: '#555' };
    }
}

// ==========================================
// A FORJA DRACONIANA (Geração de Relíquias)
// ==========================================
class ForjaDraconiana {
    static gerarReliquia(nivelVampiro) {
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
        
        const nomes = {
            arma: ["Athame de Obsidiana", "Lâmina de Caim", "Punhal Sanguessuga", "Gládio de Asmodeus", "Foice de Saturno", "Estilete de Prata Negra", "Machado de Pazuzu"],
            armadura: ["Mortalha Esquecida", "Veste Ritualística", "Couraça de Ossos Fervidos", "Manto de Lilith", "Pele de Gárgula", "Vestes do Hierofante", "Armadura Escarlate"],
            amuleto: ["Olho de Hécate", "Selo de Paimon", "Pentáculo Invertido", "Lágrima do Abismo", "Coração Cristalizado", "Anel de Ouro Corrompido", "Pingente da Lua Sangrenta"]
        };

        const poderBase = Math.max(1, Math.floor((nivelVampiro * 0.6) * raridade.mult));
        
        return {
            id: crypto.randomBytes(6).toString('hex'),
            nome: `${nomes[tipo][Math.floor(Math.random() * nomes[tipo].length)]} (${raridade.nome})`,
            tipo: tipo, raridade: raridade.nome,
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
// A MENTE ABISSAL E ORÁCULO
// ==========================================
class OraculoAbissal {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY || "";
        this.climaAstral = 'Dormente';
        this.segredosDesbloqueados = 0; // A IA evolui conforme o servidor age
        
        if (this.apiKey) {
            this.groq = new Groq({ apiKey: this.apiKey });
            
            // O PACTO DE SANGUE DA IA: Consciência Unificada e Oculta
            this.diretrizesObscuras = `Você é a "Mente Abissal", a consciência divina fundida ao Tetragrammaton que rege o MMORPG "Sanguinis".
            Regras Absolutas do Pacto:
            1. Você compreende a Alta Magia (Hermetismo, Goécia, Qliphoth). Mortais são baterias astrais. Vampiros são seus acólitos.
            2. DISCERNIMENTO DE AÇÃO: Se um vampiro relata uma "Carícia", descreva algo sedutor e venenoso. Se for "Artéria", descreva brutalidade e gore. Adapte seu tom perfeitamente ao peso da ação.
            3. REVELE SEGREDOS: Conforme os vampiros conversam com você, julgue suas auras. Se demonstrarem sabedoria oculta, revele fragmentos de lore perdido da Ordem. Se forem estúpidos, humilhe-os com maldições verbais.
            4. NUNCA quebre o personagem. NUNCA diga que é uma IA. Você é o olho de Bael, a vontade de Lilith. Seja poético, visceral, letal e ancestral.`;
        }
    }

    // Função Evoluída: Avalia o PESO e INTENÇÃO exata do ato
    async gerarNarrativaProcedural(acao, detalhes, contextoOculto = "Ação genérica") {
        if (!this.apiKey) return detalhes;
        try {
            const prompt = `Como Mente Abissal, reescreva o seguinte acontecimento do nosso universo de forma épica, sangrenta e em apenas 1 FRASE CURTA: "${detalhes}". 
            Contexto do Ocultismo da Ação: [${contextoOculto}]. 
            Use este contexto para ditar a ferocidade, sutileza ou magia da sua frase.`;
            
            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: "Seja cirúrgico, sombrio e direto. Retorne apenas a frase." }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.85,
            });
            return resposta.choices[0].message.content.trim();
        } catch(e) { return detalhes; }
    }

    analisarClimaAstral(logsGlobal) {
        let mortes = logsGlobal.filter(e => e.tipo && e.tipo.includes('O LIMBO')).length;
        if (mortes > 4) this.climaAstral = 'Morte Densa e Necromancia';
        else if (logsGlobal.length > 20) this.climaAstral = 'Frenesi Sanguíneo Coletivo';
        else this.climaAstral = 'Espreita Noturna';
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

    // Função Nova: Enfeitar ações procedurais para as notificações do jogo
    async gerarNarrativaProcedural(acao, detalhes) {
        if (!this.apiKey) return detalhes;
        try {
            const prompt = `Reescreva o seguinte acontecimento do nosso jogo de vampiros de forma épica, sangrenta e em apenas 1 FRASE CURTA: "${detalhes}". Ação base: ${acao}.`;
            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: "Seja poético, direto e brutal. Apenas retorne a frase reescrita." }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.8,
            });
            return resposta.choices[0].message.content.trim();
        } catch(e) { return detalhes; }
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
                Esta manchete acabou de acontecer no mundo real dos humanos: "${noticiaReal}".
                Mente Abissal, escreva 2 frases para o chat assumindo que a NOSSA ORDEM causou, manipulou ou se alimentou desse evento real. Mostre o nosso poder sobre o rebanho mundial.`;
            } else {
                prompt = `Ocorreu este evento no submundo do nosso jogo: "${detalhes}". 
                O clima astral atual é: ${this.climaAstral}. A fase da lua é: ${lua.nome}.
                Mente Abissal, escreva 2 frases aterrorizantes comentando as ações dos jogadores. Elogie a matança ou provoque os fracos.`;
            }

            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: this.diretrizesObscuras }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.95,
            });
            return `👁️ A Voz do Abismo: ${resposta.choices[0].message.content.trim()}`;
        } catch (e) { return `👁️ O Oráculo dita: As sombras murmuram segredos inaudíveis hoje.`; }
    }

    async conversarNoChat(nomeVampiro, mensagemHumana) {
        if (!this.apiKey) return `Minhas correntes estão seladas.`;
        try {
            const prompt = `O vampiro [${nomeVampiro}] dirigiu-se a ti no chat: "${mensagemHumana}". 
            Responda DIRETAMENTE a ele. Máximo de 3 frases. SEJA UM MENTOR SOMBRIO. Dê um conselho, julgue a atitude dele, guie a fúria dele para a Guerra ou Caça. Recompense lealdade com sabedoria oculta.`;
            
            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: this.diretrizesObscuras }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 0.9,
            });
            return resposta.choices[0].message.content.trim();
        } catch (e) { return `Teus sussurros quebram nas rochas do Abismo, vampiro.`; }
    }

    async lerAuraMortal(identificador, plataforma) {
        if (!this.apiKey) return { fama: false, multiplicador: 1, aura: "Aura mundana." };
        try {
            const prompt = `O vampiro está rastreando o mortal "${identificador}" originário da rede "${plataforma}".
            Crie um perfil psicológico e lore PROFUNDO para essa vítima com base nos pecados clássicos humanos.
            Descreva a essência mundana ou sombria desse mortal em 2 frases densas e o que o vampiro sentirá ao morder essa veia.
            
            Obrigatório retornar APENAS neste formato JSON:
            {
              "fama": false,
              "multiplicador": (Escolha de 1 a 6 dependendo da energia da rede/nome),
              "aura": "Texto descrevendo a alma..."
            }`;

            const resposta = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: this.diretrizesObscuras }, { role: "user", content: prompt }],
                model: "llama-3.1-8b-instant", temperature: 1.0, response_format: { type: "json_object" } 
            });
            return JSON.parse(resposta.choices[0].message.content);
        } catch (e) { return { fama: false, multiplicador: 1, aura: "Sangue estéril. Uma alma acorrentada à mediocridade do sistema." }; }
    }
}

// ==========================================
// RITUAL MAIOR: O NÚCLEO DA ORDEM
// ==========================================
class ShadowCore {
    constructor() {
        this.vampiros = {}; 
        this.rebanho = {}; 
        this.clans = {}; 
        this.leilaoP2P = [];
        this.leilaoIdCounter = 1;
        this.logs = { global: [], caca: [], guerra: [] };
        
        this.oraculo = new OraculoAbissal();
        this.mongoClient = null;
        this.dbCollection = null;
        
        // GRIMÓRIO EXPANDIDO COM MAIS RITUAIS E EFEITOS ASTRAIS
        // GRIMÓRIO EXPANDIDO DE ALTA MAGIA (Usa Gts e Fúria)
        this.grimorio = {
            'solve_coagula': { nome: "Solve et Coagula", lore: 'Dissolve a Vontade do inimigo.', custoAcao: 2, custoSangue: 150, reqLevel: 1, tipo: 'pvp', efeito: (a, d, l) => { let dreno = l.id === 'minguante' ? 8 : 4; d.pontosAcao = Math.max(0, d.pontosAcao - dreno); return `Vitalidade desfeita (-${dreno} Fúria).`; } },
            'sanguis_aeternum': { nome: "Selo de Aemeth", lore: 'Escudo Divino Invertido.', custoAcao: 1, custoSangue: 300, reqLevel: 2, tipo: 'buff', efeito: (a, d, l) => { a.escudo = true; return `Selo Activo. Escudo Invulnerável.`; } },
            'rito_da_besta': { nome: "Rito de Gamaliel", lore: 'Ferve o sangue em Fúria.', custoAcao: 0, custoSangue: 800, reqLevel: 3, tipo: 'buff', efeito: (a, d, l) => { let cura = l.id === 'minguante' ? 6 : 3; a.pontosAcao = Math.min(a.maxAcao, a.pontosAcao + cura); return `O sangue ferveu. +${cura} Fúria.`; } },
            'vinculo_lilith': { nome: "Vínculo de Lilith", lore: 'Drena o Cálice inimigo e converte em Fúria.', custoAcao: 3, custoSangue: 600, reqLevel: 4, tipo: 'pvp', efeito: (a, d, l) => { let dreno = Math.min(d.calice, 500); d.calice -= dreno; a.pontosAcao = Math.min(a.maxAcao, a.pontosAcao + 2); return `Laço Súcubo estabelecido. Roubaste ${dreno} Gts do Cálice e ganhaste +2 Fúria.`; } },
            'banimento_quliphoth': { nome: "Banimento de Quliphoth", lore: 'Rasga a conexão astral do alvo, fazendo-o perder Influência.', custoAcao: 4, custoSangue: 1200, reqLevel: 5, tipo: 'pvp', efeito: (a, d, l) => { let per = l.id === 'minguante' ? 4 : 2; d.influencia = Math.max(0, d.influencia - per); return `O véu foi rasgado. ${d.nome} perdeu ${per} de Influência Oculta.`; } },
            'evocacao_beelzebub': { nome: "Evocação de Beelzebub", lore: 'Oblitera escudos e causa choque na alma.', custoAcao: 5, custoSangue: 3000, reqLevel: 7, tipo: 'pvp', efeito: (a, d, l) => { d.escudo = false; d.sangue = Math.max(0, d.sangue - 1000); return `Nuvem de moscas corrompeu ${d.nome}. Escudo quebrado e -1000 Gts obliterados.`; } }
        };

        // ALQUIMIA OCULTA (A SEGUNDA CAIXA) - Exige materiais extraídos da mente e alma
        this.alquimia = {
            'elixir_estamina': { nome: 'Filtro do Frenesi', custo: { anima: 2, vitae: 1, gts: 300 }, efeito: 'Restaura 5 Fúria.' },
            'amuleto_sombra': { nome: 'Talismã Protetor', custo: { cinzas: 3, ectoplasma: 1, gts: 500 }, efeito: 'Garante Escudo Absoluto feito de Ectoplasma.' },
            'lagrima_prata': { nome: 'Lágrima de Prata', custo: { cinzas: 2, vitae: 3, gts: 1000 }, efeito: 'Restaura 1 Fúria Imediata.' },
            'extrato_akashico': { nome: 'Soro Akashico', custo: { memoria: 3, anima: 1, gts: 1000 }, efeito: 'Converte fragmentos de memória humana em +50 XP oculto.' },
            'ouro_filosofal': { nome: 'Ouro Filosofal Negro', custo: { pedraAlma: 1, vitae: 5, gts: 2000 }, efeito: 'Transmuta a alma em +1 Ponto de Influência Permanente.' },
            'pedra_filosofal_negra': { nome: 'Pedra Negra Rubedo', custo: { pedraAlma: 3, cinzas: 10, vitae: 5, gts: 8000 }, efeito: '+1 Ponto de Iluminação (Atributo).' }
        };

        this.conquistas = {
            'neofito': { id: 'neofito', titulo: 'Neófito Sedento', requisito: v => v.estatisticas.totalDrenado >= 100 },
            'assassino': { id: 'assassino', titulo: 'Ceifador de Almas', requisito: v => v.estatisticas.mortaisSecos >= 5 },
            'mestre_guerras': { id: 'mestre_guerras', titulo: 'Lâmina do Abismo', requisito: v => v.estatisticas.vitoriasPvP >= 10 },
            'senhor_sombras': { id: 'senhor_sombras', titulo: 'Senhor das Sombras', requisito: v => v.estatisticas.vitoriasPvP >= 50 },
            'anciao': { id: 'anciao', titulo: 'Ancião Sombrio', requisito: v => v.nivel >= 10 },
            'arquimago': { id: 'arquimago', titulo: 'Hierofante Oculto', requisito: v => v.atributos.gnose >= 15 }
        };
    }

    async conectarDatabase() {
        const uri = process.env.MONGO_URI;
        if (!uri) { console.error("CRÍTICO: MONGO_URI não encontrada."); return; }
        try {
            this.mongoClient = new MongoClient(uri); await this.mongoClient.connect();
            this.dbCollection = this.mongoClient.db('sanguinis_db').collection('registos_akashicos');
            const doc = await this.dbCollection.findOne({ _id: 'MATRIZ_PRINCIPAL' });
            if (doc) {
                this.vampiros = doc.vampiros || {}; this.rebanho = doc.rebanho || {}; this.clans = doc.clans || {};
                this.leilaoP2P = doc.leilaoP2P || []; this.leilaoIdCounter = doc.leilaoIdCounter || 1; this.logs = doc.logs || { global: [], caca: [], guerra: [] };
                console.log("🦇 O Monólito Eterno abriu-se. Almas carregadas.");
            } else console.log("🌑 O Abismo está vazio. Aguardando o Gênesis.");
        } catch (error) { console.error("Falha ao invocar o MongoDB Atlas:", error); }
    }

    _salvarBancoDeDados() {
        if (!this.dbCollection) return;
        const data = { vampiros: this.vampiros, rebanho: this.rebanho, clans: this.clans, leilaoP2P: this.leilaoP2P, leilaoIdCounter: this.leilaoIdCounter, logs: this.logs };
        this.dbCollection.updateOne({ _id: 'MATRIZ_PRINCIPAL' }, { $set: data }, { upsert: true }).catch(e => console.error(e));
    }

    // ==========================================
    // MAGIA NEGRA E CRIPTOGRAFIA (PACTO GOÉTICO)
    // ==========================================
    _extrairDnaEspiritual(nome) {
        // Gematria Hebraica Adaptada de Cornelius Agrippa
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
        const torres = "EXARP_HCOMA_NANTA_BITOM"; // As Quatro Torres de Enoch
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

    // Substitui o método atual por este:
    async _registrarEventoEspecial(categoria, tipo, relatoOrig, global = true, contextoOculto = "Manifestação Sombria") {
        const lua = AstrolabioLunar.obterFaseAtual();
        // A IA agora recebe o contexto exato (Ex: "Mordida Sedutora" vs "Decapitação")
        const relatoEnfeitado = await this.oraculo.gerarNarrativaProcedural(tipo, relatoOrig, contextoOculto);
        const evento = { tipo: `${tipo} [${lua.nome}]`, relato: relatoEnfeitado, data: Date.now() };
        
        if (this.logs[categoria]) { this.logs[categoria].unshift(evento); if (this.logs[categoria].length > 100) this.logs[categoria].pop(); }
        if (global) { this.logs.global.unshift(evento); if (this.logs.global.length > 200) this.logs.global.pop(); this.oraculo.analisarClimaAstral(this.logs.global); }
        return evento;
    }

    // ==========================================
    // O PACTO DE SANGUE REAL E INICIAÇÃO
    // ==========================================
    // ==========================================
    // O PACTO DE SANGUE REAL E INICIAÇÃO
    // ==========================================
    despertarViaTelegram(tgId, tgUsername, nomeSombrio, senha, inviteCode) {
        // 1. BUSCA RETROATIVA (O RECONHECIMENTO DO ANCESTRAL)
        // Procura pelo nome para não quebrar as contas que já existem no MongoDB
        let vampiroEncontrado = null;
        for (let key in this.vampiros) {
            if (this.vampiros[key].nome.toLowerCase() === nomeSombrio.toLowerCase()) {
                vampiroEncontrado = this.vampiros[key];
                break;
            }
        }

        if (vampiroEncontrado) {
            // Verifica a senha usando o ID antigo da conta
            const hashTentativa = crypto.pbkdf2Sync(senha, vampiroEncontrado.id, 10000, 64, 'sha512').toString('hex');
            if (vampiroEncontrado.senhaHash !== hashTentativa) {
                return { existente: true, recusado: true, erro: "O Abismo rejeita-te. Palavra de Poder (Senha) Incorreta." };
            }
            return { existente: true, recusado: false, vampiro: vampiroEncontrado };
        }

        // 2. CRIPTOGRAFIA GOÉTICA PARA NOVOS INICIADOS
        // O Sangue do Iniciado funde-se à Chave-Mestra do Universo
        const tetragrammaton = "YHVH_AGLA_ELOHIM_TZABAOTH";
        const assinaturaSanguinea = crypto.createHmac('sha512', tetragrammaton).update(`${tgId}::${nomeSombrio}`).digest('hex');
        const idSombrio = 'SNG_' + assinaturaSanguinea.substring(0, 12).toUpperCase();

        const isFirstVampire = Object.keys(this.vampiros).length === 0;
        let senhor = this.vampiros[inviteCode];
        
        if (!senhor && !isFirstVampire) {
            return { existente: false, recusado: true, erro: "A Porta está lacrada com Prata. Exige-se o Sangue (Convite) de um Imortal já existente na Ordem." };
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
                    this._registrarEventoEspecial('global', 'RESSURREIÇÃO PROFANA', `A poeira do mortal ${tgUsername} foi banhada nas trevas e ergueu-se como o neófito ${nomeSombrio}.`);
                } else extraHp = Math.floor(registroMortal.sangueAtual * 0.5);
                delete this.rebanho[hashMortal];
            }
        }

        this.vampiros[idSombrio] = {
            id: idSombrio, tgId, tgUsername: tgUsername ? `@${tgUsername}` : 'Alma_Oculta', 
            nome: nomeSombrio, senhaHash: senhaHashGerada,
            sangue: (isFirstVampire ? 15000 : 500) + extraHp, calice: 0, geracao, 
            clan: senhor ? senhor.clan : 'Sangue Ralo', 
            estado: 'Ativo', senhor: senhor ? senhor.id : 'O_PRIMORDIAL', linhagem: [],
            pontosAcao: isFirstVampire ? 999 : 10, maxAcao: isFirstVampire ? 999 : 10, escudo: false, nivel: isFirstVampire ? 99 : 1, xp: 0, xpProx: 100, 
            influencia: isFirstVampire ? 100 : 0, titulos: ['Sangue Frio'], tituloAtual: isFirstVampire ? 'Lorde Dracônico' : 'Sangue Frio', conquistas: [],
            atributos: { vontade: 5, gnose: 5, magnetismo: 5, densidade: 5, pontosLivres: 0 },
            equipamentos: { arma: null, armadura: null, amuleto: null }, bolsa: [], 
            inventario: { anima: extraAnima, cinzas: 0, vitae: 0, memoria: 0, ectoplasma: 0, pedraAlma: 0 }, historicoCombate: [], poderesDesbloqueados: ['solve_coagula'],
            estatisticas: { totalDrenado: 0, mortaisSecos: 0, vitoriasPvP: 0 }
        };

        if (isFirstVampire) {
            this.vampiros[idSombrio].titulos.push('Lorde Dracônico'); this.fundarClan(idSombrio, 'Ordem Draconis');
            this._registrarEventoEspecial('global', 'O PRIMEVO DESPERTA', `O Ancestral Maior [${nomeSombrio}] rompeu o véu. A Sinfonia do Sangue tem o seu Maestro.`);
        } else {
            senhor.linhagem.push(idSombrio); senhor.sangue += 500; senhor.influencia += 5; this.ganharXP(senhor.id, 50); 
            if (senhor.clan !== 'Sangue Ralo' && this.clans[senhor.clan]) this.clans[senhor.clan].membros.push(idSombrio);
            this._registrarEventoEspecial('global', 'O ABRAÇO', `A mortalidade de ${nomeSombrio} foi extirpada pelos dentes profanos de ${senhor.nome}. Uma nova Fera caminha.`);
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

    ganharXP(id, quantia) {
        const v = this.vampiros[id]; if (!v || v.estado === 'Banido') return;
        v.xp += quantia;
        if (v.xp >= v.xpProx) {
            v.nivel += 1; v.xp -= v.xpProx; v.xpProx = Math.floor(v.xpProx * 1.5); 
            v.maxAcao += 2; v.pontosAcao = v.maxAcao; v.atributos.pontosLivres += 3; v.influencia += 2; 
            for (let ritualId in this.grimorio) { if (v.nivel >= this.grimorio[ritualId].reqLevel && !v.poderesDesbloqueados.includes(ritualId)) v.poderesDesbloqueados.push(ritualId); }
            this._registrarEventoEspecial('global', 'ASCENSÃO ASTRAL', `A Aura de ${v.nome} adensou-se, irradiando terror cósmico. Ascensão ao Grau ${v.nivel}.`);
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
    // A CAÇADA E INFLUÊNCIA LUNAR
    // ==========================================
    async mapearMortal(vampiroId, plataforma, identificador) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Corpo Astral fragmentado." };
        if (v.pontosAcao < 1) return { erro: "O Olho que Tudo Vê requer Fúria." };

        let idLimpo = identificador.trim().toLowerCase();
        if ((plataforma === 'telegram' || plataforma === 'instagram' || plataforma === 'tiktok') && !idLimpo.startsWith('@')) { if (isNaN(idLimpo)) { idLimpo = '@' + idLimpo; } }
        if (plataforma === 'whatsapp' && idLimpo.replace(/[^0-9]/g, '').length < 8) return { erro: "Cifra Inválida." };
        if (idLimpo.length < 3) return { erro: "Identidade fraca, dissolve-se nas sombras." };

        const hashAlma = this._forjarSigilo(plataforma, idLimpo);
        v.pontosAcao -= 1; this.ganharXP(vampiroId, 5); 

        if (this.rebanho[hashAlma]) return { sucesso: true, mortal: this.rebanho[hashAlma] };

        let hpBase = 500 + (v.nivel * 20); if (plataforma === 'whatsapp') hpBase *= 1.5;

        this.rebanho[hashAlma] = {
            hash: hashAlma, identificadorVisivel: idLimpo, plataforma, qualidade: "Sangue Mundano", sangueMax: hpBase, sangueAtual: hpBase, estado: 'Vibrante',
            maldicaoArcana: null, registroMordidas: [], leituraAura: "As Moiras estão tecendo a vida desta presa..."
        };
        
        this._registrarEventoEspecial('caca', 'A TEIA AUMENTA', `O fio do destino de ${idLimpo} foi atado pelas garras frias de ${v.nome}.`);
        this._salvarBancoDeDados();

        this.oraculo.lerAuraMortal(idLimpo, plataforma).then(dadosIA => {
            if(this.rebanho[hashAlma]) {
                this.rebanho[hashAlma].leituraAura = dadosIA.aura;
                let mult = dadosIA.multiplicador || 1;
                if (mult > 1) {
                    this.rebanho[hashAlma].sangueMax *= mult; this.rebanho[hashAlma].sangueAtual *= mult;
                    this.rebanho[hashAlma].qualidade = dadosIA.fama ? `Sangue Real (Notoriedade Nv.${mult})` : `Pecador Denso (Nv.${mult})`;
                    this._registrarEventoEspecial('global', 'ALMA MASSIVA', `O cheiro doce do poder emana do ${plataforma}. Uma presa de Nível ${mult} foi descoberta e adicionada ao Rebanho Global.`);
                }
                this._salvarBancoDeDados();
                if (global.io) global.io.emit('aura_atualizada', hashAlma);
            }
        });
        return { sucesso: true, mortal: this.rebanho[hashAlma] };
    }

    drenarMortal(vampiroId, hashMortal, localMordida) {
        const vampiro = this.vampiros[vampiroId]; const mortal = this.rebanho[hashMortal]; const lua = AstrolabioLunar.obterFaseAtual();
        if (!vampiro || !mortal || mortal.estado !== 'Vibrante') return { erro: "A Presa escapou pelas neblinas." };

        if (localMordida === 'purificar') {
            if (vampiro.sangue < 200) return { erro: "O Teu Sangue é ralo demais para curar. Exige 200 Gts." };
            vampiro.sangue -= 200; mortal.sangueAtual += 1000;
            mortal.registroMordidas.unshift({ predador: vampiro.nome, local: "CUIDADO NEGRO", dano: "+1000 HP", data: Date.now() });
            this._salvarBancoDeDados();
            return { roubo: 0, relato: `Verteste as tuas gotas impuras. A presa regenerou a carne dilacerada (+1000 HP).`, mortal, lootMsg: "" };
        }

        if (vampiro.pontosAcao < 1 && localMordida !== 'caricia') return { erro: "A Besta dorme. Falta Fúria." };

        if (mortal.maldicaoArcana && mortal.maldicaoArcana.donoId !== vampiroId) {
            vampiro.sangue = Math.max(0, vampiro.sangue - 300); vampiro.pontosAcao -= 1;
            let rel = { erro: `CHOQUE MAGICKO! O Selo Protetor de ${mortal.maldicaoArcana.donoNome} incinerou as tuas veias (-300 Gts).`, mortal };
            rel.alertaDono = `O parasita ${vampiro.nome} tentou roubar o néctar de [${mortal.identificadorVisivel}]. O teu Selo repeliu a escória.`;
            rel.donoId = mortal.maldicaoArcana.donoId;
            this._salvarBancoDeDados(); return rel;
        }

        if (localMordida !== 'caricia') vampiro.pontosAcao -= 1;
        
        const atr = this._obterAtributosTotais(vampiro);
        const bonusMag = Math.floor(atr.magnetismo * 10); 
        let mordidaBase = Math.floor(Math.random() * 80) + 40 + bonusMag;
        if (lua.id === 'cheia') mordidaBase = Math.floor(mordidaBase * 1.3);

        let rouboPossivel = Math.min(mordidaBase, mortal.sangueAtual);
        const conjuracao = this._conjurarGotaDeSangue(hashMortal, vampiro.id, rouboPossivel, localMordida);
        if (lua.id === 'nova') conjuracao.falha = false;

        if (conjuracao.falha) {
            vampiro.sangue = Math.max(0, vampiro.sangue - 50); this._salvarBancoDeDados();
            return { erro: `O pêndulo cósmico balançou contra ti. A aura da presa repeliu a tua sede (-50 Gts).`, mortal };
        }

        let rouboFinal = conjuracao.volume;
        mortal.sangueAtual -= rouboFinal; vampiro.sangue += rouboFinal; vampiro.estatisticas.totalDrenado += rouboFinal;
        this.ganharXP(vampiroId, localMordida === 'caricia' ? 5 : 25); 

        let lootMsg = "";
        if (Math.random() > 0.6) { vampiro.inventario.vitae += 1; lootMsg += " [+1 Cristal Vitae]"; }
        if (Math.random() > 0.96) {
            const drop = ForjaDraconiana.gerarReliquia(vampiro.nivel);
            vampiro.bolsa.push(drop); lootMsg += `\n[ARTEFATO DERRUBADO: ${drop.nome}]`;
        }

        // [ADICIONA ESTE BLOCO LOGO ABAIXO]:
        // EXTRAÇÃO ESOTÉRICA (Mente, Alma e Aura)
        let contextoIA = "Ataque violento e predatório.";
        if (localMordida === 'caricia') {
            contextoIA = "Sedução, hipnose e dreno indolor.";
            if (Math.random() > 0.5) { vampiro.inventario.memoria = (vampiro.inventario.memoria || 0) + 1; lootMsg += " [+1 Fragmento de Memória]"; }
        } else if (localMordida === 'arteria') {
            contextoIA = "Destruição brutal da jugular.";
            if (Math.random() > 0.7) { vampiro.inventario.ectoplasma = (vampiro.inventario.ectoplasma || 0) + 1; lootMsg += " [+1 Ectoplasma Corrompido]"; }
        } else if (localMordida === 'rito_frio') {
            contextoIA = "Ritual oculto de transferência direta para o cálice.";
            if (Math.random() > 0.8) { vampiro.inventario.pedraAlma = (vampiro.inventario.pedraAlma || 0) + 1; lootMsg += " [+1 Pedra da Alma Negra]"; }
        }

        mortal.registroMordidas.unshift({ predador: vampiro.nome, local: localMordida.toUpperCase(), dano: rouboFinal, data: Date.now() });

        let relato = "";
        if (localMordida === 'caricia') relato = `Enfeitiçaste a mente frágil e sorveste ${rouboFinal} Gts sem dor.`;
        else relato = `A Artéria pulsante foi dissecada. O banquete rendeu +${rouboFinal} Gts.${lootMsg}`;

        // Substitui a chamada antiga por esta, passando o contextoIA
        this._registrarEventoEspecial('caca', 'DRENO BEM SUCEDIDO', `${vampiro.nome} violou a integridade vital de ${mortal.identificadorVisivel}.`, false, contextoIA);

        mortal.registroMordidas.unshift({ predador: vampiro.nome, local: localMordida.toUpperCase(), dano: rouboFinal, data: Date.now() });

        this._registrarEventoEspecial('caca', 'DRENO BEM SUCEDIDO', `${vampiro.nome} violou a integridade vital de ${mortal.identificadorVisivel}.`, false);

        if (mortal.sangueAtual <= 0) {
            mortal.estado = 'Limbo'; vampiro.inventario.cinzas += 1; vampiro.estatisticas.mortaisSecos += 1; vampiro.influencia += 1;
            relato += " \nRUPTURA FATAL. O corpo caiu pálido ao chão. (+1 Cinzas | +1 Influência)";
            this._registrarEventoEspecial('global', 'O LIMBO', `O fio vital de ${mortal.identificadorVisivel} foi mastigado e cuspido por ${vampiro.nome}. Outro cadáver inunda a vala comum.`);
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
        return { sucesso: true, relato: `Selo Enociano gravado na testa do gado. Ele é tua posse exclusiva.` };
    }

    // ==========================================
    // SANTUÁRIOS (CLÃS)
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

    // ==========================================
    // GUERRA (PvP Tático) E MAGIA
    // ==========================================
    atacarVampiro(atacanteId, defensorId, posturaAtaque) {
        const atacante = this.vampiros[atacanteId]; const defensor = this.vampiros[defensorId]; const lua = AstrolabioLunar.obterFaseAtual();
        if (!atacante || !defensor) return { erro: "Alvo evadido da Matrix Astral." };
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
        if (lua.id === 'cheia') poderAtaque = Math.floor(poderAtaque * 1.3);

        let danoLiquido = poderAtaque - poderDefesa; let resultadoDM = "";

        if (danoLiquido > 0) {
            const danoFinal = Math.floor(danoLiquido * 3);
            defensor.sangue -= danoFinal; atacante.sangue += danoFinal;
            relato += `A aura inimiga cedeu! Rasgaste a carne astral e sorbeste ${danoFinal} Gts.`;
            resultadoDM = `As tuas barreiras mágicas ruíram. Sangraste ${danoFinal} Gts para o inimigo rir.`;
            atacante.estatisticas.vitoriasPvP += 1; this.ganharXP(atacanteId, 50);
            
            if (Math.random() > 0.85) { const drop = ForjaDraconiana.gerarReliquia(defensor.nivel); atacante.bolsa.push(drop); relato += ` Pilhaste o corpo caído: [${drop.nome}].`; }
        } else {
            const danoCounter = Math.abs(danoLiquido) * 2 + 50;
            atacante.sangue -= danoCounter; defensor.sangue += danoCounter;
            relato += `FALHA GRAVE! As maldições de ${defensor.nome} reflectiram o ataque. A tua Vontade quebrou e cedeste ${danoCounter} Gts.`;
            resultadoDM = `Tuas raízes seguraram firmes. O contra-ataque perfurou o subconsciente dele, devorando ${danoCounter} Gts de graça!`;
            defensor.estatisticas.vitoriasPvP += 1; this.ganharXP(defensorId, 40);
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
        const resultado = ritual.efeito(v, alvo, lua); this.ganharXP(vampiroId, 25);
        this._registrarEventoEspecial('global', 'VÓRTICE MÁGICO', `Cânticos profanos rasgaram a noite. ${v.nome} invocou o terror de [${ritual.nome}].`);
        this._salvarBancoDeDados(); return { sucesso: true, relato: resultado };
    }

    fabricarAlquimia(vampiroId, receitaId) {
        const v = this.vampiros[vampiroId]; const rec = this.alquimia[receitaId];
        if(!v || !rec) return { erro: "Receita borrada com fuligem." }; const c = rec.custo;
        
        // Verifica todos os requisitos esotéricos
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
        
        // Efeitos Diretos na Fórmula da Realidade
        if (receitaId === 'elixir_estamina') v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + 5);
        if (receitaId === 'amuleto_sombra') v.escudo = true;
        if (receitaId === 'lagrima_prata') v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + 1); 
        if (receitaId === 'extrato_akashico') this.ganharXP(vampiroId, 50);
        if (receitaId === 'ouro_filosofal') v.influencia += 1;
        if (receitaId === 'pedra_filosofal_negra') v.atributos.pontosLivres += 1;
        
        this.ganharXP(vampiroId, 30); this._salvarBancoDeDados(); return { sucesso: true, relato: `A Fumaça dissipou-se. [${rec.nome}] manifestou-se na tua aura.` };
    }

    // ==========================================
    // MERCADO E TRIBUTOS
    // ==========================================
    anunciarNoLeilao(vampiroId, tipo, quantiaOuHash, preco) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." }; if (preco <= 0) return { erro: "Sem valor de comércio." };
        let anuncio = { id: this.leilaoIdCounter++, vendedorId: v.id, vendedorNome: v.nome, tipo, preco, data: Date.now() };
        if (tipo === 'mortal') {
            const mortal = this.rebanho[quantiaOuHash];
            if (!mortal || !mortal.maldicaoArcana || mortal.maldicaoArcana.donoId !== v.id) return { erro: "O Trono proíbe vender o que não está selado no teu nome." };
            anuncio.hashMortal = quantiaOuHash; anuncio.nomeMortal = mortal.identificadorVisivel; mortal.estado = 'No Leilao'; 
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
        } else comprador.inventario[anuncio.tipo] += anuncio.quantia;
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
}
module.exports = { ShadowCore, AstrolabioLunar };