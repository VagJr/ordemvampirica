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
        console.log('Doc keys:', Object.keys(doc));
        console.log('doc.logs keys:', doc.logs ? Object.keys(doc.logs) : 'null');
        if (doc.logs && doc.logs.global) {
            console.log('Total global logs:', doc.logs.global.length);
            doc.logs.global.forEach(l => {
                const s = JSON.stringify(l);
                if (s.includes('vex') || s.includes('Destruidor7') || s.includes('DEVORADO') || s.includes('MOTIM') || s.includes('BESTA')) {
                    console.log('LOG:', l);
                }
            });
        }
        for (let k in doc.vampiros) {
            const v = doc.vampiros[k];
            if (v.nome === 'vex' || v.nome === 'Destruidor7') {
                console.log('VAMPIRO:', v.nome, 'ID:', v.id, 'estado:', v.estado, 'hp:', v.hpAtual, 'motim:', v.motim, 'cercos:', v.cerco);
            }
        }
    }
    await client.close();
}

run().catch(console.error);
