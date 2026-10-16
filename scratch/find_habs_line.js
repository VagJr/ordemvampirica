const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('function renderizarHabilidadesArena');
console.log('renderizarHabilidadesArena at char:', idx);
const before = html.substring(0, idx);
const lineNum = before.split('\n').length;
console.log('renderizarHabilidadesArena line number:', lineNum);
