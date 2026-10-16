const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

console.log('=== VERIFYING INDEX.HTML ===');

// 1. Check required combat elements
const requiredCombatIds = [
    'arena-acao', 'arena-jogador-nome', 'arena-player-hp-bar', 'arena-player-hp-text',
    'arena-alvo-nome', 'arena-boss-hp-bar', 'arena-boss-hp-text', 'arena-boss-postura-text',
    'arena-boss-postura-bar', 'arena-alerta-visceral', 'inimigo-zona', 'arena-threat-level',
    'inimigo-icone', 'inimigo-status', 'arena-combo', 'seletor-alvo-pvp', 'lista-alvos-pvp-dungeon',
    'arena-feedback', 'arena-ciclo-timer', 'arena-habilidades-dinamicas', 'arena-acoes-viscerais',
    'btn-arena-visceral', 'btn-atk-tut', 'btn-def-tut', 'btn-mag-tut', 'btn-heal-combat', 'btn-flee-tut'
];

let missingIds = [];
for (const id of requiredCombatIds) {
    if (!html.includes(`id="${id}"`)) {
        missingIds.push(id);
    }
}
if (missingIds.length > 0) {
    console.error('ERROR: Missing combat IDs:', missingIds);
} else {
    console.log('✅ ALL 27 combat IDs verified present in index.html!');
}

// 2. Check header and ticker elements
const headerIds = [
    'world-ticker', 'desktop-hud', 'ui-meu-nome', 'ui-titulo', 'ui-nivel', 'ui-patente',
    'ui-poder-geral', 'ui-hp-atual', 'ui-hp-max', 'ui-sangue', 'ui-acao', 'ui-max-acao', 'hdr-calice'
];
let missingHeaderIds = [];
for (const id of headerIds) {
    if (!html.includes(`id="${id}"`)) {
        missingHeaderIds.push(id);
    }
}
if (missingHeaderIds.length > 0) {
    console.error('ERROR: Missing header IDs:', missingHeaderIds);
} else {
    console.log('✅ ALL header IDs verified present in index.html!');
}

// 3. Check for viewport-fit=cover
if (html.includes('viewport-fit=cover')) {
    console.log('✅ Viewport fit cover present!');
} else {
    console.error('ERROR: viewport-fit=cover missing!');
}

// 4. Verify tag matching for divs
let openDivs = (html.match(/<div(\s|>)/g) || []).length;
let closeDivs = (html.match(/<\/div>/g) || []).length;
console.log(`Div tags: ${openDivs} opened, ${closeDivs} closed (Difference: ${openDivs - closeDivs})`);

// 5. Check JS syntax in script tags
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');
console.log('Found main script between:', scriptStart, scriptEnd);
