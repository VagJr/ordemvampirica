const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

// Load into JSDOM with css parsing
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
const document = dom.window.document;
const window = dom.window;

console.log('body classList initially:', document.body.className);

// Let's check visibility of all direct children of body and top level elements
const bodyChildren = Array.from(document.body.children);
console.log(`Body has ${bodyChildren.length} direct children:`);

for (const child of bodyChildren) {
    const id = child.id || child.className || child.tagName;
    const style = window.getComputedStyle(child);
    const display = style.display;
    const visibility = style.visibility;
    const zIndex = style.zIndex;
    const pos = style.position;
    const textSnippet = child.textContent.replace(/\s+/g, ' ').trim().substring(0, 60);
    console.log(`- <${child.tagName.toLowerCase()} id="${child.id}" class="${child.className}"> | display: ${display} | pos: ${pos} | zIndex: ${zIndex} | text: "${textSnippet}"`);
}
