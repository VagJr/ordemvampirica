const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('arena-habilidades-dinamicas');
console.log('Surrounding arena-habilidades-dinamicas:\n', content.substring(idx - 100, idx + 300));
