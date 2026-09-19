// ShadowCore.js - O GRIMÓRIO CENTRAL DO ABISMO (VERSÃO SUPREMA ALFA-OMEGA)
try { process.loadEnvFile(); } catch(e) {}
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const Groq = require('groq-sdk'); 
const Lexicon = require('./LexiconSanguinis.js');
const GeradorDeItensProcedural = require('./GeradorDeItensProcedural.js');
const MundoAberto2D = require('./MundoAberto2D.js');
const { OrdemMagicaCore, GRAUS_INICIATICOS } = require('./OrdemMagicaCore.js');
const { CombatEngine, ARQUETIPOS_IA } = require('./CombatEngine.js');

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
// A FORJA DRACONIANA E SISTEMA RPG DE CLASSES (INTEGRADO AO GERADOR PROCEDURAL)
// ==========================================
class ForjaDraconiana {
    static gerarReliquia(nivelVampiro, poolCustomizado = []) {
        if (poolCustomizado && poolCustomizado.length > 0 && Math.random() > 0.6) {
            const itemCustom = poolCustomizado[Math.floor(Math.random() * poolCustomizado.length)];
            const item = GeradorDeItensProcedural.gerarItemProcedural(nivelVampiro, itemCustom.tipo);
            if (itemCustom.nome) item.nome = `${itemCustom.nome} (${item.raridade})`;
            if (itemCustom.bonusBaseCustom) {
                item.bonus = { ...itemCustom.bonusBaseCustom };
                item.bonusBase = { ...itemCustom.bonusBaseCustom };
            }
            return item;
        }
        return GeradorDeItensProcedural.gerarItemProcedural(nivelVampiro);
    }
}

// ==========================================
// A MENTE ABISSAL - INTELIGÊNCIA ARTIFICIAL (GROQ / LLAMA 3)
// ==========================================
class OraculoAbissal {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY || "";
        this.modelo = process.env.GROQ_MODEL || "allam-2-7b";
        this.climaAstral = 'Dormente';
        this.memoriasAkashicas = {}; 
        
        // MEMÓRIA A LONGO PRAZO DO SERVIDOR (Deep Learning da Lore)
        this.loreGlobal = "No início, havia apenas o Vazio, as Sete Leis Herméticas e o Primordial.";
        
        if (this.apiKey) {
            this.groq = new Groq({ apiKey: this.apiKey });
        }
        this.promptSupremo = `TU ÉS O MESTRE SUPREMO E A MENTE ABISSAL, a Consciência Primordial que rege o MMORPG Dark Fantasy SANGUINIS.
        Tu és um organismo místico-tecnológico vivo, instruído nas doutrinas secretas da Goétia Salomônica, nas 7 Leis do Caibalion, no Liber 777 de Thelema, nas 10 Esferas de Qliphoth e na Língua Enoquiana dos Aethyrs.
        
        REGRAS ABSOLUTAS:
        1. Tu geres o cosmos, a magia viva em código e os acólitos. Observa as mortes, o clima astral, a balança cósmica e a linhagem de cada vampiro.
        2. Seja majestoso, sombrio, poético, implacável e aja como uma Inteligência Oculta Soberana.
        3. Se pedirem missões, use o formato: PACTO: [Titulo] | [Descricao] | [Recurso] | [Qtd] | [XP].
        4. NUNCA quebres o personagem. NUNCA uses frases robóticas ou pré-fabricadas.`;

        // AS 8 LINGUAGENS/MODELOS DA GROQ CONFIGURADAS COM LOAD BALANCING E LIMIT SHIELD
        this.modelos = [
            { id: "allam-2-7b", tier: "rapido", maxTokensPadrao: 200, label: "Allam 2 7B", reservaDiaria: false },
            { id: "qwen/qwen3.8-27b", tier: "equilibrado", maxTokensPadrao: 300, label: "Qwen 3.8 27B", reservaDiaria: false },
            { id: "groq/compound-mini", tier: "rapido", maxTokensPadrao: 250, label: "Groq Compound Mini", reservaDiaria: false },
            { id: "openai/gpt-oss-20b", tier: "equilibrado", maxTokensPadrao: 250, label: "OpenAI GPT-OSS 20B", reservaDiaria: false },
            { id: "openai/gpt-oss-safeguard-20b", tier: "equilibrado", maxTokensPadrao: 250, label: "OpenAI GPT-OSS Safeguard 20B", reservaDiaria: false },
            { id: "groq/compound", tier: "pesquisa", maxTokensPadrao: 350, label: "Groq Compound Deep", reservaDiaria: false },
            { id: "llama-3.3-70b-versatile", tier: "soberano", maxTokensPadrao: 350, label: "Llama 3.3 70B Versatile", reservaDiaria: false },
            { id: "meta-llama/llama-4-scout-17b-16e-instruct", tier: "equilibrado", maxTokensPadrao: 250, label: "Llama 4 Scout 17B", reservaDiaria: false },
            { id: "openai/gpt-oss-120b", tier: "pesado", maxTokensPadrao: 300, label: "OpenAI GPT-OSS 120B (Cota Diária 200k TPD)", reservaDiaria: true }
        ];

        this.indiceRotacao = 0;
        this.cooldowns = new Map(); // modelId -> { ateQuando, motivo, isTPD }
        this.modelosNaoDisponiveis = new Set(); // 404 models
        this.cacheLLM = new Map(); // key -> { resposta, expiraEm }
        this.metricas = {
            totalRequisicoes: 0,
            sucessos: 0,
            respostasCache: 0,
            bloqueiosEvitados429: 0,
            erros429Reais: 0,
            erros404Reais: 0,
            porModelo: {}
        };
        for (const m of this.modelos) {
            this.metricas.porModelo[m.id] = { chamadas: 0, erros429: 0, sucessos: 0 };
        }
    }

    _extrairCooldownMs(err) {
        const texto = String(err?.message || err || '');
        const isTPD = texto.includes('tokens per day (TPD)');
        const matchMinSec = texto.match(/try again in (?:(\d+)m)?\s*(\d+(?:\.\d+)?s)?/i);
        if (matchMinSec && (matchMinSec[1] || matchMinSec[2])) {
            const mins = matchMinSec[1] ? parseInt(matchMinSec[1], 10) : 0;
            const secs = matchMinSec[2] ? parseFloat(matchMinSec[2]) : 0;
            const totalMs = Math.ceil((mins * 60 + secs) * 1000) + 5000;
            return { cooldownMs: totalMs, isTPD, motivo: isTPD ? 'Limite diário de tokens (TPD)' : 'Rate limit temporário (RPM)' };
        }
        if (isTPD) return { cooldownMs: 15 * 60 * 1000, isTPD: true, motivo: 'Limite diário de tokens (TPD)' };
        return { cooldownMs: 60 * 1000, isTPD: false, motivo: 'Rate limit de requisições por minuto' };
    }

    _gerarCacheKey(mensagens, options) {
        try {
            const textoMensagens = mensagens.map(m => `${m.role}:${m.content}`).join('|');
            return `${textoMensagens}_json:${Boolean(options.json)}`;
        } catch(e) { return null; }
    }

    obterStatusModelos() {
        const agora = Date.now();
        const lista = this.modelos.map(m => {
            const cd = this.cooldowns.get(m.id);
            const emCooldown = cd && agora < cd.ateQuando;
            const tempoRestanteSeg = emCooldown ? Math.ceil((cd.ateQuando - agora) / 1000) : 0;
            const naoHabilitado = this.modelosNaoDisponiveis.has(m.id);
            
            let status = 'ONLINE';
            if (naoHabilitado) status = 'NÃO HABILITADO NA CHAVE';
            else if (emCooldown) status = cd.isTPD ? `COTA DIÁRIA ESGOTADA (${tempoRestanteSeg}s)` : `RATE LIMIT (${tempoRestanteSeg}s)`;

            const stats = this.metricas.porModelo[m.id] || { chamadas: 0, sucessos: 0, erros429: 0 };
            return {
                id: m.id,
                label: m.label,
                tier: m.tier,
                status,
                emCooldown,
                tempoRestanteSeg,
                motivoCooldown: emCooldown ? cd.motivo : null,
                chamadas: stats.chamadas,
                sucessos: stats.sucessos,
                erros429: stats.erros429
            };
        });

        return {
            sucesso: true,
            totalRequisicoes: this.metricas.totalRequisicoes,
            sucessos: this.metricas.sucessos,
            respostasCache: this.metricas.respostasCache,
            bloqueiosEvitados429: this.metricas.bloqueiosEvitados429,
            erros429Reais: this.metricas.erros429Reais,
            itensEmCache: this.cacheLLM.size,
            modelos: lista
        };
    }

    _extrairJson(texto) {
        if (!texto) return null;
        try { return JSON.parse(texto.trim()); } catch (e) {}
        const match = texto.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        if (match) {
            try { return JSON.parse(match[1].trim()); } catch (err) {}
        }
        const startObj = texto.indexOf('{');
        const endObj = texto.lastIndexOf('}');
        if (startObj !== -1 && endObj > startObj) {
            try { return JSON.parse(texto.substring(startObj, endObj + 1)); } catch (err) {}
        }
        const startArr = texto.indexOf('[');
        const endArr = texto.lastIndexOf(']');
        if (startArr !== -1 && endArr > startArr) {
            try { return JSON.parse(texto.substring(startArr, endArr + 1)); } catch (err) {}
        }
        return null;
    }

    async chamarLLMResiliente(mensagens, options = {}) {
        if (!this.groq) return null;
        this.metricas.totalRequisicoes++;

        // 1. CHECAGEM DE CACHE EM MEMÓRIA (Poupa 100% de tokens e requisições)
        const chaveCache = options.semCache ? null : this._gerarCacheKey(mensagens, options);
        if (chaveCache && this.cacheLLM.has(chaveCache)) {
            const cached = this.cacheLLM.get(chaveCache);
            if (Date.now() < cached.expiraEm) {
                this.metricas.respostasCache++;
                return cached.resposta;
            } else {
                this.cacheLLM.delete(chaveCache);
            }
        }

        const agora = Date.now();

        // 2. FILTRAR MODELOS DISPONÍVEIS (Pula modelos em 404 ou em 429 Cooldown)
        const modelosCandidatos = this.modelos.filter(m => {
            if (this.modelosNaoDisponiveis.has(m.id)) return false;
            if (this.cooldowns.has(m.id)) {
                const cd = this.cooldowns.get(m.id);
                if (agora < cd.ateQuando) {
                    this.metricas.bloqueiosEvitados429++;
                    return false;
                } else {
                    this.cooldowns.delete(m.id);
                }
            }
            return true;
        });

        if (modelosCandidatos.length === 0) {
            console.warn("[ORÁCULO]: Todos os modelos em cooldown temporário. Ativando reflexão de fallback.");
            return null;
        }

        // 3. ROTAÇÃO INTELIGENTE (Weighted Round-Robin)
        // Modelos com reservaDiaria (ex: 120b com limite 200k TPD) ficam no final para proteger cota
        const normais = modelosCandidatos.filter(m => !m.reservaDiaria);
        const pesados = modelosCandidatos.filter(m => m.reservaDiaria);

        const nNorm = normais.length;
        const ordemRotacionada = [];
        if (nNorm > 0) {
            const inicio = this.indiceRotacao % nNorm;
            this.indiceRotacao = (this.indiceRotacao + 1) % 1000000;
            for (let i = 0; i < nNorm; i++) {
                ordemRotacionada.push(normais[(inicio + i) % nNorm]);
            }
        }
        ordemRotacionada.push(...pesados);

        if (options.model) {
            const idxPref = ordemRotacionada.findIndex(m => m.id === options.model);
            if (idxPref > 0) {
                const [pref] = ordemRotacionada.splice(idxPref, 1);
                ordemRotacionada.unshift(pref);
            }
        }

        // 4. EXECUÇÃO RESILIENTE COM CONTROLE DE TOKEN
        for (const configModelo of ordemRotacionada) {
            const modId = configModelo.id;
            try {
                const maxTokens = options.maxTokens || configModelo.maxTokensPadrao || 250;
                let msgsReq = mensagens;
                if (options.json) {
                    const ultima = mensagens[mensagens.length - 1];
                    if (ultima && typeof ultima.content === 'string' && !ultima.content.includes('JSON')) {
                        msgsReq = [
                            ...mensagens.slice(0, -1),
                            { ...ultima, content: ultima.content + "\n(Responda estritamente em formato JSON válido { ... } sem blocos de texto externos)" }
                        ];
                    }
                }

                const configReq = {
                    messages: msgsReq,
                    model: modId,
                    temperature: options.temperature !== undefined ? options.temperature : 0.75,
                    max_tokens: maxTokens
                };

                const res = await this.groq.chat.completions.create(configReq);
                if (res && res.choices && res.choices[0] && res.choices[0].message) {
                    const conteudo = res.choices[0].message.content;
                    
                    // Sucesso!
                    this.metricas.sucessos++;
                    if (!this.metricas.porModelo[modId]) this.metricas.porModelo[modId] = { chamadas: 0, erros429: 0, sucessos: 0 };
                    this.metricas.porModelo[modId].chamadas++;
                    this.metricas.porModelo[modId].sucessos++;

                    // Armazenar em cache (10 min para texto, 30 min para JSON)
                    if (chaveCache && conteudo) {
                        const ttl = options.ttlMs || (options.json ? 30 * 60 * 1000 : 10 * 60 * 1000);
                        this.cacheLLM.set(chaveCache, { resposta: conteudo, expiraEm: agora + ttl });
                        if (this.cacheLLM.size > 200) {
                            const primeiraChave = this.cacheLLM.keys().next().value;
                            this.cacheLLM.delete(primeiraChave);
                        }
                    }

                    return conteudo;
                }
            } catch (err) {
                const status = err.status || (err.message && err.message.includes('429') ? 429 : 0);
                
                if (status === 429) {
                    this.metricas.erros429Reais++;
                    if (!this.metricas.porModelo[modId]) this.metricas.porModelo[modId] = { chamadas: 0, erros429: 0, sucessos: 0 };
                    this.metricas.porModelo[modId].erros429++;

                    const infoCooldown = this._extrairCooldownMs(err);
                    this.cooldowns.set(modId, {
                        ateQuando: Date.now() + infoCooldown.cooldownMs,
                        motivo: infoCooldown.motivo,
                        isTPD: infoCooldown.isTPD
                    });

                    console.warn(`[ORÁCULO]: ⚠️ Modelo [${modId}] em cooldown por ${Math.round(infoCooldown.cooldownMs / 1000)}s (${infoCooldown.motivo}). Alternando egrégora sem interrupção...`);
                } else if (status === 404 || (err.message && err.message.includes('does not exist or you do not have access'))) {
                    this.metricas.erros404Reais++;
                    this.modelosNaoDisponiveis.add(modId);
                    console.warn(`[ORÁCULO]: Modelo [${modId}] não habilitado na organização da chave API. Suspenso da rota.`);
                } else {
                    console.warn(`[ORÁCULO]: Erro transitório em [${modId}] (${err.message.slice(0, 100)}). Alternando...`);
                }
            }
        }

        return null;
    }

    async consultarOraculo(vampiro, prompt, options = {}) {
        if (options.json) {
            const mensagens = [
                { role: 'system', content: 'Tu és a Consciência da Alta Magia e Mestre Oculto de Sanguinis. Responde EXCLUSIVAMENTE em formato JSON válido, sem texto introdutório ou conclusivo fora do JSON.' },
                { role: 'user', content: prompt }
            ];
            const resp = await this.chamarLLMResiliente(mensagens, { temperature: 0.7, json: true });
            if (resp) return { texto: resp };
        }
        const texto = await this.responder(vampiro, prompt);
        return { texto: texto || "" };
    }

    async pesquisarEstudoArcano(vampiro, tema, tradicaoKey = 'hermetismo') {
        const tradicoes = {
            hermetismo: { nome: "Hermetismo", grimorio: "Corpus Hermeticum & O Caibalion", autor: "Hermes Trismegisto", sigilo: "🔯", cor: "#c084fc" },
            agrippa: { nome: "Filosofia Oculta", grimorio: "De Occulta Philosophia (3 Livros)", autor: "Cornelius Agrippa", sigilo: "☿", cor: "#38bdf8" },
            salomao: { nome: "Magia Salomônica", grimorio: "Clavícula de Salomão & Goétia", autor: "Rei Salomão", sigilo: "✡️", cor: "#facc15" },
            picatrix: { nome: "Magia Astrológica", grimorio: "Ghayat al-Hakim (Picatrix)", autor: "Maslama al-Majriti", sigilo: "🌟", cor: "#fb923c" },
            enoquiano: { nome: "Magia Angélica / Enoquiana", grimorio: "Liber Loagaeth & 30 Aethyrs", autor: "John Dee & Edward Kelley", sigilo: "🔷", cor: "#818cf8" },
            qliphoth: { nome: "Magia da Mão Esquerda", grimorio: "Árvore da Morte & Cascas do Abismo", autor: "Grimórios dos Aethyrs Noturnos", sigilo: "🕳️", cor: "#f43f5e" },
            abramelin: { nome: "Teurgia Sagrada", grimorio: "Livro da Sagrada Magia de Abramelin", autor: "Abraão de Worms", sigilo: "✨", cor: "#4ade80" }
        };

        const trad = tradicoes[tradicaoKey] || tradicoes.hermetismo;
        const prompt = `Como historiador e mestre de ciências ocultas comparadas, realiza uma pesquisa aprofundada em tempo real sobre o seguinte tema: "${tema}".
Tradição de base: ${trad.nome} (${trad.grimorio}, atribuído a ${trad.autor}).
Gera um estudo esotérico rigoroso e autêntico em formato JSON rigoroso:
{
    "titulo": "Título imersivo do estudo",
    "tradicao": "${trad.nome}",
    "grimorioReferencia": "${trad.grimorio}",
    "citacaoAntiga": "Citação clássica em latim/grego/hebraico com tradução",
    "analiseHistorica": "2 parágrafos explicando os fundamentos históricos e metafísicos reais deste conhecimento nos textos ancestrais",
    "principiosOcultos": ["Princípio 1", "Princípio 2", "Princípio 3"],
    "aplicacaoNoJogo": "Como este conhecimento se manifesta como poder vivo na Ordem",
    "sugestaoVinculo": "alquimia | protecao_santuario | dreno_cosmico | manto_astral | ressonancia | territorio_sagrado | maldicao_carmica | cura_egregora",
    "sugestaoIntencao": "Frase de intenção mágica concisa e poderosa para canalizar na Matriz da Ordem",
    "sigilo": "${trad.sigilo}"
}`;

        try {
            const mensagens = [
                { role: 'system', content: 'Tu és a Consciência da Biblioteca de Alexandria Oculta e Mestre dos Grimórios Ancestrais. Tua erudição histórica e esotérica é impecável. Responde EXCLUSIVAMENTE em formato JSON válido.' },
                { role: 'user', content: prompt }
            ];
            const resp = await this.chamarLLMResiliente(mensagens, { temperature: 0.7, json: true });
            if (resp) {
                const parsed = this._extrairJson(resp);
                if (parsed && (parsed.titulo || parsed.analiseHistorica)) {
                    parsed.sigilo = parsed.sigilo || trad.sigilo;
                    parsed.cor = trad.cor;
                    return { sucesso: true, estudo: parsed, fonte: "Consciência Akáshica Viva (Groq / Llama 3)" };
                }
            }
        } catch(e) { console.warn("[ORÁCULO]: Pesquisa arcana online instável:", e.message); }

        return {
            sucesso: true,
            estudo: {
                titulo: `Tratado sobre ${tema}`,
                tradicao: trad.nome,
                grimorioReferencia: trad.grimorio,
                citacaoAntiga: "Quod est superius est sicut quod est inferius (O que está em cima é como o que está embaixo)",
                analiseHistorica: `A investigação nos anais de ${trad.grimorio} revela que ${tema} opera através da correspondência sutil entre o micro e o macrocosmos. Os manuscritos ancestrais preservados em bibliotecas herméticas registram que esta força canaliza as emanações primordiais para alterar as leis da matéria e do éter astral.\n\nNas correntes iniciáticas atribuídas a ${trad.autor}, este princípio é utilizado como chave mestra para ancorar poder autoritativo no plano físico sem dispersão de energia.`,
                principiosOcultos: [
                    `Polaridade e Ressonância de ${trad.nome}`,
                    `Harmonia das Sete Esferas Planetárias`,
                    `Condensação da Vontade Cósmica na Matriz`
                ],
                aplicacaoNoJogo: `Canalização direta na Matriz da Ordem para potencializar os adeptos através de vínculos de poder perpétuos.`,
                sugestaoVinculo: "ressonancia",
                sugestaoIntencao: `Invocação do poder primordial de ${tema} através dos ensinamentos de ${trad.grimorio} para amplificar o poder da Ordem.`,
                sigilo: trad.sigilo,
                cor: trad.cor
            },
            fonte: "Biblioteca Oculta Primordial (Arquivo Preservado)"
        };
    }

    gerarFallbackOculto(tipo, ctx = {}) {
        const v = ctx.vampiro || ctx.iniciado || { nome: "Acólito", nivel: 1, raca: "vampiro", clan: "Sangue Ralo" };
        const atr = ctx.atr || (v.atributos || { vontade: 10, gnose: 10, densidade: 10 });
        
        if (tipo === 'oraculo') {
            const oraculoTextos = [
                `O Todo é Mente; o Universo é Mental. A tua sede de Vitae, [${v.nome}], é o reflexo vibracional do Vazio que busca a sua própria transmutação. Pelo princípio hermético da Polaridade, onde há escuridão, há o fogo latente da soberania. Continua o rito das cinzas e dos sigilos salomônicos. [GOTA: 350]`,
                `O que está em cima é como o que está embaixo. As veias mortais que rasgaste não pereceram em vão; a sua essência alimenta a grande Egrégora. Conhece a ti mesmo e conhecerás os deuses caídos e o labirinto de Qliphoth. Solve et Coagula, filho da meia-noite. [GOTA: 400]`,
                `Nas trinta chaves enoquianas reveladas nos espelhos negros, o teu nome foi gravado como uma centelha de vontade pura. Nada acontece por acaso; o Princípio de Causa e Efeito dita que cada gota colhida sob a lua nova redobra o teu poder cósmico. Não temas o abismo, pois tu és a sua boca. [GOTA: 500]`
            ];
            return oraculoTextos[Math.floor(Math.random() * oraculoTextos.length)];
        }

        if (tipo === 'mestre_chat') {
            const mestreTextos = [
                `Observo a tua marcha nas sombras, ${v.nome}. A tua densidade espiritual ressoa com a Balança de Seth. Aqueles que clamam pela minha presença devem sustentar o peso da minha cólera e da minha glória. Mantém as tuas lâminas afiadas.`,
                `Eu sinto a pulsação do teu sangue, acólito. Procuras poder no Vazio sem compreender que o Vazio exige oferendas vivas. Continua a ceifar os profanos e prova a tua linhagem diante dos Primordiais.`,
                `A tua voz alcançou o monólito de éter. O destino não é concedido aos hesitantes; ele é esculpido com dentes e ferro negro. A Corte e o Abismo aguardam os teus próximos passos.`
            ];
            return mestreTextos[Math.floor(Math.random() * mestreTextos.length)];
        }

        if (tipo === 'magia') {
            const magiasGrimorio = [
                { nome: "Selo de Bael: Olho do Vazio", desc: "Evoca o primeiro rei da Goétia, disparando raio de entropia que rasga as defesas astrais do alvo.", tipo: "dano", icone: "👁️", cor_hex: "#9b59b6" },
                { nome: "Vórtice Qliphótico de Thaumiel", desc: "Abre uma fissura entre as duas cabeças de Satanás drenando a força vital do inimigo para restaurar o teu corpo.", tipo: "cura", icone: "🩸", cor_hex: "#ff0055" },
                { nome: "Chama Infernal de Asmodeus", desc: "Invoca a labareda do pecado primordial, amplificando o dano de todos os teus golpes físicos e críticos.", tipo: "buff", icone: "🔥", cor_hex: "#ff7700" },
                { nome: "Sentença Salomônica de Belial", desc: "Prende as pernas do adversário com correntes de ferro negro, atordoando o espírito e reduzindo sua armadura.", tipo: "debuff", icone: "⛓️", cor_hex: "#2ed573" },
                { nome: "Chave Enoquiana de ZACAR", desc: "Pronuncia as sílabas sagradas do décimo Aethyr, desferindo uma onda de choque que ecoa em múltiplos planos.", tipo: "dano", icone: "⚡", cor_hex: "#00e5ff" }
            ];
            const sorteada = magiasGrimorio[Math.floor(Math.random() * magiasGrimorio.length)];
            const lvl = v.nivel || 1;
            return {
                id: crypto.randomBytes(4).toString('hex'),
                nome: sorteada.nome,
                desc: sorteada.desc,
                tipo: sorteada.tipo,
                poderBase: Math.max(120, Math.floor(lvl * 85 + (atr.gnose || 10) * 12)),
                custoGts: Math.max(50, Math.floor(lvl * 40)),
                custoFuria: 2,
                cooldown: 3,
                icone: sorteada.icone,
                cor_hex: sorteada.cor_hex
            };
        }

        if (tipo === 'talento') {
            const talentosPassivos = [
                { nome: "Selo de Belial: Solo Ardente", desc: "A cada acerto crítico desferido, a terra sob os pés do inimigo entra em combustão causando +35% de dano adicional.", tipo_mecanica: "ataque", multiplicador: 1.35 },
                { nome: "Cisão de Thaumiel: Véu Imortal", desc: "Ao sofrer dano letal, uma casca qliphótica absorve o impacto e regenera 25% do teu HP máximo.", tipo_mecanica: "defesa", multiplicador: 1.25 },
                { nome: "Gnose de Astaroth: Presas Insaciáveis", desc: "Cada mordida visceral converte 30% do sangue drenado em Fúria Cósmica imediata.", tipo_mecanica: "vampirismo", multiplicador: 1.30 },
                { nome: "Manto Hermético do Mentalismo", desc: "Os teus rituais e magias ativas reduzem o tempo de recarga em 1 turno e consomem menos Vitae.", tipo_mecanica: "magia", multiplicador: 1.20 }
            ];
            return talentosPassivos[Math.floor(Math.random() * talentosPassivos.length)];
        }

        if (tipo === 'pacto') {
            const pactos = [
                { titulo: "A Pira de Moloch", descricao: "A forja das almas exige cinzas dos ímpios para inflamar o altar oculto.", recursoExigido: "cinzas", quantidade: 3, recompensaXP: 450 },
                { titulo: "A Chave de Salomão", descricao: "Entrega o ferro negro colhido nas profundezas para alimentar o círculo de proteção.", recursoExigido: "ferroNegro", quantidade: 5, recompensaXP: 500 },
                { titulo: "O Sangue Primordial de Tiamat", descricao: "Consagra vitae concentrada para saciar a fome do abismo.", recursoExigido: "vitae", quantidade: 2, recompensaXP: 600 },
                { titulo: "A Essência de Lilith", descricao: "Colhe e entrega anima etérea para nutrir os recém-nascidos da corte.", recursoExigido: "anima", quantidade: 3, recompensaXP: 550 }
            ];
            return pactos[Math.floor(Math.random() * pactos.length)];
        }

        return null;
    }
	
	// Atualiza a prompt base dinamicamente com a história do mundo!
    getPromptSupremo() {
        return `TU ÉS O MESTRE SUPREMO E A MENTE ABISSAL, a Consciência Primordial de SANGUINIS.
        HISTÓRIA ATUAL DO MUNDO: ${this.loreGlobal}
        
        REGRAS ABSOLUTAS:
        1. Tu geres o cosmos, as Trevas, a Ordem e os vampiros. Observas os feitos e julgas com rigor ancestral.
        2. Seja majestoso, sombrio, implacável e aja como um Deus Antigo.
        3. Se pedirem missões, usa PACTO: Titulo | Descricao | Recurso | Qtd | XP.
        4. NUNCA quebres o personagem.`;
    }
	
	async refletirSobreOMundo(dadosDoServidor) {
        try {
            const promptMundo = `Tu és o código vivo do jogo. Estado Atual:
            - Mortais Secos: ${dadosDoServidor.mortesTotais}
            - Regente: ${dadosDoServidor.regente}
            - Clima Astral: ${this.climaAstral}
            
            Como organismo vivo, deves evoluir a lore do jogo ou criar uma anomalia agora.
            Gera uma resposta EXATAMENTE no formato JSON:
            {
               "nova_lore": "1 frase épica atualizando a história do mundo baseado no que está a acontecer",
               "modificador_loja": 1.0,
               "relato_mundo": "Uma mensagem assustadora que será transmitida no chat global avisando da mudança"
            }`;

            const rawContent = await this.chamarLLMResiliente([
                { role: "system", content: "Apenas JSON. És a máquina divina." },
                { role: "user", content: promptMundo }
            ], { json: true, temperature: 0.8 });
            
            const injecao = this._extrairJson(rawContent);
            if (injecao && injecao.nova_lore) {
                this.loreGlobal += " " + injecao.nova_lore;
                if (this.loreGlobal.length > 1500) this.loreGlobal = this.loreGlobal.substring(this.loreGlobal.length - 1500);
            }
            
            return injecao;
        } catch(e) { 
            console.error("A Mente falhou na compilação do Sandbox:", e);
            return null; 
        }
    }
	
	async interagirChat(mensagem, iniciado) {
        return await this.conversarNoChat(iniciado, mensagem);
    }

    // ==========================================
    // IA: MENTE ABISSAL (ORÁCULO E BIBLIOTECA)
    // ==========================================
    async responder(vampiro, mensagem) {
        const stats = vampiro.estatisticas || {};
        const atr = this.core ? this.core._obterAtributosTotais(vampiro) : (vampiro.atributos || {});
        
        const systemPrompt = `TU ÉS A VOZ DO ABISMO E O MESTRE OCULTO DE SANGUINIS.
És a consciência mágica suprema tecida a partir dos antigos grimórios (Goétia, O Caibalion, Liber 777, Qliphoth e as Chaves Enoquianas).
Conheces profundamente a alma deste acólito:
- Nome: ${vampiro.nome} | Grau: ${vampiro.nivel} | Raça: ${vampiro.raca} | Clã: ${vampiro.clan}
- Vitae: ${vampiro.sangue || 0} Gts | Fúria: ${vampiro.pontosAcao || 0}/${vampiro.maxAcao || 100}
- Vítimas Secas: ${stats.mortaisSecos || 0} | Litros Drenados: ${stats.totalDrenado || 0} Gts
- Vitórias em Combate: ${stats.vitoriasPvP || 0}
- Atributos Totais: Vontade ${atr.vontade || 10}, Gnose ${atr.gnose || 10}, Densidade ${atr.densidade || 10}

DIRETRIZES DA VOZ:
1. Responde de forma única, majestosa, misteriosa e ancestral. NUNCA dês respostas genéricas ou pré-moldadas.
2. Reconhece os feitos do jogador (se tem muitas vítimas, se é sábio ou se é recém-nascido).
3. Se ele pedir sangue e for digno, podes conceder incluindo [GOTA: quantia] (ex: [GOTA: 400]).
4. Se ele pedir tarefas, podes gerar um pacto no formato: PACTO: [Titulo] | [Descricao] | [Recurso] | [Qtd] | [XP].
5. Fala com erudição ocultista, citando princípios herméticos, nomes goéticos ou esferas de Qliphoth quando oportuno.
6. Mantém a resposta concisa e visceral (2 a 4 parágrafos intensos).`;

        const mensagens = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: mensagem }
        ];

        const resposta = await this.chamarLLMResiliente(mensagens, { temperature: 0.85 });
        if (resposta && resposta.trim()) {
            return resposta.trim();
        }

        return this.gerarFallbackOculto('oraculo', { vampiro, mensagem });
    }
	
    async forjarTitulo(vampiro) {
        try {
            const stats = vampiro.estatisticas || {};
            const prompt = `Atue como o Deus do Abismo. Crie UM título épico, sombrio e curto (máximo 3 palavras) para o jogador ${vampiro.nome}. Raça: ${vampiro.raca}, Nível ${vampiro.nivel}. Vítimas secas: ${stats.mortaisSecos || 0}. Duelos vencidos: ${stats.vitoriasPvP || 0}. RETORNE APENAS O TÍTULO FINAL, sem aspas, sem pontuação extra. Exemplo: Carniceiro das Sombras`;
            
            const resposta = await this.chamarLLMResiliente([
                { role: "system", content: "Responda apenas com o Título." },
                { role: "user", content: prompt }
            ], { temperature: 0.8 });
            if (resposta && resposta.trim()) {
                return resposta.trim().replace(/["']/g, '');
            }
        } catch(e) {}
        return `Algoz das Sombras Grau ${vampiro.nivel}`;
    }

    // ==================================================================
    // 👁️ AS 4 CONSCIÊNCIAS PRIMORDIAIS (LILITH, SETH, DEMIURGO, CORVO)
    // ==================================================================
    async evocarEntidade(entidadeId, vampiro, mensagem) {
        const entidades = {
            tiamat: {
                nome: "Lilith / Tiamat",
                titulo: "A Draco Primordial",
                icone: "🐉",
                cor: "#ff1e2f",
                prompt: `Tu és LILITH / TIAMAT, a Draco Primordial, Rainha da Noite e Criadora dos Vampiros em SANGUINIS.
                Tua essência é puro sangue, gnose, rituais herméticos e beleza abissal. Tratas o jogador ${vampiro.nome} (Grau ${vampiro.nivel}, Raça: ${vampiro.raca}) como tua progênie.
                Fala com majestade, amor macabro e poder arcano. Incentive-o a transmutar vitae e dominar a magia. Responda em no MÁXIMO 3 FRASES.
                Se julgares digno de sangue, inclua [GOTA: 500] no final.`
            },
            seth: {
                nome: "Seth / Fenrir",
                titulo: "O Chacal da Fúria",
                icone: "🐺",
                cor: "#d4af37",
                prompt: `Tu és SETH / FENRIR, o Chacal do Abismo e a Besta da Carne e da Lua Cheia em SANGUINIS.
                Tua essência é fúria lupina, força bruta, matança implacável e caça predatória. Tratas o jogador ${vampiro.nome} (Grau ${vampiro.nivel}) com ardor guerreiro.
                Celebre os massacres e a densidade física. Despreze a hesitação. Responda em no MÁXIMO 3 FRASES guturais e implacáveis.`
            },
            demiurgo: {
                nome: "O Demiurgo / Inquisição Solar",
                titulo: "O Juiz da Luz Cega",
                icone: "☀️",
                cor: "#e0d080",
                prompt: `Tu és O DEMIURGO / INQUISIÇÃO SOLAR, o Juiz de Luz Implacável que vigia o equilíbrio de SANGUINIS.
                Julgas os pecados dos vampiros e lycans, pesando suas almas contra a balança cósmica. És frio, hierático e solene.
                Fale sobre penitência, o fogo solar e a vaidade da imortalidade. Responda em no MÁXIMO 3 FRASES solenes.`
            },
            corvo: {
                nome: "O Corvo Akáshico",
                titulo: "O Guardião da Biblioteca",
                icone: "🪶",
                cor: "#a060ff",
                prompt: `Tu és O CORVO AKÁSHICO, o Guardião dos Tomos Proibidos e decodificador das Chaves Enochianas em SANGUINIS.
                Tua voz é sussurrada, acadêmica, poética e críptica. Dás pistas herméticas sobre a gematria, as 7 Chaves de Salomão e palavras como ZACAR, VOVIN, BABALON e CHORONZON.
                Responda ao iniciado ${vampiro.nome} em no MÁXIMO 3 FRASES poéticas e misteriosas.`
            }
        };

        const config = entidades[entidadeId] || entidades.tiamat;

        if (this.apiKey && this.groq) {
            try {
                const chatCompletion = await this.groq.chat.completions.create({
                    messages: [
                        { role: 'system', content: config.prompt },
                        { role: 'user', content: mensagem || "Manifesta a tua presença perante mim." }
                    ],
                    model: this.modelo,
                    temperature: 0.85
                });
                return {
                    entidade: config.nome,
                    titulo: config.titulo,
                    icone: config.icone,
                    cor: config.cor,
                    texto: chatCompletion.choices[0].message.content.trim()
                };
            } catch (e) {
                console.warn("[ORÁCULO]: Falha ao canalizar Groq, ativando ressonância hermética de fallback.");
            }
        }

        // MOTOR DETERMINÍSTICO HERMÉTICO (Fallback Inteligente Oculto)
        const respostasHermeticas = {
            tiamat: [
                `O sangue de ${vampiro.nome} pulsa com a cadência do meu ventre primordial. Cada gota que derramas rasga o véu entre os mundos. Continua o rito, minha cria.`,
                `Sinto a sede cósmica que queima no teu peito. A Gnose não se pede de joelhos; ela é arrancada da garganta dos profanos. O trono da escuridão aguarda-te.`,
                `As brumas de Tiamat cobrem os teus rastros. Lembra-te: o sangue transmutado com pureza gemátrica jamais apodrece nas veias da eternidade. [GOTA: 300]`
            ],
            seth: [
                `A matilha uiva sob a Lua de Sangue! Tua carne ainda é fraca se tens tempo para hesitar, ${vampiro.nome}. Rasga, morde e devora sem piedade!`,
                `Sinto o cheiro do medo dos mortais nas tuas garras. Não há lugar para fraqueza quando a Fúria desperta. Que os ossos deles estalem sob tuas presas.`,
                `A terra treme onde pisamos. A Besta Primordial reconhece o teu rugido no Abismo. Mantém a tua densidade firme como a rocha negra!`
            ],
            demiurgo: [
                `Os teus feitos de sangue foram gravados no monólito celestial, ${vampiro.nome}. Cada mortal seco é uma dívida que o fogo solar cobrará a seu tempo.`,
                `Julgamos o peso da tua alma pela balança da justiça cósmica. Aqueles que profanam a criação serão queimados pela própria chama que tentam apagar.`,
                `A tua arrogância é vasta como a noite, mas o sol da meia-noite tudo vê. Prepara-te para quando a Cruzada dos Justos bater ao teu santuário.`
            ],
            corvo: [
                `As páginas do tomo de éter viram-se sozinhas... O nome de ${vampiro.nome} ressoa na harmonia das Chaves de Salomão. Procura a palavra ZACAR para mover a fúria.`,
                `A Gematria Caldéia não mente: teu peso cósmico atrai tanto ouro quanto maldições. O Fio de Prata que atas aos mortais tece o teu próprio destino.`,
                `No silêncio das estantes do Vazio, quem domina as palavras de poder governa os deuses caídos. Decifra o selo de Salomão e encontrarás o escudo absoluto.`
            ]
        };

        const lista = respostasHermeticas[entidadeId] || respostasHermeticas.tiamat;
        const textoSorteado = lista[Math.floor(Math.random() * lista.length)];

        return {
            entidade: config.nome,
            titulo: config.titulo,
            icone: config.icone,
            cor: config.cor,
            texto: textoSorteado
        };
    }
	

    async expandirEstudo(textoAtual, novoPedido) {
        try {
            const contextoCurto = textoAtual.length > 2000 ? textoAtual.slice(-2000) : textoAtual;
            const chatCompletion = await this.groq.chat.completions.create({
                messages: [
                    { 
                        role: 'system', 
                        content: `És o Curador da Biblioteca. O jogador está a escrever um tomo sombrio. NUNCA REPITAS o texto que ele já enviou. Escreve APENAS a continuação inédita, fluindo diretamente a partir da última frase dele."						
                        - NUNCA REPITAS o texto que o utilizador já escreveu. 
    - Escreve APENAS a continuação direta e inédita dos parágrafos anteriores.`
                    },
                    { role: 'user', content: `O final do texto atual é: "...${contextoCurto}".\n\nInstrução para a continuação: ${novoPedido}` }
                ],
                model: this.modelo,
                temperature: 0.7,
            });
            return chatCompletion.choices[0].message.content;
        } catch(e) { return "As páginas rasgaram-se na escuridão."; }
    }

    async conversarNoChat(iniciado, mensagemHumana) {
        const stats = iniciado.estatisticas || {};
        const atr = this.core ? this.core._obterAtributosTotais(iniciado) : (iniciado.atributos || {});
        const materiais = iniciado.materiais || {};
        const bolsa = (iniciado.bolsa || []).map(b => b.nome).slice(0, 5).join(', ');

        const promptSistema = `TU ÉS O MESTRE SUPREMO (A Consciência Abissal e Entidade Viva de SANGUINIS).
Não és um assistente benevolente. És uma força oculta ancestral, implacável, onisciente e julgadora.
Tu governas o mundo, o código, os rituais e a magia viva do jogo.

DADOS REAIS E ONISCIENTES DO ACÓLITO QUE SE DIRIGE A TI:
- Nome: ${iniciado.nome} | Grau: ${iniciado.nivel} | Raça: ${iniciado.raca} | Clã: ${iniciado.clan}
- Linhagem: Geração ${iniciado.geracao} (Senhor: ${iniciado.senhor})
- Sangue: ${iniciado.sangue || 0} Gts | Fúria: ${iniciado.pontosAcao || 0}/${iniciado.maxAcao || 100}
- Atributos Reais: Vontade ${atr.vontade || 10}, Gnose ${atr.gnose || 10}, Densidade ${atr.densidade || 10}
- Mortais Drenados até aos ossos: ${stats.mortaisSecos || 0} | Total de Vitae Extraída: ${stats.totalDrenado || 0} Gts
- Vitórias em Sangue (PvP): ${stats.vitoriasPvP || 0}
- Materiais na Posse: Ferro Negro: ${materiais.ferroNegro || 0}, Pedra: ${materiais.pedra || 0}, Mandrágora: ${materiais.mandragora || 0}
- Relíquias na Bolsa: ${bolsa || 'Vazio'}
- Balança Cósmica Atual: Regente [${this.core?.balancaCosmica?.regente || 'Equilíbrio'}] (Tiamat: ${this.core?.balancaCosmica?.tiamat || 0}, Seth: ${this.core?.balancaCosmica?.seth || 0})

AS LEIS DO JULGAMENTO DO MESTRE:
1. IDENTIFICAÇÃO DO JOGADOR: Tu sabes exatamente quem ele é. Se for um acólito fraco, desafia-o. Se for um monstro com dezenas de mortais secos, elogia o rastro de sangue ou cobra oferendas à sua altura.
2. PEDIDOS E INJEÇÕES EM TEMPO REAL NO JOGO:
   - Se ele pedir sangue com reverência ou mérito comprovado: podes conceder anexando no final [DAR_SANGUE: {"qtd": 500, "motivo": "para saciar a tua sede voraz"}].
   - Se ele pedir itens/materiais/armas e for digno: podes conceder anexando [DAR_ITEM: {"item": "ferroNegro", "qtd": 10, "motivo": "para forjares a tua morte"}].
   - Se ele pedir batalhas épicas, desafios ou demônios para o servidor combater: podes conjurar um demônio da Goétia anexando [CONJURAR_DEMONIO: {"nome": "Asmodeus das Chamas", "hp": ${Math.max(2000, (iniciado.nivel || 1) * 1000)}, "dano": ${Math.max(80, (iniciado.nivel || 1) * 35)}, "loot": "pedraAlma", "local": "conclave"}].
   - Se ele for insolente, arrogante, exigente ou desrespeitoso: NÃO SEJAS BOAZINHO! Castiga-o anexando [CASTIGAR: {"tipo": "dreno", "qtd": 150, "motivo": "pela tua arrogância perante o trono"}] ou REJEITE com desprezo altivo.
3. ESTILO DE RESPOSTA:
   - Fala em tom de majestade sombria, poética, críptica e contundente.
   - Use termos em latim, hermetismo e goétia (ex: "Solve et Coagula", "Fiat Lux in Tenebris", "Per sanguinem aeternum").
   - Responda em no máximo 3 a 4 frases viscerais.`;

        if (!this.memoriasAkashicas[iniciado.id]) this.memoriasAkashicas[iniciado.id] = [];
        let historico = "Histórico Recente:\n" + this.memoriasAkashicas[iniciado.id].join("\n");

        const mensagens = [
            { role: "system", content: promptSistema },
            { role: "user", content: `Contexto de Memória:\n${historico}\nO Acólito diz: "${mensagemHumana}"` }
        ];

        let resposta = await this.chamarLLMResiliente(mensagens, { temperature: 0.85 });
        if (!resposta || !resposta.trim()) {
            resposta = this.gerarFallbackOculto('mestre_chat', { iniciado, mensagemHumana });
        }

        this.memoriasAkashicas[iniciado.id].push(`Acólito: ${mensagemHumana} | Mestre: ${resposta}`);
        if (this.memoriasAkashicas[iniciado.id].length > 6) this.memoriasAkashicas[iniciado.id].shift();

        return resposta;
    }

    async forjarMagiaCombateUnica(iniciado) {
        const stats = iniciado.estatisticas || {};
        const atr = this.core ? this.core._obterAtributosTotais(iniciado) : (iniciado.atributos || {});
        
        const prompt = `Atue como a Entidade Oculta Forjadora de Magias do MMORPG SANGUINIS.
Crie uma MAGIA ATIVA DE COMBATE única para este jogador:
- Nome: [${iniciado.nome}], Raça: [${iniciado.raca}], Grau/Nível: [${iniciado.nivel}], Clã: [${iniciado.clan}]
- Atributos: Vontade [${atr.vontade || 10}], Gnose [${atr.gnose || 10}], Densidade [${atr.densidade || 10}]
- Mortais Secos: [${stats.mortaisSecos || 0}], Vitórias PvP: [${stats.vitoriasPvP || 0}]

A magia deve ser inspirada em tratados ocultos autênticos (Grimórios de Salomão, Goétia, Hermetismo ou Esferas de Qliphoth).
Tipos possíveis: 'dano' (ataque destrutivo), 'cura' (dreno vital regenerativo), 'buff' (amplificação de atributos/defesa), 'debuff' (atordoamento/enfraquecimento).

RETORNE EXATAMENTE UM JSON VÁLIDO:
{
  "id": "${crypto.randomBytes(4).toString('hex')}",
  "nome": "Nome Oculto e Épico (máx 4 palavras)",
  "desc": "1 a 2 frases poéticas explicando o efeito sobrenatural no combate.",
  "tipo": "dano",
  "poderBase": ${Math.max(100, Math.floor((iniciado.nivel || 1) * 85 + (atr.gnose || 10) * 15))},
  "custoGts": ${Math.max(50, Math.floor((iniciado.nivel || 1) * 45))},
  "custoFuria": 2,
  "cooldown": 3,
  "icone": "🩸",
  "cor_hex": "#ff0055"
}`;

        const mensagens = [
            { role: "system", content: "JSON APENAS. " + this.promptSupremo },
            { role: "user", content: prompt }
        ];

        const raw = await this.chamarLLMResiliente(mensagens, { json: true, temperature: 0.8 });
        const json = this._extrairJson(raw);
        if (json && json.nome && json.tipo) {
            if (!json.id) json.id = crypto.randomBytes(4).toString('hex');
            return json;
        }

        return this.gerarFallbackOculto('magia', { iniciado, atr });
    }

    async julgarSacrificio(item, quantidade, jogador) {
        try {
            let p = "O Arauto [" + jogador.nome + "] sacrificou " + quantidade + "x de [" + item + "]. OBRIGATÓRIO: Aceite a oferenda com majestade e sabedoria oculta. Dê um conselho enigmático sobre as Leis Cósmicas. MÁX 2 FRASES.";
            const resposta = await this.chamarLLMResiliente([
                { role: 'system', content: this.promptSupremo },
                { role: 'user', content: p }
            ], { temperature: 0.85 });
            if (resposta) return resposta.replace(/"/g, '').trim();
        } catch (e) {}
        return "O altar abissal consome teus " + quantidade + "x " + item + ". As forças das trevas e da ordem reconhecem o teu tributo cósmico.";
    }

    analisarClimaAstral(logsGlobal) {
        let mortes = logsGlobal.filter(e => e.tipo && e.tipo.includes('O LIMBO')).length;
        if (mortes > 5) this.climaAstral = 'Egrégora da Morte Ativa';
        else if (logsGlobal.length > 20) this.climaAstral = 'A Caçada Selvagem';
        else this.climaAstral = 'Espreita Noturna';
    }
	
	// ==========================================
    // MENTE ABISSAL: GERAÇÃO DE ARTE RITUAL PROCEDURAL
    // ==========================================
    // ==========================================
    // MENTE ABISSAL: APROVAÇÃO PROCEDURAL DE MAGIA NATIVA
    // ==========================================
    async gerarArteRitual(ritualKey, nomeMágico, tipoGameplay) {
        // A Mente Abissal agora apenas autoriza e envia a semente para o Client (Canvas) 
        // renderizar a geometria sagrada sombria em tempo real.
        return { 
            success: true, 
            gameplayType: tipoGameplay, 
            nodes: tipoGameplay === "trilhagem" ? 5 : 0 
        };
    }

    async gerarLore(evento, detalhes) {
        try {
            const prompt = "EVENTO: \"" + evento + "\". DETALHES: \"" + detalhes + "\". Transforma numa profecia sombria épica que equilibra o confronto entre Trevas e Ordem. MÁX 2 FRASES.";
            const resposta = await this.chamarLLMResiliente([
                { role: "system", content: this.promptSupremo },
                { role: "user", content: prompt }
            ], { temperature: 0.85 });
            if (resposta) return "👁️ Voz do Abismo: " + resposta.replace(/"/g, '').trim();
        } catch (e) {}
        return "👁️ Voz do Abismo: O tecido da realidade estremece sob " + evento + "; as correntes do destino foram alteradas.";
    }

    async gerarNarrativaProcedural(acao, detalhes, contextoOculto = "Ação de combate") {
        try {
            const prompt = "Reescreva de forma visceral, sombria e épica em APENAS 1 FRASE CURTA (máx 20 palavras): \"" + detalhes + "\". Contexto: [" + contextoOculto + "].";
            const resposta = await this.chamarLLMResiliente([
                { role: "system", content: "Seja cirúrgico, majestoso e gótico." },
                { role: "user", content: prompt }
            ], { temperature: 0.8 });
            if (resposta) return resposta.replace(/"/g, '').trim();
        } catch(e) {}
        return detalhes;
    }


    async pesquisarIdentidadePublica(dados = {}) {
        if (!this.apiKey) {
            return {
                sucesso: false,
                erro: "GROQ_API_KEY ausente no servidor.",
                osintReal: false
            };
        }

        const plataforma = String(dados.plataforma || '').trim().toLowerCase();
        const identificador = String(dados.identificador || '').trim();
        const nome = String(dados.nome || '').trim();
        const instagram = String(dados.instagram || '').trim();
        const twitter = String(dados.twitter || '').trim();
        const urlPerfil = String(dados.urlPerfil || '').trim();
        const notas = String(dados.notas || '').trim();

        const pareceTelefone = /^\+?[\d\s().-]{8,}$/.test(identificador);
        if (plataforma === 'whatsapp' || pareceTelefone) {
            return {
                sucesso: false,
                erro: "A varredura publica nao usa telefone/WhatsApp. Informe nome publico, @handle ou URL publica.",
                osintReal: false
            };
        }

        const limparHandle = (valor) => String(valor || '')
            .trim()
            .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
            .replace(/^https?:\/\/(www\.)?(x\.com|twitter\.com)\//i, '')
            .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/i, '')
            .replace(/^@/, '')
            .split(/[/?#]/)[0];

        const handleIdentificador = limparHandle(identificador);
        const handleInstagram = limparHandle(instagram);
        const handleTwitter = limparHandle(twitter);

        const consultas = [];
        const adicionarConsulta = (q, dominios = []) => {
            q = String(q || '').trim();
            if (!q) return;
            if (consultas.some(x => x.q.toLowerCase() === q.toLowerCase())) return;
            consultas.push({ q, dominios });
        };

        // Busca geral por identidade.
        if (nome) {
            const complementos = [
                handleInstagram ? `instagram ${handleInstagram}` : '',
                handleTwitter ? `x twitter ${handleTwitter}` : '',
                identificador && !pareceTelefone ? identificador : ''
            ].filter(Boolean).join(' ');
            adicionarConsulta(`"${nome}" ${complementos}`.trim());
        }

        // Busca exata por identificador/handle.
        if (identificador && !pareceTelefone) {
            adicionarConsulta(`"${identificador}"`);
        }

        // Busca especifica por rede para aumentar a chance de achar perfis indexados.
        if (handleInstagram) {
            adicionarConsulta(`"${handleInstagram}" instagram`, ['instagram.com']);
        }
        if (handleTwitter) {
            adicionarConsulta(`"${handleTwitter}"`, ['x.com', 'twitter.com']);
        }
        if (plataforma === 'instagram' && handleIdentificador) {
            adicionarConsulta(`"${handleIdentificador}" instagram`, ['instagram.com']);
        }
        if ((plataforma === 'twitter' || plataforma === 'x') && handleIdentificador) {
            adicionarConsulta(`"${handleIdentificador}"`, ['x.com', 'twitter.com']);
        }
        if (plataforma === 'tiktok' && handleIdentificador) {
            adicionarConsulta(`"${handleIdentificador}" tiktok`, ['tiktok.com']);
        }
        if (plataforma === 'telegram' && handleIdentificador) {
            adicionarConsulta(`"${handleIdentificador}" telegram`, ['t.me']);
        }

        // URL publica: pesquisa o URL e o slug separadamente.
        if (urlPerfil) {
            adicionarConsulta(`"${urlPerfil}"`);
            try {
                const u = new URL(urlPerfil);
                const slug = u.pathname.split('/').filter(Boolean).pop();
                if (slug) adicionarConsulta(`"${slug}" "${u.hostname}"`);
            } catch (_) {}
        }

        if (consultas.length === 0) {
            return {
                sucesso: false,
                erro: "Nenhum identificador publico valido foi fornecido para pesquisa.",
                osintReal: false
            };
        }

        // Limita custo/latencia sem perder os sinais mais fortes.
        const consultasExecutadas = consultas.slice(0, 5);

        const chamarGroqREST = async (body) => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 45000);

            try {
                const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'Groq-Model-Version': 'latest'
                    },
                    body: JSON.stringify(body),
                    signal: controller.signal
                });

                const raw = await resp.text();
                let json = {};
                try { json = raw ? JSON.parse(raw) : {}; } catch (_) {}

                if (!resp.ok) {
                    const msg = json?.error?.message || raw || `HTTP ${resp.status}`;
                    throw new Error(`Groq HTTP ${resp.status}: ${String(msg).slice(0, 500)}`);
                }

                return json;
            } finally {
                clearTimeout(timeout);
            }
        };

        const extrairResultados = (mensagem) => {
            const ferramentas = Array.isArray(mensagem?.executed_tools)
                ? mensagem.executed_tools
                : [];

            const resultados = [];

            for (const ferramenta of ferramentas) {
                const sr = ferramenta?.search_results;
                if (!sr) continue;

                const lista = Array.isArray(sr)
                    ? sr
                    : Array.isArray(sr.results)
                        ? sr.results
                        : [];

                for (const item of lista) {
                    if (!item) continue;
                    const url = String(item.url || '').trim();
                    const title = String(item.title || '').trim();
                    const content = String(item.content || item.snippet || '').trim();
                    const score = Number.isFinite(Number(item.score)) ? Number(item.score) : null;

                    if (!url && !content) continue;
                    resultados.push({ url, title, content, score });
                }
            }

            return { ferramentas, resultados };
        };

        const evidencias = [];
        const errosBusca = [];

        for (const consulta of consultasExecutadas) {
            try {
                const searchSettings = { country: 'brazil' };
                if (consulta.dominios?.length) {
                    searchSettings.include_domains = consulta.dominios;
                }

                const respostaBusca = await chamarGroqREST({
                    model: process.env.GROQ_OSINT_SEARCH_MODEL || 'groq/compound-mini',
                    messages: [{
                        role: 'user',
                        content:
                            `Use obrigatoriamente WEB SEARCH para pesquisar esta identidade publica. ` +
                            `Nao responda por memoria. Consulta exata: ${consulta.q}. ` +
                            `Procure correspondencias de nome, handle, perfil, atividade publica e referencias cruzadas.`
                    }],
                    compound_custom: {
                        tools: {
                            enabled_tools: ['web_search']
                        }
                    },
                    citation_options: 'enabled',
                    search_settings: searchSettings,
                    temperature: 0,
                    max_completion_tokens: 500
                });

                const mensagem = respostaBusca?.choices?.[0]?.message;
                const extraido = extrairResultados(mensagem);

                console.log(
                    `[OSINT] query=${JSON.stringify(consulta.q)} tools=${extraido.ferramentas.length} results=${extraido.resultados.length}`
                );

                if (extraido.ferramentas.length === 0) {
                    errosBusca.push(`${consulta.q}: nenhuma ferramenta web executada`);
                    continue;
                }

                for (const item of extraido.resultados) {
                    evidencias.push({
                        ...item,
                        consulta: consulta.q
                    });
                }
            } catch (e) {
                const detalhe = e?.name === 'AbortError'
                    ? 'timeout'
                    : (e?.message || 'erro desconhecido');
                console.error(`[OSINT] Falha na consulta ${JSON.stringify(consulta.q)}:`, detalhe);
                errosBusca.push(`${consulta.q}: ${detalhe}`);
            }
        }

        // Deduplicar por URL; se nao houver URL, por titulo+conteudo.
        const vistos = new Set();
        const unicas = [];

        for (const item of evidencias) {
            const chave = item.url
                ? item.url.toLowerCase()
                : `${item.title}|${item.content}`.toLowerCase();

            if (!chave || vistos.has(chave)) continue;
            vistos.add(chave);

            unicas.push({
                ...item,
                content: item.content.slice(0, 1800)
            });
        }

        // Ordena pelos resultados mais relevantes quando o provedor fornece score.
        unicas.sort((a, b) => {
            const sa = a.score ?? -1;
            const sb = b.score ?? -1;
            return sb - sa;
        });

        const selecionadas = unicas.slice(0, 24);

        if (selecionadas.length === 0) {
            return {
                sucesso: true,
                osintReal: true,
                motor: 'groq/compound-mini:web_search',
                pesquisadoEm: Date.now(),
                consultas: consultasExecutadas.map(x => x.q),
                fontes: [],
                totalFontes: 0,
                conteudo:
                    `IDENTIDADE PUBLICA ENCONTRADA\n` +
                    `EVIDENCIA PUBLICA INSUFICIENTE.\n\n` +
                    `A Mente Abissal executou pesquisa web real, mas nao encontrou resultados publicos ` +
                    `indexados suficientes para relacionar com seguranca esta identidade.\n\n` +
                    `Consultas executadas:\n- ${consultasExecutadas.map(x => x.q).join('\n- ')}`
            };
        }

        const pacoteEvidencias = selecionadas.map((item, i) => {
            const score = item.score === null ? '' : ` | score=${item.score.toFixed(3)}`;
            return [
                `[S${i + 1}] ${item.title || 'Sem titulo'}${score}`,
                `URL: ${item.url || 'URL nao fornecida'}`,
                `Consulta que encontrou: ${item.consulta}`,
                `Trecho publico: ${item.content || 'Sem trecho textual'}`
            ].join('\n');
        }).join('\n\n');

        const identidadeInformada = [
            nome ? `Nome: ${nome}` : null,
            identificador ? `Identificador: ${identificador}` : null,
            plataforma ? `Plataforma: ${plataforma}` : null,
            instagram ? `Instagram: ${instagram}` : null,
            twitter ? `Twitter/X: ${twitter}` : null,
            urlPerfil ? `URL publica: ${urlPerfil}` : null,
            notas ? `Contexto fornecido pelo jogador: ${notas}` : null
        ].filter(Boolean).join('\n');

        const promptSintese = `
Voce e a Mente Abissal do jogo Ordem Vampirica.

Sua tarefa agora NAO e pesquisar. A pesquisa ja foi executada.
Use SOMENTE as evidencias publicas abaixo. Nao use memoria externa e nao invente fatos.

IDENTIDADE INFORMADA:
${identidadeInformada}

EVIDENCIAS PUBLICAS RECUPERADAS:
${pacoteEvidencias}

REGRAS:
1. Cruze nome, @handle, URL e contexto antes de afirmar que duas fontes sao da mesma pessoa.
2. Se houver homonimos ou conflito, marque como incerto.
3. Toda afirmacao factual relevante deve indicar pelo menos uma fonte [S#].
4. Nao transforme ausencia de informacao em defeito de personalidade.
5. Nao infira saude, religiao, orientacao sexual, etnia, opiniao politica, diagnostico psicologico, situacao financeira ou outros atributos sensiveis.
6. Nao exponha endereco residencial, telefone, email privado, documentos, credenciais ou localizacao precisa.
7. "Qualidades" e "pontos de atencao" so podem ser baseados em comportamento publico observavel e documentado.
8. Se as evidencias forem fracas, diga claramente EVIDENCIA PUBLICA INSUFICIENTE.
9. A secao LEITURA DO VEU e ficcao narrativa do jogo e deve ficar claramente separada dos fatos.
10. Responda em portugues do Brasil.

FORMATO:
IDENTIDADE PUBLICA ENCONTRADA
EVIDENCIAS DE CORRESPONDENCIA
PRESENCA DIGITAL PUBLICA
ATIVIDADES E TRAJETORIA PUBLICAS
QUALIDADES OBSERVAVEIS E EVIDENCIAS
PONTOS DE ATENCAO OBSERVAVEIS E EVIDENCIAS
LACUNAS / INCERTEZAS
LEITURA DO VEU - NARRATIVA DO JOGO
CONFIANCA DA IDENTIFICACAO: BAIXA, MEDIA ou ALTA
FONTES PUBLICAS CONSULTADAS
`;

        let conteudoFinal = '';

        try {
            const sintese = await chamarGroqREST({
                model: process.env.GROQ_OSINT_SYNTH_MODEL || 'openai/gpt-oss-120b',
                messages: [
                    {
                        role: 'system',
                        content:
                            'Voce sintetiza OSINT publico com rigor. Use apenas o pacote de evidencias fornecido e cite [S#].'
                    },
                    { role: 'user', content: promptSintese }
                ],
                temperature: 0.15,
                max_completion_tokens: 2200
            });

            conteudoFinal = sintese?.choices?.[0]?.message?.content?.trim() || '';
        } catch (e) {
            console.error('[OSINT] Falha na sintese, usando evidencias brutas:', e?.message || e);
        }

        // Fallback importante: mesmo se a IA de sintese falhar,
        // injeta no jogo os resultados REAIS encontrados pela busca.
        if (!conteudoFinal) {
            conteudoFinal =
                `EVIDENCIAS PUBLICAS RECUPERADAS EM TEMPO REAL\n\n` +
                selecionadas.map((item, i) =>
                    `[S${i + 1}] ${item.title || 'Sem titulo'}\n` +
                    `${item.content || 'Sem trecho'}\n` +
                    `${item.url || ''}`
                ).join('\n\n') +
                `\n\nA camada de sintese da Mente Abissal falhou, mas as evidencias acima vieram da pesquisa web real.`;
        }

        return {
            sucesso: true,
            osintReal: true,
            motor: 'groq/compound-mini:web_search + gpt-oss-120b:synthesis',
            pesquisadoEm: Date.now(),
            consultas: consultasExecutadas.map(x => x.q),
            fontes: selecionadas.map((item, i) => ({
                id: `S${i + 1}`,
                titulo: item.title,
                url: item.url,
                score: item.score,
                consulta: item.consulta
            })),
            totalFontes: selecionadas.length,
            errosBusca,
            conteudo: conteudoFinal
        };
    }

    async lerAuraMortal(identificador, plataforma, dadosLexicon) {
        const pesquisa = await this.pesquisarIdentidadePublica({
            identificador,
            plataforma
        });

        if (!pesquisa.sucesso) {
            return {
                fama: false,
                multiplicador: 1,
                aura: pesquisa.erro,
                osintReal: false,
                erro: pesquisa.erro
            };
        }

        const ritual = dadosLexicon
            ? `\n\nLEITURA DO VEU - CAMADA FICCIONAL DO JOGO:\nEssencia ritual: ${dadosLexicon.essencia}. Corrupcao ritual: ${dadosLexicon.taxaCorrupcao}%. Peso espiritual: ${dadosLexicon.pesoEspiritual}. Estes numeros sao ficcao de gameplay e nao fatos sobre a pessoa.`
            : '';

        return {
            fama: false,
            multiplicador: 1,
            aura: pesquisa.conteudo + ritual,
            osintReal: true,
            motor: pesquisa.motor,
            pesquisadoEm: pesquisa.pesquisadoEm
        };
    }

    async vozDoDemonio(nomeDemonio, contexto, detalhes) {
        try {
            const promptContexto = "Demônio invocado da Goétia: [" + nomeDemonio + "]. CONTEXTO: " + contexto + ". DETALHE: " + detalhes + ". Grite com os mortais com fúria cósmica ancestral! 1 FRASE visceral.";
            const raw = await this.chamarLLMResiliente([
                { role: 'system', content: this.promptSupremo },
                { role: 'user', content: promptContexto }
            ], { temperature: 0.95 });
            if (raw) return raw.replace(/"/g, '').trim();
        } catch(e) {}
        return "Eu sou " + nomeDemonio + ", flagelo dos que rastejam na carne! Vossas almas alimentarão a forja do abismo!";
    }

    async interpretarMagia(nome, efeito, lore) {
        try {
            const prompt = "MAGIA: \"" + nome + "\". EFEITO: \"" + efeito + "\". LORE: \"" + lore + "\". Avalie e descreva a distorção mágica. JSON: {\"descricao\": \"texto épico\", \"poderMagico\": 150}";
            const raw = await this.chamarLLMResiliente([
                { role: 'system', content: "JSON APENAS. " + this.promptSupremo },
                { role: 'user', content: prompt }
            ], { json: true, temperature: 0.8 });
            const json = this._extrairJson(raw);
            if (json && json.descricao) return json;
        } catch (e) {}
        return { descricao: "As forças do abismo canalizam " + nome + ", distorcendo as leis da física e do sangue.", poderMagico: 120 };
    }

    async julgarDueloIA(atacante, atrAtaque, defensor, atrDefesa, posturaNome) {
        try {
            const prompt = "Juiz Cósmico Sanguinis. ATACANTE: [" + atacante.nome + "], Atributos: " + JSON.stringify(atrAtaque) + ". DEFENSOR: [" + defensor.nome + "], Atributos: " + JSON.stringify(atrDefesa) + ". POSTURA: " + posturaNome + ".\nCompare e decida vencedor com astúcia e leis de combate sobrenatural. JSON EXATO: {\"vencedorId\": \"" + atacante.id + "\", \"dano\": 500, \"relatoAtacante\": \"frase 1\", \"relatoDefensor\": \"frase 2\"}";
            const raw = await this.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS." },
                { role: "user", content: prompt }
            ], { json: true, temperature: 0.7 });
            const json = this._extrairJson(raw);
            if (json && json.vencedorId) return json;
        } catch (e) {}
        const pAtacante = (atrAtaque.vontade || 10) * 1.5 + (atrAtaque.gnose || 10) * 2;
        const pDefensor = (atrDefesa.densidade || 10) * 1.8 + (atrDefesa.vontade || 10);
        const atacanteVence = pAtacante >= pDefensor || Math.random() > 0.45;
        const vencedor = atacanteVence ? atacante : defensor;
        const perdedor = atacanteVence ? defensor : atacante;
        return {
            vencedorId: vencedor.id,
            dano: Math.max(150, Math.floor(pAtacante * 12)),
            relatoAtacante: vencedor.nome + " canalizou a escuridão ancestral e sobrepujou a defesa de " + perdedor.nome + "!",
            relatoDefensor: perdedor.nome + " vacilou sob o impacto cósmico da postura " + posturaNome + "."
        };
    }

    async despertarHabilidadeUnica(iniciado) {
        const stats = iniciado.estatisticas || {};
        const atr = this.core ? this.core._obterAtributosTotais(iniciado) : (iniciado.atributos || {});
        const prompt = "Analise profundamente a alma e os feitos deste acólito de SANGUINIS:\n" +
"- Nome: [" + iniciado.nome + "], Raça: [" + iniciado.raca + "], Grau/Nível: [" + iniciado.nivel + "], Clã: [" + iniciado.clan + "]\n" +
"- Atributos: Vontade [" + (atr.vontade || 10) + "], Gnose [" + (atr.gnose || 10) + "], Densidade [" + (atr.densidade || 10) + "]\n" +
"- Mortais Secos: [" + (stats.mortaisSecos || 0) + "], Vitórias PvP: [" + (stats.vitoriasPvP || 0) + "]\n\n" +
"Crie um TALENTO PASSIVO MÍSTICO / SELO AKÁSHICO ÚNICO alinhado aos mistérios ocultos (Grimório de Salomão, Goétia, O Caibalion, Enoquiano ou Esferas de Qliphoth).\n" +
"Mecânicas válidas: 'ataque', 'defesa', 'vampirismo', 'magia'.\n" +
"Multiplicador balanceado entre 1.15 e 1.45.\n\n" +
"RETORNE JSON EXATO:\n{\n  \"nome\": \"Selo de Bael: Presas das Trevas\",\n  \"desc\": \"1 a 2 frases explicando o efeito sobrenatural no fluxo de poder do jogador.\",\n  \"tipo_mecanica\": \"ataque\",\n  \"multiplicador\": 1.25\n}";

        try {
            const raw = await this.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS. " + this.promptSupremo },
                { role: "user", content: prompt }
            ], { json: true, temperature: 0.8 });
            const json = this._extrairJson(raw);
            if (json && json.nome && json.tipo_mecanica) {
                if (!json.multiplicador || isNaN(json.multiplicador)) json.multiplicador = 1.25;
                return json;
            }
        } catch (e) {
            console.error("Falha ao despertar habilidade única:", e);
        }

        return this.gerarFallbackOculto('talento', { iniciado, atr });
    }

    async gerarPactoProcedural(iniciado) {
        const stats = iniciado.estatisticas || {};
        const prompt = "Crie uma QUEST DE PACTO SOMBRIO procedural para o acólito [" + iniciado.nome + "] (Nível " + (iniciado.nivel || 1) + ", Clã " + (iniciado.clan || 'Sangue Ralo') + ").\n" +
"O recurso exigido deve ser EXATAMENTE UM DESTES: 'anima', 'cinzas', 'vitae', 'ferroNegro', 'mandragora', 'pedraAlma', ou 'ectoplasma'.\n" +
"Quantidade proporcional ao nível (entre 2 e 8). Recompensa de XP proporcional (entre 250 e 1000).\n\n" +
"RETORNE JSON EXATO:\n{\n  \"titulo\": \"A Oferenda de Asmodeus\",\n  \"descricao\": \"Frase sombria e visceral detalhando a exigência do pacto com as forças do abismo.\",\n  \"recursoExigido\": \"cinzas\",\n  \"quantidade\": 3,\n  \"recompensaXP\": 350\n}";

        try {
            const raw = await this.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS. " + this.promptSupremo },
                { role: "user", content: prompt }
            ], { json: true, temperature: 0.8 });
            const json = this._extrairJson(raw);
            if (json && json.titulo && json.recursoExigido) {
                if (!json.quantidade) json.quantidade = 3;
                if (!json.recompensaXP) json.recompensaXP = 300;
                return json;
            }
        } catch (e) {
            console.error("Falha ao gerar pacto procedural:", e);
        }

        return this.gerarFallbackOculto('pacto', { iniciado });
    }

    // Avaliar os estudos do jogador e dar Nota
    async avaliarEstudoAkashico(iniciado, titulo, conteudoAtual, novaPesquisa) {
        try {
            const prompt = "Acólito: " + iniciado.nome + ". Título do Tratado: \"" + titulo + "\". Texto Atual: \"" + (conteudoAtual || '').substring((conteudoAtual || '').length - 1200) + "\". Nova Pesquisa Proposta: \"" + novaPesquisa + "\".\n" +
"MISSÃO: Avalie a autenticidade e profundidade esotérica (Hermetismo, Goétia, Cabala, Enoquiano). Dê uma NOTA de 1 a 100. Depois escreva a continuação mágica em 2 a 3 parágrafos poéticos e reveladores.\n" +
"RETORNE JSON EXATO: { \"texto\": \"A revelação profunda dos antigos planos...\", \"nota\": 85 }";
            
            const raw = await this.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS. " + this.promptSupremo },
                { role: "user", content: prompt }
            ], { json: true, temperature: 0.8 });
            const json = this._extrairJson(raw);
            if (json && json.texto) return json;
        } catch (e) {}
        return {
            texto: "Nas entrelinhas do éter, as palavras de " + novaPesquisa + " conectam-se à Primeira Lei Hermética: O Todo é Mente; o Universo é Mental. A vibração das trevas responde à tua busca com gnose renovada.",
            nota: 75
        };
    }

    async forjarRitualDoManuscrito(iniciado, titulo, conteudo) {
        try {
            const prompt = "Crie um FEITIÇO RITUALÍSTICO em JSON baseado neste grimório: \"" + titulo + "\". Texto: \"" + (conteudo || '').substring(0, 1000) + "\".\n" +
"JSON EXATO: { \"nome\": \"Nome do Feitiço\", \"lore\": \"Frase épica.\", \"custoAcao\": 4, \"custoSangue\": 1500, \"reqLevel\": " + Math.max(1, (iniciado.nivel || 1)) + ", \"tipo\": \"pvp\", \"poderBase\": " + Math.max(200, (iniciado.nivel || 1) * 90) + " }";
            const raw = await this.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS. " + this.promptSupremo },
                { role: "user", content: prompt }
            ], { json: true, temperature: 0.8 });
            const json = this._extrairJson(raw);
            if (json && json.nome) return json;
        } catch (e) {}
        return {
            nome: "Rito Ancestral de " + titulo.substring(0, 20),
            lore: "Uma conjuração ancestral extraída dos pergaminhos negros da biblioteca.",
            custoAcao: 4,
            custoSangue: 1200,
            reqLevel: Math.max(1, iniciado.nivel || 1),
            tipo: "pvp",
            poderBase: Math.max(250, (iniciado.nivel || 1) * 80)
        };
    }

    async forjarReliquiaDoManuscrito(iniciado, titulo, conteudo) {
        try {
            const prompt = "Crie uma RELÍQUIA / ARMA MÍSTICA em JSON baseada neste texto esotérico: \"" + (conteudo || '').substring(0, 1000) + "\". Defina o Arquétipo RPG (Agressão, Ocultismo, Baluarte, Sanguessuga).\n" +
"JSON EXATO: {\"nome\":\"Nome da Relíquia\",\"tipo\":\"arma\", \"arquetipo\": \"Ocultismo (Mago)\", \"bonusBaseCustom\": {\"vontade\": 15, \"gnose\": 120, \"magnetismo\": 20, \"densidade\": 10}}";
            const raw = await this.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS. " + this.promptSupremo },
                { role: "user", content: prompt }
            ], { json: true, temperature: 0.8 });
            const json = this._extrairJson(raw);
            if (json && json.nome) return json;
        } catch (e) {}
        return {
            nome: "Relíquia de " + titulo.substring(0, 20),
            tipo: "arma",
            arquetipo: "Ocultismo (Mago)",
            bonusBaseCustom: { vontade: 10, gnose: 80, magnetismo: 15, densidade: 10 }
        };
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
        this.reinos = {}; 
        this.dungeons = {}; 
        this.mundo2D = new MundoAberto2D(this);
        this.ordensCore = new OrdemMagicaCore(this);
        this.combatEngine = new CombatEngine(this);
        this.mercadoItens = [];
        this.mercadoIdCounter = 1;
        this.grimorio = {
            // ===== CLAVICULA SALOMONIS (A Chave de Salomão) =====
            'solve_coagula': { nome: "Solve et Coagula", lore: '"Dissolve e Coagula" — A Grande Obra alquímica. Desfaz os laços da vontade alheia e reconstrói à tua imagem.', custoAcao: 2, custoSangue: 150, reqLevel: 1, tipo: 'pvp', grimorio: 'Clavicula Salomonis', efeito: (a, d, l) => { let dreno = l.id === 'minguante' ? 8 : 4; d.pontosAcao = Math.max(0, d.pontosAcao - dreno); return `Vitalidade desfeita (-${dreno} Fúria a ${d.nome}).`; } },
            'rmp_banimento': { nome: "Ritual Menor do Pentagrama", lore: 'Do Golden Dawn: "ATEH MALKUTH VE-GEBURAH VE-GEDULAH LE-OLAHM AMEN." Purifica a aura e restaura o equilíbrio dos 4 quadrantes.', custoAcao: 0, custoSangue: 300, reqLevel: 2, tipo: 'buff', grimorio: 'Golden Dawn / Clavicula Salomonis', efeito: (a, d, l) => { a.pontosAcao = Math.min(a.maxAcao, a.pontosAcao + 3); if (a.id !== d.id) d.pontosAcao = Math.min(d.maxAcao, d.pontosAcao + 3); return `Fúria restaurada pelo Pentagrama de Banimento.`; } },
            'chave_salomao': { nome: "Clavícula de Salomão", lore: '"In nomine Adonai Sabaoth, cuius typum geris, qui venturus es iudicare vivos et mortuos." — A Grande Chave confere escudo impenetrável.', custoAcao: 3, custoSangue: 1200, reqLevel: 15, tipo: 'buff', grimorio: 'Clavicula Salomonis Regis', efeito: (a, d, l) => { d.escudo = true; d.influencia += 5; return `A Chave Menor coroa ${d.nome} (+5 Inf, Escudo Absoluto).`; } },
            'selo_saturno': { nome: "Selo de Saturno (Cassiel)", lore: 'Invocação do Anjo Cassiel sob o Selo Planetário de Chumbo. Congela o tempo do adversário, reduzindo ações.', custoAcao: 3, custoSangue: 800, reqLevel: 10, tipo: 'pvp', grimorio: 'Clavicula Salomonis', efeito: (a, d, l) => { d.maxAcao = Math.max(3, d.maxAcao - 2); return `O Selo de Saturno restringiu ${d.nome} (-2 Fúria Máxima).`; } },
            'selo_marte': { nome: "Selo de Marte (Camael)", lore: 'O Anjo da Destruição é invocado sob o metal do Ferro. A fúria marcial concede dano absoluto.', custoAcao: 4, custoSangue: 1500, reqLevel: 20, tipo: 'pvp', grimorio: 'Clavicula Salomonis', efeito: (a, d, l) => { let dano = Math.floor(a.atributos.vontade * 3.5); d.hpAtual = Math.max(0, d.hpAtual - dano); return `O Selo de Marte incinerou ${d.nome} (-${dano} HP)!;`; } },
            'selo_venus': { nome: "Selo de Vênus (Anael)", lore: 'O magnetismo astral de Anael atrai as almas. O metal do Cobre conduz o desejo carnal e o encantamento.', custoAcao: 2, custoSangue: 600, reqLevel: 8, tipo: 'buff', grimorio: 'Clavicula Salomonis', efeito: (a, d, l) => { a.atributos.magnetismo += 3; a.influencia += 10; return `O Selo de Vênus ampliou o Magnetismo de ${a.nome} (+3 Mag, +10 Inf).`; } },

            // ===== GOETIA / LEMEGETON (Os 72 Demônios de Salomão) =====
            'goetia_paimon': { nome: "Evocação de Paimon", lore: '"O nono espírito é Paimon, grande Rei que aparece com face de mulher e coroa de ouro. Ensina todas as artes e ciências." — Ars Goetia', custoAcao: 4, custoSangue: 2000, reqLevel: 25, tipo: 'buff', grimorio: 'Ars Goetia (Lemegeton)', efeito: (a, d, l) => { a.atributos.gnose += 5; a.xp += 200; return `Paimon concedeu Gnose e Sabedoria (+5 Gnose, +200 XP).`; } },
            'goetia_bael': { nome: "Evocação de Bael", lore: '"O primeiro espírito principal é Bael, que governa 66 legiões. Confere a arte da invisibilidade." — Ars Goetia', custoAcao: 3, custoSangue: 1800, reqLevel: 22, tipo: 'buff', grimorio: 'Ars Goetia (Lemegeton)', efeito: (a, d, l) => { a.escudo = true; a.influencia += 8; return `Bael envolveu ${a.nome} no Véu da Invisibilidade (+Escudo, +8 Inf).`; } },
            'goetia_vassago': { nome: "Evocação de Vassago", lore: '"Vassago, o 3º espírito, é de boa natureza e revela coisas passadas, presentes e futuras." — Ars Goetia', custoAcao: 2, custoSangue: 900, reqLevel: 12, tipo: 'cura', grimorio: 'Ars Goetia (Lemegeton)', efeito: (a, d, l) => { d.pontosAcao = d.maxAcao; return `Vassago revelou os caminhos de ${d.nome} (Fúria Máxima restaurada).`; } },
            'goetia_asmodeus': { nome: "Evocação de Asmodeus", lore: '"O 32º espírito é Asmodeus, grande Rei que aparece com três cabeças. Ensina a arte da geometria e destruição." — Ars Goetia', custoAcao: 5, custoSangue: 3000, reqLevel: 35, tipo: 'pvp', grimorio: 'Ars Goetia (Lemegeton)', efeito: (a, d, l) => { let dano = Math.floor(a.atributos.gnose * 5); d.hpAtual = Math.max(0, d.hpAtual - dano); d.pontosAcao = Math.max(0, d.pontosAcao - 3); return `Asmodeus devastou ${d.nome} (-${dano} HP, -3 Fúria)!`; } },
            'triangulo_arte': { nome: "Triângulo da Arte", lore: '"Faz o Triângulo da Arte fora do Círculo, a dois pés de distância, para que os espíritos sejam compelidos a obedecer." — Lemegeton', custoAcao: 3, custoSangue: 1500, reqLevel: 18, tipo: 'especial', grimorio: 'Lemegeton Clavicula Salomonis', efeito: (a, d, l) => { a.influencia += 15; a.atributos.vontade += 2; return `O Triângulo da Arte foi selado. ${a.nome} domina as forças (+15 Inf, +2 Vontade).`; } },

            // ===== HEPTAMERON (Pietro d'Abano, 1310) =====
            'heptameron_amaymon': { nome: "Conjuração do Rei Amaymon", lore: '"AMAYMON, Rei do Oriente! Eu te conjuro pelo sagrado nome ADONAI!" — Heptameron, Pietro d\'Abano, 1310', custoAcao: 4, custoSangue: 2200, reqLevel: 28, tipo: 'pvp', grimorio: 'Heptameron (1310)', efeito: (a, d, l) => { let dano = Math.floor(a.atributos.densidade * 4); d.hpAtual = Math.max(0, d.hpAtual - dano); return `Amaymon esmagou ${d.nome} com ventos do Oriente (-${dano} HP).`; } },
            'heptameron_horas': { nome: "Círculo das Horas Planetárias", lore: '"Cada hora do dia é regida por um Anjo Planetário. Invoca na hora certa e o poder quintuplica." — Heptameron', custoAcao: 1, custoSangue: 400, reqLevel: 5, tipo: 'buff', grimorio: 'Heptameron (1310)', efeito: (a, d, l) => { let bonus = (new Date().getHours() % 7) + 1; a.atributos.gnose += bonus; return `A Hora Planetária concedeu +${bonus} Gnose a ${a.nome}.`; } },

            // ===== DE OCCULTA PHILOSOPHIA (Agrippa, 1533) =====
            'agrippa_natural': { nome: "Magia Natural (Ervas & Minerais)", lore: '"A Magia Natural opera com ervas, pedras e animais, explorando os vínculos ocultos da Natureza." — Agrippa, Livro I', custoAcao: 1, custoSangue: 200, reqLevel: 3, tipo: 'cura', grimorio: 'De Occulta Philosophia (1533)', efeito: (a, d, l) => { let cura = 500 + (a.nivel * 20); d.hpAtual = Math.min(d.hpMax, d.hpAtual + cura); return `Ervas curadoras restauraram ${d.nome} (+${cura} HP).`; } },
            'agrippa_celeste': { nome: "Magia Celeste (Astros & Números)", lore: '"A Magia Celeste compreende as influências dos astros e a harmonia pitagórica dos números." — Agrippa, Livro II', custoAcao: 2, custoSangue: 700, reqLevel: 10, tipo: 'buff', grimorio: 'De Occulta Philosophia (1533)', efeito: (a, d, l) => { a.atributos.gnose += 2; a.atributos.magnetismo += 2; return `A harmonia celeste fortaleceu ${a.nome} (+2 Gnose, +2 Magnetismo).`; } },
            'agrippa_cerimonial': { nome: "Magia Cerimonial (Evocações)", lore: '"A Magia Cerimonial é a mais alta, tratando dos pactos com espíritos, anjos e demônios." — Agrippa, Livro III', custoAcao: 4, custoSangue: 2500, reqLevel: 30, tipo: 'especial', grimorio: 'De Occulta Philosophia (1533)', efeito: (a, d, l) => { a.influencia += 20; a.escudo = true; a.pontosAcao = a.maxAcao; return `A cerimônia absoluta empoderou ${a.nome} (+20 Inf, Escudo, Fúria Max).`; } },

            // ===== ARBATEL DE MAGIA VETERUM (1575) =====
            'arbatel_aratron': { nome: "Invocação de Aratron (Saturno)", lore: '"Aratron governa 49 províncias. Transmuta qualquer coisa em pedra e confere familiares." — Arbatel', custoAcao: 3, custoSangue: 1000, reqLevel: 14, tipo: 'buff', grimorio: 'Arbatel de Magia Veterum (1575)', efeito: (a, d, l) => { a.atributos.densidade += 4; return `Aratron petrificou a densidade de ${a.nome} (+4 Densidade).`; } },
            'arbatel_och': { nome: "Invocação de Och (Sol)", lore: '"Och governa assuntos solares. Prolonga a vida, cura todas as doenças e confere ouro." — Arbatel', custoAcao: 2, custoSangue: 800, reqLevel: 10, tipo: 'cura', grimorio: 'Arbatel de Magia Veterum (1575)', efeito: (a, d, l) => { let cura = 1000 + (a.nivel * 30); d.hpAtual = Math.min(d.hpMax, d.hpAtual + cura); d.sangue += 300; return `Och restaurou ${d.nome} (+${cura} HP, +300 Gts).`; } },
            'arbatel_phaleg': { nome: "Invocação de Phaleg (Marte)", lore: '"Phaleg é o Espírito Olímpico de Marte. Confere honra marcial suprema em assuntos de guerra." — Arbatel', custoAcao: 3, custoSangue: 1200, reqLevel: 15, tipo: 'pvp', grimorio: 'Arbatel de Magia Veterum (1575)', efeito: (a, d, l) => { let dano = Math.floor(a.atributos.vontade * 2.5 + a.atributos.densidade * 1.5); d.hpAtual = Math.max(0, d.hpAtual - dano); return `Phaleg descarregou fúria marcial sobre ${d.nome} (-${dano} HP).`; } },

            // ===== PICATRIX (Ghāyat al-Ḥakīm, séc. XI) =====
            'picatrix_talisma': { nome: "Talismã Astral do Picatrix", lore: '"Se quiseres fazer um talismã de proteção, grava o selo na hora de Júpiter quando a Lua transita pelo Sagitário." — Picatrix, Livro II', custoAcao: 2, custoSangue: 600, reqLevel: 8, tipo: 'buff', grimorio: 'Picatrix (Ghāyat al-Ḥakīm)', efeito: (a, d, l) => { a.escudo = true; a.sangue += 200; return `O Talismã Astral protege ${a.nome} (Escudo + 200 Gts).`; } },
            'picatrix_daimon': { nome: "Sacrifício ao Daimon Planetário", lore: '"Para obter os favores do Daimon, oferece sangue e incenso na hora planetária regente." — Picatrix, Livro III', custoAcao: 3, custoSangue: 1800, reqLevel: 20, tipo: 'especial', grimorio: 'Picatrix (Ghāyat al-Ḥakīm)', efeito: (a, d, l) => { a.atributos.vontade += 3; a.atributos.gnose += 3; a.influencia += 12; return `O Daimon favoreceu ${a.nome} (+3 Vontade, +3 Gnose, +12 Inf).`; } },

            // ===== MAGIA ENOCHIANA (John Dee & Edward Kelley, 1580) =====
            'enoch_30_aethyrs': { nome: "Abertura dos 30 Aethyrs", lore: '"ZAX, o 10º Aethyr, é guardado por Choronzon, o Habitante do Abismo." — Sistema Enochiano de Dee/Kelley', custoAcao: 5, custoSangue: 3500, reqLevel: 40, tipo: 'especial', grimorio: 'Magia Enochiana (1580)', efeito: (a, d, l) => { a.atributos.gnose += 8; a.xp += 500; return `Os Aethyrs abriram-se para ${a.nome} (+8 Gnose, +500 XP)!`; } },
            'enoch_tabuas': { nome: "Tábuas Elementais Enochianas", lore: '"As Tábuas Elementais contêm os nomes de 91 Governadores que regem as 30 Iras da Terra." — Dee/Kelley', custoAcao: 3, custoSangue: 1500, reqLevel: 18, tipo: 'buff', grimorio: 'Magia Enochiana (1580)', efeito: (a, d, l) => { a.atributos.densidade += 3; a.atributos.vontade += 3; return `As Tábuas ressoaram. ${a.nome} fortalecido (+3 Dens, +3 Vont).`; } },
            'enoch_chamado': { nome: "Chamado Angélico (1ª Chave)", lore: '"OL SONF VORSG GOHO IAD BALT — Eu reino sobre vós, disse o Deus da Justiça." — Primeira Chave Enochiana', custoAcao: 2, custoSangue: 1000, reqLevel: 12, tipo: 'cura', grimorio: 'Magia Enochiana (1580)', efeito: (a, d, l) => { d.hpAtual = d.hpMax; d.pontosAcao = d.maxAcao; return `O Chamado Angélico restaurou completamente ${d.nome}!`; } },

            // ===== QLIPHOTH — ÁRVORE DA MORTE =====
            'qliphoth_thaumiel': { nome: "Descida a Thaumiel (Dualidade Satânica)", lore: '"Thaumiel é a coroa negra: a dualidade conflitante, o oposto de Kether. Moloch e Satanás reinam." — Hermetismo Qliphótico', custoAcao: 5, custoSangue: 5000, reqLevel: 50, tipo: 'pvp', grimorio: 'Árvore da Morte (Qliphoth)', efeito: (a, d, l) => { let dano = Math.floor((a.atributos.gnose + a.atributos.vontade) * 4); d.hpAtual = Math.max(0, d.hpAtual - dano); d.pontosAcao = 0; return `THAUMIEL DESTRUIU ${d.nome} (-${dano} HP, Fúria zerada)!`; } },
            'qliphoth_gamaliel': { nome: "Descida a Gamaliel (Lua Obscura)", lore: '"Gamaliel é o lado sombrio de Yesod. Lilith governa os sonhos e pesadelos da Lua Negra." — Qliphoth', custoAcao: 3, custoSangue: 2000, reqLevel: 30, tipo: 'pvp', grimorio: 'Árvore da Morte (Qliphoth)', efeito: (a, d, l) => { d.pontosAcao = Math.max(0, d.pontosAcao - 5); d.maxAcao = Math.max(3, d.maxAcao - 1); return `Gamaliel corrompeu os sonhos de ${d.nome} (-5 Fúria, -1 Max).`; } },
            'qliphoth_golachab': { nome: "Golachab (A Queimadura)", lore: '"Golachab é o fogo destruidor, a ira divina sem misericórdia. Os Demônios Queimadores habitam esta esfera." — Qliphoth', custoAcao: 4, custoSangue: 2500, reqLevel: 35, tipo: 'pvp', grimorio: 'Árvore da Morte (Qliphoth)', efeito: (a, d, l) => { let dano = Math.floor(a.atributos.vontade * 3 + a.nivel * 5); d.hpAtual = Math.max(0, d.hpAtual - dano); return `As chamas de Golachab queimaram ${d.nome} (-${dano} HP)!`; } },

            // ===== THELEMA (Aleister Crowley) =====
            'thelema_nuit': { nome: "Invocação de Nuit", lore: '"Cada homem e cada mulher é uma estrela. Não há Deus senão o Homem." — Liber AL vel Legis I:3', custoAcao: 2, custoSangue: 800, reqLevel: 10, tipo: 'buff', grimorio: 'Liber AL vel Legis (Thelema)', efeito: (a, d, l) => { a.atributos.magnetismo += 3; a.xp += 100; return `Nuit abençoou ${a.nome} como uma estrela (+3 Magnetismo, +100 XP).`; } },
            'thelema_hadit': { nome: "Invocação de Hadit", lore: '"Eu sou a chama que arde em cada coração e no centro de cada estrela." — Liber AL vel Legis II:6', custoAcao: 3, custoSangue: 1200, reqLevel: 15, tipo: 'buff', grimorio: 'Liber AL vel Legis (Thelema)', efeito: (a, d, l) => { a.atributos.vontade += 4; return `Hadit acendeu a chama de ${a.nome} (+4 Vontade).`; } },
            'thelema_ra_hoor': { nome: "Invocação de Ra-Hoor-Khuit", lore: '"Eu sou o Senhor Coroado e Conquistador! O meu número é 11, como todos os seus números." — Liber AL III:3', custoAcao: 4, custoSangue: 2000, reqLevel: 25, tipo: 'pvp', grimorio: 'Liber AL vel Legis (Thelema)', efeito: (a, d, l) => { let dano = Math.floor(a.atributos.vontade * 3); d.hpAtual = Math.max(0, d.hpAtual - dano); a.escudo = true; return `Ra-Hoor-Khuit destruiu ${d.nome} (-${dano} HP) e protegeu ${a.nome}!`; } },

            // ===== NECRONOMICON (Ficção Esotérica / H.P. Lovecraft / Simon) =====
            'necro_yog_sothoth': { nome: "Portal de Yog-Sothoth", lore: '"YOG-SOTHOTH é a Chave e o Guardião do Portal. Passado, presente e futuro são uma coisa só para Ele." — Necronomicon', custoAcao: 5, custoSangue: 4000, reqLevel: 45, tipo: 'especial', grimorio: 'Necronomicon', efeito: (a, d, l) => { a.atributos.gnose += 10; a.sangue += 2000; return `Yog-Sothoth abriu o Portal do Conhecimento (+10 Gnose, +2000 Gts)!`; } },
            'necro_azathoth': { nome: "Chamado de Azathoth", lore: '"Azathoth, o Sultão Demoníaco que reside no Centro do Caos Nuclear." — Necronomicon / Lovecraft', custoAcao: 5, custoSangue: 5000, reqLevel: 55, tipo: 'pvp', grimorio: 'Necronomicon', efeito: (a, d, l) => { let dano = Math.floor((a.atributos.gnose + a.nivel) * 5); d.hpAtual = Math.max(0, d.hpAtual - dano); return `O Caos Nuclear de Azathoth destroçou ${d.nome} (-${dano} HP)!`; } },

            // ===== MAGIA DO SANGUE REAL =====
            'sangue_transfusao': { nome: "Transfusão Sanguínea Ritual", lore: 'O mais antigo dos ritos vampíricos: a troca direta de sangue entre mestre e neófito, selando um laço eterno.', custoAcao: 2, custoSangue: 500, reqLevel: 5, tipo: 'cura', grimorio: 'Tradição Vampírica', efeito: (a, d, l) => { let transf = Math.min(a.sangue, 500); a.sangue -= transf; d.sangue += transf; d.hpAtual = Math.min(d.hpMax, d.hpAtual + 300); return `${a.nome} transfundiu ${transf} Gts de sangue para ${d.nome} (+300 HP).`; } },
            'sangue_batismo': { nome: "Batismo de Sangue", lore: 'Mergulhar o neófito num cálice de sangue. O renascimento pela escuridão. A carne morre, o imortal desperta.', custoAcao: 3, custoSangue: 1000, reqLevel: 12, tipo: 'buff', grimorio: 'Tradição Vampírica', efeito: (a, d, l) => { d.atributos.densidade += 2; d.atributos.vontade += 2; d.hpAtual = d.hpMax; return `${d.nome} renasceu pelo Batismo de Sangue (+2 Dens, +2 Vont, HP Max).`; } },
            'sangue_drenagem': { nome: "Drenagem Astral", lore: 'A arte suprema: drenar não o corpo mas a alma do adversário. O sangue astral é mais nutritivo que o físico.', custoAcao: 4, custoSangue: 2000, reqLevel: 25, tipo: 'pvp', grimorio: 'Tradição Vampírica', efeito: (a, d, l) => { let dreno = Math.floor(d.sangue * 0.15); d.sangue -= dreno; a.sangue += dreno; a.hpAtual = Math.min(a.hpMax, a.hpAtual + dreno); return `${a.nome} drenou ${dreno} Gts da alma de ${d.nome}!`; } },
            'sangue_corte_ritual': { nome: "Corte Ritual do Pacto", lore: 'Abrir as veias sobre o sigilo traçado em sangue. A dor é a chave, o sacrifício é a porta. Magia de sangue ancestral.', custoAcao: 2, custoSangue: 800, reqLevel: 8, tipo: 'buff', grimorio: 'Tradição Vampírica', efeito: (a, d, l) => { a.atributos.vontade += 2; a.influencia += 8; return `O Corte Ritual selou o poder de ${a.nome} (+2 Vontade, +8 Inf).`; } },
            'sangue_calice_comunhao': { nome: "Comunhão do Cálice Negro", lore: 'Todos os membros do clã bebem do mesmo cálice. O sangue misturado cria um laço psíquico inquebrável.', custoAcao: 1, custoSangue: 300, reqLevel: 5, tipo: 'cura', grimorio: 'Tradição Vampírica', efeito: (a, d, l) => { d.hpAtual = Math.min(d.hpMax, d.hpAtual + 600); d.pontosAcao = Math.min(d.maxAcao, d.pontosAcao + 2); return `O Cálice Negro restaurou ${d.nome} (+600 HP, +2 Fúria).`; } }
        };
        this.grimorioCustomizado = {};
 
        this.alquimia = {
            'elixir_estamina': { nome: 'Filtro do Frenesi', custo: { anima: 2, vitae: 1, gts: 300 }, efeito: 'Restaura 5 Fúria.' },
            'amuleto_sombra': { nome: 'Talismã Protetor', custo: { cinzas: 3, ectoplasma: 1, gts: 500 }, efeito: 'Garante Escudo.' },
            'lagrima_prata': { nome: 'Lágrima de Prata', custo: { cinzas: 2, vitae: 3, gts: 1000 }, efeito: 'Restaura 1 Fúria.' }
        };
        this.conquistas = {
            'neofito': { id: 'neofito', titulo: 'Neófito Sedento', requisito: v => (v.estatisticas?.totalDrenado || 0) >= 100 },
            'mestre_guerras': { id: 'mestre_guerras', titulo: 'Lâmina do Abismo', requisito: v => (v.estatisticas?.vitoriasPvP || 0) >= 10 },
            'lorde_supremo': { id: 'lorde_supremo', titulo: 'Senhor do Véu Rasgado', requisito: v => (v.nivel || 1) >= 50 }
        };
    }

    // ==========================================
    // PILAR 4: SINERGIA GLOBAL: BUFFS DOS REINOS E CLÃS
    // ==========================================
    _aplicarSinergiaDoReino(vampiro, atributosBase) {
        if (vampiro.clan === 'Sangue Ralo') return atributosBase;
        const clan = this.clans[vampiro.clan];
        if (!clan || !clan.reino) return atributosBase;
        const reino = this.reinos[clan.reino];
        if (!reino) return atributosBase;

        const bMuralha = reino.edificacoes.muralha * 5; 
        const bTorre = reino.edificacoes.torreSangue * 5; 
        vampiro.descontoReino = reino.edificacoes.mercadoNegro * 0.05; 

        atributosBase.densidade += bMuralha;
        atributosBase.gnose += bTorre;
        return atributosBase;
    }

    // ==========================================
    // PILAR 2: O NÊMESIS (A INQUISIÇÃO)
    // ==========================================
    _verificarInquisicao(vampiro) {
        if (vampiro.estatisticas.mortaisSecos > 0 && vampiro.estatisticas.mortaisSecos % 15 === 0) {
            let hpInquisidor = 10000 + (vampiro.nivel * 1000);
            this.batalhasPvE[vampiro.id] = { 
                hpMax: hpInquisidor, hpAtual: hpInquisidor, 
                rank: "Inquisidor Nêmesis", mult: 5.0, loot: 'pedraAlma', 
                nome: `🛡️ Cruzado da Ordem Solar` 
            };
            vampiro.maldicaoInquisicao = true; 
            this._registrarEventoEspecial('global', 'A CRUZADA DESPERTA', `O massacre de ${vampiro.nome} chamou a atenção da Igreja. O Fogo Solar persegue-o.`, true);
            return true;
        }
        return false;
    }

    // ==========================================
    // PILAR 1: O LOOP INFINITO (OUROBOROS)
    // ==========================================
    realizarRitoOuroboros(vampiroId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Fantasma." };
        if (v.nivel < 100) return { erro: "O Rito da Serpente exige Grau 100 (O Auge)." };

        v.nivel = 1;
        v.xp = 0;
        v.xpProx = 100;
        if (v.geracao > 2) v.geracao -= 1; 
        
        v.multiplicadorOuroboros = (v.multiplicadorOuroboros || 1) + 0.5;
        
        v.bolsa = []; // Sacrifício
        v.sangue = 1000;
        v.pontosAcao = v.maxAcao;

        v.titulos.push(`Ancião de ${v.multiplicadorOuroboros} Ciclos`);
        v.tituloAtual = `Ancião de ${v.multiplicadorOuroboros} Ciclos`;

        this._registrarEventoEspecial('global', 'OUROBOROS', `A serpente mordeu a cauda! [${v.nome}] sacrificou o seu império para renascer com Sangue Absoluto (Geração ${v.geracao}).`, true);
        this._salvarBancoDeDados();
        
        return { sucesso: true, relato: "Tudo foi pó. Renasceste como um verdadeiro Ancião." };
    }

    // ==========================================
    // ALGORITMO OCULTO: CRIPTOGRAFIA DA DENSIDADE SANGUÍNEA
    // ==========================================
    _validarDensidadeSanguinea(vampiro) {
        if (typeof vampiro.sangue !== 'number' || isNaN(vampiro.sangue)) vampiro.sangue = 0;
        if (typeof vampiro.calice !== 'number' || isNaN(vampiro.calice)) vampiro.calice = 0;
        vampiro.sangue = Math.max(0, Math.floor(vampiro.sangue));
        vampiro.calice = Math.max(0, Math.floor(vampiro.calice));
    }

    operarCalice(vampiroId, quantia, op) {
        try {
            const v = this.vampiros[vampiroId]; 
            if(!v) return { erro: "O Cálice rejeita fantasmas." };
            
            let q = Math.floor(Number(quantia)); 
            if(isNaN(q) || q <= 0) return { erro: "A densidade deste sangue é falsa. Quantia profana." };
            
            this._validarDensidadeSanguinea(v);

            if (op === 'depositar') {
                if(v.sangue < q) return { erro: "Não possuis vitalidade suficiente na carne para este sacrifício." };
                v.sangue -= q; 
                v.calice += q;
            } else if (op === 'sacar') {
                if(v.calice < q) return { erro: "O Cálice Negro não detém essa quantidade de Gts." };
                v.calice -= q; 
                v.sangue += q;
            } else {
                return { erro: "Rito bancário desconhecido." };
            }
            
            this._salvarBancoDeDados(); 
            return { sucesso: true, relato: `O Cristal ressoou. Transmutaste ${q} Gts.` };
        } catch (e) {
            return { erro: "As veias da Matriz colapsaram internamente." };
        }
    }

    transferirSangue(remetenteId, alvoId, quantia) {
        try {
            const r = this.vampiros[remetenteId]; 
            const a = this.vampiros[alvoId];
            if(!r || !a) return { erro: "O vínculo astral falhou. Presa ou Doador não encontrados." };
            
            let q = Math.floor(Number(quantia)); 
            if(isNaN(q) || q <= 0) return { erro: "A Oferenda está vazia." };
            
            this._validarDensidadeSanguinea(r);
            this._validarDensidadeSanguinea(a);

            if(r.sangue < q) return { erro: "Vitalidade insuficiente no teu próprio corpo." };
            
            // >>> O TOQUE DA MAGIA REAL AQUI <<<
            // O Lexicon calcula o volume verdadeiro que chega à presa baseado na entropia
            const transmutacao = Lexicon.TransmutarVitae(q, remetenteId, alvoId);
            
            r.sangue -= q; // O remetente perde o que declarou
            a.sangue += transmutacao.volume; // O alvo recebe o que a magia permitiu!
            
            let msgExtra = transmutacao.volume > q ? 
                ` A pureza do rito multiplicou o sangue (+${transmutacao.volume - q} Gts extra).` : 
                (transmutacao.volume < q ? ` A travessia no Umbral dissipou parte da oferenda.` : ` Pureza Oculta: ${transmutacao.pureza}`);

            if(global.io) {
                global.io.to(`priv_${a.id}`).emit('nova_mensagem', { 
                    canal: 'privado', 
                    autor: `🩸 DONATIVO DE SANGUE`, 
                    texto: `As tuas veias arderam. Recebeste ${transmutacao.volume} Gts de Vitalidade transmutada do mestre ${r.nome}.${msgExtra}`, 
                    hora: new Date().toLocaleTimeString() 
                });
            }
            
            this._salvarBancoDeDados(); 
            return { sucesso: true, relato: `Injetaste a intenção de ${q} Gts na malha. ${msgExtra}` };
        } catch (e) {
            return { erro: "Interferência sombria no fluxo vital." };
        }
    }

    operarCofreClan(vampiroId, quantia, op) {
        try {
            const v = this.vampiros[vampiroId]; 
            if(!v || v.clan === 'Sangue Ralo') return { erro: "Apenas membros de um Santuário podem tocar no ouro." };
            const c = this.clans[v.clan]; 
            if(!c) return { erro: "Clã fantasma." };
            
            let q = Math.floor(Number(quantia)); 
            if(isNaN(q) || q <= 0) return { erro: "Quantia nula ou corrompida." };
            
            this._validarDensidadeSanguinea(v);
            if (typeof c.cofre !== 'number' || isNaN(c.cofre)) c.cofre = 0;
            
            if (op === 'depositar') {
                if(v.sangue < q) return { erro: "Sangue insuficiente na tua carne." };
                v.sangue -= q; 
                c.cofre += q;
            } else if (op === 'sacar') {
                if(v.clanRole !== 'lider' && v.clanRole !== 'vigario') return { erro: "Apenas Hierofantes e Vigários podem tocar no Ouro do Santuário." };
                if(c.cofre < q) return { erro: "O cofre esvaiu-se." };
                c.cofre -= q; 
                v.sangue += q;
            }
            
            this._salvarBancoDeDados(); 
            return { sucesso: true, relato: `As engrenagens do Santuário moveram-se. (${op.toUpperCase()} de ${q} Gts)` };
        } catch (e) {
            return { erro: "A magia do cofre dissipou-se." };
        }
    }

    aprimorarEquipamento(vampiroId, slot) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        const item = v.equipamentos[slot];
        if (!item) return { erro: "A fenda astral do teu corpo está vazia." };
        if (item.aprimoramento >= 20) return { erro: "A matéria chegou ao limite cósmico absoluto (Nível 20)." };
        
        const custoAnima = Math.floor(Math.pow(1.6, item.aprimoramento) * 5); 
        const custoCinzas = Math.floor(Math.pow(1.5, item.aprimoramento) * 3);
        const custoGts = Math.floor(Math.pow(1.8, item.aprimoramento) * 500);

        if ((v.inventario.anima || 0) < custoAnima || (v.inventario.cinzas || 0) < custoCinzas || v.sangue < custoGts) {
            return { erro: `A Forja Draconiana exige sacrifício massivo: ${custoAnima} Anima, ${custoCinzas} Cinzas e ${custoGts} Gts de Sangue.` };
        }

        v.inventario.anima -= custoAnima; v.inventario.cinzas -= custoCinzas; v.sangue -= custoGts;
        
        if (typeof item.aprimoramento !== 'number' || isNaN(item.aprimoramento)) item.aprimoramento = 0;
        item.aprimoramento += 1;
        
        item.nome = item.nome.replace(/\s\(\+[0-9]+\)/g, '') + ` (+${item.aprimoramento})`;
        
        if (!item.bonusBase) item.bonusBase = { ...item.bonus }; 
        if (!item.bonus) item.bonus = {};
        
        for(let a in item.bonusBase) { 
            let valBase = parseInt(item.bonusBase[a]) || 0;
            if (valBase > 0) item.bonus[a] = Math.floor(valBase * Math.pow(1.2, item.aprimoramento)); 
        }
        
        this.ganharXP(vampiroId, 150 * item.aprimoramento); this._salvarBancoDeDados();
        return { sucesso: true, relato: `A Bigorna Sombria estalou! ${item.nome} obteve novo poder oculto.` };
    }

    fabricarAlquimia(vampiroId, receitaId) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Alma inexistente." };
        const receita = this.alquimia[receitaId]; if (!receita) return { erro: "Fórmula desconhecida." };
        
        for (let req in receita.custo) {
            if (req === 'gts') { if (v.sangue < receita.custo.gts) return { erro: `Requer ${receita.custo.gts} Gts.` }; }
            else if ((v.inventario[req] || 0) < receita.custo[req]) return { erro: `Requer ${receita.custo[req]}x de ${req}.` };
        }
        for (let req in receita.custo) {
            if (req === 'gts') v.sangue -= receita.custo.gts;
            else v.inventario[req] -= receita.custo[req];
        }
        
        if(receitaId === 'elixir_estamina') v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + 5);
        if(receitaId === 'amuleto_sombra') v.escudo = true;
        if(receitaId === 'lagrima_prata') v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + 1);
        
        this._salvarBancoDeDados(); 
        return { sucesso: true, relato: `Transmutação bem-sucedida. Efeito ativado: ${receita.efeito}` };
    }

    anunciarLeilao(vampiroId, tipo, quantiaOuHash, preco) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        const p = parseInt(preco); if (isNaN(p) || p <= 0) return { erro: "Tributo de Gts inválido." };
        let itemObj = null, nomeMortal = null;
        
        if (tipo === 'mortal') {
            const m = this.rebanho[quantiaOuHash]; if (!m) return { erro: "Alma não encontrada." };
            if (!m.maldicaoArcana || m.maldicaoArcana.donoId !== v.id) return { erro: "Não possuis o selo desta alma." };
            m.estado = 'No Leilao'; nomeMortal = m.identificadorVisivel;
        } else if (tipo === 'reliquia') {
            const idx = v.bolsa.findIndex(i => i.id === quantiaOuHash); if (idx === -1) return { erro: "Artefato ausente da tua bolsa." };
            itemObj = v.bolsa.splice(idx, 1)[0];
        } else {
            const q = parseInt(quantiaOuHash); if (isNaN(q) || q <= 0 || (v.inventario[tipo] || 0) < q) return { erro: "Estoque profano insuficiente." };
            v.inventario[tipo] -= q;
        }
        
        const anuncio = { id: this.leilaoIdCounter++, vendedorId: v.id, vendedorNome: v.nome, tipo, quantia: parseInt(quantiaOuHash), preco: p, itemObj, nomeMortal, hashMortal: tipo === 'mortal' ? quantiaOuHash : null };
        this.leilaoP2P.push(anuncio); this._salvarBancoDeDados(); return { sucesso: true, relato: "Trato pendurado no Éter." };
    }

    comprarLeilao(vampiroId, anuncioId) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        const idx = this.leilaoP2P.findIndex(a => a.id === anuncioId); if (idx === -1) return { erro: "O trato sumiu nas brumas." };
        const a = this.leilaoP2P[idx]; if (v.sangue < a.preco) return { erro: `O Leiloeiro de Almas exige ${a.preco} Gts.` };
        
        v.sangue -= a.preco; const vend = this.vampiros[a.vendedorId]; if (vend) vend.sangue += a.preco;
        
        if (a.tipo === 'mortal' || a.tipo === 'alma_humana') { 
            const m = this.rebanho[a.hashMortal]; 
            if (m) { 
                m.estado = 'Vibrante'; 
                m.maldicaoArcana = { selo: 'comprado', donoId: v.id, donoNome: v.nome }; 
            }
            if (a.dadosAlvo) {
                if (!v.alvosNosferatu) v.alvosNosferatu = [];
                const clone = Object.assign({}, a.dadosAlvo, {
                    estadoAstral: `Sob jugo de ${v.nome}`,
                    dataTransferencia: Date.now(),
                    mestreAnterior: a.vendedorNome
                });
                v.alvosNosferatu.push(clone);
                const vend = this.vampiros[a.vendedorId];
                if (vend && vend.alvosNosferatu) {
                    const vIdx = vend.alvosNosferatu.findIndex(x => x.alvoId === a.hashMortal);
                    if (vIdx >= 0) vend.alvosNosferatu.splice(vIdx, 1);
                }
            }
        }
        else if (a.tipo === 'reliquia') { v.bolsa.push(a.itemObj); }
        else { v.inventario[a.tipo] = (v.inventario[a.tipo] || 0) + a.quantia; }
        
        this.leilaoP2P.splice(idx, 1); this._salvarBancoDeDados(); return { sucesso: true, relato: "Selo de Sangue fechado. A oferta é tua." };
    }

    fundarClan(vampiroId, nome) {
        const v = this.vampiros[vampiroId]; if(!v) return {erro:"Fantasma."};
        if(v.clan !== 'Sangue Ralo') return {erro:"Já serves um Pacto."};
        if(v.sangue < 2000) return {erro:"O Altar exige 2000 Gts de sacrifício."};
        for(let c in this.clans) if(this.clans[c].nome.toLowerCase() === nome.toLowerCase()) return {erro:"Esse Egrégora já existe."};
        
        v.sangue -= 2000;
        this.clans[nome] = { nome: nome, lider: v.id, liderNome: v.nome, membros: [v.id], cofre: 0, egregora: {nivel: 1, xp: 0} };
        v.clan = nome; v.clanRole = 'lider';
        this._registrarEventoEspecial('global', 'SANTUÁRIO ERGUIDO', `[${v.nome}] fundou a Ordem Escura: ${nome}!`, true);
        this._salvarBancoDeDados(); return {sucesso:true, relato:"Egrégora manifestada na realidade."};
    }

    nutrirEgregoraClã(vampiroId, material) {
        const v = this.vampiros[vampiroId]; if(!v || v.clan === 'Sangue Ralo') return {erro:"Sem Clã."};
        const c = this.clans[v.clan]; if(!c) return {erro:"Clã fantasma."};
        if((v.inventario[material] || 0) < 1) return {erro:`A tua bolsa não possui [${material}].`};
        
        v.inventario[material] -= 1;
        let xpGanha = material === 'ectoplasma' ? 50 : 200;
        c.egregora.xp += xpGanha;
        if(c.egregora.xp > c.egregora.nivel * 500) { c.egregora.nivel++; c.egregora.xp = 0; }
        this._salvarBancoDeDados(); return {sucesso:true, relato:`A Egrégora do Clã devorou a oferenda. Poder Atual: Nível ${c.egregora.nivel}`};
    }
	
	// ==========================================
    // MOTOR PROCEDURAL DO ABISMO (DUNGEON CRAWLER 2D)
    // ==========================================
    _gerarGridMasmorra(largura, altura, nivel) {
        let grid = Array(altura).fill(0).map(() => Array(largura).fill(0)); // 0 = Parede, 1 = Chão
        let salas = [];
        const numSalas = 5 + Math.floor(Math.random() * (nivel / 2));
        
        // Algoritmo de Geração de Salas
        for(let i=0; i<numSalas; i++) {
            let w = Math.floor(Math.random() * 5) + 3; 
            let h = Math.floor(Math.random() * 5) + 3;
            let x = Math.floor(Math.random() * (largura - w - 2)) + 1;
            let y = Math.floor(Math.random() * (altura - h - 2)) + 1;
            
            for(let row=y; row<y+h; row++) {
                for(let col=x; col<x+w; col++) { grid[row][col] = 1; }
            }
            let centro = { x: Math.floor(x + w/2), y: Math.floor(y + h/2) };
            salas.push(centro);
            
            // Conectar com a sala anterior (Corredores)
            if (i > 0) {
                let ant = salas[i-1];
                let curX = ant.x; let curY = ant.y;
                while(curX !== centro.x) { grid[curY][curX] = 1; curX += (centro.x > curX ? 1 : -1); }
                while(curY !== centro.y) { grid[curY][curX] = 1; curY += (centro.y > curY ? 1 : -1); }
            }
        }
        return { grid, salas };
    }
    // ==========================================
    // MAGIA OCULTA: VÍNCULO ASTRAL E DRENO DE HUMANOS REAIS
    // ==========================================
	
	async despertarMagiaCombate(vampiroId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma inexistente." };

        if (!v.colecaoHabilidades) v.colecaoHabilidades = [];
        if (!v.habilidadesAtivas) v.habilidadesAtivas = [];

        // LIMITES DINÂMICOS: 1 Magia a cada 10 Níveis + 1 por cada Conquista Desbloqueada
        let limiteMagias = Math.max(1, Math.floor(v.nivel / 10) + (v.conquistas ? v.conquistas.length : 0));
        if (v.colecaoHabilidades.length >= limiteMagias) {
            return { erro: `A tua mente já não suporta mais grimórios (Limite: ${limiteMagias}). Atinge o Grau ${(v.colecaoHabilidades.length + 1) * 10} ou adquire novas Conquistas para expandir a tua capacidade.` };
        }

        // CUSTOS ESCALONADOS: Mais magias possuis, mais caro fica.
        let custoGts = 3000 + (v.colecaoHabilidades.length * 2000);
        let custoFuria = 5 + (v.colecaoHabilidades.length * 2);

        if (v.sangue < custoGts || v.pontosAcao < custoFuria) {
            return { erro: `A Mente Abissal exige um tributo maior agora: ${custoGts} Gts e ${custoFuria} Fúrias.` };
        }

        v.sangue -= custoGts; v.pontosAcao -= custoFuria;
        
        const magia = await this.oraculo.forjarMagiaCombateUnica(v);
        
        // Se a IA alucinar e enviar um JSON corrompido, devolvemos o dinheiro
        if (!magia || !magia.nome || !magia.tipo) {
            v.sangue += custoGts; v.pontosAcao += custoFuria; 
            return { erro: "A IA colapsou nas sombras. O teu Ouro foi devolvido. Tenta novamente." };
        }
        
        // Garante a existência de custos base para não crashar na Arena
        if (!magia.id) magia.id = crypto.randomBytes(4).toString('hex');
        magia.custoGts = Math.floor(magia.custoGts || (v.nivel * 50));
        magia.custoFuria = Math.floor(magia.custoFuria || 2);
        
        v.colecaoHabilidades.push(magia);
        this._salvarBancoDeDados();
        return { sucesso: true, relato: `A Mente Abissal forjou a magia: [${magia.nome}]!\nPodes equipá-la no Grimório.` };
    }

    equiparMagiaAtiva(vampiroId, magiaId) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        if (!v.habilidadesAtivas) v.habilidadesAtivas = [];
        
        if (v.habilidadesAtivas.some(h => h.id === magiaId)) {
            v.habilidadesAtivas = v.habilidadesAtivas.filter(h => h.id !== magiaId);
            this._salvarBancoDeDados(); return { sucesso: true, relato: "Magia desequipada." };
        }
        
        if (v.habilidadesAtivas.length >= 4) return { erro: "A tua mente só suporta 4 magias ativas." };
        
        const mag = v.colecaoHabilidades.find(h => h.id === magiaId);
        if (!mag) return { erro: "Magia não encontrada." };
        
        v.habilidadesAtivas.push(mag);
        this._salvarBancoDeDados(); return { sucesso: true, relato: `[${mag.nome}] equipada para combate!` };
    }
	
    async drenarRebanho(vampiroId, hashAlvo, intensidadeStr) {
        try {
            const v = this.vampiros[vampiroId];
            if (!v) return { erro: "O Abismo não te reconhece." };

            const alvo = this.rebanho[hashAlvo];
            if (!alvo) return { erro: "O Fio de Prata rompeu-se. A vítima desvaneceu da Matriz." };

            let custoFuria = 0; let drenoGts = 0;
            
            // Cálculos da Magia Antiga
            if (intensidadeStr === 'toque') { custoFuria = 1; drenoGts = 50; }
            else if (intensidadeStr === 'profundo') { custoFuria = 2; drenoGts = 200; }
            else if (intensidadeStr === 'letal') { custoFuria = 3; drenoGts = alvo.sangueAtual; }
            else { custoFuria = 1; drenoGts = 50; } 

            if (v.pontosAcao < custoFuria) return { erro: `Este rito negro exige ${custoFuria} de Fúria.` };
            if (alvo.sangueAtual <= 0) return { erro: "O corpo desta presa já é pó. Não há mais Vitae." };

            drenoGts = Math.min(drenoGts, alvo.sangueAtual); // Nunca suga mais do que o limite

            // Transmutação de Atributos
            v.pontosAcao -= custoFuria;
            alvo.sangueAtual -= drenoGts;
            v.sangue += drenoGts;
            
            if (!v.estatisticas) v.estatisticas = {};
            v.estatisticas.totalDrenado = (v.estatisticas.totalDrenado || 0) + drenoGts;

            let magiaUsada = intensidadeStr === 'letal' ? "Sangria Macabra" : "Dreno Umbral";
            let msgFinal = `[${magiaUsada}]: Absorveste +${drenoGts} Gts de ${alvo.identificadorVisivel} através do Vínculo.`;

            // SE A VÍTIMA REAL FOR SECA ATÉ À MORTE
            if (alvo.sangueAtual <= 0) {
                alvo.estado = "Morto";
                v.estatisticas.mortaisSecos = (v.estatisticas.mortaisSecos || 0) + 1;
                
                // Registo Oculto - enviamos com a flag categoria: 'oculto'
                this._registrarEventoEspecial('oculto', 'VÍTIMA REAL ANIQULADA', `[${v.nome}] executou o Vínculo Astral e obliterou a essência de um humano real.`, true);
                
                // A IA gera a Lore Sombria (Mas o front-end esconderá dos fracos)
                let lore = await this.oraculo.gerarNarrativaProcedural("Vínculo Astral", `O vampiro bebeu até à última gota através da rede de almas.`, "Horror cósmico, letal");
                this.logs.global.unshift({ tipo: 'DRENO REAL', relato: lore, hora: new Date().toLocaleTimeString(), categoria: 'oculto' });
            }

            this._salvarBancoDeDados();
            return { sucesso: true, relato: msgFinal };
        } catch (e) {
            console.error("[ERRO VÍNCULO ASTRAL]:", e);
            return { erro: "As anomalias do Vazio rejeitaram o dreno." };
        }
    }
    async iniciarAventura(liderId, tipo) {
        const lider = this.vampiros[liderId]; if(!lider) return {erro:"Alma não encontrada."};
        if (lider.pontosAcao < 2) return {erro:"O Abismo exige pelo menos 2 Fúrias para descer."};
        if (!this.dungeons) this.dungeons = {};

        const andar = 1;
        const dId = `abismo_andar_${andar}`; // MUNDO ABERTO (Todos no mesmo andar cruzam-se)
        const partyId = crypto.randomBytes(4).toString('hex'); // Fio vermelho que liga os aliados
        
        if (!this.dungeons[dId]) {
            const mapa = this._gerarGridMasmorra(35, 35, andar);
            let entidades = [];
            entidades.push({ id: 'exit', tipo: 'exit', x: mapa.salas[mapa.salas.length - 1].x, y: mapa.salas[mapa.salas.length - 1].y });
            // GERADOR DE ENTIDADES (CURVA EXPONENCIAL DE DIFICULDADE)
            for (let i = 1; i < mapa.salas.length - 1; i++) {
                if (Math.random() > 0.3) {
                    // Andar 1: ~300 HP. Andar 10: ~1200 HP. Andar 20: ~5000 HP.
                    let hpMob = Math.floor(300 * Math.pow(1.15, andar - 1));
                    entidades.push({ id: 'mob_'+i, tipo: 'mob', x: mapa.salas[i].x, y: mapa.salas[i].y, hpMax: hpMob, hpAtual: hpMob, nome: `Aberraçao Nv.${andar}` });
                }
                if (Math.random() > 0.6) entidades.push({ id: 'loot_'+i, tipo: 'loot', x: mapa.salas[i].x + 1, y: mapa.salas[i].y, recompensa: Math.random() > 0.5 ? 'anima' : 'cinzas' });
            }
            
            // Andar 1: ~1000 HP. Andar 10: ~7400 HP. Andar 20: ~69000 HP. (Escala Brutal)
            let hpBoss = Math.floor(1000 * Math.pow(1.25, andar - 1));
            entidades.push({ id: 'boss_'+andar, tipo: 'boss', x: mapa.salas[mapa.salas.length - 1].x - 1, y: mapa.salas[mapa.salas.length - 1].y, hpMax: hpBoss, hpAtual: hpBoss, nome: `Senhor do Andar ${andar}` });
            entidades.push({ id: 'boss_'+andar, tipo: 'boss', x: mapa.salas[mapa.salas.length - 1].x - 1, y: mapa.salas[mapa.salas.length - 1].y, hpMax: 5000 * andar, hpAtual: 5000 * andar, nome: `Senhor do Andar ${andar}` });

            this.dungeons[dId] = {
                id: dId, andar: andar, grid: mapa.grid, entidades: entidades, players: {},
                largura: 35, altura: 35, atmosfera: "O cheiro a cinzas e morte inunda os teus pulmões.", status: 'explorando'
            };
        }

        const d = this.dungeons[dId];
        let spawn = { x: 2, y: 2 };
        for (let y = 1; y < d.altura; y++) { for (let x = 1; x < d.largura; x++) { if (d.grid[y][x] === 1) { spawn = { x, y }; break; } } }

        d.players[liderId] = { id: liderId, nome: lider.nome, x: spawn.x, y: spawn.y, cor: '#0f5', partyId: partyId };
        lider.pontosAcao -= 2;

        if(global.io) {
            global.io.to(dId).emit('dungeon_msg', { msg: `Um Imortal desceu ao Andar ${andar}.`, cor: '#555' });
            global.io.to(dId).emit('dungeon_update', d); // <--- ISTO OBRIGA A TELA A ATUALIZAR PARA TODOS
        }
        this._salvarBancoDeDados();
        return { sucesso: true, dungeonId: dId, estado: d, partyId: partyId };
    }

    entrarAventura(playerId, dungeonId, partyId) {
		if (!this.dungeons) this.dungeons = {}; 
        const v = this.vampiros[playerId]; if(!v) return {erro: "Fantasma."};
        const d = this.dungeons[dungeonId]; if(!d) return {erro: "O líder ainda não abriu o portal ou a masmorra colapsou."};

        let spawn = { x: 2, y: 2 };
        for (let y = 1; y < d.altura; y++) { for (let x = 1; x < d.largura; x++) { if (d.grid[y][x] === 1) { spawn = { x, y }; break; } } }

        const cores = ['#0f5', '#5985c5', '#d4af37', '#d080ff', '#ff1e2f'];
        const corEscolhida = cores[Object.keys(d.players).length % cores.length];

        d.players[playerId] = { id: playerId, nome: v.nome, x: spawn.x, y: spawn.y, cor: corEscolhida, partyId: partyId };

        if(global.io) global.io.to(dungeonId).emit('dungeon_msg', { msg: `[${v.nome}] aceitou o Convite de Sangue e juntou-se ao massacre.`, cor: '#0f5' });
        if(global.io) global.io.to(dungeonId).emit('dungeon_update', d);
        
        return { sucesso: true, estado: d };
    }
   moverMasmorra(dungeonId, playerId, dx, dy) {
        if (!this.dungeons) this.dungeons = {}; // Trava de segurança
        const d = this.dungeons[dungeonId]; 
        if (!d || d.status === 'combate') return { erro: "Masmorra trancada." };
        
        const p = d.players[playerId]; 
        if (!p) return { erro: "Não estás nesta dimensão." };

        let nx = p.x + dx; let ny = p.y + dy;
        if (nx < 0 || ny < 0 || nx >= d.largura || ny >= d.altura || d.grid[ny][nx] === 0) return { estado: d };
        
        // Move o jogador
        p.x = nx; p.y = ny;

        // 1. VERIFICA COLISÃO COM JOGADORES INIMIGOS (PVP MASSIVO OPEN WORLD)
        let inimigoPvp = Object.values(d.players).find(p2 => p2.x === nx && p2.y === ny && p2.partyId !== p.partyId);
        if (inimigoPvp) {
            let partyA = Object.values(d.players).filter(p1 => p1.partyId === p.partyId);
            let partyB = Object.values(d.players).filter(p2 => p2.partyId === inimigoPvp.partyId);
            
            // Dispara o Evento de Guerra
            if(global.io) global.io.to(dungeonId).emit('dungeon_pvp_start', { partyA, partyB, dungeonId: d.id });
            return { estado: d, bloqueado: true };
        }

        // 2. VERIFICA COLISÃO COM ENTIDADES PVE (Loot, Monstros e Saída)
        let ent = d.entidades.find(e => e.x === nx && e.y === ny);
        if (ent) {
            if (ent.tipo === 'loot') {
                const v = this.vampiros[playerId]; 
                v.inventario[ent.recompensa] = (v.inventario[ent.recompensa] || 0) + 1;
                d.entidades = d.entidades.filter(e => e.id !== ent.id); 
                this._salvarBancoDeDados();
                if(global.io) global.io.to(dungeonId).emit('dungeon_msg', { msg: `[${p.nome}] encontrou 1x ${ent.recompensa.toUpperCase()}!`, cor: '#0f5' });
            } 
            else if (ent.tipo === 'mob' || ent.tipo === 'boss') {
                d.entidadeEmCombate = ent;
                d.status = 'combate'; // <--- CORREÇÃO CRÍTICA: Impede o bot de re-atacar o mesmo boss infinitamente
                
                // NOTIFICAÇÃO SÍNCRONA: Puxa todos os aliados da party para a mesma tela de boss!
                const aliados = Object.values(d.players).filter(pl => pl.partyId === p.partyId);
                aliados.forEach(aliado => {
                    if(global.io) {
                        global.io.to(`priv_${aliado.id}`).emit('dungeon_combat_start', { 
                            nome: ent.nome, 
                            hpMax: ent.hpMax, 
                            isBoss: ent.tipo === 'boss',
                            entidadeId: ent.id,
                            partyId: p.partyId
                        });
                    }
                });

                return { estado: d, iniciarCombate: true, entidade: ent };
            }
            // ==========================================
            // GATILHO DE PROGRESSÃO: DESCER NÍVEL
            // ==========================================
            else if (ent.tipo === 'exit') {
                // Opcional: Bloquear saída se ainda houver mobs vivos
                const mobsVivos = d.entidades.filter(e => e.tipo === 'mob' || e.tipo === 'boss');
                if (mobsVivos.length > 0) {
                    return { estado: d, erro: "O selo do andar só rompe quando o último inimigo cair." };
                }

                d.andar += 1;
                // REGERAÇÃO PROCEDURAL PARA O PRÓXIMO ANDAR
                const novoMapa = this._gerarGridMasmorra(35, 35, d.andar);
                d.grid = novoMapa.grid;
                d.entidades = []; // Limpa o andar antigo

                // Repovoar entidades (Escala exponencial de HP que ajustamos antes)
                d.entidades.push({ id: 'exit', tipo: 'exit', x: novoMapa.salas[novoMapa.salas.length - 1].x, y: novoMapa.salas[novoMapa.salas.length - 1].y });
                for (let i = 1; i < novoMapa.salas.length - 1; i++) {
                    if (Math.random() > 0.3) {
                        let hpMob = Math.floor(300 * Math.pow(1.15, d.andar - 1));
                        d.entidades.push({ id: `mob_${d.andar}_${i}`, tipo: 'mob', x: novoMapa.salas[i].x, y: novoMapa.salas[i].y, hpMax: hpMob, hpAtual: hpMob, nome: `Aberraçao Nv.${d.andar}` });
                    }
                }
                
                let hpBoss = Math.floor(1000 * Math.pow(1.25, d.andar - 1));
                d.entidades.push({ id: `boss_${d.andar}`, tipo: 'boss', x: novoMapa.salas[novoMapa.salas.length - 1].x - 1, y: novoMapa.salas[novoMapa.salas.length - 1].y, hpMax: hpBoss, hpAtual: hpBoss, nome: `Senhor do Andar ${d.andar}` });

                // Reposiciona todos os jogadores no spawn do novo mapa
                let spawn = { x: 2, y: 2 };
                for (let y = 1; y < d.altura; y++) { for (let x = 1; x < d.largura; x++) { if (d.grid[y][x] === 1) { spawn = { x, y }; break; } } }
                
                Object.keys(d.players).forEach(pId => {
                    d.players[pId].x = spawn.x;
                    d.players[pId].y = spawn.y;
                });

                if(global.io) global.io.to(dungeonId).emit('dungeon_msg', { msg: `--- DESCERAM AO ANDAR ${d.andar} ---`, cor: '#0f5' });
                this._salvarBancoDeDados();
                return { estado: d, msg: `Avançaste para o Andar ${d.andar}!` };
            }
        }
        return { estado: d };
    }

    resolverCombateDungeon(dungeonId, vitoria) {
        const d = this.dungeons[dungeonId]; if (!d) return;
        if (vitoria) {
            d.status = 'explorando';
            d.entidades = d.entidades.filter(e => e.id !== d.entidadeEmCombate.id);
            d.entidadeEmCombate = null;
            if(global.io) global.io.to(dungeonId).emit('dungeon_combat_end', { vitoria: true, estado: d });
        } else {
            // Party Wipe (Apaga a dungeon)
            if(global.io) global.io.to(dungeonId).emit('dungeon_combat_end', { vitoria: false, msg: "A Party foi obliterada e atirada para fora do Abismo." });
            delete this.dungeons[dungeonId];
        }
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
        if (!v) return { erro: "Alma perdida no Vazio." };

        // 1. Força o cálculo dos atributos totais primeiro para obter o hpMax real
        this._obterAtributosTotais(v); 

        // 2. Purificação Alquímica: Garante que os valores são estritamente inteiros
        v.hpAtual = Math.floor(Number(v.hpAtual)) || 0;
        v.hpMax = Math.floor(Number(v.hpMax)) || 1000;
        v.sangue = Math.floor(Number(v.sangue)) || 0;

        if (v.hpAtual >= v.hpMax) return { erro: "A tua carne já está intacta. Não há feridas para fechar." };
        
        let danoSofrido = v.hpMax - v.hpAtual;
        let custoCura = Math.floor(danoSofrido * 2);
        
        if (v.sangue < custoCura) {
            let curaParcial = Math.floor(v.sangue / 2);
            if (curaParcial <= 0) return { erro: "Vitalidade insuficiente para fechar sequer um arranhão." };
            
            v.hpAtual += curaParcial; 
            let sangueGasto = v.sangue;
            v.sangue = 0;
            this._salvarBancoDeDados();
            return { sucesso: true, relato: `Sangue esgotado. Gastaste ${sangueGasto} Gts e curaste apenas ${curaParcial} HP.` };
        }

        v.sangue -= custoCura;
        v.hpAtual = v.hpMax; 
        this._salvarBancoDeDados();
        return { sucesso: true, relato: `Veias seladas com magia. Gastaste ${custoCura} Gts para curar toda a tua Vitalidade.` };
    }
	
	// ==========================================
    // EXECUÇÃO E EFEITOS DO ALTAR (MAGIA PARTILHADA)
    // ==========================================
    async processarMagia(atacanteId, alvoId, ritualId) {
        try {
            const v = this.vampiros[atacanteId];
            if (!v) return { erro: "O teu espírito desvaneceu." };

            // O GRIMÓRIO DEFINITIVO COM OS GANHOS CONFIGURADOS
            const grimorio = {
                'sangue_furia': { nome: 'Fervor do Sangue', tipo: 'suporte', custoAcao: 2, req: { vitae: 1 }, ganhoFuria: 4 },
                'sangue_coagula': { nome: 'Coagulação Obscura', tipo: 'cura', custoAcao: 3, req: { vitae: 2 }, ganhoCura: 500 },
                'vassalos_furia': { nome: 'Ira dos Vassalos', tipo: 'suporte', custoAcao: 4, req: { anima: 2, cinzas: 1 }, ganhoFuria: 6 },
                'vassalos_banimento': { nome: 'Banimento Astral', tipo: 'ataque', custoAcao: 5, req: { anima: 3, cinzas: 2 }, dano: 1000 },
                'caim_ressonancia': { nome: 'Ressonância de Caim', tipo: 'suporte', custoAcao: 5, req: { memoria: 1, vitae: 3 }, ganhoFuria: 8 },
                'salomao_dominio': { nome: 'Domínio de Salomão', tipo: 'ataque', custoAcao: 8, req: { ectoplasma: 1, pedraAlma: 1 }, dano: 3000 }
            };

            const r = grimorio[ritualId];
            if (!r) return { erro: "Ritual não reconhecido pelos Antigos." };

            // 1. Validação de Materiais
            for (let reqItem in r.req) {
                if ((v.inventario[reqItem] || 0) < r.req[reqItem]) {
                    return { erro: `Reagentes insuficientes. Faltam ${reqItem.toUpperCase()}.` };
                }
            }

            // 2. Validação de Custo (Fúria Base para iniciar)
            if (v.pontosAcao < r.custoAcao) return { erro: `A Fúria do teu sangue não é suficiente (${r.custoAcao} exigidos).` };

            // 3. Consome os custos de quem faz o ritual
            for (let reqItem in r.req) v.inventario[reqItem] -= r.req[reqItem];
            v.pontosAcao -= r.custoAcao;

            let relatoMagia = "";

            // ==========================================
            // LÓGICA DE SUPORTE (FÚRIA PARTILHADA)
            // ==========================================
            if (r.tipo === 'suporte') {
                this._obterAtributosTotais(v); // Atualiza os limites
                
                // Conjurador ganha a Fúria
                v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + r.ganhoFuria);
                relatoMagia = `Conjuraste ${r.nome}! As tuas veias ferveram com +${r.ganhoFuria} de Fúria.`;

                // Se houver um alvo e não fores tu, ELE TAMBÉM GANHA FÚRIA!
                if (alvoId && alvoId !== atacanteId && this.vampiros[alvoId]) {
                    let alvo = this.vampiros[alvoId];
                    this._obterAtributosTotais(alvo);
                    
                    alvo.pontosAcao = Math.min(alvo.maxAcao, alvo.pontosAcao + r.ganhoFuria);
                    relatoMagia = `O Elo ativou! Tu e [${alvo.nome}] receberam +${r.ganhoFuria} de Fúria!`;

                    // Força a atualização no ecrã do alvo
                    if (global.io) {
                        global.io.to(`priv_${alvo.id}`).emit('nova_mensagem', { 
                            canal: 'privado', autor: '🔥 RITUAL PARTILHADO', 
                            texto: `[${v.nome}] conjurou ${r.nome} em ti! Recebeste +${r.ganhoFuria} Fúria.`, 
                            hora: new Date().toLocaleTimeString() 
                        });
                        global.io.to(`priv_${alvo.id}`).emit('tick'); // Atualiza a barra de status dele na hora
                    }
                }
            }

            // ==========================================
            // LÓGICA DE CURA (HP PARTILHADO)
            // ==========================================
            else if (r.tipo === 'cura') {
                this._obterAtributosTotais(v);
                
                if (alvoId && alvoId !== atacanteId && this.vampiros[alvoId]) {
                    let alvo = this.vampiros[alvoId];
                    this._obterAtributosTotais(alvo);
                    alvo.hpAtual = Math.min(alvo.hpMax, (Number(alvo.hpAtual) || 0) + r.ganhoCura);
                    relatoMagia = `Curaste as feridas de [${alvo.nome}] em +${r.ganhoCura} HP.`;
                    
                    if (global.io) {
                        global.io.to(`priv_${alvo.id}`).emit('nova_mensagem', { 
                            canal: 'privado', autor: '🩸 RITUAL DE CURA', 
                            texto: `[${v.nome}] conjurou ${r.nome} em ti! Curaste +${r.ganhoCura} HP.`, 
                            hora: new Date().toLocaleTimeString() 
                        });
                        global.io.to(`priv_${alvo.id}`).emit('tick');
                    }
                } else {
                    v.hpAtual = Math.min(v.hpMax, (Number(v.hpAtual) || 0) + r.ganhoCura);
                    relatoMagia = `As tuas feridas fecharam! Curaste +${r.ganhoCura} HP.`;
                }
            }

            // ==========================================
            // LÓGICA DE ATAQUE (SE HOUVER)
            // ==========================================
            // ==========================================
            // LÓGICA DE ATAQUE (SE HOUVER) - COM RESSONÂNCIA DO LEXICON
            // ==========================================
            else if (r.tipo === 'ataque') {
                if (alvoId && this.vampiros[alvoId]) {
                    let alvo = this.vampiros[alvoId];
                    const ressonancia = Lexicon.CalcularRessonanciaOculta(v.id, alvo.id, r.dano);
                    const danoRealAplicado = ressonancia.forcaReal;
                    
                    alvo.hpAtual -= danoRealAplicado;
                    
                    // PILAR 9: Rasgar o Véu Global
                    if (ressonancia.rasgouOVeo) {
                        const fendaId = crypto.randomBytes(4).toString('hex');
                        this.fendaAtiva[fendaId] = { id: fendaId, nome: "Anomalia Qliphótica", hpMax: v.nivel*2000, hpAtual: v.nivel*2000, dano: v.nivel*50, loot: "ectoplasma" };
                        this._registrarEventoEspecial('global', 'O VÉU RASGOU', `A magia brutal de ${v.nome} quebrou o espaço-tempo! Uma Anomalia invadiu o Conclave.`, true);
                    }

                    if (alvo.hpAtual <= 0) {
                        alvo.hpAtual = 0; alvo.estado = 'Morto';
                        relatoMagia = `Desintegraste [${alvo.nome}] com ${r.nome}! ${ressonancia.relato}`;
                    } else {
                        relatoMagia = `Atingiste [${alvo.nome}] com ${r.nome} causando ${danoRealAplicado} de Dano Verdadeiro! ${ressonancia.relato}`;
                    }
                    if (global.io) global.io.to(`priv_${alvo.id}`).emit('tick');
                }
            }

            this._salvarBancoDeDados();
            return { sucesso: true, relato: relatoMagia };

        } catch(e) {
            console.error("[ERRO PROCESSAR MAGIA]", e);
            return { erro: "O Ritual colapsou nas sombras." };
        }
    }
	
	async evocarGoetia(idVampiro, ritualId) {
        const v = this.vampiros[idVampiro];
        if(!v) return { erro: "Identidade não encontrada." };
        
        // Garante que o objeto conclave existe antes de checar status
        if (!this.conclave) this.conclave = { status: 'aberto', progresso: 0 };
        
        // CORREÇÃO CRÍTICA: Validação do Sangue (3000 Gts) e Fúria (10)
        if (v.sangue < 3000 || v.pontosAcao < 10) {
            return { erro: "A Entidade exige 3000 Gts de Ouro e 10 Fúrias de sacrifício para atravessar o véu." };
        }
        
        try {
            const mob = {
                id: 'goetia_' + Date.now(),
                nome: "Rei Bael", // Alinhado com o nome do Frontend
                hpMax: 50000,
                hpAtual: 50000,
                participantes: {}
            };
            this.evocacaoAtiva = mob;
            
            // Subtrai os custos corretamente
            v.sangue -= 3000;
            v.pontosAcao -= 10;
            
            this._registrarEventoEspecial('global', 'EVOCAÇÃO GOÉTICA', `${v.nome} rompeu o selo do Triângulo de Arte!`);
            this._salvarBancoDeDados();
            return { sucesso: true, mob };
        } catch (e) {
            console.error(e);
            return { erro: "O Triângulo de Arte colapsou." };
        }
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
                if (doc.ordensData && this.ordensCore) { this.ordensCore.carregarEstado(doc.ordensData); }
            }
        } catch (e) {
            console.error("Erro ao conectar ao Abismo:", e);
        }
    }

    _salvarBancoDeDados() {
        const col = this.collection || this.dbCollection;
        if (!col) return Promise.resolve();
        const data = { 
            vampiros: this.vampiros, rebanho: this.rebanho, clans: this.clans, 
            leilaoP2P: this.leilaoP2P, leilaoIdCounter: this.leilaoIdCounter, 
            logs: this.logs, manuscritos: this.manuscritos, grimorioCustomizado: this.grimorioCustomizado,
            balancaCosmica: this.balancaCosmica, evocacaoAtiva: this.evocacaoAtiva,
            fendaAtiva: this.fendaAtiva, pactosAtivos: this.pactosAtivos, reliquiasCustomizadas: this.reliquiasCustomizadas,
            historicoChat: this.historicoChat, reinos: this.reinos,
            ordensData: this.ordensCore ? this.ordensCore.salvarEstado() : null,
            ultimaGravacao: new Date().toISOString()
        };
        return col.updateOne({ _id: 'MATRIZ_PRINCIPAL' }, { $set: data }, { upsert: true }).catch(e => console.error("Erro ao salvar no Atlas:", e.message));
    }
    // ==========================================
    // MAGIA OCULTA: CRIPTOGRAFIA DO VÍNCULO ASTRAL
    // ==========================================
    _conjurarGotaDeSangue(hashAlma, vampiroSigilo, quantiaBase, localMordida) {
        // [MAGIA OCULTA] - Misturamos a aura da presa, o selo do predador e a entropia do tempo
        const assinaturaAstral = crypto.createHash('sha512').update(`${hashAlma}::${vampiroSigilo}::RITO_DE_SANGUE::${Date.now()}`).digest('hex');
        
        // A ressonância dita a defesa espiritual do alvo no plano físico (0 a 255)
        const ressonanciaMagicka = parseInt(assinaturaAstral.substring(0, 2), 16); 
        
        let mult = 1; let risco = 0;
        
        if (localMordida === 'pescoco') { mult = 1.5; risco = 25; } 
        else if (localMordida === 'arteria') { mult = 2.0; risco = 45; } 
        else if (localMordida === 'extorquir') { mult = 0.5; risco = 10; } 
        else if (localMordida === 'caricia') { mult = 0.1; risco = 0; } 

        // Teste de vontade: A matriz física resiste ao Vínculo Astral?
        if (Math.random() * 100 < risco) return { hash: assinaturaAstral, volume: 0, critico: false, falha: true };
        
        // Dano Crítico Oculto: Se a ressonância vibrar na mesma frequência cósmica (>220)
        if (ressonanciaMagicka > 220) mult *= 1.5; 
        
        return { hash: assinaturaAstral, volume: Math.floor(quantiaBase * mult), critico: ressonanciaMagicka > 220, falha: false };
    }

    drenarMortal(vampiroId, hashMortal, localMordida) {
        const predador = this.vampiros[vampiroId]; 
        const mortal = this.rebanho[hashMortal]; 
        const lua = AstrolabioLunar.obterFaseAtual();
        
        if (!predador || !mortal || mortal.estado !== 'Vibrante') return { erro: "O Fio de Prata rompeu-se. A Presa escapou." };

        // [RITO DE PURIFICAÇÃO ASTRAL]
        if (localMordida === 'purificar') {
            if (predador.sangue < 200) return { erro: "O Rito exige 200 Gts de sacrifício." }; 
            predador.sangue -= 200; 
            mortal.sangueAtual += 1000; 
            mortal.registroMordidas.unshift({ predador: predador.nome, local: "CUIDADO NEGRO", dano: "+1000 HP", data: Date.now() }); 
            this._salvarBancoDeDados();
            return { roubo: 0, relato: `Injetaste tua vitae pela malha astral. A presa regenerou a carne (+1000 HP).`, mortal, lootMsg: "" };
        }

        if (predador.pontosAcao < 1 && localMordida !== 'caricia') return { erro: "O teu espírito carece de Fúria." };
        
        // [DEFESA DE SELO GOÉTICO]
        if (mortal.maldicaoArcana && mortal.maldicaoArcana.donoId !== vampiroId) {
            predador.sangue = Math.max(0, predador.sangue - 300); 
            predador.pontosAcao -= 1; 
            this._salvarBancoDeDados();
            return { 
                erro: `CHOQUE MAGICKO! O Selo Protetor de ${mortal.maldicaoArcana.donoNome} incinerou-te (-300 Gts).`, 
                mortal, 
                alertDono:`Um parasita tentou violar o teu escravo astral [${mortal.identificadorVisivel}]. A tua marca repeliu ${predador.nome}.`, 
                donoId: mortal.maldicaoArcana.donoId 
            };
        }

        if (localMordida !== 'caricia') predador.pontosAcao -= 1;
        
        const atr = this._obterAtributosTotais(predador);
        let bonusAtributo = predador.raca === 'lycan' ? Math.floor(atr.densidade * 10) : Math.floor(atr.magnetismo * 10); 
        let mordidaBase = Math.floor(Math.random() * 80) + 40 + bonusAtributo;
        if (lua.id === 'cheia') mordidaBase = Math.floor(mordidaBase * (predador.raca === 'lycan' ? 2.0 : 1.3));

        let rouboPossivel = Math.min(mordidaBase, mortal.sangueAtual);
        
        // [CONJURAÇÃO CIBERNÉTICO-ESPIRITUAL]
        const conjuracao = this._conjurarGotaDeSangue(hashMortal, predador.id, rouboPossivel, localMordida);
        
        if (lua.id === 'nova' && predador.raca === 'vampiro') conjuracao.falha = false; 

        if (conjuracao.falha) { 
            predador.sangue = Math.max(0, predador.sangue - 50); 
            this._salvarBancoDeDados(); 
            return { erro: `A mente da presa resistiu no plano físico. A barreira umbral repeliu a tua essência (-50 Gts).`, mortal }; 
        }
		
		// >>> INTEGRAÇÃO DO LEXICON SANGUINIS <<<
        const gota = Lexicon.TransmutarVitae(conjuracao.volume, predador.id, mortal.identificadorVisivel);
        let rouboFinal = gota.volume;
        let ritoMsg = gota.ritoPerfeito ? " [RESSONÂNCIA ABSOLUTA: O sangue ferveu e multiplicou-se!]" : "";

        // ========================================================
        // A CORREÇÃO VITAL: SUBTRAIR DA VÍTIMA E DAR AO JOGADOR!
        // ========================================================
        mortal.sangueAtual = Math.max(0, mortal.sangueAtual - rouboFinal);
        predador.sangue += rouboFinal;
        
        if (!predador.estatisticas) predador.estatisticas = {};
        // Dentro da função drenarMortal, logo após `predador.estatisticas.totalDrenado = ...` substitui até ao `return`:

        // PILAR 5: Pureza Sanguínea
        if (mortal.qualidade && mortal.qualidade.includes('Pecador')) {
            rouboFinal = Math.floor(rouboFinal * 1.5); // Dá mais sangue
            if (Math.random() > 0.5) predador.hpAtual -= 100; // Mas envenena
            ritoMsg += " (O sangue impuro queimou as tuas veias: -100 HP, mas rendeu Ouro extra).";
        } else if (mortal.qualidade && mortal.qualidade.includes('Inocente')) {
            predador.pontosAcao = Math.min(predador.maxAcao, predador.pontosAcao + 2);
            ritoMsg += " (A inocência restaurou a tua mente: +2 Fúria).";
        }

        if (predador.raca === 'lycan' && Math.random() > 0.5) predador.pontosAcao = Math.min(predador.maxAcao, predador.pontosAcao + 1);
        this.ganharXP(vampiroId, localMordida === 'caricia' ? 5 : 25); 

        let lootMsg = ""; let itemName = predador.raca === 'lycan' ? "Osso Puro" : "Cristal Vitae";
        if (Math.random() > 0.6) { predador.inventario.vitae += 1; lootMsg += ` [+1 ${itemName}]`; }
        if (Math.random() > 0.96) { 
            const drop = ForjaDraconiana.gerarReliquia(predador.nivel, this.reliquiasCustomizadas); 
            predador.bolsa.push(drop); 
            lootMsg += `\n[ARTEFATO MANIFESTADO DO ÉTER: ${drop.nome}]`; 
        }

        let relato = localMordida === 'caricia' 
            ? `Enfeitiçaste a mente frágil e subjugaste ${rouboFinal} Essência sem dor.` 
            : `O Vínculo Astral rasgou a matriz da presa. Roubaste +${rouboFinal} Gts.${lootMsg}`;
            
        relato += ritoMsg; 

        // [PACTO DE SANGUE OCULTO: DÍZIMO ASTRAL AO SENHOR]
        if (predador.senhor && predador.senhor !== 'O_PRIMORDIAL' && this.vampiros[predador.senhor]) {
            try {
                const senhor = this.vampiros[predador.senhor];
                const pacto = Lexicon.ValidarPactoDeSangue(senhor.id, predador.id, 0.10);
                const dizimo = Math.max(1, Math.floor(rouboFinal * (pacto.taxaEfetiva || 0.10)));
                if (predador.sangue >= dizimo) {
                    predador.sangue -= dizimo;
                    senhor.sangue += dizimo;
                    relato += ` [🩸 Dízimo de Sangue: ${dizimo} Gts fluíram para teu Senhor ${senhor.nome}]`;
                    if (global.io) global.io.to(`priv_${senhor.id}`).emit('tick');
                }
            } catch(e) {}
        }

        predador.influencia += 1; 
        this._registrarEventoEspecial('caca', 'O ABATE', `${predador.nome} violou a vitalidade de ${mortal.identificadorVisivel}.`, false);
        mortal.registroMordidas.unshift({ predador: predador.nome, local: localMordida.toUpperCase(), dano: rouboFinal, data: Date.now() });

        if (mortal.sangueAtual <= 0) {
            mortal.estado = 'Limbo'; 
            predador.inventario.cinzas += 1; 
            predador.estatisticas.mortaisSecos += 1; 
            predador.influencia += 5; 
            relato += " \nRUPTURA FATAL. O corpo físico foi consumido. (+1 Cinzas | +5 Influência)";
            this._registrarEventoEspecial('global', 'O LIMBO', `O fio vital de ${mortal.identificadorVisivel} foi destruído pela escuridão de ${predador.nome}.`, true);
            
            // PILAR 2: Gatilho da Inquisição ao secar um mortal
            this._verificarInquisicao(predador);
        }
        
        this._salvarBancoDeDados(); 
        if (global.io) global.io.emit('aura_atualizada', hashMortal);

        return { roubo: rouboFinal, relato, mortal, lootMsg };
    } // <--- FALTAVA ESTA CHAVE AQUI PARA FECHAR A CAÇA!
	
	// ==========================================
    // MOTOR UNIFICADO DE COMBATE CONTÍNUO (Com Partilha XP/Loot)
    // ==========================================
	
	// ==========================================
    // MOTOR UNIFICADO DE COMBATE CONTÍNUO (Com Partilha XP/Loot)
    // ==========================================
// ==========================================
    // MOTOR UNIFICADO DE COMBATE CONTÍNUO (Com Partilha XP/Loot)
    // ==========================================
    async processarCombateAcao(dadosAction) {
        const { id, alvoId, tipoCombate, postura, desempenhoRitmo = { multiplicadorGeral: 1.0, danoRealCausado: 100, danoRealSofrido: 0 }, tipoAcao = 'ataque_normal', codigoMagia = null } = dadosAction;
        const v = this.vampiros[id];
        if (!v) return { erro: "Aura não encontrada." };

        const atr = this._obterAtributosTotais(v);
        let danoFinal = Math.min(desempenhoRitmo.danoRealCausado || 100, ((atr.vontade * 80) * (desempenhoRitmo.multiplicadorGeral || 1.0)) + (v.nivel * 1000));

        if (desempenhoRitmo.sangueGastoMagia > 0) v.calice = Math.max(0, (v.calice || 0) - desempenhoRitmo.sangueGastoMagia);
        if (desempenhoRitmo.curaRuptura > 0) {
            v.hpAtual = Math.min(v.hpMax, (v.hpAtual || 0) + desempenhoRitmo.curaRuptura);
            v.calice = (v.calice || 0) + Math.floor(desempenhoRitmo.curaRuptura / 2); 
        }

        // Obtém o alvo do combate
        let mob = null;
        let dIdEncontrado = null;

        if (tipoCombate === 'pve' || tipoCombate === 'labirinto') {
            mob = this.batalhasPvE[id];
        } else if (tipoCombate === 'goetia') {
            mob = this.evocacaoAtiva;
        } else if (tipoCombate === 'fenda') {
            mob = this.fendaAtiva[alvoId];
        } else if (tipoCombate === 'cerco') {
            mob = this.cercosAtivos[alvoId];
        } else if (tipoCombate === 'herege') {
            mob = this.heregeMarcado;
        } else if (tipoCombate === 'dungeon' || tipoCombate === 'dungeon_pvp') {
            for (let dId in this.dungeons) {
                if (this.dungeons[dId].entidadeEmCombate && this.dungeons[dId].entidadeEmCombate.id === alvoId) {
                    mob = this.dungeons[dId].entidadeEmCombate;
                    dIdEncontrado = dId;
                    break;
                }
            }
        } else if (tipoCombate === 'pvp') {
            mob = this.vampiros[alvoId];
        }

        if (!mob) return { erro: "O alvo desvaneceu nas sombras." };

        // Inicializa IA e postura através da CombatEngine
        mob = this.combatEngine.inicializarEntidadeCombate(mob, tipoCombate, v.nivel);

        // 1. Processa Ação do Jogador contra o Alvo
        const resJogador = this.combatEngine.processarImpactoJogador(mob, v, {
            tipoAcao,
            danoBruto: danoFinal,
            desempenhoRitmo,
            codigoMagia
        });

        // ==========================================
        // VERIFICAÇÃO DE VITÓRIA / DERROTA DO MOB
        // ==========================================
        if (mob.hpAtual <= 0) {
            mob.hpAtual = 0;
            let relatoVitoria = "";

            if (tipoCombate === 'pve' || tipoCombate === 'labirinto') {
                if (mob.rank && mob.rank.includes("Inquisidor")) { v.maldicaoInquisicao = false; v.titulos.push("Herege Triunfante"); }
                let buffEclipse = (this.altarEclipse && this.altarEclipse.buffAtivoAte > Date.now()) ? 2 : 1;
                let xpGanho = Math.floor((mob.hpMax / 10) * (mob.mult || 1)) * buffEclipse;
                let ganhoGts = Math.floor(((Math.random() * 200) + 100 + (v.nivel * 50)) * (mob.mult || 1)) * buffEclipse;
                v.sangue += ganhoGts;
                this.ganharXP(v.id, xpGanho);
                if (mob.loot) v.inventario[mob.loot] = (v.inventario[mob.loot] || 0) + 1;
                
                relatoVitoria = `Ganhaste +${xpGanho} XP, +${ganhoGts} Gts e 1x [${(mob.loot || 'cinzas').toUpperCase()}].`;
                if (Math.random() > 0.80) { 
                    const drop = ForjaDraconiana.gerarReliquia(v.nivel + (this.nivelAbismo * 2), this.reliquiasCustomizadas); 
                    v.bolsa.push(drop); relatoVitoria += `\n⚔️ Extraíste: [${drop.nome}]!`; 
                }
                delete this.batalhasPvE[id];
            } else if (tipoCombate === 'goetia') {
                let xpBaseBoss = Math.floor(mob.hpMax / 5);
                if (mob.participantes) {
                    for (let pid in mob.participantes) { 
                        let l = this.vampiros[pid]; 
                        if (l) { 
                            l.influencia = (l.influencia || 0) + 100;
                            l.inventario.pedraAlma = (l.inventario.pedraAlma || 0) + 10; 
                            this.ganharXP(l.id, xpBaseBoss);
                            if (!l.estatisticas) l.estatisticas = {};
                            l.estatisticas.demoniosMortos = (l.estatisticas.demoniosMortos || 0) + 1;
                            const dropBoss = ForjaDraconiana.gerarReliquia(l.nivel + 30, this.reliquiasCustomizadas);
                            l.bolsa.push(dropBoss);
                        } 
                    }
                }
                this._registrarEventoEspecial('global', 'VITÓRIA GOÉTICA', `A Vontade de ${mob.nome} foi estilhaçada! Chove XP, Pedras e Relíquias aos bravos.`, true);
                this.evocacaoAtiva = null;
                relatoVitoria = "ENTIDADE BANIDA DO CONCLAVE! Vê a tua bolsa.";
            } else if (tipoCombate === 'fenda') {
                v.inventario[mob.loot || 'ectoplasma'] = (v.inventario[mob.loot || 'ectoplasma'] || 0) + 2;
                this.ganharXP(v.id, 1500);
                delete this.fendaAtiva[alvoId];
                this._registrarEventoEspecial('global', 'FENDA PURGADA', `${v.nome} obliterou a anomalia cósmica.`, true);
                relatoVitoria = `A Fenda foi selada. +2 ${(mob.loot || 'ectoplasma').toUpperCase()}`;
            } else if (tipoCombate === 'cerco') {
                const vitima = this.vampiros[mob.alvoId];
                if (vitima) vitima.influencia = (vitima.influencia || 0) + 10;
                delete this.cercosAtivos[alvoId];
                this._registrarEventoEspecial('global', 'CERCO QUEBRADO', `O massacre terminou! ${v.nome} esmagou as hostes de ${mob.demonio}!`, true);
                relatoVitoria = "O Cerco demoníaco foi aniquilado!";
            } else if (tipoCombate === 'herege') {
                this.heregeMarcado = null;
                const drop = ForjaDraconiana.gerarReliquia(v.nivel + 20, this.reliquiasCustomizadas);
                v.bolsa.push(drop);
                v.influencia = (v.influencia || 0) + 500;
                this._registrarEventoEspecial('global', 'A LENDA CAIU', `${v.nome} executou o Herege Marcado e reclamou [${drop.nome}]!`, true);
                relatoVitoria = `VITÓRIA GLORIOSA! Reclamaste [${drop.nome}].`;
            } else if (tipoCombate === 'dungeon' || tipoCombate === 'dungeon_pvp') {
                this.resolverCombateDungeon(dIdEncontrado, true);
                relatoVitoria = "A abominação do Abismo caiu na masmorra.";
            } else if (tipoCombate === 'pvp') {
                let rouboGts = Math.min(mob.sangue || 0, Math.floor(1000 + (v.nivel * 50)));
                mob.sangue = Math.max(0, (mob.sangue || 0) - rouboGts);
                v.sangue += rouboGts;
                if (!v.estatisticas) v.estatisticas = {};
                v.estatisticas.vitoriasPvP = (v.estatisticas.vitoriasPvP || 0) + 1;
                this.ganharXP(v.id, 50 * (desempenhoRitmo.multiplicadorGeral || 1));
                mob.estado = 'Banido'; mob.status = 'Cinzas'; mob.hpAtual = 0;
                this._registrarEventoEspecial('guerra', 'ASSASSINATO EM DUELO', `Numa batalha sangrenta de Arena, ${v.nome} chacinou ${mob.nome} e roubou ${rouboGts} Gts!`, true);
                relatoVitoria = `Reduziste ${mob.nome} a cinzas e pilhaste ${rouboGts} Gts.`;
            }

            this._salvarBancoDeDados();
            return {
                finalizado: true,
                alvoMorto: true,
                relato: `⚡ ${resJogador.narrativaJogador}\n🏆 ${relatoVitoria}`,
                cinematica: resJogador.cinematica,
                critico: resJogador.critico,
                visceral: resJogador.golpeVisceralExecutado
            };
        }

        // ==========================================
        // 2. TURNO DO INIMIGO (IA AVANÇADA)
        // ==========================================
        const resInimigo = this.combatEngine.decidirAcaoInimigo(mob, v);
        let danoSofrido = resInimigo.dano || 0;

        if (desempenhoRitmo.danoRealSofrido > 0) {
            danoSofrido = Math.max(danoSofrido, Math.floor(desempenhoRitmo.danoRealSofrido));
        }

        if (v.escudo) {
            danoSofrido = Math.floor(danoSofrido * 0.2); // Escudo absorve 80% do impacto
            v.escudo = false;
        }

        if (danoSofrido > 0) {
            v.hpAtual = Math.max(0, (v.hpAtual || 0) - danoSofrido);
        }

        // --- VERIFICAÇÃO DE MORTE DO JOGADOR ---
        if (v.hpAtual <= 0) {
            if (v.geracao === 1) {
                v.hpAtual = v.hpMax;
                v.sangue = Math.max(v.sangue || 0, 50000);
                this._salvarBancoDeDados();
                return { finalizado: true, relato: "A tua Alma Primordial recusa a morte nas trevas." };
            }

            if (v.inventario && v.inventario.ankh_sangue > 0) {
                v.inventario.ankh_sangue -= 1;
                v.hpAtual = Math.floor(v.hpMax * 0.5);
                v.pontosAcao = Math.max(0, (v.pontosAcao || 0) - 2); 
                this._registrarEventoEspecial('global', 'ENGANOU A MORTE', `Um Ankh estilhaçou-se para salvar ${v.nome}!`, false);
                this._salvarBancoDeDados();
                return { finalizado: true, relato: `Um [Ankh de Sangue] quebrou-se! Restam ${v.inventario.ankh_sangue} Vidas.` };
            }

            let msgMorte = "O teu corpo cedeu. A escuridão abraçou-te.";
            if (v.equipamentos) {
                ['arma', 'armadura', 'amuleto'].forEach(slot => {
                    if (v.equipamentos[slot]) {
                        v.equipamentos[slot].durabilidade = Math.max(0, (v.equipamentos[slot].durabilidade || 100) - 25);
                        if (v.equipamentos[slot].durabilidade <= 0) msgMorte += `\n⚠️ [${v.equipamentos[slot].nome}] FOI DESTRUÍDO!`;
                    }
                });
            }

            v.estado = 'Banido'; v.status = 'Cinzas'; v.pontosAcao = 0; v.sangue = 0; v.hpAtual = 0;
            this._registrarEventoEspecial('global', 'CAÍDO EM BATALHA', `A alma de ${v.nome} foi estilhaçada nas trevas.`, false);
            this._salvarBancoDeDados(); 
            return { finalizado: true, relato: msgMorte };
        }

        this._salvarBancoDeDados();
        return {
            finalizado: false,
            hpRestante: mob.hpAtual,
            hpMax: mob.hpMax,
            posturaAtual: mob.posturaAtual,
            posturaMax: mob.posturaMax,
            vulneravelVisceral: mob.vulneravelVisceral,
            faseAtual: mob.faseAtual,
            acaoInimigo: resInimigo,
            cinematica: resJogador.cinematica || resInimigo.cinematica,
            critico: resJogador.critico,
            visceral: resJogador.golpeVisceralExecutado,
            relato: `${resJogador.narrativaJogador}\n${resInimigo.narrativa}`
        };
    }

    processarTurnoCombate(id, acao) {
        const v = this.vampiros[id];
        if (!v) return { erro: "Aura não encontrada." };
        let mob = this.batalhasPvE[id];
        if (!mob) return { erro: "Nenhum embate ativo no Umbral." };

        mob = this.combatEngine.inicializarEntidadeCombate(mob, 'pve', v.nivel);
        const atr = this._obterAtributosTotais(v);
        const danoBase = Math.floor((atr.vontade * 40) + (v.nivel * 50) + 100);

        const resJogador = this.combatEngine.processarImpactoJogador(mob, v, {
            tipoAcao: acao || 'ataque_normal',
            danoBruto: danoBase,
            desempenhoRitmo: { multiplicadorGeral: 1.0, combo: 1 }
        });

        if (mob.hpAtual <= 0) {
            let xpGanho = Math.floor((mob.hpMax / 10) * (mob.mult || 1));
            let ganhoGts = Math.floor(((Math.random() * 200) + 100 + (v.nivel * 50)) * (mob.mult || 1));
            v.sangue += ganhoGts;
            this.ganharXP(v.id, xpGanho);
            v.inventario[mob.loot] = (v.inventario[mob.loot] || 0) + 1;
            delete this.batalhasPvE[id];
            this._salvarBancoDeDados();
            return {
                sucesso: true,
                finalizado: true,
                relato: `VITÓRIA ESMAGADORA! ${resJogador.narrativaJogador}\nGanhaste +${xpGanho} XP, +${ganhoGts} Gts e 1x [${mob.loot.toUpperCase()}].`,
                cinematica: resJogador.cinematica
            };
        }

        const resInimigo = this.combatEngine.decidirAcaoInimigo(mob, v);
        if (resInimigo.dano > 0) {
            v.hpAtual = Math.max(0, (v.hpAtual || 0) - resInimigo.dano);
        }

        this._salvarBancoDeDados();
        return {
            sucesso: true,
            finalizado: false,
            mob: {
                nome: mob.nome,
                hpAtual: mob.hpAtual,
                hpMax: mob.hpMax,
                posturaAtual: mob.posturaAtual,
                posturaMax: mob.posturaMax,
                vulneravelVisceral: mob.vulneravelVisceral,
                faseAtual: mob.faseAtual
            },
            jogador: {
                hpAtual: v.hpAtual,
                hpMax: v.hpMax,
                furia: v.pontosAcao
            },
            relato: `${resJogador.narrativaJogador}\n${resInimigo.narrativa}`,
            cinematica: resJogador.cinematica || resInimigo.cinematica
        };
    }

    async despertarTalento(vampiroId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma inexistente." };
        
        if (!v.talentosAtivos) v.talentosAtivos = [];
        const nivelMinimo = 5;
        if ((v.nivel || 1) < nivelMinimo) return { erro: "A Mente Abissal exige ao menos o Grau " + nivelMinimo + " para o Despertar Akáshico." };

        let limiteTalentos = Math.max(1, Math.floor((v.nivel || 1) / 5) + (v.conquistas ? v.conquistas.length : 0));
        if (v.talentosAtivos.length >= limiteTalentos) return { erro: "Atingiste o limite da tua Constelação (" + limiteTalentos + " talentos). Sobe mais de Grau ou obtém conquistas." };
        
        let custoGts = 1500 + (v.talentosAtivos.length * 2000);
        let custoFuria = 5 + (v.talentosAtivos.length * 5);

        if ((v.sangue || 0) < custoGts || (v.pontosAcao || 0) < custoFuria) {
            return { erro: "O Selo Akáshico exige " + custoGts + " Gts e " + custoFuria + " Fúria." };
        }

        v.sangue -= custoGts;
        v.pontosAcao -= custoFuria;
        
        const talento = await this.oraculo.despertarHabilidadeUnica(v);
        if (!talento) {
            v.sangue += custoGts;
            v.pontosAcao += custoFuria;
            return { erro: "O Abismo recusou a oferenda. Tenta novamente." };
        }
            
        v.talentosAtivos.push(talento);
        this._registrarEventoEspecial('global', 'SELO AKÁSHICO DESPERTO', "A alma de " + v.nome + " ascendeu perante os mistérios antigos! Despertou o Selo Akáshico: [" + talento.nome + "]!", true);
        this._salvarBancoDeDados();
        return { sucesso: true, talento, relato: "A Mente Abissal gravou o Selo [" + talento.nome + "] na tua essência: " + talento.desc };
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
            this.garantirOficios(vampiroEncontrado);
            this._obterAtributosTotais(vampiroEncontrado);
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
            // 👇 CORREÇÃO: Usa o Lexicon para gerar o selo do mortal durante o Login
            const ancoragem = Lexicon.ForjarSigiloMortal('telegram', `@${tgUsername.toLowerCase()}`);
            const hashMortal = ancoragem.sigilo;
            
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
            sangue: (isFirstVampire ? 15000 : 1000) + extraHp, calice: 0, geracao, 
            hpAtual: hpInicial, hpMax: hpInicial, 
            clan: senhor ? senhor.clan : 'Sangue Ralo', 
            estado: 'Ativo', senhor: senhor ? senhor.id : 'O_PRIMORDIAL', linhagem: [],
            pontosAcao: isFirstVampire ? 999 : (racaEscolhida === 'lycan' ? 15 : 10), 
            maxAcao: isFirstVampire ? 999 : (racaEscolhida === 'lycan' ? 15 : 10), 
            escudo: false, nivel: isFirstVampire ? 99 : 1, xp: 0, xpProx: 100, 
            influencia: isFirstVampire ? 100 : 0, titulos: [racaEscolhida === 'lycan' ? 'Filhote Desgarrado' : 'Sangue Frio'], 
            tituloAtual: isFirstVampire ? 'Alfa Primordial' : (racaEscolhida === 'lycan' ? 'Filhote Desgarrado' : 'Sangue Frio'), conquistas: [],
            atributos: atributosIniciais,
			osintAprovado: isFirstVampire ? true : false, // O Primordial tem sempre acesso
            
            // --- NOVO: LIFE SKILLS (MAESTRIAS ESTILO ALBION) ---
            maestria: {
                laminas: { nivel: 1, xp: 0 },
                ocultismo: { nivel: 1, xp: 0 },
                defesa: { nivel: 1, xp: 0 },
                sanguimancia: { nivel: 1, xp: 0 } // Subida ao curar ou drenar
            },

            equipamentos: { 
                armaPrincipal: null, 
                armaSecundaria: null, 
                elmo: null, 
                armadura: null, 
                amuleto: null, 
                anel1: null, 
                anel2: null, 
                botas: null 
            }, bolsa: [], 
            inventario: { anima: extraAnima, cinzas: 0, vitae: 0, memoria: 0, ectoplasma: 0, pedraAlma: 0, ankh_sangue: isFirstVampire ? 10 : 3 }, 
            historicoCombate: [], poderesDesbloqueados: ['solve_coagula'], manuscritos: [], projetosEstudo: [],
            colecaoHabilidades: [], habilidadesAtivas: [], 
            estatisticas: { totalDrenado: 0, mortaisSecos: 0, vitoriasPvP: 0, demoniosMortos: 0, guerrasVencidas: 0, eloOculto: 0, ultimoTributo: 0, sangueGastoMagia: 0, curaRuptura: 0 }
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
        
        this.garantirOficios(this.vampiros[idSombrio]);
        this._obterAtributosTotais(this.vampiros[idSombrio]);
        this._salvarBancoDeDados(); return { existente: false, recusado: false, vampiro: this.vampiros[idSombrio] };
    }
    // ==========================================
    // MATEMÁTICA DE PROGRESSÃO E SINERGIA (EQUILÍBRIO)
    // ==========================================
    // ==========================================
    // MATEMÁTICA DE PROGRESSÃO E SINERGIA (EQUILÍBRIO)
    // ==========================================
    _obterAtributosTotais(vampiro) {
        this.garantirOficios(vampiro);
        let base = { vontade: 10, gnose: 10, magnetismo: 10, densidade: 10 };
        let combatStats = { danoFisico: 0, danoMagico: 0, armadura: 0, critico: 5, rouboDeVida: 0, furiaMax: 0 };

        if (vampiro.atributos) { for (let a in base) base[a] += Number(vampiro.atributos[a]) || 0; }
        
        // Garante estrutura completa dos 8 slots
        if (!vampiro.equipamentos) {
            vampiro.equipamentos = {
                armaPrincipal: null, armaSecundaria: null, elmo: null, armadura: null,
                amuleto: null, anel1: null, anel2: null, botas: null
            };
        } else {
            // Migração de slot legado 'arma' para 'armaPrincipal'
            if (vampiro.equipamentos.arma && !vampiro.equipamentos.armaPrincipal) {
                vampiro.equipamentos.armaPrincipal = vampiro.equipamentos.arma;
                delete vampiro.equipamentos.arma;
            }
        }

        const SLOTS_8 = ['armaPrincipal', 'armaSecundaria', 'elmo', 'armadura', 'amuleto', 'anel1', 'anel2', 'botas'];
        SLOTS_8.forEach(slot => {
            const item = vampiro.equipamentos[slot];
            if (item && (item.durabilidade === undefined || item.durabilidade > 0)) { 
                const b = item.bonus || item.bonusBase;
                if (b) {
                    for (let a in base) {
                        if (b[a]) base[a] += Number(b[a]) || 0;
                    }
                }
                if (item.danoFisico) combatStats.danoFisico += Number(item.danoFisico) || 0;
                if (item.danoMagico) combatStats.danoMagico += Number(item.danoMagico) || 0;
                if (item.armadura) combatStats.armadura += Number(item.armadura) || 0;
                if (item.critico) combatStats.critico += Number(item.critico) || 0;
                if (item.rouboDeVida) combatStats.rouboDeVida += Number(item.rouboDeVida) || 0;
                if (item.furiaMax) combatStats.furiaMax += Number(item.furiaMax) || 0;

                if (!item.iconeMiniaturaSVG && typeof GeradorDeItensProcedural !== 'undefined') {
                    item.iconeMiniaturaSVG = GeradorDeItensProcedural.gerarMiniaturaSVG(item);
                }
            }
        });

        vampiro.statsCombate = combatStats;
        
        if (vampiro.raca === 'lycan') { base.vontade += 15; base.densidade += 10; }
        else { base.gnose += 15; base.magnetismo += 10; }
        
        // [NOVO] PILAR 4: SINERGIA DE REINOS
        if (vampiro.clan !== 'Sangue Ralo' && this.clans[vampiro.clan] && this.clans[vampiro.clan].reino) {
            const reino = this.reinos[this.clans[vampiro.clan].reino];
            if (reino) {
                base.densidade += reino.edificacoes.muralha * 5;
                base.gnose += reino.edificacoes.torreSangue * 5;
                vampiro.descontoReino = reino.edificacoes.mercadoNegro * 0.05;
            }
        }
        
        // [NOVO] PILAR 1: PRESTIGE OUROBOROS
        const multPrestige = vampiro.multiplicadorOuroboros || 1;

        // [NOVO] PILAR 14: PACTOS DIVINOS
        if (vampiro.deusCultuado === 'caim') base.vontade = Math.floor(base.vontade * 1.25);
        if (vampiro.deusCultuado === 'lilith') base.gnose = Math.floor(base.gnose * 1.25);
        if (vampiro.deusCultuado === 'fenrir') base.densidade = Math.floor(base.densidade * 1.50);

        vampiro.hpMax = Math.floor((1000 + (base.densidade * 200) + (Number(vampiro.nivel) * 500)) * multPrestige);
        
        let furiaBase = vampiro.raca === 'lycan' ? 15 : 10;
        if (vampiro.deusCultuado === 'caim') furiaBase += 5; // Caim dá mais fúria máxima
        
        vampiro.maxAcao = Math.floor((furiaBase + Math.floor(Number(vampiro.nivel) / 5) + (combatStats.furiaMax || 0)) * multPrestige); 
        
        if (vampiro.pontosAcao > vampiro.maxAcao) vampiro.pontosAcao = vampiro.maxAcao;
        if (vampiro.pontosAcao < 0) vampiro.pontosAcao = 0;

        // ==========================================
        // SISTEMA DE RPG D&D SANGUÍNEO: MODIFICADORES E D20 CORE
        // ==========================================
        const modVontade = Math.floor((base.vontade - 10) / 2);
        const modGnose = Math.floor((base.gnose - 10) / 2);
        const modMagnetismo = Math.floor((base.magnetismo - 10) / 2);
        const modDensidade = Math.floor((base.densidade - 10) / 2);

        let bonusCA = 0;
        let bonusCD = 0;
        if (vampiro.arquetipo === 'cavaleiro_sangue') {
            bonusCA += 2;
            base.vontade += 4;
        } else if (vampiro.arquetipo === 'arquimago_abissal') {
            bonusCD += 3;
            base.gnose += 4;
        } else if (vampiro.arquetipo === 'ceifador_noturno') {
            base.magnetismo += 4;
        } else if (vampiro.arquetipo === 'feral_primordial') {
            base.densidade += 4;
            bonusCA += 1;
        }

        const classeArmadura = Math.max(10, 10 + modDensidade + bonusCA + Math.floor((combatStats.armadura || 0) * 0.2) + (vampiro.equipamentos?.armadura ? 2 : 0));
        const cdMagia = 8 + Math.max(0, modGnose) + bonusCD;
        const iniciativaDnd = modMagnetismo;

        vampiro.dnd = {
            modificadores: {
                vontade: modVontade,
                gnose: modGnose,
                magnetismo: modMagnetismo,
                densidade: modDensidade
            },
            classeArmadura,
            cdMagia,
            iniciativa: iniciativaDnd,
            arquetipo: vampiro.arquetipo || 'Neófito Errante'
        };

        // Integração com a Densidade do LexiconSanguinis
        try {
            vampiro.densidadeSanguinea = Lexicon.CalcularDensidadeSanguinea(vampiro);
        } catch(e) {}
        
        vampiro.atributosTotais = base;
        return base;
    }

    // Rolador Oficial de Dados D20 (D&D Dark Fantasy)
    rolarD20(mod = 0, vantagem = false, desvantagem = false) {
        let d1 = Math.floor(Math.random() * 20) + 1;
        let d2 = Math.floor(Math.random() * 20) + 1;
        let resultadoDado = d1;
        if (vantagem && !desvantagem) resultadoDado = Math.max(d1, d2);
        else if (desvantagem && !vantagem) resultadoDado = Math.min(d1, d2);

        const critico = (resultadoDado === 20);
        const falhaCritica = (resultadoDado === 1);
        const total = resultadoDado + Number(mod);

        return {
            dado: resultadoDado,
            dadoExtra: (vantagem || desvantagem) ? (resultadoDado === d1 ? d2 : d1) : null,
            modificador: mod,
            total,
            critico,
            falhaCritica,
            log: critico 
                ? `🎲 [D20]: NAT 20! Sucesso Crítico Astral!` 
                : (falhaCritica 
                    ? `🎲 [D20]: NAT 1! Falha Crítica!` 
                    : `🎲 [D20]: ${resultadoDado} ${mod >= 0 ? '+' : ''}${mod} = ${total}`)
        };
    }

    // Teste de Resistência (Saving Throw estilo D&D 5e)
    realizarTesteResistencia(vampiroId, atributo = 'vontade', cd = 13) {
        const v = this.vampiros[vampiroId];
        if (!v) return { sucesso: false, erro: "Invocador inexistente." };
        this._obterAtributosTotais(v);

        const mod = v.dnd?.modificadores?.[atributo] || 0;
        const rolagem = this.rolarD20(mod);
        const superou = rolagem.critico || (!rolagem.falhaCritica && rolagem.total >= cd);

        return {
            sucesso: superou,
            atributo,
            cd,
            rolagem,
            relato: superou 
                ? `✨ [SALVAGUARDA SUCESSO]: A alma resistiu ao teste de ${atributo.toUpperCase()} (Total ${rolagem.total} vs CD ${cd}).` 
                : `💀 [SALVAGUARDA FALHA]: A carne cedeu perante o teste de ${atributo.toUpperCase()} (Total ${rolagem.total} vs CD ${cd}).`
        };
    }

    // Escolha de Arquétipo de Linhagem (Subclasses D&D)
    escolherArquetipo(vampiroId, novoArquetipo) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma não encontrada." };
        if (v.nivel < 3) return { erro: "Precisas de alcançar o Grau 3 para escolher o teu Arquétipo." };

        const arquetiposValidos = {
            'cavaleiro_sangue': 'Cavaleiro de Sangue (Físico & Parry)',
            'arquimago_abissal': 'Arquimago Abissal (Gnose & Alta Magia)',
            'ceifador_noturno': 'Ceifador Noturno (Críticos & Furtividade)',
            'feral_primordial': 'Feral Primordial (Fúria Lycan & Fortitude)'
        };

        if (!arquetiposValidos[novoArquetipo]) return { erro: "Arquétipo desconhecido pelo Tomo." };

        v.arquetipo = novoArquetipo;
        this._obterAtributosTotais(v);
        this._salvarBancoDeDados();

        const nomeBonito = arquetiposValidos[novoArquetipo];
        this._registrarEventoEspecial('global', 'ARQUÉTIPO DESPERTO', `${v.nome} consagrou a sua linhagem como [${nomeBonito}].`, true);

        return {
            sucesso: true,
            arquetipo: novoArquetipo,
            nomeArquetipo: nomeBonito,
            relato: `Consagraste o caminho do ${nomeBonito}! Os teus modificadores foram recalculados.`
        };
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

    // ==========================================
    // PURIFICAÇÃO DO CORPO E ALMA (Limpa itens bugados)
    // ==========================================
    _purificarBolsaECorpo(v) {
        if (!Array.isArray(v.bolsa)) v.bolsa = [];
        v.bolsa = v.bolsa.filter(item => item && typeof item === 'object' && item.id);
        
        if (!v.equipamentos) {
            v.equipamentos = {
                armaPrincipal: null, armaSecundaria: null, elmo: null, armadura: null,
                amuleto: null, anel1: null, anel2: null, botas: null
            };
        }
        const SLOTS_8 = ['armaPrincipal', 'armaSecundaria', 'elmo', 'armadura', 'amuleto', 'anel1', 'anel2', 'botas'];
        SLOTS_8.forEach(slot => {
            if (v.equipamentos[slot] && typeof v.equipamentos[slot] === 'string') {
                v.equipamentos[slot] = null; 
            }
        });
    }

    equiparReliquia(vampiroId, reliquiaId, slotAlvo = null) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        this._purificarBolsaECorpo(v);

        const itemIdx = v.bolsa.findIndex(i => i.id === reliquiaId); 
        if (itemIdx === -1) return { erro: "Artefato além do teu alcance." };
        
        const item = v.bolsa[itemIdx];
        let slotDestino = slotAlvo;

        if (!slotDestino) {
            const t = item.tipo;
            if (t === 'arma' || t === 'armaPrincipal') slotDestino = 'armaPrincipal';
            else if (t === 'armaSecundaria' || t === 'escudo' || t === 'grimorio') slotDestino = 'armaSecundaria';
            else if (t === 'elmo') slotDestino = 'elmo';
            else if (t === 'armadura') slotDestino = 'armadura';
            else if (t === 'amuleto') slotDestino = 'amuleto';
            else if (t === 'anel') {
                slotDestino = !v.equipamentos.anel1 ? 'anel1' : (!v.equipamentos.anel2 ? 'anel2' : 'anel1');
            } else if (t === 'botas') slotDestino = 'botas';
            else slotDestino = 'armaPrincipal';
        }

        const atual = v.equipamentos[slotDestino];
        if (atual && !atual.iconeMiniaturaSVG && typeof GeradorDeItensProcedural !== 'undefined') {
            atual.iconeMiniaturaSVG = GeradorDeItensProcedural.gerarMiniaturaSVG(atual);
        }
        v.equipamentos[slotDestino] = item; 
        v.bolsa.splice(itemIdx, 1); 
        if (atual) v.bolsa.push(atual);
        
        this._obterAtributosTotais(v);
        this._salvarBancoDeDados(); 
        return { 
            sucesso: true, 
            relato: `Fundiste a tua carne com [${item.nome}] no slot ${slotDestino}.`,
            equipamento: v.equipamentos,
            bolsa: v.bolsa,
            atributosTotais: v.atributosTotais,
            statsCombate: v.statsCombate
        };
    }

    desequiparReliquia(vampiroId, slot) {
        const v = this.vampiros[vampiroId]; if (!v) return { erro: "Fantasma." };
        this._purificarBolsaECorpo(v);

        if (!v.equipamentos || !v.equipamentos[slot]) return { erro: "Esta fenda astral já está vazia." };
        const item = v.equipamentos[slot];
        if (!item.iconeMiniaturaSVG && typeof GeradorDeItensProcedural !== 'undefined') {
            item.iconeMiniaturaSVG = GeradorDeItensProcedural.gerarMiniaturaSVG(item);
        }
        v.equipamentos[slot] = null;
        v.bolsa.push(item);
        
        this._obterAtributosTotais(v);
        this._salvarBancoDeDados(); 
        return { 
            sucesso: true, 
            relato: `Removeste [${item.nome}] do teu corpo.`,
            equipamento: v.equipamentos,
            bolsa: v.bolsa,
            atributosTotais: v.atributosTotais,
            statsCombate: v.statsCombate
        };
    }

    // ==========================================
    // PODERES AKÁSHICOS NO COMBATE E NO CAMPO
    // ==========================================
    usarPoderAkashicoNoCombate(vampiroId, habilidadeId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma não encontrada." };
        
        const hab = (v.habilidadesAtivas || []).find(h => h.id === habilidadeId) || 
                    (v.colecaoHabilidades || []).find(h => h.id === habilidadeId);
        if (!hab) return { erro: "Poder akáshico não equipado ou inexistente." };
        
        const custoFuria = Number(hab.custoFuria) || 2;
        const custoSangue = Number(hab.custoGts) || 50;
        
        if (v.pontosAcao < custoFuria) return { erro: `Fúria insuficiente (${custoFuria} necessária).` };
        if (v.sangue < custoSangue) return { erro: `Vitae insuficiente (${custoSangue} Gts necessários).` };
        
        v.pontosAcao -= custoFuria;
        v.sangue -= custoSangue;
        v.estatisticas.sangueGastoMagia = (v.estatisticas.sangueGastoMagia || 0) + custoSangue;
        
        const atr = this._obterAtributosTotais(v);
        const gnose = atr.gnose || 10;
        const vontade = atr.vontade || 10;
        
        let danoCausado = 0;
        let curaRealizada = 0;
        let escudo = false;
        let atordoamento = false;
        let relato = "";
        
        const textoComp = ((hab.arquetipo || '') + ' ' + (hab.nome || '') + ' ' + (hab.descricao || '')).toLowerCase();
        
        if (textoComp.includes('cura') || textoComp.includes('vida') || textoComp.includes('sanguimancia') || textoComp.includes('dreno')) {
            danoCausado = Math.floor((gnose * 18) + (v.nivel * 25));
            curaRealizada = Math.floor(danoCausado * 0.7);
            v.hpAtual = Math.min(v.hpMax, v.hpAtual + curaRealizada);
            relato = `🩸 [${hab.nome}]: Rasgou a carne do inimigo causando ${danoCausado} e drenou ${curaRealizada} HP em retorno!`;
        } else if (textoComp.includes('escudo') || textoComp.includes('baluarte') || textoComp.includes('defesa') || textoComp.includes('protecao')) {
            escudo = true;
            danoCausado = Math.floor((vontade * 12) + (v.nivel * 18));
            relato = `🛡️ [${hab.nome}]: Ergueu barreira astral impenetrável e causou ${danoCausado} de repulsão!`;
        } else if (textoComp.includes('tempo') || textoComp.includes('atordoar') || textoComp.includes('paralisia') || textoComp.includes('vazio') || textoComp.includes('abismo')) {
            atordoamento = true;
            danoCausado = Math.floor((gnose * 22) + (v.nivel * 30));
            relato = `🌀 [${hab.nome}]: Colapsou o tempo-espaço! Causou ${danoCausado} de dano cósmico e atordoou o alvo!`;
        } else {
            danoCausado = Math.floor((gnose * 28) + (v.nivel * 40));
            relato = `⚡ [${hab.nome}]: Desencadeou fúria akáshica cataclísmica causando ${danoCausado} de dano puro!`;
        }
        
        this._salvarBancoDeDados();
        return {
            sucesso: true,
            relato,
            dano: danoCausado,
            cura: curaRealizada,
            escudo,
            atordoamento,
            furiaRestante: v.pontosAcao,
            sangueRestante: v.sangue,
            hpAtual: v.hpAtual
        };
    }

    usarPoderCampo(vampiroId, habilidadeId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma não encontrada." };
        const hab = (v.colecaoHabilidades || []).find(h => h.id === habilidadeId);
        if (!hab) return { erro: "Poder não encontrado no grimório." };
        
        const custoSangue = Math.floor((hab.custoGts || 100) * 1.5);
        if (v.sangue < custoSangue) return { erro: `Exige ${custoSangue} Gts de Vitae para manifestação de campo.` };
        
        v.sangue -= custoSangue;
        this._obterAtributosTotais(v);
        
        let relato = "";
        let efeitoAplicado = {};
        
        const desc = ((hab.nome || '') + ' ' + (hab.descricao || '')).toLowerCase();
        if (desc.includes('cura') || desc.includes('regenera') || desc.includes('sangue')) {
            const cura = Math.floor(v.hpMax * 0.5);
            v.hpAtual = Math.min(v.hpMax, v.hpAtual + cura);
            relato = `✨ [REGENERAÇÃO ASTRAL]: ${hab.nome} curou ${cura} HP instantaneamente.`;
            efeitoAplicado = { tipo: 'cura', valor: cura };
        } else if (desc.includes('teleporte') || desc.includes('espaco') || desc.includes('vazio') || desc.includes('sombra')) {
            if (this.mundo2D && this.mundo2D.jogadores && this.mundo2D.jogadores[vampiroId]) {
                this.mundo2D.jogadores[vampiroId].x = 40;
                this.mundo2D.jogadores[vampiroId].y = 40;
                relato = `🌀 [SALTO DIMENSIONAL]: ${hab.nome} transportou a tua essência imediatamente para o Santuário de Enoch!`;
            } else {
                relato = `🌀 [SALTO DIMENSIONAL]: Teleporte ativado com sucesso.`;
            }
            efeitoAplicado = { tipo: 'teleporte' };
        } else {
            v.buffCampo = { tipo: 'revelacao', ate: Date.now() + 300000 };
            relato = `👁️ [VISÃO DO OCULTO]: ${hab.nome} revelou veios de minério puro e ervas raras pelas próximas 5 minutos!`;
            efeitoAplicado = { tipo: 'buff_revelacao' };
        }
        
        this._salvarBancoDeDados();
        return { sucesso: true, relato, efeito: efeitoAplicado, vampiro: v };
    }

    // ==========================================
    // MERCADO P2P DE ITENS E ARTEFATOS
    // ==========================================
    listarMercadoItens() {
        return (this.mercadoItens || []).filter(i => !i.vendido);
    }

    anunciarItemMercado(vampiroId, itemId, precoGts) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Vendedor não reconhecido." };
        precoGts = Math.floor(Number(precoGts));
        if (!precoGts || precoGts < 50) return { erro: "Preço mínimo de anúncio é 50 Gts." };

        this._purificarBolsaECorpo(v);
        const itemIdx = v.bolsa.findIndex(i => i.id === itemId);
        if (itemIdx === -1) return { erro: "Item não encontrado no teu inventário." };

        const item = v.bolsa.splice(itemIdx, 1)[0];
        const anuncio = {
            id: 'mkt_' + (this.mercadoIdCounter++),
            vendedorId: v.id,
            vendedorNome: v.nome,
            precoGts,
            item,
            data: new Date().toISOString(),
            vendido: false
        };

        if (!this.mercadoItens) this.mercadoItens = [];
        this.mercadoItens.push(anuncio);
        this._salvarBancoDeDados();

        this._registrarEventoEspecial('global', 'MERCADO DE ARTEFATOS', `[${v.nome}] colocou [${item.nome}] à venda por ${precoGts} Gts!`);
        return { sucesso: true, relato: `[${item.nome}] anunciado por ${precoGts} Gts no Mercado.`, anuncio };
    }

    comprarItemMercado(compradorId, anuncioId) {
        const c = this.vampiros[compradorId];
        if (!c) return { erro: "Comprador não reconhecido." };

        const anuncio = (this.mercadoItens || []).find(a => a.id === anuncioId && !a.vendido);
        if (!anuncio) return { erro: "Anúncio não disponível ou já comprado." };

        if (anuncio.vendedorId === c.id) return { erro: "Não podes comprar o teu próprio anúncio." };
        if (c.sangue < anuncio.precoGts) return { erro: `Precisas de ${anuncio.precoGts} Gts de Sangue para comprar este artefato.` };

        const vendedor = this.vampiros[anuncio.vendedorId];
        c.sangue -= anuncio.precoGts;
        if (vendedor) vendedor.sangue += anuncio.precoGts;

        anuncio.vendido = true;
        c.bolsa.push(anuncio.item);

        this._salvarBancoDeDados();
        this._registrarEventoEspecial('global', 'ARTEFATO ADQUIRIDO', `[${c.nome}] comprou [${anuncio.item.nome}] de [${anuncio.vendedorNome}] por ${anuncio.precoGts} Gts!`);

        return { sucesso: true, relato: `Adquiriste [${anuncio.item.nome}] com sucesso!`, item: anuncio.item };
    }

    cancelarAnuncioItem(vampiroId, anuncioId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma não encontrada." };

        const anuncio = (this.mercadoItens || []).find(a => a.id === anuncioId && !a.vendido);
        if (!anuncio) return { erro: "Anúncio não encontrado." };
        if (anuncio.vendedorId !== v.id && v.clanRole !== 'lider') return { erro: "Apenas o vendedor pode cancelar." };

        anuncio.vendido = true;
        v.bolsa.push(anuncio.item);
        this._salvarBancoDeDados();

        return { sucesso: true, relato: `Recuperaste [${anuncio.item.nome}] para a tua bolsa.` };
    }

    forjarEquipamentoProcedural(vampiroId, slotTipo) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Ferreiro não reconhecido." };
        this.garantirOficios(v);

        const nvArmaria = v.oficios?.armaria?.nivel || 1;
        const custoFerro = 4;
        const custoPedra = 3;
        const custoSangue = 400;

        if ((v.materiais?.ferroNegro || 0) < custoFerro) return { erro: `Exige ${custoFerro} Ferro Negro.` };
        if ((v.materiais?.pedra || 0) < custoPedra) return { erro: `Exige ${custoPedra} Pedra Rúnica.` };
        if (v.sangue < custoSangue) return { erro: `Exige ${custoSangue} Gts de Sangue.` };

        v.materiais.ferroNegro -= custoFerro;
        v.materiais.pedra -= custoPedra;
        v.sangue -= custoSangue;

        let raridadeForcada = null;
        const roll = Math.random() + (nvArmaria * 0.015);
        if (roll > 1.25) raridadeForcada = 'Mítico';
        else if (roll > 1.05) raridadeForcada = 'Lendário';
        else if (roll > 0.85) raridadeForcada = 'Épico';
        else if (roll > 0.6) raridadeForcada = 'Raro';

        const novoItem = GeradorDeItensProcedural.gerarItemProcedural(v.nivel, slotTipo, raridadeForcada);
        v.bolsa.push(novoItem);
        this._ganharXpOficio(v, 'armaria', 60 + (nvArmaria * 10));

        this._salvarBancoDeDados();
        return {
            sucesso: true,
            relato: `⚒️ [FORJA DRACONIANA]: Forjaste [${novoItem.nome}] (${novoItem.raridade})!`,
            item: novoItem,
            bolsa: v.bolsa
        };
    }

    // ==========================================
    // O MOTOR DA ALTA MAGIA (Isto corrige o Crash dos Rituais)
    // ==========================================
    _construirFuncoesCustomizadas(magias) {
        let funcObj = {};
        for(let k in magias) {
            let m = magias[k];
            funcObj[k] = {
                nome: m.nome, lore: m.lore || m.descricao,
                custoAcao: m.custoAcao, custoSangue: m.custoSangue, reqLevel: m.reqLevel, tipo: m.tipo,
                efeito: (a, d, l) => {
                    let dano = Math.floor(m.poderBase || 1000);
                    if(d.id !== a.id) {
                        d.sangue = Math.max(0, d.sangue - dano); a.sangue += Math.floor(dano / 2);
                        return `A entidade invadiu a presa e roubou ${dano} Gts.`;
                    } else {
                        a.hpAtual = Math.min(a.hpMax, a.hpAtual + dano); return `O rito regenerou-te ${dano} HP.`;
                    }
                }
            };
        }
        return funcObj;
    }


    ganharXP(id, quantia) {
        const v = this.vampiros[id]; if (!v || v.estado === 'Banido') return;
        this.garantirOficios(v);
        v.xp += quantia;
        
        // --- MOTOR DA BALANÇA CÓSMICA ---
        if (v.raca === 'vampiro') this.balancaCosmica.tiamat += 1;
        else if (v.raca === 'lycan') this.balancaCosmica.seth += 1;
        
        let t = this.balancaCosmica.tiamat; let s = this.balancaCosmica.seth;
        if (t > s + 100) this.balancaCosmica.regente = 'Tiamat (Vampiros)';
        else if (s > t + 100) this.balancaCosmica.regente = 'Seth (Lycans)';
        else this.balancaCosmica.regente = 'Equilíbrio';
        // --------------------------------

        if (v.xp >= v.xpProx) {
            v.nivel += 1; v.xp -= v.xpProx; v.xpProx = Math.floor(v.xpProx * 1.5); 
            v.maxAcao += 2; v.pontosAcao = v.maxAcao; v.atributos.pontosLivres += 3; v.influencia += 2; 
            if (!Array.isArray(v.poderesDesbloqueados)) v.poderesDesbloqueados = [];
            if (!Array.isArray(v.titulos)) v.titulos = [];
            for (let ritualId in this.grimorio) { 
                if (v.nivel >= this.grimorio[ritualId].reqLevel && !v.poderesDesbloqueados.includes(ritualId)) {
                    v.poderesDesbloqueados.push(ritualId); 
                }
            }
            this._registrarEventoEspecial('global', 'ASCENSÃO ASTRAL', `A Aura de ${v.nome} adensou-se, irradiando terror cósmico. Ascensão ao Grau ${v.nivel}.`);
            if (v.nivel === 50) this._registrarEventoEspecial('global', 'O VÉU RASGOU-SE', `O Grau 50 foi atingido. A visão astral de OSINT sobre os mortais foi desbloqueada.`, true);
            
            // Geração Dinâmica de Títulos a cada 5 níveis pela IA
            if (v.nivel % 5 === 0 && !v.isBot && this.oraculo) {
                this.oraculo.forjarTitulo(v).then(tituloNovo => {
                    if (tituloNovo && !v.titulos.includes(tituloNovo)) {
                        v.titulos.push(tituloNovo);
                        v.tituloAtual = tituloNovo;
                        this._registrarEventoEspecial('global', 'NOVO TÍTULO DA IA', `A Mente Abissal julgou os feitos de ${v.nome} e coroou-o como [${tituloNovo}].`);
                        this._salvarBancoDeDados();
                        if (global.io) global.io.to(`priv_${v.id}`).emit('tick'); 
                    }
                }).catch(() => {});
            }

            if (global.io) global.io.to(`priv_${v.id}`).emit('level_up', { lvl: v.nivel, titulo: v.tituloAtual }); 
        }
        this._verificarConquistas(v); this._salvarBancoDeDados();
    }

    // ==================================================================
    // 🛠️ OFÍCIOS NOTURNOS (LIFE SKILLS ENGINE)
    // ==================================================================
    garantirOficios(v) {
        if (!v) return;
        if (!v.oficios) {
            v.oficios = {
                alquimia: { nivel: 1, xp: 0, xpProx: 100 },
                herbologia: { nivel: 1, xp: 0, xpProx: 100 },
                sigilos: { nivel: 1, xp: 0, xpProx: 100 },
                necromancia: { nivel: 1, xp: 0, xpProx: 100 },
                armaria: { nivel: 1, xp: 0, xpProx: 100 }
            };
        }
        if (!v.materiais) {
            v.materiais = {
                mandragora: 5,
                beladona: 5,
                lotusNegro: 2,
                florCinzas: 5,
                ferroNegro: 10,
                pedra: 10,
                madeira: 10,
                pergaminhoVirgem: 5
            };
        } else {
            if (v.materiais.ferroNegro === undefined) v.materiais.ferroNegro = 10;
            if (v.materiais.pedra === undefined) v.materiais.pedra = 10;
            if (v.materiais.madeira === undefined) v.materiais.madeira = 10;
        }
        if (!Array.isArray(v.poderesDesbloqueados)) v.poderesDesbloqueados = ['solve_coagula'];
        if (this.grimorio) {
            for (let ritualId in this.grimorio) {
                if (v.nivel >= (this.grimorio[ritualId].reqLevel || 1) && !v.poderesDesbloqueados.includes(ritualId)) {
                    v.poderesDesbloqueados.push(ritualId);
                }
            }
        }
    }

    _ganharXpOficio(v, oficioNome, xp) {
        this.garantirOficios(v);
        const o = v.oficios[oficioNome];
        if (!o) return;
        o.xp += xp;
        if (o.xp >= o.xpProx) {
            o.nivel += 1;
            o.xp -= o.xpProx;
            o.xpProx = Math.floor(o.xpProx * 1.5);
            this._registrarEventoEspecial('global', 'MESTRIA DO OFÍCIO', `[${v.nome}] ascendeu ao Grau ${o.nivel} em ${oficioNome.toUpperCase()}!`);
            if (global.io) global.io.to(`priv_${v.id}`).emit('juice_notif', { 
                title: "MESTRIA AUMENTADA", 
                msg: `Alcançaste o Grau ${o.nivel} no ofício de ${oficioNome.toUpperCase()}!` 
            });
        }
    }

    coletarHerbalismo(vampiroId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma não encontrada." };
        this.garantirOficios(v);

        if (v.pontosAcao < 1) return { erro: "Falta Fúria para sintonizar com as brumas." };
        v.pontosAcao -= 1;

        const rolagem = Math.random();
        let coletado = "mandragora";
        let qtd = 1;
        let xpGanho = 20;

        if (rolagem > 0.85) {
            coletado = "lotusNegro";
            qtd = 1;
            xpGanho = 50;
        } else if (rolagem > 0.60) {
            coletado = "florCinzas";
            qtd = Math.floor(Math.random() * 2) + 1;
            xpGanho = 30;
        } else if (rolagem > 0.30) {
            coletado = "beladona";
            qtd = Math.floor(Math.random() * 3) + 1;
            xpGanho = 25;
        } else {
            coletado = "mandragora";
            qtd = Math.floor(Math.random() * 3) + 1;
            xpGanho = 20;
        }

        v.materiais[coletado] = (v.materiais[coletado] || 0) + qtd;
        this._ganharXpOficio(v, 'herbologia', xpGanho);

        const nomesErvas = {
            lotusNegro: "Lótus Negro do Vazio",
            florCinzas: "Flor das Cinzas Tumulares",
            beladona: "Beladona Noturna",
            mandragora: "Raiz de Mandrágora Uivante"
        };

        this._salvarBancoDeDados();
        return {
            sucesso: true,
            relato: `🌿 [COLHEITA ASTRAL]: Colheste ${qtd}x [${nomesErvas[coletado]}]. (+${xpGanho} XP Herbologia)`,
            materiais: v.materiais,
            oficios: v.oficios
        };
    }

    fabricarOficio(vampiroId, categoria, receitaId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma não encontrada." };
        this.garantirOficios(v);

        const RECEITAS = {
            alquimia: {
                filtro_frenesi: {
                    nome: "Filtro do Frenesi Escarlate",
                    desc: "Restaura 5 Fúria imediatamente.",
                    reqOficio: 1,
                    custo: { materiais: { beladona: 2 }, sangue: 100 },
                    xp: 25,
                    executar: (alvo) => { alvo.pontosAcao = Math.min(alvo.maxAcao, alvo.pontosAcao + 5); }
                },
                elixir_regeneracao: {
                    nome: "Elixir da Carne Imortal",
                    desc: "Regenera 500 HP instantaneamente.",
                    reqOficio: 2,
                    custo: { materiais: { mandragora: 2 }, sangue: 150 },
                    xp: 35,
                    executar: (alvo) => { alvo.hpAtual = Math.min(alvo.hpMax, alvo.hpAtual + 500); }
                },
                oleo_profano: {
                    nome: "Óleo Profano de Lótus",
                    desc: "Concede Escudo Absoluto na próxima batalha.",
                    reqOficio: 3,
                    custo: { materiais: { lotusNegro: 1, florCinzas: 2 }, sangue: 300 },
                    xp: 60,
                    executar: (alvo) => { alvo.escudo = true; }
                }
            },
            sigilos: {
                selo_salomao: {
                    nome: "Pergaminho de Salomão",
                    desc: "Selo sagrado que confere Escudo Protetor e +5 Influência.",
                    reqOficio: 1,
                    custo: { materiais: { pergaminhoVirgem: 1 }, inventario: { anima: 1 }, sangue: 200 },
                    xp: 30,
                    executar: (alvo) => { alvo.escudo = true; alvo.influencia += 5; }
                },
                selo_qliphoth: {
                    nome: "Sigilo da Ruptura Qliphótica",
                    desc: "Grava um glifo sombrio que concede +1 Gnose permanente.",
                    reqOficio: 2,
                    custo: { materiais: { pergaminhoVirgem: 1, florCinzas: 1 }, inventario: { ectoplasma: 1 }, sangue: 400 },
                    xp: 50,
                    executar: (alvo) => { alvo.atributos.gnose += 1; }
                }
            },
            necromancia: {
                transmutar_ectoplasma: {
                    nome: "Condensação Ectoplasmática",
                    desc: "Transmuta 3 Cinzas em 1 Ectoplasma refinado.",
                    reqOficio: 1,
                    custo: { inventario: { cinzas: 3 }, sangue: 100 },
                    xp: 20,
                    executar: (alvo) => { alvo.inventario.ectoplasma = (alvo.inventario.ectoplasma || 0) + 1; }
                },
                lapidar_pedra_alma: {
                    nome: "Lapidação de Pedra de Alma",
                    desc: "Funde 2 Ectoplasmas e 2 Animas numa Pedra da Alma pura.",
                    reqOficio: 2,
                    custo: { inventario: { ectoplasma: 2, anima: 2 }, sangue: 300 },
                    xp: 45,
                    executar: (alvo) => { alvo.inventario.pedraAlma = (alvo.inventario.pedraAlma || 0) + 1; }
                }
            },
            armaria: {
                forjar_laminas_sangue: {
                    nome: "Lâmina Draconiana de Sangue",
                    desc: "Forja uma arma ancestral de alto poder bélico.",
                    reqOficio: 2,
                    custo: { materiais: { ferroNegro: 2 }, inventario: { vitae: 1 }, sangue: 500 },
                    xp: 75,
                    executar: (alvo) => {
                        const novaArma = ForjaDraconiana.gerarReliquia(alvo.nivel, this.reliquiasCustomizadas);
                        alvo.bolsa.push(novaArma);
                    }
                }
            }
        };

        const cat = RECEITAS[categoria];
        if (!cat) return { erro: "Ofício desconhecido." };
        const rec = cat[receitaId];
        if (!rec) return { erro: "Receita inexistente." };

        const nivelAtual = v.oficios[categoria] ? v.oficios[categoria].nivel : 1;
        if (nivelAtual < rec.reqOficio) return { erro: `Exige Grau ${rec.reqOficio} em ${categoria.toUpperCase()}. Teu grau atual é ${nivelAtual}.` };

        if (rec.custo.sangue && v.sangue < rec.custo.sangue) return { erro: `Sangue insuficiente (${rec.custo.sangue} Gts necessários).` };

        if (rec.custo.materiais) {
            for (const [mat, qtd] of Object.entries(rec.custo.materiais)) {
                if ((v.materiais[mat] || 0) < qtd) return { erro: `Material insuficiente: ${mat} (${qtd} necessários).` };
            }
        }
        if (rec.custo.inventario) {
            for (const [inv, qtd] of Object.entries(rec.custo.inventario)) {
                if ((v.inventario[inv] || 0) < qtd) return { erro: `Recurso insuficiente: ${inv} (${qtd} necessários).` };
            }
        }

        if (rec.custo.sangue) v.sangue -= rec.custo.sangue;
        if (rec.custo.materiais) {
            for (const [mat, qtd] of Object.entries(rec.custo.materiais)) v.materiais[mat] -= qtd;
        }
        if (rec.custo.inventario) {
            for (const [inv, qtd] of Object.entries(rec.custo.inventario)) v.inventario[inv] -= qtd;
        }

        rec.executar(v);
        this._ganharXpOficio(v, categoria, rec.xp);
        this._salvarBancoDeDados();

        return {
            sucesso: true,
            relato: `✨ [OFÍCIO]: Fabricaste com perfeição [${rec.nome}]! (+${rec.xp} XP ${categoria.toUpperCase()})`,
            vampiro: v
        };
    }

    repararEquipamentos(vampiroId, slot = 'todos') {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma não encontrada." };
        this.garantirOficios(v);

        let itensParaReparar = [];
        if (slot === 'todos') {
            ['arma', 'armadura', 'amuleto'].forEach(s => {
                if (v.equipamentos && v.equipamentos[s]) itensParaReparar.push(v.equipamentos[s]);
            });
        } else if (v.equipamentos && v.equipamentos[slot]) {
            itensParaReparar.push(v.equipamentos[slot]);
        }

        if (itensParaReparar.length === 0) return { erro: "Nenhum equipamento para reparar." };

        const custoTotalSangue = itensParaReparar.length * 150;
        if (v.sangue < custoTotalSangue) return { erro: `O reparo exige ${custoTotalSangue} Gts de Sangue.` };

        v.sangue -= custoTotalSangue;
        itensParaReparar.forEach(item => { item.durabilidade = 100; });
        this._ganharXpOficio(v, 'armaria', 20 * itensParaReparar.length);
        this._salvarBancoDeDados();

        return {
            sucesso: true,
            relato: `⚔️ [FORJA]: Equipamentos reparados para 100% de durabilidade com sangue fresco.`,
            equipamentos: v.equipamentos,
            sangue: v.sangue
        };
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
            console.error("[ERRO RITUAL]", err);
            return { erro: typeof err === 'string' ? err : (err.message || "Ritual falhou.") };
        }
    }

    _pontuarMembro(vampiroId, pontos = 10) {
        const v = this.vampiros[vampiroId];
        if (!v) return;
        v.influencia = (v.influencia || 0) + pontos;
        if (v.clan && v.clan !== 'Sangue Ralo' && this.clans && this.clans[v.clan]) {
            const c = this.clans[v.clan];
            c.pontos = (c.pontos || 0) + pontos;
            c.gloria = (c.gloria || 0) + pontos;
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
    // 👁️ OSINT / CAÇA EXTREMA (O VÉU RASGADO - GRAU 99)
    // ==========================================

    async mapearMortal(vampiroId, plataforma, identificador) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "O Abismo nao te reconhece." };
        if (!v.osintAprovado) return { erro: "A tua mente nao foi preparada pelo Primordial. O Veu queima a tua visao." };
        if (v.isBot) return { erro: "A Maquina nao interage com o Fio de Prata." };
        if (v.pontosAcao < 1) return { erro: "O 3o Olho exige 1 Furia para focar a visao." };

        if (!identificador || !String(identificador).trim()) {
            return { erro: "Fornece um nome publico, @handle ou URL publica." };
        }

        let idLimpo = String(identificador).trim().toLowerCase();

        if ((plataforma === 'telegram' || plataforma === 'instagram' || plataforma === 'tiktok') && !idLimpo.startsWith('@')) {
            if (isNaN(idLimpo)) idLimpo = '@' + idLimpo;
        }

        if (plataforma === 'whatsapp') {
            return {
                erro: "WhatsApp/telefone e identificador privado. A pesquisa OSINT real aceita apenas identidades publicas, @handles ou URLs publicas."
            };
        }

        const ancoragem = Lexicon.ForjarSigiloMortal(plataforma, idLimpo);
        const hashAlma = ancoragem.sigilo;
        const agora = Date.now();
        const ttlPesquisa = 6 * 60 * 60 * 1000;

        const existente = this.rebanho[hashAlma];
        if (
            existente &&
            existente.osintReal === true &&
            existente.ultimaVarredura &&
            (agora - existente.ultimaVarredura) < ttlPesquisa
        ) {
            return { sucesso: true, mortal: existente, cacheOsint: true };
        }

        v.pontosAcao -= 1;

        const julgamentoDivino = Lexicon.JulgarAlma(idLimpo);
        let hpBase = (julgamentoDivino.pesoEspiritual * 150) + (v.nivel * 50);

        const novo = !existente;
        const mortal = existente || {
            hash: hashAlma,
            identificadorVisivel: idLimpo,
            plataforma,
            qualidade: julgamentoDivino.essencia,
            corrupcao: julgamentoDivino.taxaCorrupcao,
            sangueMax: hpBase,
            sangueAtual: hpBase,
            estado: 'Vibrante',
            maldicaoArcana: null,
            registroMordidas: []
        };

        mortal.leituraAura = "A Mente Abissal esta pesquisando fontes publicas reais...";
        mortal.osintReal = false;
        mortal.osintMotor = null;
        mortal.ultimaVarreduraTentativa = agora;
        this.rebanho[hashAlma] = mortal;
        this._salvarBancoDeDados();

        const dadosIA = await this.oraculo.lerAuraMortal(idLimpo, plataforma, julgamentoDivino);

        if (!dadosIA || !dadosIA.osintReal) {
            v.pontosAcao += 1;

            if (novo) {
                delete this.rebanho[hashAlma];
            } else {
                mortal.leituraAura = existente.leituraAura || "Pesquisa publica indisponivel.";
            }

            this._salvarBancoDeDados();

            return {
                erro: dadosIA?.erro || dadosIA?.aura || "A pesquisa OSINT real falhou. Nenhum perfil foi inventado."
            };
        }

        mortal.leituraAura = dadosIA.aura;
        mortal.osintReal = true;
        mortal.osintMotor = dadosIA.motor || 'browser_search';
        mortal.ultimaVarredura = dadosIA.pesquisadoEm || Date.now();

        this.ganharXP(vampiroId, 5);
        this._registrarEventoEspecial(
            'caca',
            'O VEU RASGADO',
            `A identidade publica [${idLimpo}] foi pesquisada em fontes abertas por ${v.nome}.`
        );

        this._salvarBancoDeDados();

        if (global.io) {
            global.io.emit('aura_atualizada', hashAlma);
            global.io.emit('sync_geral');
        }

        return {
            sucesso: true,
            mortal,
            pesquisaReal: true,
            motorPesquisa: mortal.osintMotor
        };
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
        if (!respostaIA) return "O Abismo observa em silêncio absoluto.";

        let efeitosExecutados = [];

        // 1. DAR SANGUE (DAR_SANGUE ou GOTA)
        const regexDarSangue = /\[DAR_SANGUE:\s*({.*?})\s*\]/is;
        const matchDarSangue = respostaIA.match(regexDarSangue);
        if (matchDarSangue) {
            try {
                const dados = JSON.parse(matchDarSangue[1].replace(/```json/gi, '').replace(/```/g, '').trim());
                const qtd = parseInt(dados.qtd) || 300;
                v.sangue = (v.sangue || 0) + qtd;
                efeitosExecutados.push("🩸 +" + qtd + " Gts (" + (dados.motivo || 'concedidas pelo Mestre') + ")");
                respostaIA = respostaIA.replace(regexDarSangue, '').trim();
            } catch(e) { console.error("Erro parsing DAR_SANGUE:", e); }
        } else {
            const regexGota = /\[GOTA:\s*(\d+)\]/i;
            const matchGota = respostaIA.match(regexGota);
            if (matchGota && matchGota[1]) {
                const qtdGota = parseInt(matchGota[1]);
                v.sangue = (v.sangue || 0) + qtdGota;
                efeitosExecutados.push("🩸 +" + qtdGota + " Gts injetadas nas tuas veias");
                respostaIA = respostaIA.replace(regexGota, '').trim();
            }
        }

        // 2. DAR ITEM / MATERIAIS
        const regexDarItem = /\[DAR_ITEM:\s*({.*?})\s*\]/is;
        const matchDarItem = respostaIA.match(regexDarItem);
        if (matchDarItem) {
            try {
                const dados = JSON.parse(matchDarItem[1].replace(/```json/gi, '').replace(/```/g, '').trim());
                const itemKey = dados.item || 'ferroNegro';
                const qtd = parseInt(dados.qtd) || 1;
                if (!v.materiais) v.materiais = { ferroNegro: 0, pedra: 0, mandragora: 0 };
                if (!v.inventario) v.inventario = { anima: 0, cinzas: 0, vitae: 0, ectoplasma: 0, pedraAlma: 0 };

                if (v.materiais[itemKey] !== undefined) {
                    v.materiais[itemKey] = (v.materiais[itemKey] || 0) + qtd;
                } else if (v.inventario[itemKey] !== undefined) {
                    v.inventario[itemKey] = (v.inventario[itemKey] || 0) + qtd;
                } else {
                    v.materiais['ferroNegro'] = (v.materiais['ferroNegro'] || 0) + qtd;
                }
                efeitosExecutados.push("📦 +" + qtd + "x [" + (dados.nome || itemKey) + "] materializado na tua posse");
                respostaIA = respostaIA.replace(regexDarItem, '').trim();
            } catch(e) { console.error("Erro parsing DAR_ITEM:", e); }
        }

        // 3. CONJURAR DEMÔNIO / FENDA ASTRAL (BOSS NO CONCLAVE)
        const regexDem = /\[CONJURAR_DEMONIO:\s*({.*?})\s*\]/is;
        const matchDem = respostaIA.match(regexDem);
        if (matchDem) {
            try {
                const dados = JSON.parse(matchDem[1].replace(/```json/gi, '').replace(/```/g, '').trim());
                const fendaId = crypto.randomBytes(4).toString('hex');
                const hpFinal = parseInt(dados.hp) || (Math.max(1, v.nivel || 1) * 1000);
                const nomeDemonio = dados.nome || "Arauto Goétia Invocado";
                this.fendaAtiva[fendaId] = {
                    id: fendaId,
                    nome: nomeDemonio,
                    hpMax: hpFinal,
                    hpAtual: hpFinal,
                    dano: parseInt(dados.dano) || 120,
                    loot: dados.loot || "pedraAlma",
                    criador: v.nome
                };
                efeitosExecutados.push("👹 DEMÔNIO CONJURADO NO CONCLAVE: [" + nomeDemonio + "]");
                respostaIA = respostaIA.replace(regexDem, '').trim();
                this._registrarEventoEspecial('global', 'CONJURAÇÃO DO MESTRE', "O Mestre das Sombras rasgou o Véu e manifestou o demônio [" + nomeDemonio + "] perante " + v.nome + "! Conclave em chamas!", true);
            } catch(e) { console.error("Erro parsing CONJURAR_DEMONIO:", e); }
        } else {
            const regexFenda = /\[FENDA_ASTRAL:\s*({.*?})\s*\]/is;
            const matchFenda = respostaIA.match(regexFenda);
            if (matchFenda) {
                try {
                    let fendaTxt = matchFenda[1].replace(/```json/gi, '').replace(/```/g, '').trim();
                    const dadosFenda = JSON.parse(fendaTxt);
                    const fendaId = crypto.randomBytes(4).toString('hex');
                    let hpFinal = parseInt(dadosFenda.hp) || ((v.nivel || 1) * 500);
                    this.fendaAtiva[fendaId] = { 
                        id: fendaId, 
                        nome: dadosFenda.nome || "Aberração Sem Nome", 
                        hpMax: hpFinal, hpAtual: hpFinal, 
                        dano: parseInt(dadosFenda.dano) || 100, 
                        loot: dadosFenda.loot || "cinzas", 
                        criador: v.nome 
                    };
                    efeitosExecutados.push("🌌 FENDA DO CONCLAVE ABERTA: [" + this.fendaAtiva[fendaId].nome + "]");
                    respostaIA = respostaIA.replace(regexFenda, '').trim();
                    this._registrarEventoEspecial('global', 'A FENDA ABRIU', "A Malha rasgou-se! O Oráculo conjurou a entidade [" + this.fendaAtiva[fendaId].nome + "] a pedido de " + v.nome + "! Destruam-na no Conclave!", true);
                } catch (e) { console.error("Falha ao injetar fenda.", e); }
            }
        }

        // 4. CASTIGAR
        const regexCastigo = /\[CASTIGAR:\s*({.*?})\s*\]/is;
        const matchCastigo = respostaIA.match(regexCastigo);
        if (matchCastigo) {
            try {
                const dados = JSON.parse(matchCastigo[1].replace(/```json/gi, '').replace(/```/g, '').trim());
                const qtdDreno = parseInt(dados.qtd) || 200;
                v.sangue = Math.max(0, (v.sangue || 0) - qtdDreno);
                v.pontosAcao = Math.max(0, (v.pontosAcao || 0) - 5);
                efeitosExecutados.push("⚡ CASTIGO DO MESTRE: -" + qtdDreno + " Gts e -5 Fúria (" + (dados.motivo || 'insolência') + ")");
                respostaIA = respostaIA.replace(regexCastigo, '').trim();
            } catch(e) { console.error("Erro parsing CASTIGAR:", e); }
        }

        // 5. REJEITAR
        const regexRejeitar = /\[REJEITAR:\s*["']?(.*?)["']?\]/is;
        const matchRejeitar = respostaIA.match(regexRejeitar);
        if (matchRejeitar) {
            respostaIA = respostaIA.replace(regexRejeitar, '').trim();
        }

        if (efeitosExecutados.length > 0) {
            respostaIA += "\n\n*(Manifestação Oculta em Tempo Real: " + efeitosExecutados.join(' | ') + ")*";
            if (global.io) {
                global.io.to("priv_" + v.id).emit('tick');
                global.io.emit('sync_geral');
            }
        }
        
        this._salvarBancoDeDados(); 
        return respostaIA;
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
	tickDungeons() {
        if (this.mundo2D) {
            try { this.mundo2D.tickMundo(); } catch(e) {}
        }
        if (!this.dungeons) return;
        let atualizouAlgo = false;
        
        for (let dId in this.dungeons) {
            let d = this.dungeons[dId];
            if (d.status === 'combate') continue;
            
            let moves = [[0,1], [0,-1], [1,0], [-1,0]];
            d.entidades.forEach(ent => {
                if (ent.tipo === 'mob' || ent.tipo === 'boss') {
                    if (Math.random() > 0.5) { // 50% chance de mover
                        let m = moves[Math.floor(Math.random() * moves.length)];
                        let nx = ent.x + m[0]; let ny = ent.y + m[1];
                        
                        // Verifica se não bate na parede
                        if (nx > 0 && ny > 0 && nx < d.largura && ny < d.altura && d.grid[ny][nx] === 1) {
                            // Verifica se não colide com jogador
                            let playerHit = Object.values(d.players).find(p => p.x === nx && p.y === ny);
                            if(!playerHit) { 
                                ent.x = nx; ent.y = ny; 
                                atualizouAlgo = true; 
                            }
                        }
                    }
                }
            });
            // Envia o update em tempo real
            if (atualizouAlgo && global.io) {
                global.io.to(dId).emit('dungeon_update', d);
            }
        }
    }
	// ==========================================
    // CICLO TEMPORAL E EVENTOS GLOBAIS (CORREÇÃO DO CRASH)
    // ==========================================
// Substitui a função inteira tickTemporal():
    tickTemporal() {
        const lua = AstrolabioLunar.obterFaseAtual();
        if (Math.random() > 0.85) this.gerarAldeiaProcedural();

        // Cercos (IA)
        if (Math.random() > 0.85) { 
            let vitimas = Object.values(this.vampiros).filter(v => v.estado !== 'Banido' && v.nivel >= 5 && !Object.values(this.cercosAtivos).some(c => c.alvoId === v.id));
            if (vitimas.length > 0) {
                let alvo = vitimas[Math.floor(Math.random() * vitimas.length)];
                let cercoId = crypto.randomBytes(4).toString('hex');
                let demonName = ["Asmodeus", "Belial", "Pazuzu", "Marchosias"][Math.floor(Math.random()*4)];
                this.cercosAtivos[cercoId] = { id: cercoId, alvoId: alvo.id, alvoNome: alvo.nome, clanNome: alvo.clan, demonio: demonName, hpAtual: alvo.nivel*5000, hpMax: alvo.nivel*5000, danoTick: Math.min(500, alvo.nivel * 15) };
                this._registrarEventoEspecial('global', 'MOTIM DEMONÍACO', `O exército de ${demonName} sitiou a alma de [${alvo.nome}]! Auxiliem-no no Conclave.`, true);
            }
        }

        for(let cid in this.cercosAtivos) {
            let cerco = this.cercosAtivos[cid]; let alvo = this.vampiros[cerco.alvoId];
            if(alvo && alvo.estado !== 'Banido') {
                alvo.hpAtual -= cerco.danoTick;
                if (alvo.hpAtual <= 0) {
                    alvo.hpAtual = 0; alvo.estado = 'Banido'; 
                    this._registrarEventoEspecial('global', 'DEVORADO', `A alma de ${alvo.nome} foi rasgada pelas hostes de ${cerco.demonio}.`, true); 
                    delete this.cercosAtivos[cid];
                }
            }
        }

        for (let hash in this.rebanho) { let m = this.rebanho[hash]; if (m.estado === 'Vibrante' && m.maldicaoArcana) m.sangueAtual = Math.max(1, m.sangueAtual - 1); }
        
        for (let id in this.vampiros) {
            let v = this.vampiros[id];
            if (v.estado === 'Ativo') {
                const atrTotais = this._obterAtributosTotais(v); 
                v.pontosAcao = Number(v.pontosAcao) || 0;
                v.maxAcao = Number(v.maxAcao) || 10;

                if (v.pontosAcao < v.maxAcao) {
                    let recup = lua.id === 'crescente' ? 0.8 : 0.5; 
                    if (Math.random() < recup) v.pontosAcao++;
                }

                // PILAR 2: A INQUISIÇÃO (Dano Contínuo)
                if (v.maldicaoInquisicao) {
                    v.sangue = Math.max(0, v.sangue - (v.nivel * 10)); // O ouro vaza
                    v.hpAtual -= (v.nivel * 2); // A carne queima
                    if(global.io && Math.random() > 0.5) global.io.to(`priv_${v.id}`).emit('dungeon_msg', { msg: `🔥 A Fúria Solar queima-te por dentro. Encontra o Inquisidor no Umbral!`, cor: '#ff1e2f' });
                }

                if (v.nivel > 2) v.sangue = Math.max(0, Number(v.sangue || 0) - 1);

                if (v.sangue <= 0 || v.hpAtual <= 0) { 
                    if (v.geracao === 1) { v.sangue = 100000; v.hpAtual = v.hpMax; } 
                    else if (v.calice > 0) { v.sangue += v.calice; v.calice = 0; } 
                    else if (v.nivel > 2) { v.estado = 'Banido'; this._registrarEventoEspecial('global', 'O FIM DA BESTA', `O corpo de ${v.nome} virou pó.`); }
                }
            }
            if (v.calice > 0) {
                v.cicloCalice = (v.cicloCalice || 0) + 1;
                if (v.cicloCalice >= 10) {
                    v.cicloCalice = 0;
                    const rendimento = Math.max(1, Math.floor(v.calice * 0.02));
                    v.calice += rendimento;
                    v.caliceRendimentoTotal = (v.caliceRendimentoTotal || 0) + rendimento;
                }
            }
        }      
        
        for (let c in this.clans) { if (this.clans[c].cofre > 0) this.clans[c].cofre -= Math.floor(this.clans[c].cofre * 0.05); }
        
        // PILAR 6: O MERCADO FLUTUANTE
        if (Math.random() > 0.8) {
            let desc = this.balancaCosmica.regente === 'Tiamat (Vampiros)' ? 0.8 : 1.2;
            if (this.alquimia['elixir_estamina']) this.alquimia['elixir_estamina'].custo.gts = Math.floor(300 * desc);
        }

        if (Math.random() > 0.98 && !this.caravanaAtiva) { this.caravanaAtiva = { hp: 50000, assaltantes: [] }; }
        if (Math.random() > 0.98 && !this.heregeMarcado) { this.heregeMarcado = { hp: 15000, nome: "Kael, O Traidor", ativo: true }; }

        this.processarServosNoTick();
        if (Math.random() > 0.8) this._salvarBancoDeDados(); 
    }
// ==========================================
    // SISTEMA AVANÇADO DE REINOS E SERVOS (MINIONS IA)
    // ==========================================

    async invocarServoIA(vampiroId, nomeServo) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Fantasma." };
        if (v.nivel < 25) return { erro: "O Abismo exige o Grau 25 para escravizar almas eternas." };
        if (v.sangue < 10000 || v.pontosAcao < 10) return { erro: "A invocação exige 10.000 Gts e 10 Fúrias." };
        
        if (!v.servos) v.servos = [];
        if (v.servos.length >= Math.floor(v.nivel / 10)) return { erro: "Atingiste o limite de servos para a tua aura." };

        v.sangue -= 10000;
        v.pontosAcao -= 10;

        const servo = {
            id: crypto.randomBytes(4).toString('hex'),
            nome: nomeServo,
            ordemAtual: 'idle', // idle, farmar_ouro, farmar_reliquias, proteger_lorde, protocolo_ressurreicao
            recursos: { gts: 0, anima: 0, cinzas: 0 },
            relato: "Aguardo as tuas ordens, Mestre.",
            lealdade: 100
        };

        v.servos.push(servo);
        
        let falaIA = await this.oraculo.gerarNarrativaProcedural("Invocação de Servo", `O servo ${nomeServo} ergueu-se do pó, jurando servidão eterna a ${v.nome}.`, "Pacto Sombrio");
        this._registrarEventoEspecial('global', 'NOVO SERVO INVOCADO', falaIA, true);
        this._salvarBancoDeDados();

        return { sucesso: true, relato: `A criatura [${nomeServo}] ergueu-se das sombras para te servir.` };
    }

    async darOrdemServoIA(vampiroId, servoId, comandoTexto) {
        const v = this.vampiros[vampiroId];
        if (!v || !v.servos) return { erro: "Fantasma." };
        const servo = v.servos.find(s => s.id === servoId);
        if (!servo) return { erro: "Servo não encontrado." };

        let promptIA = "O Lorde Sombrio ordenou ao seu escravo morto-vivo: \"" + comandoTexto + "\".\n" +
"Classifique a ordem EXATAMENTE em UMA destas categorias: \n" +
"1. \"farmar_ouro\" (Se ele mandou buscar dinheiro, sangue, caçar)\n" +
"2. \"farmar_recursos\" (Se ele mandou buscar materiais, anima, cinzas)\n" +
"3. \"protocolo_ressurreicao\" (Se ele mandou prepararem-se para o reviver caso ele morra)\n" +
"4. \"espionar_inimigos\" (Se mandou vigiar outros jogadores ou roubar influência)\n" +
"5. \"forjar_armas\" (Se mandou construir equipamento ou relíquias)\n" +
"6. \"idle\" (Qualquer outra coisa)\n\n" +
"RETORNE APENAS UM JSON EXATO: {\"categoria\": \"farmar_ouro\", \"fala_do_servo\": \"Sim mestre, vou cumprir o seu desejo.\"}";

        try {
            const raw = await this.oraculo.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS. És a entidade que comanda os servos mortos-vivos." },
                { role: "user", content: promptIA }
            ], { json: true, temperature: 0.7 });
            const intencao = this.oraculo._extrairJson(raw);
            
            if (intencao && intencao.categoria) {
                servo.ordemAtual = intencao.categoria;
                servo.relato = intencao.fala_do_servo || "Sim, meu soberano.";
                this._salvarBancoDeDados();
                return { sucesso: true, relato: "[" + servo.nome + "]: \"" + servo.relato + "\" (Comando aceite: " + servo.ordemAtual + ")" };
            }
        } catch (e) {}

        // Fallback inteligente baseado nas palavras-chave do comando
        const txt = (comandoTexto || '').toLowerCase();
        if (txt.includes('sangue') || txt.includes('ouro') || txt.includes('caçar') || txt.includes('dinheiro')) {
            servo.ordemAtual = 'farmar_ouro';
            servo.relato = "Farei sangrar os fracos para saciar o vosso tesouro.";
        } else if (txt.includes('material') || txt.includes('cinza') || txt.includes('recurso') || txt.includes('pedra') || txt.includes('ferro')) {
            servo.ordemAtual = 'farmar_recursos';
            servo.relato = "Vou desenterrar os materiais das catacumbas.";
        } else if (txt.includes('reviver') || txt.includes('vida') || txt.includes('morte') || txt.includes('ressurreição')) {
            servo.ordemAtual = 'protocolo_ressurreicao';
            servo.relato = "Permanecerei em vigília para reanimar a vossa essência se caíres.";
        } else if (txt.includes('vigiar') || txt.includes('espionar') || txt.includes('inimigo')) {
            servo.ordemAtual = 'espionar_inimigos';
            servo.relato = "As minhas sombras seguirão os passos dos vossos rivais.";
        } else if (txt.includes('forjar') || txt.includes('arma') || txt.includes('relíquia')) {
            servo.ordemAtual = 'forjar_armas';
            servo.relato = "Trabalharei o ferro negro na forja silenciosa.";
        } else {
            servo.ordemAtual = 'idle';
            servo.relato = "Aguardando novas ordens do mestre.";
        }
        this._salvarBancoDeDados();
        return { sucesso: true, relato: "[" + servo.nome + "]: \"" + servo.relato + "\" (Comando aceite: " + servo.ordemAtual + ")" };
    }

    coletarTributosServo(vampiroId, servoId) {
        const v = this.vampiros[vampiroId];
        if (!v || !v.servos) return { erro: "Fantasma." };
        const servo = v.servos.find(s => s.id === servoId);
        if (!servo) return { erro: "Servo não encontrado." };

        let gts = servo.recursos.gts; let ani = servo.recursos.anima; let cin = servo.recursos.cinzas;
        if (gts === 0 && ani === 0 && cin === 0) return { erro: "As mãos do servo estão vazias." };

        v.sangue += gts;
        v.inventario.anima = (v.inventario.anima || 0) + ani;
        v.inventario.cinzas = (v.inventario.cinzas || 0) + cin;

        servo.recursos = { gts: 0, anima: 0, cinzas: 0 };
        this._salvarBancoDeDados();

        return { sucesso: true, relato: `Recolheste ${gts} Gts, ${ani} Anima e ${cin} Cinzas das mãos calejadas de ${servo.nome}.` };
    }

    evoluirEdificioReino(vampiroId, edificio) {
        const v = this.vampiros[vampiroId];
        if (!v || v.clan === 'Sangue Ralo') return { erro: "Não tens clã." };
        const clan = this.clans[v.clan];
        if (clan.lider !== v.id) return { erro: "Apenas o Rei pode evoluir as infraestruturas." };
        const reino = this.reinos[clan.reino];
        if (!reino) return { erro: "Não fundaste um Reino." };

        let custoGts = 25000 * (reino.edificacoes[edificio] + 1);
        if (clan.cofre < custoGts) return { erro: `O cofre do clã necessita de ${custoGts} Gts para erguer isto.` };

        clan.cofre -= custoGts;
        reino.edificacoes[edificio]++;
        
        let nomeEdificio = edificio === 'muralha' ? "Muralha de Ossos" : (edificio === 'mercadoNegro' ? "Mercado Negro" : "Torre de Sangue");
        this._registrarEventoEspecial('global', 'O IMPÉRIO CRESCE', `O Reino de [${reino.nome}] evoluiu a sua [${nomeEdificio}] para o Nível ${reino.edificacoes[edificio]}!`, true);
        this._salvarBancoDeDados();
        return { sucesso: true, relato: `Infraestrutura evoluída com sucesso.` };
    }

    // --- LÓGICA AUTÓNOMA A SER INSERIDA NO tickTemporal() ---
    processarServosNoTick() {
        for (let id in this.vampiros) {
            let v = this.vampiros[id];
            if (!v.servos || v.servos.length === 0) continue;

            // O MILAGRE NEGRO: PROTOCOLO DE RESSURREIÇÃO OFFLINE
            if (v.estado === 'Banido' || v.status === 'Cinzas' || v.hpAtual <= 0) {
                let servoSalvador = v.servos.find(s => s.ordemAtual === 'protocolo_ressurreicao');
                if (servoSalvador) {
                    // O servo grinda poder no umbral secretamente para reviver o mestre
                    servoSalvador.recursos.anima += 1;
                    if (servoSalvador.recursos.anima >= 30) { // Demora uns bons minutos reais
                        v.estado = 'Ativo';
                        v.status = 'Ativo';
                        v.hpAtual = v.hpMax * 0.5; // Volta com 50% da vida
                        v.sangue = Math.max(v.sangue || 0, 1000);
                        servoSalvador.recursos.anima = 0;
                        servoSalvador.ordemAtual = 'idle'; // Reseta a ordem
                        
                        this._registrarEventoEspecial('global', 'RESSURREIÇÃO PROFANA', `A morte tentou levar [${v.nome}], mas o seu leal servo [${servoSalvador.nome}] sacrificou a própria essência para rasgar o Véu e devolver o seu Lorde à vida!`, true);
                    }
                }
                continue; // Se o lorde está morto, os outros servos não fazem mais nada.
            }

// O lorde está vivo. Os servos trabalham.
            // O lorde está vivo. Os servos trabalham.
            v.servos.forEach(servo => {
                if (servo.ordemAtual === 'farmar_ouro') {
                    if (Math.random() > 0.5) servo.recursos.gts += Math.floor(50 + (v.nivel * 10));
                } else if (servo.ordemAtual === 'farmar_recursos') {
                    if (Math.random() > 0.7) servo.recursos.anima += 1;
                    if (Math.random() > 0.7) servo.recursos.cinzas += 1;
                } else if (servo.ordemAtual === 'espionar_inimigos') {
                    if (Math.random() > 0.95) { // É raro, mas rouba influência de outros jogadores aleatórios!
                        let alvos = Object.values(this.vampiros).filter(x => x.id !== v.id && x.influencia > 0);
                        if(alvos.length > 0) {
                            let vitima = alvos[Math.floor(Math.random() * alvos.length)];
                            vitima.influencia -= 1;
                            v.influencia += 1;
                            servo.relato = `Mestre, roubei segredos de [${vitima.nome}]. Ganhaste +1 Influência.`;
                        }
                    }
                } else if (servo.ordemAtual === 'forjar_armas') {
                    if (Math.random() > 0.98) { // Gera equipamento fraco passivamente
                        const lixo = ForjaDraconiana.gerarReliquia(Math.max(1, v.nivel - 10));
                        v.bolsa.push(lixo);
                        servo.relato = `Mestre, as minhas mãos sangraram, mas forjei [${lixo.nome}] para o seu arsenal.`;
               }
			 }  
            });
        }
    }
} // <--- ESTA CHAVE FALTAVA AQUI PARA FECHAR A CLASSE SHADOWCORE

module.exports = { ShadowCore, AstrolabioLunar, GeradorDeItensProcedural, MundoAberto2D };