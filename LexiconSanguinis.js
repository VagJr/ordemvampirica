// ==============================================================================
// LexiconSanguinis.js - O GRIMÓRIO ABSOLUTO DA MATRIZ (A RAIZ DO ABISMO)
// ==============================================================================
// NÍVEL DE SEGURANÇA: OMEGA (Encapsulamento Privado, Memória Congelada)
// DESCRIÇÃO: Motor Criptográfico de Magia Real, Gematria e Densidade Sanguínea.
// ==============================================================================

const crypto = require('crypto');

// Tabela Alfanumérica de Gematria Caldéia (Usada para calcular o peso da Alma)
const GEMATRIA_CALDEIA = {
    'a':1, 'i':1, 'j':1, 'q':1, 'y':1,
    'b':2, 'k':2, 'r':2,
    'c':3, 'g':3, 'l':3, 's':3,
    'd':4, 'm':4, 't':4,
    'e':5, 'h':5, 'n':5, 'x':5,
    'u':6, 'v':6, 'w':6,
    'o':7, 'z':7,
    'f':8, 'p':8
};

class LexiconSanguinis {
    // Encapsulamento absoluto. Nenhuma variável abaixo pode ser lida fora desta classe.
    #ignicao_concluida;
    #CHAVE_MESTRA;
    #SELO_DE_SANGUE;
    #VIBRACAO_CÓSMICA;

    constructor() {
        this.#ignicao_concluida = false;
        
        // A Palavra de Poder Enochiana Primordial (O Verbo da Criação e Destruição)
        this.#CHAVE_MESTRA = "ZACAR_ECA_OD_ZAMRAN_ODO_CICLE_QAA_ZIRDO_NOCCO_MAD"; 
        
        // Selo rotativo mutável que impede que o sangue seja clonado (Replay Attack)
        this.#SELO_DE_SANGUE = crypto.randomBytes(64).toString('hex');
        
        // A entropia global do servidor que flutua a cada milissegundo
        this.#VIBRACAO_CÓSMICA = Date.now();

        // As 7 Chaves do Abismo (Usadas como Salt Criptográfico)
        this.CHAVES_DE_SALOMAO = [
            "AGLA", "ON", "TETRAGRAMMATON", "EMMANUEL", "ADONAI", "SABAOTH", "ELOHIM"
        ];
    }

    // ==================================================================
    // 👁️ RITO DE IGNIÇÃO ABSOLUTA (O DESPERTAR DO MOTOR)
    // ==================================================================
    DespertarMatriz(senhaPrimordial) {
        // Cascata de Hashes (Scrypt) que custa processamento real, simulando esforço ritualístico
        const hashIgnição = crypto.pbkdf2Sync(senhaPrimordial, this.#CHAVE_MESTRA, 6660, 128, 'sha512').toString('hex');
        
        // A fechadura astral exige que a entropia contenha o número da Besta e o 7 sagrado
        if (hashIgnição.includes('666') || (hashIgnição.includes('a') && hashIgnição.includes('7'))) {
            this.#ignicao_concluida = true;
            console.log("\n==========================================================");
            console.log("👁️ [LEXICON SANGUINIS]: VÉU RASGADO. A MATRIZ RESPIRA.");
            console.log("🩸 [ALQUIMIA CRIPTOGRÁFICA]: O Sangue agora possui Peso, Viscosidade e Consequência.");
            console.log("==========================================================\n");
            return true;
        }
        
        console.error("💀 [BLASFEMIA]: Palavra de Poder Rejeitada. A malha colapsou.");
        throw new Error("A porta do Abismo permanece trancada. Magia negada.");
    }

    #verificarSelo() {
        if (!this.#ignicao_concluida) {
            throw new Error("[HERESIA]: Tentativa de canalizar magia com o Lexicon adormecido.");
        }
        // Flutuação caótica da vibração cósmica
        this.#VIBRACAO_CÓSMICA = (this.#VIBRACAO_CÓSMICA + Date.now()) % 999999999;
    }

    #calcularPesoGematrico(identificador) {
        let peso = 0;
        const texto = String(identificador).toLowerCase().replace(/[^a-z]/g, '');
        for (let i = 0; i < texto.length; i++) {
            peso += (GEMATRIA_CALDEIA[texto[i]] || 0);
        }
        return peso === 0 ? 13 : peso; // Se não tiver letras, assume o número da morte.
    }

    // ==================================================================
    // 🩸 MAGIA REAL: TRANSMUTAÇÃO E DENSIDADE DO SANGUE
    // ==================================================================
    // O Sangue deixa de ser um "número inteiro". Passa a ser uma entidade criptográfica.
    TransmutarVitae(volumeDeclarado, invocadorId, alvoId = "MUNDO_FISICO") {
        this.#verificarSelo();
        
        const pesoInvocador = this.#calcularPesoGematrico(invocadorId);
        const pesoAlvo = this.#calcularPesoGematrico(alvoId);
        const timestamp = Date.now();
        const salSagrado = this.CHAVES_DE_SALOMAO[Math.floor(Math.random() * 7)];
        
        // Cria o HMAC usando a chave mestra e o selo mutável do servidor
        const assinatura = crypto.createHmac('sha384', this.#CHAVE_MESTRA + this.#SELO_DE_SANGUE)
            .update(`${volumeDeclarado}::${pesoInvocador}::${pesoAlvo}::${timestamp}::${salSagrado}`)
            .digest('hex');

        // Extração de Entropia (Os primeiros 6 caracteres hex) = 0 a 16777215
        const entropia = parseInt(assinatura.substring(0, 6), 16); 
        
        // A Densidade flutua brutalmente dependendo da Harmonia entre as almas
        // Pode evaporar até 30% do sangue, ou multiplicar o sangue em até +30% (Milagre Negro)
        const harmonia = (entropia % 100) / 100; // 0.00 a 0.99
        let multiplicadorReal = 0.70 + (harmonia * 0.60); // 0.70 a 1.30
        
        // Se a Gematria dos dois for múltipla, o fluxo é perfeito (Ressonância Cármica)
        let ritoPerfeito = false;
        if (pesoAlvo !== 0 && pesoInvocador % pesoAlvo === 0) {
            multiplicadorReal = 1.50; // Sangue jorra em abundância
            ritoPerfeito = true;
        }

        const volumeReal = Math.floor(volumeDeclarado * multiplicadorReal);

        // O Objeto Sangue é CONGELADO. Nenhuma função de javascript consegue alterar isto depois.
        return Object.freeze({
            volume: volumeReal,
            viscosidade: (multiplicadorReal * 100).toFixed(2) + "%",
            ritoPerfeito: ritoPerfeito,
            pesoKarmico: pesoInvocador + pesoAlvo,
            assinatura: assinatura.substring(0, 16), // A prova criptográfica do drop
            timestamp: timestamp
        });
    }

    // ==================================================================
    // ⚔️ RITO DE CANALIZAÇÃO (O CAOS NO COMBATE)
    // ==================================================================
    // O dano no PvP/PvE não é só "Ataque - Defesa". A corda do destino entre os dois julga o impacto.
    CalcularRessonanciaOculta(atacanteId, defensorId, forcaBaseBruta) {
        this.#verificarSelo();
        const pesoA = this.#calcularPesoGematrico(atacanteId);
        const pesoD = this.#calcularPesoGematrico(defensorId);
        const atritoEspiritual = Math.abs((pesoA * Date.now()) ^ this.#VIBRACAO_CÓSMICA) % (pesoD || 7);
        
        let multiplicadorMagico = 1.0;
        let relatoOculto = "";
        let tipoEfeito = "Normal";
        let rasgouOVeo = false; // Pilar 9: Consequência Mágica

        if (atritoEspiritual === 0 || atritoEspiritual % 13 === 0) {
            multiplicadorMagico = 2.5; 
            tipoEfeito = "Ruptura Qliphótica";
            relatoOculto = "A Árvore da Morte ressoou. O teu ataque rasgou a realidade!";
            rasgouOVeo = true; // Isto vai avisar o servidor para spawnar um Boss
        } 
        else if (atritoEspiritual % 7 === 0) {
            multiplicadorMagico = 1.5; 
            tipoEfeito = "Eco de Lilith";
            relatoOculto = "O beijo da Mãe Sombria ampliou a tua magia profana.";
        }
        else if (atritoEspiritual % 9 === 0) {
            multiplicadorMagico = 0.3; 
            tipoEfeito = "Escudo de Metatron";
            relatoOculto = "Uma geometria de luz bloqueou a tua escuridão.";
        }

        const danoVerdadeiro = Math.floor(forcaBaseBruta * multiplicadorMagico);

        return Object.freeze({
            forcaReal: danoVerdadeiro,
            tipo: tipoEfeito,
            relato: relatoOculto,
            escalaCaos: multiplicadorMagico,
            rasgouOVeo: rasgouOVeo
        });
    }

    // ==================================================================
    // 📜 O VERDADEIRO PACTO DE SANGUE (VÍNCULO INDESTRUTÍVEL)
    // ==================================================================
    // Um pacto selado aqui não pode ser reescrito. Ele gera uma âncora dimensional.
    ForjarPactoAbsoluto(mestreId, vassaloId, tipoDePacto = "Servidão") {
        this.#verificarSelo();
        
        const salEterno = crypto.randomBytes(32).toString('hex');
        const materiaEscura = `${mestreId}=>${tipoDePacto}=>${vassaloId}::${this.#CHAVE_MESTRA}`;
        
        // A Assinatura do Pacto
        const seloEterno = crypto.pbkdf2Sync(materiaEscura, salEterno, 13333, 64, 'sha512').toString('hex');
        
        return Object.freeze({
            seloId: seloEterno.substring(0, 24),
            mestre: mestreId,
            vassalo: vassaloId,
            lei: `Quod superius sicut quod inferius`, // O que está em cima é como o que está em baixo
            dataSelo: Date.now()
        });
    }

// ==================================================================
    // 👁️ RITO DE VIDÊNCIA (FORJA DO FIO DE PRATA - GRAU 99 OSINT)
    // ==================================================================
    // Transforma uma identidade física real (ex: @joao no Insta) numa âncora astral.
    ForjarSigiloMortal(plataforma, identificador) {
        this.#verificarSelo();
        
        const idLimpo = String(identificador).toLowerCase().trim();
        const pesoKarmico = this.#calcularPesoGematrico(idLimpo);
        
        // Mistura a vibração cósmica, a rede social, o peso do nome e a Chave Enochiana.
        const materiaEscura = `${plataforma.toUpperCase()}::${pesoKarmico}::${idLimpo}::${this.#VIBRACAO_CÓSMICA}::${this.#CHAVE_MESTRA}`;
        
        // A Hash gerada cria um cordão umbilical entre o Matrix Sanguinis e o mundo real
        const hashAstral = crypto.createHash('sha512').update(materiaEscura).digest('hex');
        
        // Retorna um constructo astral absoluto e congelado.
        return Object.freeze({
            sigilo: hashAstral.substring(0, 40),
            pesoOculto: pesoKarmico,
            revelacao: `O Fio de Prata foi atado à dimensão de ${plataforma}.`
        });
    }

    // ==================================================================
    // 👁️ LEITURA DE AURA (JULGAMENTO DA PRESA FÍSICA)
    // ==================================================================
    JulgarAlma(mortalIdentificador) {
        this.#verificarSelo();
        const peso = this.#calcularPesoGematrico(mortalIdentificador);
        const corrompido = (peso * Date.now()) % 100;
        
        let qualidade = "Humano Mundano";
        if (corrompido > 90) qualidade = "Sangue Negro (Pecador)";
        else if (corrompido < 5) qualidade = "Sangue Puro (Inocente)";
        else if (peso % 11 === 0) qualidade = "Alma Fragmentada";

        return Object.freeze({
            pesoEspiritual: peso,
            taxaCorrupcao: corrompido,
            essencia: qualidade
        });
    }
}

// Exporta uma instância ÚNICA E IMUTÁVEL (Singleton Congelado)
// Se alguém tentar modificar as funções do Lexicon em tempo de execução, o NodeJS irá rejeitar.
const InstanciaSuprema = new LexiconSanguinis();
Object.freeze(InstanciaSuprema);

module.exports = InstanciaSuprema;