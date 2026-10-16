const fs = require('fs');

function inspectKeywords(filename, regex) {
    if (!fs.existsSync(filename)) return;
    const content = fs.readFileSync(filename, 'utf8');
    const lines = content.split('\n');
    console.log(`\n=================== ${filename} ===================`);
    lines.forEach((line, idx) => {
        if (regex.test(line)) {
            console.log(`L${idx + 1}: ${line.trim().substring(0, 140)}`);
        }
    });
}

inspectKeywords('ShadowCore.js', /(motim|fome|morreu|morto|morte|falecimento|reset|eliminar|danoOffline|assassinato|decapita)/i);
inspectKeywords('server.js', /(motim|fome|morreu|morto|morte|falecimento|reset|eliminar|danoOffline|assassinato|decapita)/i);
