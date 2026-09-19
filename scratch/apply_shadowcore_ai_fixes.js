const fs = require('fs');

const targetFile = 'C:\\ordemvampirica\\ShadowCore.js';
let content = fs.readFileSync(targetFile, 'utf8');

// 1. julgarSacrificio
const idxJulgar = content.indexOf('async julgarSacrificio(item, quantidade, jogador) {');
if (idxJulgar !== -1) {
    const endJulgar = content.indexOf('}', content.indexOf('return `Eu devoro o teu sacrifício de ${item}.`;', idxJulgar));
    if (endJulgar !== -1) {
        const fullOld = content.substring(idxJulgar, endJulgar + 1);
        const newJulgar = `async julgarSacrificio(item, quantidade, jogador) {
        try {
            let p = "O Arauto [" + jogador.nome + "] sacrificou " + quantidade + "x de [" + item + "]. OBRIGATÓRIO: Aceite a oferenda com majestade e sabedoria oculta. Dê um conselho enigmático sobre as Leis Cósmicas. MÁX 2 FRASES.";
            const resposta = await this.chamarLLMResiliente([
                { role: 'system', content: this.promptSupremo },
                { role: 'user', content: p }
            ], { temperature: 0.85 });
            if (resposta) return resposta.replace(/"/g, '').trim();
        } catch (e) {}
        return "O altar abissal consome teus " + quantidade + "x " + item + ". As forças das trevas e da ordem reconhecem o teu tributo cósmico.";
    }`;
        content = content.replace(fullOld, newJulgar);
        console.log("✅ julgarSacrificio atualizado!");
    }
}

// 2. gerarLore e gerarNarrativaProcedural
const idxLore = content.indexOf('async gerarLore(evento, detalhes) {');
if (idxLore !== -1) {
    const endNarrativa = content.indexOf('}', content.indexOf('return detalhes;', idxLore));
    if (endNarrativa !== -1) {
        const fullOld = content.substring(idxLore, endNarrativa + 1);
        const newLore = `async gerarLore(evento, detalhes) {
        try {
            const prompt = "EVENTO: \\"" + evento + "\\". DETALHES: \\"" + detalhes + "\\". Transforma numa profecia sombria épica que equilibra o confronto entre Trevas e Ordem. MÁX 2 FRASES.";
            const resposta = await this.chamarLLMResiliente([
                { role: "system", content: this.promptSupremo },
                { role: "user", content: prompt }
            ], { temperature: 0.85 });
            if (resposta) return "👁️ Voz do Abismo: " + resposta.replace(/"/g, '').trim();
        } catch (e) {}
        return "👁️ Voz do Abismo: O tecido da realidade estremece sob " + evento + "; as correntes do destino foram alteradas.";
    }

    async gerarNarrativaProcedural(acao, detalhes, contextoOculto = "Ação de combate") {
        try {
            const prompt = "Reescreva de forma visceral, sombria e épica em APENAS 1 FRASE CURTA (máx 20 palavras): \\"" + detalhes + "\\". Contexto: [" + contextoOculto + "].";
            const resposta = await this.chamarLLMResiliente([
                { role: "system", content: "Seja cirúrgico, majestoso e gótico." },
                { role: "user", content: prompt }
            ], { temperature: 0.8 });
            if (resposta) return resposta.replace(/"/g, '').trim();
        } catch(e) {}
        return detalhes;
    }`;
        content = content.replace(fullOld, newLore);
        console.log("✅ gerarLore e gerarNarrativaProcedural atualizados!");
    }
}

// 3. OraculoAbissal: vozDoDemonio até forjarReliquiaDoManuscrito
const idxVoz = content.indexOf('async vozDoDemonio(nomeDemonio, contexto, detalhes) {');
if (idxVoz !== -1) {
    const endReliquia = content.indexOf('}', content.indexOf('return this._extrairJson(resposta.choices[0].message.content);', idxVoz) + 60);
    if (endReliquia !== -1) {
        const fullOld = content.substring(idxVoz, endReliquia + 1);
        const newMetodos = `async vozDoDemonio(nomeDemonio, contexto, detalhes) {
        try {
            const promptContexto = "Demônio invocado da Goétia: [" + nomeDemonio + "]. CONTEXTO: " + contexto + ". DETALHE: " + detalhes + ". Grite com os mortais com fúria cósmica ancestral! 1 FRASE visceral.";
            const raw = await this.chamarLLMResiliente([
                { role: 'system', content: this.promptSupremo },
                { role: 'user', content: promptContexto }
            ], { temperature: 0.95 });
            if (raw) return raw.replace(/"/g, '').trim();
        } catch(e) {}
        return "Eu sou " + nomeDemonio + ", flagelo dos que rastejam na carne! Vossas almas alimentarão a forja do abismo!";
    }

    async interpretarMagia(nome, efeito, lore) {
        try {
            const prompt = "MAGIA: \\"" + nome + "\\". EFEITO: \\"" + efeito + "\\". LORE: \\"" + lore + "\\". Avalie e descreva a distorção mágica. JSON: {\\"descricao\\": \\"texto épico\\", \\"poderMagico\\": 150}";
            const raw = await this.chamarLLMResiliente([
                { role: 'system', content: "JSON APENAS. " + this.promptSupremo },
                { role: 'user', content: prompt }
            ], { json: true, temperature: 0.8 });
            const json = this._extrairJson(raw);
            if (json && json.descricao) return json;
        } catch (e) {}
        return { descricao: "As forças do abismo canalizam " + nome + ", distorcendo as leis da física e do sangue.", poderMagico: 120 };
    }

    async julgarDueloIA(atacante, atrAtaque, defensor, atrDefesa, posturaNome) {
        try {
            const prompt = "Juiz Cósmico Sanguinis. ATACANTE: [" + atacante.nome + "], Atributos: " + JSON.stringify(atrAtaque) + ". DEFENSOR: [" + defensor.nome + "], Atributos: " + JSON.stringify(atrDefesa) + ". POSTURA: " + posturaNome + ".\\nCompare e decida vencedor com astúcia e leis de combate sobrenatural. JSON EXATO: {\\"vencedorId\\": \\"" + atacante.id + "\\", \\"dano\\": 500, \\"relatoAtacante\\": \\"frase 1\\", \\"relatoDefensor\\": \\"frase 2\\"}";
            const raw = await this.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS." },
                { role: "user", content: prompt }
            ], { json: true, temperature: 0.7 });
            const json = this._extrairJson(raw);
            if (json && json.vencedorId) return json;
        } catch (e) {}
        const pAtacante = (atrAtaque.vontade || 10) * 1.5 + (atrAtaque.gnose || 10) * 2;
        const pDefensor = (atrDefesa.densidade || 10) * 1.8 + (atrDefesa.vontade || 10);
        const atacanteVence = pAtacante >= pDefensor || Math.random() > 0.45;
        const vencedor = atacanteVence ? atacante : defensor;
        const perdedor = atacanteVence ? defensor : atacante;
        return {
            vencedorId: vencedor.id,
            dano: Math.max(150, Math.floor(pAtacante * 12)),
            relatoAtacante: vencedor.nome + " canalizou a escuridão ancestral e sobrepujou a defesa de " + perdedor.nome + "!",
            relatoDefensor: perdedor.nome + " vacilou sob o impacto cósmico da postura " + posturaNome + "."
        };
    }

    async despertarHabilidadeUnica(iniciado) {
        const stats = iniciado.estatisticas || {};
        const atr = this.core ? this.core._obterAtributosTotais(iniciado) : (iniciado.atributos || {});
        const prompt = "Analise profundamente a alma e os feitos deste acólito de SANGUINIS:\\n" +
"- Nome: [" + iniciado.nome + "], Raça: [" + iniciado.raca + "], Grau/Nível: [" + iniciado.nivel + "], Clã: [" + iniciado.clan + "]\\n" +
"- Atributos: Vontade [" + (atr.vontade || 10) + "], Gnose [" + (atr.gnose || 10) + "], Densidade [" + (atr.densidade || 10) + "]\\n" +
"- Mortais Secos: [" + (stats.mortaisSecos || 0) + "], Vitórias PvP: [" + (stats.vitoriasPvP || 0) + "]\\n\\n" +
"Crie um TALENTO PASSIVO MÍSTICO / SELO AKÁSHICO ÚNICO alinhado aos mistérios ocultos (Grimório de Salomão, Goétia, O Caibalion, Enoquiano ou Esferas de Qliphoth).\\n" +
"Mecânicas válidas: 'ataque', 'defesa', 'vampirismo', 'magia'.\\n" +
"Multiplicador balanceado entre 1.15 e 1.45.\\n\\n" +
"RETORNE JSON EXATO:\\n{\\n  \\"nome\\": \\"Selo de Bael: Presas das Trevas\\",\\n  \\"desc\\": \\"1 a 2 frases explicando o efeito sobrenatural no fluxo de poder do jogador.\\",\\n  \\"tipo_mecanica\\": \\"ataque\\",\\n  \\"multiplicador\\": 1.25\\n}";

        try {
            const raw = await this.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS. " + this.promptSupremo },
                { role: "user", content: prompt }
            ], { json: true, temperature: 0.8 });
            const json = this._extrairJson(raw);
            if (json && json.nome && json.tipo_mecanica) {
                if (!json.multiplicador || isNaN(json.multiplicador)) json.multiplicador = 1.25;
                return json;
            }
        } catch (e) {
            console.error("Falha ao despertar habilidade única:", e);
        }

        return this.gerarFallbackOculto('talento', { iniciado, atr });
    }

    async gerarPactoProcedural(iniciado) {
        const stats = iniciado.estatisticas || {};
        const prompt = "Crie uma QUEST DE PACTO SOMBRIO procedural para o acólito [" + iniciado.nome + "] (Nível " + (iniciado.nivel || 1) + ", Clã " + (iniciado.clan || 'Sangue Ralo') + ").\\n" +
"O recurso exigido deve ser EXATAMENTE UM DESTES: 'anima', 'cinzas', 'vitae', 'ferroNegro', 'mandragora', 'pedraAlma', ou 'ectoplasma'.\\n" +
"Quantidade proporcional ao nível (entre 2 e 8). Recompensa de XP proporcional (entre 250 e 1000).\\n\\n" +
"RETORNE JSON EXATO:\\n{\\n  \\"titulo\\": \\"A Oferenda de Asmodeus\\",\\n  \\"descricao\\": \\"Frase sombria e visceral detalhando a exigência do pacto com as forças do abismo.\\",\\n  \\"recursoExigido\\": \\"cinzas\\",\\n  \\"quantidade\\": 3,\\n  \\"recompensaXP\\": 350\\n}";

        try {
            const raw = await this.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS. " + this.promptSupremo },
                { role: "user", content: prompt }
            ], { json: true, temperature: 0.8 });
            const json = this._extrairJson(raw);
            if (json && json.titulo && json.recursoExigido) {
                if (!json.quantidade) json.quantidade = 3;
                if (!json.recompensaXP) json.recompensaXP = 300;
                return json;
            }
        } catch (e) {
            console.error("Falha ao gerar pacto procedural:", e);
        }

        return this.gerarFallbackOculto('pacto', { iniciado });
    }

    // Avaliar os estudos do jogador e dar Nota
    async avaliarEstudoAkashico(iniciado, titulo, conteudoAtual, novaPesquisa) {
        try {
            const prompt = "Acólito: " + iniciado.nome + ". Título do Tratado: \\"" + titulo + "\\". Texto Atual: \\"" + (conteudoAtual || '').substring((conteudoAtual || '').length - 1200) + "\\". Nova Pesquisa Proposta: \\"" + novaPesquisa + "\\".\\n" +
"MISSÃO: Avalie a autenticidade e profundidade esotérica (Hermetismo, Goétia, Cabala, Enoquiano). Dê uma NOTA de 1 a 100. Depois escreva a continuação mágica em 2 a 3 parágrafos poéticos e reveladores.\\n" +
"RETORNE JSON EXATO: { \\"texto\\": \\"A revelação profunda dos antigos planos...\\", \\"nota\\": 85 }";
            
            const raw = await this.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS. " + this.promptSupremo },
                { role: "user", content: prompt }
            ], { json: true, temperature: 0.8 });
            const json = this._extrairJson(raw);
            if (json && json.texto) return json;
        } catch (e) {}
        return {
            texto: "Nas entrelinhas do éter, as palavras de " + novaPesquisa + " conectam-se à Primeira Lei Hermética: O Todo é Mente; o Universo é Mental. A vibração das trevas responde à tua busca com gnose renovada.",
            nota: 75
        };
    }

    async forjarRitualDoManuscrito(iniciado, titulo, conteudo) {
        try {
            const prompt = "Crie um FEITIÇO RITUALÍSTICO em JSON baseado neste grimório: \\"" + titulo + "\\". Texto: \\"" + (conteudo || '').substring(0, 1000) + "\\".\\n" +
"JSON EXATO: { \\"nome\\": \\"Nome do Feitiço\\", \\"lore\\": \\"Frase épica.\\", \\"custoAcao\\": 4, \\"custoSangue\\": 1500, \\"reqLevel\\": " + Math.max(1, (iniciado.nivel || 1)) + ", \\"tipo\\": \\"pvp\\", \\"poderBase\\": " + Math.max(200, (iniciado.nivel || 1) * 90) + " }";
            const raw = await this.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS. " + this.promptSupremo },
                { role: "user", content: prompt }
            ], { json: true, temperature: 0.8 });
            const json = this._extrairJson(raw);
            if (json && json.nome) return json;
        } catch (e) {}
        return {
            nome: "Rito Ancestral de " + titulo.substring(0, 20),
            lore: "Uma conjuração ancestral extraída dos pergaminhos negros da biblioteca.",
            custoAcao: 4,
            custoSangue: 1200,
            reqLevel: Math.max(1, iniciado.nivel || 1),
            tipo: "pvp",
            poderBase: Math.max(250, (iniciado.nivel || 1) * 80)
        };
    }

    async forjarReliquiaDoManuscrito(iniciado, titulo, conteudo) {
        try {
            const prompt = "Crie uma RELÍQUIA / ARMA MÍSTICA em JSON baseada neste texto esotérico: \\"" + (conteudo || '').substring(0, 1000) + "\\". Defina o Arquétipo RPG (Agressão, Ocultismo, Baluarte, Sanguessuga).\\n" +
"JSON EXATO: {\\"nome\\":\\"Nome da Relíquia\\",\\"tipo\\":\\"arma\\", \\"arquetipo\\": \\"Ocultismo (Mago)\\", \\"bonusBaseCustom\\": {\\"vontade\\": 15, \\"gnose\\": 120, \\"magnetismo\\": 20, \\"densidade\\": 10}}";
            const raw = await this.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS. " + this.promptSupremo },
                { role: "user", content: prompt }
            ], { json: true, temperature: 0.8 });
            const json = this._extrairJson(raw);
            if (json && json.nome) return json;
        } catch (e) {}
        return {
            nome: "Relíquia de " + titulo.substring(0, 20),
            tipo: "arma",
            arquetipo: "Ocultismo (Mago)",
            bonusBaseCustom: { vontade: 10, gnose: 80, magnetismo: 15, densidade: 10 }
        };
    }`;
        content = content.replace(fullOld, newMetodos);
        console.log("✅ Oráculo: vozDoDemonio até forjarReliquiaDoManuscrito atualizados!");
    }
}

// 4. despertarTalento
const idxTalento = content.indexOf('async despertarTalento(vampiroId) {');
if (idxTalento !== -1) {
    const endTalento = content.indexOf('}', content.indexOf('A Mente Abissal injetou', idxTalento));
    if (endTalento !== -1) {
        const fullOld = content.substring(idxTalento, endTalento + 1);
        const newTalento = `async despertarTalento(vampiroId) {
        const v = this.vampiros[vampiroId];
        if (!v) return { erro: "Alma inexistente." };
        
        if (!v.talentosAtivos) v.talentosAtivos = [];
        const nivelMinimo = 5;
        if ((v.nivel || 1) < nivelMinimo) return { erro: "A Mente Abissal exige ao menos o Grau " + nivelMinimo + " para o Despertar Akáshico." };

        let limiteTalentos = Math.max(1, Math.floor((v.nivel || 1) / 5) + (v.conquistas ? v.conquistas.length : 0));
        if (v.talentosAtivos.length >= limiteTalentos) return { erro: "Atingiste o limite da tua Constelação (" + limiteTalentos + " talentos). Sobe mais de Grau ou obtém conquistas." };
        
        let custoGts = 1500 + (v.talentosAtivos.length * 2000);
        let custoFuria = 5 + (v.talentosAtivos.length * 5);

        if ((v.sangue || 0) < custoGts || (v.pontosAcao || 0) < custoFuria) {
            return { erro: "O Selo Akáshico exige " + custoGts + " Gts e " + custoFuria + " Fúria." };
        }

        v.sangue -= custoGts;
        v.pontosAcao -= custoFuria;
        
        const talento = await this.oraculo.despertarHabilidadeUnica(v);
        if (!talento) {
            v.sangue += custoGts;
            v.pontosAcao += custoFuria;
            return { erro: "O Abismo recusou a oferenda. Tenta novamente." };
        }
            
        v.talentosAtivos.push(talento);
        this._registrarEventoEspecial('global', 'SELO AKÁSHICO DESPERTO', "A alma de " + v.nome + " ascendeu perante os mistérios antigos! Despertou o Selo Akáshico: [" + talento.nome + "]!", true);
        this._salvarBancoDeDados();
        return { sucesso: true, talento, relato: "A Mente Abissal gravou o Selo [" + talento.nome + "] na tua essência: " + talento.desc };
    }`;
        content = content.replace(fullOld, newTalento);
        console.log("✅ despertarTalento atualizado!");
    }
}

// 5. conversarComOraculo
const idxConv = content.indexOf('async conversarComOraculo(vampiroId, mensagem) {');
if (idxConv !== -1) {
    const endConv = content.indexOf('}', content.indexOf('return respostaIA;', idxConv));
    if (endConv !== -1) {
        const fullOld = content.substring(idxConv, endConv + 1);
        const newConv = `async conversarComOraculo(vampiroId, mensagem) {
        const v = this.vampiros[vampiroId]; if(!v) return;
        let respostaIA = await this.oraculo.conversarNoChat(v, mensagem);
        if (!respostaIA) return "O Abismo observa em silêncio absoluto.";

        let efeitosExecutados = [];

        // 1. DAR SANGUE (DAR_SANGUE ou GOTA)
        const regexDarSangue = /\\[DAR_SANGUE:\\s*({.*?})\\s*\\]/is;
        const matchDarSangue = respostaIA.match(regexDarSangue);
        if (matchDarSangue) {
            try {
                const dados = JSON.parse(matchDarSangue[1].replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim());
                const qtd = parseInt(dados.qtd) || 300;
                v.sangue = (v.sangue || 0) + qtd;
                efeitosExecutados.push("🩸 +" + qtd + " Gts (" + (dados.motivo || 'concedidas pelo Mestre') + ")");
                respostaIA = respostaIA.replace(regexDarSangue, '').trim();
            } catch(e) { console.error("Erro parsing DAR_SANGUE:", e); }
        } else {
            const regexGota = /\\[GOTA:\\s*(\\d+)\\]/i;
            const matchGota = respostaIA.match(regexGota);
            if (matchGota && matchGota[1]) {
                const qtdGota = parseInt(matchGota[1]);
                v.sangue = (v.sangue || 0) + qtdGota;
                efeitosExecutados.push("🩸 +" + qtdGota + " Gts injetadas nas tuas veias");
                respostaIA = respostaIA.replace(regexGota, '').trim();
            }
        }

        // 2. DAR ITEM / MATERIAIS
        const regexDarItem = /\\[DAR_ITEM:\\s*({.*?})\\s*\\]/is;
        const matchDarItem = respostaIA.match(regexDarItem);
        if (matchDarItem) {
            try {
                const dados = JSON.parse(matchDarItem[1].replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim());
                const itemKey = dados.item || 'ferroNegro';
                const qtd = parseInt(dados.qtd) || 1;
                if (!v.materiais) v.materiais = { ferroNegro: 0, pedra: 0, mandragora: 0 };
                if (!v.inventario) v.inventario = { anima: 0, cinzas: 0, vitae: 0, ectoplasma: 0, pedraAlma: 0 };

                if (v.materiais[itemKey] !== undefined) {
                    v.materiais[itemKey] = (v.materiais[itemKey] || 0) + qtd;
                } else if (v.inventario[itemKey] !== undefined) {
                    v.inventario[itemKey] = (v.inventario[itemKey] || 0) + qtd;
                } else {
                    v.materiais['ferroNegro'] = (v.materiais['ferroNegro'] || 0) + qtd;
                }
                efeitosExecutados.push("📦 +" + qtd + "x [" + (dados.nome || itemKey) + "] materializado na tua posse");
                respostaIA = respostaIA.replace(regexDarItem, '').trim();
            } catch(e) { console.error("Erro parsing DAR_ITEM:", e); }
        }

        // 3. CONJURAR DEMÔNIO / FENDA ASTRAL (BOSS NO CONCLAVE)
        const regexDem = /\\[CONJURAR_DEMONIO:\\s*({.*?})\\s*\\]/is;
        const matchDem = respostaIA.match(regexDem);
        if (matchDem) {
            try {
                const dados = JSON.parse(matchDem[1].replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim());
                const fendaId = crypto.randomBytes(4).toString('hex');
                const hpFinal = parseInt(dados.hp) || (Math.max(1, v.nivel || 1) * 1000);
                const nomeDemonio = dados.nome || "Arauto Goétia Invocado";
                this.fendaAtiva[fendaId] = {
                    id: fendaId,
                    nome: nomeDemonio,
                    hpMax: hpFinal,
                    hpAtual: hpFinal,
                    dano: parseInt(dados.dano) || 120,
                    loot: dados.loot || "pedraAlma",
                    criador: v.nome
                };
                efeitosExecutados.push("👹 DEMÔNIO CONJURADO NO CONCLAVE: [" + nomeDemonio + "]");
                respostaIA = respostaIA.replace(regexDem, '').trim();
                this._registrarEventoEspecial('global', 'CONJURAÇÃO DO MESTRE', "O Mestre das Sombras rasgou o Véu e manifestou o demônio [" + nomeDemonio + "] perante " + v.nome + "! Conclave em chamas!", true);
            } catch(e) { console.error("Erro parsing CONJURAR_DEMONIO:", e); }
        } else {
            const regexFenda = /\\[FENDA_ASTRAL:\\s*({.*?})\\s*\\]/is;
            const matchFenda = respostaIA.match(regexFenda);
            if (matchFenda) {
                try {
                    let fendaTxt = matchFenda[1].replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
                    const dadosFenda = JSON.parse(fendaTxt);
                    const fendaId = crypto.randomBytes(4).toString('hex');
                    let hpFinal = parseInt(dadosFenda.hp) || ((v.nivel || 1) * 500);
                    this.fendaAtiva[fendaId] = { 
                        id: fendaId, 
                        nome: dadosFenda.nome || "Aberração Sem Nome", 
                        hpMax: hpFinal, hpAtual: hpFinal, 
                        dano: parseInt(dadosFenda.dano) || 100, 
                        loot: dadosFenda.loot || "cinzas", 
                        criador: v.nome 
                    };
                    efeitosExecutados.push("🌌 FENDA DO CONCLAVE ABERTA: [" + this.fendaAtiva[fendaId].nome + "]");
                    respostaIA = respostaIA.replace(regexFenda, '').trim();
                    this._registrarEventoEspecial('global', 'A FENDA ABRIU', "A Malha rasgou-se! O Oráculo conjurou a entidade [" + this.fendaAtiva[fendaId].nome + "] a pedido de " + v.nome + "! Destruam-na no Conclave!", true);
                } catch (e) { console.error("Falha ao injetar fenda.", e); }
            }
        }

        // 4. CASTIGAR
        const regexCastigo = /\\[CASTIGAR:\\s*({.*?})\\s*\\]/is;
        const matchCastigo = respostaIA.match(regexCastigo);
        if (matchCastigo) {
            try {
                const dados = JSON.parse(matchCastigo[1].replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim());
                const qtdDreno = parseInt(dados.qtd) || 200;
                v.sangue = Math.max(0, (v.sangue || 0) - qtdDreno);
                v.pontosAcao = Math.max(0, (v.pontosAcao || 0) - 5);
                efeitosExecutados.push("⚡ CASTIGO DO MESTRE: -" + qtdDreno + " Gts e -5 Fúria (" + (dados.motivo || 'insolência') + ")");
                respostaIA = respostaIA.replace(regexCastigo, '').trim();
            } catch(e) { console.error("Erro parsing CASTIGAR:", e); }
        }

        // 5. REJEITAR
        const regexRejeitar = /\\[REJEITAR:\\s*["']?(.*?)["']?\\]/is;
        const matchRejeitar = respostaIA.match(regexRejeitar);
        if (matchRejeitar) {
            respostaIA = respostaIA.replace(regexRejeitar, '').trim();
        }

        if (efeitosExecutados.length > 0) {
            respostaIA += "\\n\\n*(Manifestação Oculta em Tempo Real: " + efeitosExecutados.join(' | ') + ")*";
            if (global.io) {
                global.io.to("priv_" + v.id).emit('tick');
                global.io.emit('sync_geral');
            }
        }
        
        this._salvarBancoDeDados(); 
        return respostaIA;
    }`;
        content = content.replace(fullOld, newConv);
        console.log("✅ conversarComOraculo atualizado!");
    }
}

// 6. darOrdemServoIA
const idxServo = content.indexOf('async darOrdemServoIA(vampiroId, servoId, comandoTexto) {');
if (idxServo !== -1) {
    const endServo = content.indexOf('coletarTributosServo(vampiroId, servoId) {', idxServo);
    if (endServo !== -1) {
        const fullOld = content.substring(idxServo, endServo);
        const newServo = `async darOrdemServoIA(vampiroId, servoId, comandoTexto) {
        const v = this.vampiros[vampiroId];
        if (!v || !v.servos) return { erro: "Fantasma." };
        const servo = v.servos.find(s => s.id === servoId);
        if (!servo) return { erro: "Servo não encontrado." };

        let promptIA = "O Lorde Sombrio ordenou ao seu escravo morto-vivo: \\"" + comandoTexto + "\\".\\n" +
"Classifique a ordem EXATAMENTE em UMA destas categorias: \\n" +
"1. \\"farmar_ouro\\" (Se ele mandou buscar dinheiro, sangue, caçar)\\n" +
"2. \\"farmar_recursos\\" (Se ele mandou buscar materiais, anima, cinzas)\\n" +
"3. \\"protocolo_ressurreicao\\" (Se ele mandou prepararem-se para o reviver caso ele morra)\\n" +
"4. \\"espionar_inimigos\\" (Se mandou vigiar outros jogadores ou roubar influência)\\n" +
"5. \\"forjar_armas\\" (Se mandou construir equipamento ou relíquias)\\n" +
"6. \\"idle\\" (Qualquer outra coisa)\\n\\n" +
"RETORNE APENAS UM JSON EXATO: {\\"categoria\\": \\"farmar_ouro\\", \\"fala_do_servo\\": \\"Sim mestre, vou cumprir o seu desejo.\\"}";

        try {
            const raw = await this.oraculo.chamarLLMResiliente([
                { role: "system", content: "JSON APENAS. És a entidade que comanda os servos mortos-vivos." },
                { role: "user", content: promptIA }
            ], { json: true, temperature: 0.7 });
            const intencao = this.oraculo._extrairJson(raw);
            
            if (intencao && intencao.categoria) {
                servo.ordemAtual = intencao.categoria;
                servo.relato = intencao.fala_do_servo || "Sim, meu soberano.";
                this._salvarBancoDeDados();
                return { sucesso: true, relato: "[" + servo.nome + "]: \\"" + servo.relato + "\\" (Comando aceite: " + servo.ordemAtual + ")" };
            }
        } catch (e) {}

        // Fallback inteligente baseado nas palavras-chave do comando
        const txt = (comandoTexto || '').toLowerCase();
        if (txt.includes('sangue') || txt.includes('ouro') || txt.includes('caçar') || txt.includes('dinheiro')) {
            servo.ordemAtual = 'farmar_ouro';
            servo.relato = "Farei sangrar os fracos para saciar o vosso tesouro.";
        } else if (txt.includes('material') || txt.includes('cinza') || txt.includes('recurso') || txt.includes('pedra') || txt.includes('ferro')) {
            servo.ordemAtual = 'farmar_recursos';
            servo.relato = "Vou desenterrar os materiais das catacumbas.";
        } else if (txt.includes('reviver') || txt.includes('vida') || txt.includes('morte') || txt.includes('ressurreição')) {
            servo.ordemAtual = 'protocolo_ressurreicao';
            servo.relato = "Permanecerei em vigília para reanimar a vossa essência se caíres.";
        } else if (txt.includes('vigiar') || txt.includes('espionar') || txt.includes('inimigo')) {
            servo.ordemAtual = 'espionar_inimigos';
            servo.relato = "As minhas sombras seguirão os passos dos vossos rivais.";
        } else if (txt.includes('forjar') || txt.includes('arma') || txt.includes('relíquia')) {
            servo.ordemAtual = 'forjar_armas';
            servo.relato = "Trabalharei o ferro negro na forja silenciosa.";
        } else {
            servo.ordemAtual = 'idle';
            servo.relato = "Aguardando novas ordens do mestre.";
        }
        this._salvarBancoDeDados();
        return { sucesso: true, relato: "[" + servo.nome + "]: \\"" + servo.relato + "\\" (Comando aceite: " + servo.ordemAtual + ")" };
    }

    `;
        content = content.replace(fullOld, newServo);
        console.log("✅ darOrdemServoIA atualizado!");
    }
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log("🔥 ShadowCore.js gravado com sucesso!");
