const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Search for functions that show arena-acao or handle combat
const combatFunctions = html.match(/function\s+([a-zA-Z0-9_]*(?:combat|batalha|arena|visceral|duelo|abismo|umbral)[a-zA-Z0-9_]*)\s*\(/gi) || [];
console.log('=== COMBAT JS FUNCTIONS ===');
console.log(Array.from(new Set(combatFunctions)));

// Search for where arena-acao classList.remove('oculto') or style.display
const arenaTriggers = [];
const lines = html.split('\n');
lines.forEach((l, idx) => {
    if (l.includes('arena-acao') || l.includes('iniciarCombate') || l.includes('abrirArena')) {
        arenaTriggers.push(`${idx + 1}: ${l.trim()}`);
    }
});
console.log('=== ARENA TRIGGERS (first 30) ===');
console.log(arenaTriggers.slice(0, 30).join('\n'));
