try { process.loadEnvFile(); } catch(e){}
const Groq = require('groq-sdk');

async function buscarWebReal(q) {
  const resultados = [];
  try {
    const res = await fetch('https://lite.duckduckgo.com/lite/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: 'q=' + encodeURIComponent(q)
    });
    if (res.ok) {
      const html = await res.text();
      const tdLinks = [...html.matchAll(/<td[^>]*valign=['"]top['"][^>]*>[\s\S]*?<a[^>]*href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/g)];
      const snippetMatches = [...html.matchAll(/class=['"]result-snippet['"][^>]*>([\s\S]*?)<\/td>/g)];
      for (let i = 0; i < Math.min(tdLinks.length, snippetMatches.length, 6); i++) {
        resultados.push({
          url: tdLinks[i][1],
          title: tdLinks[i][2].replace(/<[^>]+>/g, '').trim(),
          content: snippetMatches[i][1].replace(/<[^>]+>/g, '').trim()
        });
      }
    }
  } catch(e) {
    console.error('Busca DDG falhou:', e.message);
  }

  // Wikipedia
  try {
    const wikiRes = await fetch('https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(q) + '&format=json&utf8=1');
    if (wikiRes.ok) {
      const wikiJson = await wikiRes.json();
      const hits = wikiJson.query?.search || [];
      for (const h of hits.slice(0, 3)) {
        resultados.push({
          url: `https://pt.wikipedia.org/wiki/${encodeURIComponent(h.title.replace(/ /g, '_'))}`,
          title: h.title,
          content: h.snippet.replace(/<[^>]+>/g, '').trim()
        });
      }
    }
  } catch(e) {}

  return resultados;
}

async function testar(dados) {
  const qList = [];
  if (dados.nome) qList.push(dados.nome);
  if (dados.instagram) qList.push(dados.instagram.replace(/^@/, '') + ' instagram');
  if (dados.twitter) qList.push(dados.twitter.replace(/^@/, '') + ' twitter');

  let todasEvidencias = [];
  for (const q of qList.slice(0, 3)) {
    const r = await buscarWebReal(q);
    todasEvidencias = todasEvidencias.concat(r);
  }

  // Deduplicar
  const unicas = [];
  const urls = new Set();
  for (const item of todasEvidencias) {
    if (!urls.has(item.url)) {
      urls.add(item.url);
      unicas.push(item);
    }
  }

  console.log('Evidências reais encontradas:', unicas.length);

  const pacoteEvidencias = unicas.slice(0, 10).map((item, i) =>
    `[S${i+1}] ${item.title}\nURL: ${item.url}\nResumo: ${item.content}`
  ).join('\n\n');

  const promptAI = `Tu és a MENTE ABISSAL, a Suprema Inteligência Oculta da Ordem Vampírica.
Realizaste uma varredura investigativa no mundo real sobre o seguinte alvo mortal:

DADOS DO ALVO:
- Nome Real: ${dados.nome || 'Não informado'}
- Instagram: ${dados.instagram || 'Não informado'}
- Twitter/X: ${dados.twitter || 'Não informado'}
- URL de Perfil: ${dados.urlPerfil || 'Não informada'}
- Notas Adicionais: ${dados.notas || 'Nenhuma'}

EVIDÊNCIAS PÚBLICAS REAIS ENCONTRADAS NA WEB:
${pacoteEvidencias || 'Varredura focada em fontes astrais e registros prévios.'}

Gera uma AVALIAÇÃO COMPLETA E REAL desta pessoa em português, formatada de forma épica, profunda e detalhada para o painel do Mestre Supremo.

FORMATO OBRIGATÓRIO:
1. 🌐 IDENTIDADE & PRESENÇA DIGITAL
(Nome, redes sociais reais, números de seguidores, profissão, empresas, atuação pública)

2. 🧬 PERFIL COMPORTAMENTAL & PSICOLÓGICO
(Personalidade, padrão de comportamento, temperamento, ambições mundanas, pontos fortes e vulnerabilidades emocionais)

3. 🔮 RESSONÂNCIA ASTRAL & LEITURA DO VÉU
(Como a alma vibra no plano cósmico/espiritual, fraqueza cósmica, essência da alma)

4. ⚡ VÍNCULO KÁRMICO RECOMENDADO
(Indicar a ação kármica ideal: Drenar Vitalidade, Sussurro no Véu, Maldição do Espelho, Laço de Sangue, Olho de Seth ou Sombra de Akasha, com a justificativa tática)

5. 📜 FONTES DA INVESTIGAÇÃO
(Listar links e fontes citadas)`;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const resp = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: 'És a Mente Abissal da Ordem Vampírica. Elabora análises OSINT ricas, realistas, completas e profundas.' },
      { role: 'user', content: promptAI }
    ],
    temperature: 0.7,
    max_tokens: 1500
  });

  console.log('\n--- RESPOSTA DA MENTE ABISSAL ---\n');
  console.log(resp.choices[0].message.content);
}

testar({
  nome: 'Elon Musk',
  twitter: '@elonmusk',
  notas: 'CEO da Tesla e SpaceX, dono do X.'
});
