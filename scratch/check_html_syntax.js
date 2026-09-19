const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
let errors = 0;

while ((match = scriptRegex.exec(html)) !== null) {
    count++;
    const code = match[1].trim();
    if (!code) {
        console.log(`Script ${count}: empty or external src`);
        continue;
    }
    try {
        new vm.Script(code);
        console.log(`Script ${count}: Syntax VALID (${code.length} chars)`);
    } catch (err) {
        errors++;
        console.error(`Script ${count} ERROR:`, err.message);
        console.error(err.stack);
    }
}

if (errors === 0) {
    console.log(`SUCCESS: All ${count} scripts in index.html have valid syntax!`);
} else {
    console.error(`FAILED: ${errors} scripts had syntax errors.`);
    process.exit(1);
}
