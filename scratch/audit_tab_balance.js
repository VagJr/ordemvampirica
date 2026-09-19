const fs = require('fs');
const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

const abaRegex = /<div\s+id=["'](aba-[^"']+)["'][^>]*>/gi;
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

let m;
const abas = [];
while ((m = abaRegex.exec(html)) !== null) {
    abas.push({ id: m[1], start: m.index });
}

console.log(`Analyzing ${abas.length} abas for isolated tag balance...`);

for (let i = 0; i < abas.length; i++) {
    const current = abas[i];
    const nextStart = (i + 1 < abas.length) ? abas[i + 1].start : html.indexOf('</main>', current.start);
    const abaHtml = html.substring(current.start, nextStart);
    
    // Check tag balance inside this aba
    const tagRegex = /<\/?([a-zA-Z0-9\-]+)(\s+[^>]*)?\/?>/g;
    const stack = [];
    let tm;
    let errors = 0;
    
    while ((tm = tagRegex.exec(abaHtml)) !== null) {
        const fullTag = tm[0];
        const tagName = tm[1].toLowerCase();
        const isClosing = fullTag.startsWith('</');
        const isSelfClosing = fullTag.endsWith('/>') || voidTags.has(tagName);
        
        if (tagName === 'script' || tagName === 'style') continue;
        if (isSelfClosing) continue;
        
        if (!isClosing) {
            stack.push({ tag: tagName, snippet: fullTag.substring(0, 30) });
        } else {
            if (stack.length === 0) {
                errors++;
            } else {
                const top = stack.pop();
                if (top.tag !== tagName) {
                    errors++;
                }
            }
        }
    }
    
    // The aba container itself is opened at the start of abaHtml, so if its closing </div> is inside abaHtml, stack.length should be 0.
    console.log(`${current.id.padEnd(16)} | Open tags remaining: ${stack.length} | Closing mismatches: ${errors}`);
    if (stack.length > 0) {
        console.log(`  -> Open tags remaining in ${current.id}:`, stack.map(s => `<${s.tag}>`).join(', '));
    }
}
