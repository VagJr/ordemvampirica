const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
let uri = '';
env.split('\n').forEach(l => { 
    if (l.startsWith('MONGO_URI=')) uri = l.substring('MONGO_URI='.length).trim(); 
});

const { MongoClient } = require('mongodb');

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const col = client.db('sanguinis_db').collection('registos_akashicos');
        const doc = await col.findOne({ _id: 'MATRIZ_PRINCIPAL' });
        if (!doc || !doc.vampiros) {
            console.error('No vampires found in Atlas!');
            return;
        }

        let revivedCount = 0;
        for (let k in doc.vampiros) {
            const v = doc.vampiros[k];
            // Check if player is a master or high level or admin who died
            const isTarget = v.nivel >= 50 || v.isAdmin || v.role === 'admin' || v.role === 'mestre' || v.nome === 'vex' || v.nome === 'Destruidor7';
            if (isTarget) {
                const wasDead = v.estado === 'Banido' || v.hpAtual <= 0 || v.status === 'Cinzas';
                v.estado = 'Ativo';
                v.status = 'Ativo';
                v.isAdmin = true;
                v.role = 'mestre';
                v.hpMax = (v.hpMax && v.hpMax > 1000) ? v.hpMax : ((v.nivel * 100) + 5000);
                v.hpAtual = v.hpMax;
                v.sangue = Math.max(v.sangue || 0, 500000);
                v.pontosAcao = Math.max(v.pontosAcao || 0, 10);
                v.maxAcao = Math.max(v.maxAcao || 10, 10);
                console.log(`✨ Revived & Protected Master: [${v.nome}] | Level: ${v.nivel} | HP: ${v.hpAtual}/${v.hpMax} | Sangue: ${v.sangue} (Was dead: ${wasDead})`);
                revivedCount++;
            }
        }

        // Clean any active cercos targeting these masters
        if (doc.cercosAtivos) {
            for (let cid in doc.cercosAtivos) {
                const c = doc.cercosAtivos[cid];
                if (c.alvoNome === 'vex' || c.alvoNome === 'Destruidor7' || c.alvoNome.includes('Mestre')) {
                    console.log(`🧹 Removing siege against master: ${c.demonio} vs ${c.alvoNome}`);
                    delete doc.cercosAtivos[cid];
                }
            }
        }

        await col.updateOne({ _id: 'MATRIZ_PRINCIPAL' }, { $set: { vampiros: doc.vampiros, cercosAtivos: doc.cercosAtivos || {} } });
        console.log(`🎉 Success! Restored ${revivedCount} master accounts in MongoDB Atlas.`);
    } catch (e) {
        console.error('Error reviving masters:', e);
    } finally {
        await client.close();
    }
}

run();
