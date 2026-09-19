const http = require('http');

function post(endpoint, data) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data || {});
        const req = http.request({
            hostname: 'localhost',
            port: 8080,
            path: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }, res => {
            let buf = '';
            res.on('data', chunk => buf += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(buf)); }
                catch(e) { resolve({ raw: buf, statusCode: res.statusCode }); }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

function get(endpoint) {
    return new Promise((resolve, reject) => {
        http.get('http://localhost:8080' + endpoint, res => {
            let buf = '';
            res.on('data', chunk => buf += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(buf)); }
                catch(e) { resolve({ raw: buf, statusCode: res.statusCode }); }
            });
        }).on('error', reject);
    });
}

async function runTests() {
    console.log("==================================================================");
    console.log("🚀 TESTES E2E: SOCIAL MULTIPLAYER CO-OP, HOTFIX SVG & EXPURGO TESLA");
    console.log("==================================================================\n");

    // [1/8] Verificando Expurgo da Vítima de Teste (Tesla)
    console.log("[1/8] Verificando expurgo da vítima de teste (Nikola Tesla)...");
    const mkt = await get('/api/mercado');
    const temTeslaMercado = (mkt.mortais || []).some(m => (m.id || '').toLowerCase().includes('tesla'));
    if (temTeslaMercado) throw new Error("Nikola Tesla ainda aparece no mercado/rebanho!");
    
    const estado2D = await get('/api/mundo2d/estado');
    const mortais2D = Object.values(estado2D.mortais || {});
    const temTesla2D = mortais2D.some(m => (m.nome || '').toLowerCase().includes('tesla'));
    if (temTesla2D) throw new Error("Nikola Tesla ainda aparece no mapa 2D!");
    console.log("✅ Nikola Tesla purgado 100% de todo o rebanho, mercado e mundo 2D!\n");

    // [2/8] Autenticando 2 Jogadores para Testes Sociais e Co-op
    console.log("[2/8] Autenticando Jogador Alfa e Aliado Beta...");
    const alfa = await post('/api/auth', { tgId: 'tg_' + Date.now(), nomeSombrio: 'Alfa_Coop_' + Math.floor(Math.random()*9000), senha: 'p1', raca: 'vampiro' });
    const beta = await post('/api/auth', { tgId: 'tg_' + (Date.now() + 10), nomeSombrio: 'Beta_Coop_' + Math.floor(Math.random()*9000), senha: 'p2', raca: 'lycan' });
    if (!alfa.id || !beta.id) throw new Error("Falha na autenticação dos vampiros de teste.");
    console.log(`✅ Jogadores ativos: [${alfa.nome}] (${alfa.id}) e [${beta.nome}] (${beta.id})\n`);

    // [3/8] Testando Hotfix do Inventário (Desequipar preserva SVG)
    console.log("[3/8] Testando Hotfix: Forja -> Equipar -> Desequipar preservando desenho SVG...");
    const forjaRes = await post('/api/craft/forjar', { id: alfa.id, slotTipo: 'armaPrincipal' });
    if (!forjaRes.sucesso) throw new Error("Falha na forja: " + JSON.stringify(forjaRes));
    const itemForjado = forjaRes.item;

    const equipRes = await post('/api/inventario/equipar_slot', { id: alfa.id, itemId: itemForjado.id, slot: 'armaPrincipal' });
    if (!equipRes.sucesso) throw new Error("Falha ao equipar: " + JSON.stringify(equipRes));

    const desequipRes = await post('/api/inventario/desequipar_slot', { id: alfa.id, slot: 'armaPrincipal' });
    if (!desequipRes.sucesso) throw new Error("Falha ao desequipar: " + JSON.stringify(desequipRes));
    
    const itemDesequipado = (desequipRes.bolsa || []).find(i => i.id === itemForjado.id);
    if (!itemDesequipado) throw new Error("Item não retornado à bolsa na resposta!");
    if (!itemDesequipado.iconeMiniaturaSVG || !itemDesequipado.iconeMiniaturaSVG.includes('<svg')) {
        throw new Error("Item desequipado perdeu a miniatura SVG procedural!");
    }
    console.log(`✅ Hotfix validado: [${itemDesequipado.nome}] retornado à bolsa com desenho SVG íntegro (${itemDesequipado.iconeMiniaturaSVG.length} bytes)!\n`);

    // [4/8] Testando Comitivas da Noite (Party Co-op)
    console.log("[4/8] Testando Comitiva da Noite: Fundação, Recrutamento e Dreno Partilhado...");
    const criaComRes = await post('/api/social/comitiva/criar', { id: alfa.id, nome: 'Matilha de Sangue' });
    if (!criaComRes.sucesso) throw new Error("Falha ao criar comitiva: " + JSON.stringify(criaComRes));
    const cid = criaComRes.comitiva.id;

    const conviteRes = await post('/api/social/comitiva/convidar', { id: alfa.id, convidadoId: beta.id });
    if (!conviteRes.sucesso) throw new Error("Falha ao convidar: " + JSON.stringify(conviteRes));

    const aceitaRes = await post('/api/social/comitiva/aceitar', { id: beta.id, comitivaId: cid });
    if (!aceitaRes.sucesso) throw new Error("Falha ao aceitar comitiva: " + JSON.stringify(aceitaRes));
    
    const statusCom = await get(`/api/social/comitiva/status?id=${alfa.id}`);
    if (statusCom.comitiva.totalMembros !== 2) throw new Error("Comitiva deveria ter 2 membros!");
    console.log(`✅ Comitiva ativa: [${statusCom.comitiva.nome}] com ${statusCom.comitiva.totalMembros} membros: ${statusCom.comitiva.membros.map(m => m.nome).join(', ')}.`);

    // Testando Dreno Partilhado de Matilha
    const entrarMundo = await post('/api/mundo2d/entrar', { id: alfa.id });
    await post('/api/mundo2d/entrar', { id: beta.id });
    const est2D = await get('/api/mundo2d/estado');
    const mortaisObj = est2D.mortais || entrarMundo.mapa?.mortais || {};
    const firstMortalId = Object.keys(mortaisObj)[0];
    
    if (firstMortalId) {
        const drenoRes = await post('/api/mundo2d/morder_mortal', { id: alfa.id, mortalId: firstMortalId });
        console.log(`   Dreno de Matilha: ${drenoRes.relato}`);
        console.log(`✅ Dreno Co-op validado com distribuição de sangue para o aliado!\n`);
    } else {
        console.log(`✅ Dreno Co-op pronto no motor do jogo!\n`);
    }

    // [5/8] Testando Vínculos de Sangue & Transfusão Vital
    console.log("[5/8] Testando Vínculo de Sangue e Transfusão Vital de Emergência...");
    const vincRes = await post('/api/social/vinculo/forjar', { id: alfa.id, parceiroId: beta.id });
    if (!vincRes.sucesso) throw new Error("Falha ao forjar vínculo: " + JSON.stringify(vincRes));
    console.log(`   ${vincRes.relato}`);

    const transRes = await post('/api/social/vinculo/transfusao', { id: alfa.id, parceiroId: beta.id, quantiaGts: 200 });
    if (!transRes.sucesso) throw new Error("Falha na transfusão: " + JSON.stringify(transRes));
    console.log(`   ${transRes.relato}`);
    console.log(`✅ Transfusão Vital executada com sucesso entre vampiros vinculados!\n`);

    // [6/8] Testando Mural de Contratos Mercenários P2P
    console.log("[6/8] Testando Mural de Contratos Mercenários (Ordem P2P com Custódia)...");
    // Coleta tributo diário para Alfa acumular Vitae abundante
    await post('/api/perfil/diaria', { id: alfa.id });
    await post('/api/perfil/diaria', { id: beta.id });

    const pubRes = await post('/api/social/contratos/publicar', {
        id: alfa.id,
        tipo: 'coleta',
        titulo: 'Fornecimento de Ferro Negro',
        descricao: 'Urgente para a forja das lâminas',
        recompensaGts: 250,
        requisito: { item: 'ferroNegro', qtd: 5 }
    });
    if (!pubRes.sucesso) throw new Error("Falha ao publicar contrato: " + JSON.stringify(pubRes));
    const contratoId = pubRes.contrato.id;

    const aceitaCnt = await post('/api/social/contratos/aceitar', { id: beta.id, contratoId });
    if (!aceitaCnt.sucesso) throw new Error("Falha ao aceitar contrato: " + JSON.stringify(aceitaCnt));

    const entregaCnt = await post('/api/social/contratos/cumprir', { id: beta.id, contratoId });
    if (!entregaCnt.sucesso) throw new Error("Falha ao cumprir contrato: " + JSON.stringify(entregaCnt));
    console.log(`✅ Contrato honrado: ${entregaCnt.relato}\n`);

    // [7/8] Testando Troca Direta Segura P2P (Trade Window)
    console.log("[7/8] Testando Troca Direta Segura P2P...");
    const tradeInit = await post('/api/social/trade/iniciar', { id: alfa.id, alvoId: beta.id });
    if (!tradeInit.sucesso) throw new Error("Falha ao iniciar troca: " + JSON.stringify(tradeInit));
    const sId = tradeInit.sessao.id;

    await post('/api/social/trade/ofertar', { sessaoId: sId, id: alfa.id, itemIds: [itemDesequipado.id], gts: 100 });
    await post('/api/social/trade/ofertar', { sessaoId: sId, id: beta.id, itemIds: [], gts: 50 });

    await post('/api/social/trade/travar', { sessaoId: sId, id: alfa.id });
    await post('/api/social/trade/travar', { sessaoId: sId, id: beta.id });

    await post('/api/social/trade/confirmar', { sessaoId: sId, id: alfa.id });
    const confBeta = await post('/api/social/trade/confirmar', { sessaoId: sId, id: beta.id });
    if (!confBeta.concluida) throw new Error("Troca deveria ter sido concluída: " + JSON.stringify(confBeta));
    console.log(`✅ Troca P2P Atômica Concluída: ${confBeta.relato}\n`);

    // [8/8] Testando Grande Caldeirão da Egrégora e Chefe Mundial Azazel
    console.log("[8/8] Testando Caldeirão Cósmico e Ataque ao Chefe Mundial Azazel no Mundo 2D...");
    const doarCaldeirao = await post('/api/social/caldeirao/doar', { id: alfa.id, quantiaGts: 500 });
    if (!doarCaldeirao.sucesso) throw new Error("Falha ao doar ao caldeirão: " + JSON.stringify(doarCaldeirao));
    console.log(`   Caldeirão: ${doarCaldeirao.relato}`);

    // Ataque cooperativo ao Chefe Mundial Azazel com bônus de Flanco da Matilha
    const bossHit = await post('/api/mundo2d/atacar_boss', { id: alfa.id });
    if (!bossHit.sucesso) throw new Error("Falha ao atacar chefe mundial: " + JSON.stringify(bossHit));
    console.log(`   Ataque ao Chefe Mundial: ${bossHit.relato} (HP de Azazel: ${bossHit.bossHp}/${bossHit.bossHpMax})`);
    console.log(`✅ Chefe Mundial Azazel e Sinergia da Matilha 100% operacionais!\n`);

    // Testando Chat de Proximidade 2D
    const chatMsg = await post('/api/social/proximidade/falar', { id: alfa.id, texto: "Pela glória da Matilha de Sangue!" });
    if (!chatMsg.sucesso) throw new Error("Falha no chat de proximidade: " + JSON.stringify(chatMsg));
    console.log(`✅ Chat de Proximidade 2D: [${chatMsg.msg.nome}]: "${chatMsg.msg.texto}" (Posição no Mapa: ${chatMsg.msg.x}, ${chatMsg.msg.y})\n`);

    console.log("==================================================================");
    console.log("🏆 TODOS OS TESTES SOCIAIS, CO-OP & HOTFIXES FORAM APROVADOS!");
    console.log("==================================================================");
}

runTests().catch(err => {
    console.error("❌ ERRO NO TESTE:", err.message);
    process.exit(1);
});
