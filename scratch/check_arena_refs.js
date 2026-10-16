const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const arenaElements = [
    'arena-acao', 'arena-hud', 'arena-jogador-nome', 'arena-player-hp-bar', 'arena-player-hp-text',
    'arena-alvo-nome', 'arena-boss-hp-bar', 'arena-boss-hp-text', 'arena-boss-postura-text',
    'arena-boss-postura-bar', 'arena-alerta-visceral', 'inimigo-zona', 'arena-threat-level',
    'inimigo-icone', 'inimigo-status', 'arena-combo', 'seletor-alvo-pvp', 'lista-alvos-pvp-dungeon',
    'arena-feedback', 'arena-ciclo-timer', 'arena-habilidades-dinamicas', 'arena-acoes-viscerais',
    'btn-arena-visceral', 'btn-atk-tut', 'btn-def-tut', 'btn-mag-tut', 'btn-heal-combat', 'btn-flee-tut'
];

console.log('=== CHECKING JS REFERENCES FOR ARENA ELEMENTS ===');
for (const id of arenaElements) {
    const regex = new RegExp(`['"]${id}['"]`, 'g');
    const count = (html.match(regex) || []).length;
    console.log(`${id}: ${count} occurrences`);
}
