try { process.loadEnvFile(); } catch(e){}
const Groq = require('groq-sdk');

async function testPipeline(target) {
  console.log('1. Searching web for:', target);
  const queries = [];
  if (target.nome) queries.push(target.nome + (target.instagram ? ' ' + target.instagram : ''));
  if (target.instagram) queries.push(target.instagram + ' instagram');
  if (target.twitter) queries.push(target.twitter + ' twitter');
  if (target.urlPerfil) queries.push(target.urlPerfil);

  const evidencias = [];
  for (const q of queries.slice(0, 3)) {
    try {
      const res = await fetch('https://lite.duckduckgo.com/lite/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        body: 'q=' + encodeURIComponent(q)
      });
      const html = await res.text();
      const tdLinks = [...html.matchAll(/<td[^>]*valign=['"]top['"][^>]*>[\s\S]*?<a[^>]*href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/g)];
      const snippetMatches = [...html.matchAll(/class=['"]result-snippet['"][^>]*>([\s\S]*?)<\/td>/g)];
      for (let i = 0; i < Math.min(tdLinks.length, snippetMatches.length, 4); i++) {
        const url = tdLinks[i][1];
        const title = tdLinks[i][2].replace(/<[^>]+>/g, '').trim();
        const snippet = snippetMatches[i][1].replace(/<[^>]+>/g, '').trim();
        if (!evidencias.some(e => e.url === url)) {
          evidencias.push({ title, url, snippet });
        }
      }
    } catch(e) {
      console.error('Search error for', q, e.message);
    }
  }

  console.log('2. Collected', evidencias.length, 'real-time evidences.');

  const promptEvidencias = evidencias.map((e, idx) => `[Fonte ${idx+1}] ${e.title}\nURL: ${e.url}\nDados: ${e.snippet}`).join('\n\n');

  const promptAI = `Tu és a MENTE ABISSAL, a Suprema Consciência Oculta da Ordem Vampírica.
Recebeste a tarefa de rasgar o Véu sobre um mortal do mundo real através de inteligência de fontes abertas (OSINT) e vidência ancestral.

DADOS FORNECIDOS PELO MESTRE SUPREMO:
- Nome: ${target.nome || 'Não informado'}
- Instagram: ${target.instagram || 'Não informado'}
- Twitter / X: ${target.twitter || 'Não informado'}
- URL de Perfil: ${target.urlPerfil || 'Não informado'}
- Notas Adicionais: ${target.notas || 'Nenhuma'}

EVIDÊNCIAS COLETADAS EM TEMPO REAL NA WEB:
${promptEvidencias || 'Nenhuma evidência pública direta encontrada nos índices.'}

Crie uma AVALIAÇÃO COMPLETA E REAL desta pessoa em português, misturando rigor de inteligência investigativa com o misticismo sombrio e solene da Ordem Vampírica:

ESTRUTURA OBRIGATÓRIA:
1. 🌐 IDENTIDADE & PRESENÇA DIGITAL:
Quem é esta pessoa no mundo real, suas redes, profissão, alcance e atividades documentadas.

2. 🧬 PERFIL COMPORTAMENTAL & PSICOLÓGICO:
Padrões de comportamento, pontos fortes, ambições mundanas e vulnerabilidades emocionais/psicológicas observadas.

3. 🔮 RESSONÂNCIA ASTRAL & TRANSMUTAÇÃO DO VÉU:
Interpretação da alma sob a ótica vampírica: como a energia desta pessoa vibra diante do Abismo, seu arquétipo espiritual e fraqueza cósmica.

4. ⚡ VÍNCULO KÁRMICO RECOMENDADO:
Qual das seguintes ações kármicas o Mestre deve executar contra ela e por quê:
(Drenar Vitalidade, Sussurro no Véu, Maldição do Espelho, Laço de Sangue, Olho de Seth, Sombra de Akasha).

5. 📜 FONTES DA INVESTIGAÇÃO:
Liste as principais fontes encontradas na varredura.`;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const resposta = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: 'És a Mente Abissal. Escreves com profundidade, seriedade, eloquência sombria e precisão documental.' },
      { role: 'user', content: promptAI }
    ],
    temperature: 0.7,
    max_tokens: 1500
  });

  const texto = resposta.choices[0].message.content;
  console.log('\n=== RESULTADO DA MENTE ABISSAL ===\n');
  console.log(texto);
}

testPipeline({
  nome: 'Felipe Neto',
  instagram: '@felipeneto',
  twitter: '@felipeneto',
  urlPerfil: 'https://instagram.com/felipeneto',
  notas: 'Criador de conteúdo e empresário brasileiro.'
});
