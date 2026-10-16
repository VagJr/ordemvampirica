const fs = require('fs');

let code = fs.readFileSync('ShadowCore.js', 'utf8');
console.log('Original ShadowCore length:', code.length);

// 1. Fix tickTemporal motins & hunger checks
const oldTickStart = code.indexOf('    tickTemporal() {');
if (oldTickStart === -1) {
    console.error('ERROR: tickTemporal() not found!');
    process.exit(1);
}

const oldTickEnd = code.indexOf('    async invocarServoIA(vampiroId, nomeServo) {', oldTickStart);
if (oldTickEnd === -1) {
    console.error('ERROR: End of tickTemporal (async invocarServoIA) not found!');
    process.exit(1);
}

// Find the marker before async invocarServoIA
const headerBeforeServo = code.lastIndexOf('// ==========================================', oldTickEnd);
const cutEnd = headerBeforeServo !== -1 ? headerBeforeServo : oldTickEnd;

const newTickTemporal = `    tickTemporal() {
        const lua = AstrolabioLunar.obterFaseAtual();
        const agora = Date.now();
        if (Math.random() > 0.85) this.gerarAldeiaProcedural();

        // ==========================================
        // CERCOS E MOTINS COM REGRAS JUSTAS E LIMITES
        // ==========================================
        const cercosAtuais = Object.keys(this.cercosAtivos || {}).length;
        // Máximo de 2 cercos globais simultâneos e 8% de chance por minuto
        if (cercosAtuais < 2 && Math.random() < 0.08) { 
            let vitimas = Object.values(this.vampiros).filter(v => {
                if (v.estado === 'Banido' || v.estado === 'Torpor') return false;
                if (v.isAdmin || v.role === 'admin' || v.role === 'mestre' || v.nivel >= 100) return false; // Mestres possuem ala mágica de proteção
                if (v.nivel < 10) return false; // Proteção para novatos
                if (v.ultimoCerco && (agora - v.ultimoCerco < 6 * 3600000)) return false; // Cooldown de 6 horas por jogador
                if (Object.values(this.cercosAtivos).some(c => c.alvoId === v.id)) return false;
                return true;
            });

            if (vitimas.length > 0) {
                let alvo = vitimas[Math.floor(Math.random() * vitimas.length)];
                alvo.ultimoCerco = agora;
                let cercoId = crypto.randomBytes(4).toString('hex');
                let demonName = ["Asmodeus", "Belial", "Pazuzu", "Marchosias"][Math.floor(Math.random() * 4)];
                let cercoHp = Math.min(alvo.nivel * 2500, 150000);
                
                this.cercosAtivos[cercoId] = { 
                    id: cercoId, 
                    alvoId: alvo.id, 
                    alvoNome: alvo.nome, 
                    clanNome: alvo.clan, 
                    demonio: demonName, 
                    hpAtual: cercoHp, 
                    hpMax: cercoHp, 
                    danoTick: Math.min(150, Math.floor(alvo.nivel * 3)),
                    duracaoTicks: 10 // Expira em 10 minutos (10 ticks)
                };
                this._registrarEventoEspecial('global', 'MOTIM DEMONÍACO', \`As hostes de \${demonName} cercaram os domínios de [\${alvo.nome}]! O cerco durará 10 minutos.\`, true);
            }
        }

        // Processamento dos Cercos Ativos com Teto Não-Letal
        for (let cid in this.cercosAtivos) {
            let cerco = this.cercosAtivos[cid];
            let alvo = this.vampiros[cerco.alvoId];

            if (!alvo || alvo.estado === 'Banido') {
                delete this.cercosAtivos[cid];
                continue;
            }

            cerco.duracaoTicks = (cerco.duracaoTicks || 10) - 1;

            // Se o cerco expirou, os demônios recuam
            if (cerco.duracaoTicks <= 0) {
                this._registrarEventoEspecial('global', 'CERCO DISPERSADO', \`As hostes de \${cerco.demonio} recuaram das terras de [\${alvo.nome}]. O perigo passou.\`, false);
                delete this.cercosAtivos[cid];
                continue;
            }

            // Piso não-letal: cerco NUNCA pode reduzir HP abaixo de 25%
            const hpPiso = Math.floor((alvo.hpMax || 2000) * 0.25);
            if (alvo.hpAtual > hpPiso) {
                const danoEfetivo = Math.min(alvo.hpAtual - hpPiso, cerco.danoTick);
                alvo.hpAtual -= danoEfetivo;
            } else {
                // Se o jogador já está no limite de 25%, saqueia uma quantia simbólica de sangue desprotegido
                if (alvo.sangue > 1000) {
                    alvo.sangue = Math.max(1000, alvo.sangue - 25);
                }
            }
        }

        for (let hash in this.rebanho) { 
            let m = this.rebanho[hash]; 
            if (m.estado === 'Vibrante' && m.maldicaoArcana) m.sangueAtual = Math.max(1, m.sangueAtual - 1); 
        }
        
        // ==========================================
        // CICLO VITAL E SOBREVIVÊNCIA DOS VAMPIROS
        // ==========================================
        for (let id in this.vampiros) {
            let v = this.vampiros[id];
            
            // 1. Mestres / Admins / Primordiais possuem imunidade eterna contra morte de background
            const isMestreOuAdmin = v.isAdmin || v.role === 'admin' || v.role === 'mestre' || v.geracao <= 2 || v.nivel >= 100;
            if (isMestreOuAdmin) {
                if (v.hpAtual <= 0) v.hpAtual = v.hpMax || 50000;
                if ((v.sangue || 0) < 100000) v.sangue = Math.max(v.sangue || 0, 100000);
                if (v.estado === 'Banido' || v.estado === 'Torpor') v.estado = 'Ativo';
                if (v.status === 'Cinzas' || v.status === 'Torpor') v.status = 'Ativo';
            }

            if (v.estado === 'Ativo') {
                const atrTotais = this._obterAtributosTotais(v); 
                v.pontosAcao = Number(v.pontosAcao) || 0;
                v.maxAcao = Number(v.maxAcao) || 10;

                if (v.pontosAcao < v.maxAcao) {
                    let recup = lua.id === 'crescente' ? 0.8 : 0.5; 
                    if (Math.random() < recup) v.pontosAcao++;
                }

                // Inquisição (dano contínuo controlado)
                if (v.maldicaoInquisicao) {
                    v.sangue = Math.max(100, (v.sangue || 0) - (v.nivel * 5));
                    const hpPisoInq = Math.floor((v.hpMax || 2000) * 0.2);
                    if (v.hpAtual > hpPisoInq) {
                        v.hpAtual = Math.max(hpPisoInq, v.hpAtual - (v.nivel * 2));
                    }
                    if (global.io && Math.random() > 0.6) {
                        global.io.to(\`priv_\${v.id}\`).emit('dungeon_msg', { msg: \`🔥 A Fúria Solar queima-te por dentro. Encontra o Inquisidor no Umbral!\`, cor: '#ff1e2f' });
                    }
                }

                // Consumo suave de sangue por hora de atividade
                if (v.nivel > 2 && Math.random() < 0.2) {
                    v.sangue = Math.max(0, Number(v.sangue || 0) - 1);
                }

                // REGENERAÇÃO DE EMERGÊNCIA (Vampiro sobrevive pelo Sangue)
                if (v.hpAtual <= 0) {
                    if (v.sangue > 500) {
                        let cura = Math.min(v.sangue, Math.floor((v.hpMax || 2000) * 0.4));
                        v.sangue -= cura;
                        v.hpAtual = Math.floor((v.hpMax || 2000) * 0.4);
                        this._registrarEventoEspecial('global', 'REGENERAÇÃO DE VITAE', \`O sangue de [\${v.nome}] ferveu, restaurando o seu corpo das trevas.\`, false);
                    } else if (v.calice > 500) {
                        v.sangue = (v.sangue || 0) + v.calice;
                        v.calice = 0;
                        v.hpAtual = Math.floor((v.hpMax || 2000) * 0.3);
                        this._registrarEventoEspecial('global', 'FONTE DO CÁLICE', \`O Cálice Sagrado de [\${v.nome}] verteu vida, impedindo o sono eterno.\`, false);
                    } else {
                        // Sem sangue e sem cálice: entra em TORPOR (Estase), NUNCA banido/deletado!
                        v.estado = 'Torpor';
                        v.status = 'Torpor';
                        v.hpAtual = 1;
                        this._registrarEventoEspecial('global', 'TORPOR SANGRENTO', \`[\${v.nome}] ficou sem sangue e entrou em sono profundo (Torpor). Precisa de sangue para despertar.\`, true);
                    }
                }
            }

            // Rendimento do Cálice
            if (v.calice > 0) {
                v.cicloCalice = (v.cicloCalice || 0) + 1;
                if (v.cicloCalice >= 10) {
                    v.cicloCalice = 0;
                    const rendimento = Math.max(1, Math.floor(v.calice * 0.02));
                    v.calice += rendimento;
                    v.caliceRendimentoTotal = (v.caliceRendimentoTotal || 0) + rendimento;
                }
            }
        }      
        
        for (let c in this.clans) { 
            if (this.clans[c].cofre > 0) this.clans[c].cofre -= Math.floor(this.clans[c].cofre * 0.02); 
        }
        
        // Mercado Flutuante
        if (Math.random() > 0.8) {
            let desc = this.balancaCosmica.regente === 'Tiamat (Vampiros)' ? 0.8 : 1.2;
            if (this.alquimia['elixir_estamina']) this.alquimia['elixir_estamina'].custo.gts = Math.floor(300 * desc);
        }

        if (Math.random() > 0.98 && !this.caravanaAtiva) { this.caravanaAtiva = { hp: 50000, assaltantes: [] }; }
        if (Math.random() > 0.98 && !this.heregeMarcado) { this.heregeMarcado = { hp: 15000, nome: "Kael, O Traidor", ativo: true }; }

        this.processarServosNoTick();
        if (Math.random() > 0.8) this._salvarBancoDeDados(); 
    }
`;

code = code.substring(0, oldTickStart) + newTickTemporal + '\n' + code.substring(cutEnd);
console.log('✅ 1. tickTemporal updated with fair rules, non-lethal siege limits, and Torpor.');

// 2. Fix PvP duel permadeath
const oldPvpBlock = `            } else if (tipoCombate === 'pvp') {
                let rouboGts = Math.min(mob.sangue || 0, Math.floor(1000 + (v.nivel * 50)));
                mob.sangue = Math.max(0, (mob.sangue || 0) - rouboGts);
                v.sangue += rouboGts;
                if (!v.estatisticas) v.estatisticas = {};
                v.estatisticas.vitoriasPvP = (v.estatisticas.vitoriasPvP || 0) + 1;
                this.ganharXP(v.id, 50 * (desempenhoRitmo.multiplicadorGeral || 1));
                mob.estado = 'Banido'; mob.status = 'Cinzas'; mob.hpAtual = 0;
                this._registrarEventoEspecial('guerra', 'ASSASSINATO EM DUELO', \`Numa batalha sangrenta de Arena, \${v.nome} chacinou \${mob.nome} e roubou \${rouboGts} Gts!\`, true);
                relatoVitoria = \`Reduziste \${mob.nome} a cinzas e pilhaste \${rouboGts} Gts.\`;
            }`;

const newPvpBlock = `            } else if (tipoCombate === 'pvp') {
                let rouboGts = Math.min(mob.sangue || 0, Math.floor(1000 + (v.nivel * 50)));
                mob.sangue = Math.max(0, (mob.sangue || 0) - rouboGts);
                v.sangue += rouboGts;
                if (!v.estatisticas) v.estatisticas = {};
                v.estatisticas.vitoriasPvP = (v.estatisticas.vitoriasPvP || 0) + 1;
                this.ganharXP(v.id, 50 * (desempenhoRitmo.multiplicadorGeral || 1));
                // O defensor NÃO é banido! Fica derrotado com 20% de HP para se recuperar
                mob.estado = 'Ativo'; 
                mob.status = 'Ativo'; 
                mob.hpAtual = Math.max(1, Math.floor((mob.hpMax || 2000) * 0.2));
                this._registrarEventoEspecial('guerra', 'DUELO DE ARENA', \`Numa batalha sangrenta de Arena, \${v.nome} subjugou \${mob.nome} e pilhou \${rouboGts} Gts!\`, true);
                relatoVitoria = \`Subjugaste \${mob.nome} e pilhaste \${rouboGts} Gts.\`;
            }`;

if (code.includes(oldPvpBlock)) {
    code = code.replace(oldPvpBlock, newPvpBlock);
    console.log('✅ 2. PvP duel permadeath eliminated.');
} else {
    console.error('⚠️ 2. oldPvpBlock not found directly!');
}

// 3. Fix Combat player death verification (lines 2936-2968)
const oldCombatDeathCheck = `        // --- VERIFICAÇÃO DE MORTE DO JOGADOR ---
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
        }`;

const newCombatDeathCheck = `        // --- VERIFICAÇÃO DE MORTE / SOBREVIVÊNCIA DO JOGADOR ---
        if (v.hpAtual <= 0) {
            // 1. Mestres / Admins / Primordiais possuem imunidade eterna
            if (v.isAdmin || v.role === 'admin' || v.role === 'mestre' || v.geracao <= 2 || v.nivel >= 100) {
                v.hpAtual = Math.floor(v.hpMax * 0.35);
                v.sangue = Math.max(v.sangue || 0, 50000);
                v.estado = 'Ativo';
                v.status = 'Ativo';
                this._salvarBancoDeDados();
                return { finalizado: true, relato: "A tua Alma de Mestre Primordial recusa a morte. Recuperaste as forças!" };
            }

            // 2. Ankh de Sangue
            if (v.inventario && v.inventario.ankh_sangue > 0) {
                v.inventario.ankh_sangue -= 1;
                v.hpAtual = Math.floor(v.hpMax * 0.5);
                v.pontosAcao = Math.max(0, (v.pontosAcao || 0) - 2); 
                this._registrarEventoEspecial('global', 'ENGANOU A MORTE', \`Um Ankh estilhaçou-se para salvar \${v.nome}!\`, false);
                this._salvarBancoDeDados();
                return { finalizado: true, relato: \`Um [Ankh de Sangue] quebrou-se! Restam \${v.inventario.ankh_sangue} Vidas.\` };
            }

            // 3. Sobrevivência por Vitae (Vampiro que tem sangue consome reserva para fugir da morte)
            if ((v.sangue || 0) > 200 || (v.calice || 0) > 200) {
                let gastoSangue = 0;
                if (v.sangue > 200) {
                    gastoSangue = Math.min(v.sangue, Math.floor(v.hpMax * 0.3));
                    v.sangue -= gastoSangue;
                } else {
                    gastoSangue = Math.min(v.calice, Math.floor(v.hpMax * 0.3));
                    v.calice -= gastoSangue;
                }
                v.hpAtual = Math.max(100, Math.floor(v.hpMax * 0.25));
                v.estado = 'Ativo';
                this._registrarEventoEspecial('global', 'PULSO DE VITAE', \`\${v.nome} queimou \${gastoSangue} Gts para escapar das garras da morte!\`, false);
                this._salvarBancoDeDados();
                return { finalizado: true, relato: \`O teu corpo estremeceu! Queimaste \${gastoSangue} Gts de Vitae para escapar da morte.\` };
            }

            // 4. Se completamente sem sangue, entra em Torpor (SEM PERMADEATH / SEM BAN)
            let msgMorte = "O teu corpo cedeu à falta de Vitae. Caíste em Torpor profundo.";
            if (v.equipamentos) {
                ['arma', 'armadura', 'amuleto'].forEach(slot => {
                    if (v.equipamentos[slot]) {
                        v.equipamentos[slot].durabilidade = Math.max(0, (v.equipamentos[slot].durabilidade || 100) - 15);
                    }
                });
            }

            v.estado = 'Torpor'; v.status = 'Torpor'; v.hpAtual = 1; v.pontosAcao = 0;
            this._registrarEventoEspecial('global', 'CAÍDO EM TORPOR', \`A carcaça de \${v.nome} caiu em estase sombria (Torpor).\`, false);
            this._salvarBancoDeDados(); 
            return { finalizado: true, relato: msgMorte };
        }`;

if (code.includes(oldCombatDeathCheck)) {
    code = code.replace(oldCombatDeathCheck, newCombatDeathCheck);
    console.log('✅ 3. Combat death check converted to Vitae Surge & Torpor.');
} else {
    console.error('⚠️ 3. oldCombatDeathCheck not found directly!');
}

// 4. Fix Aldeia raid line (line 2272)
const oldAldeiaLine = "if (v.hpAtual <= 0) v.estado = 'Banido';";
const newAldeiaLine = "if (v.hpAtual <= 0) { v.hpAtual = Math.max(10, Math.floor(v.hpMax * 0.15)); }";
if (code.includes(oldAldeiaLine)) {
    code = code.replace(oldAldeiaLine, newAldeiaLine);
    console.log('✅ 4. Aldeia raid instant ban replaced with non-lethal retreat.');
}

// 5. Fix _verificarMorte (line 4124)
const oldVerificarMorte = `	_verificarMorte(id) {
        const v = this.vampiros[id];
        if (v && v.hp <= 0) {
            v.hp = 0;
            v.status = "Cinzas";
            v.combateLocal = null;
            
            this._registrarEventoEspecial('global', '💀 QUEDA NO ABISMO', \`[\${v.nome}] sucumbiu aos horrores e virou cinzas.\`, true);
            this._salvarBancoDeDados();
            return true;
        }
        return false;
    }`;

const newVerificarMorte = `	_verificarMorte(id) {
        const v = this.vampiros[id];
        if (!v) return false;
        if (v.isAdmin || v.role === 'admin' || v.role === 'mestre' || v.nivel >= 100) {
            v.hpAtual = v.hpMax || 50000;
            v.estado = 'Ativo';
            v.status = 'Ativo';
            return false;
        }
        if (v.hp <= 0 || v.hpAtual <= 0) {
            if ((v.sangue || 0) > 500) {
                v.sangue -= 500;
                v.hpAtual = Math.floor((v.hpMax || 2000) * 0.3);
                v.estado = 'Ativo';
                return false;
            }
            v.hp = 1;
            v.hpAtual = 1;
            v.status = "Torpor";
            v.estado = "Torpor";
            v.combateLocal = null;
            this._registrarEventoEspecial('global', '💀 QUEDA NO ABISMO', \`[\${v.nome}] sucumbiu aos horrores e entrou em Torpor.\`, false);
            this._salvarBancoDeDados();
            return true;
        }
        return false;
    }`;

if (code.includes(oldVerificarMorte)) {
    code = code.replace(oldVerificarMorte, newVerificarMorte);
    console.log('✅ 5. _verificarMorte updated with Torpor and Master immunity.');
}

fs.writeFileSync('ShadowCore.js', code, 'utf8');
console.log('ShadowCore.js successfully updated! New length:', code.length);
