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
    console.log("--- TESTANDO OPERAÇÕES DO CÁLICE ---");
    const adminId = "SNG_8DE351711A2C";
    
    // 1. Depositar 5000 Gts no Cálice
    const depRes = await post('/api/banco/calice', {
        id: adminId,
        quantia: 5000,
        operacao: 'depositar'
    });
    console.log("Depósito:", depRes.data);

    // 2. Sacar 2000 Gts do Cálice
    const sacRes = await post('/api/banco/calice', {
        id: adminId,
        quantia: 2000,
        operacao: 'sacar'
    });
    console.log("Saque:", sacRes.data);
}

run().catch(console.error);
