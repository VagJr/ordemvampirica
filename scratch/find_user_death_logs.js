const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
let uri = '';
env.split('\n').forEach(l => { 
    if (l.startsWith('MONGO_URI=')) uri = l.substring('MONGO_URI='.length).trim(); 
});

const { MongoClient } = require('mongodb');

async function run() {
    const client = new MongoClient(uri);
    await client.connect();
    const col = client.db('sanguinis_db').collection('matriz_sombra');
    const doc = await col.findOne({ _id: 'MATRIZ_PRINCIPAL' });
    if (doc) {
        console.log('--- LOGS FOR VEX & DESTRUIDOR7 ---');
        const allLogs = [];
        if (doc.logs) {
            for (let cat in doc.logs) {
                if (Array.isArray(doc.logs[cat])) {
                    allLogs.push(...doc.logs[cat].map(x => ({ ...x, cat })));
                }
            }
        }
        allLogs.sort((a, b) => (b.data || 0) - (a.data || 0));
        const relevant = allLogs.filter(l => 
            (l.relato && (l.relato.includes('vex') || l.relato.includes('Destruidor7') || l.relato.includes('Mestre'))) ||
            (l.tipo && (l.tipo.includes('DEVORADO') || l.tipo.includes('MOTIM') || l.tipo.includes('BANIDO') || l.tipo.includes('MORTE') || l.tipo.includes('FIM DA BESTA')))
        );
        console.log(`Found ${relevant.length} relevant log entries:`);
        relevant.slice(0, 30).forEach(l => {
            console.log(`[${new Date(l.data).toLocaleString()}] [${l.cat}] [${l.tipo}]: ${l.relato}`);
        });
    }
    await client.close();
}

run().catch(console.error);
