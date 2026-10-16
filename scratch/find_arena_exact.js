const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const arenaIdx = html.indexOf('id="arena-acao"');
console.log('arenaIdx:', arenaIdx);
if (arenaIdx !== -1) {
    const end = html.indexOf('id="stage-login"', arenaIdx);
    console.log(html.substring(arenaIdx - 50, end));
}
