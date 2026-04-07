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
        catch(e) { /* Bloqueado pelo usuário */ }
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
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db('sanguinis_db');
            core.collection = db.collection('registos_akashicos');
            
            const doc = await core.collection.findOne({ _id: 'MATRIZ_PRINCIPAL' });
            if (doc) {
                core.vampiros = doc.vampiros || {};
                core.rebanho = doc.rebanho || {};
                core.clans = doc.clans || {};
                core.leilaoP2P = doc.leilaoP2P || [];
                core.leilaoIdCounter = doc.leilaoIdCounter || 1;
                core.logs = doc.logs || { global: [], caca: [], guerra: [] };
                console.log("🦇 Almas carregadas da escuridão do Atlas.");
            } else {
                console.log("🌑 O Abismo está vazio. Aguardando o Primeiro Vampiro.");
            }

            // Sobrescreve o salvamento síncrono frágil com o salvamento Atlas asíncrono
            core._salvarBancoDeDados = () => {
                const data = {
                    vampiros: core.vampiros, rebanho: core.rebanho, clans: core.clans,
                    leilaoP2P: core.leilaoP2P, leilaoIdCounter: core.leilaoIdCounter, logs: core.logs
                };
                core.collection.updateOne({ _id: 'MATRIZ_PRINCIPAL' }, { $set: data }, { upsert: true }).catch(console.error);
            };

        } catch (error) {
            console.error("\n❌ CRÍTICO: Falha na conexão MongoDB Atlas! Erro de IP/Firewall.");
            console.error("👉 VÁ NO SEU MONGODB ATLAS -> NETWORK ACCESS -> ADICIONE O IP: 0.0.0.0/0");
            console.error("Caso contrário o jogo não salvará. Erro técnico: ", error.message, "\n");
        }
    } else {
        console.warn("⚠️ MONGO_URI não definida. A usar memória volátil local.");
    }

    server.listen(3000, () => console.log('🩸 O Portão abriu-se na porta 3000.'));
}

inicializarServidor();

// ==========================================
// ROTAS DA APLICAÇÃO
// ==========================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/auth', (req, res) => {
    try {
        // Agora recebemos a "raca" (vampiro ou lycan) da interface de login
        const { tgId, tgUsername, nomeSombrio, senha, inviteCode, raca } = req.body;
        
        const isFirstVampire = Object.keys(core.vampiros).length === 0;

        if (!tgId) return res.status(400).json({erro: "O Selo Astral (ID) é exigido para transmutação."});
        
        // Passa a raça para a função
        const result = core.despertarViaTelegram(
            tgId || Date.now(),
            tgUsername || 'Sem_Rosto', 
            nomeSombrio, 
            senha || "LILITH", 
            inviteCode,
            raca // O Pacto da Raça (Selo de Seth ou Tiamat)
        );

        if (result.recusado) return res.status(403).json({erro: result.erro});

        // Benefício para o Primordial da Raça
        if (result.vampiro.geracao === 1 && isFirstVampire) {
            result.vampiro.sangue = 10000;
            result.vampiro.pontosAcao = 100;
            result.vampiro.maxAcao = 100;
            core._salvarBancoDeDados();
        }

        io.emit('sync_geral'); 
        res.json(result.vampiro);
    } catch(err) {
        console.error("ERRO NO RITUAL DE AUTENTICAÇÃO:", err);
        res.status(500).json({erro: "A Geometria Sagrada falhou no Rito de Passagem."}); 
    }
});

app.post('/api/convidar', async (req, res) => {
    try {
        const { vampiroId, tgTargetUsername } = req.body;
        const vampiro = core.vampiros[vampiroId];
        if (!vampiro) return res.status(400).json({ erro: "Evocador falso." });
        if (!tgTargetUsername) return res.status(400).json({ erro: "Falta a alma do alvo." });
        
        let limpo = tgTargetUsername.replace('@', '').toLowerCase();
        const hashAlvo = core._forjarSigilo('telegram', '@' + limpo);
        const dadosAlvo = core.rebanho[hashAlvo];
        const hpMortal = dadosAlvo ? dadosAlvo.sangueAtual : "Oculto pelas Brumas";
        
        // Use a URL base do seu servidor Render / Bot do Telegram
        const conviteLink = `https://t.me/SEU_BOT_AQUI?startapp=${vampiroId}`;
        const mensagemDM = 
            `🩸 *O VÉU CAIU. A CORTE DA NOITE OBSERVA-O.*\n\n` +
            `Nós escaneamos a sua aura. Nível Vital: *${hpMortal} HP*.\n\n` +
            `O Imortal [${vampiro.tituloAtual}] *${vampiro.nome}* convida-o a beber do nosso Cálice e tornar-se o Predador...\n` +
            `Ou ignorar e ser Comida Humana para a Ordem.\n\n` +
            `A Escolha e a Morte aguardam.`;

        res.json({ sucesso: true, msgPronta: mensagemDM, link: conviteLink });
    } catch(err) { 
        console.error("ERRO NO CONVITE:", err);
        res.status(500).json({erro: "O Corvo Negro falhou."}); 
    }
});

app.post('/api/caca/absolver', (req, res) => { 
    try { 
        res.json(core.absolverMortal(req.body.id, req.body.hash)); 
        io.emit('sync_geral'); 
    } catch(e){ 
        res.status(500).json({erro:"O tribunal cármico falhou."}); 
    } 
});

app.get('/api/mercado', (req, res) => {
    try {
        const mortais = Object.values(core.rebanho).map(m => ({
            hash: m.hash, id: m.identificadorVisivel, hp: m.sangueAtual,
            estado: m.estado, qualidade: m.qualidade, leituraAura: m.leituraAura,
            plataforma: m.plataforma, maldicao: m.maldicaoArcana ? true : false,
            donoSelo: m.maldicaoArcana ? m.maldicaoArcana.donoNome : null
        }));
        res.json({ mortais, logs: core.logs });
    } catch(err) { res.status(500).json({erro: "O Vidro Negro estilhaçou-se."}); }
});

// ROTA DO TRONO PRIMORDIAL (ADMIN - OBLITERAÇÃO)
app.post('/api/admin/obliterar', (req, res) => { 
    try { 
        res.json(core.obliterarHerege(req.body.adminId, req.body.alvoId)); 
        io.emit('sync_geral'); 
    } catch(e){ 
        res.status(500).json({erro:"A lâmina do carrasco falhou."}); 
    } 
});

app.post('/api/atributos/distribuir', (req, res) => { try { res.json(core.distribuirAtributos(req.body.id, req.body.atributo)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha no Rito."}); } });
app.post('/api/inventario/equipar', (req, res) => { try { res.json(core.equiparReliquia(req.body.id, req.body.reliquiaId)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha no Rito."}); } });
app.post('/api/perfil/titulo', (req, res) => { try { res.json(core.mudarTitulo(req.body.id, req.body.titulo)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha no Rito."}); } });

app.post('/api/clan/fundar', (req, res) => { try { res.json(core.fundarClan(req.body.id, req.body.nomeClan)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/clan/cofre', (req, res) => { try { res.json(core.operarCofreClan(req.body.id, req.body.quantia, req.body.operacao)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });

app.get('/api/leilao', (req, res) => { try { res.json(core.leilaoP2P); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/leilao/vender', (req, res) => { try { res.json(core.anunciarNoLeilao(req.body.id, req.body.tipo, req.body.quantiaOuHash, parseInt(req.body.preco))); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });
app.post('/api/leilao/comprar', (req, res) => { try { res.json(core.comprarDoLeilao(req.body.id, parseInt(req.body.anuncioId))); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Falha."}); } });

app.post('/api/caca/mapear', async (req, res) => { 
    try { const r = await core.mapearMortal(req.body.id, req.body.plataforma, req.body.identificador); res.json(r); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"A Visão Astral falhou."}); }
});

// ROTAS DA BIBLIOTECA AKÁSHICA
// ROTAS DO ACERVO AKÁSHICO E BANCADA DE ESTUDOS
app.post('/api/biblioteca/iniciar', (req, res) => { 
    try { res.json(core.iniciarProjetoEstudo(req.body.id, req.body.titulo, req.body.tema)); io.emit('sync_geral'); } 
    catch(e){ console.error(e); res.status(500).json({erro:"O pergaminho rasgou-se."}); } 
});

app.post('/api/biblioteca/aprofundar', async (req, res) => { 
    try { res.json(await core.aprofundarProjeto(req.body.id, req.body.projetoId, req.body.novaPesquisa)); io.emit('sync_geral'); } 
    catch(e){ console.error(e); res.status(500).json({erro:"A entidade calou-se. O Abismo recusou a conexão."}); } 
});

app.post('/api/biblioteca/salvar_manual', (req, res) => { 
    try { res.json(core.salvarProjetoManual(req.body.id, req.body.projetoId, req.body.conteudo)); io.emit('sync_geral'); } 
    catch(e){ console.error(e); res.status(500).json({erro:"A tinta secou antes de tocar no papel."}); } 
});

app.post('/api/biblioteca/apagar', (req, res) => { 
    try { res.json(core.apagarProjeto(req.body.id, req.body.projetoId)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"O fogo mágico falhou."}); } 
});

app.post('/api/biblioteca/arquivar', (req, res) => { 
    try { res.json(core.arquivarProjetoComoManuscrito(req.body.id, req.body.projetoId, req.body.publico)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"O selo de sangue não fixou."}); } 
});

app.get('/api/biblioteca', (req, res) => {
    try { res.json({ manuscritos: core.manuscritos || [] }); } 
    catch(e) { res.status(500).json({erro:"Erro ao abrir a estante."}); }
});

app.post('/api/biblioteca/cristalizar', async (req, res) => { 
    try { res.json(await core.cristalizarRitualMagico(req.body.id, req.body.projetoId)); io.emit('sync_geral'); } 
    catch(e){ console.error(e); res.status(500).json({erro:"A Forja da Realidade colapsou."}); } 
});

app.post('/api/incursoes/explorar', (req, res) => { 
    try { res.json(core.explorarUmbral(req.body.id, req.body.reinoId)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"Foste perdido no vácuo do Umbral."}); } 
});

app.post('/api/caca/drenar', (req, res) => { 
    try { 
        const result = core.drenarMortal(req.body.id, req.body.hash, req.body.local);
        if (result && result.alertaDono && result.donoId) {
            const dono = core.vampiros[result.donoId];
            if (dono) enviarDMSombria(dono.tgId, result.alertaDono); 
        }
        res.json(result); io.emit('sync_geral'); 
    } catch(e){ res.status(500).json({erro:"Erro ao Sorver."}); } 
});

app.post('/api/caca/amaldicoar', (req, res) => { try { res.json(core.comprometerMortal(req.body.id, req.body.hash)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Erro no Selo."}); } });
app.post('/api/magia/conjurar', (req, res) => { try { res.json(core.conjurarRitual(req.body.atacanteId, req.body.ritualId, req.body.alvoId)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Erro na Magia."}); } });
app.post('/api/alquimia/forjar', (req, res) => { try { res.json(core.fabricarAlquimia(req.body.id, req.body.receitaId)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Erro na Forja."}); } });

app.post('/api/banco/transferir', (req, res) => { 
    try { res.json(core.transferirSangue(req.body.remetenteId, req.body.alvoId, req.body.quantia)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"Erro na Ligação Cármica."}); } 
});
app.post('/api/pvp/tatico', (req, res) => { 
    try { 
        const result = core.atacarVampiro(req.body.atacanteId, req.body.defensorId, parseInt(req.body.postura)); 
        if (result && result.alertaDono && result.donoId) {
            const defensor = core.vampiros[result.donoId];
            if(defensor) enviarDMSombria(defensor.tgId, result.alertaDono); 
        }
        res.json(result); io.emit('sync_geral'); 
    } catch(e){ res.status(500).json({erro:"Erro de Colisão Astral."}); }
});

app.post('/api/banco/calice', (req, res) => { try { res.json(core.operarCalice(req.body.id, req.body.quantia, req.body.operacao)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Erro no Cálice."}); } });
// ROTAS DE ALTA MAGIA E CONCLAVE (GvG e Goécia)
app.post('/api/conclave/egregora', (req, res) => { 
    try { res.json(core.nutrirEgregoraClã(req.body.id, req.body.material)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"O Altar recusou o teu tributo."}); } 
});

app.post('/api/conclave/invadir', (req, res) => { 
    try { res.json(core.invadirCriptaInimiga(req.body.id, req.body.clanAlvo)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"As brumas da guerra cegaram-te."}); } 
});

app.post('/api/goecia/evocar', (req, res) => { 
    try { res.json(core.abrirSeloGoetico(req.body.id)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"As linhas do pentagrama quebraram."}); } 
});

app.post('/api/goecia/enfrentar', async (req, res) => { 
    try { res.json(await core.testarVontadeDemonio(req.body.id)); io.emit('sync_geral'); } 
    catch(e){ res.status(500).json({erro:"O demónio distorceu a tua mente."}); } 
});

app.get('/api/conclave/status', (req, res) => {
    try { 
        res.json({ 
            balanca: core.balancaCosmica, 
            evocacao: core.evocacaoAtiva, 
            clansData: Object.values(core.clans).map(c => ({nome: c.nome, egregoraNv: c.egregora ? c.egregora.nivel : 0, cofre: c.cofre})) 
        }); 
    } 
    catch(e){ res.status(500).json({erro:"Falha ao ler o cosmos."}); }
});
app.get('/api/social/:id', (req, res) => {
    try {
        const v = core.vampiros[req.params.id];
        if(!v) return res.status(404).json({erro: "Fantasma."});
        const alvos = Object.values(core.vampiros).filter(x => x.id !== v.id && x.estado !== 'Banido').map(x => ({id: x.id, nome: x.nome, geracao: x.geracao, nivel: x.nivel, titulo: x.tituloAtual}));
        res.json({ alvos, grimorio: core.grimorio, alquimia: core.alquimia });
    } catch(e){ res.status(500).json({erro:"Erro nos Ecos Sociais."}); }
});

app.get('/api/status/:id', (req, res) => {
    try {
        if(core.vampiros[req.params.id]) {
            const v = core.vampiros[req.params.id];
            let dados = {...v, atributosTotais: core._obterAtributosTotais(v)};
            if (v.clan !== 'Sangue Ralo' && core.clans[v.clan]) dados.clanData = core.clans[v.clan];
            dados.faseLua = AstrolabioLunar.obterFaseAtual();
            res.json(dados);
        }
        else res.status(404).json({erro: "Sombra Desvanecida."});
    } catch(e){ res.status(500).json({erro:"A Aura falhou."}); }
});

io.on('connection', (socket) => {
    socket.on('entrar_chat', (dados) => {
        const { idVampiro, clan } = dados;
        socket.join('global'); 
        if(clan && clan !== 'Sem Clã' && clan !== 'Sangue Ralo') socket.join(`clan_${clan}`);
        socket.join(`priv_${idVampiro}`); 
    });

    socket.on('mensagem_chat', (dados) => {
        const payload = { autor: `[${dados.remetenteTitulo}] ${dados.remetenteNome}`, texto: dados.texto, hora: new Date().toLocaleTimeString() };
        
        if (dados.canal === 'global') io.to('global').emit('nova_mensagem', { canal: 'global', ...payload });
        else if (dados.canal === 'clan') io.to(`clan_${dados.clanNome}`).emit('nova_mensagem', { canal: 'clan', ...payload });
        else if (dados.canal === 'privado') {
            io.to(`priv_${dados.destinoId}`).emit('nova_mensagem', { canal: 'privado', autor: `[Telepatia de ${dados.remetenteNome}]`, texto: dados.texto, hora: payload.hora });
            socket.emit('nova_mensagem', { canal: 'privado', autor: `[Sussurro na Mente de ${dados.destinoNome}]`, texto: dados.texto, hora: payload.hora });
        }

        // ====== INTEGRAÇÃO DA IA COM O CHAT ======
        // ====== INTEGRAÇÃO DA IA (MENTE ABISSAL) COM O CHAT ======
        const txt = dados.texto.toLowerCase();
        if (txt.includes('oráculo') || txt.includes('abismo') || txt.includes('mestre') || txt.includes('trevas') || txt.includes('ia')) {
            
            // Passamos o objecto completo do Vampiro para a IA avaliar o poder dele
            const inicianteObj = core.vampiros[dados.remetenteId]; 
            
            if (inicianteObj) {
                core.oraculo.conversarNoChat(inicianteObj, dados.texto).then(respostaIA => {
                    const payloadIA = { autor: `👁️ MENTE ABISSAL`, texto: respostaIA, hora: new Date().toLocaleTimeString() };
                    setTimeout(() => { 
                        if (dados.canal === 'global') io.to('global').emit('nova_mensagem', { canal: 'global', ...payloadIA });
                        else if (dados.canal === 'clan') io.to(`clan_${dados.clanNome}`).emit('nova_mensagem', { canal: 'clan', ...payloadIA });
                    }, 1500);
                });
            }
        }
});

});

setInterval(async () => {
    core.tickTemporal();
    io.emit('tick');
    if (core.logs.global.length > 0 && Math.random() > 0.8) {
        const eventoRecente = core.logs.global[0];
        const falaIa = await core.oraculo.gerarLore(eventoRecente.tipo, eventoRecente.relato);
        io.to('global').emit('nova_mensagem', { canal: 'global', autor: '💀 A MENTE ABISSAL', texto: falaIa, hora: new Date().toLocaleTimeString() });
    }
}, 60000);