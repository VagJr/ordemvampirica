const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all matches of habilidades or poderes akashicos
const re = /habilidadesAtivas/g;
let m;
let indices = [];
while ((m = re.exec(html)) !== null) {
    indices.push(m.index);
}
console.log('Found habilidadesAtivas occurrences at:', indices);

for (const idx of indices) {
    console.log('--- SNIPPET ---');
    console.log(html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 400)));
}
