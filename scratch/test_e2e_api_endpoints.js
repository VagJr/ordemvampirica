async function testLiveApi() {
    console.log("=== INICIANDO TESTE END-TO-END HTTP NAS ROTAS VIVAS (PORTA 8080) ===");
    const baseUrl = 'http://localhost:8080';

    // 1. GET /api/ordem/graus
    console.log("\n1. Testando GET /api/ordem/graus...");
    const resGraus = await fetch(`${baseUrl}/api/ordem/graus`);
    const dataGraus = await resGraus.json();
    console.log("Graus retornados:", dataGraus.graus?.length, "graus.");
    if (!dataGraus.sucesso || dataGraus.graus.length !== 11) throw new Error("Falha em graus!");

    // 2. GET /api/magia_codigo/operadores
    console.log("\n2. Testando GET /api/magia_codigo/operadores...");
    const resOps = await fetch(`${baseUrl}/api/magia_codigo/operadores`);
    const dataOps = await resOps.json();
    console.log("Operadores retornados:", dataOps.operadores?.map(o => o.op));
    if (!dataOps.sucesso || dataOps.operadores.length < 6) throw new Error("Falha em operadores!");

    // 3. POST /api/magia_codigo/validar
    console.log("\n3. Testando POST /api/magia_codigo/validar (AST Sandbox)...");
    const resValida = await fetch(`${baseUrl}/api/magia_codigo/validar`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ formula: 'TRANSMUTAR("cinzas", "anima", 2);\nCANALIZAR_EGREGORA(1.5);' })
    });
    const dataValida = await resValida.json();
    console.log("Resultado validação legítima:", dataValida);
    if (!dataValida.valida) throw new Error("Validação legítima falhou!");

    // 4. Jogador de teste
    const vampiroId = 'BOT_DRACUL_396';
    console.log("\n4. Testando GET /api/status?id=" + vampiroId);
    const resStatus = await fetch(`${baseUrl}/api/status?id=${vampiroId}`);
    const dataStatus = await resStatus.json();
    console.log("Status do jogador:", dataStatus.vampiro?.nome, "Nível:", dataStatus.vampiro?.nivel);
    if (!dataStatus.vampiro) throw new Error("Jogador não encontrado!");

    // Garante recursos para os testes
    dataStatus.vampiro.sangue = Math.max(dataStatus.vampiro.sangue || 0, 50000);
    dataStatus.vampiro.pontosAcao = 10;
    dataStatus.vampiro.nivel = Math.max(dataStatus.vampiro.nivel || 1, 20);

    // 5. GET /api/ordem/minha/:id
    console.log("\n5. Testando GET /api/ordem/minha/" + vampiroId);
    const resMinha = await fetch(`${baseUrl}/api/ordem/minha/${vampiroId}`);
    const dataMinha = await resMinha.json();
    console.log("Ordem do jogador:", dataMinha.ordem ? dataMinha.ordem.nome : "Sem ordem", "Grau:", dataMinha.grau);

    // 6. POST /api/biblioteca/listar
    console.log("\n6. Testando GET /api/biblioteca/listar...");
    const resBib = await fetch(`${baseUrl}/api/biblioteca/listar`);
    const dataBib = await resBib.json();
    console.log("Tomos na biblioteca:", dataBib.length);
    if (!Array.isArray(dataBib)) throw new Error("Biblioteca inválida!");

    // 7. POST /api/magia_codigo/forjar
    console.log("\n7. Testando POST /api/magia_codigo/forjar...");
    const resForjar = await fetch(`${baseUrl}/api/magia_codigo/forjar`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: vampiroId,
            nome: "Selo Ectoplasmático de Bael",
            esfera: "Geburah",
            codigoFormula: 'TRANSMUTAR("cinzas", "anima", 1);\nCANALIZAR_EGREGORA(1.0);'
        })
    });
    const dataForjar = await resForjar.json();
    console.log("Resultado forja código:", dataForjar);
    if (!dataForjar.sucesso) throw new Error("Falha ao forjar feitiço em código!");

    // 8. POST /api/magia_codigo/executar
    console.log("\n8. Testando POST /api/magia_codigo/executar...");
    const resExec = await fetch(`${baseUrl}/api/magia_codigo/executar`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: vampiroId,
            feiticoId: dataForjar.feitico.id,
            contexto: { pos2D: { x: 50, y: 50 } }
        })
    });
    const dataExec = await resExec.json();
    console.log("Resultado execução código:", dataExec);
    if (!dataExec.sucesso) throw new Error("Falha ao executar feitiço em código!");

    // 9. Testando Combate com Postura e Stagger
    console.log("\n9. Testando POST /api/combate/iniciar e ação com postura...");
    const resCombateIni = await fetch(`${baseUrl}/api/combate/iniciar`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: vampiroId })
    });
    const dataCombateIni = await resCombateIni.json();
    console.log("Combate iniciado:", dataCombateIni.mob?.nome || dataCombateIni);

    const resCombateAct = await fetch(`${baseUrl}/api/combate/action`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: vampiroId,
            tipoCombate: 'pve',
            tipoAcao: 'golpe_pesado',
            desempenhoRitmo: { multiplicadorGeral: 1.2, danoRealCausado: 250, danoRealSofrido: 0 }
        })
    });
    const dataCombateAct = await resCombateAct.json();
    console.log("Ação de combate com postura recebida:", {
        finalizado: dataCombateAct.finalizado,
        posturaAtual: dataCombateAct.posturaAtual,
        posturaMax: dataCombateAct.posturaMax,
        vulneravelVisceral: dataCombateAct.vulneravelVisceral,
        cinematica: dataCombateAct.cinematica
    });
    if (dataCombateAct.posturaMax === undefined) throw new Error("Postura não retornada no combate!");

    console.log("\n=======================================================");
    console.log("🔥 TODAS AS ROTAS HTTP E SERVIÇOS 8080 VALIDADOS COM SUCESSO! 🔥");
    console.log("=======================================================");
}

testLiveApi().catch(err => {
    console.error("ERRO NO TESTE HTTP:", err);
    process.exit(1);
});
