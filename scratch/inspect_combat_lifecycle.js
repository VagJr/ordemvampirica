const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function showFn(name) {
    const idx = html.indexOf(name);
    console.log(`=== ${name} ===`);
    if (idx !== -1) {
        console.log(html.substring(idx, idx + 800));
    } else {
        console.log('NOT FOUND');
    }
}

showFn('function iniciarCombateVisceral');
showFn('function encerrarArenaFinal');
showFn('function abortarCombateManual');
