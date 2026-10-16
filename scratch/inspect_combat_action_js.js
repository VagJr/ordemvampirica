const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('/api/combate/action');
console.log('Combat action handler:\n', content.substring(idx - 400, idx + 1500));
