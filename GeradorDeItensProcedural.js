// GeradorDeItensProcedural.js - FORJA ANCESTRAL E GERAÇÃO PROCEDURAL DE ITENS RPG
const crypto = require('crypto');

const RARIDADES = {
    'Comum': { nome: 'Comum', mult: 1.0, cor: '#dcdde1', glow: 'rgba(220, 221, 225, 0.25)', chance: 45, estrelas: '★' },
    'Raro': { nome: 'Raro', mult: 1.8, cor: '#00d2d3', glow: 'rgba(0, 210, 211, 0.45)', chance: 28, estrelas: '★★' },
    'Épico': { nome: 'Épico', mult: 2.8, cor: '#a55eea', glow: 'rgba(165, 94, 234, 0.6)', chance: 15, estrelas: '★★★' },
    'Lendário': { nome: 'Lendário', mult: 4.5, cor: '#fed330', glow: 'rgba(254, 211, 48, 0.75)', chance: 8, estrelas: '★★★★' },
    'Mítico': { nome: 'Mítico', mult: 7.5, cor: '#fc5c65', glow: 'rgba(252, 92, 101, 0.85)', chance: 3.5, estrelas: '★★★★★' },
    'Akáshico': { nome: 'Akáshico', mult: 13.0, cor: '#26de81', glow: 'rgba(38, 222, 129, 0.95)', chance: 0.5, estrelas: '★★★★★★' }
};

const NOMES_SLOTS = {
    armaPrincipal: {
        icone: '⚔️',
        label: 'Arma Principal',
        tipos: ['Athame Ritual', 'Gládio de Caim', 'Foice Ceifadora', 'Lâmina Vorpal', 'Punhal Sanguessuga', 'Espada Larga do Vazio', 'Cajado Necromântico', 'Machado de Pazuzu', 'Estilete Sombrio', 'Alfange Escarlate']
    },
    armaSecundaria: {
        icone: '🛡️',
        label: 'Mão Secundária',
        tipos: ['Escudo de Obsidiana', 'Tomo Proibido de Lilith', 'Orbe do Eclipse', 'Parriador Noturno', 'Broquel de Ossos', 'Grimório Abissal', 'Cálice de Sangue Puro', 'Crânio do Hierofante', 'Escudo Espinhoso']
    },
    elmo: {
        icone: '👑',
        label: 'Elmo / Diadema',
        tipos: ['Diadema da Noite Eterna', 'Elmo Corvo', 'Máscara da Peste Sombria', 'Capuz das Sombras', 'Coroa de Espinhos de Ferro', 'Elmo de Basilisco', 'Visor Carmesim', 'Tiara do Abismo']
    },
    armadura: {
        icone: '🥋',
        label: 'Couraça / Manto',
        tipos: ['Couraça de Sangue Fervente', 'Manto do Vazio', 'Mortalha Esquecida', 'Veste do Hierofante', 'Cota de Malha Negra', 'Armadura Escarlate Draconiana', 'Manto de Lilith', 'Peitoral de Ossos']
    },
    amuleto: {
        icone: '📿',
        label: 'Amuleto Astral',
        tipos: ['Olho de Lilith', 'Lágrima de Hécate', 'Pentáculo Invertido', 'Selo de Baphomet', 'Coração Cristalizado', 'Pingente Primordial', 'Ankh da Imortalidade', 'Talismã da Ruptura']
    },
    anel: {
        icone: '💍',
        label: 'Anel de Poder',
        tipos: ['Anel de Prata Negra', 'Aliança de Sangue', 'Sinete Draconiano', 'Aro do Vazio', 'Elo Qliphótico', 'Anel de Ossos Fervidos', 'Selo de Salomão', 'Banda Carmesim']
    },
    botas: {
        icone: '👢',
        label: 'Grevas / Botas',
        tipos: ['Grevas de Ferro Negro', 'Passos da Sombra', 'Sabatões de Caim', 'Botas do Predador Feral', 'Pisar Sepulcral', 'Calçados da Ruptura Astral']
    }
};

const PREFIXOS = [
    'Vorpal', 'Abissal', 'Sombrio', 'Ancestral', 'Profano', 'Sanguinário',
    'Eclíptico', 'Arcano', 'Qliphótico', 'Draconiano', 'Espectral',
    'Imortal', 'Primordial', 'Caótico', 'Celestial Corrompido', 'Necrótico', 'Draculiano', 'Oculto'
];

const SUFIXOS = [
    'da Noite Eterna', 'do Sangue Fervente', 'do Vazio Profundo', 'da Perdição Oculta',
    'de Lilith', 'de Caim', 'dos Primordiais', 'da Ruptura Cósmica',
    'do Silêncio Sepulcral', 'da Agonia Divina', 'do Trono Escarlate', 'da Transcendência'
];

const ARQUETIPOS = [
    'Agressão (DPS Físico)',
    'Ocultismo (Mago Cósmico)',
    'Baluarte (Tank Imortal)',
    'Sanguissuga (Cura/Vitae)',
    'Híbrido Akáshico'
];

class GeradorDeItensProcedural {
    static rolarRaridade() {
        const rand = Math.random() * 100;
        let acum = 0;
        for (const key of ['Akáshico', 'Mítico', 'Lendário', 'Épico', 'Raro', 'Comum']) {
            acum += RARIDADES[key].chance;
            if (rand <= acum) return RARIDADES[key];
        }
        return RARIDADES['Comum'];
    }

    static gerarItemProcedural(nivelVampiro = 1, slotForcado = null, raridadeForcada = null) {
        const slotsValidos = ['armaPrincipal', 'armaSecundaria', 'elmo', 'armadura', 'amuleto', 'anel', 'botas'];
        let slot = slotForcado && slotsValidos.includes(slotForcado) ? slotForcado : slotsValidos[Math.floor(Math.random() * slotsValidos.length)];
        
        const raridade = (raridadeForcada && RARIDADES[raridadeForcada]) ? RARIDADES[raridadeForcada] : this.rolarRaridade();
        
        const slotData = NOMES_SLOTS[slot] || NOMES_SLOTS['armaPrincipal'];
        const baseNome = slotData.tipos[Math.floor(Math.random() * slotData.tipos.length)];
        const prefixo = PREFIXOS[Math.floor(Math.random() * PREFIXOS.length)];
        const sufixo = SUFIXOS[Math.floor(Math.random() * SUFIXOS.length)];
        
        const nomeCompleto = `${prefixo} ${baseNome} ${sufixo}`;
        
        const arquetipo = ARQUETIPOS[Math.floor(Math.random() * ARQUETIPOS.length)];
        
        const poderBase = Math.max(1, Math.floor((Number(nivelVampiro) * 0.8 + 2) * raridade.mult));
        const poolTotal = poderBase * 2;
        
        let bonus = { vontade: 0, gnose: 0, magnetismo: 0, densidade: 0 };
        if (arquetipo.includes('Agressão')) {
            bonus.vontade = Math.floor(poolTotal * 0.7);
            bonus.densidade = Math.floor(poolTotal * 0.3);
        } else if (arquetipo.includes('Ocultismo')) {
            bonus.gnose = Math.floor(poolTotal * 0.7);
            bonus.magnetismo = Math.floor(poolTotal * 0.3);
        } else if (arquetipo.includes('Baluarte')) {
            bonus.densidade = Math.floor(poolTotal * 0.7);
            bonus.vontade = Math.floor(poolTotal * 0.3);
        } else if (arquetipo.includes('Sanguissuga')) {
            bonus.magnetismo = Math.floor(poolTotal * 0.6);
            bonus.gnose = Math.floor(poolTotal * 0.4);
        } else {
            bonus.vontade = Math.floor(poolTotal * 0.25);
            bonus.gnose = Math.floor(poolTotal * 0.25);
            bonus.magnetismo = Math.floor(poolTotal * 0.25);
            bonus.densidade = Math.floor(poolTotal * 0.25);
        }

        // Stats secundários dinâmicos baseados no slot e raridade
        let danoFisico = 0;
        let danoMagico = 0;
        let armadura = 0;
        let critico = 0;
        let rouboDeVida = 0;
        let furiaMax = 0;

        if (slot === 'armaPrincipal') {
            danoFisico = Math.floor((bonus.vontade * 12 + nivelVampiro * 15) * (raridade.mult * 0.5));
            danoMagico = Math.floor((bonus.gnose * 12 + nivelVampiro * 15) * (raridade.mult * 0.5));
            critico = Math.min(25, Math.floor(3 * raridade.mult));
            rouboDeVida = Math.min(15, Math.floor(2 * raridade.mult));
        } else if (slot === 'armaSecundaria') {
            armadura = Math.floor(8 * raridade.mult);
            danoMagico = Math.floor(bonus.gnose * 8 * raridade.mult);
            if (Math.random() > 0.5) furiaMax = Math.min(5, Math.floor(1 * raridade.mult));
        } else if (slot === 'armadura') {
            armadura = Math.floor(15 * raridade.mult);
            danoFisico = Math.floor(bonus.densidade * 5);
            furiaMax = Math.min(4, Math.floor(1 + raridade.mult * 0.4));
        } else if (slot === 'elmo') {
            armadura = Math.floor(10 * raridade.mult);
            danoMagico = Math.floor(bonus.gnose * 6);
            critico = Math.min(10, Math.floor(2 * raridade.mult));
        } else if (slot === 'amuleto') {
            danoMagico = Math.floor(bonus.gnose * 14 * (raridade.mult * 0.6));
            rouboDeVida = Math.min(12, Math.floor(2 * raridade.mult));
            critico = Math.min(12, Math.floor(2 * raridade.mult));
        } else if (slot === 'anel') {
            critico = Math.min(15, Math.floor(3 * raridade.mult));
            rouboDeVida = Math.min(10, Math.floor(2 * raridade.mult));
            danoFisico = Math.floor(bonus.vontade * 5);
            danoMagico = Math.floor(bonus.gnose * 5);
        } else if (slot === 'botas') {
            armadura = Math.floor(8 * raridade.mult);
            furiaMax = Math.min(3, Math.floor(1 + raridade.mult * 0.3));
            danoFisico = Math.floor(bonus.vontade * 4);
        }

        const id = crypto.randomBytes(6).toString('hex');
        const seed = parseInt(id.slice(0, 4), 16) || Math.floor(Math.random() * 65535);

        const item = {
            id,
            nome: nomeCompleto,
            tipo: slot,
            slotCompativel: slot === 'anel' ? ['anel1', 'anel2'] : [slot],
            raridade: raridade.nome,
            corRaridade: raridade.cor,
            glowRaridade: raridade.glow,
            estrelas: raridade.estrelas,
            icone: slotData.icone,
            arquetipo,
            aprimoramento: 0,
            durabilidade: 100,
            nivelRequerido: Math.max(1, nivelVampiro),
            bonusBase: { ...bonus },
            bonus: { ...bonus },
            danoFisico,
            danoMagico,
            armadura,
            critico,
            rouboDeVida,
            furiaMax,
            seed,
            dataCriacao: new Date().toISOString()
        };

        item.iconeMiniaturaSVG = this.gerarMiniaturaSVG(item);
        return item;
    }

    /**
     * Gera a miniatura vetorial SVG exclusiva para o item,
     * criando ilustrações com bordas e iluminação da raridade.
     */
    static gerarMiniaturaSVG(item) {
        const cor = item.corRaridade || '#dcdde1';
        const glow = item.glowRaridade || 'rgba(220, 221, 225, 0.4)';
        const seed = Number(item.seed) || 1234;
        const tipo = item.tipo;

        let desenhoInterno = '';

        if (tipo === 'armaPrincipal') {
            // Lâmina / Espada / Athame detalhado com guarda, empunhadura e runas
            const tilt = (seed % 10) - 5;
            desenhoInterno = `
                <g transform="rotate(${tilt} 24 24)">
                    <path d="M22 6 L26 6 L25 32 L23 32 Z" fill="${cor}" filter="drop-shadow(0 0 4px ${glow})"/>
                    <path d="M24 6 L26 6 L25 32 L24 32 Z" fill="#ffffff" opacity="0.6"/>
                    <rect x="16" y="32" width="16" height="3" rx="1.5" fill="#e5c07b" stroke="${cor}" stroke-width="0.5"/>
                    <circle cx="24" cy="33.5" r="1.5" fill="${cor}"/>
                    <rect x="22.5" y="35" width="3" height="6" rx="0.5" fill="#4b5263"/>
                    <circle cx="24" cy="42" r="2.5" fill="#e5c07b" stroke="${cor}" stroke-width="0.5"/>
                    <circle cx="24" cy="18" r="1.2" fill="#fff" opacity="0.9"/>
                    <circle cx="24" cy="24" r="1" fill="#fff" opacity="0.8"/>
                </g>
            `;
        } else if (tipo === 'armaSecundaria') {
            if (seed % 2 === 0) {
                desenhoInterno = `
                    <path d="M14 10 L34 10 L34 26 C34 35 24 41 24 41 C24 41 14 35 14 26 Z" fill="#1e1e24" stroke="${cor}" stroke-width="2" filter="drop-shadow(0 0 5px ${glow})"/>
                    <path d="M17 13 L31 13 L31 25 C31 32 24 37 24 37 C24 37 17 32 17 25 Z" fill="#2d2d38" opacity="0.7"/>
                    <path d="M24 16 L24 32 M19 21 L29 21" stroke="${cor}" stroke-width="2.5" stroke-linecap="round"/>
                    <circle cx="24" cy="21" r="2.5" fill="#fff"/>
                `;
            } else {
                desenhoInterno = `
                    <circle cx="24" cy="24" r="12" fill="#120524" stroke="${cor}" stroke-width="2" filter="drop-shadow(0 0 6px ${glow})"/>
                    <ellipse cx="24" cy="24" rx="16" ry="6" fill="none" stroke="${cor}" stroke-width="1.2" stroke-dasharray="3,2" transform="rotate(-25 24 24)"/>
                    <circle cx="21" cy="21" r="3.5" fill="#fff" opacity="0.8"/>
                    <circle cx="26" cy="26" r="1.5" fill="${cor}"/>
                `;
            }
        } else if (tipo === 'elmo') {
            desenhoInterno = `
                <path d="M15 14 C15 7 33 7 33 14 L35 25 C35 34 29 40 24 41 C19 40 13 34 13 25 Z" fill="#1f232a" stroke="${cor}" stroke-width="2" filter="drop-shadow(0 0 5px ${glow})"/>
                <path d="M16 12 L11 7 L16 9 M32 12 L37 7 L32 9" stroke="${cor}" stroke-width="2" stroke-linecap="round" fill="none"/>
                <path d="M18 22 L22 24 M30 22 L26 24" stroke="${cor}" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="20" cy="23" r="1" fill="#fff"/>
                <circle cx="28" cy="23" r="1" fill="#fff"/>
                <line x1="24" y1="28" x2="24" y2="35" stroke="#444" stroke-width="2"/>
                <line x1="21" y1="31" x2="27" y2="31" stroke="#444" stroke-width="1.5"/>
            `;
        } else if (tipo === 'armadura') {
            desenhoInterno = `
                <path d="M9 14 L17 11 L16 19 L8 19 Z" fill="#2d3436" stroke="${cor}" stroke-width="1.2"/>
                <path d="M39 14 L31 11 L32 19 L40 19 Z" fill="#2d3436" stroke="${cor}" stroke-width="1.2"/>
                <path d="M16 12 L32 12 L34 26 L29 39 L19 39 L14 26 Z" fill="#1e272e" stroke="${cor}" stroke-width="1.8" filter="drop-shadow(0 0 4px ${glow})"/>
                <path d="M16 22 L32 22 M18 29 L30 29" stroke="#485460" stroke-width="1.2"/>
                <polygon points="24,15 27,19 24,23 21,19" fill="${cor}" stroke="#fff" stroke-width="0.7"/>
            `;
        } else if (tipo === 'amuleto') {
            desenhoInterno = `
                <path d="M14 6 Q24 16 34 6" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="2,2"/>
                <circle cx="24" cy="27" r="11" fill="#1a1a24" stroke="${cor}" stroke-width="2" filter="drop-shadow(0 0 6px ${glow})"/>
                <polygon points="24,19 30,24 28,33 20,33 18,24" fill="${cor}"/>
                <polygon points="24,21 28,25 26,31 22,31 20,25" fill="#ffffff" opacity="0.5"/>
                <circle cx="24" cy="26" r="2" fill="#fff"/>
            `;
        } else if (tipo === 'anel') {
            desenhoInterno = `
                <ellipse cx="24" cy="28" rx="13" ry="8" fill="none" stroke="#d4af37" stroke-width="3" filter="drop-shadow(0 0 5px ${glow})"/>
                <ellipse cx="24" cy="28" rx="13" ry="8" fill="none" stroke="${cor}" stroke-width="1"/>
                <rect x="20" y="14" width="8" height="6" rx="2" fill="#e5c07b" stroke="${cor}" stroke-width="1"/>
                <polygon points="24,11 29,15 27,20 21,20 19,15" fill="${cor}" stroke="#fff" stroke-width="0.8"/>
                <circle cx="23" cy="15" r="1.5" fill="#fff" opacity="0.9"/>
            `;
        } else if (tipo === 'botas') {
            desenhoInterno = `
                <path d="M15 12 L21 12 L20 28 L23 35 L12 35 L13 28 Z" fill="#2c3e50" stroke="${cor}" stroke-width="1.5" filter="drop-shadow(0 0 4px ${glow})"/>
                <rect x="14" y="16" width="6" height="2" fill="#d4af37"/>
                <rect x="14" y="22" width="6" height="2" fill="#d4af37"/>
                <path d="M27 12 L33 12 L32 28 L35 35 L24 35 L25 28 Z" fill="#34495e" stroke="${cor}" stroke-width="1.5" filter="drop-shadow(0 0 4px ${glow})"/>
                <rect x="26" y="16" width="6" height="2" fill="#d4af37"/>
                <rect x="26" y="22" width="6" height="2" fill="#d4af37"/>
                <path d="M12 18 Q6 21 9 27 M36 18 Q42 21 39 27" fill="none" stroke="${cor}" stroke-width="1.5" stroke-linecap="round"/>
            `;
        }

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="44" height="44" class="item-mini-svg" style="display:inline-block; vertical-align:middle;">
  <defs>
    <radialGradient id="bgGlow_${item.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${cor}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#08080a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="2" y="2" width="44" height="44" rx="7" fill="#0c0d12" stroke="${cor}" stroke-width="1.6"/>
  <circle cx="24" cy="24" r="18" fill="url(#bgGlow_${item.id})"/>
  ${desenhoInterno}
</svg>`;
    }

    static gerarDropEspolio(origem = 'mob', nivel = 1) {
        const slots = ['armaPrincipal', 'armaSecundaria', 'elmo', 'armadura', 'amuleto', 'anel', 'botas'];
        const slotSorteado = slots[Math.floor(Math.random() * slots.length)];
        
        let raridade = null;
        if (origem === 'boss') {
            const rands = ['Épico', 'Lendário', 'Mítico'];
            raridade = rands[Math.floor(Math.random() * rands.length)];
        } else if (origem === 'akashico') {
            raridade = Math.random() > 0.4 ? 'Akáshico' : 'Mítico';
        }

        return this.gerarItemProcedural(nivel, slotSorteado, raridade);
    }
}

module.exports = GeradorDeItensProcedural;
