const fs = require('fs');
const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

const abaRegex = /<div\s+id=["'](aba-[^"']+)["'][^>]*>/gi;
let m;
const abas = [];
while ((m = abaRegex.exec(html)) !== null) {
    abas.push({ id: m[1], start: m.index });
}

console.log(`Auditing sub-sections for ${abas.length} abas:\n`);

for (let i = 0; i < abas.length; i++) {
    const cur = abas[i];
    const nextStart = (i + 1 < abas.length) ? abas[i + 1].start : html.indexOf('</main>', cur.start);
    const chunk = html.substring(cur.start, nextStart);

    const subNavMatches = [...chunk.matchAll(/switchSubSection\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/gi)];
    const subSections = [...chunk.matchAll(/<div\s+id=["']([^"']+)["'][^>]*class=["'][^"']*sub-section[^"']*["']/gi)]
        .concat([...chunk.matchAll(/<div\s+class=["'][^"']*sub-section[^"']*["'][^>]*id=["']([^"']+)["']/gi)]);

    const subSecIds = new Set(subSections.map(s => s[1]));
    const calls = subNavMatches.map(c => ({ domain: c[1], sec: c[2] }));

    console.log(`=== ${cur.id} ===`);
    console.log(`  Sub-nav calls (${calls.length}):`, calls.map(c => c.sec).join(', ') || 'NONE');
    console.log(`  Sub-section IDs (${subSecIds.size}):`, Array.from(subSecIds).join(', ') || 'NONE');

    // Check if every sub-nav call matches a sub-section
    for (const call of calls) {
        const found = subSecIds.has(call.sec) ||
                      subSecIds.has(`sub-${call.domain}-${call.sec}`) ||
                      subSecIds.has(`${call.domain}-sec-${call.sec}`) ||
                      subSecIds.has(`sub-${call.sec}`);
        if (!found) {
            console.log(`  ❌ MISMATCH: call switchSubSection('${call.domain}', '${call.sec}') has no matching sub-section ID!`);
        }
    }
}
