const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = scriptRegex.exec(html)) !== null) {
    count++;
    const code = match[1].trim();
    if (!code) continue;
    try {
        new vm.Script(code);
        console.log(`Script ${count}: Syntax OK (${code.length} chars)`);
    } catch (e) {
        console.error(`Script ${count} Syntax ERROR:`, e.message);
        // Print snippet around error
        if (e.stack) console.error(e.stack.split('\n').slice(0, 5).join('\n'));
    }
}
