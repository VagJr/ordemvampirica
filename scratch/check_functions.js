const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('function carregarMinhaOrdem()');
console.log('carregarMinhaOrdem snippet:\n', content.substring(idx, idx + 1000));

const advIdx = content.indexOf('executarAcaoCombateAvancada');
console.log('advIdx:', advIdx);
