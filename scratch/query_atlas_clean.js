const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
let uri = '';
env.split('\n').forEach(l => { 
    if (l.startsWith('MONGO_URI=')) {
        uri = l.substring('MONGO_URI='.length).trim(); 
    }
});

const { MongoClient } = require('mongodb');

async function run() {
    const client = new MongoClient(uri);
    await client.connect();
    const dbs = await client.db().admin().listDatabases();
    console.log('Databases:', dbs.databases.map(d => d.name));
    for (let dbInfo of dbs.databases) {
        if (dbInfo.name.includes('admin') || dbInfo.name.includes('local')) continue;
        const db = client.db(dbInfo.name);
        const cols = await db.listCollections().toArray();
        for (let col of cols) {
            const c = db.collection(col.name);
            const count = await c.countDocuments();
            console.log('DB: ' + dbInfo.name + ' | Col: ' + col.name + ' | Count: ' + count);
            const doc = await c.findOne({ _id: 'MATRIZ_PRINCIPAL' });
            if (doc && doc.vampiros) {
                console.log('Found MATRIZ_PRINCIPAL with total vampiros:', Object.keys(doc.vampiros).length);
                for (let k in doc.vampiros) {
                    const v = doc.vampiros[k];
                    if (!v.isBot || v.nivel > 5) {
                        console.log(`- Nick: [${v.nome}] | Level: ${v.nivel} | Sangue: ${v.sangue} | Calice: ${v.calice} | HP: ${v.hpAtual}/${v.hpMax} | Estado: ${v.estado} | Status: ${v.status} | isBot: ${v.isBot} | role: ${v.role || v.isAdmin}`);
                    }
                }
            }
        }
    }
    await client.close();
}

run().catch(console.error);
