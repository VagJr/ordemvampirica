// MundoAberto2D.js - MOTOR DO MUNDO ABERTO 2D SANDBOX MULTIPLAYER EM TEMPO REAL
const crypto = require('crypto');

// Tipos de Terreno no Grid 80x80
const TERRENO = {
    ABISMO: 0,       // Vazio intransponível / Água abissal
    SANTUARIO: 1,    // Santuário de Enoch (Seguro, calçamento rúnico, sem PvP)
    FLORESTA: 2,     // Floresta de Espinhos (Ervas raras, sombras)
    ERMOS_PVP: 3,    // Ermos de Gehenna (PvP Ativo, Construção Livre de Clãs!)
    MINAS: 4         // Cordilheira de Obsidiana (Minérios de Ferro Negro e Gemas)
};

// Custos e Propriedades das Estruturas de Clã
const ESTRUTURAS_CONFIG = {
    muralha_pedra: {
        nome: "Muralha de Pedra Rúnica",
        icone: "🧱",
        hpMax: 1000,
        bloqueiaPassagem: true,
        custo: { materiais: { pedra: 5, ferroNegro: 1 } },
        descricao: "Muralha densa para fortificar o território do clã contra invasores."
    },
    portao_ferro: {
        nome: "Portão de Ferro Negro",
        icone: "⛩️",
        hpMax: 800,
        bloqueiaPassagem: 'clan',
        custo: { materiais: { ferroNegro: 4 } },
        descricao: "Portão resistente com fechadura mágica acessível apenas ao clã."
    },
    altar_egregora: {
        nome: "Altar da Egrégora do Reino",
        icone: "🔮",
        hpMax: 2500,
        bloqueiaPassagem: true,
        raioInfluencia: 7,
        custo: { materiais: { pedra: 10, ferroNegro: 5 }, inventario: { pedraAlma: 1 } },
        descricao: "Coração do território do clã. Regenera a carne dos aliados na área e emana glória."
    },
    torre_balista: {
        nome: "Balista Espectral de Sangue",
        icone: "🏹",
        hpMax: 1200,
        bloqueiaPassagem: true,
        raioAtaque: 5,
        danoTiro: 80,
        custo: { materiais: { pedra: 8, ferroNegro: 4 } },
        descricao: "Torre defensiva automatizada que dispara dardos etéreos em invasores hostis."
    },
    fonte_sangue: {
        nome: "Fonte Sagrada de Vitae",
        icone: "🩸",
        hpMax: 1500,
        bloqueiaPassagem: true,
        custo: { materiais: { pedra: 5, lotusNegro: 2 }, inventario: { vitae: 2 } },
        descricao: "Regenera passivamente HP e Vitae de todos os aliados no perímetro."
    },
    oficina_forja: {
        nome: "Bigorna Draconiana de Campo",
        icone: "⚒️",
        hpMax: 1500,
        bloqueiaPassagem: true,
        custo: { materiais: { pedra: 10, ferroNegro: 8 } },
        descricao: "Permite forjar armamentos e artefatos lendários diretamente no front."
    }
};

// EDIFICAÇÕES FIXAS DA CIDADE (SANTUÁRIO DE ENOCH)
const EDIFICACOES_CIDADE = {
    'portal_abismo': {
        id: 'portal_abismo',
        nome: 'Portal do Abismo & Cripta',
        icone: '🌀',
        subtitulo: 'Masmorras & Rituais Abissais',
        x: 40, y: 34,
        acao: 'abismo',
        cor: '#9b59b6',
        desc: 'Fenda dimensional ancestral ligada diretamente às masmorras procedurais do Abismo.'
    },
    'altar_primordial': {
        id: 'altar_primordial',
        nome: 'Altar da Noite Eterna',
        icone: '🏛️',
        subtitulo: 'Bênção Astral & Juízo Cósmico',
        x: 40, y: 40,
        acao: 'altar',
        cor: '#ffd700',
        desc: 'Coração místico de Enoch. Sintoniza a Balança Cósmica e a Graça dos Primordiais.'
    },
    'bazar_astral': {
        id: 'bazar_astral',
        nome: 'Bazar P2P dos Imortais',
        icone: '⚖️',
        subtitulo: 'Mercado de Relíquias & Artefatos',
        x: 36, y: 38,
        acao: 'mercado',
        cor: '#d4af37',
        desc: 'Ponto de comércio livre onde relíquias forjadas são transacionadas por Sangue Gts.'
    },
    'taverna_sombras': {
        id: 'taverna_sombras',
        nome: 'Taverna das Sombras',
        icone: '🍷',
        subtitulo: 'Alta Corte & Conclave dos Clãs',
        x: 44, y: 38,
        acao: 'chat',
        cor: '#ff3838',
        desc: 'Ponto de encontro da linhagem. Sussurros, alianças e rumores da noite.'
    },
    'forja_ancestral': {
        id: 'forja_ancestral',
        nome: 'Bigorna Draconiana Municipal',
        icone: '🌋',
        subtitulo: 'Forja & Crafting Procedural',
        x: 36, y: 43,
        acao: 'forja',
        cor: '#ff793f',
        desc: 'Onde o ferro negro e as pedras rúnicas são marteladas para criar armas míticas.'
    },
    'arena_gladiadores': {
        id: 'arena_gladiadores',
        nome: 'Coliseu de Sangue',
        icone: '🏟️',
        subtitulo: 'Arena Visceral de Combate',
        x: 44, y: 43,
        acao: 'arena',
        cor: '#e74c3c',
        desc: 'Arena sagrada para duelos viscerais de honra, apostas e carnificina.'
    }
};

class MundoAberto2D {
    constructor(core) {
        this.core = core;
        this.largura = 80;
        this.altura = 80;
        this.grid = [];
        this.estruturas = {};
        this.minions = {};
        this.nosRecursos = {};
        this.monstros = {};
        this.mortais = {};
        this.jogadores = {};
        this.edificacoesCidade = EDIFICACOES_CIDADE;
        this.ultimoTick = Date.now();

        this.gerarMapaProcedural();
    }

    gerarMapaProcedural() {
        this.grid = [];
        for (let y = 0; y < this.altura; y++) {
            const linha = [];
            for (let x = 0; x < this.largura; x++) {
                // Santuário Central (Área Segura de Enoch)
                if (x >= 32 && x <= 48 && y >= 32 && y <= 48) {
                    linha.push(TERRENO.SANTUARIO);
                } 
                // Cordilheira de Minas (Bordas e cantos)
                else if (x <= 10 || x >= 70 || (y <= 10 && x >= 50)) {
                    linha.push(TERRENO.MINAS);
                }
                // Floresta de Espinhos (Norte e Noroeste)
                else if (y <= 31 && x < 50) {
                    linha.push(TERRENO.FLORESTA);
                }
                // Ermos de Gehenna (Sul e Leste - PvP e Sandbox Livre)
                else {
                    linha.push(TERRENO.ERMOS_PVP);
                }
            }
            this.grid.push(linha);
        }

        this.popularNosRecursos();
        this.popularMonstrosIniciais();
        this.popularMortais();
    }

    popularNosRecursos() {
        this.nosRecursos = {};
        // Nós de Minérios nas Minas
        for (let i = 0; i < 35; i++) {
            const x = Math.floor(Math.random() * 80);
            const y = Math.floor(Math.random() * 80);
            if (this.grid[y][x] === TERRENO.MINAS || (this.grid[y][x] === TERRENO.ERMOS_PVP && Math.random() > 0.6)) {
                const tipoRecurso = Math.random() > 0.4 ? 'ferroNegro' : 'pedra';
                this.nosRecursos[`${x}_${y}`] = {
                    x, y,
                    tipo: 'minerio',
                    recurso: tipoRecurso,
                    nome: tipoRecurso === 'ferroNegro' ? 'Veio de Ferro Negro' : 'Pedreira Ancestral',
                    icone: tipoRecurso === 'ferroNegro' ? '⛰️' : '🪨',
                    quantidade: Math.floor(Math.random() * 5) + 3,
                    recargaAte: 0
                };
            }
        }

        // Nós de Ervas na Floresta
        for (let i = 0; i < 35; i++) {
            const x = Math.floor(Math.random() * 80);
            const y = Math.floor(Math.random() * 80);
            if (this.grid[y][x] === TERRENO.FLORESTA) {
                const randErva = Math.random();
                let erva = 'mandragora';
                if (randErva > 0.85) erva = 'lotusNegro';
                else if (randErva > 0.55) erva = 'florCinzas';
                else if (randErva > 0.25) erva = 'beladona';

                this.nosRecursos[`${x}_${y}`] = {
                    x, y,
                    tipo: 'herbalismo',
                    recurso: erva,
                    nome: `Moita de ${erva.toUpperCase()}`,
                    icone: '🌿',
                    quantidade: Math.floor(Math.random() * 4) + 2,
                    recargaAte: 0
                };
            }
        }
    }

    popularMonstrosIniciais() {
        this.monstros = {};
        const nomesMobs = ['Vulto Voraz', 'Espectro de Cinzas', 'Gárgula Corrompida', 'Predador da Cripta', 'Cão do Inferno', 'Necrófago do Vazio'];
        for (let i = 0; i < 24; i++) {
            const x = Math.floor(Math.random() * 70) + 5;
            const y = Math.floor(Math.random() * 70) + 5;
            // Apenas fora do Santuário
            if (this.grid[y][x] === TERRENO.ERMOS_PVP || this.grid[y][x] === TERRENO.FLORESTA) {
                const id = 'mob_' + crypto.randomBytes(4).toString('hex');
                const nome = nomesMobs[Math.floor(Math.random() * nomesMobs.length)];
                const hp = 300 + Math.floor(Math.random() * 400);
                this.monstros[id] = {
                    id, nome, x, y,
                    hp, hpMax: hp,
                    nivel: Math.floor(Math.random() * 10) + 1,
                    icone: '🦇',
                    dano: 35 + Math.floor(Math.random() * 25)
                };
            }
        }

        // CHEFE MUNDIAL COOPERATIVO: AZAZEL NOS ERMOS DE GEHENNA (62, 62)
        this.worldBoss = {
            id: 'boss_azazel',
            nome: 'Azazel, Arauto do Vazio Abissal',
            icone: '👹',
            x: 62,
            y: 62,
            hp: 15000,
            hpMax: 15000,
            nivel: 30,
            dano: 110,
            ativo: true,
            atacantes: {}
        };
    }

    popularMortais() {
        this.mortais = {};
        const alvosRebanho = Object.values(this.core.rebanho || {});
        const nomesMortais = [
            'Erudito Noturno', 'Mercador Itinerante', 'Aristocrata Desatento',
            'Sacerdotisa Solitária', 'Coveiro Sombrio', 'Guarda da Noite',
            'Viajante da Névoa', 'Alquimista Amador', 'Nobre do Vale', 'Poeta Melancólico'
        ];

        for (let i = 0; i < 16; i++) {
            const id = 'mortal_' + crypto.randomBytes(3).toString('hex');
            // Circulam nos caminhos em torno de Enoch (x: 28 a 52, y: 28 a 52)
            const x = Math.floor(Math.random() * 26) + 27;
            const y = Math.floor(Math.random() * 26) + 27;

            let nome = nomesMortais[i % nomesMortais.length];
            let sangue = 1500;
            let qualidade = 'Sangue Doce';
            let dadosOsint = null;

            if (alvosRebanho[i]) {
                const r = alvosRebanho[i];
                nome = r.identificadorVisivel || r.nomeReal || nome;
                sangue = r.sangueAtual || 2000;
                qualidade = r.qualidade || 'Essência Mapeada';
                dadosOsint = r.dadosOsint || null;
            }

            this.mortais[id] = {
                id,
                nome,
                icone: '🧑‍💼',
                x, y,
                sangueAtual: sangue,
                sangueMax: sangue,
                qualidade,
                dadosOsint,
                statusTexto: 'A caminhar pelas brumas'
            };
        }
    }

    // ==========================================
    // SINCRONIZAÇÃO DE JOGADORES
    // ==========================================
    entrarNoMundo(vampiro) {
        if (!vampiro) return null;
        let x = 40;
        let y = 40; // Centro do Santuário por padrão
        
        if (this.jogadores[vampiro.id]) {
            x = this.jogadores[vampiro.id].x;
            y = this.jogadores[vampiro.id].y;
        }

        const dadosJogador = {
            id: vampiro.id,
            nome: vampiro.nome,
            clan: vampiro.clan || 'Sem Clã',
            clanRole: vampiro.clanRole || 'membro',
            raca: vampiro.raca || 'vampiro',
            nivel: vampiro.nivel || 1,
            hpAtual: vampiro.hpAtual || 1000,
            hpMax: vampiro.hpMax || 1000,
            x, y,
            cor: vampiro.raca === 'lycan' ? '#ff793f' : '#ff3838',
            icone: vampiro.raca === 'lycan' ? '🐺' : '🧛',
            ultimoUpdate: Date.now()
        };

        this.jogadores[vampiro.id] = dadosJogador;
        return {
            jogador: dadosJogador,
            mapa: {
                largura: this.largura,
                altura: this.altura,
                grid: this.grid,
                estruturas: this.estruturas,
                minions: this.minions,
                nosRecursos: this.nosRecursos,
                monstros: this.monstros,
                mortais: this.mortais,
                edificacoesCidade: this.edificacoesCidade,
                jogadores: this.jogadores
            }
        };
    }

    moverJogador(vampiroId, dx, dy) {
        const j = this.jogadores[vampiroId];
        if (!j) return { erro: "Jogador fora do mundo." };

        let nx = j.x + dx;
        let ny = j.y + dy;

        // Limites do Mapa
        if (nx < 1 || ny < 1 || nx >= this.largura - 1 || ny >= this.altura - 1) {
            return { erro: "Atingiste as bordas da criação." };
        }

        // Colisão com Estruturas
        const estrutura = this.obterEstruturaEm(nx, ny);
        if (estrutura) {
            const cfg = ESTRUTURAS_CONFIG[estrutura.tipo];
            if (cfg && cfg.bloqueiaPassagem) {
                if (cfg.bloqueiaPassagem === 'clan' && estrutura.clanId === j.clan) {
                    // Portão de clã aberto para membro
                } else {
                    return { erro: `Caminho bloqueado por [${estrutura.nome}].`, bloqueado: true };
                }
            }
        }

        j.x = nx;
        j.y = ny;
        j.ultimoUpdate = Date.now();

        const zona = this.obterZonaNome(nx, ny);
        return { sucesso: true, x: nx, y: ny, zona, jogador: j };
    }

    obterEstruturaEm(x, y) {
        for (let id in this.estruturas) {
            const e = this.estruturas[id];
            if (e.x === x && e.y === y) return e;
        }
        return null;
    }

    obterZonaNome(x, y) {
        if (x >= 32 && x <= 48 && y >= 32 && y <= 48) return "Santuário de Enoch (Seguro)";
        if (x <= 10 || x >= 70 || (y <= 10 && x >= 50)) return "Cordilheira de Obsidiana (Minas)";
        if (y <= 31 && x < 50) return "Floresta de Espinhos";
        return "Ermos de Gehenna (PvP & Guerra Livre)";
    }

    // ==========================================
    // COMBATE REAL-TIME CONTRA MONSTROS NO MAPA 2D
    // ==========================================
    atacarMonstroMundo(vampiro, monstroId) {
        const mob = this.monstros[monstroId];
        if (!mob) return { erro: "Criatura das trevas já dissipada." };

        const j = this.jogadores[vampiro.id];
        if (j) {
            const dist = Math.hypot(j.x - mob.x, j.y - mob.y);
            if (dist > 2.5) {
                if (dist <= 8) {
                    j.x = mob.x + Math.sign(j.x - mob.x || 1);
                    j.y = mob.y;
                } else {
                    return { erro: "Aproxima-te da criatura para golpear!" };
                }
            }
        }

        const atr = this.core._obterAtributosTotais(vampiro);
        const stats = vampiro.statsCombate || {};

        let danoBase = (stats.danoFisico || 25) + (stats.danoMagico || 15) + (vampiro.nivel * 8) + (atr.vontade || 10);
        const isCrit = Math.random() * 100 < (stats.critico || 5);
        if (isCrit) danoBase = Math.floor(danoBase * 1.8);

        // SINERGIA CO-OP: FLANCO DE MATILHA (+35% DANO SE EM COMITIVA)
        let comitiva = this.core.social ? this.core.social.obterComitivaDoJogador(vampiro.id) : null;
        let isFlanco = false;
        if (comitiva && comitiva.membros.length > 1) {
            isFlanco = true;
            danoBase = Math.floor(danoBase * 1.35);
        }

        mob.hp = Math.max(0, mob.hp - danoBase);

        let curaDreno = 0;
        if (stats.rouboDeVida && stats.rouboDeVida > 0) {
            curaDreno = Math.floor(danoBase * (stats.rouboDeVida / 100));
            vampiro.hpAtual = Math.min(vampiro.hpMax || 1000, (vampiro.hpAtual || 0) + curaDreno);
        }

        let relato = `⚔️ ${isFlanco ? '🐺 [FLANCO DE MATILHA! +35% DANO]: ' : ''}Golpeaste [${mob.nome}] causando ${danoBase} de dano${isCrit ? ' [CRÍTICO!]' : ''}!`;
        let recompensa = null;

        if (mob.hp <= 0) {
            const xpGanho = 40 + (mob.nivel * 15);
            const gtsGanho = 50 + (mob.nivel * 25);
            this.core.ganharXP(vampiro.id, xpGanho);
            vampiro.sangue = (vampiro.sangue || 0) + gtsGanho;

            let itemDrop = null;
            if (Math.random() < 0.35) {
                const GeradorDeItens = require('./GeradorDeItensProcedural');
                itemDrop = GeradorDeItens.gerarItemProcedural(Math.max(1, mob.nivel));
                if (!Array.isArray(vampiro.bolsa)) vampiro.bolsa = [];
                vampiro.bolsa.push(itemDrop);
            }

            recompensa = {
                xp: xpGanho,
                gts: gtsGanho,
                item: itemDrop
            };

            relato += ` 💀 Destruíste o monstro! Ganhaste +${xpGanho} XP e +${gtsGanho} Gts${itemDrop ? ` e despojou [${itemDrop.nome}] (${itemDrop.raridade})!` : '!'}`;
            delete this.monstros[monstroId];

            // Respawn de monstro após delay
            setTimeout(() => {
                this.popularMonstrosIniciais();
            }, 45000);
        } else {
            const danoMob = Math.max(5, (mob.dano || 25) - Math.floor((stats.armadura || 0) * 0.5));
            vampiro.hpAtual = Math.max(1, (vampiro.hpAtual || 100) - danoMob);
            relato += ` A criatura revidou com ${danoMob} de dano.`;
        }

        this.core._salvarBancoDeDados();
        return {
            sucesso: true,
            relato,
            danoCausado: danoBase,
            isCrit,
            curaDreno,
            mobHp: mob ? mob.hp : 0,
            mobMorto: mob ? mob.hp <= 0 : true,
            recompensa,
            hpAtual: vampiro.hpAtual,
            sangueTotal: vampiro.sangue
        };
    }

    // ==========================================
    // DRENO E MORDIDA VISCERAL DE MORTAIS NO MAPA 2D
    // ==========================================
    morderMortalMundo(vampiro, mortalId) {
        const m = this.mortais[mortalId];
        if (!m) return { erro: "Mortal não encontrado ou já drenado." };

        const j = this.jogadores[vampiro.id];
        if (j) {
            const dist = Math.hypot(j.x - m.x, j.y - m.y);
            if (dist > 2.5) {
                j.x = m.x + Math.sign(j.x - m.x || 1);
                j.y = m.y;
            }
        }

        const qtdDrenada = Math.min(m.sangueAtual, Math.floor(250 + (vampiro.nivel * 25) + Math.random() * 150));
        m.sangueAtual -= qtdDrenada;
        vampiro.sangue = (vampiro.sangue || 0) + qtdDrenada;
        vampiro.hpAtual = Math.min(vampiro.hpMax || 1000, (vampiro.hpAtual || 0) + Math.floor(qtdDrenada * 0.4));
        if (!vampiro.estatisticas) vampiro.estatisticas = {};
        vampiro.estatisticas.totalDrenado = (vampiro.estatisticas.totalDrenado || 0) + qtdDrenada;

        // DRENO COOPERATIVO DE COMITIVA (BANQUETE DA MATILHA)
        let relatoCoop = "";
        if (this.core.social) {
            const partilhado = this.core.social.distribuirDrenoCoop(vampiro.id, qtdDrenada);
            if (partilhado > 0) {
                relatoCoop = ` 🐺 [BANQUETE DA MATILHA]: Partilhaste +${partilhado} Gts com os aliados feridos da tua comitiva!`;
            }
        }

        let morto = false;
        let relatoMorte = "";
        if (m.sangueAtual <= 0) {
            morto = true;
            vampiro.estatisticas.mortaisSecos = (vampiro.estatisticas.mortaisSecos || 0) + 1;
            if (!vampiro.inventario) vampiro.inventario = {};
            vampiro.inventario.anima = (vampiro.inventario.anima || 0) + 1;
            vampiro.inventario.cinzas = (vampiro.inventario.cinzas || 0) + 2;
            relatoMorte = ` Secaste o mortal até aos ossos! Extraíste +1 Anima e +2 Cinzas.`;
            delete this.mortais[mortalId];

            setTimeout(() => {
                this.popularMortais();
            }, 60000);
        } else {
            m.statusTexto = `Aterrorizado! Sangue restante: ${m.sangueAtual}`;
        }

        this.core._salvarBancoDeDados();
        return {
            sucesso: true,
            relato: `🩸 [MORDIDA VISCERAL]: Cravaste as presas em [${m.nome}] e drenaste ${qtdDrenada} Gts de Vitae!${relatoCoop}${relatoMorte}`,
            sangueDrenado: qtdDrenada,
            hpAtual: vampiro.hpAtual,
            sangueTotal: vampiro.sangue,
            mortal: m,
            morto
        };
    }

    // ==========================================
    // COMBATE COOPERATIVO: CHEFE MUNDIAL AZAZEL
    // ==========================================
    atacarWorldBoss(vampiro) {
        if (!this.worldBoss || !this.worldBoss.ativo) {
            return { erro: "O Titã Abissal Azazel está dissipado no Umbral no momento." };
        }

        const j = this.jogadores[vampiro.id];
        if (j) {
            const dist = Math.hypot(j.x - this.worldBoss.x, j.y - this.worldBoss.y);
            if (dist > 3) {
                if (dist <= 12) {
                    j.x = this.worldBoss.x + Math.sign(j.x - this.worldBoss.x || 1);
                    j.y = this.worldBoss.y;
                } else {
                    // Portal de Incursão da Comitiva transporta para a borda da arena (60, 60)
                    j.x = 60;
                    j.y = 60;
                }
            }
        }

        const stats = vampiro.statsCombate || {};
        let dano = (stats.danoFisico || 25) + (stats.danoMagico || 15) + (vampiro.nivel * 12);
        
        let comitiva = this.core.social ? this.core.social.obterComitivaDoJogador(vampiro.id) : null;
        let isFlanco = false;
        if (comitiva && comitiva.membros.length > 1) {
            isFlanco = true;
            dano = Math.floor(dano * 1.4); // +40% de bônus cooperativo
        }

        this.worldBoss.hp = Math.max(0, this.worldBoss.hp - dano);
        this.worldBoss.atacantes[vampiro.id] = (this.worldBoss.atacantes[vampiro.id] || 0) + dano;

        let relato = `⚔️ ${isFlanco ? '🐺 [ATAQUE DA MATILHA]: ' : ''}Desferiste golpe cósmico em Azazel causando ${dano} de dano!`;
        let bossMorto = false;

        if (this.worldBoss.hp <= 0) {
            this.worldBoss.ativo = false;
            bossMorto = true;
            relato += ` 💥 O TITÃ AZAZEL CAIU ANTE A UNIÃO DOS VAMPIROS!`;

            for (const atkVampId in this.worldBoss.atacantes) {
                const atkVamp = this.core.vampiros[atkVampId];
                if (atkVamp) {
                    this.core.ganharXP(atkVamp.id, 1500);
                    atkVamp.sangue = (atkVamp.sangue || 0) + 2000;
                    try {
                        const GeradorDeItens = require('./GeradorDeItensProcedural');
                        const dropRaid = GeradorDeItens.gerarItemProcedural(15);
                        if (!Array.isArray(atkVamp.bolsa)) atkVamp.bolsa = [];
                        atkVamp.bolsa.push(dropRaid);
                    } catch(e) {}
                    if (!atkVamp.titulos.includes('Flagelo de Azazel')) {
                        atkVamp.titulos.push('Flagelo de Azazel');
                    }
                }
            }

            this.core._registrarEventoEspecial('global', '💀 QUEDA DO TITÃ AZAZEL', 
                `[${vampiro.nome}] e a aliança de caçadores derrubaram Azazel nos Ermos de Gehenna! O espólio ancestral foi conquistado!`, true);

            setTimeout(() => {
                if (this.worldBoss) {
                    this.worldBoss.hp = this.worldBoss.hpMax;
                    this.worldBoss.ativo = true;
                    this.worldBoss.atacantes = {};
                }
            }, 600000);
        } else {
            const contra = Math.max(10, this.worldBoss.dano - Math.floor((stats.armadura || 0) * 0.4));
            vampiro.hpAtual = Math.max(1, (vampiro.hpAtual || 100) - contra);
            relato += ` Azazel revidou com baforada infernal causando ${contra} de dano!`;
        }

        this.core._salvarBancoDeDados();
        return {
            sucesso: true,
            relato,
            danoCausado: dano,
            bossHp: this.worldBoss.hp,
            bossHpMax: this.worldBoss.hpMax,
            bossMorto,
            hpAtual: vampiro.hpAtual,
            sangueTotal: vampiro.sangue
        };
    }

    // ==========================================
    // DISPARO DE PODERES AKÁSHICOS EM ÁREA NO 2D
    // ==========================================
    usarPoderAreaMundo(vampiro, habilidadeId, targetX, targetY) {
        const hab = (vampiro.habilidadesAtivas || []).find(h => h.id === habilidadeId) ||
                    (vampiro.colecaoHabilidades || []).find(h => h.id === habilidadeId);
        if (!hab) return { erro: "Poder akáshico não equipado." };

        const custoFuria = Number(hab.custoFuria) || 2;
        const custoSangue = Number(hab.custoGts) || 50;

        if (vampiro.pontosAcao < custoFuria) return { erro: `Fúria insuficiente (${custoFuria} necessária).` };
        if (vampiro.sangue < custoSangue) return { erro: `Vitae insuficiente (${custoSangue} Gts necessários).` };

        vampiro.pontosAcao -= custoFuria;
        vampiro.sangue -= custoSangue;

        const atr = this.core._obterAtributosTotais(vampiro);
        const danoExplosao = Math.floor((atr.gnose * 20) + (vampiro.nivel * 30));

        let mobsAtingidos = 0;
        for (let mId in this.monstros) {
            const m = this.monstros[mId];
            const dist = Math.hypot(m.x - targetX, m.y - targetY);
            if (dist <= 3.5) {
                m.hp -= danoExplosao;
                mobsAtingidos++;
                if (m.hp <= 0) delete this.monstros[mId];
            }
        }

        this.core._salvarBancoDeDados();
        return {
            sucesso: true,
            relato: `🌀 [${hab.nome}]: Onda akáshica detonada em (${targetX}, ${targetY}) causando ${danoExplosao} de dano (${mobsAtingidos} alvos atingidos)!`,
            dano: danoExplosao,
            mobsAtingidos,
            targetX, targetY,
            furiaRestante: vampiro.pontosAcao,
            sangueRestante: vampiro.sangue
        };
    }

    // ==========================================
    // SANDBOX: CONSTRUÇÃO E DEMOLIÇÃO DE BASES DE CLÃ
    // ==========================================
    construirEstrutura(vampiro, tipoEstrutura, x, y) {
        const cfg = ESTRUTURAS_CONFIG[tipoEstrutura];
        if (!cfg) return { erro: "Arquitetura desconhecida nos anais sombrios." };

        if (x < 2 || y < 2 || x >= this.largura - 2 || y >= this.altura - 2) {
            return { erro: "Fora dos limites da criação." };
        }

        if (x >= 32 && x <= 48 && y >= 32 && y <= 48) {
            return { erro: "O Santuário de Enoch é solo sagrado neutro e intocável." };
        }

        if (this.obterEstruturaEm(x, y)) {
            return { erro: "Já existe uma estrutura sólida nesta coordenada." };
        }

        const clanId = (vampiro.clan && vampiro.clan !== 'Sangue Ralo') ? vampiro.clan : ('Dominio_' + vampiro.id);

        if (cfg.custo.materiais) {
            for (let mat in cfg.custo.materiais) {
                const req = cfg.custo.materiais[mat];
                if ((vampiro.materiais?.[mat] || 0) < req) {
                    return { erro: `Material insuficiente: ${mat} (${req} necessários).` };
                }
            }
        }
        if (cfg.custo.inventario) {
            for (let inv in cfg.custo.inventario) {
                const req = cfg.custo.inventario[inv];
                if ((vampiro.inventario?.[inv] || 0) < req) {
                    return { erro: `Recurso insuficiente: ${inv} (${req} necessários).` };
                }
            }
        }

        if (cfg.custo.materiais) {
            for (let mat in cfg.custo.materiais) {
                vampiro.materiais[mat] -= cfg.custo.materiais[mat];
            }
        }
        if (cfg.custo.inventario) {
            for (let inv in cfg.custo.inventario) {
                vampiro.inventario[inv] -= cfg.custo.inventario[inv];
            }
        }

        const id = 'est_' + crypto.randomBytes(5).toString('hex');
        const novaEstrutura = {
            id,
            tipo: tipoEstrutura,
            nome: cfg.nome,
            icone: cfg.icone,
            x, y,
            clanId,
            clanNome: clanId,
            donoId: vampiro.id,
            donoNome: vampiro.nome,
            hp: cfg.hpMax,
            hpMax: cfg.hpMax,
            nivel: 1,
            dataConstrucao: new Date().toISOString()
        };

        this.estruturas[id] = novaEstrutura;

        if (tipoEstrutura === 'altar_egregora' && this.core.clans[clanId]) {
            this.core.clans[clanId].pontos = (this.core.clans[clanId].pontos || 0) + 100;
        }

        this.core._salvarBancoDeDados();
        return {
            sucesso: true,
            relato: `🏰 [EDIFICAÇÃO DE CLÃ]: ${vampiro.nome} ergueu [${cfg.nome}] em (${x}, ${y})!`,
            estrutura: novaEstrutura,
            materiais: vampiro.materiais
        };
    }

    demolirEstrutura(vampiro, estruturaId) {
        const e = this.estruturas[estruturaId];
        if (!e) return { erro: "Estrutura não encontrada." };

        if (e.donoId !== vampiro.id && e.clanId !== vampiro.clan && vampiro.clanRole !== 'lider') {
            return { erro: "Apenas o proprietário, líderes ou membros do clã proprietário podem demolir." };
        }

        delete this.estruturas[estruturaId];
        this.core._salvarBancoDeDados();
        return { sucesso: true, relato: `A estrutura [${e.nome}] foi desmantelada.` };
    }

    // ==========================================
    // REINO: SERVOS & MINIONS AUTÔNOMOS NO MAPA 2D
    // ==========================================
    recrutarMinionMundo(vampiro, tipo = 'mineiro') {
        if (!vampiro) return { erro: "Mestre inexistente." };
        const custoGts = 300;
        if (vampiro.sangue < custoGts) {
            return { erro: `Exige ${custoGts} Gts de Sangue para animar um Servo no plano terreno.` };
        }

        const icones = {
            mineiro: '⛏️',
            guardiao: '🛡️',
            herbalista: '🌿',
            cultista: '🕯️'
        };

        const nomes = {
            mineiro: 'Autômato Minerador',
            guardiao: 'Guardião de Ferro',
            herbalista: 'Servo Herbalista',
            cultista: 'Cultista das Sombras'
        };

        vampiro.sangue -= custoGts;
        const id = 'minion_' + crypto.randomBytes(4).toString('hex');
        
        const x = Math.min(this.largura - 2, Math.max(2, (this.jogadores[vampiro.id]?.x || 40) + (Math.floor(Math.random() * 3) - 1)));
        const y = Math.min(this.altura - 2, Math.max(2, (this.jogadores[vampiro.id]?.y || 40) + (Math.floor(Math.random() * 3) - 1)));

        const minion = {
            id,
            nome: `${nomes[tipo]} de ${vampiro.nome}`,
            tipo,
            icone: icones[tipo] || '🤖',
            donoId: vampiro.id,
            donoNome: vampiro.nome,
            clanId: vampiro.clan || 'Sem Clã',
            x, y,
            hp: 400,
            hpMax: 400,
            tarefa: 'idle',
            targetX: x,
            targetY: y,
            coletado: 0,
            statusTexto: 'À espera de ordens do Lorde'
        };

        this.minions[id] = minion;
        this.core._salvarBancoDeDados();

        return {
            sucesso: true,
            relato: `⚡ [DESPERTAR DE SERVO]: ${minion.nome} materializou-se no plano 2D em (${x}, ${y})!`,
            minion
        };
    }

    ordenarMinion(vampiro, minionId, tarefa, targetX = null, targetY = null) {
        const m = this.minions[minionId];
        if (!m) return { erro: "Minion não encontrado." };
        if (m.donoId !== vampiro.id && m.clanId !== vampiro.clan) {
            return { erro: "Não tens autoridade sobre este servo." };
        }

        m.tarefa = tarefa;
        if (targetX !== null && targetY !== null) {
            m.targetX = targetX;
            m.targetY = targetY;
        }

        const descTarefas = {
            minerar: 'A caminho de lavrar veios de minério',
            guardar: 'Em patrulha defensiva no perímetro',
            colher: 'A colher ervas na floresta de espinhos',
            seguir: `A seguir o Mestre [${vampiro.nome}]`,
            idle: 'A aguardar comandos'
        };

        m.statusTexto = descTarefas[tarefa] || 'Em execução';
        return { sucesso: true, relato: `Comando enviado: ${m.nome} está [${m.statusTexto}].`, minion: m };
    }

    // ==========================================
    // COLETA DIRETA EM NÓS DO MAPA 2D
    // ==========================================
    coletarNoMundo(vampiro, x, y) {
        const chave = `${x}_${y}`;
        const no = this.nosRecursos[chave];
        if (!no) return { erro: "Nenhum recurso natural nesta coordenada." };

        const j = this.jogadores[vampiro.id];
        if (j) {
            const dist = Math.hypot(j.x - x, j.y - y);
            if (dist > 2.5) return { erro: "Precisas aproximar-te do nó para colher." };
        }

        if (no.quantidade <= 0 && Date.now() < no.recargaAte) {
            return { erro: "Este veio está esgotado no momento. As veias da terra estão a regenerar." };
        }

        const qtdColetada = Math.floor(Math.random() * 2) + 1;
        no.quantidade = Math.max(0, no.quantidade - qtdColetada);
        if (no.quantidade <= 0) {
            no.recargaAte = Date.now() + 60000;
        }

        this.core.garantirOficios(vampiro);
        vampiro.materiais[no.recurso] = (vampiro.materiais[no.recurso] || 0) + qtdColetada;

        const prof = no.tipo === 'minerio' ? 'geomancia' : 'herbologia';
        this.core._ganharXpOficio(vampiro, prof, 25);

        this.core._salvarBancoDeDados();
        return {
            sucesso: true,
            relato: `✨ [COLETA DO MUNDO 2D]: Extraíste ${qtdColetada}x [${no.recurso.toUpperCase()}] do nó em (${x}, ${y})!`,
            materiais: vampiro.materiais,
            no
        };
    }

    // ==========================================
    // TICK EM TEMPO REAL: SIMULAÇÃO VIVA DO MUNDO
    // ==========================================
    tickMundo() {
        const agora = Date.now();
        this.ultimoTick = agora;

        // 1. Minions autônomos
        for (let id in this.minions) {
            const m = this.minions[id];
            if (m.hp <= 0) continue;

            if (m.tarefa === 'minerar') {
                let maisProximo = null;
                let menorDist = 999;
                for (let k in this.nosRecursos) {
                    const no = this.nosRecursos[k];
                    if (no.tipo === 'minerio' && (no.quantidade > 0 || Date.now() > no.recargaAte)) {
                        const d = Math.hypot(no.x - m.x, no.y - m.y);
                        if (d < menorDist) { menorDist = d; maisProximo = no; }
                    }
                }

                if (maisProximo) {
                    if (menorDist <= 1.5) {
                        m.statusTexto = `⛏️ A minerar [${maisProximo.recurso}]...`;
                        m.coletado += 1;
                        if (m.coletado >= 3) {
                            const dono = this.core.vampiros[m.donoId];
                            if (dono) {
                                this.core.garantirOficios(dono);
                                dono.materiais[maisProximo.recurso] = (dono.materiais[maisProximo.recurso] || 0) + 1;
                                m.statusTexto = `📦 Entregou 1x ${maisProximo.recurso} a ${m.donoNome}!`;
                            }
                            m.coletado = 0;
                        }
                    } else {
                        m.x += Math.sign(maisProximo.x - m.x);
                        m.y += Math.sign(maisProximo.y - m.y);
                        m.statusTexto = `A caminhar para mina (${maisProximo.x}, ${maisProximo.y})`;
                    }
                }
            } else if (m.tarefa === 'guardar') {
                m.statusTexto = `⚔️ Em patrulha defensiva!`;
                if (Math.random() > 0.6) {
                    const rX = Math.floor(Math.random() * 3) - 1;
                    const rY = Math.floor(Math.random() * 3) - 1;
                    m.x = Math.max(2, Math.min(this.largura - 2, m.x + rX));
                    m.y = Math.max(2, Math.min(this.altura - 2, m.y + rY));
                }
            } else if (m.tarefa === 'seguir') {
                const j = this.jogadores[m.donoId];
                if (j) {
                    const d = Math.hypot(j.x - m.x, j.y - m.y);
                    if (d > 2) {
                        m.x += Math.sign(j.x - m.x);
                        m.y += Math.sign(j.y - m.y);
                        m.statusTexto = `A seguir ${m.donoNome}`;
                    } else {
                        m.statusTexto = `Ao lado do Lorde`;
                    }
                }
            }
        }

        // 2. Balistas disparando em monstros
        for (let eId in this.estruturas) {
            const e = this.estruturas[eId];
            if (e.tipo === 'torre_balista') {
                for (let mId in this.monstros) {
                    const mob = this.monstros[mId];
                    const dist = Math.hypot(mob.x - e.x, mob.y - e.y);
                    if (dist <= 5) {
                        mob.hp -= 80;
                        if (mob.hp <= 0) delete this.monstros[mId];
                        break;
                    }
                }
            }
        }

        // 3. Regeneração de nós de recursos esgotados
        for (let k in this.nosRecursos) {
            const no = this.nosRecursos[k];
            if (no.quantidade <= 0 && agora >= no.recargaAte) {
                no.quantidade = Math.floor(Math.random() * 4) + 3;
            }
        }

        if (global.io) {
            global.io.emit('world2d_delta', {
                jogadores: this.jogadores,
                minions: this.minions,
                estruturas: this.estruturas,
                monstros: this.monstros,
                mortais: this.mortais
            });
        }
    }

    salvarEstado() {
        return {
            estruturas: this.estruturas,
            minions: this.minions,
            nosRecursos: this.nosRecursos,
            monstros: this.monstros,
            mortais: this.mortais
        };
    }

    carregarEstado(doc) {
        if (!doc) return;
        if (doc.estruturas) this.estruturas = doc.estruturas;
        if (doc.minions) this.minions = doc.minions;
        if (doc.nosRecursos) this.nosRecursos = doc.nosRecursos;
        if (doc.monstros && Object.keys(doc.monstros).length > 0) this.monstros = doc.monstros;
        if (doc.mortais && Object.keys(doc.mortais).length > 0) {
            this.mortais = doc.mortais;
            for (const k of Object.keys(this.mortais)) {
                const m = this.mortais[k];
                if (m && (m.nome?.toLowerCase().includes('tesla') || m.dadosOsint?.nomeAstral?.toLowerCase().includes('tesla'))) {
                    delete this.mortais[k];
                }
            }
        }
    }
}

module.exports = MundoAberto2D;
