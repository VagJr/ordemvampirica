const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const ids = [
    'btn-atk-tut', 'btn-def-tut', 'btn-mag-tut',
    'btn-heal-combat', 'btn-flee-tut', 'btn-arena-visceral',
    'arena-habilidades-dinamicas', 'arena-acoes-viscerais'
];

for (const id of ids) {
    const re = new RegExp(id, 'g');
    let m;
    let occurrences = [];
    while ((m = re.exec(html)) !== null) {
        occurrences.push(m.index);
    }
    console.log(`ID "${id}" occurrences: ${occurrences.length}`);
    for (const idx of occurrences) {
        // print line
        const snippet = html.substring(Math.max(0, idx - 40), Math.min(html.length, idx + 80)).replace(/\n/g, ' ');
        console.log(`   [${idx}] ${snippet}`);
    }
}
