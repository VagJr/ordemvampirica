const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('id="arena-acao"');
console.log('arena-acao HTML at:', start);
console.log(html.substring(start, start + 1200));
