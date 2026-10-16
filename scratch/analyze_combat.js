const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 1. Search for combat sections / screens / tabs
const abas = html.match(/id=["'](aba-[^"']+)["']/g) || [];
console.log('--- ALL ABAS ---');
console.log(abas);

// 2. Search for combat divs or modals
const combatIds = html.match(/id=["']([^"']*(?:combate|combat|batalha|duel|umbral|abismo|arena|pvp)[^"']*)["']/gi) || [];
console.log('--- COMBAT RELATED IDS ---');
console.log(Array.from(new Set(combatIds)));

// 3. Search for desktop-hud and player panel structure
const hudIndex = html.indexOf('id="desktop-hud"');
if (hudIndex !== -1) {
    console.log('--- HUD SNIPPET ---');
    console.log(html.substring(hudIndex, hudIndex + 1200));
}

// 4. Search for world-ticker
const tickerIndex = html.indexOf('class="world-ticker"');
if (tickerIndex !== -1) {
    console.log('--- TICKER SNIPPET ---');
    console.log(html.substring(tickerIndex, tickerIndex + 600));
}
