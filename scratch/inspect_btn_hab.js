const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const habCss = html.match(/\.btn-hab-akashic[\s\S]*?(?=\n\s*(\.[a-zA-Z]|#[a-zA-Z]|@media|<\/style>))/g);
console.log('=== BTN HAB AKASHIC CSS ===');
console.log(habCss ? habCss.join('\n---\n') : 'None');
