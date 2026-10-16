const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
console.log('Lines in index.html:', lines.length);

lines.forEach((l, i) => {
    if (l.includes('parry-flash') || l.includes('screen-shake') || l.includes('iniciarCombateVisceral') || l.includes('acaoVisceral') || l.includes('executarAcaoCombateAvancada')) {
        console.log(`L${i+1}: ${l.trim().substring(0, 120)}`);
    }
});
