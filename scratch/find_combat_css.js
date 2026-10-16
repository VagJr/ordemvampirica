const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all CSS rules containing combat, arena, visceral, inimigo
const lines = html.split('\n');
let inStyle = false;
let styleRules = [];
let currentRule = [];

for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes('<style')) inStyle = true;
    if (l.includes('</style>')) inStyle = false;
    if (inStyle && (l.includes('arena-') || l.includes('inimigo-') || l.includes('btn-combat') || l.includes('hp-bar') || l.includes('hp-player') || l.includes('hp-boss') || l.includes('visceral'))) {
        styleRules.push(`${i+1}: ${l.trim()}`);
    }
}
console.log('=== COMBAT CSS RULES IN STYLE BLOCKS ===');
console.log(styleRules.join('\n'));
