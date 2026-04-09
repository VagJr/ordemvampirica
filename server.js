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
const io = new Server(server);
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
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/auth', (req, res) => {
    try {
        const { tgId, tgUsername, nomeSombrio, senha, inviteCode, raca } = req.body;
        const isFirstVampire = Object.keys(core.vampiros).length === 0;
        if (!tgId) return res.status(400).json({erro: "Selo Astral exigido."});
        const result = core.despertarViaTelegram(tgId || Date.now(), tgUsername || 'Sem_Rosto', nomeSombrio, senha || "LILITH", inviteCode, raca);

        if (result.recusado) return res.status(403).json({erro: result.erro});
        if (result.vampiro.geracao === 1 && isFirstVampire) { result.vampiro.sangue = 10000; result.vampiro.pontosAcao = 100; result.vampiro.maxAcao = 100; core._salvarBancoDeDados(); }

        io.emit('sync_geral'); res.json(result.vampiro);
    } catch(err) { res.status(500).json({erro: "A Geometria Sagrada falhou."}); }
});

// --- SISTEMA DE REINOS ---
app.post('/api/reino/fundar', (req, res) => {
    try { res.json(core.fundarReino(req.body.id, req.body.nomeReino)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"Falha na fundação."}); }
});

app.get('/api/reinos', (req, res) => {
    try { res.json(Object.values(core.reinos)); } 
    catch(e){ res.status(500).json({erro:"Erro ao ler mapas."}); }
});

// --- COMBATE E PVE CONTÍNUO ---
app.post('/api/combate/iniciar', async (req, res) => {
    try {
        const { id, isPvpAoVivo, alvoId } = req.body;
        let result;
        if (isPvpAoVivo) result = core.desafiarPvPAoVivo(id, alvoId);
        else result = await core.iniciarCombateUmbral(id);
        res.json(result);
    } catch (e) { res.status(500).json({erro:"Falha"}); }
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
        if (result && result.alertaDono && result.donoId) { 
            const defensor = core.vampiros[result.donoId]; 
            if(defensor) enviarDMSombria(defensor.tgId, result.alertaDono); 
        }
        res.json(result); io.emit('sync_geral'); 
    } catch(e){ res.status(500).json({erro:"O Juiz Abissal rejeitou."}); }
});

// --- INVENTÁRIO, MAGIA E AVALIAÇÃO ---
app.post('/api/atributos/distribuir', (req, res) => { try { res.json(core.distribuirAtributos(req.body.id, req.body.atributo)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/inventario/equipar', (req, res) => { try { res.json(core.equiparReliquia(req.body.id, req.body.reliquiaId)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/inventario/desequipar', (req, res) => { try { res.json(core.desequiparReliquia(req.body.id, req.body.slot)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/inventario/aprimorar', (req, res) => { try { res.json(core.aprimorarEquipamento(req.body.id, req.body.slot)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });

app.post('/api/magia/conjurar', (req, res) => { try { res.json(core.conjurarRitual(req.body.atacanteId, req.body.ritualId, req.body.alvoId)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/alquimia/forjar', (req, res) => { try { res.json(core.fabricarAlquimia(req.body.id, req.body.receitaId)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });

app.post('/api/perfil/despertar', async (req, res) => { try { res.json(await core.despertarTalento(req.body.id)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"A Mente falhou."}); } });
app.post('/api/perfil/curar', (req, res) => { try { res.json(core.curarCarne(req.body.id)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"A feitiçaria falhou."}); }});
app.post('/api/perfil/titulo', (req, res) => { try { res.json(core.mudarTitulo(req.body.id, req.body.titulo)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });

// --- CLÃS, BANCOS E MERCADO ---
app.post('/api/clan/fundar', (req, res) => { try { res.json(core.fundarClan(req.body.id, req.body.nomeClan)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/clan/cofre', (req, res) => { try { res.json(core.operarCofreClan(req.body.id, req.body.quantia, req.body.operacao)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/clan/egregora', (req, res) => { try { res.json(core.nutrirEgregoraClã(req.body.id, req.body.material)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });

app.post('/api/banco/calice', (req, res) => { 
    try { 
        const result = core.operarCalice(req.body.id, req.body.quantia, req.body.operacao); 
        io.emit('sync_geral'); // Força a actualização global a todos
        io.emit('tick'); // Força a UI a recalcular o status na hora
        res.json(result); 
    } catch(e){ res.status(500).json({erro:"Falha."}); } 
});

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
app.post('/api/goecia/evocar', (req, res) => { try { res.json(core.abrirSeloGoetico(req.body.id)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
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

app.get('/api/status/:id', (req, res) => {
    try {
        if(core.vampiros[req.params.id]) {
            const v = core.vampiros[req.params.id];
            let dados = {...v, atributosTotais: core._obterAtributosTotais(v)};
            if (v.clan !== 'Sangue Ralo' && core.clans[v.clan]) dados.clanData = core.clans[v.clan];
            dados.faseLua = AstrolabioLunar.obterFaseAtual();
            dados.pactoAtivo = core.pactosAtivos[v.id] || null;
            dados.poderGeral = core.calcularPoderGeral(v); 
            dados.patente = core._calcularPatente(v); 
            
            const senhor = v.senhor === 'O_PRIMORDIAL' ? null : core.vampiros[v.senhor];
            dados.dadosSenhor = senhor ? { nome: senhor.nome, titulo: senhor.tituloAtual, geracao: senhor.geracao } : { nome: "A Própria Noite", titulo: "Vazio Cósmico", geracao: 0 };
            dados.dadosCrias = v.linhagem.map(cId => { const c = core.vampiros[cId]; return c ? { nome: c.nome, nivel: c.nivel, estado: c.estado } : null; }).filter(Boolean);

            res.json(dados);
        } else res.status(404).json({erro: "Sombra Desvanecida."});
    } catch(e){ res.status(500).json({erro:"A Aura falhou."}); }
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