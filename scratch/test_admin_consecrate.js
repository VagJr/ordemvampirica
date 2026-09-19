const http = require('http');

function post(path, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const req = http.request({
            hostname: 'localhost',
            port: 8080,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, res => {
            let resData = '';
            res.on('data', chunk => resData += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(resData) });
                } catch(e) {
                    resolve({ status: res.statusCode, raw: resData });
                }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function run() {
    console.log("--- TESTANDO CONSAGRAÇÃO DE ADMIN ---");
    const res = await post('/api/admin/consagrar_mestre', {
        chaveMestra: 'LILITH_ADMIN_666',
        alvoNome: 'Mestre_Supremo',
        criarNovo: true,
        senha: 'admin',
        raca: 'vampiro'
    });
    console.log("Status:", res.status);
    console.log("Resultado:", JSON.stringify(res.data, null, 2));

    if (res.data && res.data.vampiro) {
        console.log(`✅ Admin consagrado: Nível ${res.data.vampiro.nivel}, Geração ${res.data.vampiro.geracao}, Sangue: ${res.data.vampiro.sangue}, Cálice: ${res.data.vampiro.calice}`);
    }
}

run().catch(console.error);
