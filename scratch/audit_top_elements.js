const fs = require('fs');
const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

const bodyTagRegex = /<body\b[^>]*>/i;
const bodyMatch = bodyTagRegex.exec(html);
const bodyStart = bodyMatch.index + bodyMatch[0].length;
const bodyEnd = html.indexOf('</body>');

console.log('Body starts at index:', bodyStart, 'ends at:', bodyEnd);

const tagRegex = /<\/?([a-zA-Z0-9\-]+)(\s+[^>]*)?\/?>/g;
tagRegex.lastIndex = bodyStart;

const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const topLevel = [];
let depth = 0;
let currentTop = null;
let m;

while ((m = tagRegex.exec(html)) !== null) {
    if (m.index >= bodyEnd) break;
    const fullTag = m[0];
    const tagName = m[1].toLowerCase();
    const isClosing = fullTag.startsWith('</');
    const isSelfClosing = fullTag.endsWith('/>') || voidTags.has(tagName);
    
    if (tagName === 'script' || tagName === 'style') {
        const closeTag = `</${tagName}>`;
        const closeIdx = html.indexOf(closeTag, m.index);
        if (closeIdx !== -1) {
            tagRegex.lastIndex = closeIdx + closeTag.length;
        }
        if (depth === 0) {
            topLevel.push({ tag: tagName, id: 'SCRIPT/STYLE', className: '', start: m.index, end: tagRegex.lastIndex });
        }
        continue;
    }
    
    if (!isClosing) {
        if (depth === 0) {
            const idM = fullTag.match(/id=["']([^"']+)["']/);
            const classM = fullTag.match(/class=["']([^"']+)["']/);
            currentTop = {
                tag: tagName,
                id: idM ? idM[1] : 'NONE',
                className: classM ? classM[1] : 'NONE',
                start: m.index,
                fullTag: fullTag.substring(0, 80)
            };
        }
        if (!isSelfClosing) {
            depth++;
        } else if (depth === 0) {
            currentTop.end = m.index + fullTag.length;
            topLevel.push(currentTop);
            currentTop = null;
        }
    } else {
        depth--;
        if (depth === 0 && currentTop) {
            currentTop.end = m.index + fullTag.length;
            topLevel.push(currentTop);
            currentTop = null;
        }
    }
}

console.log(`Top-level elements inside <body> (${topLevel.length}):`);
topLevel.forEach((el, idx) => {
    console.log(`${String(idx + 1).padStart(2)}. <${el.tag.padEnd(6)}> id="${el.id.padEnd(25)}" class="${el.className.padEnd(15)}" [${el.end - el.start} bytes]`);
});
