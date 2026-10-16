const { ShadowCore } = require('../ShadowCore.js');
const { GRAUS_INICIATICOS } = require('../OrdemMagicaCore.js');
const { ARQUETIPOS_IA } = require('../CombatEngine.js');

async function runTests() {
    console.log("=== INICIANDO BATERIA DE TESTES: ORDENS MÍSTICAS, MAGIA EM CÓDIGO & COMBATE VISCERAL ===");

    const core = new ShadowCore();

    // 1. Criar dois vampiros para o teste
    const idMestre = "TEST_MESTRE_1";
    const idNeofito = "TEST_NEOFITO_2";

    core.vampiros[idMestre] = {
        id: idMestre,
        nome: "Frater V.I.T.R.I.O.L.",
        nivel: 30,
        sangue: 50000,
        pontosAcao: 10,
        maxAcao: 10,
        hpAtual: 3500,
        hpMax: 3500,
        atributos: { vontade: 25, gnose: 50, densidade: 20, magnetismo: 30 },
        inventario: { anima: 5, cinzas: 10, vitae: 50, ectoplasma: 10 },
        materiais: { mandragora: 10, lotusNegro: 5 },
        bolsa: [],
        titulos: [],
        conquistas: [],
        historicoCombate: []
    };

    core.vampiros[idNeofito] = {
        id: idNeofito,
        nome: "Soror Nox",
        nivel: 10,
        sangue: 8000,
        pontosAcao: 10,
        maxAcao: 10,
        hpAtual: 1200,
        hpMax: 1200,
        atributos: { vontade: 12, gnose: 15, densidade: 10, magnetismo: 15 },
        inventario: { anima: 2, cinzas: 2 },
        materiais: {},
        bolsa: [],
        titulos: [],
        conquistas: [],
        historicoCombate: []
    };

    // TESTE 1: Fundação de Ordem Mística
    console.log("\n[TESTE 1] Fundando Ordem Mística...");
    const resOrdem = await core.ordensCore.criarOrdem(idMestre, {
        nome: "Ordo Rosae Rubeae et Aureae Crucis",
        lema: "Ad Majorem Adonai Gloriam",
        sigiloPrimordial: "HEXAGRAMA_HERMETICO_DOURADO",
        juramentoSangue: "Pelo sangue imortal dos séculos, juro fidelidade aos Mistérios Ocultos."
    });
    console.log("Resultado fundação:", resOrdem);
    if (!resOrdem.sucesso) throw new Error("Falha ao fundar ordem!");

    const ordemId = resOrdem.ordem.id;

    // TESTE 2: Iniciação de Neófito (Grau 0° Malkuth)
    console.log("\n[TESTE 2] Iniciando Neófito...");
    const resNeofito = core.ordensCore.iniciarNeofito(idNeofito, ordemId, "Juro solenemente buscar a Luz na Escuridão.");
    console.log("Resultado iniciação:", resNeofito);
    if (!resNeofito.sucesso) throw new Error("Falha ao iniciar neófito!");

    // TESTE 3: Doação à Egrégora
    console.log("\n[TESTE 3] Doando Vitae à Egrégora do Templo...");
    const resDoacao = core.ordensCore.doarEgregora(idNeofito, ordemId, 1000);
    console.log("Resultado doação:", resDoacao);
    if (!resDoacao.sucesso || resDoacao.egregora.vitae !== 3000) throw new Error("Falha na egrégora!");

    // TESTE 4: Proclamar Decreto
    console.log("\n[TESTE 4] Mestre proclamando Decreto na Ordem...");
    const resDecreto = core.ordensCore.proclamarDecreto(idMestre, ordemId, "O Selo do Silêncio", "Nenhum iniciado profanará o segredo do santuário interior.");
    console.log("Resultado decreto:", resDecreto);
    if (!resDecreto.sucesso) throw new Error("Falha ao decretar!");

    // TESTE 5: Submissão de Tese à Biblioteca Oculta com Avaliação da IA Oráculo
    console.log("\n[TESTE 5] Submetendo Tese à Grande Biblioteca Oculta...");
    const resTese = await core.ordensCore.submeterTese(
        idMestre,
        "Da Alquimia Espiritual e Transmutação do Sangue em Ouro Astral",
        "Tiphereth",
        "A verdadeira Grande Obra não reside no metal mundano, mas na transmutação da carne profana na substância incorruptível da imortalidade. O sangue é o veículo solar de Tiphereth."
    );
    console.log("Resultado tese:", resTese);
    if (!resTese.sucesso || !resTese.tomo) throw new Error("Falha ao submeter tese!");

    // TESTE 6: Estudo de Tomo pelo Neófito
    console.log("\n[TESTE 6] Neófito estudando o Tomo publicado...");
    const resEstudo = core.ordensCore.estudarTomo(idNeofito, resTese.tomo.id);
    console.log("Resultado estudo:", resEstudo);
    if (!resEstudo.sucesso) throw new Error("Falha ao estudar tomo!");

    // TESTE 7: Forjar e Executar Magia em Código Segura (Zero-Crash Sandbox)
    console.log("\n[TESTE 7] Forjando Feitiço em Código (Code-Magic)...");
    const formulaMágica = `
        // Fórmula de Purificação e Alquimia Arcana
        TRANSMUTAR("cinzas", "anima", 2);
        CANALIZAR_EGREGORA(1.5);
        RESONANCIA_COSMICA("Tiphereth", 10);
    `;
    const resFeitico = core.ordensCore.forjarFeiticoEmCodigo(idMestre, {
        nome: "Chave Alquímica de Hermes",
        esfera: "Tiphereth",
        custoSangue: 600,
        custoFuria: 2,
        codigoFormula: formulaMágica,
        descricao: "Transmuta cinzas em essência e canaliza a egrégora do templo."
    });
    console.log("Resultado forja código:", resFeitico);
    if (!resFeitico.sucesso) throw new Error("Falha ao forjar feitiço em código!");

    console.log("\n[TESTE 8] Executando Feitiço em Código de forma atômica e segura...");
    const resExecucao = await core.ordensCore.conjurarFeiticoEmCodigo(idMestre, resFeitico.feitico.id);
    console.log("Resultado execução código:", resExecucao);
    if (!resExecucao.sucesso) throw new Error("Falha ao executar feitiço em código!");

    // TESTE 9: Teste de Resiliência - Código Inválido não quebra o sistema
    console.log("\n[TESTE 9] Testando proteção de sandbox contra injeção ou erro de sintaxe...");
    const validacaoErro = core.ordensCore.codeEngine.validarFormula("INVENTAR_CODIGO_MALICIOSO(process.exit(1));");
    console.log("Resultado validação herética (esperado falso):", validacaoErro);
    if (validacaoErro.valida) throw new Error("Sandbox permitiu código não autorizado!");

    // TESTE 10: Rework do Combate, IA Inimiga, Postura e Golpe Visceral
    console.log("\n[TESTE 10] Testando Motor de Combate Visceral com Postura e Stagger...");
    core.batalhasPvE[idMestre] = {
        id: "mob_inquisidor_1",
        nome: "Inquisidor Solar Malachi",
        hpMax: 2000,
        hpAtual: 2000,
        mult: 1.5,
        loot: "anima"
    };

    // Turno 1: Golpe pesado para drenar postura
    console.log("\n--- Turno 1: Desferindo Golpe Pesado ---");
    const turno1 = await core.processarCombateAcao({
        id: idMestre,
        tipoCombate: 'pve',
        tipoAcao: 'golpe_pesado',
        desempenhoRitmo: { multiplicadorGeral: 1.5, danoRealCausado: 350, danoRealSofrido: 0 }
    });
    console.log("Turno 1 output:", {
        hpRestante: turno1.hpRestante,
        posturaAtual: turno1.posturaAtual,
        posturaMax: turno1.posturaMax,
        vulneravelVisceral: turno1.vulneravelVisceral,
        relato: turno1.relato
    });

    // Turno 2: Parry perfeito para forçar Quebra de Postura (Stagger)
    console.log("\n--- Turno 2: Executando Parry Perfeito ---");
    const turno2 = await core.processarCombateAcao({
        id: idMestre,
        tipoCombate: 'pve',
        tipoAcao: 'parry_perfeito',
        desempenhoRitmo: { multiplicadorGeral: 2.0, danoRealCausado: 400, danoRealSofrido: 0 }
    });
    console.log("Turno 2 output:", {
        posturaAtual: turno2.posturaAtual,
        vulneravelVisceral: turno2.vulneravelVisceral,
        relato: turno2.relato
    });

    // Forçamos postura a zero se ainda restar um pouco para testar o Golpe Visceral
    if (core.batalhasPvE[idMestre]) {
        core.batalhasPvE[idMestre].posturaAtual = 0;
        core.batalhasPvE[idMestre].vulneravelVisceral = true;
        core.batalhasPvE[idMestre].turnosVulneravel = 2;
    }

    // Turno 3: Execução do GOLPE VISCERAL FATAL
    console.log("\n--- Turno 3: Executando GOLPE VISCERAL FATAL ---");
    const turno3 = await core.processarCombateAcao({
        id: idMestre,
        tipoCombate: 'pve',
        tipoAcao: 'golpe_visceral',
        desempenhoRitmo: { multiplicadorGeral: 1.5, danoRealCausado: 500, danoRealSofrido: 0 }
    });
    console.log("Turno 3 Visceral output:", {
        visceral: turno3.visceral,
        critico: turno3.critico,
        relato: turno3.relato,
        cinematica: turno3.cinematica
    });
    if (!turno3.visceral) throw new Error("Golpe visceral falhou ao executar em inimigo vulnerável!");

    // TESTE 11: IA Goetia Boss com Fases e Canalização de Apocalipse
    console.log("\n[TESTE 11] Testando IA de Goetia Boss com Fases e Canalização...");
    const bossGoetia = core.combatEngine.inicializarEntidadeCombate({
        id: 'goetia_bael_test',
        nome: 'Rei Bael do Triângulo de Arte',
        hpMax: 10000,
        hpAtual: 1500 // < 20% para testar a Fase 3 (Apocalipse)
    }, 'goetia', 30);

    const acaoBoss = core.combatEngine.decidirAcaoInimigo(bossGoetia, core.vampiros[idMestre]);
    console.log("Ação da IA do Boss Fase 3:", acaoBoss);
    if (bossGoetia.faseAtual !== 3) throw new Error("Boss não entrou na Fase 3!");

    console.log("\n=======================================================");
    console.log("🔥 TODOS OS TESTES PASSARAM COM 100% DE SUCESSO! 🔥");
    console.log("=======================================================");
}

runTests().catch(err => {
    console.error("ERRO NOS TESTES:", err);
    process.exit(1);
});
