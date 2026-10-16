const fs = require('fs');

['server.js', 'ShadowCore.js', 'CombatEngine.js'].forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    console.log(`\n=================== ${file} ===================`);
    lines.forEach((line, idx) => {
        if (/estado\s*=\s*['"]Banido['"]|status\s*=\s*['"]Cinzas['"]|estado\s*=\s*['"]Morto['"]/i.test(line)) {
            console.log(`L${idx + 1}: ${line.trim()}`);
            // Show context
            const ctxStart = Math.max(0, idx - 4);
            const ctxEnd = Math.min(lines.length - 1, idx + 4);
            for (let c = ctxStart; c <= ctxEnd; c++) {
                console.log(`   [${c + 1}] ${lines[c]}`);
            }
            console.log('---');
        }
    });
});
