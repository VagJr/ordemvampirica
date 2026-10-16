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
    const doc = await client.db('sanguinis_db').collection('registos_akashicos').findOne({ _id: 'MATRIZ_PRINCIPAL' });
    const globalLogs = (doc.logs && doc.logs.global) || [];
    console.log('Total global logs:', globalLogs.length);
    const matches = globalLogs.filter(l => {
        const s = JSON.stringify(l);
        return s.includes('vex') || s.includes('Destruidor7') || s.includes('DEVORADO') || s.includes('MOTIM') || s.includes('BESTA') || s.includes('ASSASSINATO');
    });
    console.log('Matches:', matches.length);
    matches.forEach(m => console.log('[' + m.tipo + ']: ' + m.relato));
    
    // Also check guerra and caca logs
    if (doc.logs && doc.logs.guerra) {
        console.log('--- GUERRA LOGS ---');
        doc.logs.guerra.forEach(m => {
            const s = JSON.stringify(m);
            if (s.includes('vex') || s.includes('Destruidor7')) {
                console.log('[' + m.tipo + ']: ' + m.relato);
            }
        });
    }

    await client.close();
}

run().catch(console.error);
