const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tabs = ['aba-aventura', 'aba-umbral', 'aba-pvp', 'aba-labirinto'];
for (const t of tabs) {
    const start = html.indexOf(`id="${t}"`);
    if (start !== -1) {
        // find next aba or card
        const end = html.indexOf('id="aba-', start + 10);
        console.log(`=== ${t} === (length: ${(end !== -1 ? end : start + 1000) - start})`);
        console.log(html.substring(start, Math.min(start + 800, end !== -1 ? end : start + 800)));
    }
}
