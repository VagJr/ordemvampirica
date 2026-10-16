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
    ['vex', 'Destruidor7', 'Mestre_6212', 'Mestre_1362'].forEach(name => {
        const v = Object.values(doc.vampiros || {}).find(x => x.nome === name);
        if (v) {
            console.log(`[${name}]: Estado: ${v.estado} | Status: ${v.status} | HP: ${v.hpAtual}/${v.hpMax} | Sangue: ${v.sangue} | Cálice: ${v.calice} | Admin: ${v.isAdmin} | Role: ${v.role}`);
        } else {
            console.log(`[${name}]: not found`);
        }
    });
    await client.close();
}

run().catch(console.error);
