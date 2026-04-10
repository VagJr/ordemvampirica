// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api'); 
const { MongoClient } = require('mongodb');
const { ShadowCore, AstrolabioLunar } = require('./ShadowCore.js');

const app = express();
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
global.io = io; 

// ==========================================
// CONFIGURAÇÕES DO SERVIDOR
// ==========================================
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ""; 
const MONGO_URI = process.env.MONGO_URI || ""; 

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
                clanInfo.membrosObjetos = clanInfo.membros.map(mid => {
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
            dados.dadosCrias = v.linhagem.map(cId => { const c = core.vampiros[cId]; return c ? { nome: c.nome, nivel: c.nivel, estado: c.estado } : null; }).filter(Boolean);

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

// ==========================================
// INICIALIZAÇÃO DO NÚCLEO E MONGODB ATLAS
// ==========================================
const core = new ShadowCore();

async function inicializarServidor() {
    console.log("A conectar ao Monólito do MongoDB Atlas...");
    if (MONGO_URI) {
        try {
            const client = new MongoClient(MONGO_URI); await client.connect();
            const db = client.db('sanguinis_db'); core.collection = db.collection('registos_akashicos');
            const doc = await core.collection.findOne({ _id: 'MATRIZ_PRINCIPAL' });
            
            if (doc) {
                core.vampiros = doc.vampiros || {}; core.rebanho = doc.rebanho || {}; core.clans = doc.clans || {};
                core.leilaoP2P = doc.leilaoP2P || []; core.leilaoIdCounter = doc.leilaoIdCounter || 1;
                core.logs = doc.logs || { global: [], caca: [], guerra: [] };
                core.manuscritos = doc.manuscritos || []; core.grimorioCustomizado = doc.grimorioCustomizado || {};
                core.balancaCosmica = doc.balancaCosmica || { tiamat: 0, seth: 0, regente: 'Equilíbrio' };
                core.evocacaoAtiva = doc.evocacaoAtiva || null; core.fendaAtiva = doc.fendaAtiva || {};
                core.pactosAtivos = doc.pactosAtivos || {}; core.reliquiasCustomizadas = doc.reliquiasCustomizadas || [];
                core.historicoChat = doc.historicoChat || { global: [], clan: {}, privado: {} };
                core.reinos = doc.reinos || {};
                Object.assign(core.grimorio, core._construirFuncoesCustomizadas(core.grimorioCustomizado));
                console.log("🦇 Almas carregadas da escuridão do Atlas.");
            } else { console.log("🌑 O Abismo está vazio."); }

            core._salvarBancoDeDados = () => {
                const data = { vampiros: core.vampiros, rebanho: core.rebanho, clans: core.clans, leilaoP2P: core.leilaoP2P, leilaoIdCounter: core.leilaoIdCounter, logs: core.logs, manuscritos: core.manuscritos, grimorioCustomizado: core.grimorioCustomizado, balancaCosmica: core.balancaCosmica, evocacaoAtiva: core.evocacaoAtiva, fendaAtiva: core.fendaAtiva, pactosAtivos: core.pactosAtivos, reliquiasCustomizadas: core.reliquiasCustomizadas, historicoChat: core.historicoChat, reinos: core.reinos };
                core.collection.updateOne({ _id: 'MATRIZ_PRINCIPAL' }, { $set: data }, { upsert: true }).catch(console.error);
            };

        } catch (error) { console.error("❌ CRÍTICO: Falha na conexão MongoDB Atlas! ", error.message); }
    } else { console.warn("⚠️ MONGO_URI não definida. Memória volátil."); }
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
    try { res.json(await core.pedirPactoIA(req.body.id)); io.emit('sync_geral'); }
    catch(e) { res.status(500).json({erro: "O Oráculo calou-se no Abismo."}); }
});
app.post('/api/dungeon/entrar', (req, res) => {
    try { res.json(core.entrarAventura(req.body.id, req.body.dungeonId, req.body.partyId)); } 
    catch(e) { res.status(500).json({erro: "A fenda falhou."}); }
});
app.post('/api/chat/pacto/completar', (req, res) => {
    try { res.json(core.completarPacto(req.body.id)); io.emit('sync_geral'); }
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

// O Mercado Negro (Leilão)
app.get('/api/leilao', (req, res) => {
    try { res.json(core.leilaoP2P || []); } 
    catch(e) { res.status(500).json({erro:"Falha ao ler o mercado."}); }
});

app.post('/api/leilao/vender', (req, res) => {
    try { res.json(core.anunciarLeilao(req.body.id, req.body.tipo, req.body.quantiaOuHash, req.body.preco)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"Falha na venda."}); }
});

app.post('/api/leilao/comprar', (req, res) => {
    try { res.json(core.comprarLeilao(req.body.id, req.body.anuncioId)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"Falha na compra."}); }
});

// Resgate do Mundo Aberto (Caça Bot Humanos)
app.get('/api/pve/aldeia', (req, res) => { 
    try { res.json({ aldeias: core.aldeiasAtivas || [] }); } 
    catch(e) { res.status(500).json({erro: "Falha na patrulha."}); } 
});

app.post('/api/pve/cacar_aldeia', (req, res) => { 
    try { res.json(core.massacrarAldeiaHumana(req.body.vampiroId, req.body.aldeiaId)); io.emit('sync_geral'); } 
    catch(e) { res.status(500).json({erro: "Falha no massacre."}); } 
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

// --- SISTEMA DE REINOS ---
app.post('/api/reino/fundar', (req, res) => {
    try { res.json(core.fundarReino(req.body.id, req.body.nomeReino)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"Falha na fundação."}); }
});
// --- RITUAIS PRAÍTICOS ---
// Prepara o ritual, gerando a arte procedural e definindo o minigame
// --- RITUAIS PRÁTICOS ---
// Prepara o ritual, gerando a arte procedural e definindo o minigame

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
        
        // NOVO: Broadcast em tempo real para combates Co-op (INCLUINDO A MASMORRA)
        const { tipoCombate, alvoId } = req.body;
        
        // Agora 'dungeon' também envia o dano em tempo real para as telas dos aliados!
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
        res.json(result); io.emit('sync_geral'); 
    } catch(e){ res.status(500).json({erro:"O Juiz Abissal rejeitou."}); }
});

// --- INVENTÁRIO, MAGIA E AVALIAÇÃO ---
// --- INVENTÁRIO, MAGIA E AVALIAÇÃO ---
app.post('/api/atributos/distribuir', (req, res) => { try { const r = core.distribuirAtributos(req.body.id, req.body.atributo); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/inventario/equipar', (req, res) => { try { const r = core.equiparReliquia(req.body.id, req.body.reliquiaId); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/inventario/desequipar', (req, res) => { try { const r = core.desequiparReliquia(req.body.id, req.body.slot); if(r.sucesso) forcarSyncJogador(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"Falha."}); } });
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

app.post('/api/banco/transferir', (req, res) => { 
    try { 
        res.json(core.transferirSangue(req.body.remetenteId, req.body.alvoId, req.body.quantia)); 
        io.emit('sync_geral'); io.emit('tick'); 
    } catch(e){ res.status(500).json({erro:"Falha."}); } 
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
            faseLua: AstrolabioLunar.obterFaseAtual()
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

        // Envio para TODO O SERVIDOR (Grita para todos exceto quem enviou)
        if (dados.para === 'todos') {
            socket.broadcast.emit('receber_convite', payloadConvite);
        } 
        // Envio apenas para O CLÃ
        else if (dados.para === 'clan' && remetente.clan !== 'Sangue Ralo') {
            socket.broadcast.to(`clan_${remetente.clan}`).emit('receber_convite', payloadConvite);
        } 
        // Envio PRIVADO (1 para 1 - Força a emissão direta para a sala privada do alvo)
        else {
            io.to(`priv_${dados.para}`).emit('receber_convite', payloadConvite);
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
	
	// BLINDAGEM DO CHAT NO SERVER.JS
    socket.on('enviar_mensagem', async (dados) => {
        socket.join(dados.canal); // A MÁGICA: Garante instantaneamente que o remetente está na sala para ver a própria mensagem.
        
        const msgObjeto = { autor: dados.autor, texto: dados.texto, hora: new Date().toLocaleTimeString(), canal: dados.canal };
        if (!core.logs[dados.canal]) core.logs[dados.canal] = [];
        core.logs[dados.canal].push(msgObjeto);
        if (core.logs[dados.canal].length > 50) core.logs[dados.canal].shift();
        
        io.to(dados.canal).emit('nova_mensagem', msgObjeto);

        // IA Interagindo:
        if (dados.canal === 'global' && Math.random() > 0.5) {
            const v = Object.values(core.vampiros).find(vam => vam.nome === dados.autor);
            if(v) {
                const respostaIA = await core.oraculo.interagirChat(dados.texto, v);
                if(respostaIA) {
                    setTimeout(() => {
                        const msgIA = { autor: "Lumia (Mente Abissal)", texto: respostaIA, hora: new Date().toLocaleTimeString(), canal: 'global' };
                        core.logs['global'].push(msgIA);
                        io.to('global').emit('nova_mensagem', msgIA);
                    }, 2000);
                }
            }
        }
    });

    const registrarEEnviarChat = (canal, payload, emitTarget) => {
        if (canal === 'global') { core.historicoChat.global.push(payload); if(core.historicoChat.global.length > 50) core.historicoChat.global.shift(); }
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

        const txt = dados.texto.toLowerCase();
        if (txt.includes('oráculo') || txt.includes('abismo') || txt.includes('mestre') || txt.includes('trevas') || txt.includes('ia')) {
            try {
                const respostaIA = await core.conversarComOraculo(dados.remetenteId, dados.texto);
                if (respostaIA) {
                    const payloadIA = { autor: `👁️ MENTE ABISSAL`, texto: respostaIA, hora: new Date().toLocaleTimeString() };
                    setTimeout(() => { 
                        if (dados.canal === 'global') registrarEEnviarChat('global', payloadIA, 'global');
                        else if (dados.canal === 'clan') io.to(`clan_${dados.clanNome}`).emit('nova_mensagem', { canal: 'clan', ...payloadIA });
                        io.emit('sync_geral'); 
                    }, 1500);
                }
            } catch(e) { }
        }
    });
});

const PORT = process.env.PORT || 8080;

async function iniciarSistema() {
    try {
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
            for (let id in core.vampiros) {
                let v = core.vampiros[id];
                if (v.estado === 'Banido' || v.status === 'Cinzas' || v.hpAtual <= 0) {
                    if (v.geracao === 1) {
                        v.estado = 'Ativo'; v.status = 'Ativo';
                        v.hpAtual = v.hpMax || 1000;
                        v.sangue = Math.max(v.sangue || 0, 10000); 
                        core._registrarEventoEspecial('global', 'IMORTALIDADE ABSOLUTA', `A Morte tentou ceifar o Primordial [${v.nome}], mas o Código Oculto rejeitou-a. Ele ergueu-se intacto.`, true);
                    } 
                    else if (v.inventario && v.inventario.ankh_sangue > 0) {
                        v.inventario.ankh_sangue -= 1;
                        v.estado = 'Ativo'; v.status = 'Ativo';
                        v.hpAtual = v.hpMax || 1000;
                        v.sangue = Math.max(v.sangue || 0, 5000);
                        core._registrarEventoEspecial('global', 'RITO DO IMORTAL', `O Véu da Morte cobriu [${v.nome}], mas o seu Selo de Sangue estilhaçou-se, devolvendo-o à vida!`, true);
                    }
                }
            }
            originalSalvar(); 
        };

        server.listen(PORT, '0.0.0.0', () => { console.log(`🏰 O Reino está online na porta ${PORT}`); });
    } catch (err) { console.error("❌ Falha catastrófica ao iniciar o reino:", err); process.exit(1); }
}

iniciarSistema();

setInterval(async () => {
    core.tickTemporal(); io.emit('tick');
    if (core.logs.global.length > 0 && Math.random() > 0.8) {
        const eventoRecente = core.logs.global[0]; const falaIa = await core.oraculo.gerarLore(eventoRecente.tipo, eventoRecente.relato);
        const payloadIA = { autor: '💀 A MENTE ABISSAL', texto: falaIa, hora: new Date().toLocaleTimeString() };
        core.historicoChat.global.push(payloadIA); if(core.historicoChat.global.length > 50) core.historicoChat.global.shift();
        io.to('global').emit('nova_mensagem', { canal: 'global', ...payloadIA });
    }
}, 60000);

// Loop para movimentação dos monstros na Dungeon (a cada 3 segundos)
setInterval(() => {
    if (core.tickDungeons) core.tickDungeons();
}, 3000);