const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regexes = [
    /parry-flash/g,
    /flashFade/g,
    /screen-shake|shake/g,
    /cicloCombate|arena-ciclo-timer|intervaloCombate|timerArena/g,
    /ritual|camara-ritual|minigame/g
];

regexes.forEach(r => {
    let m = html.match(r);
    console.log(r.source, 'matches:', m ? m.length : 0);
});
