const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');
const scriptMatch = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
const clientScript = scriptMatch[2].replace(/<script\b[^>]*>/i, '').replace(/<\/script>/i, '');

// Criar ambiente de simulação de navegador
const sandbox = {
    addEventListener: () => {},
    removeEventListener: () => {},
    window: {},
    document: {
        readyState: 'complete',
        addEventListener: (evt, fn) => { setTimeout(fn, 10); },
        removeEventListener: () => {},
        getElementById: (id) => {
            return {
                id,
                style: {},
                classList: {
                    add: () => {},
                    remove: () => {},
                    contains: () => false
                },
                innerText: '',
                innerHTML: '',
                value: '',
                play: () => Promise.resolve(),
                pause: () => {},
                addEventListener: () => {}
            };
        },
        querySelectorAll: () => [],
        querySelector: () => null,
        createElement: (tag) => ({
            style: {},
            className: '',
            appendChild: () => {},
            remove: () => {}
        }),
        body: {
            classList: { add: () => {}, remove: () => {} },
            appendChild: () => {}
        }
    },
    localStorage: {
        getItem: () => null,
        setItem: () => {}
    },
    io: () => ({
        on: () => {},
        emit: () => {}
    }),
    AudioContext: function() {
        return {
            state: 'running',
            currentTime: 0,
            destination: {},
            createGain: () => ({
                gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, setTargetAtTime: () => {} },
                connect: () => {}
            }),
            createOscillator: () => ({
                type: 'sine',
                frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
                connect: () => {},
                start: () => {},
                stop: () => {}
            }),
            createBiquadFilter: () => ({
                type: 'lowpass',
                frequency: { setValueAtTime: () => {} },
                connect: () => {}
            }),
            resume: () => Promise.resolve()
        };
    },
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: (fn) => setTimeout(fn, 16)
};

sandbox.window = sandbox;
sandbox.webkitAudioContext = sandbox.AudioContext;

try {
    const script = new vm.Script(clientScript);
    const context = vm.createContext(sandbox);
    script.runInContext(context);
    console.log("✅ SUCESSO: O script do index.html executou do início ao fim sem nenhum erro de runtime!");
    console.log("window.libertarVideo definido?", typeof sandbox.window.libertarVideo === 'function');
    console.log("window.pularIntro definido?", typeof sandbox.window.pularIntro === 'function');
    
    // Testar chamada direta de libertarVideo e pularIntro
    sandbox.window.libertarVideo();
    console.log("✅ libertarVideo() executou com sucesso!");
    sandbox.window.pularIntro();
    console.log("✅ pularIntro() executou com sucesso!");
} catch (err) {
    console.error("❌ ERRO NO RUNTIME DO CLIENTE:", err);
    process.exit(1);
}
