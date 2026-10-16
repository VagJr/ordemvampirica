const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const arenaIdx = html.indexOf('id="arena-acao"');
console.log('=== ARENA PART 5 ===');
console.log(html.substring(arenaIdx + 4400, arenaIdx + 6000));
