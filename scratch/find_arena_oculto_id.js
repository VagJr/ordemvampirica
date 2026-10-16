const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /getElementById\(['"]arena-acao['"]\)\.classList\.add\(['"]oculto['"]\)/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(m.index, html.substring(Math.max(0, m.index - 50), Math.min(html.length, m.index + 150)));
}
