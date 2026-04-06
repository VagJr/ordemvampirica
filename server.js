// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api'); 
const { ShadowCore, AstrolabioLunar } = require('./ShadowCore.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const core = new ShadowCore();

global.io = io; 

const BOT_TOKEN = "SEU_TOKEN_AQUI"; 
let bot = null;
try { 
    if(BOT_TOKEN && BOT_TOKEN !== "SEU_TOKEN_AQUI") {
        bot = new TelegramBot(BOT_TOKEN, { polling: false }); 
    }
} 
catch (e) { console.warn("Grimório Telegram fechado. A Ordem opera sem DMs do Corvo."); }

// Envio Condicionado para evitar crashes
const enviarDMSombria = async (tgId, mensagem) => {
    if (bot && tgId && tgId.toString().length > 5) {
        try { await bot.sendMessage(tgId, `🦇 *SUSSURRO DA CORTE:*\n\n${mensagem}`, { parse_mode: "Markdown" }); } 
        catch(e) { /* Silêncio sepulcral em caso de bloqueio */ }
    }
};

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/auth', (req, res) => {
    try {
        const { tgId, tgUsername, nomeSombrio, senha, inviteCode } = req.body;
        if(!tgId || !senha) return res.status(400).json({erro: "Faltam elementos no Ritual de Entrada (Falta Senha ou ID)."});
        
        const result = core.despertarViaTelegram(tgId, tgUsername, nomeSombrio, senha, inviteCode);
        if (result.recusado) return res.status(403).json({erro: result.erro}); 
        
        io.emit('sync_geral'); 
        res.json(result.vampiro);
    } catch(err) { 
        console.error(err);
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
        
        const conviteLink = `https://t.me/SEU_BOT_AQUI?startapp=${vampiroId}`;
        const mensagemDM = 
            `🩸 *O VÉU CAIU. A CORTE DA NOITE OBSERVA-O.*\n\n` +
            `Nós escaneamos a sua aura. Nível Vital: *${hpMortal} HP*.\n\n` +
            `O Imortal [${vampiro.tituloAtual}] *${vampiro.nome}* convida-te a beber do nosso Cálice e tornares-te o Predador...\n` +
            `Ou ignorar e ser Comida Humana para a Ordem.\n\n` +
            `A Escolha e a Morte aguardam.`;

        res.json({ sucesso: true, msgPronta: mensagemDM, link: conviteLink });
    } catch(err) { 
        res.status(500).json({erro: "O Corvo Negro falhou."}); 
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

app.post('/api/caca/drenar', (req, res) => { 
    try { 
        const result = core.drenarMortal(req.body.id, req.body.hash, req.body.local);
        if (result && result.alertaDono && result.donoId) {
            const dono = core.vampiros[result.donoId];
            if (dono) enviarDMSombria(dono.tgId, result.alertaDono); 
        }
        res.json(result); 
        io.emit('sync_geral'); 
    } catch(e){ res.status(500).json({erro:"Erro Oculto ao Sorver."}); } 
});

app.post('/api/caca/amaldicoar', (req, res) => { try { res.json(core.comprometerMortal(req.body.id, req.body.hash)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Erro no Selo."}); } });
app.post('/api/magia/conjurar', (req, res) => { try { res.json(core.conjurarRitual(req.body.atacanteId, req.body.ritualId, req.body.alvoId)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Erro na Magia."}); } });
app.post('/api/alquimia/forjar', (req, res) => { try { res.json(core.fabricarAlquimia(req.body.id, req.body.receitaId)); io.emit('sync_geral'); } catch(e){ res.status(500).json({erro:"Erro na Forja."}); } });

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
    } catch(e){ res.status(500).json({erro:"A Aura falhou a leitura."}); }
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
    });
});

setInterval(async () => {
    core.tickTemporal();
    io.emit('tick');
    if (core.logs.global.length > 0 && Math.random() > 0.85) {
        const eventoRecente = core.logs.global[0];
        const falaIa = await core.oraculo.gerarLore(eventoRecente.tipo, eventoRecente.relato);
        io.to('global').emit('nova_mensagem', { canal: 'global', autor: '💀 A MENTE ABISSAL', texto: falaIa, hora: new Date().toLocaleTimeString() });
    }
}, 60000);

process.on('SIGINT', () => { core._selarRegistosAkashicos(); process.exit(); });
process.on('SIGTERM', () => { core._selarRegistosAkashicos(); process.exit(); });

server.listen(3000, () => console.log('🩸 A Távola Negra Despertou. Magia Ativa na porta 3000.'));