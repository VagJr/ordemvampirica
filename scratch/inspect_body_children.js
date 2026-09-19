const fs = require('fs');
const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

const bodyStart = html.indexOf('<body');
const bodyTagEnd = html.indexOf('>', bodyStart) + 1;
const bodyEnd = html.indexOf('</body>');
const body = html.substring(bodyTagEnd, bodyEnd);

// Find all elements with an ID that are at the top level or major containers
const regex = /<([a-zA-Z0-9]+)\s+[^>]*id=["']([^"']+)["'][^>]*>/g;
let m;
console.log('--- ALL ELEMENTS WITH ID IN BODY ---');
const elements = [];
while ((m = regex.exec(body)) !== null) {
    elements.push({ tag: m[1], id: m[2], full: m[0], pos: m.index });
}

console.log(`Found ${elements.length} elements with ID.`);

// Check which elements exist AFTER #ui-main
const uiMainIndex = body.indexOf('id="ui-main"');
console.log('ui-main index in body:', uiMainIndex);

// Let's see what is after </main> or closing tag of ui-main
// Where does ui-main close?
let depth = 0;
let uiMainClose = -1;
const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
tagRegex.lastIndex = uiMainIndex;

while ((m = tagRegex.exec(body)) !== null) {
    const isClosing = m[0].startsWith('</');
    const isSelfClosing = m[0].endsWith('/>') || ['img', 'input', 'br', 'hr'].includes(m[1].toLowerCase());
    if (isSelfClosing) continue;
    
    if (!isClosing) {
        depth++;
    } else {
        depth--;
        if (depth === 0) {
            uiMainClose = m.index + m[0].length;
            break;
        }
    }
}

console.log(`ui-main opens at ${uiMainIndex} and closes at ${uiMainClose}`);
const afterUiMain = body.substring(uiMainClose);
console.log('\n--- CONTENT AFTER #ui-main ---');
console.log(afterUiMain.substring(0, 1500));
