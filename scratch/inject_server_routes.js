const fs = require('fs');

const path = 'c:/ordemvampirica/server.js';
let content = fs.readFileSync(path, 'utf8');

const targetAnchor = "app.post('/api/combate/action', async (req, res) => {";
const targetEnd = "        if (result.finalizado) {\n            io.emit('sync_geral'); \n        }\n\n    } catch(e){ res.status(500).json({erro:\"O Juiz Abissal rejeitou.\"}); }\n});";

const idx = content.indexOf(targetEnd);
if (idx === -1) {
    console.error("targetEnd not found in server.js!");
    process.exit(1);
}

const insertionPoint = idx + targetEnd.length;

const newRoutes = `

// ==========================================
// ROTAS DE ORDENS INICIÁTICAS & BIBLIOTECA OCULTA
// ==========================================
app.get('/api/ordem/graus', (req, res) => {
    try {
        const { GRAUS_INICIATICOS } = require('./OrdemMagicaCore.js');
        res.json({ sucesso: true, graus: GRAUS_INICIATICOS });
    } catch(e) { res.status(500).json({ erro: "Falha ao consultar graus iniciáticos." }); }
});

app.get('/api/ordem/listar', (req, res) => {
    try {
        res.json(core.ordensCore.listarOrdens());
    } catch(e) { res.status(500).json({ erro: "Falha ao listar ordens místicas." }); }
});

app.get('/api/ordem/minha/:id', (req, res) => {
    try {
        const v = core.vampiros[req.params.id];
        if (!v) return res.status(404).json({ erro: "Iniciado não encontrado." });
        
        let ordemMembro = null;
        let grauAtual = 0;

        if (v.ordemIniciatica && core.ordensCore.ordens[v.ordemIniciatica.ordemId]) {
            ordemMembro = core.ordensCore.ordens[v.ordemIniciatica.ordemId];
            grauAtual = v.ordemIniciatica.grau || 0;
        }

        const { GRAUS_INICIATICOS } = require('./OrdemMagicaCore.js');
        const dadosGrau = GRAUS_INICIATICOS[Math.min(grauAtual, GRAUS_INICIATICOS.length - 1)];

        res.json({
            sucesso: true,
            ordem: ordemMembro,
            grau: grauAtual,
            dadosGrau,
            todosGraus: GRAUS_INICIATICOS
        });
    } catch(e) { res.status(500).json({ erro: "Falha ao carregar ordem pessoal." }); }
});

app.post('/api/ordem/criar', async (req, res) => {
    try {
        const { id, nome, lema, sigiloPrimordial, juramentoSangue } = req.body;
        const result = await core.ordensCore.criarOrdem(id, { nome, lema, sigiloPrimordial, juramentoSangue });
        if (result.sucesso) {
            forcarSyncJogador(id);
            io.emit('sync_geral');
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao fundar a Ordem Mística." }); }
});

app.post('/api/ordem/iniciar_neofito', (req, res) => {
    try {
        const { id, ordemId, juramentoSangue } = req.body;
        const result = core.ordensCore.iniciarNeofito(id, ordemId, juramentoSangue);
        if (result.sucesso) {
            forcarSyncJogador(id);
            io.emit('sync_geral');
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha na iniciação do Neófito." }); }
});

app.post('/api/ordem/promover_grau', (req, res) => {
    try {
        const { id, ordemId, membroId } = req.body;
        const result = core.ordensCore.promoverGrau(id, ordemId, membroId);
        if (result.sucesso) {
            forcarSyncJogador(membroId);
            io.emit('sync_geral');
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao ascender de grau na Ordem." }); }
});

app.post('/api/ordem/doar_egregora', (req, res) => {
    try {
        const { id, ordemId, quantiaVitae } = req.body;
        const result = core.ordensCore.doarEgregora(id, ordemId, quantiaVitae);
        if (result.sucesso) {
            forcarSyncJogador(id);
            io.emit('sync_geral');
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao doar à Egrégora." }); }
});

app.post('/api/ordem/decretar', (req, res) => {
    try {
        const { id, ordemId, tituloDecreto, textoDecreto } = req.body;
        const result = core.ordensCore.proclamarDecreto(id, ordemId, tituloDecreto, textoDecreto);
        if (result.sucesso) {
            io.emit('sync_geral');
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao proclamar decreto." }); }
});

// ==========================================
// ROTAS DA GRANDE BIBLIOTECA OCULTA & ESTUDOS
// ==========================================
app.get('/api/biblioteca/listar', (req, res) => {
    try {
        const esfera = req.query.esfera;
        res.json(core.ordensCore.listarBiblioteca(esfera));
    } catch(e) { res.status(500).json({ erro: "Falha ao listar biblioteca." }); }
});

app.post('/api/biblioteca/submeter_tese', async (req, res) => {
    try {
        const { id, titulo, esfera, corpoTexto } = req.body;
        const result = await core.ordensCore.submeterTese(id, titulo, esfera, corpoTexto);
        if (result.sucesso) {
            forcarSyncJogador(id);
            io.emit('sync_geral');
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao submeter tese à Biblioteca." }); }
});

app.post('/api/biblioteca/estudar_tomo', (req, res) => {
    try {
        const { id, tomoId } = req.body;
        const result = core.ordensCore.estudarTomo(id, tomoId);
        if (result.sucesso) {
            forcarSyncJogador(id);
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao estudar tomo." }); }
});

// ==========================================
// ROTAS DE MAGIA EM CÓDIGO (SAFE CODE-MAGIC SANDBOX)
// ==========================================
app.get('/api/magia_codigo/operadores', (req, res) => {
    res.json({
        sucesso: true,
        operadores: [
            { op: 'TRANSMUTAR', formato: 'TRANSMUTAR("origem", "destino", quantia);', desc: 'Converte materiais com base na Gnose e atributos.' },
            { op: 'CANALIZAR_EGREGORA', formato: 'CANALIZAR_EGREGORA(multiplicador);', desc: 'Extrai poder místico do Templo da sua Ordem, concedendo Escudo e Fúria.' },
            { op: 'DOBRA_ASTRAL', formato: 'DOBRA_ASTRAL("tipo_anomalia", raio);', desc: 'Cria uma anomalia mágica espacial na coordenada atual do Mundo 2D.' },
            { op: 'MALDICAO_VAMPIRICA', formato: 'MALDICAO_VAMPIRICA("alvoId", "tipo");', desc: 'Lança um selo cármico perturbador num rival de clã ou herege.' },
            { op: 'INVOCAR_FORJA_VIVA', formato: 'INVOCAR_FORJA_VIVA("tipo_item");', desc: 'Materializa um artefato vivo no inventário através de éter puro.' },
            { op: 'RESONANCIA_COSMICA', formato: 'RESONANCIA_COSMICA("esfera", intensidade);', desc: 'Alinha as marés cósmicas conferindo bônus temporário de atributos.' }
        ]
    });
});

app.get('/api/magia_codigo/minhas/:id', (req, res) => {
    try {
        res.json(core.ordensCore.listarFeiticos(req.params.id));
    } catch(e) { res.status(500).json({ erro: "Falha ao listar feitiços em código." }); }
});

app.post('/api/magia_codigo/validar', (req, res) => {
    try {
        const { formula } = req.body;
        res.json(core.ordensCore.codeEngine.validarFormula(formula));
    } catch(e) { res.status(500).json({ erro: "Falha ao validar sintaxe mágica." }); }
});

app.post('/api/magia_codigo/forjar', (req, res) => {
    try {
        const { id, nome, esfera, custoSangue, custoFuria, codigoFormula, descricao } = req.body;
        const result = core.ordensCore.forjarFeiticoEmCodigo(id, { nome, esfera, custoSangue, custoFuria, codigoFormula, descricao });
        if (result.sucesso) forcarSyncJogador(id);
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao forjar feitiço em código." }); }
});

app.post('/api/magia_codigo/executar', async (req, res) => {
    try {
        const { id, feiticoId, contexto } = req.body;
        const result = await core.ordensCore.conjurarFeiticoEmCodigo(id, feiticoId, contexto || {});
        if (result.sucesso) {
            forcarSyncJogador(id);
            io.emit('sync_geral');
        }
        res.json(result);
    } catch(e) { res.status(500).json({ erro: "Falha ao executar feitiço em código." }); }
});
`;

content = content.substring(0, insertionPoint) + newRoutes + content.substring(insertionPoint);
fs.writeFileSync(path, content, 'utf8');
console.log('Successfully injected Ordem, Biblioteca and Magia em Código routes into server.js');
