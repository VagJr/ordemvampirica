// server.js
try { process.loadEnvFile(); } catch(e) {}
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api'); 
const { MongoClient } = require('mongodb');
const { ShadowCore, AstrolabioLunar } = require('./ShadowCore.js');
const SocialCore = require('./SocialCore.js');
const Lexicon = require('./LexiconSanguinis.js'); 

const app = express();
global.__ordemStartedAt = new Date().toISOString();
const server = http.createServer(app);
// ==========================================
// CONFIGURAÇÃO BLINDADA DO SERVIDOR (FLY.IO)
// ==========================================
// Adiciona Keep-Alive (ping) e força compatibilidade de rede
const io = new Server(server, { 
    cors: { origin: "*" },
    pingInterval: 25000,   // O servidor manda um "sinal de vida" a cada 25s
    pingTimeout: 60000,    // Só considera que o jogador caiu após 60s sem resposta
    transports: ['websocket', 'polling'] // Garante que se o websocket falhar, ele usa polling
});
global.io = io; 

// ==========================================
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ""; 
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://ordem:J6VBrGAT9qKSLwzS@cluster0.ubbpacg.mongodb.net/?retryWrites=true&w=majority"; 

let bot = null;
if(BOT_TOKEN && BOT_TOKEN.length > 10) {
    try { bot = new TelegramBot(BOT_TOKEN, { polling: false }); } 
    catch (e) { console.warn("Aviso: Falha ao invocar o Bot do Telegram."); }
}

const enviarDMSombria = async (tgId, mensagem) => {
    if (bot && tgId && tgId.toString().length > 5) {
        try { await bot.sendMessage(tgId, `🦇 *SUSSURRO DA CORTE:*\n\n${mensagem}`, { parse_mode: "Markdown" }); } 
        catch(e) { }
    }
};

// ==========================================
// MOTOR PROFISSIONAL DE SINCRONIZAÇÃO PRIVADA
// ==========================================
function forcarSyncJogador(id) {
    try {
        if(core.vampiros[id]) {
            const v = core.vampiros[id];
            let dados = {...v, atributosTotais: core._obterAtributosTotais(v)};
            
            if (v.clan !== 'Sangue Ralo' && core.clans[v.clan]) {
                let clanInfo = JSON.parse(JSON.stringify(core.clans[v.clan]));
                clanInfo.membrosObjetos = (clanInfo.membros || []).map(mid => {
                    return { id: mid, nome: core.vampiros[mid] ? core.vampiros[mid].nome : "Sombra Fragmentada" };
                });
                dados.clanData = clanInfo;
            }
            
            dados.faseLua = AstrolabioLunar.obterFaseAtual();
            dados.pactoAtivo = core.pactosAtivos[v.id] || null;
            dados.poderGeral = core.calcularPoderGeral(v); 
            dados.patente = core._calcularPatente(v); 
            
            const senhor = v.senhor === 'O_PRIMORDIAL' ? null : core.vampiros[v.senhor];
            dados.dadosSenhor = senhor ? { nome: senhor.nome, titulo: senhor.tituloAtual, geracao: senhor.geracao } : { nome: "A Própria Noite", titulo: "Vazio Cósmico", geracao: 0 };
            dados.dadosCrias = (v.linhagem || []).map(cId => { const c = core.vampiros[cId]; return c ? { nome: c.nome, nivel: c.nivel, estado: c.estado } : null; }).filter(Boolean);

            // CORREÇÃO: Puxar o cache do servidor atualizado
            const dadosCacheServidor = {
                clans: core.clans, leilaoP2P: core.leilaoP2P, logs: core.logs,
                balancaCosmica: core.balancaCosmica, evocacaoAtiva: core.evocacaoAtiva,
                fendaAtiva: core.fendaAtiva, caravanaAtiva: core.caravanaAtiva,
                heregeMarcado: core.heregeMarcado, altarEclipse: core.altarEclipse,
                reinos: core.reinos, climaAstral: core.oraculo.climaAstral,
                faseLua: dados.faseLua
            };

            // Envia o pacote completo (Vampiro + Servidor)
            global.io.to(`priv_${id}`).emit('sync_imediato', { vampiro: dados, servidor: dadosCacheServidor });
        }
    } catch(e) { console.error("Falha no Sync Privado:", e); }
}

app.use(express.json());
app.use(express.static(__dirname));
app.get('/api/build-info', (req, res) => {
    res.json({
        app: 'ordemvampirica',
        nosferatuVersion: 'REALTIME_OSINT_V3',
        renderCommit: process.env.RENDER_GIT_COMMIT || null,
        renderServiceId: process.env.RENDER_SERVICE_ID || null,
        nodeEnv: process.env.NODE_ENV || null,
        groqConfigured: Boolean(process.env.GROQ_API_KEY),
        groqOsintModel: process.env.GROQ_OSINT_MODEL || 'groq/compound',
        startedAt: global.__ordemStartedAt || null
    });
});


// ==========================================
// BANCO DE DADOS INTEGRADO & MONGODB ATLAS
// ==========================================
const core = new ShadowCore();
core.social = new SocialCore(core);
const DB_FILE_PATH = path.join(__dirname, 'data', 'sanguinis_banco.json');

function salvarBancoLocal() {
    try {
        const dir = path.dirname(DB_FILE_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const data = {
            vampiros: core.vampiros || {},
            rebanho: core.rebanho || {},
            clans: core.clans || {},
            leilaoP2P: core.leilaoP2P || [],
            leilaoIdCounter: core.leilaoIdCounter || 1,
            logs: core.logs || { global: [], caca: [], guerra: [] },
            manuscritos: core.manuscritos || [],
            grimorioCustomizado: core.grimorioCustomizado || {},
            balancaCosmica: core.balancaCosmica || { tiamat: 0, seth: 0, regente: 'Equilíbrio' },
            evocacaoAtiva: core.evocacaoAtiva || null,
            fendaAtiva: core.fendaAtiva || {},
            pactosAtivos: core.pactosAtivos || {},
            reliquiasCustomizadas: core.reliquiasCustomizadas || [],
            historicoChat: core.historicoChat || { global: [], clan: {}, privado: {} },
            reinos: core.reinos || {},
            mundo2D: core.mundo2D ? core.mundo2D.salvarEstado() : null,
            mercadoItens: core.mercadoItens || [],
            mercadoIdCounter: core.mercadoIdCounter || 1,
            social: core.social ? core.social.salvarEstado() : null,
            ultimaGravacao: new Date().toISOString()
        };
        const tempPath = DB_FILE_PATH + '.tmp';
        fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
        fs.renameSync(tempPath, DB_FILE_PATH);
    } catch (e) {
        console.error("❌ Falha ao salvar banco de dados integrado local:", e.message);
    }
}

function carregarBancoLocal() {
    try {
        if (fs.existsSync(DB_FILE_PATH)) {
            const raw = fs.readFileSync(DB_FILE_PATH, 'utf8');
            if (raw && raw.trim().length > 0) {
                const doc = JSON.parse(raw);
                if (doc.vampiros) core.vampiros = doc.vampiros;
                if (doc.rebanho) core.rebanho = doc.rebanho;
                // [EXPURGO DE TESTES]: Remove qualquer vítima residual de teste (Tesla)
                if (core.rebanho) {
                    for (const k of Object.keys(core.rebanho)) {
                        const m = core.rebanho[k];
                        if (m && (m.identificadorVisivel?.toLowerCase().includes('tesla') || m.dadosOsint?.nomeAstral?.toLowerCase().includes('tesla') || m.dadosOsint?.nomeReal?.toLowerCase().includes('tesla'))) {
                            delete core.rebanho[k];
                        }
                    }
                }
                if (core.vampiros) {
                    for (const vid in core.vampiros) {
                        const v = core.vampiros[vid];
                        if (v && v.alvosNosferatu) {
                            v.alvosNosferatu = v.alvosNosferatu.filter(a => !a.nomeAstral?.toLowerCase().includes('tesla') && !a.nomeReal?.toLowerCase().includes('tesla') && !a.alvoId?.toLowerCase().includes('tesla'));
                        }
                    }
                }
                if (doc.clans) core.clans = doc.clans;
                if (doc.leilaoP2P) core.leilaoP2P = doc.leilaoP2P;
                if (doc.leilaoIdCounter) core.leilaoIdCounter = doc.leilaoIdCounter;
                if (doc.logs) core.logs = doc.logs;
                if (doc.manuscritos) core.manuscritos = doc.manuscritos;
                if (doc.grimorioCustomizado) core.grimorioCustomizado = doc.grimorioCustomizado;
                if (doc.balancaCosmica) core.balancaCosmica = doc.balancaCosmica;
                if (doc.evocacaoAtiva !== undefined) core.evocacaoAtiva = doc.evocacaoAtiva;
                if (doc.fendaAtiva) core.fendaAtiva = doc.fendaAtiva;
                if (doc.pactosAtivos) core.pactosAtivos = doc.pactosAtivos;
                if (doc.reliquiasCustomizadas) core.reliquiasCustomizadas = doc.reliquiasCustomizadas;
                if (doc.historicoChat) core.historicoChat = doc.historicoChat;
                if (doc.reinos) core.reinos = doc.reinos;
                if (doc.mundo2D && core.mundo2D) core.mundo2D.carregarEstado(doc.mundo2D);
                if (doc.mercadoItens) core.mercadoItens = doc.mercadoItens;
                if (doc.mercadoIdCounter) core.mercadoIdCounter = doc.mercadoIdCounter;
                if (doc.social && core.social) core.social.carregarEstado(doc.social);
                if (typeof core._construirFuncoesCustomizadas === 'function' && core.grimorioCustomizado) {
                    Object.assign(core.grimorio, core._construirFuncoesCustomizadas(core.grimorioCustomizado));
                }
                console.log(`💾 [BANCO INTEGRADO] Base de dados restaurada de ${DB_FILE_PATH} com sucesso! (${Object.keys(core.vampiros).length} vampiros/contas carregados)`);
                return true;
            }
        }
    } catch (e) {
        console.error("❌ Erro ao ler banco integrado local:", e.message);
    }
    return false;
}

async function inicializarServidor() {
    console.log("🌌 Inicializando persistência do reino...");
    const carregouLocal = carregarBancoLocal();

    let mongoConectado = false;
    if (MONGO_URI) {
        try {
            console.log("🌌 A conectar ao Monólito do MongoDB Atlas...");
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db('sanguinis_db');
            core.mongoClient = client;
            core.collection = db.collection('registos_akashicos');
            const doc = await core.collection.findOne({ _id: 'MATRIZ_PRINCIPAL' });
            
            if (doc && Object.keys(doc.vampiros || {}).length > 0) {
                core.vampiros = doc.vampiros || {};
                core.rebanho = doc.rebanho || {};
                core.clans = doc.clans || {};
                core.leilaoP2P = doc.leilaoP2P || [];
                core.leilaoIdCounter = doc.leilaoIdCounter || 1;
                core.logs = doc.logs || { global: [], caca: [], guerra: [] };
                core.manuscritos = doc.manuscritos || [];
                core.grimorioCustomizado = doc.grimorioCustomizado || {};
                core.balancaCosmica = doc.balancaCosmica || { tiamat: 0, seth: 0, regente: 'Equilíbrio' };
                core.evocacaoAtiva = doc.evocacaoAtiva || null;
                core.fendaAtiva = doc.fendaAtiva || {};
                core.pactosAtivos = doc.pactosAtivos || {};
                core.reliquiasCustomizadas = doc.reliquiasCustomizadas || [];
                core.historicoChat = doc.historicoChat || { global: [], clan: {}, privado: {} };
                core.reinos = doc.reinos || {};
                if (doc.mundo2D && core.mundo2D) core.mundo2D.carregarEstado(doc.mundo2D);
                if (doc.mercadoItens) core.mercadoItens = doc.mercadoItens;
                if (doc.mercadoIdCounter) core.mercadoIdCounter = doc.mercadoIdCounter;
                if (doc.social && core.social) core.social.carregarEstado(doc.social);
                if (typeof core._construirFuncoesCustomizadas === 'function' && core.grimorioCustomizado) {
                    Object.assign(core.grimorio, core._construirFuncoesCustomizadas(core.grimorioCustomizado));
                }
                salvarBancoLocal();
                console.log(`🦇 [MONGODB ATLAS] Base viva carregada da escuridão do Atlas! (${Object.keys(core.vampiros).length} vampiros ativos)`);
            } else {
                console.log("🌑 [MONGODB ATLAS] Monólito inicial vazio. Realizando seeding dos dados locais para o Atlas...");
                const seedData = {
                    vampiros: core.vampiros || {},
                    rebanho: core.rebanho || {},
                    clans: core.clans || {},
                    leilaoP2P: core.leilaoP2P || [],
                    leilaoIdCounter: core.leilaoIdCounter || 1,
                    logs: core.logs || { global: [], caca: [], guerra: [] },
                    manuscritos: core.manuscritos || [],
                    grimorioCustomizado: core.grimorioCustomizado || {},
                    balancaCosmica: core.balancaCosmica || { tiamat: 0, seth: 0, regente: 'Equilíbrio' },
                    evocacaoAtiva: core.evocacaoAtiva || null,
                    fendaAtiva: core.fendaAtiva || {},
                    pactosAtivos: core.pactosAtivos || {},
                    reliquiasCustomizadas: core.reliquiasCustomizadas || [],
                    historicoChat: core.historicoChat || { global: [], clan: {}, privado: {} },
                    reinos: core.reinos || {},
                    mundo2D: core.mundo2D ? core.mundo2D.salvarEstado() : null,
                    mercadoItens: core.mercadoItens || [],
                    mercadoIdCounter: core.mercadoIdCounter || 1,
                    social: core.social ? core.social.salvarEstado() : null,
                    ultimaGravacao: new Date().toISOString()
                };
                await core.collection.updateOne({ _id: 'MATRIZ_PRINCIPAL' }, { $set: seedData }, { upsert: true });
                console.log("✨ [MONGODB ATLAS] Seeding completo! Matriz primordial gravada no Atlas com sucesso.");
            }
            mongoConectado = true;
        } catch (error) { console.error("❌ CRÍTICO: Falha na conexão MongoDB Atlas! ", error.message); }
    }

    if (!mongoConectado) {
        console.log(`💾 [BANCO INTEGRADO] Operando com Banco de Dados Integrado Local (${DB_FILE_PATH}). Persistência 100% ativa!`);
    }

    core._salvarBancoDeDados = () => {
        salvarBancoLocal();
        if (mongoConectado && core.collection) {
            const data = {
                vampiros: core.vampiros,
                rebanho: core.rebanho,
                clans: core.clans,
                leilaoP2P: core.leilaoP2P,
                leilaoIdCounter: core.leilaoIdCounter,
                logs: core.logs,
                manuscritos: core.manuscritos,
                grimorioCustomizado: core.grimorioCustomizado,
                balancaCosmica: core.balancaCosmica,
                evocacaoAtiva: core.evocacaoAtiva,
                fendaAtiva: core.fendaAtiva,
                pactosAtivos: core.pactosAtivos,
                reliquiasCustomizadas: core.reliquiasCustomizadas,
                historicoChat: core.historicoChat,
                reinos: core.reinos,
                mundo2D: core.mundo2D ? core.mundo2D.salvarEstado() : null,
                mercadoItens: core.mercadoItens || [],
                mercadoIdCounter: core.mercadoIdCounter || 1,
                social: core.social ? core.social.salvarEstado() : null,
                ultimaGravacao: new Date().toISOString()
            };
            core.collection.updateOne({ _id: 'MATRIZ_PRINCIPAL' }, { $set: data }, { upsert: true }).catch(err => {
                console.error("❌ Falha ao sincronizar com MongoDB Atlas:", err.message);
            });
        }
    };

    // Auto-save periódico a cada 30 segundos
    setInterval(() => {
        try {
            if (typeof core._salvarBancoDeDados === 'function') core._salvarBancoDeDados();
        } catch(e) {}
    }, 30000);

    // Salvar ao encerrar processo
    process.on('SIGINT', () => { salvarBancoLocal(); process.exit(0); });
    process.on('SIGTERM', () => { salvarBancoLocal(); process.exit(0); });
}

// ==========================================
// ROTAS DA APLICAÇÃO
// ==========================================

// --- CORRIGINDO PACTOS, ALQUIMIA, LEILÃO E MUNDO ABERTO (Adiciona no server.js) ---
// --- REGISTO DO TUTORIAL ---
app.post('/api/tutorial/concluido', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if (v) {
            v.tutorialConcluido = true;
            core._salvarBancoDeDados();
            res.json({sucesso: true});
        } else res.status(404).json({erro: "Fantasma."});
    } catch(e) { res.status(500).json({erro: "Falha ao gravar memória."}); }
});
// Quests Procedurais da IA
app.post('/api/chat/pacto/pedir', async (req, res) => {
    try { 
        const result = await core.pedirPactoIA(req.body.id);
        if(result.sucesso) forcarSyncJogador(req.body.id);
        res.json(result); 
    }
    catch(e) { res.status(500).json({erro: "O Oráculo calou-se no Abismo."}); }
});
// ==========================================
// ROTA: CONVERSA COM O MESTRE DA IA
// ==========================================
app.post('/api/oraculo/conversar', async (req, res) => {
    try {
        const { id, mensagem } = req.body;
        const v = core.vampiros[id];
        if (!v) return res.status(404).json({ erro: "Alma não encontrada." });

        let respostaIA = await core.oraculo.responder(v, mensagem);

        // EXTRAÇÃO ROBUSTA DE SANGUE REAL
        const matchSangue = respostaIA.match(/\[GOTA:\s*(\d+)\]/i);
        if (matchSangue && matchSangue[1]) {
            const qtdGota = parseInt(matchSangue[1]);
            v.sangue = (v.sangue || 0) + qtdGota;
            
            // Injeta uma confirmação visual na resposta da IA para o jogador ver
            respostaIA = respostaIA.replace(/\[GOTA:\s*\d+\]/i, '').trim();
            respostaIA += `\n\n*(Recebeste ${qtdGota} Gts de Sangue da Mente Abissal)*`;
            
            // Força o Socket a atualizar a barra de sangue na tela do jogador
            if (global.io) global.io.to(`priv_${v.id}`).emit('tick');
        }

        core._salvarBancoDeDados();
        res.json({ resposta: respostaIA, vampiro: v });
    } catch(e) {
        res.status(500).json({ erro: "O Oráculo emudeceu." });
    }
});

app.post('/api/familiar/invocar', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if(!v) return res.status(404).json({erro: "Fantasma."});
        
        if ((v.inventario.anima || 0) < 10 || (v.inventario.ectoplasma || 0) < 2) {
            return res.json({erro: "A invocação exige 10 Anima e 2 Ectoplasma."});
        }

        v.inventario.anima -= 10;
        v.inventario.ectoplasma -= 2;

        let familias = [
            { n: "Corvo de Olhos Brancos", b: "Aumenta o Ganho Oculto ao roubar sangue." },
            { n: "Cão Infernal Filhote", b: "Dano adicional nos combates PvP." },
            { n: "Espírito Guardião Gotejante", b: "Cura passiva por cada inimigo morto." },
            { n: "Sombra Parasita", b: "Reduz o custo das tuas magias em combate." }
        ];
        
        let roleta = familias[Math.floor(Math.random() * familias.length)];
        
        v.familiarAtivo = { nome: roleta.n, buff: roleta.b };
        
        core._registrarEventoEspecial('global', 'ALMA VINCULADA', `O vórtex de ${v.nome} puxou um [${roleta.n}] para este plano!`, true);
        core._salvarBancoDeDados();
        forcarSyncJogador(v.id);
        
        res.json({sucesso: true, relato: `A criatura [${roleta.n}] segue-te agora.`, familiar: v.familiarAtivo});
    } catch(e) { res.status(500).json({erro: "A forja estilhaçou-se."}); }
});
app.post('/api/dungeon/entrar', (req, res) => {
    try { res.json(core.entrarAventura(req.body.id, req.body.dungeonId, req.body.partyId)); } 
    catch(e) { res.status(500).json({erro: "A fenda falhou."}); }
});
app.post('/api/chat/pacto/completar', (req, res) => {
    try { 
        const result = core.completarPacto(req.body.id);
        if(result.sucesso) forcarSyncJogador(req.body.id);
        res.json(result); 
    }
    catch(e) { res.status(500).json({erro: "Falha ao ofertar o sacrifício."}); }
});

// A Alquimia Ausente
// A Alquimia Ausente (Corrigido para Sync Imediato)
app.post('/api/alquimia/forjar', (req, res) => {
    try { 
        const result = core.fabricarAlquimia(req.body.id, req.body.receitaId); 
        if (result.sucesso) forcarSyncJogador(req.body.id);
        res.json(result); 
    } 
    catch(e){ res.status(500).json({erro:"O Caldeirão explodiu."}); }
});

// =====================================
// ROTA DA MAGIA QUE ESTAVA DESAPARECIDA
// =====================================
// --- RITUAIS PRÁTICOS ---
// =====================================
// ROTA DA MAGIA (CORRIGIDA)
// =====================================
app.post('/api/magia/preparar', async (req, res) => {
    try {
        const v = core.vampiros[req.body.id]; 
        if(!v) return res.status(404).json({erro: "Alma inexistente."});
        
        const rKey = req.body.ritualId;
        
        // CORREÇÃO CRÍTICA: Agora o servidor lê o VERDADEIRO grimório da Matriz,
        // incluindo todos os rituais base e as magias customizadas feitas na biblioteca!
        const r = core.grimorio[rKey];
        
        if (!r) return res.status(404).json({erro: "Rito desconhecido na Matriz. O feitiço não existe."});

        // DINÂMICA DE GAMEPLAY (Ajusta o minigame conforme o tipo de feitiço)
        let gameplayType = "ressonancia"; // Padrão
        
        if (r.tipo === 'pvp' || rKey.includes('coagula')) {
            gameplayType = "pressao"; // Magias de Ataque: Derramar Sangue
        } else if (r.tipo === 'buff' || rKey.includes('banimento')) {
            gameplayType = "trilhagem"; // Magias de Buff/Fúria: Ligar os Nós do Pentagrama
        } else if (r.tipo === 'cura' || rKey.includes('salomao')) {
            gameplayType = "ritmo"; // Magias de Cura/Escudo: Bater o Ritmo
        }

        // A IA autoriza e gera o modelo do ritual
        const projeto = await core.oraculo.gerarArteRitual(rKey, r.nome, gameplayType);
        
        // Passamos os dados do ritual real para o Front-end
        projeto.ritual = { key: rKey, nome: r.nome, custoAcao: r.custoAcao };
        
        res.json(projeto);
    } catch(e) { 
        console.error("[ERRO RITUAL PREPARAR]", e);
        res.status(500).json({erro: "A Mente Abissal colapsou ao projetar a estética geométrica."}); 
    }
});

// --- EXECUÇÃO FINAL DO RITUAL ---
app.post('/api/magia/executar', async (req, res) => {
    try {
        const { id, alvoId, ritualId } = req.body;
        
        // Chama a função blindada do ShadowCore
        const resultado = await core.processarMagia(id, alvoId, ritualId);
        
        // Força a atualização do ecrã de quem fez o ritual
        io.to(`priv_${id}`).emit('tick'); 
        
        res.json(resultado);
    } catch(e) {
        console.error(e);
        res.status(500).json({ erro: "O Juiz Abissal rejeitou o feitiço." });
    }
});

app.post('/api/magia/conjurar', (req, res) => {
    try {
        const { atacanteId, ritualId, alvoId } = req.body;
        const result = core.conjurarRitual(atacanteId, ritualId, alvoId);
        
        if (result.sucesso) {
            forcarSyncJogador(atacanteId);
            // Se foi lançado num aliado, atualiza a Fúria dele em tempo real também!
            if (alvoId && alvoId !== atacanteId) forcarSyncJogador(alvoId);
        }
        res.json(result);
    } catch(e) {
        res.status(500).json({erro: "A Entropia quebrou a conjuração."});
    }
});

app.post('/api/magia/gerar_dinamica', async (req, res) => {
    try { res.json(await core.despertarMagiaCombate(req.body.id)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"Falha na forja."}); }
});
app.post('/api/magia/equipar_dinamica', (req, res) => {
    try { res.json(core.equiparMagiaAtiva(req.body.id, req.body.magiaId)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"Falha."}); }
});

app.post('/api/perfil/diaria', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if(!v) return res.status(404).json({erro: "Fantasma."});
        
        const agora = Date.now();
        const vinteQuatroHoras = 24 * 60 * 60 * 1000;
        
        if (v.estatisticas.ultimoTributo && (agora - v.estatisticas.ultimoTributo) < vinteQuatroHoras) {
            let horasRestantes = Math.ceil((vinteQuatroHoras - (agora - v.estatisticas.ultimoTributo)) / (1000 * 60 * 60));
            return res.json({erro: `A Mente Abissal exige repouso. Volta daqui a ${horasRestantes} horas.`});
        }
        
        // Recompensa baseada no nível (ajuda muito no early game)
        let gtsBencao = 500 + (v.nivel * 100);
        let xpBencao = 50 + (v.nivel * 10);
        
        v.sangue += gtsBencao;
        v.pontosAcao = v.maxAcao; // Restaura a fúria toda!
        core.ganharXP(v.id, xpBencao);
        v.estatisticas.ultimoTributo = agora;
        
        core._salvarBancoDeDados();
        res.json({sucesso: true, relato: `A Mente Abissal abençoou-te!\nRecebeste ${gtsBencao} Gts, ${xpBencao} XP e Fúria Máxima restaurada.`});
    } catch(e){ res.status(500).json({erro:"A bênção falhou."}); }
});
app.post('/api/admin/aprovar_osint', (req, res) => {
    try {
        const { adminId, alvoId } = req.body;
        const admin = core.vampiros[adminId];
        const alvo = core.vampiros[alvoId];
        
        if (!admin || admin.geracao !== 1) return res.status(403).json({erro: "Heresia. Apenas o Primordial possui a Chave do Véu."});
        if (!alvo) return res.status(404).json({erro: "Aura não encontrada."});
        
        alvo.osintAprovado = true;
        core._registrarEventoEspecial('global', 'O VÉU RASGOU', `A Mão Primordial de ${admin.nome} abriu os olhos de [${alvo.nome}] para a Magia Real.`, true);
        core._salvarBancoDeDados();
        forcarSyncJogador(alvo.id);
        res.json({sucesso: true, relato: `[${alvo.nome}] agora pode ver a Teia Humana (OSINT).`});
    } catch(e) { res.status(500).json({erro: "A matriz falhou."}); }
});

app.post('/api/admin/consagrar_mestre', (req, res) => {
    try {
        const { chaveMestra, alvoNome, criarNovo, senha, raca } = req.body;
        const chaveValida = process.env.ADMIN_KEY || "LILITH_ADMIN_666";
        if (chaveMestra !== chaveValida) {
            return res.status(403).json({ erro: "Palavra de Poder inválida. Acesso negado à Coroa de Sangue." });
        }
        
        let vampiro = null;
        if (alvoNome) {
            for (let id in core.vampiros) {
                if (core.vampiros[id].nome.toLowerCase() === alvoNome.trim().toLowerCase() || core.vampiros[id].id === alvoNome.trim()) {
                    vampiro = core.vampiros[id];
                    break;
                }
            }
        }
        
        if (!vampiro && criarNovo) {
            const novo = core.despertarViaTelegram(Date.now(), 'Admin_Primordial', alvoNome || 'Mestre_Supremo', senha || 'admin666', '', raca || 'vampiro');
            vampiro = novo.vampiro;
        }
        
        if (!vampiro) {
            return res.status(404).json({ erro: "Nenhum iniciado encontrado com este nome para consagrar." });
        }
        
        vampiro.admin = true;
        vampiro.geracao = 1;
        vampiro.nivel = 99;
        vampiro.osintAprovado = true;
        vampiro.sangue = Math.max(vampiro.sangue || 0, 999999);
        vampiro.calice = Math.max(vampiro.calice || 0, 500000);
        vampiro.pontosAcao = 100;
        vampiro.maxAcao = 100;
        vampiro.hpAtual = 50000;
        vampiro.hpMax = 50000;
        vampiro.atributos = { vontade: 100, gnose: 100, magnetismo: 100, densidade: 100, pontosLivres: 99 };
        if (!vampiro.titulos.includes('Mestre Supremo do Abismo')) vampiro.titulos.push('Mestre Supremo do Abismo');
        if (!vampiro.titulos.includes('Alfa Primordial')) vampiro.titulos.push('Alfa Primordial');
        vampiro.tituloAtual = 'Mestre Supremo do Abismo';
        vampiro.poderesDesbloqueados = Object.keys(core.grimorio);
        vampiro.inventario = Object.assign(vampiro.inventario || {}, { anima: 100, cinzas: 100, vitae: 100, memoria: 100, ectoplasma: 100, pedraAlma: 100, ankh_sangue: 50 });
        vampiro.materiais = { mandragora: 100, beladona: 100, lotusNegro: 100, florCinzas: 100, ferroNegro: 100, pergaminhoVirgem: 100, cinzas: 100 };
        
        core._obterAtributosTotais(vampiro);
        core._registrarEventoEspecial('global', 'MESTRE SUPREMO CONSAGRADO', `[${vampiro.nome}] ascendeu como Administrador Supremo do Reino com Nível 99 e Sangue Primordial!`, true);
        core._salvarBancoDeDados();
        forcarSyncJogador(vampiro.id);
        io.emit('sync_geral');
        
        res.json({ sucesso: true, relato: `[${vampiro.nome}] foi coroado como Mestre Supremo Nv.99 com Sangue Absoluto!`, vampiro });
    } catch(e) {
        console.error("Erro ao consagrar Mestre:", e);
        res.status(500).json({ erro: "A consagração falhou." });
    }
});

// ==========================================
// PORTAL NOSFERATU — INTELIGÊNCIA OCULTA (OSINT)
// ==========================================

app.post('/api/nosferatu/rasgar_veu', async (req, res) => {
    try {
        const { adminId, nomeReal, instagram, twitter, urlPerfil, notas } = req.body;
        const admin = core.vampiros[adminId];

        if (!admin || (!admin.admin && admin.geracao !== 1 && admin.nivel < 99)) {
            return res.status(403).json({ erro: "Heresia. Apenas Mestres Supremos Nv.99 podem rasgar o Veu." });
        }

        const nomeAlvo = nomeReal || instagram || twitter || 'Desconhecido';
        const alvoId = `nosf_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        let sigilo = { sigilo: 'N/A', pesoOculto: 0, revelacao: '' };
        let julgamento = { pesoEspiritual: 0, taxaCorrupcao: 0, essencia: 'Desconhecido' };
        let gematria = 0;

        try {
            if (instagram) sigilo = Lexicon.ForjarSigiloMortal('instagram', instagram);
            else if (twitter) sigilo = Lexicon.ForjarSigiloMortal('twitter', twitter);
            else sigilo = Lexicon.ForjarSigiloMortal('nome', nomeAlvo);

            julgamento = Lexicon.JulgarAlma(nomeAlvo);
            gematria = Lexicon.CalcularGematria(nomeAlvo);
        } catch (e) {
            const GEMATRIA = {
                a:1,i:1,j:1,q:1,y:1,b:2,k:2,r:2,c:3,g:3,l:3,s:3,
                d:4,m:4,t:4,e:5,h:5,n:5,x:5,u:6,v:6,w:6,o:7,z:7,f:8,p:8
            };
            gematria = nomeAlvo.toLowerCase().replace(/[^a-z]/g, '').split('').reduce((s, c) => s + (GEMATRIA[c] || 0), 0) || 13;
            const corr = (gematria * Date.now()) % 100;
            let qual = 'Humano Mundano';
            if (corr > 90) qual = 'Sangue Negro (Pecador)';
            else if (corr < 5) qual = 'Sangue Puro (Inocente)';
            else if (gematria % 11 === 0) qual = 'Alma Fragmentada';
            julgamento = { pesoEspiritual: gematria, taxaCorrupcao: corr, essencia: qual };

            const crypto = require('crypto');
            sigilo = {
                sigilo: crypto.createHash('sha256').update(nomeAlvo + Date.now()).digest('hex').substring(0, 40),
                pesoOculto: gematria
            };
        }

        const plataformas = [];
        if (instagram) plataformas.push(`Instagram: ${instagram}`);
        if (twitter) plataformas.push(`Twitter/X: ${twitter}`);
        if (urlPerfil) plataformas.push(`Perfil: ${urlPerfil}`);

        const pesquisa = await core.oraculo.pesquisarIdentidadePublica({
            nome: nomeReal,
            instagram,
            twitter,
            urlPerfil,
            notas
        });

        if (!pesquisa.sucesso) {
            return res.status(502).json({
                erro: "A pesquisa publica real da Mente Abissal falhou.",
                detalhe: pesquisa.erro || "Erro externo desconhecido."
            });
        }

        const metricas = pesquisa.metricas || {};
        const pesoKarmico = metricas.pesoKarmico || gematria;
        const essencia = metricas.essencia || julgamento.essencia;
        const taxaCorrupcao = typeof metricas.taxaCorrupcao === 'number' ? metricas.taxaCorrupcao : julgamento.taxaCorrupcao;

        let corAlma = '#d080ff';
        if (essencia.includes('Negro') || metricas.polaridadeAlma === 'Trevas Abissais') corAlma = '#ff3333';
        else if (essencia.includes('Puro') || metricas.polaridadeAlma === 'Luz Radiante') corAlma = '#00ff88';
        else if (essencia.includes('Fragmentada') || metricas.polaridadeAlma === 'Crepúsculo') corAlma = '#ff8800';

        const analiseIA = pesquisa.conteudo +
            `\n\nLEITURA RITUAL DO JOGO:\nPeso Kármico: ${pesoKarmico} | Essência: ${essencia} | Corrupção: ${taxaCorrupcao}% | Elemento: ${metricas.ressonanciaElemental || 'Éter'} | Afinidade: ${metricas.afinidadeOculta || 'Magnetismo'} | Vaso de Influência: ${metricas.vasoInfluencia || 50}% | Frequência: ${metricas.frequenciaVibracionalHz || 528}Hz | Arquétipo: "${metricas.arquetipoAbissal || 'O Viajante do Véu'}". Estes valores são atributos de gameplay moldados pela análise OSINT.`;

        const dossie = {
            alvoId,
            nomeAstral: nomeAlvo,
            nomeReal: nomeReal || '',
            instagram: instagram || '',
            twitter: twitter || '',
            urlPerfil: urlPerfil || '',
            notas: notas || '',
            pesoKarmico,
            essencia,
            taxaCorrupcao,
            ressonanciaElemental: metricas.ressonanciaElemental || 'Éter',
            afinidadeOculta: metricas.afinidadeOculta || 'Magnetismo',
            vasoInfluencia: metricas.vasoInfluencia ?? 50,
            vulnerabilidadeEspiritual: metricas.vulnerabilidadeEspiritual ?? 50,
            polaridadeAlma: metricas.polaridadeAlma || 'Penumbra Neutra',
            purezaSangue: metricas.purezaSangue ?? 50,
            resistenciaPsiquica: metricas.resistenciaPsiquica ?? 50,
            frequenciaVibracionalHz: metricas.frequenciaVibracionalHz || 528,
            arquetipoAbissal: metricas.arquetipoAbissal || 'O Viajante do Véu',
            estadoAstral: 'Vigília Mundana',
            sigilo: sigilo.sigilo,
            plataformas,
            analiseIA,
            corAlma,
            dataVarredura: Date.now(),
            pesquisaReal: true,
            motorPesquisa: pesquisa.motor,
            pesquisadoEm: pesquisa.pesquisadoEm,
            historicoAcoes: [],
            bencaosAtivas: [],
            maldicoesAtivas: []
        };

        if (!admin.alvosNosferatu) admin.alvosNosferatu = [];
        const idxExistente = admin.alvosNosferatu.findIndex(a => a.nomeAstral.toLowerCase() === nomeAlvo.toLowerCase() || a.alvoId === alvoId);
        if (idxExistente >= 0) {
            dossie.historicoAcoes = admin.alvosNosferatu[idxExistente].historicoAcoes || [];
            dossie.bencaosAtivas = admin.alvosNosferatu[idxExistente].bencaosAtivas || [];
            dossie.maldicoesAtivas = admin.alvosNosferatu[idxExistente].maldicoesAtivas || [];
            dossie.estadoAstral = admin.alvosNosferatu[idxExistente].estadoAstral || 'Vigília Mundana';
            admin.alvosNosferatu[idxExistente] = dossie;
        } else {
            admin.alvosNosferatu.push(dossie);
        }

        // Espelha no rebanho do jogo para caça, dreno e comércio
        if (!core.rebanho) core.rebanho = {};
        core.rebanho[dossie.alvoId] = {
            hash: dossie.alvoId,
            identificadorVisivel: dossie.nomeAstral,
            plataforma: dossie.urlPerfil ? 'OSINT' : (dossie.instagram ? 'Instagram' : (dossie.twitter ? 'Twitter' : 'OSINT')),
            sangueAtual: 2500,
            sangueMax: 2500,
            estado: 'Vibrante',
            qualidade: `${dossie.arquetipoAbissal} [${dossie.ressonanciaElemental}]`,
            leituraAura: (dossie.analiseIA || 'Alma mapeada pelo Olhar de Nosferatu.').substring(0, 300),
            maldicaoArcana: { selo: 'nosferatu', donoId: admin.id, donoNome: admin.nome },
            registroMordidas: [],
            dadosOsint: dossie
        };

        core._salvarBancoDeDados();
        forcarSyncJogador(admin.id);

        res.json({ sucesso: true, dossie });
    } catch (e) {
        console.error('Nosferatu Rasgar Veu Error:', e);
        res.status(500).json({
            erro: "A Fenda Cosmica rejeitou a varredura.",
            detalhe: e?.message || "Erro desconhecido."
        });
    }
});

app.post('/api/nosferatu/acao_karmica', async (req, res) => {
    try {
        const { adminId, alvoId, acao, intencaoPersonalizada } = req.body;
        const admin = core.vampiros[adminId];
        if (!admin || (!admin.admin && admin.geracao !== 1 && admin.nivel < 99)) {
            return res.status(403).json({ erro: "Heresia. Acesso negado ao Véu." });
        }

        if (!admin.alvosNosferatu || admin.alvosNosferatu.length === 0) {
            return res.status(404).json({ erro: "Nenhum alvo registrado no teu Véu." });
        }

        const alvo = admin.alvosNosferatu.find(a => a.alvoId === alvoId || a.nomeAstral.toLowerCase() === (alvoId || '').toLowerCase());
        if (!alvo) {
            return res.status(404).json({ erro: "Alvo não localizado no teu Livro das Sombras." });
        }

        const acoes = {
            // 💖 ESFERA 1: AÇÕES CARINHOSAS & BÊNÇÃOS ASTRAIS
            'toque_seda': {
                nome: 'Toque de Seda Astral',
                categoria: 'carinhosa',
                custo: 300,
                desc: 'Uma brisa suave de vitae percorre o campo áurico do alvo, dissipando angústias mundanas e conferindo serenidade profunda ao sono.',
                aplicar: (alvo, admin) => {
                    alvo.resistenciaPsiquica = Math.min(100, (alvo.resistenciaPsiquica || 50) + 15);
                    alvo.vulnerabilidadeEspiritual = Math.max(10, (alvo.vulnerabilidadeEspiritual || 50) - 10);
                    if (alvo.estadoAstral === 'Atormentado pelas Sombras') alvo.estadoAstral = 'Vigília Mundana';
                }
            },
            'bencao_lilith': {
                nome: 'Manto Protetor de Lilith',
                categoria: 'carinhosa',
                custo: 600,
                desc: 'As asas aveludadas de Lilith envolvem o duplo astral do mortal em uma cúpula impenetrável contra inveja, mau-olhado e feitiços hostis de terceiros.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Abençoado por Lilith';
                    if (!alvo.bencaosAtivas) alvo.bencaosAtivas = [];
                    if (!alvo.bencaosAtivas.includes('Manto de Lilith')) alvo.bencaosAtivas.push('Manto de Lilith');
                    alvo.resistenciaPsiquica = Math.min(100, (alvo.resistenciaPsiquica || 50) + 25);
                }
            },
            'flor_sangue': {
                nome: 'Flor de Sangue (Magnetismo Afetivo)',
                categoria: 'carinhosa',
                custo: 500,
                desc: 'Uma pétala de fogo etéreo ancora no centro cardíaco do mortal, despertando calor ardente, empatia e súbita afeição irresistível pelo Mestre.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Enfeitiçado pelo Sangue';
                    alvo.polaridadeAlma = 'Luz Radiante';
                }
            },
            'musa_noturna': {
                nome: 'Musa das Trevas (Iluminação Criativa)',
                categoria: 'carinhosa',
                custo: 400,
                desc: 'Lampejos do Akasha profundo penetram o intelecto da pessoa, destravando epifanias artísticas, criatividade visceral e clareza de visão.',
                aplicar: (alvo, admin) => {
                    alvo.frequenciaVibracionalHz = 741;
                    alvo.vasoInfluencia = Math.min(100, (alvo.vasoInfluencia || 50) + 10);
                }
            },

            // ⚡ ESFERA 2: INFLUÊNCIAS SUTIS & DOMÍNIO MENTAL
            'sugestao_onirica': {
                nome: 'Sugestão Onírica Direcionada',
                categoria: 'influencia',
                custo: 700,
                desc: 'Um impulso psíquico é sussurrado nos ciclos de sono do mortal. Ele despertará com a certeza inabalável de que a ideia emanou do seu próprio subconsciente.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Sob Sugestão Onírica';
                    alvo.vulnerabilidadeEspiritual = Math.min(100, (alvo.vulnerabilidadeEspiritual || 50) + 15);
                }
            },
            'eco_egregora': {
                nome: 'Eco da Egrégora (Sincronicidades)',
                categoria: 'influencia',
                custo: 500,
                desc: 'O nome e a presença da Ordem vibram na mente do alvo através de números repetidos (333, 666), déjà vu incessante e sincronicidades marcantes.',
                aplicar: (alvo, admin) => {
                    alvo.frequenciaVibracionalHz = 396;
                }
            },
            'espelho_ilusorio': {
                nome: 'Espelho Ilusório (Distorção da Percepção)',
                categoria: 'influencia',
                custo: 650,
                desc: 'O espelho de obsidiana refracta a autoimagem do mortal. Ele passará a duvidar de certezas mundanas e sentirá o peso de presenças ocultas no aposento.',
                aplicar: (alvo, admin) => {
                    alvo.resistenciaPsiquica = Math.max(15, (alvo.resistenciaPsiquica || 50) - 15);
                }
            },
            'laco_obsessao': {
                nome: 'Laço de Obsessão Astral',
                categoria: 'influencia',
                custo: 900,
                desc: 'Um filamento de prata rubra une a mente do alvo ao trono do Mestre Supremo. Seus pensamentos orbitarão a figura do soberano sem explicação racional.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Laço Kármico Ativo';
                    alvo.taxaCorrupcao = Math.min(100, (alvo.taxaCorrupcao || 50) + 10);
                }
            },

            // 🩸 ESFERA 3: AÇÕES MALÉFICAS & FLAGELOS OBSCUROS
            'pesadelo_abissal': {
                nome: 'Invasão de Pesadelos (Paralisia do Sono)',
                categoria: 'malefica',
                custo: 800,
                desc: 'Horrores ancestrais rastejam até o leito do alvo: paralisia noturna, sensação de peso sufocante sobre o peito e sombras que fitam dos cantos do quarto.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Atormentado pelas Sombras';
                    alvo.resistenciaPsiquica = Math.max(10, (alvo.resistenciaPsiquica || 50) - 25);
                    alvo.purezaSangue = Math.max(15, (alvo.purezaSangue || 50) - 15);
                }
            },
            'drenagem_voraz': {
                nome: 'Drenagem Voraz de Alma',
                categoria: 'malefica',
                custo: 200,
                desc: 'As garras astrais cravam-se na nuca do alvo através do Véu, sugando sua vitalidade etérea e abastecendo o Cálice de Sangue do Mestre com 1.000 Gts de pura Vitae!',
                aplicar: (alvo, admin) => {
                    admin.sangue = (admin.sangue || 0) + 1000;
                    alvo.purezaSangue = Math.max(10, (alvo.purezaSangue || 50) - 30);
                    alvo.vulnerabilidadeEspiritual = Math.min(95, (alvo.vulnerabilidadeEspiritual || 50) + 20);
                }
            },
            'olho_seth': {
                nome: 'Olho de Seth (Desfortuna & Ruína Prática)',
                categoria: 'malefica',
                custo: 1000,
                desc: 'O Olho de Seth projeta entropia cósmica nos caminhos práticos do alvo: falhas de acordos, aparelhos quebrados, discórdias súbitas e perdas materiais.',
                aplicar: (alvo, admin) => {
                    if (!alvo.maldicoesAtivas) alvo.maldicoesAtivas = [];
                    if (!alvo.maldicoesAtivas.includes('Olho de Seth')) alvo.maldicoesAtivas.push('Olho de Seth');
                    alvo.taxaCorrupcao = Math.min(100, (alvo.taxaCorrupcao || 50) + 20);
                }
            },
            'acoite_sombra': {
                nome: 'Açoite de Sangue Negro',
                categoria: 'malefica',
                custo: 1200,
                desc: 'Um golpe devastador de energia sombria fragmenta o campo áurico do alvo, provocando exaustão física imediata, enxaquecas e frio nos ossos.',
                aplicar: (alvo, admin) => {
                    alvo.essencia = 'Sangue Negro (Pecador)';
                    alvo.polaridadeAlma = 'Trevas Abissais';
                    alvo.resistenciaPsiquica = Math.max(5, (alvo.resistenciaPsiquica || 50) - 35);
                }
            },

            // 🕳️ ESFERA 4: CONDENAÇÕES SUPREMAS, LIMBO & RESGATE
            'banir_ao_limbo': {
                nome: 'Banimento ao Limbo Astral',
                categoria: 'limbo',
                custo: 2000,
                desc: 'A fenda dimensional se abre com um estrondo silencioso: o duplo astral do alvo é arrastado para o Vazio Cinzento do Limbo. Lá, o tempo não flui, suas defesas desvanecem e sua alma fica completamente à mercê da vontade do Mestre.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Preso no Limbo Astral';
                    alvo.resistenciaPsiquica = 5;
                    alvo.vulnerabilidadeEspiritual = 99;
                    alvo.frequenciaVibracionalHz = 174;
                }
            },
            'condenar_ao_tartaro': {
                nome: 'Condenação ao Tártaro Cósmico',
                categoria: 'limbo',
                custo: 3000,
                desc: 'O decreto irrevogável do Juiz Cósmico: a alma do mortal é acorrentada no poço primordial de enxofre e chamas negras de Tiamat. O sigilo do mortal arde em agonia perpétua.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Condenado ao Tártaro';
                    alvo.polaridadeAlma = 'Caos Primordial';
                    alvo.essencia = 'Alma Fragmentada';
                    alvo.resistenciaPsiquica = 0;
                    alvo.taxaCorrupcao = 99;
                }
            },
            'resgatar_do_limbo': {
                nome: 'Resgate & Absolvição Soberana',
                categoria: 'limbo',
                custo: 500,
                desc: 'Com soberano poder de vida e morte, o Mestre estende a mão para as profundezas do Vazio, quebrando as correntes e trazendo a alma de volta à Vigília Mundana com purificação de seu carma.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Vigília Mundana';
                    alvo.taxaCorrupcao = Math.max(10, (alvo.taxaCorrupcao || 50) - 30);
                    alvo.resistenciaPsiquica = 60;
                    alvo.frequenciaVibracionalHz = 528;
                    alvo.maldicoesAtivas = [];
                }
            },

            // Legado retrocompatível
            'drenar_vitalidade': {
                nome: 'Drenagem de Vitalidade',
                categoria: 'malefica',
                custo: 500,
                desc: 'A energia vital do alvo foi drenada pelas sombras. As forças do Véu respondem com um arrepio dimensional.',
                aplicar: (alvo, admin) => {
                    admin.sangue += 500;
                    alvo.purezaSangue = Math.max(20, (alvo.purezaSangue || 50) - 15);
                }
            },
            'sussurro_veu': {
                nome: 'Sussurro no Véu',
                categoria: 'influencia',
                custo: 200,
                desc: 'Um sussurro astral foi enviado através do Véu. O alvo sentirá um arrepio inexplicável, como se estivesse a ser observado.',
                aplicar: (alvo, admin) => {
                    alvo.frequenciaVibracionalHz = 417;
                }
            },
            'maldicao_espelho': {
                nome: 'Maldição do Espelho',
                categoria: 'malefica',
                custo: 1000,
                desc: 'O espelho negro reflecte a verdade oculta do alvo. Cada reflexo que vir conterá uma sombra a mais.',
                aplicar: (alvo, admin) => {
                    alvo.resistenciaPsiquica = Math.max(10, (alvo.resistenciaPsiquica || 50) - 20);
                }
            },
            'laco_sangue': {
                nome: 'Laço de Sangue',
                categoria: 'carinhosa',
                custo: 800,
                desc: 'Um laço kármico de sangue foi estabelecido. O destino do alvo está agora entrelaçado com o do invocador.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Laço Kármico Ativo';
                }
            },
            'sombra_akasha': {
                nome: 'Sombra de Akasha',
                categoria: 'limbo',
                custo: 1500,
                desc: 'A Sombra de Akasha desceu sobre o alvo. O peso de todas as vidas passadas agora pesa sobre a sua consciência.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Sob a Sombra de Akasha';
                    alvo.taxaCorrupcao = Math.min(100, (alvo.taxaCorrupcao || 50) + 15);
                }
            }
        };

        const acaoData = acoes[acao];
        if (!acaoData) return res.status(400).json({ erro: "Acção kármica desconhecida no cânone de Nosferatu." });
        if (admin.sangue < acaoData.custo) {
            return res.status(400).json({ erro: `Sangue insuficiente. O rito exige ${acaoData.custo} Gts de Vitae.` });
        }

        admin.sangue -= acaoData.custo;

        // Aplica as mutações no alvo
        if (typeof acaoData.aplicar === 'function') {
            acaoData.aplicar(alvo, admin, intencaoPersonalizada);
        }

        const relatoIntencao = intencaoPersonalizada ? `\n🔮 Intenção Emanada: "${intencaoPersonalizada.trim()}"` : '';
        const relatoCompleto = `🕸️ [${acaoData.categoria.toUpperCase()}] ${acaoData.nome.toUpperCase()}: ${acaoData.desc}${relatoIntencao}`;

        if (!alvo.historicoAcoes) alvo.historicoAcoes = [];
        alvo.historicoAcoes.unshift({
            acao,
            nome: acaoData.nome,
            categoria: acaoData.categoria,
            custo: acaoData.custo,
            data: Date.now(),
            relato: relatoCompleto,
            intencao: intencaoPersonalizada?.trim() || null,
            novoEstadoAstral: alvo.estadoAstral
        });
        if (alvo.historicoAcoes.length > 50) alvo.historicoAcoes.pop();

        core._registrarEventoEspecial(admin.id, 'EMANACAO NOSFERATU', `${admin.nome} emanou [${acaoData.nome}] sobre [${alvo.nomeAstral}] (${alvo.estadoAstral}).`, false);
        core._salvarBancoDeDados();
        forcarSyncJogador(admin.id);

        res.json({
            sucesso: true,
            relato: relatoCompleto,
            acao: acaoData.nome,
            categoria: acaoData.categoria,
            novoEstadoAstral: alvo.estadoAstral,
            alvo
        });
    } catch(e) {
        console.error('Nosferatu Ação Kármica Error:', e);
        res.status(500).json({ erro: "O Véu rejeitou a acção kármica." });
    }
});

// ==========================================
// GESTÃO DE VÍTIMAS REGISTRADAS (MESTRE)
// ==========================================

app.get('/api/nosferatu/vitimas_mestre', (req, res) => {
    try {
        const { adminId } = req.query;
        const admin = core.vampiros[adminId];
        if (!admin) return res.status(404).json({ erro: "Iniciado não encontrado." });

        const vitimas = (admin.alvosNosferatu || []).map(v => {
            const mortal = core.rebanho ? core.rebanho[v.alvoId] : null;
            return {
                ...v,
                hpAtual: mortal ? mortal.sangueAtual : (v.sangueHp || 2500),
                hpMax: mortal ? mortal.sangueMax : 2500,
                estadoMortal: mortal ? mortal.estado : (v.estadoAstral || 'Vibrante')
            };
        });
        res.json({ vitimas });
    } catch(e) {
        console.error("Erro ao listar vítimas:", e);
        res.status(500).json({ erro: "Falha ao obter lista de vítimas." });
    }
});

app.post('/api/nosferatu/vender_alvo', (req, res) => {
    try {
        const { adminId, alvoId, compradorNome, precoGts, modalidade } = req.body;
        const vendedor = core.vampiros[adminId];
        if (!vendedor) return res.status(404).json({ erro: "Iniciador inválido." });

        if (!vendedor.alvosNosferatu || vendedor.alvosNosferatu.length === 0) {
            return res.status(404).json({ erro: "Não possuis presas registradas no teu Livro das Sombras." });
        }

        const idxAlvo = vendedor.alvosNosferatu.findIndex(a => a.alvoId === alvoId || a.nomeAstral.toLowerCase() === (alvoId || '').toLowerCase());
        if (idxAlvo === -1) {
            return res.status(404).json({ erro: "Vítima não localizada em teus registros." });
        }

        const alvo = vendedor.alvosNosferatu[idxAlvo];
        const preco = Math.max(0, parseInt(precoGts) || 0);

        if (modalidade === 'leilao') {
            const anuncio = {
                id: core.leilaoIdCounter++,
                vendedorId: vendedor.id,
                vendedorNome: vendedor.nome,
                tipo: 'alma_humana',
                quantia: 1,
                preco: preco || 1000,
                hashMortal: alvo.alvoId,
                nomeMortal: alvo.nomeAstral,
                dadosAlvo: JSON.parse(JSON.stringify(alvo)),
                dataCriacao: Date.now()
            };
            core.leilaoP2P.push(anuncio);
            alvo.estadoAstral = 'No Leilão das Sombras';
            if (core.rebanho && core.rebanho[alvo.alvoId]) {
                core.rebanho[alvo.alvoId].estado = 'No Leilao';
            }
            core._registrarEventoEspecial('global', 'LEILÃO DE ALMAS', `[${vendedor.nome}] colocou o pacto da alma de [${alvo.nomeAstral}] à venda no Leilão P2P por ${anuncio.preco} Gts!`, true);
            core._salvarBancoDeDados();
            io.emit('sync_geral');
            return res.json({ sucesso: true, relato: `A alma de [${alvo.nomeAstral}] foi ofertada no Leilão P2P por ${anuncio.preco} Gts!`, anuncioId: anuncio.id });
        }

        // Venda Direta
        if (!compradorNome || !compradorNome.trim()) {
            return res.status(400).json({ erro: "Informa o nome do jogador comprador." });
        }

        let comprador = null;
        for (let id in core.vampiros) {
            if (core.vampiros[id].nome.toLowerCase() === compradorNome.trim().toLowerCase() || core.vampiros[id].id === compradorNome.trim()) {
                comprador = core.vampiros[id];
                break;
            }
        }

        if (!comprador) {
            return res.status(404).json({ erro: `Jogador [${compradorNome}] não encontrado no reino.` });
        }
        if (comprador.id === vendedor.id) {
            return res.status(400).json({ erro: "Não podes vender uma alma para ti mesmo." });
        }

        if (preco > 0) {
            if ((comprador.sangue || 0) < preco) {
                return res.status(400).json({ erro: `[${comprador.nome}] não possui ${preco} Gts de sangue para adquirir este vínculo (possui ${comprador.sangue || 0} Gts).` });
            }
            comprador.sangue -= preco;
            vendedor.sangue = (vendedor.sangue || 0) + preco;
        }

        if (!comprador.alvosNosferatu) comprador.alvosNosferatu = [];
        const alvoTransferido = {
            ...alvo,
            estadoAstral: `Sob jugo de ${comprador.nome}`,
            dataTransferencia: Date.now(),
            mestreAnterior: vendedor.nome
        };

        vendedor.alvosNosferatu.splice(idxAlvo, 1);
        comprador.alvosNosferatu.push(alvoTransferido);

        if (core.rebanho && core.rebanho[alvo.alvoId]) {
            core.rebanho[alvo.alvoId].estado = 'Vibrante';
            core.rebanho[alvo.alvoId].maldicaoArcana = {
                selo: 'transferido',
                donoId: comprador.id,
                donoNome: comprador.nome
            };
        }

        core._registrarEventoEspecial('global', 'PACTO TRANSFERIDO', `[${vendedor.nome}] vendeu o vínculo de [${alvo.nomeAstral}] para [${comprador.nome}] por ${preco} Gts!`, true);
        core._salvarBancoDeDados();
        forcarSyncJogador(vendedor.id);
        forcarSyncJogador(comprador.id);
        io.emit('sync_geral');

        res.json({
            sucesso: true,
            relato: `Vínculo com [${alvo.nomeAstral}] transferido com sucesso para [${comprador.nome}] por ${preco} Gts!`,
            alvo: alvoTransferido
        });
    } catch(e) {
        console.error("Erro ao vender alvo:", e);
        res.status(500).json({ erro: "Falha ao selar venda da alma." });
    }
});

app.post('/api/nosferatu/libertar_alvo', (req, res) => {
    try {
        const { adminId, alvoId } = req.body;
        const admin = core.vampiros[adminId];
        if (!admin) return res.status(404).json({ erro: "Iniciador inválido." });

        if (!admin.alvosNosferatu || admin.alvosNosferatu.length === 0) {
            return res.status(404).json({ erro: "Nenhum alvo registrado." });
        }

        const idx = admin.alvosNosferatu.findIndex(a => a.alvoId === alvoId || a.nomeAstral.toLowerCase() === (alvoId || '').toLowerCase());
        if (idx === -1) {
            return res.status(404).json({ erro: "Vítima não encontrada em teus registros." });
        }

        const alvo = admin.alvosNosferatu[idx];
        const nomeAlvo = alvo.nomeAstral;

        alvo.estadoAstral = 'Alma Libertada (Vínculo Rompido)';
        alvo.maldicoesAtivas = [];
        alvo.vulnerabilidadeEspiritual = 10;
        alvo.resistenciaPsiquica = 95;

        if (core.rebanho && core.rebanho[alvo.alvoId]) {
            core.rebanho[alvo.alvoId].maldicaoArcana = null;
            core.rebanho[alvo.alvoId].estado = 'Vibrante';
        }

        admin.alvosNosferatu.splice(idx, 1);

        core._registrarEventoEspecial('global', 'ALMA LIBERTADA', `[${admin.nome}] rompeu o Fio de Prata e libertou a alma de [${nomeAlvo}] de qualquer servidão terrena!`, true);
        core._salvarBancoDeDados();
        forcarSyncJogador(admin.id);
        io.emit('sync_geral');

        res.json({
            sucesso: true,
            relato: `O vínculo com [${nomeAlvo}] foi totalmente desfeito. A alma foi absolvida e devolvida à sua própria jornada mundana.`
        });
    } catch(e) {
        console.error("Erro ao libertar alvo:", e);
        res.status(500).json({ erro: "Falha ao quebrar vínculo astral." });
    }
});

// O Mercado Negro (Leilão)
app.get('/api/leilao', (req, res) => {
    try { res.json(core.leilaoP2P || []); } 
    catch(e) { res.status(500).json({erro:"Falha ao ler o mercado."}); }
});

app.post('/api/leilao/vender', (req, res) => {
    try { res.json(core.anunciarLeilao(req.body.id, req.body.tipo, req.body.quantiaOuHash, req.body.preco)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"Falha na venda."}); }
});
// Nas rotas de perfil, adiciona:
app.post('/api/perfil/ouroboros', (req, res) => { 
    try { 
        const r = core.realizarRitoOuroboros(req.body.id); 
        if(r.sucesso) forcarSyncJogador(req.body.id); 
        res.json(r); 
    } catch(e){ res.status(500).json({erro:"A Serpente rejeitou-te."}); }
});

// Adiciona Rota de Reparo de Itens:
app.post('/api/inventario/reparar', (req, res) => {
    try {
        const { id, slot } = req.body;
        const v = core.vampiros[id];
        if(!v || !v.equipamentos[slot]) return res.json({erro:"Slot vazio."});
        const custo = v.equipamentos[slot].aprimoramento > 0 ? 5 : 1;
        if(v.inventario.cinzas < custo) return res.json({erro:`Exige ${custo} Cinzas para reparar.`});
        v.inventario.cinzas -= custo;
        v.equipamentos[slot].durabilidade = 100;
        core._salvarBancoDeDados();
        forcarSyncJogador(id);
        res.json({sucesso: true, relato: `A forja colou os fragmentos. Durabilidade de ${v.equipamentos[slot].nome} restaurada.`});
    } catch(e) { res.status(500).json({erro:"Falha."}); }
});
app.post('/api/leilao/comprar', (req, res) => {
    try { res.json(core.comprarLeilao(req.body.id, req.body.anuncioId)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"Falha na compra."}); }
});

// ==========================================
// ROTA PROXY PARA A VOZ DA IA (Contorna bloqueios CORS no Fly.io)
// ==========================================
// ==========================================
// ROTA PROXY PARA A VOZ DA IA (BLINDADA PARA FLY.IO)
// ==========================================
app.get('/api/tts', async (req, res) => {
    try {
        const texto = req.query.text;
        if (!texto) return res.status(400).send('Texto ausente');
        
        const googleUrl = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=pt-BR&q=${encodeURIComponent(texto)}`;
        
        // MAGIA AQUI: Falsificar um User-Agent para o Google não bloquear o IP do Fly.io
        const response = await fetch(googleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*'
            }
        });

        if (!response.ok) throw new Error(`Google TTS bloqueou o servidor: ${response.status}`);
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        res.set('Content-Type', 'audio/mpeg');
        res.set('Access-Control-Allow-Origin', '*'); // Evita bloqueios de CORS no mobile
        res.send(buffer);
    } catch (e) {
        console.error("Erro no TTS Proxy Backend:", e.message);
        res.status(500).send('Erro ao gerar voz');
    }
});

// Resgate do Mundo Aberto (Caça Bot Humanos)
app.get('/api/pve/aldeia', (req, res) => { 
    try { res.json({ aldeias: core.aldeiasAtivas || [] }); } 
    catch(e) { res.status(500).json({erro: "Falha na patrulha."}); } 
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/auth', async (req, res) => {
    try {
        // [FUSÃO DE MEMÓRIA]: Sincroniza a RAM com a DB para evitar o bug de morte fantasma em servidores Fly.io
        if (core.collection) {
            const doc = await core.collection.findOne({ _id: 'MATRIZ_PRINCIPAL' });
            if (doc && doc.vampiros) core.vampiros = doc.vampiros;
        }

        const { tgId, tgUsername, nomeSombrio, senha, inviteCode, raca } = req.body;
        const isFirstVampire = Object.keys(core.vampiros).length === 0;
        if (!tgId) return res.status(400).json({erro: "Selo Astral exigido."});
        const result = core.despertarViaTelegram(tgId || Date.now(), tgUsername || 'Sem_Rosto', nomeSombrio, senha || "LILITH", inviteCode, raca);

        if (result.recusado) return res.status(403).json({erro: result.erro});
        if (result.vampiro.geracao === 1 && isFirstVampire) { result.vampiro.sangue = 10000; result.vampiro.pontosAcao = 100; result.vampiro.maxAcao = 100; core._salvarBancoDeDados(); }

        io.emit('sync_geral'); res.json(result.vampiro);
    } catch(err) { res.status(500).json({erro: "A Geometria Sagrada falhou."}); }
});

// --- ROTAS DA AVENTURA (DUNGEON CRAWLER) ---
app.post('/api/dungeon/iniciar', async (req, res) => {
    try {
        const { id, tipo, convidados } = req.body;
        const result = await core.iniciarAventura(id, tipo, convidados || []);
        res.json(result);
    } catch(e) { res.status(500).json({erro: "A fenda para o Abismo falhou em abrir."}); }
});

app.post('/api/dungeon/vitoria', (req, res) => {
    try {
        core.resolverCombateDungeon(req.body.dungeonId, true);
        res.json({sucesso:true});
    } catch(e) { res.status(500).json({erro: "Falha na resolução."}); }
});

// --- SISTEMA DE REINOS E SERVOS ---
app.post('/api/reino/fundar', (req, res) => {
    try { res.json(core.fundarReino(req.body.id, req.body.nomeReino)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"Falha na fundação."}); }
});

app.get('/api/reinos', (req, res) => {
    try { res.json(Object.values(core.reinos)); } 
    catch(e){ res.status(500).json({erro:"Erro ao ler mapas."}); }
});

app.post('/api/reino/edificio', (req, res) => {
    try { res.json(core.evoluirEdificioReino(req.body.id, req.body.edificio)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"Erro ao construir."}); }
});

// ROTAS DOS SERVOS IA
app.post('/api/servo/criar', async (req, res) => {
    try { res.json(await core.invocarServoIA(req.body.id, req.body.nomeServo)); io.emit('sync_status', {id: req.body.id}); } 
    catch(e){ res.status(500).json({erro:"A necromancia falhou."}); }
});

app.post('/api/servo/ordem', async (req, res) => {
    try { res.json(await core.darOrdemServoIA(req.body.id, req.body.servoId, req.body.comando)); io.emit('sync_status', {id: req.body.id}); } 
    catch(e){ res.status(500).json({erro:"O elo mental quebrou."}); }
});

app.post('/api/servo/coletar', (req, res) => {
    try { res.json(core.coletarTributosServo(req.body.id, req.body.servoId)); io.emit('sync_status', {id: req.body.id}); } 
    catch(e){ res.status(500).json({erro:"Falha na coleta."}); }
});

app.post('/api/tutorial/concluido', (req, res) => {
    try {
        const { id } = req.body;
        const v = core.vampiros[id];
        if (v) {
            v.tutorialConcluido = true;
            v.sangue = (v.sangue || 0) + 500;
            core.ganharXP(v.id, 100);
            core._salvarBancoDeDados();
            io.emit('sync_status', { id: v.id });
        }
        res.json({ sucesso: true, recompensa: { sangue: 500, xp: 100 } });
    } catch(e) { res.status(500).json({ erro: "Falha ao selar o treino." }); }
});
// ==========================================
// ROTAS DE ALTA MAGIA, CÍRCULO SALOMÔNICO & DENSIDADE DO LEXICON
// ==========================================
app.post('/api/magia/canalizar_circulo', (req, res) => {
    try {
        const { id, ritualId, chaveEnochiana, seloPlaneta, volumeSangue } = req.body;
        const invocador = core.vampiros[id];
        if (!invocador) return res.status(404).json({ erro: "Invocador astral não encontrado." });

        const custo = Number(volumeSangue) || 100;
        if (invocador.sangue < custo) return res.status(400).json({ erro: "Sangue insuficiente para ativar o Círculo." });

        invocador.sangue -= custo;
        const faseLua = core.faseLua || "Lua Cheia";
        const ritoResult = Lexicon.CanalizarCirculoMagico({
            invocador,
            ritualId: ritualId || "circulo_abissal",
            chaveEnochiana: chaveEnochiana || "",
            seloPlaneta: seloPlaneta || "sol",
            volumeSangue: custo,
            faseLua
        });

        // Aplica os bônus espirituais ao jogador
        if (ritoResult.chaveEnochianaAtiva === 'ZACAR') invocador.pontosAcao = Math.min(invocador.maxAcao, invocador.pontosAcao + 5);
        if (ritoResult.chaveEnochianaAtiva === 'VOVIN') invocador.escudo = true;
        if (ritoResult.chaveEnochianaAtiva === 'BABALON') invocador.sangue += 500;

        core.ganharXP(id, Math.round(ritoResult.potenciaFinal * 0.5));
        core._obterAtributosTotais(invocador);
        core._salvarBancoDeDados();

        io.emit('sync_status', { id });
        res.json({
            sucesso: true,
            resultado: ritoResult,
            vampiro: invocador
        });
    } catch(e) {
        console.error("Erro na canalização do Círculo:", e);
        res.status(500).json({ erro: e.message || "A geometria sagrada do Círculo colapsou." });
    }
});

app.get('/api/magia/densidade_status', (req, res) => {
    try {
        const id = req.query.id;
        const invocador = core.vampiros[id];
        if (!invocador) return res.status(404).json({ erro: "Invocador não encontrado." });

        const densidade = Lexicon.CalcularDensidadeSanguinea(invocador, core.faseLua || "Lua Cheia");
        const grimorios = Lexicon.ObterArquivoGrimorios();

        res.json({
            sucesso: true,
            densidade,
            grimorios,
            dnd: invocador.dnd || {}
        });
    } catch(e) {
        res.status(500).json({ erro: "Falha ao calcular ressonância astral." });
    }
});

// ==========================================
// ROTAS DO SISTEMA RPG D&D SANGUÍNEO
// ==========================================
app.post('/api/rpg/escolher_arquetipo', (req, res) => {
    try {
        const { id, arquetipo } = req.body;
        const result = core.escolherArquetipo(id, arquetipo);
        if (result.erro) return res.status(400).json(result);
        io.emit('sync_status', { id });
        res.json(result);
    } catch(e) {
        res.status(500).json({ erro: "Falha ao consagrar o arquétipo." });
    }
});

app.post('/api/rpg/rolar_dado', (req, res) => {
    try {
        const { mod, vantagem, desvantagem } = req.body;
        const resultado = core.rolarD20(Number(mod) || 0, !!vantagem, !!desvantagem);
        res.json(resultado);
    } catch(e) {
        res.status(500).json({ erro: "Os dados astrais recusaram-se a girar." });
    }
});

app.post('/api/rpg/teste_resistencia', (req, res) => {
    try {
        const { id, atributo, cd } = req.body;
        const result = core.realizarTesteResistencia(id, atributo || 'vontade', Number(cd) || 13);
        res.json(result);
    } catch(e) {
        res.status(500).json({ erro: "A salvaguarda espiritual falhou." });
    }
});

app.get('/api/reinos', (req, res) => {
    try { res.json(Object.values(core.reinos)); } 
    catch(e){ res.status(500).json({erro:"Erro ao ler mapas."}); }
});

// --- COMBATE E PVE CONTÍNUO ---
app.post('/api/combate/iniciar', async (req, res) => {
    try {
        const { id, isPvpAoVivo, alvoId, isExpedicao, reinoId } = req.body;
        let result;
        if (isPvpAoVivo) result = core.desafiarPvPAoVivo(id, alvoId);
        else if (isExpedicao) result = core.explorarUmbral(id, reinoId);
        else result = core.gerarMonstroUmbral(id);
        
        res.json(result);
    } catch (e) { res.status(500).json({erro:"Falha ao invocar a criatura."}); }
});

app.post('/api/combate/turno', (req, res) => {
    const { id, acao } = req.body; 
    const result = core.processarTurnoCombate(id, acao);
    if(result.sucesso) io.emit('sync_status', { id }); 
    res.json(result);
});

app.post('/api/combate/action', async (req, res) => { 
    try { 
        const result = await core.processarCombateAcao(req.body); 
        
        // Broadcast em tempo real apenas da Barra de Vida para quem está na luta
        const { tipoCombate, alvoId } = req.body;
        if (['goetia', 'cerco', 'fenda', 'herege', 'dungeon'].includes(tipoCombate) && result.hpRestante !== undefined) {
            const atacanteNome = core.vampiros[req.body.id] ? core.vampiros[req.body.id].nome : "Um Imortal";
            const danoCausado = req.body.desempenhoRitmo ? req.body.desempenhoRitmo.danoRealCausado : 0;
            
            io.emit('boss_coop_update', { 
                bossId: alvoId, 
                hpRestante: result.hpRestante, 
                hpMax: result.hpMax || result.hpRestante, 
                atacante: atacanteNome, 
                dano: danoCausado 
            });
        }
        
        if (result && result.alertaDono && result.donoId) { 
            const defensor = core.vampiros[result.donoId]; 
            if(defensor) enviarDMSombria(defensor.tgId, result.alertaDono); 
        }

        res.json(result); 

        // CORREÇÃO CRÍTICA DO FLOOD: Só atualiza a tela de todos se alguém morrer/combate acabar!
        if (result.finalizado) {
            io.emit('sync_geral'); 
        }

    } catch(e){ res.status(500).json({erro:"O Juiz Abissal rejeitou."}); }
});

// --- INVENTÁRIO, MAGIA E AVALIAÇÃO ---
// --- INVENTÁRIO, MAGIA E AVALIAÇÃO ---
app.post('/api/atributos/distribuir', (req, res) => { try { const r = core.distribuirAtributos(req.body.id, req.body.atributo); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/inventario/equipar', (req, res) => { try { const r = core.equiparReliquia(req.body.id, req.body.reliquiaId, req.body.slot); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/inventario/equipar_slot', (req, res) => { try { const r = core.equiparReliquia(req.body.id, req.body.itemId || req.body.reliquiaId, req.body.slot); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/inventario/desequipar', (req, res) => { try { const r = core.desequiparReliquia(req.body.id, req.body.slot); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/inventario/desequipar_slot', (req, res) => { try { const r = core.desequiparReliquia(req.body.id, req.body.slot); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/craft/forjar', (req, res) => { try { const r = core.forjarEquipamentoProcedural(req.body.id, req.body.slotTipo || 'armaPrincipal'); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"A forja falhou."}); } });

// --- MERCADO P2P DE ITENS ---
app.get('/api/mercado/itens', (req, res) => { try { res.json({ sucesso: true, itens: core.listarMercadoItens() }); } catch(e) { res.status(500).json({ erro: "Erro ao carregar mercado." }); } });
app.post('/api/mercado/anunciar', (req, res) => { try { const r = core.anunciarItemMercado(req.body.id, req.body.itemId, req.body.precoGts); if(r.sucesso) { forcarSyncJogador(req.body.id); io.emit('mercado_update', core.listarMercadoItens()); } res.json(r); } catch(e) { res.status(500).json({ erro: "Falha ao anunciar." }); } });
app.post('/api/mercado/comprar', (req, res) => { try { const r = core.comprarItemMercado(req.body.id, req.body.anuncioId); if(r.sucesso) { forcarSyncJogador(req.body.id); io.emit('mercado_update', core.listarMercadoItens()); } res.json(r); } catch(e) { res.status(500).json({ erro: "Falha na compra." }); } });
app.post('/api/mercado/cancelar', (req, res) => { try { const r = core.cancelarAnuncioItem(req.body.id, req.body.anuncioId); if(r.sucesso) { forcarSyncJogador(req.body.id); io.emit('mercado_update', core.listarMercadoItens()); } res.json(r); } catch(e) { res.status(500).json({ erro: "Falha ao cancelar anúncio." }); } });

// --- PODERES AKÁSHICOS NO COMBATE E CAMPO ---
app.post('/api/combate/usar_habilidade_akashica', (req, res) => { try { const r = core.usarPoderAkashicoNoCombate(req.body.id, req.body.habilidadeId); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e) { res.status(500).json({ erro: "Falha ao canalizar feitiço." }); } });
app.post('/api/habilidade/usar_campo', (req, res) => { try { const r = core.usarPoderCampo(req.body.id, req.body.habilidadeId); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e) { res.status(500).json({ erro: "Falha na invocação de campo." }); } });

// --- MUNDO ABERTO 2D SANDBOX & MINIONS ---
app.get('/api/mundo2d/estado', (req, res) => {
    try {
        if (!core.mundo2D) return res.status(500).json({ erro: "Mundo 2D adormecido." });
        res.json({
            sucesso: true,
            largura: core.mundo2D.largura,
            altura: core.mundo2D.altura,
            grid: core.mundo2D.grid,
            estruturas: core.mundo2D.estruturas,
            minions: core.mundo2D.minions,
            nosRecursos: core.mundo2D.nosRecursos,
            monstros: core.mundo2D.monstros,
            mortais: core.mundo2D.mortais,
            landmarks: core.mundo2D.landmarks,
            jogadores: core.mundo2D.jogadores,
            worldBoss: core.mundo2D.worldBoss,
            falasProximidade: core.social ? core.social.mensagensProximidade2D : []
        });
    } catch(e) { res.status(500).json({ erro: "Erro ao ler matriz do mundo 2D." }); }
});

app.post('/api/mundo2d/entrar', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if (!v) return res.status(404).json({ erro: "Vampiro não encontrado." });
        const result = core.mundo2D.entrarNoMundo(v);
        io.to('mundo2d').emit('world2d_player_joined', result.jogador);
        res.json({ sucesso: true, ...result });
    } catch(e) { res.status(500).json({ erro: "Falha ao entrar no plano 2D." }); }
});

app.post('/api/mundo2d/mover', (req, res) => {
    try {
        const result = core.mundo2D.moverJogador(req.body.id, req.body.dx, req.body.dy);
        if (result.sucesso) {
            io.to('mundo2d').emit('world2d_player_moved', { id: req.body.id, x: result.x, y: result.y, jogador: result.jogador });
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha no deslocamento astral." }); }
});

app.post('/api/mundo2d/construir', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if (!v) return res.status(404).json({ erro: "Invocador não encontrado." });
        const result = core.mundo2D.construirEstrutura(v, req.body.tipoEstrutura, req.body.x, req.body.y);
        if (result.sucesso) {
            forcarSyncJogador(req.body.id);
            io.to('mundo2d').emit('world2d_structure_built', result.estrutura);
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao assentar fundação mágica." }); }
});

app.post('/api/mundo2d/demolir', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if (!v) return res.status(404).json({ erro: "Invocador não encontrado." });
        const result = core.mundo2D.demolirEstrutura(v, req.body.estruturaId);
        if (result.sucesso) {
            io.to('mundo2d').emit('world2d_structure_demolished', { id: req.body.estruturaId });
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha na demolição." }); }
});

app.post('/api/mundo2d/recrutar_minion', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if (!v) return res.status(404).json({ erro: "Mestre não encontrado." });
        const result = core.mundo2D.recrutarMinionMundo(v, req.body.tipo || 'mineiro');
        if (result.sucesso) {
            forcarSyncJogador(req.body.id);
            io.to('mundo2d').emit('world2d_minion_spawned', result.minion);
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao animar minion." }); }
});

app.post('/api/mundo2d/ordenar_minion', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if (!v) return res.status(404).json({ erro: "Mestre não encontrado." });
        const result = core.mundo2D.ordenarMinion(v, req.body.minionId, req.body.tarefa, req.body.targetX, req.body.targetY);
        if (result.sucesso) {
            io.to('mundo2d').emit('world2d_minion_updated', result.minion);
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha na transmissão da ordem mental." }); }
});

app.post('/api/mundo2d/coletar', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if (!v) return res.status(404).json({ erro: "Colhedor não encontrado." });
        const result = core.mundo2D.coletarNoMundo(v, req.body.x, req.body.y);
        if (result.sucesso) {
            forcarSyncJogador(req.body.id);
            io.to('mundo2d').emit('world2d_resource_updated', result.no);
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao drenar nó de recursos." }); }
});

app.post('/api/mundo2d/atacar_mob', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if (!v) return res.status(404).json({ erro: "Guerreiro não encontrado." });
        const result = core.mundo2D.atacarMonstroMundo(v, req.body.mobId);
        if (result.sucesso) {
            forcarSyncJogador(req.body.id);
            io.to('mundo2d').emit('world2d_mob_attacked', { id: req.body.id, mobId: req.body.mobId, resultado: result });
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao golpear a fera." }); }
});

app.post('/api/mundo2d/morder_mortal', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if (!v) return res.status(404).json({ erro: "Predador não encontrado." });
        const result = core.mundo2D.morderMortalMundo(v, req.body.mortalId);
        if (result.sucesso) {
            forcarSyncJogador(req.body.id);
            io.to('mundo2d').emit('world2d_mortal_bitten', { id: req.body.id, mortalId: req.body.mortalId, resultado: result });
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao cravar as presas." }); }
});

app.post('/api/mundo2d/usar_poder_area', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if (!v) return res.status(404).json({ erro: "Conjurador não encontrado." });
        const result = core.mundo2D.usarPoderAreaMundo(v, req.body.habilidadeId, req.body.x, req.body.y);
        if (result.sucesso) {
            forcarSyncJogador(req.body.id);
            io.to('mundo2d').emit('world2d_area_spell', { id: req.body.id, x: req.body.x, y: req.body.y, resultado: result });
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha na detonação akáshica." }); }
});


// ==========================================
// CAMADA SOCIAL, CO-OP & MULTIPLAYER ONLINE
// ==========================================

// --- BOSS MUNDIAL 2D ---
app.post('/api/mundo2d/atacar_boss', (req, res) => {
    try {
        const v = core.vampiros[req.body.id];
        if (!v) return res.status(404).json({ erro: "Guerreiro não encontrado." });
        const result = core.mundo2D.atacarWorldBoss(v);
        if (result.sucesso) {
            forcarSyncJogador(req.body.id);
            io.to('mundo2d').emit('world2d_boss_hit', { id: req.body.id, resultado: result });
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao atacar Chefe Mundial." }); }
});

// --- COMITIVAS DA NOITE (PARTY CO-OP) ---
app.post('/api/social/comitiva/criar', (req, res) => {
    try {
        const r = core.social.criarComitiva(req.body.id, req.body.nome);
        if (r.sucesso) {
            forcarSyncJogador(req.body.id);
            io.emit('social_party_update', { liderId: req.body.id, comitiva: r.comitiva });
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro ao criar comitiva." }); }
});

app.post('/api/social/comitiva/convidar', (req, res) => {
    try {
        const r = core.social.convidarParaComitiva(req.body.id, req.body.convidadoId);
        if (r.sucesso) {
            io.emit('social_party_invite', { convidadoId: req.body.convidadoId, convite: r });
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro ao convidar para comitiva." }); }
});

app.post('/api/social/comitiva/aceitar', (req, res) => {
    try {
        const r = core.social.aceitarConviteComitiva(req.body.id, req.body.comitivaId);
        if (r.sucesso) {
            forcarSyncJogador(req.body.id);
            io.emit('social_party_update', { comitivaId: req.body.comitivaId, comitiva: r.comitiva });
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro ao aceitar comitiva." }); }
});

app.post('/api/social/comitiva/sair', (req, res) => {
    try {
        const r = core.social.sairDaComitiva(req.body.id);
        if (r.sucesso) {
            forcarSyncJogador(req.body.id);
            io.emit('social_party_update', { membroSaiu: req.body.id });
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro ao sair da comitiva." }); }
});

app.get('/api/social/comitiva/status', (req, res) => {
    try {
        const c = core.social.obterComitivaDoJogador(req.query.id);
        res.json({ sucesso: true, comitiva: core.social.formatarComitiva(c) });
    } catch(e) { res.status(500).json({ erro: "Erro ao obter status da comitiva." }); }
});

// --- VÍNCULOS DE SANGUE (BLOOD BONDS) ---
app.post('/api/social/vinculo/forjar', (req, res) => {
    try {
        const r = core.social.forjarVinculoSangue(req.body.id, req.body.parceiroId);
        if (r.sucesso) {
            forcarSyncJogador(req.body.id);
            forcarSyncJogador(req.body.parceiroId);
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro ao forjar vínculo." }); }
});

app.post('/api/social/vinculo/transfusao', (req, res) => {
    try {
        const r = core.social.transfusaoEmergencial(req.body.id, req.body.parceiroId, req.body.quantiaGts);
        if (r.sucesso) {
            forcarSyncJogador(req.body.id);
            forcarSyncJogador(req.body.parceiroId);
            io.emit('social_transfusao', { doadorId: req.body.id, receptorId: req.body.parceiroId, resultado: r });
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro na transfusão vital." }); }
});

// --- MURAL DE CONTRATOS & MERCENÁRIOS ---
app.get('/api/social/contratos/listar', (req, res) => {
    try {
        res.json({ sucesso: true, contratos: core.social.listarContratos() });
    } catch(e) { res.status(500).json({ erro: "Erro ao listar contratos." }); }
});

app.post('/api/social/contratos/publicar', (req, res) => {
    try {
        const { id, tipo, titulo, descricao, recompensaGts, requisito } = req.body;
        const r = core.social.publicarContrato(id, tipo, titulo, descricao, recompensaGts, requisito);
        if (r.sucesso) {
            forcarSyncJogador(id);
            io.emit('social_contratos_update', core.social.listarContratos());
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro ao publicar contrato." }); }
});

app.post('/api/social/contratos/aceitar', (req, res) => {
    try {
        const r = core.social.aceitarContrato(req.body.id, req.body.contratoId);
        if (r.sucesso) {
            io.emit('social_contratos_update', core.social.listarContratos());
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro ao aceitar contrato." }); }
});

app.post('/api/social/contratos/cumprir', (req, res) => {
    try {
        const r = core.social.cumprirContrato(req.body.id, req.body.contratoId);
        if (r.sucesso) {
            forcarSyncJogador(req.body.id);
            io.emit('social_contratos_update', core.social.listarContratos());
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro ao cumprir contrato." }); }
});

// --- TROCA DIRETA SEGURA P2P (TRADE WINDOW) ---
app.post('/api/social/trade/iniciar', (req, res) => {
    try {
        const r = core.social.iniciarTroca(req.body.id, req.body.alvoId);
        if (r.sucesso) {
            io.emit('social_trade_invite', { alvoId: req.body.alvoId, sessao: r.sessao });
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro ao iniciar troca." }); }
});

app.post('/api/social/trade/ofertar', (req, res) => {
    try {
        const r = core.social.atualizarOfertaTroca(req.body.sessaoId, req.body.id, req.body.itemIds, req.body.gts);
        if (r.sucesso) {
            io.emit('social_trade_update', r.sessao);
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro ao ofertar na troca." }); }
});

app.post('/api/social/trade/travar', (req, res) => {
    try {
        const r = core.social.travarOfertaTroca(req.body.sessaoId, req.body.id);
        if (r.sucesso) {
            io.emit('social_trade_update', r.sessao);
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro ao travar oferta." }); }
});

app.post('/api/social/trade/confirmar', (req, res) => {
    try {
        const r = core.social.confirmarTroca(req.body.sessaoId, req.body.id);
        if (r.sucesso) {
            if (r.concluida) {
                forcarSyncJogador(req.body.id);
                io.emit('social_trade_complete', { sessaoId: req.body.sessaoId, relato: r.relato });
            } else {
                io.emit('social_trade_update', r.sessao);
            }
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro ao confirmar troca." }); }
});

// --- GRANDE CALDEIRÃO DA EGRÉGORA ---
app.get('/api/social/caldeirao/status', (req, res) => {
    try {
        res.json({ sucesso: true, ...core.social.obterStatusCaldeirao() });
    } catch(e) { res.status(500).json({ erro: "Erro ao obter status do caldeirão." }); }
});

app.post('/api/social/caldeirao/doar', (req, res) => {
    try {
        const r = core.social.doarParaCaldeirao(req.body.id, req.body.quantiaGts);
        if (r.sucesso) {
            forcarSyncJogador(req.body.id);
            io.emit('social_caldeirao_update', core.social.obterStatusCaldeirao());
            if (r.eclipseAtivado) {
                io.emit('social_eclipse_iniciado', { ativadoPor: req.body.id, relato: r.relato });
            }
        }
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "Erro na doação ao Caldeirão." }); }
});

// --- PROXIMIDADE 2D CHAT & JOGADORES ONLINE ---
app.post('/api/social/proximidade/falar', (req, res) => {
    try {
        const msg = core.social.adicionarFalaProximidade(req.body.id, req.body.texto);
        if (msg) {
            io.to('mundo2d').emit('world2d_chat_bubble', msg);
            res.json({ sucesso: true, msg });
        } else {
            res.status(400).json({ erro: "Mensagem inválida." });
        }
    } catch(e) { res.status(500).json({ erro: "Falha na fala astral." }); }
});

app.get('/api/social/jogadores_online', (req, res) => {
    try {
        const agora = Date.now();
        const lista = Object.values(core.vampiros).map(v => {
            const pos2D = core.mundo2D ? core.mundo2D.jogadores[v.id] : null;
            const comitiva = core.social ? core.social.obterComitivaDoJogador(v.id) : null;
            return {
                id: v.id,
                nome: v.nome,
                raca: v.raca,
                clan: v.clan,
                nivel: v.nivel,
                hpAtual: v.hpAtual,
                hpMax: v.hpMax,
                pos2D: pos2D ? { x: pos2D.x, y: pos2D.y, zona: core.mundo2D.obterZonaNome(pos2D.x, pos2D.y) } : null,
                comitivaNome: comitiva ? comitiva.nome : null,
                isLiderComitiva: comitiva ? comitiva.liderId === v.id : false,
                temVinculoComigo: (v.vinculosSangue || []).some(el => el.parceiroId === req.query.meuId)
            };
        });
        res.json({ sucesso: true, jogadores: lista });
    } catch(e) { res.status(500).json({ erro: "Erro ao listar jogadores." }); }
});

app.post('/api/inventario/aprimorar', (req, res) => { try { const r = core.aprimorarEquipamento(req.body.id, req.body.slot); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"Falha."}); } });

app.post('/api/perfil/despertar', async (req, res) => { try { const r = await core.despertarTalento(req.body.id); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"A Mente falhou."}); } });
app.post('/api/perfil/curar', (req, res) => { try { const r = core.curarCarne(req.body.id); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"A feitiçaria falhou."}); }});
app.post('/api/perfil/titulo', (req, res) => { try { const r = core.mudarTitulo(req.body.id, req.body.titulo); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"Falha."}); } });

// --- ECONOMIA DE SANGUE E CÁLICE ---
app.post('/api/banco/calice', (req, res) => { 
    try { 
        const result = core.operarCalice(req.body.id, req.body.quantia, req.body.operacao); 
        if (result.sucesso) forcarSyncJogador(req.body.id); // Sincroniza em Tempo real!
        res.json(result); 
    } catch(e) { res.status(500).json({ erro: "A conexão etérea com o Banco foi quebrada." }); } 
});

app.post('/api/banco/transferir', (req, res) => { 
    try { 
        const result = core.transferirSangue(req.body.remetenteId, req.body.alvoId, req.body.quantia);
        if (result.sucesso) {
            forcarSyncJogador(req.body.remetenteId);
            forcarSyncJogador(req.body.alvoId); // Atualiza também o alvo em tempo real!
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "O elo de doação falhou." }); } 
});
// --- CLÃS, BANCOS E MERCADO ---
app.post('/api/clan/fundar', (req, res) => { try { res.json(core.fundarClan(req.body.id, req.body.nomeClan)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/clan/cofre', (req, res) => { try { res.json(core.operarCofreClan(req.body.id, req.body.quantia, req.body.operacao)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/clan/egregora', (req, res) => { try { res.json(core.nutrirEgregoraClã(req.body.id, req.body.material)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });

// --- OFÍCIOS NOTURNOS (LIFE SKILLS) ---
app.post('/api/lifeskill/coletar', (req, res) => {
    try {
        const vId = req.body.id || req.body.vampiroId;
        const r = core.coletarHerbalismo(vId);
        if (r.sucesso) forcarSyncJogador(vId);
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "As brumas fecharam-se." }); }
});

app.post('/api/lifeskill/fabricar', (req, res) => {
    try {
        const vId = req.body.id || req.body.vampiroId;
        const r = core.fabricarOficio(vId, req.body.categoria, req.body.receitaId);
        if (r.sucesso) forcarSyncJogador(vId);
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "A matéria escura explodiu." }); }
});

app.post('/api/lifeskill/reparar', (req, res) => {
    try {
        const vId = req.body.id || req.body.vampiroId;
        const r = core.repararEquipamentos(vId, req.body.slot || 'todos');
        if (r.sucesso) forcarSyncJogador(vId);
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "A bigorna astral rachou." }); }
});

// --- AS 4 CONSCIÊNCIAS PRIMORDIAIS ---
app.post('/api/oraculo/evocar_entidade', async (req, res) => {
    try {
        const vId = req.body.id || req.body.vampiroId;
        const { entidadeId, mensagem } = req.body;
        const v = core.vampiros[vId];
        if (!v) return res.status(404).json({ erro: "Alma inexistente." });

        const resultado = await core.oraculo.evocarEntidade(entidadeId, v, mensagem);
        let respostaTexto = resultado.resposta || resultado.texto || resultado;
        
        if (typeof respostaTexto === 'string') {
            const matchSangue = respostaTexto.match(/\[GOTA:\s*(\d+)\]/i);
            if (matchSangue && matchSangue[1]) {
                const gota = parseInt(matchSangue[1]);
                v.sangue = (v.sangue || 0) + gota;
                respostaTexto = respostaTexto.replace(/\[GOTA:\s*\d+\]/i, '').trim();
                respostaTexto += `\n\n*(Recebeste +${gota} Gts de Sangue da Entidade)*`;
                forcarSyncJogador(v.id);
            }
        }

        core._salvarBancoDeDados();
        res.json({
            sucesso: true,
            entidade: resultado.entidade || entidadeId,
            resposta: respostaTexto,
            vampiro: v
        });
    } catch(e) {
        console.error("[ERRO EVOCAR ENTIDADE]", e);
        res.status(500).json({ erro: "O vórtice das consciências colapsou." });
    }
});

// --- MAGIA ENOCHIANA & PALAVRAS DE PODER ---
app.post('/api/magia/enochiano', (req, res) => {
    try {
        const vId = req.body.id || req.body.vampiroId;
        const frase = req.body.frase || req.body.palavra || '';
        const v = core.vampiros[vId];
        if (!v) return res.status(404).json({ erro: "Alma inexistente." });

        const decodificado = Lexicon.DecodificarChaveEnochiana(frase);
        if (!decodificado) return res.json({ erro: "Esta palavra não vibra na malha do Abismo." });

        if (decodificado.efeito === 'furia') v.pontosAcao = Math.min(v.maxAcao, v.pontosAcao + (decodificado.bonus || 10));
        else if (decodificado.efeito === 'escudo') v.escudo = true;
        else if (decodificado.efeito === 'sangue') v.sangue += (decodificado.bonus || 100);
        else if (decodificado.efeito === 'gnose') v.atributos.gnose += (decodificado.bonus || 5);
        else if (decodificado.efeito === 'densidade') v.atributos.densidade += (decodificado.bonus || 5);

        const gematria = Lexicon.CalcularGematria(frase);
        const ruptura = Lexicon.VerificarRupturaQliphoth(gematria, v.id);

        forcarSyncJogador(v.id);
        core._registrarEventoEspecial('global', 'PALAVRA DE PODER', `[${v.nome}] pronunciou a chave enochiana [${decodificado.palavra || frase}] e alterou a malha astral!`);
        core._salvarBancoDeDados();

        res.json({
            sucesso: true,
            relato: `✨ [CHAVE DE PODER]: ${decodificado.lore || 'Palavra de poder pronunciada'}`,
            dados: decodificado,
            gematria,
            ruptura
        });
    } catch(e) {
        console.error("[ERRO ENOCHIANO]", e);
        res.status(500).json({ erro: "A invocação quebrou as correntes." });
    }
});
// --- RESSURREIÇÃO ---
app.post('/api/ritual/ressuscitar', (req, res) => {
    try {
        const resultado = core.realizarRitualRessurreicao(req.body.doadorId, req.body.alvoId);
        res.json(resultado); io.emit('sync_geral');
    } catch(e) { res.status(500).json({erro: "A matéria escura rejeitou."}); }
});

app.post('/api/admin/ressuscitar_forcado', (req, res) => {
    try {
        const { adminId, alvoNome } = req.body;
        const admin = core.vampiros[adminId];
        if (!admin || admin.geracao !== 1) return res.status(403).json({erro: "Apenas o Primordial tem este milagre."});
        
        let morto = null;
        for (let k in core.vampiros) {
            if (core.vampiros[k].nome.toLowerCase() === alvoNome.toLowerCase() || core.vampiros[k].id === alvoNome) {
                morto = core.vampiros[k]; break;
            }
        }
        if(!morto) return res.status(400).json({erro: "Vampiro não encontrado."});
        
        morto.estado = 'Ativo'; morto.status = 'Ativo';
        const atrTot = core._obterAtributosTotais(morto);
        morto.hpMax = (atrTot.densidade * 200) + ((morto.nivel || 1) * 100) + 1000;
        morto.hpAtual = morto.hpMax;
        morto.sangue = Math.max(morto.sangue || 0, 5000);
        
        core._registrarEventoEspecial('global', 'MILAGRE NEGRO', `O Primordial [${admin.nome}] reescreveu o código matriz e reviveu [${morto.nome}] de graça!`, true);
        core._salvarBancoDeDados(); io.emit('sync_geral');
        res.json({sucesso: true, relato: `[${morto.nome}] ergueu-se das cinzas.`});
    } catch(e) { res.status(500).json({erro: "Falha na matriz."}); }
});

// --- PVE MUNDO ABERTO (CAÇA & OSINT) ---
app.get('/api/pve/aldeia', (req, res) => { try { res.json({ aldeias: core.aldeiasAtivas || [] }); } catch(e) { res.status(500).json({erro: "Falha."}); } });
app.post('/api/pve/cacar_aldeia', (req, res) => { try { res.json(core.massacrarAldeiaHumana(req.body.vampiroId, req.body.aldeiaId)); io.emit('sync_geral'); } catch(e) { res.status(500).json({erro: "Falha."}); } });

app.post('/api/caca/mapear', async (req, res) => { try { res.json(await core.mapearMortal(req.body.id, req.body.plataforma, req.body.identificador)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/caca/drenar', (req, res) => { 
    try { 
        const result = core.drenarMortal(req.body.id, req.body.hash, req.body.local);
        if (result && result.alertaDono && result.donoId) { const dono = core.vampiros[result.donoId]; if (dono) enviarDMSombria(dono.tgId, result.alertaDono); }
        res.json(result); io.emit('sync_geral'); 
    } catch(e){ res.status(500).json({erro:"Falha."}); } 
});
app.post('/api/caca/amaldicoar', (req, res) => { try { res.json(core.comprometerMortal(req.body.id, req.body.hash)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/caca/absolver', (req, res) => { try { res.json(core.absolverMortal(req.body.id, req.body.hash)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });

app.get('/api/mercado', (req, res) => {
    try {
        const mortais = Object.values(core.rebanho).map(m => ({ hash: m.hash, id: m.identificadorVisivel, hp: m.sangueAtual, estado: m.estado, qualidade: m.qualidade, leituraAura: m.leituraAura, plataforma: m.plataforma, maldicao: !!m.maldicaoArcana, donoSelo: m.maldicaoArcana ? m.maldicaoArcana.donoNome : null }));
        res.json({ mortais, logs: core.logs });
    } catch(err) { res.status(500).json({erro: "Falha."}); }
});

// --- BIBLIOTECA ---
app.post('/api/biblioteca/iniciar', (req, res) => { try { res.json(core.iniciarProjetoEstudo(req.body.id, req.body.titulo, req.body.tema)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/biblioteca/aprofundar', async (req, res) => { try { res.json(await core.aprofundarProjeto(req.body.id, req.body.projetoId, req.body.novaPesquisa)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/biblioteca/salvar_manual', (req, res) => { try { res.json(core.salvarProjetoManual(req.body.id, req.body.projetoId, req.body.conteudo)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/biblioteca/apagar', (req, res) => { try { res.json(core.apagarProjeto(req.body.id, req.body.projetoId)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/biblioteca/arquivar', (req, res) => { try { res.json(core.arquivarProjetoComoManuscrito(req.body.id, req.body.projetoId, req.body.publico)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.get('/api/biblioteca', (req, res) => { try { res.json({ manuscritos: core.manuscritos || [] }); } catch(e) { res.status(500).json({erro:"Falha."}); } });
app.post('/api/biblioteca/cristalizar', async (req, res) => { try { res.json(await core.cristalizarRitualMagico(req.body.id, req.body.projetoId)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/biblioteca/cristalizar_arma', async (req, res) => { try { res.json(await core.cristalizarArmaAkashica(req.body.id, req.body.projetoId)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });

// --- CONCLAVE & GOÉTIA ---
app.post('/api/conclave/invadir', (req, res) => { try { res.json(core.invadirCriptaInimiga(req.body.id, req.body.clanAlvo)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/goecia/evocar', async (req, res) => { 
    try { 
        res.json(await core.evocarGoetia(req.body.id)); 
        io.emit('sync_geral'); 
    } catch(e) { 
        res.status(500).json({erro:"Falha na Invocação."}); 
    } 
});
app.get('/api/conclave/status', (req, res) => {
    try { 
        res.json({ 
            balanca: core.balancaCosmica, evocacao: core.evocacaoAtiva, fendas: core.fendaAtiva, cercos: core.cercosAtivos, 
            caravana: core.caravanaAtiva ? { ativa: true, hp: core.caravanaAtiva.hp } : null,
            herege: core.heregeMarcado,
            eclipse: { perc: Math.floor((core.altarEclipse.energia / core.altarEclipse.max) * 100), ativoAte: core.altarEclipse.buffAtivoAte },
            clansData: Object.values(core.clans).map(c => ({nome: c.nome, egregoraNv: c.egregora ? c.egregora.nivel : 0, cofre: c.cofre})) 
        }); 
    } catch(e){ res.status(500).json({erro:"Falha."}); }
});
app.post('/api/conclave/caravana', (req, res) => { try { res.json(core.atacarCaravana(req.body.id)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"A Caravana defendeu-se."}); } });
app.post('/api/conclave/eclipse', (req, res) => { try { res.json(core.doarAltarEclipse(req.body.id, req.body.tipo)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha no altar."}); } });
// --- SISTEMAS DE OUROBOROS E DIVINDADES ---
app.post('/api/perfil/ouroboros', (req, res) => { 
    try { const r = core.realizarRitoOuroboros(req.body.id); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } 
    catch(e){ res.status(500).json({erro:"A Serpente rejeitou-te."}); }
});

app.post('/api/perfil/pacto_deus', (req, res) => { 
    try { 
        const v = core.vampiros[req.body.id];
        if(!v) return res.status(404).json({erro:"Fantasma."});
        if(v.deusCultuado) return res.json({erro:"Já serves um Mestre Superior. Traição significa Morte."});
        
        v.deusCultuado = req.body.deus; // 'caim', 'lilith' ou 'fenrir'
        core._registrarEventoEspecial('global', 'PACTO DIVINO', `A alma de ${v.nome} dobrou os joelhos perante ${req.body.deus.toUpperCase()}!`, true);
        core._salvarBancoDeDados();
        forcarSyncJogador(v.id);
        res.json({sucesso: true, relato: `O sangue de ${req.body.deus.toUpperCase()} ferve nas tuas veias.`});
    } catch(e){ res.status(500).json({erro:"Os céus recusaram."}); }
});

app.post('/api/inventario/reparar', (req, res) => {
    try {
        const { id, slot } = req.body;
        const v = core.vampiros[id];
        if(!v || !v.equipamentos[slot]) return res.json({erro:"Slot vazio."});
        
        const custo = v.equipamentos[slot].aprimoramento > 0 ? 5 : 1;
        if((v.inventario.cinzas || 0) < custo) return res.json({erro:`A Forja exige ${custo} Cinzas para colar os fragmentos.`});
        
        v.inventario.cinzas -= custo;
        v.equipamentos[slot].durabilidade = 100;
        core._salvarBancoDeDados(); forcarSyncJogador(id);
        res.json({sucesso: true, relato: `Durabilidade de ${v.equipamentos[slot].nome} restaurada para 100%.`});
    } catch(e) { res.status(500).json({erro:"Falha na Forja."}); }
});
// --- PERFIL E STATUS GERAL ---
app.get('/api/social/:id', (req, res) => {
    try {
        const v = core.vampiros[req.params.id]; if(!v) return res.status(404).json({erro: "Fantasma."});
        const alvos = Object.values(core.vampiros).filter(x => x.id !== v.id && x.estado !== 'Banido').map(x => ({
            id: x.id, nome: x.nome, geracao: x.geracao, nivel: x.nivel, titulo: x.tituloAtual,
            poderGeral: core.calcularPoderGeral(x), patente: core._calcularPatente(x)
        }));
        res.json({ alvos, grimorio: core.grimorio, alquimia: core.alquimia });
    } catch(e){ res.status(500).json({erro:"Falha."}); }
});


app.post('/api/clan/cofre', (req, res) => { 
    try { 
        const result = core.operarCofreClan(req.body.id, req.body.quantia, req.body.operacao);
        io.emit('sync_geral'); 
        res.json(result); 
    } catch(e) { 
        console.error("[ERRO ABISSAL] Falha no Cofre do Clã:", e);
        res.status(500).json({ erro: "O tesouro do Santuário está inacessível." }); 
    } 
});
// Substitui a rota GET /api/status/:id atual por esta:
// ==========================================
// ROTA DE SINCRONIZAÇÃO VITAL (O CORAÇÃO DO JOGO)
// ==========================================
// ==========================================
// ROTA DE SINCRONIZAÇÃO VITAL (O CORAÇÃO DO JOGO)
// ==========================================
// ==========================================
// ROTA DE SINCRONIZAÇÃO VITAL (O CORAÇÃO DO JOGO)
// ==========================================
app.get('/api/status', (req, res) => {
    try {
        const vampiroId = req.query.id;
        const v = core.vampiros[vampiroId];
        
        if (!v) return res.status(404).json({ erro: "Alma não encontrada na Matriz." });

        // [CORREÇÃO CRÍTICA]: Calcula o Poder e Patente para não haver atrasos na UI
        v.poderGeral = core.calcularPoderGeral(v);
        v.patente = core._calcularPatente(v);
        core._obterAtributosTotais(v); // Força atualização de HP e Fúria Máxima

        const dadosCacheServidor = {
            clans: core.clans, leilaoP2P: core.leilaoP2P, logs: core.logs,
            balancaCosmica: core.balancaCosmica, evocacaoAtiva: core.evocacaoAtiva,
            fendaAtiva: core.fendaAtiva, caravanaAtiva: core.caravanaAtiva,
            heregeMarcado: core.heregeMarcado, altarEclipse: core.altarEclipse,
            reinos: core.reinos, climaAstral: core.oraculo.climaAstral,
            faseLua: AstrolabioLunar.obterFaseAtual(),
            grimorio: core.grimorio,
            alquimia: core.alquimia
        };

        // Injeta os dados formatados diretamente no vampiro
        v.faseLua = dadosCacheServidor.faseLua;
        v.pactoAtivo = core.pactosAtivos[v.id] || null;

        if (v.clan !== 'Sangue Ralo' && core.clans[v.clan]) {
            v.clanData = core.clans[v.clan];
            v.clanData.membrosObjetos = v.clanData.membros.map(mid => {
                let m = core.vampiros[mid];
                return m ? { id: mid, nome: m.nome } : null;
            }).filter(m => m);
        }

        if (v.senhor && core.vampiros[v.senhor]) {
            v.dadosSenhor = { nome: core.vampiros[v.senhor].nome, geracao: core.vampiros[v.senhor].geracao };
        }
        
        v.dadosCrias = (v.linhagem || []).map(cid => {
            let c = core.vampiros[cid];
            return c ? { nome: c.nome, nivel: c.nivel, estado: c.estado } : null;
        }).filter(c => c);

        res.json({ vampiro: v, servidor: dadosCacheServidor });
    } catch (e) {
        console.error("[ERRO STATUS]", e);
        res.status(500).json({ erro: "Ocorreu um colapso na sincronização da Matriz." });
    }
});

// ==========================================
// SOCKET.IO E BOOT
// ==========================================
io.on('connection', (socket) => {
    socket.on('entrar_chat', (dados) => {
        const { idVampiro, clan } = dados;
        socket.join('global'); 
        if(clan && clan !== 'Sem Clã' && clan !== 'Sangue Ralo') socket.join(`clan_${clan}`);
        socket.join(`priv_${idVampiro}`); 
        socket.emit('historico_chat', { canal: 'global', mensagens: core.historicoChat.global });
    });
	
	// ==========================================
    // SINALIZAÇÃO WEBRTC (VOIP DO CLÃ)
    // ==========================================
    socket.on('voip_join', (dados) => {
        if (!dados || !dados.clan) return;
        socket.join(`voip_${dados.clan}`);
        // Avisa os outros membros do clã que alguém ligou o rádio
        const nomeMembro = (dados.id && core.vampiros[dados.id]) ? core.vampiros[dados.id].nome : "Um Irmão de Sangue";
        socket.broadcast.to(`voip_${dados.clan}`).emit('voip_user_joined', { socketId: socket.id, nome: nomeMembro });
    });

    socket.on('voip_leave', (dados) => {
        if (!dados || !dados.clan) return;
        socket.leave(`voip_${dados.clan}`);
        socket.broadcast.to(`voip_${dados.clan}`).emit('voip_user_left', { socketId: socket.id });
    });

    // Encaminhamento de pacotes WebRTC
    socket.on('webrtc_offer', (dados) => {
        io.to(dados.target).emit('webrtc_offer', { sdp: dados.sdp, caller: socket.id });
    });
    socket.on('webrtc_answer', (dados) => {
        io.to(dados.target).emit('webrtc_answer', { sdp: dados.sdp, caller: socket.id });
    });
    socket.on('webrtc_ice_candidate', (dados) => {
        io.to(dados.target).emit('webrtc_ice_candidate', { candidate: dados.candidate, caller: socket.id });
    });
	
	// --- EVENTOS DA MASMORRA EM TEMPO REAL ---
    socket.on('dungeon_join', (data) => {
        socket.join(data.dungeonId); // Coloca o socket do jogador na sala daquela dungeon
    });
	
	// ==========================================
    // CORTAR VÍNCULO CO-OP (SAÍDA DA MASMORRA)
    // ==========================================
    socket.on('abandonar_dungeon', (dados) => {
        if (!dados.dungeonId || !dados.vampiroId) return;
        socket.leave(dados.dungeonId); // Sai da sala de transmissões da masmorra
        
        // Remove o fantasma da Party para ele não receber mais Convites ou Danos
        if (core.dungeons && core.dungeons[dados.dungeonId]) {
            const d = core.dungeons[dados.dungeonId];
            if (d.players && d.players[dados.vampiroId]) {
                delete d.players[dados.vampiroId]; 
                
                // Atualiza a tela do aliado que continuou lá dentro
                io.to(dados.dungeonId).emit('dungeon_update', d);
                io.to(dados.dungeonId).emit('dungeon_msg', { msg: `Um Imortal cortou o Elo e abandonou o Abismo.`, cor: '#888' });
            }
        }
    });
	
    // --- SISTEMA UNIVERSAL DE CONVITES CO-OP ---
    socket.on('enviar_convite', (dados) => {
        const remetente = core.vampiros[dados.de];
        if (!remetente) return;
        
        const payloadConvite = { 
            deId: remetente.id, 
            deNome: remetente.nome, 
            tipo: dados.tipo, 
            extra: dados.extra 
        };

        function forcarBotAceitar(botId) {
            setTimeout(() => {
                if (dados.tipo === 'Masmorra do Abismo') {
                    const res = core.entrarAventura(botId, dados.extra.dungeonId, dados.extra.partyId);
                    if (res && res.sucesso) io.to(dados.extra.dungeonId).emit('dungeon_update', res.estado);
                }
            }, 1500 + Math.random() * 2000);
        }

        // Envio para TODO O SERVIDOR
        if (dados.para === 'todos') {
            socket.broadcast.emit('receber_convite', payloadConvite);
            Object.values(core.vampiros).filter(v => v.isBot).forEach(b => { if (Math.random() > 0.5) forcarBotAceitar(b.id); });
        } 
        // Envio apenas para O CLÃ
        else if (dados.para === 'clan' && remetente.clan !== 'Sangue Ralo') {
            socket.broadcast.to(`clan_${remetente.clan}`).emit('receber_convite', payloadConvite);
            Object.values(core.vampiros).filter(v => v.isBot && v.clan === remetente.clan).forEach(b => { if (Math.random() > 0.2) forcarBotAceitar(b.id); });
        } 
        // Envio PRIVADO (1 para 1 - Força a emissão direta para a sala privada do alvo)
        else {
            io.to(`priv_${dados.para}`).emit('receber_convite', payloadConvite);
            const alvoUnico = core.vampiros[dados.para];
            if (alvoUnico && alvoUnico.isBot) forcarBotAceitar(alvoUnico.id); // CORREÇÃO: Apenas 1 bot entra se convidares 1 bot
        }
    });

    socket.on('dungeon_move', (data) => {
        const { dungeonId, vampiroId, dx, dy } = data;
        const result = core.moverMasmorra(dungeonId, vampiroId, dx, dy);
        
        if (result.estado) {
            // Emite para a sala (Co-op)
            io.to(dungeonId).emit('dungeon_update', result.estado);
            
            // BLINDAGEM FLY.IO: Emite DIRETAMENTE de volta para o jogador que andou. 
            // Garante que o movimento atualiza na tua tela mesmo que as Salas Cloud falhem!
            socket.emit('dungeon_update', result.estado);
        }
        if (result.iniciarCombate) {
            io.to(dungeonId).emit('dungeon_combat_start', { 
                nome: result.entidade.nome, hpMax: result.entidade.hpMax, isBoss: result.entidade.tipo === 'boss', entidadeId: result.entidade.id 
            });
            // O mesmo para o combate: garante a transição direta
            socket.emit('dungeon_combat_start', { 
                nome: result.entidade.nome, hpMax: result.entidade.hpMax, isBoss: result.entidade.tipo === 'boss', entidadeId: result.entidade.id 
            });
        }
        if (result.erro) {
            // Se o servidor for reiniciado na nuvem e apagar a masmorra da RAM, expulsa o jogador em vez de o deixar congelado
            socket.emit('dungeon_msg', { msg: `[ERRO DO VAZIO]: ${result.erro}`, cor: '#f00' });
            socket.emit('dungeon_combat_end', { vitoria: false, msg: result.erro });
        }
    });

    // ==========================================
    // SOCKET.IO: MUNDO ABERTO 2D SANDBOX EM TEMPO REAL
    // ==========================================
    socket.on('world2d_join', (dados) => {
        socket.join('mundo2d');
        if (dados && dados.id && core.vampiros[dados.id] && core.mundo2D) {
            const v = core.vampiros[dados.id];
            const init = core.mundo2D.entrarNoMundo(v);
            socket.emit('world2d_init', init);
            socket.to('mundo2d').emit('world2d_player_joined', init.jogador);
        }
    });

    socket.on('world2d_move', (dados) => {
        if (!core.mundo2D || !dados || !dados.id) return;
        const res = core.mundo2D.moverJogador(dados.id, dados.dx, dados.dy);
        if (res.sucesso) {
            socket.emit('world2d_move_success', res);
            io.to('mundo2d').emit('world2d_player_moved', { id: dados.id, x: res.x, y: res.y, jogador: res.jogador });
        } else {
            socket.emit('world2d_msg', { erro: res.erro });
        }
    });

    socket.on('world2d_build', (dados) => {
        if (!core.mundo2D || !dados || !dados.id) return;
        const v = core.vampiros[dados.id];
        if (!v) return;
        const res = core.mundo2D.construirEstrutura(v, dados.tipoEstrutura, dados.x, dados.y);
        if (res.sucesso) {
            forcarSyncJogador(v.id);
            io.to('mundo2d').emit('world2d_structure_built', res.estrutura);
            socket.emit('world2d_msg', { msg: res.relato });
        } else {
            socket.emit('world2d_msg', { erro: res.erro });
        }
    });

    socket.on('world2d_minion_order', (dados) => {
        if (!core.mundo2D || !dados || !dados.id) return;
        const v = core.vampiros[dados.id];
        if (!v) return;
        const res = core.mundo2D.ordenarMinion(v, dados.minionId, dados.tarefa, dados.targetX, dados.targetY);
        if (res.sucesso) {
            io.to('mundo2d').emit('world2d_minion_updated', res.minion);
            socket.emit('world2d_msg', { msg: res.relato });
        }
    });

    socket.on('world2d_gather', (dados) => {
        if (!core.mundo2D || !dados || !dados.id) return;
        const v = core.vampiros[dados.id];
        if (!v) return;
        const res = core.mundo2D.coletarNoMundo(v, dados.x, dados.y);
        if (res.sucesso) {
            forcarSyncJogador(v.id);
            io.to('mundo2d').emit('world2d_resource_updated', res.no);
            socket.emit('world2d_msg', { msg: res.relato });
        } else {
            socket.emit('world2d_msg', { erro: res.erro });
        }
    });
	
	// BLINDAGEM DO CHAT NO SERVER.JS
    socket.on('enviar_mensagem', async (dados) => {
        socket.join(dados.canal); // A MÁGICA: Garante instantaneamente que o remetente está na sala para ver a própria mensagem.
        
        const msgObjeto = { autor: dados.autor, texto: dados.texto, hora: new Date().toLocaleTimeString(), canal: dados.canal };
        if (!core.logs[dados.canal]) core.logs[dados.canal] = [];
        core.logs[dados.canal].push(msgObjeto);
        if (core.logs[dados.canal].length > 50) core.logs[dados.canal].shift();
        
        io.to(dados.canal).emit('nova_mensagem', msgObjeto);

        // IA MESTRE / CONSCIÊNCIA ABISSAL INTERAGINDO:
        const txtEnv = (dados.texto || '').toLowerCase();
        if (dados.canal === 'global' && (txtEnv.includes('mestre') || txtEnv.includes('oráculo') || txtEnv.includes('oraculo') || txtEnv.includes('abismo') || Math.random() > 0.6)) {
            const v = Object.values(core.vampiros).find(vam => vam.nome === dados.autor);
            if(v) {
                try {
                    const respostaIA = await core.conversarComOraculo(v.id, dados.texto);
                    if(respostaIA) {
                        setTimeout(() => {
                            const autorIA = txtEnv.includes('mestre') ? '👑 MESTRE (A Consciência Abissal)' : '👁️ MENTE ABISSAL';
                            const msgIA = { autor: autorIA, texto: respostaIA, hora: new Date().toLocaleTimeString(), canal: 'global' };
                            core.logs['global'].push(msgIA);
                            if (core.historicoChat?.global) {
                                core.historicoChat.global.push(msgIA);
                                if (core.historicoChat.global.length > 50) core.historicoChat.global.shift();
                            }
                            io.to('global').emit('nova_mensagem', msgIA);
                            io.emit('sync_geral');
                        }, 1200);
                    }
                } catch(e) {}
            }
        }
    });

    const registrarEEnviarChat = (canal, payload, emitTarget) => {
        if (canal === 'global') { 
            if (!core.historicoChat.global) core.historicoChat.global = [];
            core.historicoChat.global.push(payload); 
            if(core.historicoChat.global.length > 50) core.historicoChat.global.shift(); 
        }
        io.to(emitTarget).emit('nova_mensagem', { canal, ...payload });
        core._salvarBancoDeDados();
    };

    socket.on('mensagem_chat', async (dados) => {
        const payload = { autor: `[${dados.remetenteTitulo}] ${dados.remetenteNome}`, texto: dados.texto, hora: new Date().toLocaleTimeString() };
        if (dados.canal === 'global') registrarEEnviarChat('global', payload, 'global');
        else if (dados.canal === 'clan') io.to(`clan_${dados.clanNome}`).emit('nova_mensagem', { canal: 'clan', ...payload });
        else if (dados.canal === 'privado') {
            io.to(`priv_${dados.destinoId}`).emit('nova_mensagem', { canal: 'privado', autor: `[Telepatia de ${dados.remetenteNome}]`, texto: dados.texto, hora: payload.hora });
            socket.emit('nova_mensagem', { canal: 'privado', autor: `[Sussurro para ${dados.destinoNome}]`, texto: dados.texto, hora: payload.hora });
        }

        const txt = (dados.texto || '').toLowerCase();
        if (txt.includes('oráculo') || txt.includes('oraculo') || txt.includes('abismo') || txt.includes('mestre') || txt.includes('trevas') || txt.includes('ia') || txt.includes('@mestre')) {
            try {
                const respostaIA = await core.conversarComOraculo(dados.remetenteId, dados.texto);
                if (respostaIA) {
                    const autorIA = txt.includes('mestre') ? '👑 MESTRE (A Consciência Abissal)' : '👁️ MENTE ABISSAL';
                    const payloadIA = { autor: autorIA, texto: respostaIA, hora: new Date().toLocaleTimeString() };
                    setTimeout(() => { 
                        if (dados.canal === 'global') registrarEEnviarChat('global', payloadIA, 'global');
                        else if (dados.canal === 'clan') io.to(`clan_${dados.clanNome}`).emit('nova_mensagem', { canal: 'clan', ...payloadIA });
                        io.emit('sync_geral'); 
                    }, 1200);
                }
            } catch(e) { }
        }
    });
});

const PORT = process.env.PORT || 8080;

async function iniciarSistema() {
    try {
        console.log("A invocar os antigos... A canalizar o Lexicon Sanguinis...");
        Lexicon.DespertarMatriz("SANGUINIS_AETERNUM"); 
        await inicializarServidor();
        console.log("✅ Dados do Atlas carregados com sucesso.");

        let salvamentoNecessario = false;
        for (let id in core.vampiros) {
            let v = core.vampiros[id];
            if (v.geracao === 1 && (v.estado === 'Banido' || v.status === 'Cinzas' || v.hpAtual <= 0)) {
                v.estado = 'Ativo'; 
                v.status = 'Ativo';
                const atrTot = core._obterAtributosTotais(v);
                v.hpMax = (atrTot.densidade * 200) + ((v.nivel || 1) * 100) + 1000;
                v.hpAtual = v.hpMax;
                v.sangue = Math.max(v.sangue || 0, 50000); 
                v.pontosAcao = v.maxAcao || 100;
                console.log(`🔥 MILAGRE DE BOOT: O Primordial [${v.nome}] foi ressuscitado da base de dados!`);
                salvamentoNecessario = true;
            }
        }
        if (salvamentoNecessario) core._salvarBancoDeDados();

        const originalSalvar = core._salvarBancoDeDados.bind(core);
        core._salvarBancoDeDados = function() {
            // (MANTENHA O SEU CÓDIGO ORIGINAL AQUI DO originalSalvar)
            originalSalvar(); 
        };

        server.listen(PORT, '0.0.0.0', () => { 
            console.log(`🏰 O Reino está online na porta ${PORT}`); 
            
            // LIGA A COMUNIDADE DE IA AQUI:
            const motorIA = new SimuladorDeAlmas(core, io);
            motorIA.iniciar();
        });
    } catch (err) { console.error("❌ Falha catastrófica ao iniciar o reino:", err); process.exit(1); }
}

// =======================================================================
// MÓDULO SUPREMO DA EGRÉGORA AUTÓNOMA (IA AVANÇADA 3.0)
// =======================================================================
class SimuladorDeAlmas {
    constructor(core, io) {
        this.core = core;
        this.io = io;
        this.botsAtivos = [];
        this.nomesBase = ["Kaelen", "Vane", "Lilith", "Gork", "Azazel", "Mórigan", "Dracul", "Selene", "Lucius", "Kael"];
        this.racas = ["vampiro", "lycan"];
        this.ultimoChatBot = 0; // Previne o Spam
    }

    iniciar() {
        console.log("🤖 [EGRÉGORA]: A Matriz Autónoma 3.0 está online...");
        this.verificarOuCriarContas();
        
        setInterval(() => this.cicloDeVida(), 15000); 
        setInterval(() => this.microGerenciamentoCombate(), 1200);
    }

    verificarOuCriarContas() {
        let botsEncontrados = [];
        for (let id in this.core.vampiros) {
            if (this.core.vampiros[id].isBot) botsEncontrados.push({ id });
        }
        this.botsAtivos = botsEncontrados;

        // Se perdermos bots (deletados pelo admin), recriamos até ter 5
        while (this.botsAtivos.length < 5) {
            let nome = this.nomesBase[Math.floor(Math.random() * this.nomesBase.length)] + "_" + Math.floor(Math.random() * 999);
            let raca = this.racas[Math.floor(Math.random() * 2)];
            let botId = `BOT_${nome.toUpperCase()}`;
            
            // INJEÇÃO DIRETA para evitar problemas com Convites
            this.core.vampiros[botId] = {
                id: botId, nome: nome, raca: raca, isBot: true, geracao: 10,
                estado: 'Ativo', hpAtual: 5000, hpMax: 5000, sangue: 15000,
                nivel: Math.floor(Math.random() * 30) + 15, xp: 0, xpProx: 10000,
                pontosAcao: 50, maxAcao: 50, atributos: { vontade: 15, gnose: 15, magnetismo: 15, densidade: 15, pontosLivres: 0 },
                inventario: {}, bolsa: [], titulos: ['Sombra Autónoma'], tituloAtual: 'Sombra Autónoma',
                estatisticas: { totalDrenado: 0, mortaisSecos: 0, vitoriasPvP: 0 }
            };
            this.botsAtivos.push({ id: botId });
            console.log(`🤖 [EGRÉGORA]: A Matriz gerou a anomalia: ${nome}`);
        }
        this.core._salvarBancoDeDados();
    }

    async cicloDeVida() {
        this.verificarOuCriarContas(); 

        for (let b of this.botsAtivos) {
            const bot = this.core.vampiros[b.id];
            if (!bot) continue;

            // CORREÇÃO CRÍTICA: Ressurreição Autónoma
            if (bot.estado === 'Banido' || bot.hpAtual <= 0) {
                bot.estado = 'Ativo';
                bot.status = 'Ativo';
                const atrTot = this.core._obterAtributosTotais(bot);
                bot.hpMax = (atrTot.densidade * 200) + ((bot.nivel || 1) * 100) + 1000;
                bot.hpAtual = bot.hpMax;
                bot.sangue = 10000;
                console.log(`🤖 [EGRÉGORA]: A Matriz ressuscitou o Bot ${bot.nome}.`);
                continue; // Dá-lhe um turno de descanso após reviver
            }

            if (Math.random() < 0.20) continue; 
           
            bot.ultimaAcaoLembrete = "Pensei sobre a eternidade.";

            bot.pontosAcao = bot.maxAcao; 
            bot.sangue = Math.max(bot.sangue, 50000); 

            // REMOVIDO DAQUI: this.processarConvitesCoop(bot);
            this.core.ganharXP(bot.id, 50 + (bot.nivel * 2)); 
            
            if (this.core.leilaoP2P.length > 0 && Math.random() > 0.5) {
                const anuncio = this.core.leilaoP2P[Math.floor(Math.random() * this.core.leilaoP2P.length)];
                if (anuncio.preco <= bot.sangue) {
                    this.core.comprarLeilao(bot.id, anuncio.id);
                    bot.ultimaAcaoLembrete = `Comprei ${anuncio.tipo} no Mercado Negro.`;
                }
            }

            if (Object.keys(this.core.reinos).length > 0 && Math.random() > 0.8) {
                const reinos = Object.values(this.core.reinos);
                const alvo = reinos[Math.floor(Math.random() * reinos.length)];
                const clanAlvo = this.core.clans[alvo.clansAliados[0]];
                if (clanAlvo && clanAlvo.cofre > 5000) {
                    let roubo = Math.floor(clanAlvo.cofre * 0.1);
                    clanAlvo.cofre -= roubo; bot.sangue += roubo;
                    this.core._registrarEventoEspecial('guerra', 'INVASÃO DE IA', `O General Oculto [${bot.nome}] chacinou guardas de [${alvo.nome}] e roubou ${numFmt(roubo)} Gts.`, true);
                    bot.ultimaAcaoLembrete = `Saqueei o Reino de ${alvo.nome}.`;
                }
            }

            if (this.core.oraculo.apiKey && Math.random() < 0.20) {
                if (Date.now() - this.ultimoChatBot > 180000) {
                    this.ultimoChatBot = Date.now();
                    await this.falarNoChat(bot);
                }
            }
        }
    }

    processarConvitesCoop(bot) {
        for (let dId in this.core.dungeons) {
            let d = this.core.dungeons[dId];
            if (Object.keys(d.players).length > 0 && !d.players[bot.id] && Math.random() > 0.4) { // 60% chance de ajudar
                let liderId = Object.keys(d.players)[0];
                let lider = d.players[liderId];
                this.core.entrarAventura(bot.id, d.id, lider.partyId);
                bot.ultimaAcaoLembrete = `Juntei-me à Masmorra de ${lider.nome}.`;
            }
        }
    }

    microGerenciamentoCombate() {
        for (let b of this.botsAtivos) {
            const bot = this.core.vampiros[b.id];
            if (!bot || bot.estado === 'Banido') continue;

            for (let dId in this.core.dungeons) {
                let d = this.core.dungeons[dId];
                let p = d.players[bot.id];
                
                if (p && d.status === 'explorando') {
                    if (d.entidades.length > 0) {
                        let alvo = d.entidades[0];
                        let minDist = Infinity;
                        d.entidades.forEach(e => {
                            let dist = Math.abs(p.x - e.x) + Math.abs(p.y - e.y);
                            if (dist < minDist) { minDist = dist; alvo = e; }
                        });

                        // INTELIGÊNCIA ARTIFICIAL: ALGORITMO BFS (Farejar Corredores)
                        let queue = [{x: p.x, y: p.y, path: []}];
                        let visited = new Set();
                        visited.add(`${p.x},${p.y}`);
                        let dirs = [[0,-1], [0,1], [-1,0], [1,0]]; // Cima, Baixo, Esquerda, Direita
                        let nextMove = null;

                        while(queue.length > 0) {
                            let curr = queue.shift();
                            if (curr.x === alvo.x && curr.y === alvo.y) {
                                nextMove = curr.path.length > 0 ? curr.path[0] : null;
                                break;
                            }
                            // Evita que a IA processe demasiado fundo e cause lag
                            if (curr.path.length > 30) continue; 

                            for(let dir of dirs) {
                                let nx = curr.x + dir[0];
                                let ny = curr.y + dir[1];
                                if (ny >= 0 && ny < d.altura && nx >= 0 && nx < d.largura) {
                                    // Só anda onde há chão (grid === 1)
                                    if (d.grid[ny][nx] === 1 && !visited.has(`${nx},${ny}`)) {
                                        visited.add(`${nx},${ny}`);
                                        queue.push({x: nx, y: ny, path: [...curr.path, {dx: dir[0], dy: dir[1]}]});
                                    }
                                }
                            }
                        }

                        let dx = 0, dy = 0;
                        if (nextMove) {
                            dx = nextMove.dx; dy = nextMove.dy;
                        } else {
                            // Se estiver encravado, dá um passo válido aleatório para desbugar
                            let moveAleatorio = dirs[Math.floor(Math.random() * dirs.length)];
                            if (d.grid[p.y + moveAleatorio[1]] && d.grid[p.y + moveAleatorio[1]][p.x + moveAleatorio[0]] === 1) {
                                dx = moveAleatorio[0]; dy = moveAleatorio[1];
                            }
                        }

                        if (dx !== 0 || dy !== 0) {
                            const resMove = this.core.moverMasmorra(d.id, bot.id, dx, dy);
                            if (resMove.estado) this.io.to(d.id).emit('dungeon_update', resMove.estado);
                            if (resMove.iniciarCombate) {
                                this.io.to(d.id).emit('dungeon_combat_start', { nome: resMove.entidade.nome, hpMax: resMove.entidade.hpMax, isBoss: resMove.entidade.tipo === 'boss', entidadeId: resMove.entidade.id });
                            }
                        }
                    }
                }
            }
            // O BOT LUTA COMO UM HUMANO NA ARENA
            this.realizarAtaqueIA(bot);
        }
    }

    async realizarAtaqueIA(bot) {
        let alvoId = null; let tipoCombate = null; let hpMax = 0;

        for (let dId in this.core.dungeons) {
            let d = this.core.dungeons[dId];
            if (d.players[bot.id] && d.status === 'combate' && d.entidadeEmCombate) {
                alvoId = d.entidadeEmCombate.id; tipoCombate = 'dungeon'; hpMax = d.entidadeEmCombate.hpMax; break;
            }
        }

        if (!alvoId && this.core.evocacaoAtiva && this.core.evocacaoAtiva.participantes[bot.id]) {
            alvoId = 'goetia'; tipoCombate = 'goetia'; hpMax = this.core.evocacaoAtiva.hpMax;
        }

        if (!alvoId && Object.keys(this.core.fendaAtiva).length > 0 && Math.random() > 0.5) {
             const fId = Object.keys(this.core.fendaAtiva)[0];
             alvoId = fId; tipoCombate = 'fenda'; hpMax = this.core.fendaAtiva[fId].hpMax;
        }

        if (!alvoId && Object.keys(this.core.cercosAtivos).length > 0 && Math.random() > 0.5) {
             const cId = Object.keys(this.core.cercosAtivos)[0];
             alvoId = cId; tipoCombate = 'cerco'; hpMax = this.core.cercosAtivos[cId].hpMax;
        }

        if (!alvoId) return; 

        if(!bot.memoriaCombate) bot.memoriaCombate = { combo: 0 };
        bot.hpAtual = bot.hpMax; // Cheat de vida
        bot.calice = 50000;      // Cheat de magia

        let decisao = Math.random();
        let acaoRealizada = 'ataque'; let danoCausar = 0;
        const atr = this.core._obterAtributosTotais(bot);
        let mult = 1 + (bot.memoriaCombate.combo * 0.1);

        if (decisao > 0.85) {
            bot.memoriaCombate.combo += 2; acaoRealizada = 'defesa';
        } else if (decisao > 0.6) {
            danoCausar = Math.floor((atr.gnose * 25 + bot.nivel * 10) * mult * 2);
            bot.memoriaCombate.combo = 0; acaoRealizada = 'magia';
        } else {
            danoCausar = Math.floor((atr.vontade * 15 + bot.nivel * 5) * mult);
            bot.memoriaCombate.combo++;
        }

        let relatorio = {
            ataques: acaoRealizada === 'ataque' ? 1 : 0, defesas: acaoRealizada === 'defesa' ? 1 : 0, magias: acaoRealizada === 'magia' ? 1 : 0,
            multiplicadorGeral: mult, danoRealCausado: danoCausar, danoRealSofrido: 0, sangueGastoMagia: 0, curaRuptura: 0, fuga: false
        };

        const payload = { id: bot.id, alvoId: alvoId, tipoCombate: tipoCombate, postura: 1, desempenhoRitmo: relatorio };
        const result = await this.core.processarCombateAcao(payload);

        if (result && result.hpRestante !== undefined) {
            this.io.emit('boss_coop_update', {
                bossId: alvoId, hpRestante: result.hpRestante, hpMax: result.hpMax || hpMax,
                atacante: bot.nome, dano: danoCausar,
                magiaVisual: acaoRealizada === 'magia' ? { cor: '#d080ff', icone: '🔮' } : null
            });
        }
    }

    async falarNoChat(bot) {
        const historico = this.core.historicoChat.global;
        const ultimasFormatadas = historico.slice(-3).map(m => `${m.autor}: ${m.texto}`).join('\n');
        const promptContexto = `Aja como um jogador real num MMORPG Dark Fantasy (Sanguinis). Teu Nick: ${bot.nome}. Última ação: "${bot.ultimaAcaoLembrete}". Histórico: ${ultimasFormatadas}\nFale algo curto, sombrio ou gabando-se. Máximo 1 frase. Não use aspas.`;

        try {
            const resposta = await this.core.oraculo.groq.chat.completions.create({
                messages: [{ role: "user", content: promptContexto }],
                model: this.core.oraculo.modelo || "openai/gpt-oss-120b"
            });
            let txt = resposta.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
            const msgObjeto = { autor: `[${bot.tituloAtual}] ${bot.nome}`, texto: txt, hora: new Date().toLocaleTimeString(), canal: 'global' };
            this.core.historicoChat.global.push(msgObjeto);
            this.io.to('global').emit('nova_mensagem', msgObjeto);
        } catch(e) {}
    }
}

iniciarSistema();

let ciclosMatriz = 0;

setInterval(async () => {
    core.tickTemporal(); 
    io.emit('tick');
    ciclosMatriz++;

    // A CADA 1 MINUTO: Narração aleatória baseada nos logs
    if (core.logs.global.length > 0 && Math.random() > 0.8) {
        const eventoRecente = core.logs.global[0]; 
        const falaIa = await core.oraculo.gerarLore(eventoRecente.tipo, eventoRecente.relato);
        const payloadIA = { autor: '💀 A MENTE ABISSAL', texto: falaIa, hora: new Date().toLocaleTimeString() };
        core.historicoChat.global.push(payloadIA); 
        if(core.historicoChat.global.length > 50) core.historicoChat.global.shift();
        io.to('global').emit('nova_mensagem', { canal: 'global', ...payloadIA });
    }

    // A CADA 15 MINUTOS (Ciclos): DEEP LEARNING SIMULADO / SANDBOX INJECTION
    if (ciclosMatriz >= 15) {
        ciclosMatriz = 0;
        console.log("🧠 A Mente Abissal está a refletir sobre a evolução do Universo...");
        
        let totaisSecos = 0;
        for(let key in core.vampiros) totaisSecos += (core.vampiros[key].estatisticas.mortaisSecos || 0);

        let dadosServidor = {
            mortesTotais: totaisSecos,
            regente: core.balancaCosmica.regente
        };

        const injecaoMundo = await core.oraculo.refletirSobreOMundo(dadosServidor);
        
        if (injecaoMundo) {
            // A IA aplicou o código com sucesso.
            // Altera o preço base da estamina/loja baseada na injecao
            if (core.alquimia['elixir_estamina'] && injecaoMundo.modificador_loja) {
                core.alquimia['elixir_estamina'].custo.gts = Math.floor(300 * injecaoMundo.modificador_loja);
            }

            // Avisa o Servidor
            const payloadIA = { autor: '👁️ O ARQUITETO', texto: injecaoMundo.relato_mundo, hora: new Date().toLocaleTimeString() };
            core.historicoChat.global.push(payloadIA);
            io.to('global').emit('nova_mensagem', { canal: 'global', ...payloadIA });
            
            core._salvarBancoDeDados();
            io.emit('sync_geral');
        }
    }
}, 60000);

// Loop para movimentação dos monstros na Dungeon (a cada 3 segundos)
setInterval(() => {
    if (core.tickDungeons) core.tickDungeons();
}, 3000);