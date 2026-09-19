const fs = require('fs');
const content = fs.readFileSync('server.js', 'utf8');
const lines = content.split('\n');
const routes = [];
lines.forEach((line, i) => {
    if (line.includes('app.get(') || line.includes('app.post(')) {
        routes.push(`${i + 1}: ${line.trim()}`);
    }
});
console.log(`Encontradas ${routes.length} rotas:`);
routes.forEach(r => console.log(r));
