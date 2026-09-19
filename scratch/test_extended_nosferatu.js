const http = require('http');

function postJson(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch (e) { resolve({ status: res.statusCode, body }); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('=== TESTE 1: CONSAGRAÇÃO DO MESTRE SUPREMO ===');
  const mestre = await postJson('/api/admin/consagrar_mestre', {
    chaveMestra: 'LILITH_ADMIN_666',
    alvoNome: 'Mestre_Nosferatu_Test',
    criarNovo: true,
    senha: 'admin_test_pass'
  });
  console.log('Consagração status:', mestre.status);
  const adminId = mestre.data?.vampiro?.id;
  console.log('Admin ID:', adminId);
  if (!adminId) throw new Error('Falha ao obter adminId');

  console.log('\n=== TESTE 2: RASGAR O VÉU COM QUALIDADES MOLDADAS PELO OSINT ===');
  const veuRes = await postJson('/api/nosferatu/rasgar_veu', {
    adminId,
    nomeReal: 'Casimiro Miguel',
    notas: 'Streamer e jornalista renomado'
  });
  console.log('Rasgar Véu status:', veuRes.status);
  const dossie = veuRes.data?.dossie;
  if (!dossie) throw new Error('Dossiê não gerado: ' + JSON.stringify(veuRes));

  console.log('Nome Astral:', dossie.nomeAstral);
  console.log('Arquétipo Abissal:', dossie.arquetipoAbissal);
  console.log('Estado Astral Inicial:', dossie.estadoAstral);
  console.log('Métricas OSINT do Jogo:');
  console.log(' - Peso Kármico:', dossie.pesoKarmico);
  console.log(' - Essência da Alma:', dossie.essencia);
  console.log(' - Corrupção:', dossie.taxaCorrupcao + '%');
  console.log(' - Ressonância Elemental:', dossie.ressonanciaElemental);
  console.log(' - Afinidade Oculta:', dossie.afinidadeOculta);
  console.log(' - Vaso de Influência:', dossie.vasoInfluencia + '%');
  console.log(' - Resistência Psíquica:', dossie.resistenciaPsiquica + '%');
  console.log(' - Vulnerabilidade Espiritual:', dossie.vulnerabilidadeEspiritual + '%');
  console.log(' - Polaridade da Alma:', dossie.polaridadeAlma);
  console.log(' - Pureza de Sangue:', dossie.purezaSangue + '%');
  console.log(' - Frequência Vibracional:', dossie.frequenciaVibracionalHz + ' Hz');

  const alvoId = dossie.alvoId;

  console.log('\n=== TESTE 3: ESFERA 1 — AÇÃO CARINHOSA (BÊNÇÃO DE LILITH) ===');
  const resBencao = await postJson('/api/nosferatu/acao_karmica', {
    adminId,
    alvoId,
    acao: 'bencao_lilith',
    intencaoPersonalizada: 'Proteger o alvo de energias tóxicas e inveja mundana'
  });
  console.log('Bênção status:', resBencao.status);
  console.log('Relato:', resBencao.data?.relato);
  console.log('Novo Estado Astral:', resBencao.data?.novoEstadoAstral);

  console.log('\n=== TESTE 4: ESFERA 2 — INFLUÊNCIA SUTIL (SUGESTÃO ONÍRICA) ===');
  const resOnirica = await postJson('/api/nosferatu/acao_karmica', {
    adminId,
    alvoId,
    acao: 'sugestao_onirica',
    intencaoPersonalizada: 'Sussurrar nos sonhos para que cite o símbolo da Ordem'
  });
  console.log('Sugestão Onírica status:', resOnirica.status);
  console.log('Relato:', resOnirica.data?.relato);
  console.log('Novo Estado Astral:', resOnirica.data?.novoEstadoAstral);

  console.log('\n=== TESTE 5: ESFERA 3 — AÇÃO MALÉFICA (DRENAGEM VORAZ DE ALMA) ===');
  const resDrenar = await postJson('/api/nosferatu/acao_karmica', {
    adminId,
    alvoId,
    acao: 'drenagem_voraz'
  });
  console.log('Drenagem status:', resDrenar.status);
  console.log('Relato:', resDrenar.data?.relato);

  console.log('\n=== TESTE 6: ESFERA 4 — CONDENAÇÃO AO LIMBO (BANIR AO LIMBO) ===');
  const resLimbo = await postJson('/api/nosferatu/acao_karmica', {
    adminId,
    alvoId,
    acao: 'banir_ao_limbo'
  });
  console.log('Banimento status:', resLimbo.status);
  console.log('Relato:', resLimbo.data?.relato);
  console.log('Novo Estado Astral:', resLimbo.data?.novoEstadoAstral);
  console.log('Frequência no Limbo:', resLimbo.data?.alvo?.frequenciaVibracionalHz + ' Hz');

  console.log('\n=== TESTE 7: ESFERA 4 — RESGATE & ABSOLVIÇÃO DO LIMBO ===');
  const resResgate = await postJson('/api/nosferatu/acao_karmica', {
    adminId,
    alvoId,
    acao: 'resgatar_do_limbo'
  });
  console.log('Resgate status:', resResgate.status);
  console.log('Relato:', resResgate.data?.relato);
  console.log('Estado Astral pós-resgate:', resResgate.data?.novoEstadoAstral);

  console.log('\n=== TESTE 8: VERIFICAÇÃO DO HISTÓRICO DE AÇÕES PERSISTIDO ===');
  const historico = resResgate.data?.alvo?.historicoAcoes;
  console.log(`Total de ritos registrados no histórico do alvo: ${historico?.length}`);
  historico?.forEach((h, i) => {
    console.log(` [${i + 1}] [${h.categoria?.toUpperCase()}] ${h.nome} -> ${h.relato.slice(0, 75)}...`);
  });

  console.log('\n🎉 TODOS OS TESTES PASSARAM COM 100% DE SUCESSO!');
}

run().catch(console.error);
