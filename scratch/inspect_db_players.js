const fs = require('fs');

if (fs.existsSync('data/sanguinis_banco.json')) {
    const db = JSON.parse(fs.readFileSync('data/sanguinis_banco.json', 'utf8'));
    console.log('--- DATABASE INSPECTION ---');
    console.log('Total players:', Object.keys(db.jogadores || {}).length);
    for (let id in db.jogadores) {
        const p = db.jogadores[id];
        console.log(`User: ${p.nome} (ID: ${id}) | Nivel: ${p.nivel} | Geracao: ${p.geracao} | Estado: ${p.estado} | Status: ${p.status} | Sangue: ${p.sangue} | HP: ${p.hpAtual}/${p.hpMax} | Calice: ${p.calice} | Admin: ${p.isAdmin || p.role}`);
    }
    console.log('Active Cercos:', db.cercosAtivos);
    console.log('Recent Logs:', (db.logs && db.logs.global ? db.logs.global.slice(0, 15) : 'none'));
}
