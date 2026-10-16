const { ShadowCore } = require('../ShadowCore.js');

async function testSurvival() {
    console.log('--- TESTING SURVIVAL & BALANCE RULES ---');
    const core = new ShadowCore();

    // Test 1: Master Immortality
    core.vampiros['master_test'] = {
        id: 'master_test', nome: 'MestreTeste', nivel: 105, isAdmin: true, role: 'mestre',
        hpMax: 70000, hpAtual: 0, sangue: 100, estado: 'Banido', status: 'Cinzas'
    };
    core.tickTemporal();
    const m = core.vampiros['master_test'];
    console.log('Test 1 (Master Immortality):', m.estado === 'Ativo' && m.hpAtual > 0 ? '✅ PASSED' : '❌ FAILED', `Estado: ${m.estado}, HP: ${m.hpAtual}/${m.hpMax}, Sangue: ${m.sangue}`);

    // Test 2: Non-Lethal Cerco
    core.vampiros['player_cerco'] = {
        id: 'player_cerco', nome: 'VampiroSitiado', nivel: 20,
        hpMax: 5000, hpAtual: 1300, sangue: 10000, estado: 'Ativo', status: 'Ativo'
    };
    core.cercosAtivos['cerco_test'] = {
        id: 'cerco_test', alvoId: 'player_cerco', alvoNome: 'VampiroSitiado',
        demonio: 'Pazuzu', hpAtual: 50000, hpMax: 50000, danoTick: 500, duracaoTicks: 10
    };
    core.tickTemporal();
    const pc = core.vampiros['player_cerco'];
    const hpFloor = Math.floor(5000 * 0.25); // 1250
    console.log('Test 2 (Cerco Non-Lethal Floor):', pc.hpAtual >= hpFloor && pc.estado === 'Ativo' ? '✅ PASSED' : '❌ FAILED', `HP: ${pc.hpAtual} (Floor: ${hpFloor}), Estado: ${pc.estado}`);

    // Test 3: Emergency Vitae Regeneration on HP <= 0
    core.vampiros['player_low_hp'] = {
        id: 'player_low_hp', nome: 'VampiroFerido', nivel: 10,
        hpMax: 3000, hpAtual: 0, sangue: 5000, calice: 0, estado: 'Ativo'
    };
    core.tickTemporal();
    const plh = core.vampiros['player_low_hp'];
    console.log('Test 3 (Vitae Emergency Surge):', plh.hpAtual > 0 && plh.estado === 'Ativo' && plh.sangue < 5000 ? '✅ PASSED' : '❌ FAILED', `HP: ${plh.hpAtual}/${plh.hpMax}, Sangue: ${plh.sangue}`);

    // Test 4: Torpor when totally destitute
    core.vampiros['player_destitute'] = {
        id: 'player_destitute', nome: 'VampiroFalido', nivel: 10,
        hpMax: 3000, hpAtual: 0, sangue: 0, calice: 0, estado: 'Ativo'
    };
    core.tickTemporal();
    const pd = core.vampiros['player_destitute'];
    console.log('Test 4 (Torpor instead of Ban):', pd.estado === 'Torpor' ? '✅ PASSED' : '❌ FAILED', `Estado: ${pd.estado}, HP: ${pd.hpAtual}`);

    // Test 5: PvP Defeat non-ban
    const attacker = { id: 'atk_test', nome: 'Atacante', nivel: 20, sangue: 1000, estatisticas: {} };
    const defender = { id: 'def_test', nome: 'Defensor', nivel: 20, hpMax: 4000, hpAtual: 5, sangue: 500, estado: 'Ativo' };
    core.vampiros['atk_test'] = attacker;
    core.vampiros['def_test'] = defender;
    const resPvp = await core.processarCombateAcao({
        id: 'atk_test', alvoId: 'def_test', tipoCombate: 'pvp', postura: 1,
        desempenhoRitmo: { multiplicadorGeral: 1, ataques: 1, defesas: 0, magias: 0, danoRealCausado: 1000, danoRealSofrido: 0 }
    });
    console.log('Test 5 (PvP Defeat Non-Ban):', defender.estado === 'Ativo' && defender.hpAtual > 0 ? '✅ PASSED' : '❌ FAILED', `Defensor Estado: ${defender.estado}, HP: ${defender.hpAtual}/${defender.hpMax}`);
}

testSurvival().catch(console.error);
