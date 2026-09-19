// Test E2E: POST /api/nosferatu/rasgar_veu via the live server
async function testE2E() {
  // Step 1: Create admin vampiro
  console.log('=== STEP 1: Criar vampiro admin ===');
  const createRes = await fetch('http://localhost:8080/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: 'TesteMenteAbissal', senha: 'abissal666' })
  });
  const createData = await createRes.json();
  const vampId = createData.vampiro?.id;
  console.log('Vampiro ID:', vampId, 'Nome:', createData.vampiro?.nome);

  // Step 2: Consecrate as admin lv99
  console.log('\n=== STEP 2: Consagrar como Mestre Supremo ===');
  const consecRes = await fetch('http://localhost:8080/api/admin/consagrar_mestre', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminId: vampId, alvoId: vampId })
  });
  const consecData = await consecRes.json();
  console.log('Consagração:', consecData.erro || consecData.relato || 'OK');

  // Step 3: RASGAR O VÉU (the actual OSINT test)
  console.log('\n=== STEP 3: RASGAR O VÉU - Análise da Mente Abissal ===');
  const startTime = Date.now();
  const veuRes = await fetch('http://localhost:8080/api/nosferatu/rasgar_veu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      adminId: vampId,
      nomeReal: 'Neymar Jr',
      instagram: '@neymarjr',
      twitter: '@neymarjr',
      notas: 'Jogador de futebol brasileiro'
    })
  });

  const elapsed = Date.now() - startTime;
  const raw = await veuRes.text();
  let veuData = {};
  try { veuData = JSON.parse(raw); } catch(e) { console.error('JSON parse fail:', raw.slice(0, 500)); return; }

  if (!veuRes.ok || veuData.erro) {
    console.error('❌ FALHA:', veuData.erro, veuData.detalhe);
    return;
  }

  const d = veuData.dossie;
  console.log('✅ SUCESSO! Tempo:', elapsed, 'ms');
  console.log('- Nome Astral:', d.nomeAstral);
  console.log('- Peso Kármico:', d.pesoKarmico);
  console.log('- Essência:', d.essencia);
  console.log('- Motor:', d.motorPesquisa);
  console.log('- Pesquisa Real:', d.pesquisaReal);
  console.log('- Sigilo:', d.sigilo?.slice(0, 20) + '...');
  console.log('- Cor Alma:', d.corAlma);
  console.log('- analiseIA length:', d.analiseIA?.length);
  console.log('\n=== PREVIEW DA ANÁLISE (primeiros 600 chars) ===');
  console.log(d.analiseIA?.slice(0, 600));
  console.log('\n=== FIM DO PREVIEW ===');

  // Check for the old bug message
  if (d.analiseIA?.includes('não conseguiu contactar as dimensões exteriores')) {
    console.error('❌❌❌ BUG AINDA PRESENTE! A mensagem antiga apareceu!');
  } else if (d.analiseIA?.includes('pesquisa publica real da Mente Abissal falhou')) {
    console.error('❌❌ BUG PARCIAL: pesquisa falhou');
  } else {
    console.log('✅✅✅ BUG ELIMINADO! Análise real da Mente Abissal gerada com sucesso!');
  }
}

testE2E().catch(e => console.error('ERRO FATAL:', e));
