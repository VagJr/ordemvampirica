const fs = require('fs');
const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

const regex = /#([a-zA-Z0-9\-_]+)[^{]*\{[^}]*position\s*:\s*fixed[^}]*\}/gi;
let m;
console.log('--- CSS RULES WITH POSITION: FIXED ---');
while ((m = regex.exec(html)) !== null) {
    console.log(m[0].replace(/\s+/g, ' ').substring(0, 100));
}

console.log('\n--- INLINE STYLES WITH POSITION: FIXED ---');
const inlineRegex = /<([a-zA-Z0-9]+)\s+[^>]*id=["']([^"']+)["'][^>]*style=["'][^"']*position\s*:\s*fixed[^"']*["'][^>]*>/gi;
while ((m = inlineRegex.exec(html)) !== null) {
    console.log(`<${m[1]} id="${m[2]}">`);
}
