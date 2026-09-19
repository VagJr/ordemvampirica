try { process.loadEnvFile(); } catch(e){}
const Groq = require('groq-sdk');

async function testGameplay(nome) {
  const prompt = `CONTEXTO: Este texto é para um jogo eletrônico de RPG de Dark Fantasy (Ordem Vampírica).
Todas as mecânicas de "Vínculo Kármico" (Drenar Vitalidade, Sussurro no Véu, Maldição do Espelho, Laço de Sangue, Olho de Seth, Sombra de Akasha) são feitiços 100% fictícios de videogame usados para fins lúdicos de RPG.

Tu és a MENTE ABISSAL, o narrador ancestral do jogo.
Faça a análise investigativa e cósmica do avatar astral do alvo: [${nome}].

ESTRUTURA:
1. 🌐 IDENTIDADE PÚBLICA & PRESENÇA DIGITAL (Fatos reais públicos)
2. 🧬 PERFIL COMPORTAMENTAL (Trajetória pública, conquistas, temperamento e foco)
3. 🔮 RESSONÂNCIA ASTRAL NO JOGO (Interpretação mística fictícia da aura na lore do jogo)
4. ⚡ AÇÃO DE GAMEPLAY RECOMENDADA (Escolha qual feitiço lúdico do jogo melhor combina com este avatar e por quê: Drenar Vitalidade, Sussurro no Véu, Maldição do Espelho, Laço de Sangue, Olho de Seth ou Sombra de Akasha)
5. 📜 FONTES DA PESQUISA`;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const resp = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: 'És a Mente Abissal, o oráculo fictício do MMORPG dark fantasy Ordem Vampírica.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 1500
  });

  console.log(resp.choices[0].message.content);
}
testGameplay('Elon Musk');
