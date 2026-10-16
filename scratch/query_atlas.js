const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkAtlas() {
    if (!process.env.MONGO_URI) {
        console.log('No MONGO_URI');
        return;
    }
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('sanguinis_db');
        const col = db.collection('matriz_sombra');
        const doc = await col.findOne({ _id: 'MATRIZ_PRINCIPAL' });
        if (!doc) {
            console.log('No MATRIZ_PRINCIPAL found in MongoDB');
            return;
        }
        console.log('--- PLAYERS IN MONGODB ATLAS ---');
        console.log('Total vampires:', Object.keys(doc.vampiros || {}).length);
        for (let id in doc.vampiros) {
            const v = doc.vampiros[id];
            if (!v.isBot || v.nivel > 5) {
                console.log(`- ${v.nome} (ID: ${id}) | Nivel: ${v.nivel} | Sangue: ${v.sangue} | Calice: ${v.calice} | HP: ${v.hpAtual}/${v.hpMax} | Estado: ${v.estado} | Status: ${v.status} | isBot: ${v.isBot}`);
            }
        }
        console.log('Cercos ativos in doc:', doc.cercosAtivos || 'none');
        console.log('Logs recentes in doc:', (doc.logs && doc.logs.global ? doc.logs.global.slice(0, 8) : []));
    } catch (e) {
        console.error('Atlas connection error:', e.message);
    } finally {
        await client.close();
    }
}

checkAtlas();
