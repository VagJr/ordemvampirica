const fs = require('fs');

const files = ['server.js', 'ShadowCore.js', 'CombatEngine.js', 'MundoAberto2D.js', 'OrdemMagicaCore.js'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    console.log(`\n=================== ${file} ===================`);
    lines.forEach((line, idx) => {
        if (/("Cinzas"|'Cinzas'|"Morto"|'Morto'|"Banido"|'Banido'|hpAtual\s*<=?\s*0|hp\s*<=?\s*0|\.hp\s*=\s*0|sucumbiu|virou cinzas|morreu)/i.test(line)) {
            console.log(`L${idx + 1}: ${line.trim().substring(0, 140)}`);
        }
    });
});
