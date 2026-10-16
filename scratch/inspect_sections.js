const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

function showSection(id) {
    const idx = content.indexOf(`id="${id}"`);
    if (idx === -1) {
        console.log(`Section ${id} not found`);
        return;
    }
    console.log(`=== SECTION ${id} ===\n`, content.substring(idx, idx + 1000));
}

showSection('aba-biblioteca');
showSection('aba-magia');
showSection('aba-umbral');
