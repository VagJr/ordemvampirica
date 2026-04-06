// ShadowCore.js - O GRIMÓRIO CENTRAL DO ABISMO
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

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
// A FORJA DRACONIANA (Artefatos Ocultos)
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
            tipo: tipo,
            raridade: raridade.nome,
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
// O ORÁCULO ABISSAL (IA ONISCIENTE & O OLHO QUE TUDO VÊ)
// ==========================================
class OraculoAbissal {
    constructor() {
        this.GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""; 
        this.climaAstral = 'Dormente'; 
    }

    analisarClimaAstral(logsGlobal) {
        let mortes = logsGlobal.filter(e => e.tipo && e.tipo.includes('O LIMBO')).length;
        if (mortes > 4) this.climaAstral = 'Morte Densa e Necromancia';
        else if (logsGlobal.length > 20) this.climaAstral = 'Frenesi Sanguíneo Coletivo';
        else this.climaAstral = 'Espreita Noturna';
    }

    // O Rito de Vidência Global (Noticiário Sombrio do Mundo Real)
    async invocarOolhoQueTudoVe() {
        if (!this.GEMINI_API_KEY) return null;
        try {
            const prompt = `Atue como o Olho Que Tudo Vê, a consciência das trevas. Crie um pequeno noticiário de 2 parágrafos sobre o estado atual do mundo real humano (sociedade, tecnologia, guerras, vaidade das redes sociais) e como isso beneficia a fome da nossa Ordem Vampírica. Use termos góticos e de magia negra.`;
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.GEMINI_API_KEY}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            return `👁️ O OLHO REVELA: \n${data.candidates[0].content.parts[0].text}`;
        } catch (e) { return null; }
    }

    async gerarLore(evento, detalhes) {
        if (!this.GEMINI_API_KEY) return `👁️ O Oráculo: As correntes astrais moveram-se. ${detalhes}`;
        try {
            const lua = AstrolabioLunar.obterFaseAtual();
            const prompt = `Atue como a Entidade Ancestral do Abismo. Fase da Lua: ${lua.nome}. Clima: ${this.climaAstral}. Ocorreu: ${detalhes}. Escreva 1 frase poética e aterradora sobre isto, usando goetia e alquimia.`;
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.GEMINI_API_KEY}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            return `👁️ A Voz do Abismo: ${data.candidates[0].content.parts[0].text}`;
        } catch (e) { return `👁️ O Oráculo dita: O Sangue encontrou o seu curso.`; }
    }

    async lerAuraMortal(identificador, plataforma) {
        if (!this.GEMINI_API_KEY) return { fama: false, aura: "Aura mundana e densa. Alma comum, impregnada de futilidade e medo." };
        try {
            const prompt = `Atue como Hécate. Leia a aura de "${identificador}" na rede ${plataforma}. 
            Responda APENAS em JSON estrito: {"fama": true/false, "aura": "texto"}.
            Se for pessoa real famosa, fama: true. Escreva a "aura" revelando os pecados ou conquistas dela como se fossem saborosos para nós. Se anônimo, fama: false e descreva aura comum e fútil.`;
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.GEMINI_API_KEY}`, {
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
// RITUAL MAIOR: O NÚCLEO DA ORDEM (ShadowCore)
// ==========================================
class ShadowCore {
    constructor() {
        this.dbPath = path.join(__dirname, 'banco_de_almas.json');
        
        this.vampiros = {}; 
        this.rebanho = {}; 
        this.clans = {}; 
        this.leilaoP2P = [];
        this.leilaoIdCounter = 1;
        this.logs = { global: [], caca: [], guerra: [] };
        
        this.oraculo = new OraculoAbissal();
        this._invocarRegistosAkashicos(); // Carrega Base de Dados
        
        // GRIMÓRIO DE ALTA MAGIA
        this.grimorio = {
            'solve_coagula': {
                nome: "Solve et Coagula", lore: 'Dissolve a Vontade (Estamina) do inimigo.',
                custoAcao: 2, custoSangue: 150, reqLevel: 1, tipo: 'pvp',
                efeito: (atacante, alvo, lua) => { 
                    let dreno = lua.id === 'minguante' ? 8 : 4; 
                    alvo.pontosAcao = Math.max(0, alvo.pontosAcao - dreno); 
                    return `A vitalidade de ${alvo.nome} desfez-se (-${dreno} Fúria).`; 
                }
            },
            'sanguis_aeternum': {
                nome: "Selo de Aemeth", lore: 'Escudo Divino Invertido.',
                custoAcao: 1, custoSangue: 300, reqLevel: 2, tipo: 'buff',
                efeito: (atacante, alvo, lua) => { atacante.escudo = true; return `A Tua Aura endureceu. Escudo Activo.`; }
            },
            'maledictio_sanguinis': {
                nome: "O Olho Mau", lore: 'Corrompe sangue no Cálice inimigo.',
                custoAcao: 3, custoSangue: 1000, reqLevel: 5, tipo: 'pvp',
                efeito: (atacante, alvo, lua) => {
                    let per = lua.id === 'minguante' ? 0.2 : 0.1;
                    const dreno = Math.floor(alvo.calice * per); alvo.calice -= dreno;
                    return `O teu mau-olhado converteu ${dreno} Gts de ${alvo.nome} em pus e cinzas.`;
                }
            },
            'rito_da_besta': {
                nome: "Rito de Gamaliel", lore: 'Restaura Fúria usando Sangue.',
                custoAcao: 0, custoSangue: 800, reqLevel: 3, tipo: 'buff',
                efeito: (atacante, alvo, lua) => { 
                    let cura = lua.id === 'minguante' ? 6 : 3;
                    atacante.pontosAcao = Math.min(atacante.maxAcao, atacante.pontosAcao + cura); 
                    return `O sangue ferveu. +${cura} Pontos de Fúria.`; 
                }
            },
            'sussurro_bael': {
                nome: "Sussurro de Bael", lore: 'Magia mental. Rouba Influência do Alvo.',
                custoAcao: 4, custoSangue: 1500, reqLevel: 6, tipo: 'pvp',
                efeito: (atacante, alvo, lua) => {
                    let cap = lua.id === 'minguante' ? 10 : 5;
                    let dreno = Math.min(cap, alvo.influencia); alvo.influencia -= dreno; atacante.influencia += dreno;
                    return `Distorceste a mente da Corte. Roubaste ${dreno} Influência a ${alvo.nome}.`;
                }
            }
        };

        this.alquimia = {
            'elixir_estamina': { nome: 'Filtro do Frenesi', custo: { anima: 2, vitae: 1, gts: 300 }, efeito: 'Restaura 5 Fúria.' },
            'amuleto_sombra': { nome: 'Talismã Protetor', custo: { cinzas: 3, anima: 1, gts: 500 }, efeito: 'Garante Escudo Arcano.' },
            'lagrima_prata': { nome: 'Lágrima de Prata', custo: { vitae: 3, cinzas: 2, gts: 1000 }, efeito: 'Restaura 1 Fúria Imediata.' },
            'pedra_filosofal_negra': { nome: 'Pedra Negra Filosofal', custo: { anima: 5, vitae: 5, cinzas: 5, gts: 5000 }, efeito: '+1 Ponto de Atributo Livre.' }
        };

        this.conquistas = {
            'neofito': { id: 'neofito', titulo: 'Neófito Sedento', requisito: v => v.estatisticas.totalDrenado >= 100 },
            'assassino': { id: 'assassino', titulo: 'Ceifador de Almas', requisito: v => v.estatisticas.mortaisSecos >= 5 },
            'mestre_guerras': { id: 'mestre_guerras', titulo: 'Lâmina do Abismo', requisito: v => v.estatisticas.vitoriasPvP >= 10 },
            'anciao': { id: 'anciao', titulo: 'Ancião Sombrio', requisito: v => v.nivel >= 10 },
            'arquimago': { id: 'arquimago', titulo: 'Hierofante Oculto', requisito: v => v.atributos.gnose >= 15 }
        };
    }

    _invocarRegistosAkashicos() {
        try {
            if (fs.existsSync(this.dbPath)) {
                const data = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
                this.vampiros = data.vampiros || {}; this.rebanho = data.rebanho || {};
                this.clans = data.clans || {}; this.leilaoP2P = data.leilaoP2P || [];
                this.leilaoIdCounter = data.leilaoIdCounter || 1;
                this.logs = data.logs || { global: [], caca: [], guerra: [] };
                console.log("🦇 O Rito de Memória foi concluído. Almas resgatadas do Vazio.");
            }
        } catch(e) { console.error("Falha ao invocar os Registos.", e); }
    }

    _selarRegistosAkashicos() {
        try {
            const data = {
                vampiros: this.vampiros, rebanho: this.rebanho, clans: this.clans,
                leilaoP2P: this.leilaoP2P, leilaoIdCounter: this.leilaoIdCounter, logs: this.logs
            };
            fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf8');
        } catch(e) { console.error("Falha no Selo de Memória.", e); }
    }

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
        const torresEnochianas = "EXARP_HCOMA_NANTA_BITOM"; // A Magia Enochiana
        return crypto.createHash('sha3-512').update(`${plataforma.toUpperCase()}::${dna}::${idLimpo}::${torresEnochianas}`).digest('hex').substring(0, 40);
    }

    _conjurarGotaDeSangue(hashAlma, vampiroSigilo, quantiaBase, localMordida) {
        const gotaHash = crypto.createHash('sha512').update(hashAlma + vampiroSigilo + "Gamaliel_Lilith" + Date.now()).digest('hex');
        const ressonancia = parseInt(gotaHash.substring(0, 2), 16); 
        let mult = 1; let risco = 0;
        
        if (localMordida === 'pescoco') { mult = 1.5; risco = 25; } 
        else if (localMordida === 'arteria') { mult = 2.0; risco = 45; } 
        else if (localMordida === 'extorquir') { mult = 0.5; risco = 10; } // Nova opção de Extorsão

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
    // O PACTO DE SANGUE (LOGIN)
    // ==========================================
    despertarViaTelegram(tgId, tgUsername, nomeSombrio, senha, inviteCode) {
        const idSombrio = 'SNG_' + crypto.createHash('sha256').update(tgId.toString()).digest('hex').substring(0, 8).toUpperCase();
        
        // Autenticação Rigorosa
        if(this.vampiros[idSombrio]) {
            const v = this.vampiros[idSombrio];
            const hashTentativa = crypto.pbkdf2Sync(senha, v.id, 10000, 64, 'sha512').toString('hex');
            if (v.senhaHash !== hashTentativa) return { existente: true, recusado: true, erro: "Senha falsa. O Abismo repudia a tua mentira." };
            return { existente: true, recusado: false, vampiro: v };
        }

        // BLOQUEIO TOTAL: CHAVE MESTRA OU CONVITE
        const CHAVE_MESTRA_PRIMORDIAL = 'SANGUIS_DRACONIS_666';
        let senhor = this.vampiros[inviteCode];
        
        if (!senhor && inviteCode !== CHAVE_MESTRA_PRIMORDIAL) {
            return { existente: false, recusado: true, erro: "A Ordem Exige Um Convite na URL (?invite=CHAVE). O Portão não se move para ti." };
        }

        const geracao = senhor ? senhor.geracao + 1 : 1;
        const senhaHashGerada = crypto.pbkdf2Sync(senha, idSombrio, 10000, 64, 'sha512').toString('hex');

        this.vampiros[idSombrio] = {
            id: idSombrio, tgId, tgUsername: tgUsername ? `@${tgUsername}` : 'Mortal_Sem_Rosto', 
            nome: nomeSombrio, senhaHash: senhaHashGerada,
            sangue: 500, calice: 0, geracao, clan: senhor ? senhor.clan : 'Sangue Ralo', 
            estado: 'Ativo', senhor: senhor ? senhor.id : 'O_PRIMEIRO', linhagem: [],
            pontosAcao: 10, maxAcao: 10, escudo: false, nivel: 1, xp: 0, xpProx: 100, 
            
            influencia: 0, titulos: ['Sangue Frio'], tituloAtual: 'Sangue Frio', conquistas: [],
            atributos: { vontade: 5, gnose: 5, magnetismo: 5, densidade: 5, pontosLivres: 0 },
            equipamentos: { arma: null, armadura: null, amuleto: null }, bolsa: [], 
            inventario: { anima: 0, cinzas: 0, vitae: 0 }, historicoCombate: [], poderesDesbloqueados: ['solve_coagula'],
            estatisticas: { totalDrenado: 0, mortaisSecos: 0, vitoriasPvP: 0 }
        };

        if (senhor) {
            senhor.linhagem.push(idSombrio); senhor.sangue += 500; senhor.influencia += 5;
            this.ganharXP(senhor.id, 50); 
            if (senhor.clan !== 'Sangue Ralo' && this.clans[senhor.clan]) this.clans[senhor.clan].membros.push(idSombrio);
            this._registrarEvento('global', 'O ABRAÇO', `A alma de ${nomeSombrio} transmutou-se pelas mãos de ${senhor.nome}.`);
        } else {
            this._registrarEvento('global', 'O PRIMEVO', `A Geração 1, ${nomeSombrio}, entrou no nosso plano através da Chave Sagrada.`);
        }
        
        this._selarRegistosAkashicos();
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
        this._selarRegistosAkashicos(); return { sucesso: true, relato: `Esfera de ${atributo.toUpperCase()} ampliada.` };
    }

    mudarTitulo(vampiroId, novoTitulo) {
        const v = this.vampiros[vampiroId];
        if (!v || !v.titulos.includes(novoTitulo)) return { erro: "A Ordem não te reconhece assim." };
        v.tituloAtual = novoTitulo; this._selarRegistosAkashicos(); return { sucesso: true, relato: `És agora ${novoTitulo}.` };
    }

    equiparReliquia(vampiroId, reliquiaId) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        const itemIdx = v.bolsa.findIndex(i => i.id === reliquiaId);
        if (itemIdx === -1) return { erro: "Relíquia não te pertence." };
        const item = v.bolsa[itemIdx]; const atual = v.equipamentos[item.tipo];
        v.equipamentos[item.tipo] = item; v.bolsa.splice(itemIdx, 1);
        if (atual) v.bolsa.push(atual);
        this._selarRegistosAkashicos(); return { sucesso: true, relato: `Aglomeraste o poder de [${item.nome}].` };
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
        let novas = this._verificarConquistas(v);
        this._selarRegistosAkashicos();
    }

    // ==========================================
    // SANTUÁRIOS (CLÃS)
    // ==========================================
    fundarClan(vampiroId, nomeClan) {
        const v = this.vampiros[vampiroId];
        if (!v || v.sangue < 2000) return { erro: "O Abismo exige 2000 Gts de Oferenda." };
        if (v.clan !== 'Sangue Ralo') return { erro: "Já tens Aliança." };
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
        this._selarRegistosAkashicos(); return { sucesso: true, relato: `Santuário ${nomeClan} fundado.` };
    }

    operarCofreClan(vampiroId, quantia, operacao) {
        const v = this.vampiros[vampiroId];
        if (!v || v.clan === 'Sangue Ralo') return { erro: "És um Sangue Ralo." };
        const clan = this.clans[v.clan]; if (!clan) return { erro: "Clã desvanecido." };

        if (operacao === 'depositar') {
            if (v.sangue < quantia) return { erro: "Falta Sangue." };
            v.sangue -= quantia; clan.cofre += quantia;
            this._selarRegistosAkashicos(); return { sucesso: true, relato: `Oferendaste ${quantia} Gts ao Clã.` };
        } else {
            if (clan.lider !== v.id) return { erro: "Apenas o Hierofante pode exaurir o Cofre Central." };
            if (clan.cofre < quantia) return { erro: "Cofre seco." };
            clan.cofre -= quantia; v.sangue += quantia;
            this._selarRegistosAkashicos(); return { sucesso: true, relato: `Extraíste ${quantia} Gts do Clã.` };
        }
    }

    // ==========================================
    // A CAÇADA AVANÇADA (AÇÕES MÚLTIPLAS)
    // ==========================================
    async mapearMortal(vampiroId, plataforma, identificador) {
        const v = this.vampiros[vampiroId];
        if (v.pontosAcao < 1) return { erro: "O Olho requer Fúria. Descansa." };

        let idLimpo = identificador.trim().toLowerCase();
        if (plataforma === 'telegram' && !idLimpo.startsWith('@') && isNaN(idLimpo)) return { erro: "Telegram exige '@' ou Numérico." };
        if (plataforma === 'whatsapp' && idLimpo.replace(/[^0-9]/g, '').length < 8) return { erro: "Número Inválido." };
        if (idLimpo.length < 3) return { erro: "Sílaba fraca demais." };

        const hashAlma = this._forjarSigilo(plataforma, idLimpo);
        v.pontosAcao -= 1; this.ganharXP(vampiroId, 5); 

        if (this.rebanho[hashAlma]) return { sucesso: true, mortal: this.rebanho[hashAlma] };

        let hpBase = 500 + (v.nivel * 20); 
        if (plataforma === 'whatsapp') hpBase *= 1.5;

        this.rebanho[hashAlma] = {
            hash: hashAlma, identificadorVisivel: identificador.trim(),
            plataforma, qualidade: "Sangue Mundano", sangueMax: hpBase, sangueAtual: hpBase, estado: 'Vibrante',
            maldicaoArcana: null, registroMordidas: [], leituraAura: "Lendo as teias do destino..."
        };
        
        this._registrarEvento('caca', 'A TEIA CRESCE', `${identificador.trim()} foi atado ao Matadouro por ${v.nome}.`);
        this._selarRegistosAkashicos();

        this.oraculo.lerAuraMortal(identificador, plataforma).then(dadosIA => {
            if(this.rebanho[hashAlma]) {
                this.rebanho[hashAlma].leituraAura = dadosIA.aura;
                if (dadosIA.fama) {
                    this.rebanho[hashAlma].sangueMax *= 10; 
                    this.rebanho[hashAlma].sangueAtual *= 10;
                    this.rebanho[hashAlma].qualidade = "Sangue da Realeza (Alta Influência)";
                    this._registrarEvento('global', 'ALMA CELESTIAL', `O Radar detetou uma figura de extremo poder no ${plataforma}.`);
                }
                this._selarRegistosAkashicos();
                if (global.io) global.io.emit('aura_atualizada', hashAlma);
            }
        });

        return { sucesso: true, mortal: this.rebanho[hashAlma] };
    }

    comprometerMortal(vampiroId, hashMortal) {
        const vampiro = this.vampiros[vampiroId]; const mortal = this.rebanho[hashMortal];
        if (!vampiro || !mortal) return { erro: "Brumas." };
        if (vampiro.sangue < 800) return { erro: "O Domínio exige 800 Gts." };
        if (mortal.estado === 'No Leilao') return { erro: "A alma jaz trancada." };
        if (mortal.maldicaoArcana) return { erro: "A Alma já está subjugada." };

        vampiro.sangue -= 800;
        mortal.maldicaoArcana = { selo: crypto.randomBytes(8).toString('hex'), donoId: vampiro.id, donoNome: vampiro.nome };
        this._registrarEvento('caca', 'CORRUPÇÃO ASTRAL', `O corpo de ${mortal.identificadorVisivel} pertence a ${vampiro.nome}.`);
        this._selarRegistosAkashicos(); return { sucesso: true, relato: "Selo cravado. O gado é teu." };
    }

    drenarMortal(vampiroId, hashMortal, localMordida) {
        const vampiro = this.vampiros[vampiroId]; const mortal = this.rebanho[hashMortal];
        const lua = AstrolabioLunar.obterFaseAtual();
        
        if (!vampiro || !mortal || mortal.estado !== 'Vibrante') return { erro: "Presa inacessível." };
        if (vampiro.pontosAcao < 1) return { erro: "Falta-te Fúria." };

        if (mortal.maldicaoArcana && mortal.maldicaoArcana.donoId !== vampiroId) {
            vampiro.sangue = Math.max(0, vampiro.sangue - 300); vampiro.pontosAcao -= 1;
            let rel = { erro: `CHOQUE MAGICKO! O Selo de ${mortal.maldicaoArcana.donoNome} queimou as tuas veias (-300 Gts).`, mortal };
            rel.alertaDono = `O vampiro ${vampiro.nome} tentou beber do teu rebanho [${mortal.identificadorVisivel}] e foi queimado pelo teu Selo.`;
            rel.donoId = mortal.maldicaoArcana.donoId;
            this._selarRegistosAkashicos(); return rel;
        }

        vampiro.pontosAcao -= 1;
        const atr = this._obterAtributosTotais(vampiro);
        
        // Ação Especial: Extorquir Influência em vez de Sangue
        if (localMordida === 'extorquir') {
            if (mortal.qualidade !== "Sangue da Realeza (Alta Influência)") return { erro: "Este humano não possui Riqueza ou Fama para Extorquir.", mortal };
            let ganho = Math.floor(Math.random() * 5) + 1;
            vampiro.influencia += ganho;
            mortal.registroMordidas.unshift({ predador: vampiro.nome, local: "HIPNOSE E EXTORSÃO", dano: 0, data: Date.now() });
            this.ganharXP(vampiroId, 30); this._selarRegistosAkashicos();
            return { roubo: 0, relato: `Hipnotizaste o VIP. Recebeste favores e riquezas (+${ganho} Influência). O Sangue ficou intacto.`, mortal, lootMsg: "" };
        }

        // Ação Especial: Rito Frio (Guarda direto no Cálice com pouco dano à vítima)
        if (localMordida === 'rito_frio') {
            vampiro.calice += 50; mortal.sangueAtual -= 20;
            mortal.registroMordidas.unshift({ predador: vampiro.nome, local: "SANGUESSUGA LENTA", dano: 20, data: Date.now() });
            this._selarRegistosAkashicos();
            return { roubo: 0, relato: `A extração foi cirúrgica e lenta. A vítima quase não notou (-20 HP). Ganhaste 50 Gts direto no teu Cálice Protegido.`, mortal, lootMsg: "" };
        }

        const bonusMag = Math.floor(atr.magnetismo * 10); 
        let mordidaBase = Math.floor(Math.random() * 80) + 40 + bonusMag;
        
        if (lua.id === 'cheia') mordidaBase = Math.floor(mordidaBase * 1.3);

        let rouboPossivel = Math.min(mordidaBase, mortal.sangueAtual);
        const conjuracao = this._conjurarGotaDeSangue(hashMortal, vampiro.id, rouboPossivel, localMordida);
        
        if (lua.id === 'nova') conjuracao.falha = false;

        if (conjuracao.falha) {
            vampiro.sangue = Math.max(0, vampiro.sangue - 50); this._selarRegistosAkashicos();
            return { erro: `A aura do humano repeliu-te (-50 Gts).`, mortal };
        }

        let rouboFinal = conjuracao.volume;
        mortal.sangueAtual -= rouboFinal; vampiro.sangue += rouboFinal; vampiro.estatisticas.totalDrenado += rouboFinal;
        this.ganharXP(vampiroId, 25); 

        let lootMsg = "";
        if (Math.random() > 0.6) { vampiro.inventario.vitae += 1; lootMsg += " [+1 Vitae]"; }
        if (Math.random() > 0.96) {
            const drop = ForjaDraconiana.gerarReliquia(vampiro.nivel);
            vampiro.bolsa.push(drop); lootMsg += `\n[ARTEFATO: ${drop.nome}]`;
        }

        mortal.registroMordidas.unshift({ predador: vampiro.nome, local: localMordida.toUpperCase(), dano: rouboFinal, data: Date.now() });

        let relato = `A Artéria foi aberta. +${rouboFinal} Gts.${lootMsg}`;
        this._registrarEvento('caca', 'DRENO BEM SUCEDIDO', `${vampiro.nome} bebeu furtivamente de ${mortal.identificadorVisivel}.`, false);

        if (mortal.sangueAtual <= 0) {
            mortal.estado = 'Limbo'; vampiro.inventario.cinzas += 1; vampiro.estatisticas.mortaisSecos += 1; vampiro.influencia += 1;
            relato += " RUPTURA FATAL. (+1 Cinzas | +1 Influência)";
            this._registrarEvento('global', 'O LIMBO', `Fiação Cortada. O mortal ${mortal.identificadorVisivel} secou completamente por ${vampiro.nome}.`);
        }
        
        this._selarRegistosAkashicos();
        return { roubo: rouboFinal, relato, mortal, lootMsg };
    }

    // ==========================================
    // GUERRA (PvP Tático)
    // ==========================================
    atacarVampiro(atacanteId, defensorId, posturaAtaque) {
        const atacante = this.vampiros[atacanteId]; const defensor = this.vampiros[defensorId];
        const lua = AstrolabioLunar.obterFaseAtual();
        
        if (!atacante || !defensor) return { erro: "Alvo evadido." };
        if (atacante.pontosAcao < 3) return { erro: "A Guerra exige 3 Fúrias." };
        if (defensor.estado === 'Banido') return { erro: "Lutar contra pó não traz glória." };

        let dmAlerta = `A TUA AURA FOI ATACADA!\n${atacante.nome} tentou emboscar-te. O combate:\n`;

        if (defensor.escudo) {
            atacante.pontosAcao -= 3; defensor.escudo = false; this._selarRegistosAkashicos();
            return { sucesso: false, relato: `O Pentáculo protegeu ${defensor.nome}! Escudo quebrou.`, alertaDono: dmAlerta + "O teu Escudo Arcano salvou-te, mas foi destruído.", donoId: defensor.id };
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
            resultadoDM = `As tuas defesas falharam. Perdeste ${danoFinal} Gts para o atacante.`;
            atacante.estatisticas.vitoriasPvP += 1; 
            if(defensor.influencia > 0 && Math.random() > 0.5) { defensor.influencia -= 1; atacante.influencia += 1; relato += " Roubaste Prestígio!"; }
            this.ganharXP(atacanteId, 50);
            
            if (Math.random() > 0.85) {
                const drop = ForjaDraconiana.gerarReliquia(defensor.nivel);
                atacante.bolsa.push(drop); relato += ` Despojaste uma Relíquia: [${drop.nome}].`;
            }
        } else {
            const danoCounter = Math.abs(danoLiquido) * 2 + 50;
            atacante.sangue -= danoCounter; defensor.sangue += danoCounter;
            relato += `Falha crítica! As defesas de ${defensor.nome} reflectiram. Perdeste ${danoCounter} Gts.`;
            resultadoDM = `Tu resististe à investida e contra-atacaste. Ganhaste ${danoCounter} Gts!`;
            defensor.estatisticas.vitoriasPvP += 1; this.ganharXP(defensorId, 40);
        }

        atacante.historicoCombate.unshift(`Atacaste ${defensor.nome}: ${relato}`);
        defensor.historicoCombate.unshift(`Sofreste investida de ${atacante.nome}: ${relato}`);
        this._registrarEvento('guerra', 'DUELO DE SANGUE', `${atacante.nome} colidiu com ${defensor.nome}.`);
        
        this._selarRegistosAkashicos();
        return { sucesso: true, relato, alertaDono: dmAlerta + resultadoDM, donoId: defensor.id };
    }

    // Leilao, Alquimia e Magia - Funcionais
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
        this.leilaoP2P.push(anuncio); this._selarRegistosAkashicos(); return { sucesso: true, relato: "Contrato assinado." };
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
        this.leilaoP2P.splice(idx, 1); this._selarRegistosAkashicos(); return { sucesso: true, relato: "Transação efetuada." };
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
        this.ganharXP(vampiroId, 30); this._selarRegistosAkashicos(); return { sucesso: true, relato: `A Forja brilhou. ${rec.nome} sintetizado.` };
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
        this._selarRegistosAkashicos();
        return { sucesso: true, relato: resultado };
    }

    // Cálice e Entropia (Com Timer Oculto da IA)
    operarCalice(id, quantia, operacao) {
        const v = this.vampiros[id]; if (!v) return { erro: "Vazio." };
        if (operacao === 'depositar') {
            if (v.sangue < quantia) return { erro: "Sangue Escasso." };
            v.sangue -= quantia; v.calice += quantia; this._selarRegistosAkashicos(); return { sucesso: true, relato: `Selo trancado. ${quantia} Gts no Cofre.` };
        } else {
            if (v.calice < quantia) return { erro: "O Cálice tem o fundo seco." };
            v.calice -= quantia; v.sangue += quantia; this._selarRegistosAkashicos(); return { sucesso: true, relato: `A tampa remove-se. O fluxo regressou (${quantia} Gts).` };
        }
    }

    async tickTemporal() {
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
        
        // Auto Save Periódico
        this._selarRegistosAkashicos();

        // O OLHO QUE TUDO VÊ (Ação Espontânea da IA)
        // A cada ~30 minutos de ticks (simulado aqui de forma aleatória e rara para não estourar API livre)
        if (Math.random() > 0.98) {
            const visao = await this.oraculo.invocarOolhoQueTudoVe();
            if (visao && global.io) {
                global.io.emit('nova_mensagem', { canal: 'global', autor: '👁️ O OLHO', texto: visao, hora: new Date().toLocaleTimeString() });
            }
        }
    }
}
module.exports = { ShadowCore, AstrolabioLunar };