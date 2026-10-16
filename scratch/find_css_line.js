const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('/* Grade de Poderes Akáshicos (Slot Moderno RPG) */');
console.log('CSS block at char:', idx);
const before = html.substring(0, idx);
const lineNum = before.split('\n').length;
console.log('CSS block line number:', lineNum);
