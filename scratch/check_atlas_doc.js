const { MongoClient } = require('mongodb');

async function check() {
    const c = new MongoClient('mongodb+srv://ordem:J6VBrGAT9qKSLwzS@cluster0.ubbpacg.mongodb.net/?retryWrites=true&w=majority');
    await c.connect();
    const col = c.db('sanguinis_db').collection('registos_akashicos');
    const doc = await col.findOne({ _id: 'MATRIZ_PRINCIPAL' });
    console.log("Atlas doc:", doc ? { _id: doc._id, keys: Object.keys(doc), vampirosCount: Object.keys(doc.vampiros || {}).length } : null);
    await c.close();
}

check().catch(console.error);
