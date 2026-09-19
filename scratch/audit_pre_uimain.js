const fs = require('fs');
const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

const bodyStart = html.indexOf('<body');
const uiMainStart = html.indexOf('id="ui-main"');
const preSection = html.substring(bodyStart, uiMainStart);

const tagRegex = /<\/?([a-zA-Z0-9\-]+)(\s+[^>]*)?\/?>/g;
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const stack = [];
let tm;
let errors = 0;

while ((tm = tagRegex.exec(preSection)) !== null) {
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
            console.log(`Extra close in pre-section: </${tagName}>`);
            errors++;
        } else {
            const top = stack.pop();
            if (top.tag !== tagName) {
                console.log(`Mismatch in pre-section: expected </${top.tag}>, found </${tagName}>`);
                errors++;
            }
        }
    }
}

console.log(`Pre-section (body to ui-main): open tags remaining: ${stack.length}, errors: ${errors}`);
console.log('Remaining open tags:', stack.map(s => `<${s.tag}>`).join(', '));
