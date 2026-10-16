const fs = require('fs');

const content = fs.readFileSync('server.js', 'utf8');
const lines = content.split('\n');
console.log('Total lines in server.js:', lines.length);
lines.forEach((l, i) => {
    if (/isBot|bot\.|criarBot|gerarBot|simularBot|agente/i.test(l)) {
        console.log(`L${i + 1}: ${l.trim().substring(0, 140)}`);
    }
});
