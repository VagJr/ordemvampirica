const fs = require('fs');
const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

const regex = /z-index\s*:\s*([0-9]+)/gi;
let m;
const zIndices = [];
while ((m = regex.exec(html)) !== null) {
    const line = html.substring(0, m.index).split('\n').length;
    zIndices.push({ value: parseInt(m[1]), line, snippet: html.substring(Math.max(0, m.index - 30), Math.min(html.length, m.index + 40)).replace(/\n/g, ' ') });
}

zIndices.sort((a, b) => b.value - a.value);
console.log(`Found ${zIndices.length} z-index declarations. Highest 15:`);
zIndices.slice(0, 15).forEach(z => {
    console.log(`z-index: ${String(z.value).padStart(9)} (line ${String(z.line).padStart(4)}): ${z.snippet}`);
});
