// server.js
try { process.loadEnvFile(); } catch(e) {}
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api'); 
const { MongoClient } = require('mongodb');
const { ShadowCore, AstrolabioLunar } = require('./ShadowCore.js');
const Lexicon = require('./LexiconSanguinis.js'); 

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
            return res.status(403).json({ erro: "Heresia. Apenas Mestres Supremos Nv.99 podem rasgar o Véu." });
        }

        // Gerar Dossiê Criptográfico via LexiconSanguinis
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
        } catch(e) {
            // Lexicon pode não estar inicializado, calcular manualmente
            const GEMATRIA = {'a':1,'i':1,'j':1,'q':1,'y':1,'b':2,'k':2,'r':2,'c':3,'g':3,'l':3,'s':3,'d':4,'m':4,'t':4,'e':5,'h':5,'n':5,'x':5,'u':6,'v':6,'w':6,'o':7,'z':7,'f':8,'p':8};
            gematria = nomeAlvo.toLowerCase().replace(/[^a-z]/g, '').split('').reduce((s, c) => s + (GEMATRIA[c] || 0), 0) || 13;
            const corr = (gematria * Date.now()) % 100;
            let qual = 'Humano Mundano';
            if (corr > 90) qual = 'Sangue Negro (Pecador)';
            else if (corr < 5) qual = 'Sangue Puro (Inocente)';
            else if (gematria % 11 === 0) qual = 'Alma Fragmentada';
            julgamento = { pesoEspiritual: gematria, taxaCorrupcao: corr, essencia: qual };
            
            const crypto = require('crypto');
            sigilo = { sigilo: crypto.createHash('sha256').update(nomeAlvo + Date.now()).digest('hex').substring(0, 40), pesoOculto: gematria };
        }

        // Identificar plataformas vinculadas
        const plataformas = [];
        if (instagram) plataformas.push(`Instagram: ${instagram}`);
        if (twitter) plataformas.push(`Twitter/X: ${twitter}`);
        if (urlPerfil) plataformas.push(`Perfil: ${urlPerfil}`);

        // Gerar Análise de IA via Groq
        let analiseIA = 'A Mente Abissal não conseguiu contactar as dimensões exteriores.';
        const groqKey = process.env.GROQ_API_KEY;
        if (groqKey) {
            try {
                const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'llama-3.3-70b-versatile',
                        messages: [
                            { role: 'system', content: 'Tu és a Mente Abissal, o oráculo vampírico ancestral da Ordem Vampírica. Fala em português de Portugal com tom sombrio, místico e profético. Gera uma análise de personalidade oculta baseada no nome e dados fornecidos. Usa Gematria Caldéia, astrologia sombria e leitura de aura vampírica. Sê conciso mas profundo (máx 300 palavras). Inclui: Perfil Energético, Vulnerabilidades Astrais, Pontos de Poder e Recomendação Kármica.' },
                            { role: 'user', content: `Analisa esta alma mortal para o Véu Nosferatu:\nNome: ${nomeReal || 'Desconhecido'}\nInstagram: ${instagram || 'N/A'}\nTwitter: ${twitter || 'N/A'}\nPerfil: ${urlPerfil || 'N/A'}\nNotas: ${notas || 'Nenhuma'}\nPeso Gematria: ${gematria}\nEssência: ${julgamento.essencia}\nCorrupção: ${julgamento.taxaCorrupcao}%` }
                        ],
                        max_tokens: 600,
                        temperature: 0.85
                    })
                });
                if (groqRes.ok) {
                    const groqData = await groqRes.json();
                    analiseIA = groqData.choices?.[0]?.message?.content || analiseIA;
                }
            } catch(e) { console.error('Groq Nosferatu Error:', e.message); }
        }

        // Determinar cor da alma
        let corAlma = '#d080ff';
        if (julgamento.essencia.includes('Negro')) corAlma = '#ff3333';
        else if (julgamento.essencia.includes('Puro')) corAlma = '#00ff88';
        else if (julgamento.essencia.includes('Fragmentada')) corAlma = '#ff8800';

        // Construir dossiê congelado
        const dossie = {
            alvoId,
            nomeAstral: nomeAlvo,
            pesoKarmico: gematria,
            essencia: julgamento.essencia,
            taxaCorrupcao: julgamento.taxaCorrupcao,
            sigilo: sigilo.sigilo,
            plataformas,
            analiseIA,
            corAlma,
            dataVarredura: Date.now()
        };

        // Persistir no vampiro admin
        if (!admin.alvosNosferatu) admin.alvosNosferatu = [];
        admin.alvosNosferatu.push(dossie);
        core._salvarBancoDeDados();

        res.json({ sucesso: true, dossie });
    } catch(e) {
        console.error('Nosferatu Rasgar Véu Error:', e);
        res.status(500).json({ erro: "A Fenda Cósmica rejeitou a varredura." });
    }
});

app.post('/api/nosferatu/acao_karmica', async (req, res) => {
    try {
        const { adminId, alvoId, acao } = req.body;
        const admin = core.vampiros[adminId];
        if (!admin || (!admin.admin && admin.geracao !== 1 && admin.nivel < 99)) {
            return res.status(403).json({ erro: "Heresia. Acesso negado ao Véu." });
        }

        const acoes = {
            'drenar_vitalidade': { nome: 'Drenagem de Vitalidade', custo: 500, desc: 'A energia vital do alvo foi drenada pelas sombras. As forças do Véu respondem com um arrepio dimensional.' },
            'sussurro_veu': { nome: 'Sussurro no Véu', custo: 200, desc: 'Um sussurro astral foi enviado através do Véu. O alvo sentirá um arrepio inexplicável, como se estivesse a ser observado.' },
            'maldicao_espelho': { nome: 'Maldição do Espelho', custo: 1000, desc: 'O espelho negro reflecte a verdade oculta do alvo. Cada reflexo que vir conterá uma sombra a mais.' },
            'laco_sangue': { nome: 'Laço de Sangue', custo: 800, desc: 'Um laço kármico de sangue foi estabelecido. O destino do alvo está agora entrelaçado com o do invocador.' },
            'olho_seth': { nome: 'Olho de Seth', custo: 600, desc: 'O Olho de Seth foi aberto sobre o alvo. Cada acção será registada nos anais do Véu Nosferatu.' },
            'sombra_akasha': { nome: 'Sombra de Akasha', custo: 1500, desc: 'A Sombra de Akasha desceu sobre o alvo. O peso de todas as vidas passadas agora pesa sobre a sua consciência.' }
        };

        const acaoData = acoes[acao];
        if (!acaoData) return res.status(400).json({ erro: "Acção kármica desconhecida." });
        if (admin.sangue < acaoData.custo) return res.status(400).json({ erro: `Sangue insuficiente. Necessário: ${acaoData.custo} Gts.` });

        admin.sangue -= acaoData.custo;

        // Registar nos logs
        core._registrarEventoEspecial(admin.id, 'KARMA NOSFERATU', `${admin.nome} executou [${acaoData.nome}] sobre o alvo [${alvoId}].`, false);
        core._salvarBancoDeDados();
        forcarSyncJogador(admin.id);

        res.json({ sucesso: true, relato: `🕸️ ${acaoData.nome.toUpperCase()}: ${acaoData.desc}` });
    } catch(e) {
        console.error('Nosferatu Ação Kármica Error:', e);
        res.status(500).json({ erro: "O Véu rejeitou a acção kármica." });
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