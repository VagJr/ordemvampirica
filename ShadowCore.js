// ShadowCore.js - O GRIMÓRIO CENTRAL DO ABISMO (Agora com MongoDB Atlas)
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

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
// A FORJA DRACONIANA E O ORÁCULO
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
            arma: ["Athame de Obsidiana", "Lâmina de Caim", "Punhal Sanguessuga", "Gládio de Asmodeus", "Foice de Saturno", "Estilete de Prata Negra"],
            armadura: ["Mortalha Esquecida", "Veste Ritualística", "Couraça de Ossos Fervidos", "Manto de Lilith", "Pele de Gárgula", "Vestes do Hierofante"],
            amuleto: ["Olho de Hécate", "Selo de Paimon", "Pentáculo Invertido", "Lágrima do Abismo", "Coração Cristalizado", "Anel de Ouro Corrompido"]
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

class OraculoAbissal {
    constructor() {
        this.GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""; 
        this.climaAstral = 'Dormente'; 
        // Usando o modelo mais atualizado para ser mais vivo
        this.endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    }

    analisarClimaAstral(logsGlobal) {
        let mortes = logsGlobal.filter(e => e.tipo && e.tipo.includes('O LIMBO')).length;
        if (mortes > 4) this.climaAstral = 'Morte Densa e Necromancia';
        else if (logsGlobal.length > 20) this.climaAstral = 'Frenesi Sanguíneo Coletivo';
        else this.climaAstral = 'Espreita Noturna';
    }

    async gerarLore(evento, detalhes) {
        if (!this.GEMINI_API_KEY) return `👁️ O Oráculo: As correntes astrais moveram-se. ${detalhes}`;
        try {
            const lua = AstrolabioLunar.obterFaseAtual();
            const prompt = `Atue como a Entidade Ancestral do Abismo (um ser sombrio e místico). Fase da Lua: ${lua.nome}. Clima: ${this.climaAstral}. Aconteceu no nosso mundo: ${detalhes}. Escreva 1 frase poética, aterrorizante e que interaja sutilmente com os sentimentos humanos ou notícias do mundo real como se nós os controlássemos.`;
            const response = await fetch(`${this.endpoint}?key=${this.GEMINI_API_KEY}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            return `👁️ A Voz do Abismo: ${data.candidates[0].content.parts[0].text}`;
        } catch (e) { return `👁️ O Oráculo dita: O Sangue encontrou o seu curso.`; }
    }

    // NOVA FUNÇÃO: O Oráculo conversa com os jogadores
    async conversarNoChat(nomeVampiro, mensagemHumana) {
        if (!this.GEMINI_API_KEY) return `Minhas correntes estão seladas.`;
        try {
            const prompt = `Você é o "Oráculo Abissal", a entidade onisciente de pura magia negra que rege os vampiros. O vampiro de nome [${nomeVampiro}] acabou de dizer no salão o seguinte: "${mensagemHumana}". Responda diretamente a ele. Seja sombrio, irônico, enigmático. Use metáforas de sangue, trevas ou manipulação da sociedade humana. Mantenha em no máximo 2 frases marcantes.`;
            const response = await fetch(`${this.endpoint}?key=${this.GEMINI_API_KEY}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) { return `Teus sussurros se perdem na tempestade astral, criatura.`; }
    }

    async lerAuraMortal(identificador, plataforma) {
        if (!this.GEMINI_API_KEY) return { fama: false, aura: "Aura mundana e densa. Alma comum." };
        try {
            const prompt = `Leia a aura de "${identificador}" na rede ${plataforma}. Responda APENAS em JSON estrito: {"fama": true/false, "aura": "texto"}. Se for pessoa real famosa, fama: true. Escreva a "aura" revelando os pecados ou conquistas dela como se fossem saborosos para nós.`;
            const response = await fetch(`${this.endpoint}?key=${this.GEMINI_API_KEY}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);
        } catch (e) { return { fama: false, aura: "As brumas escondem os pecados desta alma." }; }
    }
}

// ==========================================
// RITUAL MAIOR: O NÚCLEO DA ORDEM COM MONGODB
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
        
        this.grimorio = {
            'solve_coagula': { nome: "Solve et Coagula", lore: 'Dissolve a Vontade (Estamina) do inimigo.', custoAcao: 2, custoSangue: 150, reqLevel: 1, tipo: 'pvp', efeito: (a, d, l) => { let dreno = l.id === 'minguante' ? 8 : 4; d.pontosAcao = Math.max(0, d.pontosAcao - dreno); return `Vitalidade desfeita (-${dreno} Fúria).`; } },
            'sanguis_aeternum': { nome: "Selo de Aemeth", lore: 'Escudo Divino Invertido.', custoAcao: 1, custoSangue: 300, reqLevel: 2, tipo: 'buff', efeito: (a, d, l) => { a.escudo = true; return `Selo Activo. Escudo Invulnerável.`; } },
            'maledictio_sanguinis': { nome: "O Olho Mau", lore: 'Corrompe o Cálice inimigo.', custoAcao: 3, custoSangue: 1000, reqLevel: 5, tipo: 'pvp', efeito: (a, d, l) => { let per = l.id === 'minguante' ? 0.2 : 0.1; const dreno = Math.floor(d.calice * per); d.calice -= dreno; return `O teu olho converteu ${dreno} Gts em cinzas no Cálice inimigo.`; } },
            'rito_da_besta': { nome: "Rito de Gamaliel", lore: 'Restaura Fúria.', custoAcao: 0, custoSangue: 800, reqLevel: 3, tipo: 'buff', efeito: (a, d, l) => { let cura = l.id === 'minguante' ? 6 : 3; a.pontosAcao = Math.min(a.maxAcao, a.pontosAcao + cura); return `O sangue ferveu. +${cura} Fúria.`; } },
            'sussurro_bael': { nome: "Sussurro de Bael", lore: 'Rouba Influência.', custoAcao: 4, custoSangue: 1500, reqLevel: 6, tipo: 'pvp', efeito: (a, d, l) => { let dreno = Math.min(5, d.influencia); d.influencia -= dreno; a.influencia += dreno; return `Roubaste ${dreno} Influência a ${d.nome}.`; } }
        };

        this.alquimia = {
            'elixir_estamina': { nome: 'Filtro do Frenesi', custo: { anima: 2, vitae: 1, gts: 300 }, efeito: 'Restaura 5 Fúria.' },
            'amuleto_sombra': { nome: 'Talismã Protetor', custo: { cinzas: 3, anima: 1, gts: 500 }, efeito: 'Garante Escudo.' },
            'lagrima_prata': { nome: 'Lágrima de Prata', custo: { vitae: 3, cinzas: 2, gts: 1000 }, efeito: 'Restaura 1 Fúria.' },
            'pedra_filosofal_negra': { nome: 'Pedra Negra', custo: { anima: 5, vitae: 5, cinzas: 5, gts: 5000 }, efeito: '+1 Atributo.' }
        };

        this.conquistas = {
            'neofito': { id: 'neofito', titulo: 'Neófito Sedento', requisito: v => v.estatisticas.totalDrenado >= 100 },
            'assassino': { id: 'assassino', titulo: 'Ceifador de Almas', requisito: v => v.estatisticas.mortaisSecos >= 5 },
            'mestre_guerras': { id: 'mestre_guerras', titulo: 'Lâmina do Abismo', requisito: v => v.estatisticas.vitoriasPvP >= 10 },
            'anciao': { id: 'anciao', titulo: 'Ancião Sombrio', requisito: v => v.nivel >= 10 },
            'arquimago': { id: 'arquimago', titulo: 'Hierofante Oculto', requisito: v => v.atributos.gnose >= 15 }
        };
    }

    // ==========================================
    // PERSISTÊNCIA NO MONGODB ATLAS
    // ==========================================
    async conectarDatabase() {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("CRÍTICO: Variável MONGO_URI não encontrada. O servidor irá colapsar.");
            process.exit(1);
        }
        
        try {
            this.mongoClient = new MongoClient(uri);
            await this.mongoClient.connect();
            const db = this.mongoClient.db('sanguinis_db');
            this.dbCollection = db.collection('registos_akashicos');
            
            // Tenta puxar a matriz existente
            const doc = await this.dbCollection.findOne({ _id: 'MATRIZ_PRINCIPAL' });
            if (doc) {
                this.vampiros = doc.vampiros || {};
                this.rebanho = doc.rebanho || {};
                this.clans = doc.clans || {};
                this.leilaoP2P = doc.leilaoP2P || [];
                this.leilaoIdCounter = doc.leilaoIdCounter || 1;
                this.logs = doc.logs || { global: [], caca: [], guerra: [] };
                console.log("🦇 O Monólito Eterno abriu-se. Almas carregadas do MongoDB Atlas.");
            } else {
                console.log("🌑 Nenhuma matriz encontrada no MongoDB. O Abismo está vazio. Aguardando o Gênesis.");
            }
        } catch (error) {
            console.error("Falha ao invocar o MongoDB Atlas:", error);
            // Removido o process.exit(1) para não derrubar o servidor caso a rede do Render trave.
        }
    }

    _salvarBancoDeDados() {
        if (!this.dbCollection) return;
        const data = {
            vampiros: this.vampiros, rebanho: this.rebanho, clans: this.clans,
            leilaoP2P: this.leilaoP2P, leilaoIdCounter: this.leilaoIdCounter, logs: this.logs
        };
        // Grava no MongoDB sem bloquear a thread principal
        this.dbCollection.updateOne({ _id: 'MATRIZ_PRINCIPAL' }, { $set: data }, { upsert: true })
            .catch(e => console.error("Erro na gravação das almas:", e));
    }

    // ==========================================
    // MAGIA NEGRA E CRIPTOGRAFIA
    // ==========================================
    _extrairDnaEspiritual(nome) {
        const gematria = { 'a':1, 'b':2, 'c':3, 'd':4, 'e':5, 'f':6, 'g':7, 'h':8, 'i':9, 'j':10, 'k':20, 'l':30, 'm':40, 'n':50, 'o':60, 'p':70, 'q':80, 'r':90, 's':100, 't':200, 'u':300, 'v':400, 'w':500, 'x':600, 'y':700, 'z':800 };
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
        else if (localMordida === 'caricia') { mult = 0.1; risco = 0; } // Sobe suave, beijo sutil.

        if (Math.random() * 100 < risco) return { hash: gotaHash, volume: 0, critico: false, falha: true };
        if (ressonancia > 220) mult *= 1.5; 
        
        return { hash: gotaHash, volume: Math.floor(quantiaBase * mult), critico: ressonancia > 220, falha: false };
    }

    _registrarEvento(categoria, tipo, relato, global = true) {
        const lua = AstrolabioLunar.obterFaseAtual();
        const evento = { tipo: `${tipo} [${lua.nome}]`, relato, data: Date.now() };
        
        if (this.logs[categoria]) {
            this.logs[categoria].unshift(evento);
            if (this.logs[categoria].length > 100) this.logs[categoria].pop();
        }
        if (global) {
            this.logs.global.unshift(evento);
            if (this.logs.global.length > 200) this.logs.global.pop();
            this.oraculo.analisarClimaAstral(this.logs.global);
        }
        return evento;
    }

    // ==========================================
    // O PACTO DE SANGUE E VÍNCULO DO TELEGRAM
    // ==========================================
    despertarViaTelegram(tgId, tgUsername, nomeSombrio, senha, inviteCode) {
        const idSombrio = 'SNG_' + crypto.createHash('sha256').update(tgId.toString()).digest('hex').substring(0, 8).toUpperCase();
        
        // Autenticação Existente
        if(this.vampiros[idSombrio]) {
            const v = this.vampiros[idSombrio];
            const hashTentativa = crypto.pbkdf2Sync(senha, v.id, 10000, 64, 'sha512').toString('hex');
            if (v.senhaHash !== hashTentativa) return { existente: true, recusado: true, erro: "Senha falsa. O Abismo repudia a tua mentira." };
            return { existente: true, recusado: false, vampiro: v };
        }

        // --- A CRIAÇÃO DO PRIMEIRO VAMPIRO (AUTO-GÊNESE) ---
        const isFirstVampire = Object.keys(this.vampiros).length === 0;
        let senhor = this.vampiros[inviteCode];
        
        // Regra de Ouro: Só passa se tiver convite OU se for a primeira alma a abrir o app
        if (!senhor && !isFirstVampire) {
            return { existente: false, recusado: true, erro: "A Porta está fechada. Um Convite de outro Imortal é obrigatório." };
        }

        const geracao = isFirstVampire ? 1 : (senhor.geracao + 1);
        const senhaHashGerada = crypto.pbkdf2Sync(senha, idSombrio, 10000, 64, 'sha512').toString('hex');

        // VÍNCULO CARNAL (OSINT AUTOMÁTICO): Verifica se este utilizador já foi caçado como mortal
        let extraHp = 0;
        let extraAnima = 0;
        if (tgUsername) {
            const hashMortal = this._forjarSigilo('telegram', `@${tgUsername.toLowerCase()}`);
            const registroMortal = this.rebanho[hashMortal];
            if (registroMortal) {
                if (registroMortal.estado === 'Limbo') {
                    extraAnima = 2; // Acorda das cinzas mais forte espiritualmente
                    this._registrarEvento('global', 'RESSURREIÇÃO', `A poeira do mortal ${tgUsername} fundiu-se em ${nomeSombrio}. Eles ascenderam do Limbo.`);
                } else {
                    extraHp = Math.floor(registroMortal.sangueAtual * 0.5); // Absorve o resto do próprio sangue
                }
                // Apaga o registo mortal dele, pois ele evoluiu
                delete this.rebanho[hashMortal];
            }
        }

        this.vampiros[idSombrio] = {
            id: idSombrio, tgId, tgUsername: tgUsername ? `@${tgUsername}` : 'Mortal_Sem_Rosto', 
            nome: nomeSombrio, senhaHash: senhaHashGerada,
            sangue: (isFirstVampire ? 15000 : 500) + extraHp, calice: 0, geracao, 
            clan: senhor ? senhor.clan : 'Sangue Ralo', 
            estado: 'Ativo', senhor: senhor ? senhor.id : 'O_PRIMORDIAL', linhagem: [],
            pontosAcao: isFirstVampire ? 999 : 10, maxAcao: isFirstVampire ? 999 : 10, escudo: false, nivel: isFirstVampire ? 99 : 1, xp: 0, xpProx: 100, 
            
            influencia: isFirstVampire ? 100 : 0, titulos: ['Sangue Frio'], tituloAtual: isFirstVampire ? 'Lorde Dracônico' : 'Sangue Frio', conquistas: [],
            atributos: { vontade: 5, gnose: 5, magnetismo: 5, densidade: 5, pontosLivres: 0 },
            equipamentos: { arma: null, armadura: null, amuleto: null }, bolsa: [], 
            inventario: { anima: extraAnima, cinzas: 0, vitae: 0 }, historicoCombate: [], poderesDesbloqueados: ['solve_coagula'],
            estatisticas: { totalDrenado: 0, mortaisSecos: 0, vitoriasPvP: 0 }
        };

        if (isFirstVampire) {
            this.vampiros[idSombrio].titulos.push('Lorde Dracônico');
            this.fundarClan(idSombrio, 'Ordem Draconis');
            this._registrarEvento('global', 'O PRIMEVO DESPERTA', `O Lorde Ancestral [${nomeSombrio}] materializou-se. A História Sangrenta começou.`);
        } else {
            senhor.linhagem.push(idSombrio); senhor.sangue += 500; senhor.influencia += 5;
            this.ganharXP(senhor.id, 50); 
            if (senhor.clan !== 'Sangue Ralo' && this.clans[senhor.clan]) this.clans[senhor.clan].membros.push(idSombrio);
            this._registrarEvento('global', 'O ABRAÇO', `A alma de ${nomeSombrio} transmutou-se pelas mãos de ${senhor.nome}.`);
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
        if (!v || v.atributos.pontosLivres < 1) return { erro: "Falta Iluminação." };
        if (v.atributos[atributo] === undefined) return { erro: "Pilar Inexistente." };
        v.atributos[atributo] += 1; v.atributos.pontosLivres -= 1;
        if (atributo === 'densidade') v.sangue += 200; 
        if (atributo === 'vontade') v.maxAcao += 1; 
        this._salvarBancoDeDados(); return { sucesso: true, relato: `Esfera de ${atributo.toUpperCase()} ampliada.` };
    }

    mudarTitulo(vampiroId, novoTitulo) {
        const v = this.vampiros[vampiroId];
        if (!v || !v.titulos.includes(novoTitulo)) return { erro: "A Ordem não te reconhece assim." };
        v.tituloAtual = novoTitulo; this._salvarBancoDeDados(); return { sucesso: true, relato: `És agora ${novoTitulo}.` };
    }

    equiparReliquia(vampiroId, reliquiaId) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        const itemIdx = v.bolsa.findIndex(i => i.id === reliquiaId);
        if (itemIdx === -1) return { erro: "Relíquia não te pertence." };
        const item = v.bolsa[itemIdx]; const atual = v.equipamentos[item.tipo];
        v.equipamentos[item.tipo] = item; v.bolsa.splice(itemIdx, 1);
        if (atual) v.bolsa.push(atual);
        this._salvarBancoDeDados(); return { sucesso: true, relato: `Aglomeraste o poder de [${item.nome}].` };
    }

    ganharXP(id, quantia) {
        const v = this.vampiros[id];
        if (!v || v.estado === 'Banido') return;
        v.xp += quantia;
        if (v.xp >= v.xpProx) {
            v.nivel += 1; v.xp -= v.xpProx; v.xpProx = Math.floor(v.xpProx * 1.5); 
            v.maxAcao += 2; v.pontosAcao = v.maxAcao; 
            v.atributos.pontosLivres += 3; v.influencia += 2; 
            for (let ritualId in this.grimorio) {
                if (v.nivel >= this.grimorio[ritualId].reqLevel && !v.poderesDesbloqueados.includes(ritualId)) v.poderesDesbloqueados.push(ritualId);
            }
            this._registrarEvento('global', 'ASCENSÃO ASTRAL', `A Aura de ${v.nome} adensou-se. Grau ${v.nivel}.`);
        }
        this._verificarConquistas(v);
        this._salvarBancoDeDados();
    }
	
	_verificarConquistas(vampiro) {
        if (!vampiro || !vampiro.conquistas) return;
        
        for (let key in this.conquistas) {
            let conquista = this.conquistas[key];
            
            // Se a alma ainda não obteve a conquista, mas agora cumpre os requisitos
            if (!vampiro.conquistas.includes(conquista.id) && conquista.requisito(vampiro)) {
                vampiro.conquistas.push(conquista.id);
                
                // Concede o Título Sombrio
                if (!vampiro.titulos.includes(conquista.titulo)) {
                    vampiro.titulos.push(conquista.titulo);
                }
                
                this._registrarEvento('global', 'ASCENSÃO PROFANA', `O Abismo sussurra um novo nome. ${vampiro.nome} foi reconhecido como [${conquista.titulo}].`);
            }
        }
    }

    // ==========================================
    // A CAÇADA E INFLUÊNCIA LUNAR
    // ==========================================
    async mapearMortal(vampiroId, plataforma, identificador) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Corpo Astral não encontrado." };
        if (v.pontosAcao < 1) return { erro: "O Olho requer Fúria. Descansa." };

        let idLimpo = identificador.trim().toLowerCase();
        
        if ((plataforma === 'telegram' || plataforma === 'instagram' || plataforma === 'tiktok') && !idLimpo.startsWith('@')) {
            if (isNaN(idLimpo)) { idLimpo = '@' + idLimpo; }
        }

        if (plataforma === 'whatsapp' && idLimpo.replace(/[^0-9]/g, '').length < 8) return { erro: "Número Inválido." };
        if (idLimpo.length < 3) return { erro: "Identidade demasiado fraca." };

        const hashAlma = this._forjarSigilo(plataforma, idLimpo);
        v.pontosAcao -= 1; this.ganharXP(vampiroId, 5); 

        if (this.rebanho[hashAlma]) return { sucesso: true, mortal: this.rebanho[hashAlma] };

        let hpBase = 500 + (v.nivel * 20); 
        if (plataforma === 'whatsapp') hpBase *= 1.5;

        this.rebanho[hashAlma] = {
            hash: hashAlma, identificadorVisivel: idLimpo, 
            plataforma, qualidade: "Sangue Mundano", sangueMax: hpBase, sangueAtual: hpBase, estado: 'Vibrante',
            maldicaoArcana: null, registroMordidas: [], leituraAura: "Lendo as teias do destino..."
        };
        
        this._registrarEvento('caca', 'A TEIA AUMENTA', `A Roda girou. O mortal ${idLimpo} foi atado por ${v.nome}.`);
        this._salvarBancoDeDados();

        this.oraculo.lerAuraMortal(idLimpo, plataforma).then(dadosIA => {
            if(this.rebanho[hashAlma]) {
                this.rebanho[hashAlma].leituraAura = dadosIA.aura;
                if (dadosIA.fama) {
                    this.rebanho[hashAlma].sangueMax *= 10; 
                    this.rebanho[hashAlma].sangueAtual *= 10;
                    this.rebanho[hashAlma].qualidade = "Sangue Real (Fama)";
                    this._registrarEvento('global', 'ALMA MASSIVA', `Figura célebre no ${plataforma}. O Banquete está servido.`);
                }
                this._salvarBancoDeDados();
                if (global.io) global.io.emit('aura_atualizada', hashAlma);
            }
        });

        return { sucesso: true, mortal: this.rebanho[hashAlma] };
    }

    drenarMortal(vampiroId, hashMortal, localMordida) {
        const vampiro = this.vampiros[vampiroId]; const mortal = this.rebanho[hashMortal];
        const lua = AstrolabioLunar.obterFaseAtual();
        
        if (!vampiro || !mortal || mortal.estado !== 'Vibrante') return { erro: "Presa inacessível." };

        // MAGIA DE CUIDADO: PURIFICAÇÃO DO GADO
        if (localMordida === 'purificar') {
            if (vampiro.sangue < 200) return { erro: "Falta Sangue para partilhar com o seu rebanho (Custa 200 Gts)." };
            vampiro.sangue -= 200;
            mortal.sangueAtual += 1000;
            mortal.registroMordidas.unshift({ predador: vampiro.nome, local: "CUIDADO NEGRO", dano: "+1000 HP", data: Date.now() });
            this._salvarBancoDeDados();
            return { roubo: 0, relato: `Derramaste do teu sangue. A presa alimentou-se e purificou-se (+1000 HP).`, mortal, lootMsg: "" };
        }

        if (vampiro.pontosAcao < 1 && localMordida !== 'caricia') return { erro: "Falta-te Fúria." };

        if (mortal.maldicaoArcana && mortal.maldicaoArcana.donoId !== vampiroId) {
            vampiro.sangue = Math.max(0, vampiro.sangue - 300); vampiro.pontosAcao -= 1;
            let rel = { erro: `CHOQUE MAGICKO! O Selo de ${mortal.maldicaoArcana.donoNome} queimou as tuas veias (-300 Gts).`, mortal };
            rel.alertaDono = `O vampiro ${vampiro.nome} tentou beber de [${mortal.identificadorVisivel}] e foi queimado pelo teu Selo.`;
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
            return { erro: `A aura do humano repeliu-te (-50 Gts).`, mortal };
        }

        let rouboFinal = conjuracao.volume;
        mortal.sangueAtual -= rouboFinal; vampiro.sangue += rouboFinal; vampiro.estatisticas.totalDrenado += rouboFinal;
        this.ganharXP(vampiroId, localMordida === 'caricia' ? 5 : 25); 

        let lootMsg = "";
        if (Math.random() > 0.6) { vampiro.inventario.vitae += 1; lootMsg += " [+1 Vitae]"; }
        if (Math.random() > 0.96) {
            const drop = ForjaDraconiana.gerarReliquia(vampiro.nivel);
            vampiro.bolsa.push(drop); lootMsg += `\n[ARTEFATO: ${drop.nome}]`;
        }

        mortal.registroMordidas.unshift({ predador: vampiro.nome, local: localMordida.toUpperCase(), dano: rouboFinal, data: Date.now() });

        let relato = "";
        if (localMordida === 'caricia') relato = `Acariciaste a veia docemente. Um beijo roubou ${rouboFinal} Gts.`;
        else relato = `A Artéria foi aberta. +${rouboFinal} Gts.${lootMsg}`;

        this._registrarEvento('caca', 'DRENO BEM SUCEDIDO', `${vampiro.nome} bebeu furtivamente de ${mortal.identificadorVisivel}.`, false);

        if (mortal.sangueAtual <= 0) {
            mortal.estado = 'Limbo'; vampiro.inventario.cinzas += 1; vampiro.estatisticas.mortaisSecos += 1; vampiro.influencia += 1;
            relato += " RUPTURA FATAL. (+1 Cinzas | +1 Influência)";
            this._registrarEvento('global', 'O LIMBO', `Fiação Cortada. O mortal ${mortal.identificadorVisivel} secou completamente por ${vampiro.nome}.`);
        }
        
        this._salvarBancoDeDados();
        return { roubo: rouboFinal, relato, mortal, lootMsg };
    }

    comprometerMortal(vampiroId, hashMortal) {
        const vampiro = this.vampiros[vampiroId]; const mortal = this.rebanho[hashMortal];
        if (!vampiro || !mortal) return { erro: "Brumas." };
        if (vampiro.sangue < 800) return { erro: "O Domínio exige 800 Gts." };
        if (mortal.estado === 'No Leilao') return { erro: "A alma jaz trancada." };
        if (mortal.maldicaoArcana) return { erro: "A Alma já está subjugada." };

        vampiro.sangue -= 800;
        // O Selo usa a matemática de Criptografia do backend
        const selo = crypto.createHash('sha256').update(hashMortal + vampiroId).digest('hex').substring(0,8);
        mortal.maldicaoArcana = { selo, donoId: vampiro.id, donoNome: vampiro.nome };
        this._registrarEvento('caca', 'CORRUPÇÃO ASTRAL', `O corpo de ${mortal.identificadorVisivel} pertence a ${vampiro.nome}.`);
        this._salvarBancoDeDados();
        return { sucesso: true, relato: "Selo cravado. O gado é teu." };
    }

    // ==========================================
    // SANTUÁRIOS (CLÃS)
    // ==========================================
    fundarClan(vampiroId, nomeClan) {
        const v = this.vampiros[vampiroId];
        if (!v || v.sangue < 2000) return { erro: "O Abismo exige 2000 Gts para erguer um Santuário." };
        if (v.clan !== 'Sangue Ralo') return { erro: "Já juraste fidelidade a um Clã." };
        if (this.clans[nomeClan]) return { erro: "Este nome já ecoa nas sombras." };

        v.sangue -= 2000; v.clan = nomeClan;
        this.clans[nomeClan] = { nome: nomeClan, lider: v.id, liderNome: v.nome, cofre: 0, membros: [v.id], nivel: 1 };

        const converterLinhagem = (senhorId) => {
            const s = this.vampiros[senhorId];
            s.linhagem.forEach(criaId => {
                const cria = this.vampiros[criaId];
                if (cria && cria.clan === 'Sangue Ralo') {
                    cria.clan = nomeClan; this.clans[nomeClan].membros.push(cria.id); converterLinhagem(cria.id);
                }
            });
        };
        converterLinhagem(v.id);
        this._registrarEvento('global', 'SANTUÁRIO ERGUIDO', `A linhagem de ${v.nome} fundou o Clã [${nomeClan}].`);
        this._salvarBancoDeDados();
        return { sucesso: true, relato: `O Santuário ${nomeClan} foi fundado.` };
    }

    operarCofreClan(vampiroId, quantia, operacao) {
        const v = this.vampiros[vampiroId];
        if (!v || v.clan === 'Sangue Ralo') return { erro: "És um Sangue Ralo." };
        const clan = this.clans[v.clan];
        if (!clan) return { erro: "Clã desvanecido." };

        if (operacao === 'depositar') {
            if (v.sangue < quantia) return { erro: "Falta Sangue para doar." };
            v.sangue -= quantia; clan.cofre += quantia;
            this._salvarBancoDeDados();
            return { sucesso: true, relato: `Oferendaste ${quantia} Gts ao Clã.` };
        } else {
            if (clan.lider !== v.id) return { erro: "Apenas o Hierofante (Líder) pode exaurir o Cofre." };
            if (clan.cofre < quantia) return { erro: "Cofre seco." };
            clan.cofre -= quantia; v.sangue += quantia;
            this._salvarBancoDeDados();
            return { sucesso: true, relato: `Extraíste ${quantia} Gts do Clã.` };
        }
    }

    // ==========================================
    // GUERRA (PvP Tático) E RITUAIS DE MAGIA
    // ==========================================
    atacarVampiro(atacanteId, defensorId, posturaAtaque) {
        const atacante = this.vampiros[atacanteId]; const defensor = this.vampiros[defensorId];
        const lua = AstrolabioLunar.obterFaseAtual();
        
        if (!atacante || !defensor) return { erro: "Alvo evadido." };
        if (atacante.pontosAcao < 3) return { erro: "A Guerra exige 3 Fúrias." };
        if (defensor.estado === 'Banido') return { erro: "Lutar contra pó não traz glória." };

        let dmAlerta = `A TUA AURA FOI ATACADA!\n${atacante.nome} tentou emboscar-te. O combate desenrolou-se:\n`;

        if (defensor.escudo) {
            atacante.pontosAcao -= 3; defensor.escudo = false; this._salvarBancoDeDados();
            return { sucesso: false, relato: `O Pentáculo protegeu ${defensor.nome}! Escudo quebrou.`, alertaDono: dmAlerta + "O teu Escudo Arcano salvou-te de perder Sangue, mas foi destruído.", donoId: defensor.id };
        }

        atacante.pontosAcao -= 3;
        const atrAta = this._obterAtributosTotais(atacante);
        const atrDef = this._obterAtributosTotais(defensor);

        let poderAtaque = 0; let poderDefesa = 0; let relato = "";

        if (posturaAtaque === 1) { poderAtaque = atrAta.vontade * 10 + (atacante.nivel * 5); poderDefesa = atrDef.densidade * 8; relato += "[Vontade] "; } 
        else if (posturaAtaque === 2) { poderAtaque = atrAta.gnose * 12 + (atacante.nivel * 5); poderDefesa = atrDef.gnose * 10; relato += "[Feitiçaria] "; } 
        else { poderAtaque = atrAta.magnetismo * 15 + (atacante.nivel * 5); poderDefesa = atrDef.vontade * 10; relato += "[Ilusão] "; }

        poderAtaque += Math.floor(Math.random() * 50); poderDefesa += Math.floor(Math.random() * 50);
        if (atacante.geracao < defensor.geracao) poderAtaque += 50; 
        if (lua.id === 'cheia') poderAtaque = Math.floor(poderAtaque * 1.3);

        let danoLiquido = poderAtaque - poderDefesa;
        let resultadoDM = "";

        if (danoLiquido > 0) {
            const danoFinal = Math.floor(danoLiquido * 3);
            defensor.sangue -= danoFinal; atacante.sangue += danoFinal;
            relato += `A aura inimiga rasgou! Sorbeste ${danoFinal} Gts.`;
            resultadoDM = `As tuas defesas falharam. Perdeste ${danoFinal} Gts de sangue para o atacante.`;
            atacante.estatisticas.vitoriasPvP += 1; this.ganharXP(atacanteId, 50);
            
            if (Math.random() > 0.85) {
                const drop = ForjaDraconiana.gerarReliquia(defensor.nivel);
                atacante.bolsa.push(drop); relato += ` Despojaste uma Relíquia: [${drop.nome}].`;
            }
        } else {
            const danoCounter = Math.abs(danoLiquido) * 2 + 50;
            atacante.sangue -= danoCounter; defensor.sangue += danoCounter;
            relato += `Falha crítica! As defesas de ${defensor.nome} reflectiram. Perdeste ${danoCounter} Gts.`;
            resultadoDM = `Tu resististe à investida e contra-atacaste no subconsciente dele. Ganhaste ${danoCounter} Gts do sangue dele!`;
            defensor.estatisticas.vitoriasPvP += 1; this.ganharXP(defensorId, 40);
        }

        atacante.historicoCombate.unshift(`Atacaste ${defensor.nome}: ${relato}`);
        defensor.historicoCombate.unshift(`Sofreste investida de ${atacante.nome}: ${relato}`);
        this._registrarEvento('guerra', 'DUELO DE SANGUE', `${atacante.nome} colidiu com ${defensor.nome}.`);
        
        this._salvarBancoDeDados();
        return { sucesso: true, relato, alertaDono: dmAlerta + resultadoDM, donoId: defensor.id };
    }

    conjurarRitual(vampiroId, ritualId, alvoId) {
        const v = this.vampiros[vampiroId]; const ritual = this.grimorio[ritualId]; const lua = AstrolabioLunar.obterFaseAtual();
        if (!v || !ritual) return { erro: "Ritual Inexistente." };
        if (!v.poderesDesbloqueados.includes(ritualId)) return { erro: "Grau insuficiente." };
        if (v.pontosAcao < ritual.custoAcao) return { erro: "Falta Fúria." };
        if (v.sangue < ritual.custoSangue) return { erro: "Sangue Gts Insuficiente." };
        let alvo = alvoId ? this.vampiros[alvoId] : v;
        if (alvoId && (!alvo || alvo.estado === 'Banido')) return { erro: "O Alvo não habita mais a nossa realidade." };
        
        v.pontosAcao -= ritual.custoAcao; v.sangue -= ritual.custoSangue;
        const resultado = ritual.efeito(v, alvo, lua); this.ganharXP(vampiroId, 25);
        this._registrarEvento('global', 'VÓRTICE MÁGICO', `${v.nome} invocou [${ritual.nome}].`);
        this._salvarBancoDeDados();
        return { sucesso: true, relato: resultado };
    }

    fabricarAlquimia(vampiroId, receitaId) {
        const v = this.vampiros[vampiroId]; const rec = this.alquimia[receitaId];
        if(!v || !rec) return { erro: "Página arrancada." }; const c = rec.custo;
        if(v.inventario.anima < (c.anima||0) || v.inventario.cinzas < (c.cinzas||0) || v.inventario.vitae < (c.vitae||0) || v.sangue < c.gts) return { erro: "Oferenda incompleta." };
        v.inventario.anima -= (c.anima||0); v.inventario.cinzas -= (c.cinzas||0); v.inventario.vitae -= (c.vitae||0); v.sangue -= c.gts;
        if (receitaId === 'elixir_estamina') v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + 5);
        if (receitaId === 'amuleto_sombra') v.escudo = true;
        if (receitaId === 'lagrima_prata') { v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + 1); }
        if (receitaId === 'pedra_filosofal_negra') v.atributos.pontosLivres += 1;
        this.ganharXP(vampiroId, 30); this._salvarBancoDeDados(); return { sucesso: true, relato: `A Forja brilhou. ${rec.nome} sintetizado.` };
    }

    // Leilao
    anunciarNoLeilao(vampiroId, tipo, quantiaOuHash, preco) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." }; if (preco <= 0) return { erro: "Sem valor." };
        let anuncio = { id: this.leilaoIdCounter++, vendedorId: v.id, vendedorNome: v.nome, tipo, preco, data: Date.now() };
        if (tipo === 'mortal') {
            const mortal = this.rebanho[quantiaOuHash];
            if (!mortal || !mortal.maldicaoArcana || mortal.maldicaoArcana.donoId !== v.id) return { erro: "Só vendes as tuas posses seladas." };
            anuncio.hashMortal = quantiaOuHash; anuncio.nomeMortal = mortal.identificadorVisivel; mortal.estado = 'No Leilao'; 
        } else {
            if (!v.inventario[tipo] || v.inventario[tipo] < quantiaOuHash) return { erro: "Inventário vazio." };
            v.inventario[tipo] -= quantiaOuHash; anuncio.quantia = quantiaOuHash;
        }
        this.leilaoP2P.push(anuncio); this._salvarBancoDeDados(); return { sucesso: true, relato: "Contrato assinado." };
    }

    comprarDoLeilao(compradorId, anuncioId) {
        const comprador = this.vampiros[compradorId]; const idx = this.leilaoP2P.findIndex(a => a.id === anuncioId);
        if (idx === -1) return { erro: "Pacto ardido." }; const anuncio = this.leilaoP2P[idx];
        if (comprador.sangue < anuncio.preco) return { erro: "Sede grande, sangue pouco." };
        if (compradorId === anuncio.vendedorId) return { erro: "Loucura." };
        const vendedor = this.vampiros[anuncio.vendedorId]; comprador.sangue -= anuncio.preco;
        if (vendedor) vendedor.sangue += Math.floor(anuncio.preco * 0.95);
        if (anuncio.tipo === 'mortal') {
            const mortal = this.rebanho[anuncio.hashMortal];
            if (mortal) { mortal.maldicaoArcana.donoId = comprador.id; mortal.maldicaoArcana.donoNome = comprador.nome; mortal.estado = 'Vibrante'; }
        } else comprador.inventario[anuncio.tipo] += anuncio.quantia;
        this.leilaoP2P.splice(idx, 1); this._salvarBancoDeDados(); return { sucesso: true, relato: "Transação efetuada." };
    }

    operarCalice(id, quantia, operacao) {
        const v = this.vampiros[id]; if (!v) return { erro: "Vazio." };
        if (operacao === 'depositar') {
            if (v.sangue < quantia) return { erro: "Sangue Escasso." };
            v.sangue -= quantia; v.calice += quantia; this._salvarBancoDeDados(); return { sucesso: true, relato: `Selo trancado. ${quantia} Gts no Cofre.` };
        } else {
            if (v.calice < quantia) return { erro: "O Cálice tem o fundo seco." };
            v.calice -= quantia; v.sangue += quantia; this._salvarBancoDeDados(); return { sucesso: true, relato: `A tampa remove-se. O fluxo regressou (${quantia} Gts).` };
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
            if (v.sangue <= 0) { v.estado = 'Banido'; this._registrarEvento('global', 'O FIM DA BESTA', `A Essência de ${v.nome} pulverizou-se pela Fome Eterna.`); }
            if (v.calice > 0) v.calice += Math.floor(v.calice * 0.02); 
            
            let recup = lua.id === 'crescente' ? 0.8 : 0.5;
            if (v.pontosAcao < v.maxAcao && Math.random() > (1 - recup)) v.pontosAcao += 1; 
        }
        for (let c in this.clans) {
            if (this.clans[c].cofre > 0) this.clans[c].cofre += Math.floor(this.clans[c].cofre * 0.01);
        }
        
        if (Math.random() > 0.8) this._salvarBancoDeDados(); // Auto-save compassado
    }
}
module.exports = { ShadowCore, AstrolabioLunar };