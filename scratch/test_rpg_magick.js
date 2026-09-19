const axios = require('axios');

async function testarNovosSistemas() {
    console.log('=== TESTE DE NOVOS SISTEMAS: D&D RPG & CÍRCULO MÁGICO ===');
    const baseUrl = 'http://localhost:8080';

    // 1. Auth de teste
    const authRes = await axios.post(`${baseUrl}/api/auth`, {
        tgId: 'rpg_tester_123',
        tgUsername: 'Occult_Master',
        nomeSombrio: 'Aleister_Vamp',
        senha: 'CROWLEY_SALOMAO',
        raca: 'vampiro'
    });
    const player = authRes.data;
    console.log(`✅ Jogador Autenticado: ${player.nome} (ID: ${player.id})`);
    console.log(`   D&D CA: ${player.dnd?.classeArmadura} | CD Magia: ${player.dnd?.cdMagia}`);
    console.log(`   Densidade Sanguínea: ${player.densidadeSanguinea?.densidade} (${player.densidadeSanguinea?.classificacao})`);

    // 2. Teste de Rolagem de Dados D20
    const d20Res = await axios.post(`${baseUrl}/api/rpg/rolar_dado`, {
        mod: player.dnd?.modificadores?.vontade || 2,
        vantagem: true
    });
    console.log(`✅ Teste de Rolagem D20 (com Vantagem):`, d20Res.data.log);

    // 3. Teste de Salvaguarda (Saving Throw)
    const salvRes = await axios.post(`${baseUrl}/api/rpg/teste_resistencia`, {
        id: player.id,
        atributo: 'vontade',
        cd: 12
    });
    console.log(`✅ Teste de Resistência D&D:`, salvRes.data.relato);

    // 4. Teste de Canalização de Círculo Salomônico
    const ritoRes = await axios.post(`${baseUrl}/api/magia/canalizar_circulo`, {
        id: player.id,
        ritualId: 'circulo_abissal',
        chaveEnochiana: 'ZACAR',
        seloPlaneta: 'marte',
        volumeSangue: 150
    });
    console.log(`✅ Círculo Salomônico Ativado:`);
    console.log(`   Hash do Selo: ${ritoRes.data.resultado?.hashSelo}`);
    console.log(`   Frequência: ${ritoRes.data.resultado?.frequenciaHarmonica}`);
    console.log(`   Potência Final: ${ritoRes.data.resultado?.potenciaFinal}`);
    console.log(`   Chave Enochiana: ${ritoRes.data.resultado?.chaveEnochianaAtiva} (${ritoRes.data.resultado?.efeitoEnochiano})`);

    // 5. Status de Densidade Astral
    const densRes = await axios.get(`${baseUrl}/api/magia/densidade_status?id=${player.id}`);
    console.log(`✅ Status de Densidade: Viscosidade = ${densRes.data.densidade?.viscosidadePct}, Inércia = ${densRes.data.densidade?.inerciaEspiritual}`);

    console.log('\n🎉 TODOS OS NOVOS SISTEMAS DE BACKEND PASSARAM COM SUCESSO!');
}

testarNovosSistemas().catch(err => {
    console.error('❌ Erro no teste:', err.response?.data || err.message);
    process.exit(1);
});
