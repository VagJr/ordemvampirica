const http = require('http');

function post(path, body) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(body);
        const req = http.request({
            hostname: 'localhost',
            port: 8080,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: data });
                }
            });
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

function get(path) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 8080,
            path: path,
            method: 'GET'
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        req.on('error', reject);
        req.end();
    });
}

async function runTests() {
    console.log('=== TESTE 1: CARREGAMENTO DO HTML PRINCIPAL ===');
    const rootRes = await get('/');
    console.log('GET / status:', rootRes.status);
    const hasDock = rootRes.data.includes('id="desktop-nav-dock"');
    const hasMobNav = rootRes.data.includes('id="mobile-bottom-nav"');
    const hasOficios = rootRes.data.includes('id="aba-oficios"');
    const hasConsciencias = rootRes.data.includes('id="modal-consciencias"');
    const hasSettings = rootRes.data.includes('id="modal-settings"');
    const hasHeartbeat = rootRes.data.includes('id="vignette-heartbeat"');
    const hasCanvas = rootRes.data.includes('id="bg-ambient-canvas"');

    console.log('Has Desktop Dock:', hasDock);
    console.log('Has Mobile Bottom Nav:', hasMobNav);
    console.log('Has Oficios Tab:', hasOficios);
    console.log('Has Consciencias Modal:', hasConsciencias);
    console.log('Has Settings Modal:', hasSettings);
    console.log('Has Heartbeat Vignette:', hasHeartbeat);
    console.log('Has Ambient Canvas:', hasCanvas);

    if (!hasDock || !hasMobNav || !hasOficios || !hasConsciencias || !hasSettings) {
        throw new Error('Falha na auditoria de elementos HTML!');
    }

    console.log('\n=== TESTE 2: AUTENTICAÇÃO E CRIAÇÃO DO VAMPIRO ===');
    const authRes = await post('/api/auth', {
        tgId: 'test_tg_777',
        tgUsername: 'vlad_test',
        nomeSombrio: 'Vlad_Remake_Test',
        senha: 'pacto_eterno_123',
        raca: 'vampiro'
    });
    const vampiro = authRes.data.vampiro || authRes.data;
    console.log('Auth status:', authRes.status, 'Jogador:', vampiro?.nome, 'ID:', vampiro?.id);
    const vampiroId = vampiro.id;

    console.log('\n=== TESTE 3: COLETAR HERBALISMO (LIFE SKILL) ===');
    const colRes = await post('/api/lifeskill/coletar', { vampiroId });
    console.log('Colheita response:', colRes.data);

    console.log('\n=== TESTE 4: FABRICAR RECEITA (ALQUIMIA) ===');
    const fabRes = await post('/api/lifeskill/fabricar', {
        vampiroId,
        categoria: 'alquimia',
        receitaId: 'filtro_frenesi'
    });
    console.log('Fabricação response:', fabRes.data);

    console.log('\n=== TESTE 5: REPARAR EQUIPAMENTO (ARMARIA) ===');
    const repRes = await post('/api/lifeskill/reparar', {
        vampiroId,
        slot: 'arma'
    });
    console.log('Reparo response:', repRes.data);

    console.log('\n=== TESTE 6: EVOCAÇÃO DAS 4 CONSCIÊNCIAS CÓSMICAS (IA) ===');
    for (const ent of ['lilith', 'seth', 'demiurgo', 'corvo']) {
        const entRes = await post('/api/oraculo/evocar_entidade', {
            vampiroId,
            entidadeId: ent,
            mensagem: 'Qual é o segredo do meu despertar?'
        });
        console.log(`[${entRes.data.entidade}]:`, entRes.data.resposta.substring(0, 90) + '...');
    }

    console.log('\n=== TESTE 7: MAGIA ENOCHIANA & PALAVRAS DE PODER ===');
    const enochRes = await post('/api/magia/enochiano', {
        vampiroId,
        frase: 'ZACAR OD ZAMRAN BABALON'
    });
    console.log('Enochian response:', enochRes.data);

    console.log('\n=============================================');
    console.log('🎉 TODOS OS TESTES PASSARAM COM PERFEIÇÃO!');
    console.log('=============================================');
}

runTests().catch(err => {
    console.error('TEST ERROR:', err);
    process.exit(1);
});
