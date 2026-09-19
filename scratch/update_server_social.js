const fs = require('fs');

let serverCode = fs.readFileSync('server.js', 'utf8');

// 1. Add SocialCore require
if (!serverCode.includes("const SocialCore = require('./SocialCore.js');")) {
    serverCode = serverCode.replace(
        "const { ShadowCore, AstrolabioLunar } = require('./ShadowCore.js');",
        "const { ShadowCore, AstrolabioLunar } = require('./ShadowCore.js');\nconst SocialCore = require('./SocialCore.js');"
    );
}

// 2. Initialize social core on core
if (!serverCode.includes("core.social = new SocialCore(core);")) {
    serverCode = serverCode.replace(
        "const core = new ShadowCore();",
        "const core = new ShadowCore();\ncore.social = new SocialCore(core);"
    );
}

// 3. Save social state in salvarBancoLocal
if (!serverCode.includes("social: core.social ? core.social.salvarEstado() : null,")) {
    serverCode = serverCode.replace(
        "mercadoIdCounter: core.mercadoIdCounter || 1,",
        "mercadoIdCounter: core.mercadoIdCounter || 1,\n            social: core.social ? core.social.salvarEstado() : null,"
    );
}

// 4. Load social state in carregarBancoLocal
if (!serverCode.includes("if (doc.social && core.social) core.social.carregarEstado(doc.social);")) {
    serverCode = serverCode.replace(
        "if (doc.mercadoIdCounter) core.mercadoIdCounter = doc.mercadoIdCounter;",
        "if (doc.mercadoIdCounter) core.mercadoIdCounter = doc.mercadoIdCounter;\n                if (doc.social && core.social) core.social.carregarEstado(doc.social);"
    );
}

// 5. Update GET /api/mundo2d/estado to include worldBoss and falasProximidade
if (!serverCode.includes("worldBoss: core.mundo2D.worldBoss,")) {
    serverCode = serverCode.replace(
        "jogadores: core.mundo2D.jogadores\n        });",
        "jogadores: core.mundo2D.jogadores,\n            worldBoss: core.mundo2D.worldBoss,\n            falasProximidade: core.social ? core.social.mensagensProximidade2D : []\n        });"
    );
}

// 6. Insert new social and boss routes
const socialRoutes = `
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
`;

if (!serverCode.includes("/api/social/comitiva/criar")) {
    serverCode = serverCode.replace(
        "app.post('/api/inventario/aprimorar'",
        socialRoutes + "\napp.post('/api/inventario/aprimorar'"
    );
}

fs.writeFileSync('server.js', serverCode, 'utf8');
console.log('server.js successfully patched with Social & Co-op engine.');
