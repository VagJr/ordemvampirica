const { MongoClient } = require('mongodb');

async function testUpdate() {
    const c = new MongoClient('mongodb+srv://ordem:J6VBrGAT9qKSLwzS@cluster0.ubbpacg.mongodb.net/?retryWrites=true&w=majority');
    await c.connect();
    const col = c.db('sanguinis_db').collection('registos_akashicos');
    console.log("Connected to collection...");
    try {
        const res = await col.updateOne(
            { _id: 'MATRIZ_PRINCIPAL' },
            { $set: { test: true, data: new Date().toISOString() } },
            { upsert: true }
        );
        console.log("updateOne result:", res);
        const doc = await col.findOne({ _id: 'MATRIZ_PRINCIPAL' });
        console.log("Found doc:", doc);
    } catch (err) {
        console.error("Update error:", err);
    }
    await c.close();
}

testUpdate();
