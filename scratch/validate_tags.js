const fs = require('fs');
const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

// Parse HTML tag stack to find unclosed or mismatched tags
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

const tagRegex = /<\/?([a-zA-Z0-9\-]+)(\s+[^>]*)?\/?>/g;
const stack = [];
let match;
let errors = [];

// Start parsing after <head>...</head>
const bodyStart = html.indexOf('<body');
tagRegex.lastIndex = bodyStart;

let line = 1;
let lastIdx = 0;

function getLine(idx) {
    const lines = html.substring(0, idx).split('\n');
    return lines.length;
}

while ((match = tagRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const isClosing = fullTag.startsWith('</');
    const isSelfClosing = fullTag.endsWith('/>') || voidTags.has(tagName);
    const tagPos = match.index;
    const tagLine = getLine(tagPos);

    if (tagName === 'script' || tagName === 'style') {
        // Skip until closing script/style
        const closeTag = `</${tagName}>`;
        const closeIdx = html.indexOf(closeTag, tagPos);
        if (closeIdx !== -1) {
            tagRegex.lastIndex = closeIdx + closeTag.length;
        }
        continue;
    }

    if (isSelfClosing) {
        continue;
    }

    if (!isClosing) {
        // Opening tag
        const idMatch = fullTag.match(/id=["']([^"']+)["']/);
        const classMatch = fullTag.match(/class=["']([^"']+)["']/);
        stack.push({
            tagName,
            id: idMatch ? idMatch[1] : null,
            className: classMatch ? classMatch[1] : null,
            line: tagLine,
            fullTag: fullTag.substring(0, 50)
        });
    } else {
        // Closing tag
        if (stack.length === 0) {
            errors.push({ type: 'EXTRA_CLOSING', tagName, line: tagLine });
            continue;
        }
        const top = stack[stack.length - 1];
        if (top.tagName === tagName) {
            stack.pop();
        } else {
            // Mismatch! Let's see if top tag was never closed
            errors.push({
                type: 'MISMATCH',
                expected: top.tagName,
                expectedId: top.id,
                expectedLine: top.line,
                found: tagName,
                line: tagLine
            });
            // Try to recover by popping stack
            const foundIdx = stack.map(s => s.tagName).lastIndexOf(tagName);
            if (foundIdx !== -1) {
                // Popped unclosed elements between foundIdx and end
                const unclosed = stack.splice(foundIdx);
                unclosed.pop(); // remove the matching one
            } else {
                // Stray closing tag
            }
        }
    }
}

console.log(`Auditoria Completa de Tags HTML:`);
console.log(`Erros encontrados: ${errors.length}`);
errors.slice(0, 30).forEach((err, idx) => {
    console.log(`${idx + 1}. [Linha ${err.line}] ${err.type}: esperado </${err.expected}${err.expectedId ? '#' + err.expectedId : ''}> (aberto na l. ${err.expectedLine}), mas encontrado </${err.found}>`);
});

console.log(`\nTags restantes na pilha não fechadas: ${stack.length}`);
stack.forEach(s => console.log(` - <${s.tagName}${s.id ? '#' + s.id : ''}> aberta na linha ${s.line}`));
