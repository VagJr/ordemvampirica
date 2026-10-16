const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Check script tags balance
const scriptOpen = (content.match(/<script/g) || []).length;
const scriptClose = (content.match(/<\/script>/g) || []).length;
console.log(`Script tags: ${scriptOpen} open, ${scriptClose} close`);

// Check abas balance
console.log('aba-ordem exists:', content.includes('id="aba-ordem"'));
console.log('aba-magia_codigo exists:', content.includes('id="aba-magia_codigo"'));
console.log('arena-boss-postura-bar exists:', content.includes('id="arena-boss-postura-bar"'));
console.log('btn-arena-visceral exists:', content.includes('id="btn-arena-visceral"'));
console.log('carregarMinhaOrdem exists:', content.includes('carregarMinhaOrdem()'));
console.log('executarAcaoCombateAvancada exists:', content.includes('executarAcaoCombateAvancada('));

if (scriptOpen !== scriptClose) {
    console.error('MISMATCH in script tags!');
    process.exit(1);
}
console.log('Frontend HTML check: PERFECT!');
