const fs = require('fs');
const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

const regex = /<div\s+id=["'](aba-[^"']+)["'][^>]*>/gi;
const matches = [];
let m;
while ((m = regex.exec(html)) !== null) {
    matches.push({ id: m[1], index: m.index });
}

console.log(`Auditoria de Todas as ${matches.length} Abas:\n`);
for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const nextStart = i + 1 < matches.length ? matches[i + 1].index : html.indexOf('</main>');
    const chunk = html.substring(start, nextStart);
    const id = matches[i].id;
    const cards = (chunk.match(/class=["'][^"']*card[^"']*["']/gi) || []).length;
    const buttons = (chunk.match(/<button/gi) || []).length;
    const lines = chunk.split('\n').length;
    const hasSubNav = chunk.includes('sub-nav-bar');
    const h3s = [...chunk.matchAll(/<h[234][^>]*>(.*?)<\/h[234]>/gi)].map(x => x[1].replace(/<[^>]+>/g, '').trim()).slice(0, 4);
    
    console.log(`${id.padEnd(16)} | Lines: ${String(lines).padStart(4)} | Cards: ${String(cards).padStart(2)} | Sub-Nav: ${String(hasSubNav).padEnd(5)} | Headings: ${h3s.join(' // ')}`);
}
