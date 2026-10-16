const fs = require('fs');

const path = 'c:/ordemvampirica/ShadowCore.js';
let content = fs.readFileSync(path, 'utf8');

const startTag = 'async processarCombateAcao(dadosAction) {';
const endTag = 'async despertarTalento(vampiroId) {';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
    console.error("Tags not found in ShadowCore.js!");
    process.exit(1);
}

const newCombatMethods = `async processarCombateAcao(dadosAction) {
        const { id, alvoId, tipoCombate, postura, desempenhoRitmo = { multiplicadorGeral: 1.0, danoRealCausado: 100, danoRealSofrido: 0 }, tipoAcao = 'ataque_normal', codigoMagia = null } = dadosAction;
        const v = this.vampiros[id];
        if (!v) return { erro: "Aura não encontrada." };

        const atr = this._obterAtributosTotais(v);
        let danoFinal = Math.min(desempenhoRitmo.danoRealCausado || 100, ((atr.vontade * 80) * (desempenhoRitmo.multiplicadorGeral || 1.0)) + (v.nivel * 1000));

        if (desempenhoRitmo.sangueGastoMagia > 0) v.calice = Math.max(0, (v.calice || 0) - desempenhoRitmo.sangueGastoMagia);
        if (desempenhoRitmo.curaRuptura > 0) {
            v.hpAtual = Math.min(v.hpMax, (v.hpAtual || 0) + desempenhoRitmo.curaRuptura);
            v.calice = (v.calice || 0) + Math.floor(desempenhoRitmo.curaRuptura / 2); 
        }

        // Obtém o alvo do combate
        let mob = null;
        let dIdEncontrado = null;

        if (tipoCombate === 'pve' || tipoCombate === 'labirinto') {
            mob = this.batalhasPvE[id];
        } else if (tipoCombate === 'goetia') {
            mob = this.evocacaoAtiva;
        } else if (tipoCombate === 'fenda') {
            mob = this.fendaAtiva[alvoId];
        } else if (tipoCombate === 'cerco') {
            mob = this.cercosAtivos[alvoId];
        } else if (tipoCombate === 'herege') {
            mob = this.heregeMarcado;
        } else if (tipoCombate === 'dungeon' || tipoCombate === 'dungeon_pvp') {
            for (let dId in this.dungeons) {
                if (this.dungeons[dId].entidadeEmCombate && this.dungeons[dId].entidadeEmCombate.id === alvoId) {
                    mob = this.dungeons[dId].entidadeEmCombate;
                    dIdEncontrado = dId;
                    break;
                }
            }
        } else if (tipoCombate === 'pvp') {
            mob = this.vampiros[alvoId];
        }

        if (!mob) return { erro: "O alvo desvaneceu nas sombras." };

        // Inicializa IA e postura através da CombatEngine
        mob = this.combatEngine.inicializarEntidadeCombate(mob, tipoCombate, v.nivel);

        // 1. Processa Ação do Jogador contra o Alvo
        const resJogador = this.combatEngine.processarImpactoJogador(mob, v, {
            tipoAcao,
            danoBruto: danoFinal,
            desempenhoRitmo,
            codigoMagia
        });

        // ==========================================
        // VERIFICAÇÃO DE VITÓRIA / DERROTA DO MOB
        // ==========================================
        if (mob.hpAtual <= 0) {
            mob.hpAtual = 0;
            let relatoVitoria = "";

            if (tipoCombate === 'pve' || tipoCombate === 'labirinto') {
                if (mob.rank && mob.rank.includes("Inquisidor")) { v.maldicaoInquisicao = false; v.titulos.push("Herege Triunfante"); }
                let buffEclipse = (this.altarEclipse && this.altarEclipse.buffAtivoAte > Date.now()) ? 2 : 1;
                let xpGanho = Math.floor((mob.hpMax / 10) * (mob.mult || 1)) * buffEclipse;
                let ganhoGts = Math.floor(((Math.random() * 200) + 100 + (v.nivel * 50)) * (mob.mult || 1)) * buffEclipse;
                v.sangue += ganhoGts;
                this.ganharXP(v.id, xpGanho);
                if (mob.loot) v.inventario[mob.loot] = (v.inventario[mob.loot] || 0) + 1;
                
                relatoVitoria = \`Ganhaste +\${xpGanho} XP, +\${ganhoGts} Gts e 1x [\${(mob.loot || 'cinzas').toUpperCase()}].\`;
                if (Math.random() > 0.80) { 
                    const drop = ForjaDraconiana.gerarReliquia(v.nivel + (this.nivelAbismo * 2), this.reliquiasCustomizadas); 
                    v.bolsa.push(drop); relatoVitoria += \`\\n⚔️ Extraíste: [\${drop.nome}]!\`; 
                }
                delete this.batalhasPvE[id];
            } else if (tipoCombate === 'goetia') {
                let xpBaseBoss = Math.floor(mob.hpMax / 5);
                if (mob.participantes) {
                    for (let pid in mob.participantes) { 
                        let l = this.vampiros[pid]; 
                        if (l) { 
                            l.influencia = (l.influencia || 0) + 100;
                            l.inventario.pedraAlma = (l.inventario.pedraAlma || 0) + 10; 
                            this.ganharXP(l.id, xpBaseBoss);
                            if (!l.estatisticas) l.estatisticas = {};
                            l.estatisticas.demoniosMortos = (l.estatisticas.demoniosMortos || 0) + 1;
                            const dropBoss = ForjaDraconiana.gerarReliquia(l.nivel + 30, this.reliquiasCustomizadas);
                            l.bolsa.push(dropBoss);
                        } 
                    }
                }
                this._registrarEventoEspecial('global', 'VITÓRIA GOÉTICA', \`A Vontade de \${mob.nome} foi estilhaçada! Chove XP, Pedras e Relíquias aos bravos.\`, true);
                this.evocacaoAtiva = null;
                relatoVitoria = "ENTIDADE BANIDA DO CONCLAVE! Vê a tua bolsa.";
            } else if (tipoCombate === 'fenda') {
                v.inventario[mob.loot || 'ectoplasma'] = (v.inventario[mob.loot || 'ectoplasma'] || 0) + 2;
                this.ganharXP(v.id, 1500);
                delete this.fendaAtiva[alvoId];
                this._registrarEventoEspecial('global', 'FENDA PURGADA', \`\${v.nome} obliterou a anomalia cósmica.\`, true);
                relatoVitoria = \`A Fenda foi selada. +2 \${(mob.loot || 'ectoplasma').toUpperCase()}\`;
            } else if (tipoCombate === 'cerco') {
                const vitima = this.vampiros[mob.alvoId];
                if (vitima) vitima.influencia = (vitima.influencia || 0) + 10;
                delete this.cercosAtivos[alvoId];
                this._registrarEventoEspecial('global', 'CERCO QUEBRADO', \`O massacre terminou! \${v.nome} esmagou as hostes de \${mob.demonio}!\`, true);
                relatoVitoria = "O Cerco demoníaco foi aniquilado!";
            } else if (tipoCombate === 'herege') {
                this.heregeMarcado = null;
                const drop = ForjaDraconiana.gerarReliquia(v.nivel + 20, this.reliquiasCustomizadas);
                v.bolsa.push(drop);
                v.influencia = (v.influencia || 0) + 500;
                this._registrarEventoEspecial('global', 'A LENDA CAIU', \`\${v.nome} executou o Herege Marcado e reclamou [\${drop.nome}]!\`, true);
                relatoVitoria = \`VITÓRIA GLORIOSA! Reclamaste [\${drop.nome}].\`;
            } else if (tipoCombate === 'dungeon' || tipoCombate === 'dungeon_pvp') {
                this.resolverCombateDungeon(dIdEncontrado, true);
                relatoVitoria = "A abominação do Abismo caiu na masmorra.";
            } else if (tipoCombate === 'pvp') {
                let rouboGts = Math.min(mob.sangue || 0, Math.floor(1000 + (v.nivel * 50)));
                mob.sangue = Math.max(0, (mob.sangue || 0) - rouboGts);
                v.sangue += rouboGts;
                if (!v.estatisticas) v.estatisticas = {};
                v.estatisticas.vitoriasPvP = (v.estatisticas.vitoriasPvP || 0) + 1;
                this.ganharXP(v.id, 50 * (desempenhoRitmo.multiplicadorGeral || 1));
                mob.estado = 'Banido'; mob.status = 'Cinzas'; mob.hpAtual = 0;
                this._registrarEventoEspecial('guerra', 'ASSASSINATO EM DUELO', \`Numa batalha sangrenta de Arena, \${v.nome} chacinou \${mob.nome} e roubou \${rouboGts} Gts!\`, true);
                relatoVitoria = \`Reduziste \${mob.nome} a cinzas e pilhaste \${rouboGts} Gts.\`;
            }

            this._salvarBancoDeDados();
            return {
                finalizado: true,
                alvoMorto: true,
                relato: \`⚡ \${resJogador.narrativaJogador}\\n🏆 \${relatoVitoria}\`,
                cinematica: resJogador.cinematica,
                critico: resJogador.critico,
                visceral: resJogador.golpeVisceralExecutado
            };
        }

        // ==========================================
        // 2. TURNO DO INIMIGO (IA AVANÇADA)
        // ==========================================
        const resInimigo = this.combatEngine.decidirAcaoInimigo(mob, v);
        let danoSofrido = resInimigo.dano || 0;

        if (desempenhoRitmo.danoRealSofrido > 0) {
            danoSofrido = Math.max(danoSofrido, Math.floor(desempenhoRitmo.danoRealSofrido));
        }

        if (v.escudo) {
            danoSofrido = Math.floor(danoSofrido * 0.2); // Escudo absorve 80% do impacto
            v.escudo = false;
        }

        if (danoSofrido > 0) {
            v.hpAtual = Math.max(0, (v.hpAtual || 0) - danoSofrido);
        }

        // --- VERIFICAÇÃO DE MORTE DO JOGADOR ---
        if (v.hpAtual <= 0) {
            if (v.geracao === 1) {
                v.hpAtual = v.hpMax;
                v.sangue = Math.max(v.sangue || 0, 50000);
                this._salvarBancoDeDados();
                return { finalizado: true, relato: "A tua Alma Primordial recusa a morte nas trevas." };
            }

            if (v.inventario && v.inventario.ankh_sangue > 0) {
                v.inventario.ankh_sangue -= 1;
                v.hpAtual = Math.floor(v.hpMax * 0.5);
                v.pontosAcao = Math.max(0, (v.pontosAcao || 0) - 2); 
                this._registrarEventoEspecial('global', 'ENGANOU A MORTE', \`Um Ankh estilhaçou-se para salvar \${v.nome}!\`, false);
                this._salvarBancoDeDados();
                return { finalizado: true, relato: \`Um [Ankh de Sangue] quebrou-se! Restam \${v.inventario.ankh_sangue} Vidas.\` };
            }

            let msgMorte = "O teu corpo cedeu. A escuridão abraçou-te.";
            if (v.equipamentos) {
                ['arma', 'armadura', 'amuleto'].forEach(slot => {
                    if (v.equipamentos[slot]) {
                        v.equipamentos[slot].durabilidade = Math.max(0, (v.equipamentos[slot].durabilidade || 100) - 25);
                        if (v.equipamentos[slot].durabilidade <= 0) msgMorte += \`\\n⚠️ [\${v.equipamentos[slot].nome}] FOI DESTRUÍDO!\`;
                    }
                });
            }

            v.estado = 'Banido'; v.status = 'Cinzas'; v.pontosAcao = 0; v.sangue = 0; v.hpAtual = 0;
            this._registrarEventoEspecial('global', 'CAÍDO EM BATALHA', \`A alma de \${v.nome} foi estilhaçada nas trevas.\`, false);
            this._salvarBancoDeDados(); 
            return { finalizado: true, relato: msgMorte };
        }

        this._salvarBancoDeDados();
        return {
            finalizado: false,
            hpRestante: mob.hpAtual,
            hpMax: mob.hpMax,
            posturaAtual: mob.posturaAtual,
            posturaMax: mob.posturaMax,
            vulneravelVisceral: mob.vulneravelVisceral,
            faseAtual: mob.faseAtual,
            acaoInimigo: resInimigo,
            cinematica: resJogador.cinematica || resInimigo.cinematica,
            critico: resJogador.critico,
            visceral: resJogador.golpeVisceralExecutado,
            relato: \`\${resJogador.narrativaJogador}\\n\${resInimigo.narrativa}\`
        };
    }

    processarTurnoCombate(id, acao) {
        const v = this.vampiros[id];
        if (!v) return { erro: "Aura não encontrada." };
        let mob = this.batalhasPvE[id];
        if (!mob) return { erro: "Nenhum embate ativo no Umbral." };

        mob = this.combatEngine.inicializarEntidadeCombate(mob, 'pve', v.nivel);
        const atr = this._obterAtributosTotais(v);
        const danoBase = Math.floor((atr.vontade * 40) + (v.nivel * 50) + 100);

        const resJogador = this.combatEngine.processarImpactoJogador(mob, v, {
            tipoAcao: acao || 'ataque_normal',
            danoBruto: danoBase,
            desempenhoRitmo: { multiplicadorGeral: 1.0, combo: 1 }
        });

        if (mob.hpAtual <= 0) {
            let xpGanho = Math.floor((mob.hpMax / 10) * (mob.mult || 1));
            let ganhoGts = Math.floor(((Math.random() * 200) + 100 + (v.nivel * 50)) * (mob.mult || 1));
            v.sangue += ganhoGts;
            this.ganharXP(v.id, xpGanho);
            v.inventario[mob.loot] = (v.inventario[mob.loot] || 0) + 1;
            delete this.batalhasPvE[id];
            this._salvarBancoDeDados();
            return {
                sucesso: true,
                finalizado: true,
                relato: \`VITÓRIA ESMAGADORA! \${resJogador.narrativaJogador}\\nGanhaste +\${xpGanho} XP, +\${ganhoGts} Gts e 1x [\${mob.loot.toUpperCase()}].\`,
                cinematica: resJogador.cinematica
            };
        }

        const resInimigo = this.combatEngine.decidirAcaoInimigo(mob, v);
        if (resInimigo.dano > 0) {
            v.hpAtual = Math.max(0, (v.hpAtual || 0) - resInimigo.dano);
        }

        this._salvarBancoDeDados();
        return {
            sucesso: true,
            finalizado: false,
            mob: {
                nome: mob.nome,
                hpAtual: mob.hpAtual,
                hpMax: mob.hpMax,
                posturaAtual: mob.posturaAtual,
                posturaMax: mob.posturaMax,
                vulneravelVisceral: mob.vulneravelVisceral,
                faseAtual: mob.faseAtual
            },
            jogador: {
                hpAtual: v.hpAtual,
                hpMax: v.hpMax,
                furia: v.pontosAcao
            },
            relato: \`\${resJogador.narrativaJogador}\\n\${resInimigo.narrativa}\`,
            cinematica: resJogador.cinematica || resInimigo.cinematica
        };
    }

    `;

content = content.substring(0, startIndex) + newCombatMethods + content.substring(endIndex);
fs.writeFileSync(path, content, 'utf8');
console.log('Successfully replaced processarCombateAcao and added processarTurnoCombate in ShadowCore.js');
