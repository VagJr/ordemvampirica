const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const cardCss = html.match(/\.card[\s\S]*?(?=\n\s*(\.[a-zA-Z]|#[a-zA-Z]|@media|<\/style>))/g);
console.log('=== CARD CSS ===');
console.log(cardCss ? cardCss.join('\n---\n') : 'None');
