try { process.loadEnvFile(); } catch(e) {}
const { ShadowCore } = require('../ShadowCore');
const core = new ShadowCore();

async function testLiveOSINT() {
  console.log('=== TESTANDO ORÁCULO OSINT INTEGRADO NO SHADOWCORE ===');
  const t0 = Date.now();
  const res = await core.oraculo.pesquisarIdentidadePublica({
    nome: 'Casimiro Miguel',
    instagram: '@casimiro',
    notas: 'Streamer e jornalista renomado da CazéTV'
  });

  const tempoTotal = Date.now() - t0;
  console.log(`\nTempo de execução: ${tempoTotal}ms`);
  console.log('Sucesso:', res.sucesso);
  console.log('OSINT Real:', res.osintReal);
  console.log('Total de fontes web reais:', res.totalFontes);
  console.log('Motor:', res.motor);
  console.log('\n--- MÉTRICAS DE GAMEPLAY MOLDADAS PELA ANÁLISE ---');
  console.log(JSON.stringify(res.metricas, null, 2));

  console.log('\n--- DOSSIÊ DA MENTE ABISSAL (AMOSTRA) ---');
  console.log(res.conteudo.slice(0, 600) + '...\n');

  if (!res.sucesso) throw new Error('OSINT falhou: ' + res.erro);
  if (!res.osintReal) throw new Error('OSINT não foi marcado como real');
  if (!res.metricas || !res.metricas.arquetipoAbissal) throw new Error('Métricas não foram geradas');
  if (res.totalFontes === 0) throw new Error('Nenhuma fonte real coletada');

  console.log('🎉 TESTE DO SHADOWCORE PASSOU COM 100% DE SUCESSO!');
}

testLiveOSINT().catch(err => {
  console.error('❌ ERRO NO TESTE:', err);
  process.exit(1);
});
