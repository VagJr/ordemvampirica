const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Find combat modal or container
const matches = [...content.matchAll(/id=["']([^"']*?(?:arena|combate|battle|luta)[^"']*?)["']/gi)];
console.log('Combat elements found:', matches.map(m => m[1]));

// Show the combat modal or arena section
const arenaIdx = content.indexOf('id="modal-combate"') !== -1 ? content.indexOf('id="modal-combate"') : content.indexOf('id="arena"');
if (arenaIdx !== -1) {
    console.log('Arena snippet:\n', content.substring(arenaIdx, arenaIdx + 1500));
} else {
    // Find where processarCombateAcao or /api/combate/action is called in frontend javascript
    const jsCombate = content.indexOf('/api/combate/action');
    if (jsCombate !== -1) {
        console.log('Frontend /api/combate/action caller:\n', content.substring(jsCombate - 200, jsCombate + 800));
    }
}
