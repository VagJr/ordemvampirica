const fs = require('fs');
const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

const start = html.indexOf('id="ui-main"');
console.log('Index of ui-main:', start);

const tagRegex = /<\/?([a-zA-Z0-9]+)([^>]*?)(\/?)>/g;
tagRegex.lastIndex = start;

const stack = [];
let m;
while ((m = tagRegex.exec(html)) !== null) {
    const full = m[0];
    const tag = m[1].toLowerCase();
    const isClose = full.startsWith('</');
    const isSelfClose = full.endsWith('/>') || ['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tag);

    if (isSelfClose) continue;

    if (!isClose) {
        stack.push({ tag, full, index: m.index, line: html.substring(0, m.index).split('\n').length });
    } else {
        if (stack.length === 0) {
            console.log(`EMPTY STACK: Unexpected </${tag}> at index ${m.index}, line ${html.substring(0, m.index).split('\n').length}`);
            break;
        }
        const top = stack.pop();
        if (stack.length === 0) {
            console.log(`STACK REACHED 0: Popped <${top.tag}> (from line ${top.line}, snippet: ${top.full.substring(0, 50).replace(/\n/g, ' ')}) by </${tag}> at line ${html.substring(0, m.index).split('\n').length}`);
            console.log('Close snippet:', html.substring(m.index - 50, m.index + 50).replace(/\n/g, ' '));
        }
    }
}
