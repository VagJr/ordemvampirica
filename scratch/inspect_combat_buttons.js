const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 1. Inspect renderizarHabilidadesArena
const fnIdx = html.indexOf('function renderizarHabilidadesArena');
if (fnIdx !== -1) {
    console.log('=== renderizarHabilidadesArena ===');
    console.log(html.substring(fnIdx, fnIdx + 1000));
}

// 2. Inspect arena-controls-deck HTML
const deckIdx = html.indexOf('class="arena-controls-deck"');
if (deckIdx !== -1) {
    console.log('\n=== arena-controls-deck HTML ===');
    console.log(html.substring(deckIdx, deckIdx + 2000));
}
