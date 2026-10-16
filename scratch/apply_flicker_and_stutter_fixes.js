const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
console.log('Original index.html length:', html.length);

// 1. Update .parry-flash and .void-flash CSS (remove invert(1) and overlay blend-mode)
const oldFlashCss = `.parry-flash { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(255, 255, 255, 0.8); z-index: 10000; pointer-events: none; animation: flashFade 0.3s forwards; mix-blend-mode: overlay;}`;
const newFlashCss = `/* Feedback Visual Suave e Fluido (Zero Flicker / Zero Inversão / 60 FPS) */
        .parry-flash { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 70%); z-index: 10000; pointer-events: none; animation: flashFade 0.25s ease-out forwards; }
        .rit-glow-magia { box-shadow: inset 0 0 40px #000, 0 0 40px var(--magia) !important; transition: box-shadow 0.3s ease !important; }
        .rit-glow-sangue { box-shadow: inset 0 0 40px #000, 0 0 25px #8a0303 !important; transition: box-shadow 0.3s ease !important; }`;

if (html.includes(oldFlashCss)) {
    html = html.replace(oldFlashCss, newFlashCss);
    console.log('✅ 1. parry-flash updated with smooth non-aggressive gradient.');
} else {
    console.error('⚠️ 1. oldFlashCss not found directly, using regex fallback...');
    html = html.replace(/\.parry-flash\s*\{[^}]+\}/, newFlashCss);
}

// 2. Update .void-flash CSS (eliminate filter: invert(1))
const oldVoidFlashCss = `.void-flash { position: fixed; top: 0; left: 0; pointer-events: none; width: 100vw; height: 100vh; background: rgba(128, 0, 128, 0.4); z-index: 9999; animation: flashFade 1s forwards; filter: invert(1); }`;
const newVoidFlashCss = `.void-flash { position: fixed; top: 0; left: 0; pointer-events: none; width: 100vw; height: 100vh; background: radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.35) 0%, transparent 75%); z-index: 9999; animation: flashFade 0.4s ease-out forwards; }`;

if (html.includes(oldVoidFlashCss)) {
    html = html.replace(oldVoidFlashCss, newVoidFlashCss);
    console.log('✅ 2. void-flash filter: invert(1) eliminated.');
} else {
    console.error('⚠️ 2. oldVoidFlashCss not found directly, using regex fallback...');
    html = html.replace(/\.void-flash\s*\{[^}]+\}/, newVoidFlashCss);
}

// 3. Fix visceralPulseGlow scale layout-thrashing
const oldVisceralGlow = `@keyframes visceralPulseGlow {
            0% { box-shadow: 0 0 10px rgba(255, 30, 47, 0.6); border-color: #ff1e2f; }
            100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.9), 0 0 50px rgba(255, 30, 47, 0.8); border-color: #d4af37; transform: scale(1.02); }
        }`;
const newVisceralGlow = `@keyframes visceralPulseGlow {
            0% { box-shadow: 0 0 8px rgba(255, 30, 47, 0.5); border-color: #ff1e2f; }
            100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 30, 47, 0.7); border-color: #d4af37; }
        }`;

if (html.includes(oldVisceralGlow)) {
    html = html.replace(oldVisceralGlow, newVisceralGlow);
    console.log('✅ 3. visceralPulseGlow scale transform removed to eliminate layout-thrashing.');
}

// 4. Update abismoVoid() to shake arena only, not document.body
const oldAbismoVoid = `function abismoVoid() { playSfx('magia'); const s = document.createElement('div'); s.className = 'void-flash'; document.body.appendChild(s); document.body.classList.add('shake-screen'); setTimeout(() => { s.remove(); document.body.classList.remove('shake-screen'); }, 1000); }`;
const newAbismoVoid = `function abismoVoid() {
        playSfx('magia');
        const s = document.createElement('div');
        s.className = 'void-flash';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 400);

        const arena = document.getElementById('arena-acao');
        const targetShake = (arena && !arena.classList.contains('oculto')) ? arena : document.getElementById('ritual-camara');
        if (targetShake && !targetShake.classList.contains('oculto')) {
            targetShake.classList.add('screen-shake');
            setTimeout(() => targetShake.classList.remove('screen-shake'), 350);
        }
    }`;

if (html.includes(oldAbismoVoid)) {
    html = html.replace(oldAbismoVoid, newAbismoVoid);
    console.log('✅ 4. abismoVoid updated to shake arena only, avoiding whole-body flicker.');
} else {
    console.error('⚠️ 4. oldAbismoVoid not found directly!');
}

// 5. Throttle jorrarSangue to prevent DOM flooding
const oldJorrarSangue = `function jorrarSangue() { playSfx('sangue'); if (meuVampiro && meuVampiro.raca === 'lycan') { const s = document.createElement('div'); s.className = 'claw-splash'; document.body.appendChild(s); setTimeout(() => s.remove(), 1000); } else { const s = document.createElement('div'); s.className = 'blood-splash'; document.body.appendChild(s); setTimeout(() => s.remove(), 1500); } }`;
const newJorrarSangue = `let _ultimoSplashSangue = 0;
    function jorrarSangue() {
        playSfx('sangue');
        const agora = Date.now();
        if (agora - _ultimoSplashSangue < 350) return;
        _ultimoSplashSangue = agora;

        const existente = document.querySelector('.blood-splash, .claw-splash');
        if (existente) existente.remove();

        const s = document.createElement('div');
        if (meuVampiro && meuVampiro.raca === 'lycan') {
            s.className = 'claw-splash';
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 600);
        } else {
            s.className = 'blood-splash';
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 600);
        }
    }`;

if (html.includes(oldJorrarSangue)) {
    html = html.replace(oldJorrarSangue, newJorrarSangue);
    console.log('✅ 5. jorrarSangue throttled and single-instance limited.');
} else {
    console.error('⚠️ 5. oldJorrarSangue not found directly!');
}

// 6. Smooth ritual minigame boxShadow toggles
const oldRitualBoxShadow = `            if (ritPressaoAtual >= 40 && ritPressaoAtual <= 60) {
                ritProgresso += 1.0; 
                if(sg) sg.style.boxShadow = "inset 0 0 40px #000, 0 0 50px var(--magia)"; 
            } else {
                ritProgresso -= 0.3; 
                if(sg) sg.style.boxShadow = "inset 0 0 40px #000, 0 0 30px #8a0303";
            }`;

const newRitualBoxShadow = `            if (ritPressaoAtual >= 40 && ritPressaoAtual <= 60) {
                ritProgresso += 1.0; 
                if (sg && !sg.classList.contains('rit-glow-magia')) {
                    sg.classList.remove('rit-glow-sangue');
                    sg.classList.add('rit-glow-magia');
                }
            } else {
                ritProgresso -= 0.3; 
                if (sg && !sg.classList.contains('rit-glow-sangue')) {
                    sg.classList.remove('rit-glow-magia');
                    sg.classList.add('rit-glow-sangue');
                }
            }`;

if (html.includes(oldRitualBoxShadow)) {
    html = html.replace(oldRitualBoxShadow, newRitualBoxShadow);
    console.log('✅ 6. Ritual minigame 20FPS inline boxShadow mutations replaced with class-based transitions.');
} else {
    console.error('⚠️ 6. oldRitualBoxShadow not found directly!');
}

// 7. Shield combat and ritual gameplay from background sync reflows
const oldSocketTicks = `    socket.on('sync_geral', () => { carregarMercado(); carregarLeilao(); carregarBiblioteca(); atualizarConclave(); carregarReinos(); if(meuVampiro) syncStatus(); });
    socket.on('tick', () => {
        forcarSyncVisualRapido(); 
    });`;

const newSocketTicks = `    socket.on('sync_geral', () => {
        // Blindagem de performance: Não processar reflows pesados durante combate ativo ou minigame de ritual
        if (typeof combateAtivo !== 'undefined' && combateAtivo) return;
        if (typeof ritAtivo !== 'undefined' && ritAtivo) return;
        carregarMercado(); carregarLeilao(); carregarBiblioteca(); atualizarConclave(); carregarReinos(); 
        if (meuVampiro) syncStatus(); 
    });
    socket.on('tick', () => {
        if (typeof combateAtivo !== 'undefined' && combateAtivo) return;
        if (typeof ritAtivo !== 'undefined' && ritAtivo) return;
        forcarSyncVisualRapido(); 
    });`;

if (html.includes(oldSocketTicks)) {
    html = html.replace(oldSocketTicks, newSocketTicks);
    console.log('✅ 7. Combat and ritual gameplay shielded from background sync reflows.');
} else {
    console.error('⚠️ 7. oldSocketTicks not found directly!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Finished updating index.html! New length:', html.length);
