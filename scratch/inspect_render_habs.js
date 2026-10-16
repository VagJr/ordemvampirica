const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const fnIdx = html.indexOf('function renderizarHabilidadesArena');
console.log(html.substring(fnIdx, fnIdx + 800));
