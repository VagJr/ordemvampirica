const fs = require('fs');

const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

// List of all elements with id="aba-*"
const abaMatches = [...html.matchAll(/id=["'](aba-[^"']+)["']/g)];
console.log(`Abas detectadas (${abaMatches.length}):`);
abaMatches.forEach(m => console.log(' - ' + m[1]));

// Check where #desktop-stage starts and ends
const stageStart = html.indexOf('id="desktop-stage"');
const stageEnd = html.indexOf('</main>');
console.log(`desktop-stage index: ${stageStart} to ${stageEnd}`);

// Check which elements exist outside #ui-main
const uiMainStart = html.indexOf('id="ui-main"');
const uiMainEnd = html.indexOf('<!-- NAVEGAÇÃO INFERIOR MOBILE NATIVA -->');
console.log(`ui-main index: ${uiMainStart} to ${uiMainEnd}`);

// Check all elements before uiMainStart that might be visible:
const preMainHtml = html.substring(html.indexOf('<body>'), uiMainStart);
console.log('\n--- ELEMENTOS ANTES DE #ui-main ---');
const visibleBeforeLogin = [...preMainHtml.matchAll(/<([a-z0-9]+)\s+[^>]*id=["']([^"']+)["'][^>]*>/gi)];
visibleBeforeLogin.forEach(m => {
    const isOculto = m[0].includes('oculto');
    console.log(`Tag <${m[1]} id="${m[2]}"> oculto: ${isOculto}`);
});

// Check classes and styles
const tickerMatch = html.match(/<div class="world-ticker">/);
console.log('world-ticker existe?', !!tickerMatch);
