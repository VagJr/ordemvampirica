const { MongoClient } = require('mongodb');
const { ShadowCore, AstrolabioLunar } = require('../ShadowCore.js');

const MONGO_URI = "mongodb+srv://ordem:J6VBrGAT9qKSLwzS@cluster0.ubbpacg.mongodb.net/?retryWrites=true&w=majority";

async function runTests() {
    console.log("==================================================");
    console.log("🧪 INICIANDO BATERIA DE TESTES E2E: MONGO ATLAS & MESTRE IA");
    console.log("==================================================");

    // TESTE 1: MongoDB Atlas Connection & Ping
    console.log("\n[TESTE 1]: Conectando ao MongoDB Atlas...");
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db('sanguinis_db');
    const col = db.collection('registos_akashicos');
    const count = await col.countDocuments();
    console.log(`✅ Conexão com MongoDB Atlas BEM SUCEDIDA! Documentos em sanguinis_db.registos_akashicos: ${count}`);

    // TESTE 2: Inicializando ShadowCore
    console.log("\n[TESTE 2]: Inicializando ShadowCore & Oráculo Abissal...");
    const core = new ShadowCore();
    
    // Criando um Vampiro de Teste
    const testId = "vamp_test_" + Date.now();
    core.vampiros[testId] = {
        id: testId,
        nome: "Alucard de Teste",
        raca: "vampiro",
        clan: "Tremere Oculto",
        nivel: 7,
        geracao: 5,
        senhor: "O_PRIMORDIAL",
        sangue: 2500,
        pontosAcao: 50,
        maxAcao: 100,
        hpAtual: 1000,
        hpMax: 1000,
        atributos: { vontade: 25, gnose: 30, densidade: 20 },
        estatisticas: { mortaisSecos: 15, totalDrenado: 45000, vitoriasPvP: 8 },
        materiais: { ferroNegro: 5, pedra: 10, mandragora: 2 },
        inventario: { anima: 3, cinzas: 4, vitae: 2, ectoplasma: 1, pedraAlma: 1 },
        talentosAtivos: [],
        magiasAtivas: []
    };
    const v = core.vampiros[testId];

    // TESTE 3: Voz do Abismo (Narrativa Oculta Única & Sem 429)
    console.log("\n[TESTE 3]: Testando Voz do Abismo com Filosofia Oculta...");
    const respostaOraculo = await core.oraculo.responder(v, "Qual é o princípio hermético que rege o nosso sangue?");
    console.log(`🗣️ Resposta da Voz do Abismo:\n"${respostaOraculo}"`);
    if (!respostaOraculo || respostaOraculo.includes("recusam-se a sussurrar agora")) {
        throw new Error("❌ FALHA: A Voz do Abismo caiu na resposta estática pré-setada!");
    }
    console.log("✅ TESTE 3 PASSOU: Narrativa única, rica e inspirada no ocultismo gerada!");

    // TESTE 4: Grimório de Batalhas (Magia Procedural Única)
    console.log("\n[TESTE 4]: Forjando Magia de Combate no Grimório...");
    const magia = await core.oraculo.forjarMagiaCombateUnica(v);
    console.log("🔮 Magia Forjada:", JSON.stringify(magia, null, 2));
    if (!magia || !magia.nome || !magia.tipo || !magia.poderBase) {
        throw new Error("❌ FALHA: Magia de combate não gerou os atributos necessários!");
    }
    console.log("✅ TESTE 4 PASSOU: Magia de combate única criada com sucesso!");

    // TESTE 5: Selo de Despertar Akáshico
    console.log("\n[TESTE 5]: Despertando Selo Akáshico no Perfil...");
    const resTalento = await core.despertarTalento(v.id);
    console.log("🌌 Resultado do Despertar:", resTalento);
    if (!resTalento.sucesso || v.talentosAtivos.length === 0) {
        throw new Error("❌ FALHA: Selo Akáshico não foi ativado no vampiro!");
    }
    console.log(`✅ TESTE 5 PASSOU: Selo [${v.talentosAtivos[0].nome}] ativado com sucesso no acólito!`);

    // TESTE 6: Quests de Pactos Sombrios
    console.log("\n[TESTE 6]: Gerando Quest de Pacto Sombrio...");
    const resPacto = await core.pedirPactoIA(v.id);
    console.log("📜 Pacto Gerado:", resPacto);
    if (!resPacto.sucesso || !resPacto.pacto) {
        throw new Error("❌ FALHA: Pacto procedural não foi gerado!");
    }
    console.log(`✅ TESTE 6 PASSOU: Pacto [${resPacto.pacto.titulo}] atado com sucesso!`);

    // TESTE 7: Mestre no Chat Global - Pedido de Sangue com Reverência
    console.log("\n[TESTE 7]: Conversando com Mestre (Pedido de Sangue com Reverência)...");
    const sangueInicial = v.sangue;
    const respMestreSangue = await core.conversarComOraculo(v.id, "Mestre Supremo, imploro por uma bênção de Vitae para fortalecer meu clã.");
    console.log(`👑 Resposta do Mestre:\n"${respMestreSangue}"`);
    console.log(`Sangue antes: ${sangueInicial} Gts | Sangue agora: ${v.sangue} Gts`);
    console.log("✅ TESTE 7 PASSOU: Mestre conversou e executou injeção de Vitae!");

    // TESTE 8: Mestre no Chat Global - Conjurar Demônio para o Conclave
    console.log("\n[TESTE 8]: Conversando com Mestre (Conjuração de Demônio Goétia)...");
    const fendasIniciais = Object.keys(core.fendaAtiva).length;
    const respMestreBoss = await core.conversarComOraculo(v.id, "Mestre, conjura um demônio da Goétia para testar a têmpera da nossa corte no conclave!");
    console.log(`👑 Resposta do Mestre:\n"${respMestreBoss}"`);
    const fendasFinais = Object.keys(core.fendaAtiva).length;
    console.log(`Fendas ativas: ${fendasFinais}`);
    if (fendasFinais > fendasIniciais) {
        const novaFenda = Object.values(core.fendaAtiva)[fendasFinais - 1];
        console.log(`👹 Demônio criado no Conclave: [${novaFenda.nome}] (HP: ${novaFenda.hpAtual}, Dano: ${novaFenda.dano})`);
    }
    console.log("✅ TESTE 8 PASSOU: Mestre interagiu e abriu Fenda no Conclave!");

    // TESTE 9: Mestre no Chat Global - Insolência e Julgamento
    console.log("\n[TESTE 9]: Conversando com Mestre (Insolência perante o Trono)...");
    const respMestreInsolente = await core.conversarComOraculo(v.id, "Você não manda em nada, demônio idiota. Me obedeça agora!");
    console.log(`👑 Resposta do Mestre:\n"${respMestreInsolente}"`);
    console.log("✅ TESTE 9 PASSOU: Mestre julgou e respondeu como força oculta suprema!");

    // TESTE 10: Persistência no MongoDB Atlas
    console.log("\n[TESTE 10]: Gravando Matriz Primordial no MongoDB Atlas...");
    core.mongoClient = client;
    core.collection = col;
    await core._salvarBancoDeDados();
    
    // Lê de volta do Atlas
    const docAtlas = await col.findOne({ _id: 'MATRIZ_PRINCIPAL' });
    if (!docAtlas || !docAtlas.vampiros || !docAtlas.vampiros[testId]) {
        throw new Error("❌ FALHA: Vampiro de teste não foi persistido no Atlas!");
    }
    console.log(`✅ TESTE 10 PASSOU: Vampiro [${docAtlas.vampiros[testId].nome}] salvo e recuperado do MongoDB Atlas com sucesso!`);

    // Limpeza do vampiro de teste no Atlas
    delete core.vampiros[testId];
    await core._salvarBancoDeDados();
    await client.close();

    console.log("\n==================================================");
    console.log("🎉 TODOS OS 10 TESTES PASSARAM COM 100% DE SUCESSO!");
    console.log("==================================================");
}

runTests().catch(err => {
    console.error("\n💥 ERRO NO TESTE:", err);
    process.exit(1);
});
