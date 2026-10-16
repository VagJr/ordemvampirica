const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Find tab buttons
const matches = [...content.matchAll(/onclick=["'](?:trocarAba|abrirAba|switchTab|mostrarAba|alternarAba)\(([^)]+)\)["']/gi)];
console.log('Tab functions called:', [...new Set(matches.map(m => m[0]))]);

// Find sections or panels with id
const sectionIds = [...content.matchAll(/<(?:section|div)\s+id=["']([^"']+)["']\s+class=["'][^"']*?(?:tab|aba|painel|view|secao)[^"']*?["']/gi)];
console.log('Tab panels found:', sectionIds.map(m => m[1]).slice(0, 30));

// Find dock or menu buttons
const dockMatch = content.match(/<div class=["'][^"']*?(?:dock|menu|sidebar|navigation|tabs-container)[^"']*?["'][\s\S]*?<\/div>/i);
if (dockMatch) {
    console.log('Dock snippet:\n', dockMatch[0].substring(0, 1000));
}
