// CombatEngine.js - Rework de IA de Inimigos, Postura, Stagger e Combate Visceral (PvE, PvP, Raids)
const crypto = require('crypto');

// ============================================================================
// 1. ARQUÉTIPOS E COMPORTAMENTOS DE IA
// ============================================================================
const ARQUETIPOS_IA = {
    MORTAL: 'mortal',               // Aldeões, caçadores amadores, bandidos do umbral
    INQUISIDOR: 'inquisidor',       // Inquisição Solar, caçadores santos, paladinos
    PREDADOR_PVP: 'predador_pvp',   // Vampiros rivais, assassinos sombrios, duelistas
    GOETIA_BOSS: 'goetia_boss',     // Demônios da Goetia, Reis do Abismo, Fendas
    AZAZEL_RAID: 'azazel_raid'      // World Bosses de Raid Co-op (Azazel, Tiamat)
};

class CombatEngine {
    constructor(shadowCore) {
        this.core = shadowCore;
    }

    /**
     * Inicializa ou normaliza o estado de combate de uma entidade inimiga
     */
    inicializarEntidadeCombate(mob, tipoCombate = 'pve', nivelJogador = 1) {
        if (!mob) return null;

        // Determina arquétipo
        let arquetipo = ARQUETIPOS_IA.MORTAL;
        const nomeLower = (mob.nome || mob.tipo || '').toLowerCase();

        if (tipoCombate === 'goetia' || nomeLower.includes('goetia') || nomeLower.includes('rei bael') || nomeLower.includes('demonio')) {
            arquetipo = ARQUETIPOS_IA.GOETIA_BOSS;
        } else if (tipoCombate === 'cerco' || nomeLower.includes('azazel') || (mob.hpMax && mob.hpMax >= 30000)) {
            arquetipo = ARQUETIPOS_IA.AZAZEL_RAID;
        } else if (tipoCombate === 'pvp' || tipoCombate === 'dungeon_pvp') {
            arquetipo = ARQUETIPOS_IA.PREDADOR_PVP;
        } else if (nomeLower.includes('inquisidor') || nomeLower.includes('santo') || nomeLower.includes('paladino')) {
            arquetipo = ARQUETIPOS_IA.INQUISIDOR;
        } else if (mob.rank && (mob.rank.includes('Pesadelo') || mob.rank.includes('Lendário') || mob.rank.includes('Elite'))) {
            arquetipo = ARQUETIPOS_IA.GOETIA_BOSS;
        }

        // Postura calculada com base na vida e nível
        const posturaBase = arquetipo === ARQUETIPOS_IA.AZAZEL_RAID ? 400 :
                            arquetipo === ARQUETIPOS_IA.GOETIA_BOSS ? 250 :
                            arquetipo === ARQUETIPOS_IA.INQUISIDOR ? 180 :
                            arquetipo === ARQUETIPOS_IA.PREDADOR_PVP ? 150 : 100;

        if (mob.posturaMax === undefined) mob.posturaMax = posturaBase;
        if (mob.posturaAtual === undefined) mob.posturaAtual = mob.posturaMax;
        if (mob.vulneravelVisceral === undefined) mob.vulneravelVisceral = false;
        if (mob.turnosVulneravel === undefined) mob.turnosVulneravel = 0;
        if (mob.arquetipo === undefined) mob.arquetipo = arquetipo;
        if (mob.faseAtual === undefined) mob.faseAtual = 1;
        if (mob.canalizandoApocalipse === undefined) mob.canalizandoApocalipse = 0;
        if (mob.buffs === undefined) mob.buffs = {};

        return mob;
    }

    /**
     * Executa a IA do Inimigo no turno de combate
     */
    decidirAcaoInimigo(mob, jogador) {
        const hpPct = (mob.hpAtual / (mob.hpMax || 1)) * 100;
        const acao = {
            tipo: 'ataque',
            nomeAcao: 'Ataque Básico',
            dano: Math.floor((mob.hpMax * 0.05) + (jogador.nivel * 15)),
            posturaDanoAoJogador: 15,
            efeitoEspecial: null,
            narrativa: '',
            cinematica: 'strike_normal'
        };

        // Se o mob está atordoado / Staggered
        if (mob.vulneravelVisceral) {
            mob.turnosVulneravel--;
            if (mob.turnosVulneravel <= 0) {
                mob.vulneravelVisceral = false;
                mob.posturaAtual = Math.floor(mob.posturaMax * 0.6); // Recupera 60% da postura
                return {
                    tipo: 'recuperacao',
                    nomeAcao: 'Recuperação de Postura',
                    dano: 0,
                    posturaDanoAoJogador: 0,
                    narrativa: `[${mob.nome}] rugiu de cólera e recompôs a sua postura quebrando o atordoamento!`,
                    cinematica: 'posture_reset'
                };
            }
            return {
                tipo: 'atordoado',
                nomeAcao: 'Desorientado',
                dano: 0,
                posturaDanoAoJogador: 0,
                narrativa: `⚠️ [${mob.nome}] está desorientado de joelhos! POSTURA QUEBRADA! Uma oportunidade de Golpe Visceral abre-se!`,
                cinematica: 'staggered'
            };
        }

        // Recuperação natural de postura quando não está vulnerável
        if (mob.posturaAtual < mob.posturaMax) {
            mob.posturaAtual = Math.min(mob.posturaMax, mob.posturaAtual + 5);
        }

        switch (mob.arquetipo) {
            // ----------------------------------------------------------------
            // 1. MORTAL (Hesitação, Ataques Desesperados, Pânico)
            // ----------------------------------------------------------------
            case ARQUETIPOS_IA.MORTAL:
                if (hpPct < 25) {
                    // PÂNICO E FUGA
                    acao.tipo = 'panico';
                    acao.nomeAcao = 'Pânico Cego';
                    acao.dano = Math.floor(acao.dano * 0.3);
                    acao.narrativa = `😱 [${mob.nome}] treme de horror ante a sede de sangue, cambaleando em pânico cego!`;
                    acao.cinematica = 'panic_whiff';
                } else if (hpPct < 60 && Math.random() < 0.4) {
                    // HESITAÇÃO
                    acao.tipo = 'hesitacao';
                    acao.nomeAcao = 'Hesitação Aterrorizada';
                    acao.dano = 0;
                    acao.narrativa = `[${mob.nome}] hesita ao ver teus olhos brilharem na penumbra, recuando dois passos trêmulos.`;
                    acao.cinematica = 'hesitate';
                } else {
                    // GOLPE DE CORTE
                    acao.nomeAcao = 'Estocada Trêmula';
                    acao.dano = Math.max(10, Math.floor(acao.dano * 0.9));
                    acao.narrativa = `[${mob.nome}] investe desesperadamente com lâmina cega!`;
                }
                break;

            // ----------------------------------------------------------------
            // 2. INQUISIDOR SOLAR (Escudo Sagrado, Queimadura Solar, Contra-Golpe)
            // ----------------------------------------------------------------
            case ARQUETIPOS_IA.INQUISIDOR:
                const rollInq = Math.random();
                if (rollInq < 0.30) {
                    // ESCUDO SAGRADO
                    mob.buffs.escudoSagrado = true;
                    acao.tipo = 'defesa';
                    acao.nomeAcao = 'Escudo de Fé Solar';
                    acao.dano = 0;
                    acao.efeitoEspecial = 'escudo_sagrado';
                    acao.narrativa = `☀️ [${mob.nome}] ergue o Brasão Solar! Um brilho incandescente repele magias e reflete dano profano!`;
                    acao.cinematica = 'holy_shield';
                } else if (rollInq < 0.65) {
                    // QUEIMADURA SOLAR
                    acao.tipo = 'magia';
                    acao.nomeAcao = 'Chamas da Punição Solar';
                    acao.dano = Math.floor(acao.dano * 1.3);
                    acao.posturaDanoAoJogador = 25;
                    acao.efeitoEspecial = 'queimadura_solar';
                    acao.narrativa = `🔥 [${mob.nome}] conjura o fogo celestial! A vitae nas tuas veias borbulha e queima!`;
                    acao.cinematica = 'solar_burn';
                } else {
                    // GOLPE DO JUSTICIEIRO
                    acao.nomeAcao = 'Golpe do Martelo Justo';
                    acao.dano = Math.floor(acao.dano * 1.1);
                    acao.posturaDanoAoJogador = 20;
                    acao.narrativa = `[${mob.nome}] desfere um martelo sagrado sobre tua defesa vampírica!`;
                }
                break;

            // ----------------------------------------------------------------
            // 3. PREDADOR PVP (Fintas, Esquiva Sombria, Chute Silenciador)
            // ----------------------------------------------------------------
            case ARQUETIPOS_IA.PREDADOR_PVP:
                const rollPvp = Math.random();
                if (rollPvp < 0.28) {
                    // FINTA UMBRAL
                    acao.tipo = 'finta';
                    acao.nomeAcao = 'Finta Umbral';
                    acao.dano = Math.floor(acao.dano * 0.7);
                    acao.posturaDanoAoJogador = 35;
                    acao.narrativa = `⚡ [${mob.nome}] projeta uma ilusão de sombra e golpeia teu flanco, abalando a tua postura!`;
                    acao.cinematica = 'feint_shadow';
                } else if (rollPvp < 0.55) {
                    // CHUTE SILENCIADOR
                    acao.tipo = 'silencio';
                    acao.nomeAcao = 'Ruptura Silenciadora';
                    acao.dano = Math.floor(acao.dano * 1.2);
                    acao.efeitoEspecial = 'silencio_arcano';
                    acao.narrativa = `🩸 [${mob.nome}] avança como um raio e golpeia tua garganta, silenciando teus encantamentos arcanos!`;
                    acao.cinematica = 'silence_kick';
                } else {
                    // GOLPE DE PREDADOR
                    acao.nomeAcao = 'Presas da Noite';
                    acao.dano = Math.floor(acao.dano * 1.3);
                    acao.posturaDanoAoJogador = 20;
                    acao.narrativa = `[${mob.nome}] estilhaça o ar com garras afiadas embebidas em veneno umbral!`;
                }
                break;

            // ----------------------------------------------------------------
            // 4. GOETIA BOSS (3 Fases: Espreita -> Frenesi Abissal -> Apocalipse)
            // ----------------------------------------------------------------
            case ARQUETIPOS_IA.GOETIA_BOSS:
                // Atualização de Fase
                if (hpPct <= 20) {
                    mob.faseAtual = 3;
                } else if (hpPct <= 55) {
                    mob.faseAtual = 2;
                } else {
                    mob.faseAtual = 1;
                }

                if (mob.faseAtual === 3) {
                    // FASE 3: CANALIZAÇÃO DO APOCALIPSE
                    if (mob.canalizandoApocalipse > 0) {
                        mob.canalizandoApocalipse--;
                        if (mob.canalizandoApocalipse === 0) {
                            // DISPARO DO CATACLISMO
                            acao.tipo = 'cataclismo';
                            acao.nomeAcao = 'EXPLOSÃO DA QLIPHOTH';
                            acao.dano = Math.floor(jogador.hpMax * 0.75);
                            acao.posturaDanoAoJogador = 80;
                            acao.narrativa = `☠️ CATACLISMO! [${mob.nome}] colapsou o espaço-tempo numa supernova de trevas absolutas! O dano é colossal!`;
                            acao.cinematica = 'cataclysm_burst';
                        } else {
                            acao.tipo = 'canalizando';
                            acao.nomeAcao = 'Vórtice do Fim dos Tempos';
                            acao.dano = Math.floor(acao.dano * 0.4);
                            acao.narrativa = `⚠️ O ABISMO RESPONDE! [${mob.nome}] está a canalizar o Vórtice Final! QUEBRE A POSTURA DELE AGORA ANTES DO COLAPSO!`;
                            acao.cinematica = 'channeling_doom';
                        }
                    } else if (Math.random() < 0.4) {
                        mob.canalizandoApocalipse = 2; // 2 turnos para interromper
                        acao.tipo = 'iniciar_canalizacao';
                        acao.nomeAcao = 'Rito do Fim dos Tempos';
                        acao.dano = 0;
                        acao.narrativa = `🔮 [${mob.nome}] ascende em chamas negras e começa a entoar a FÓRMULA DO CATACLISMO! Ataque com tudo para quebrar sua postura!`;
                        acao.cinematica = 'start_channel';
                    } else {
                        acao.nomeAcao = 'Garras Despedaçadoras';
                        acao.dano = Math.floor(acao.dano * 1.6);
                        acao.posturaDanoAoJogador = 30;
                        acao.narrativa = `[${mob.nome}] ruge com fúria abissal, rasgando a carne com fúria cega!`;
                        acao.cinematica = 'frenzy_claw';
                    }
                } else if (mob.faseAtual === 2) {
                    // FASE 2: FRENESI ABISSAL
                    const rollFrenesi = Math.random();
                    if (rollFrenesi < 0.45) {
                        acao.tipo = 'combo';
                        acao.nomeAcao = 'Garras da Qliphoth Duplas';
                        acao.dano = Math.floor(acao.dano * 1.4);
                        acao.posturaDanoAoJogador = 35;
                        acao.narrativa = `⚡ FRENESI! [${mob.nome}] ataca em rotação voraz, desferindo múltiplos golpes profundos!`;
                        acao.cinematica = 'double_strike';
                    } else {
                        acao.nomeAcao = 'Rugido Desolador';
                        acao.dano = Math.floor(acao.dano * 1.1);
                        acao.posturaDanoAoJogador = 25;
                        acao.narrativa = `[${mob.nome}] solta um rugido de gelar a alma que ecoa pelas paredes do templo ancestral!`;
                    }
                } else {
                    // FASE 1: ESPREITA E DRENO
                    const rollEspreita = Math.random();
                    if (rollEspreita < 0.35) {
                        acao.tipo = 'dreno';
                        acao.nomeAcao = 'Tentáculos Sugadores de Vitae';
                        acao.dano = Math.floor(acao.dano * 0.9);
                        mob.hpAtual = Math.min(mob.hpMax, mob.hpAtual + Math.floor(acao.dano * 0.6));
                        acao.narrativa = `👁️ [${mob.nome}] manifesta gavinhas de sombra que perfuram teu peito e drenam a tua vitae (+${Math.floor(acao.dano * 0.6)} HP)!`;
                        acao.cinematica = 'tendril_drain';
                    } else {
                        acao.nomeAcao = 'Golpe Sombrio';
                        acao.dano = Math.floor(acao.dano * 1.0);
                        acao.narrativa = `[${mob.nome}] golpeia com o peso da matéria primordial do Umbral!`;
                    }
                }
                break;

            // ----------------------------------------------------------------
            // 5. AZAZEL WORLD BOSS / RAID CO-OP
            // ----------------------------------------------------------------
            case ARQUETIPOS_IA.AZAZEL_RAID:
                const rollRaid = Math.random();
                if (rollRaid < 0.30) {
                    // ONDA SÍSMICA EM ÁREA
                    acao.tipo = 'area';
                    acao.nomeAcao = 'Onda Sísmica da Danação';
                    acao.dano = Math.floor(acao.dano * 1.5);
                    acao.posturaDanoAoJogador = 40;
                    acao.narrativa = `🌋 AZAZEL esmaga os punhos no solo! Uma fenda titânica explode sob teus pés em choque sísmico!`;
                    acao.cinematica = 'earthquake_slam';
                } else if (rollRaid < 0.60) {
                    // SELO DA CONDENAÇÃO
                    acao.tipo = 'selo';
                    acao.nomeAcao = 'Selo de Condenação Abissal';
                    acao.dano = Math.floor(acao.dano * 0.8);
                    acao.efeitoEspecial = 'selo_condenacao';
                    acao.narrativa = `👁️ AZAZEL marca a tua fronte com o Glifo da Condenação! O ar ao teu redor pesa como chumbo derretido!`;
                    acao.cinematica = 'doom_glyph';
                } else {
                    // GOLPE DE PUNIÇÃO
                    acao.nomeAcao = 'Devastação Titânica';
                    acao.dano = Math.floor(acao.dano * 1.3);
                    acao.posturaDanoAoJogador = 30;
                    acao.narrativa = `AZAZEL desaba seu cajado de ferro negro esmagando escudos e ossos!`;
                }
                break;
        }

        return acao;
    }

    /**
     * Aplica o impacto do jogador no inimigo com Sistema de Postura e Dano Visceral
     */
    processarImpactoJogador(mob, jogador, acaoJogador = {}) {
        const {
            tipoAcao = 'ataque_normal', // ataque_normal, golpe_pesado, golpe_visceral, magia_codigo, parry_perfeito
            danoBruto = 100,
            desempenhoRitmo = { multiplicadorGeral: 1.0, combo: 1 },
            codigoMagia = null
        } = acaoJogador;

        const resultado = {
            danoAplicado: 0,
            posturaDano: 0,
            quebrouPostura: false,
            golpeVisceralExecutado: false,
            bloqueadoOuRefletido: false,
            critico: false,
            narrativaJogador: '',
            cinematica: 'strike_normal'
        };

        // 1. Verificação de Escudo Sagrado do Inquisidor
        if (mob.buffs && mob.buffs.escudoSagrado && tipoAcao !== 'parry_perfeito' && !mob.vulneravelVisceral) {
            mob.buffs.escudoSagrado = false;
            const danoRefletido = Math.floor(danoBruto * 0.35);
            jogador.hpAtual = Math.max(0, (jogador.hpAtual || 0) - danoRefletido);
            resultado.bloqueadoOuRefletido = true;
            resultado.danoAplicado = Math.floor(danoBruto * 0.2); // Reduz dano absorvido
            mob.hpAtual = Math.max(0, mob.hpAtual - resultado.danoAplicado);
            resultado.narrativaJogador = `🛡️ O Escudo Sagrado de [${mob.nome}] repeliu a tua investida! Sofreste ${danoRefletido} de dano santo refletido!`;
            resultado.cinematica = 'shield_reflect';
            return resultado;
        }

        // 2. Execução de GOLPE VISCERAL FATAL
        if (mob.vulneravelVisceral && (tipoAcao === 'golpe_visceral' || tipoAcao === 'ataque_normal')) {
            resultado.golpeVisceralExecutado = true;
            resultado.critico = true;
            // 3.5x Multiplicador no Visceral
            resultado.danoAplicado = Math.floor(danoBruto * 3.5 * (desempenhoRitmo.multiplicadorGeral || 1.2));
            mob.hpAtual = Math.max(0, mob.hpAtual - resultado.danoAplicado);

            // Se o mob estava canalizando apocalipse, o ritual é estilhaçado
            if (mob.canalizandoApocalipse > 0) {
                mob.canalizandoApocalipse = 0;
                resultado.danoAplicado += Math.floor(mob.hpMax * 0.20); // Dano bónus colossal
                mob.hpAtual = Math.max(0, mob.hpAtual - Math.floor(mob.hpMax * 0.20));
            }

            // Cura e Fúria concedidas ao jogador
            const curaSangue = Math.min(jogador.hpMax - jogador.hpAtual, Math.floor(jogador.hpMax * 0.25));
            jogador.hpAtual += curaSangue;
            jogador.pontosAcao = Math.min(jogador.maxAcao || 10, (jogador.pontosAcao || 0) + 2);

            // Reseta a postura do inimigo pós-visceral
            mob.vulneravelVisceral = false;
            mob.turnosVulneravel = 0;
            mob.posturaAtual = mob.posturaMax;

            resultado.narrativaJogador = `🩸 GOLPE VISCERAL EXTREMO! Cravaste tuas presas e lâmina diretamente no núcleo de [${mob.nome}], rasgando ${resultado.danoAplicado} de carne e vitae! (+${curaSangue} HP e +2 Fúria)`;
            resultado.cinematica = 'visceral_blood_explosion';
            return resultado;
        }

        // 3. Cálculo de Dano e Dano de Postura conforme a Ação
        let multiplicadorDano = desempenhoRitmo.multiplicadorGeral || 1.0;
        let danoPosturaBase = 15;

        if (tipoAcao === 'parry_perfeito') {
            multiplicadorDano = 1.8;
            danoPosturaBase = 45; // Quebra massiva de postura
            resultado.critico = true;
            resultado.cinematica = 'parry_spark';
        } else if (tipoAcao === 'golpe_pesado') {
            multiplicadorDano = 1.4;
            danoPosturaBase = 30;
            resultado.cinematica = 'heavy_slash';
        } else if (tipoAcao === 'magia_codigo') {
            multiplicadorDano = 1.6;
            danoPosturaBase = 40;
            resultado.cinematica = 'code_magic_burst';
        }

        resultado.danoAplicado = Math.floor(danoBruto * multiplicadorDano);
        mob.hpAtual = Math.max(0, mob.hpAtual - resultado.danoAplicado);

        // Aplicação na Postura
        resultado.posturaDano = Math.floor(danoPosturaBase * (desempenhoRitmo.multiplicadorGeral || 1.0));
        mob.posturaAtual = Math.max(0, mob.posturaAtual - resultado.posturaDano);

        // Verifica quebra de postura (STAGGER)
        if (mob.posturaAtual <= 0 && !mob.vulneravelVisceral) {
            mob.vulneravelVisceral = true;
            mob.turnosVulneravel = 2; // 2 turnos para desferir o visceral
            resultado.quebrouPostura = true;
            resultado.narrativaJogador = `⚡ QUEBRA DE POSTURA! O equilíbrio de [${mob.nome}] foi destroçado! A guarda está escancarada para um GOLPE VISCERAL! Causaste ${resultado.danoAplicado} de dano!`;
            resultado.cinematica = 'posture_break';
        } else {
            resultado.narrativaJogador = `Atingiste [${mob.nome}] causando ${resultado.danoAplicado} de dano (-${resultado.posturaDano} Postura).`;
        }

        return resultado;
    }

    /**
     * Gera relatório cinematográfico de combate visceral completo
     */
    gerarRelatorioCinematografico(jogador, mob, resJogador, resInimigo) {
        return {
            sucesso: true,
            jogador: {
                nome: jogador.nome,
                hpAtual: jogador.hpAtual,
                hpMax: jogador.hpMax,
                furia: jogador.pontosAcao,
                narrativa: resJogador.narrativaJogador,
                cinematica: resJogador.cinematica,
                critico: resJogador.critico,
                visceral: resJogador.golpeVisceralExecutado
            },
            inimigo: {
                nome: mob.nome,
                hpAtual: mob.hpAtual,
                hpMax: mob.hpMax,
                posturaAtual: mob.posturaAtual,
                posturaMax: mob.posturaMax,
                vulneravelVisceral: mob.vulneravelVisceral,
                faseAtual: mob.faseAtual,
                arquetipo: mob.arquetipo,
                narrativa: resInimigo.narrativa,
                cinematica: resInimigo.cinematica,
                canalizando: mob.canalizandoApocalipse > 0
            }
        };
    }
}

module.exports = { CombatEngine, ARQUETIPOS_IA };
