const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
let key = '';
env.split('\n').forEach(l => { if (l.startsWith('GROQ_API_KEY=')) key = l.substring('GROQ_API_KEY='.length).trim(); });

async function testFullPipeline() {
  const Groq = require('groq-sdk');
  const groq = new Groq({ apiKey: key });

  const target = {
    nome: 'Casimiro Miguel',
    instagram: '@casimiro',
    twitter: '@casimiro',
    notas: 'Streamer e jornalista renomado da CazéTV'
  };

  // 1. Wikipedia
  const evidencias = [];
  try {
    const wRes = await fetch('https://pt.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent('Casimiro (streamer)'));
    if (wRes.ok) {
      const w = await wRes.json();
      evidencias.push({ origem: 'Wikipedia PT', titulo: w.title, url: w.content_urls?.desktop?.page, conteudo: w.extract });
    }
  } catch(e) { console.error('Wiki error:', e.message); }

  // 2. Google News
  try {
    const gnRes = await fetch('https://news.google.com/rss/search?q=' + encodeURIComponent('Casimiro Miguel') + '&hl=pt-BR&gl=BR&ceid=BR:pt-419');
    if (gnRes.ok) {
      const xml = await gnRes.text();
      const items = [...xml.matchAll(/<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>/g)].slice(0, 3);
      items.forEach(it => evidencias.push({ origem: 'Google News', titulo: it[1], url: it[2], conteudo: it[1] }));
    }
  } catch(e) { console.error('GNews error:', e.message); }

  console.log('Evidencias coletadas:', evidencias.length);

  const prompt = `Voce e a MENTE ABISSAL da Ordem Vampirica. Realize uma sintese OSINT real e modelagem de RPG dark fantasy para o alvo:
Nome: ${target.nome}
Instagram: ${target.instagram}
Twitter: ${target.twitter}
Notas: ${target.notas}

Evidencias reais da Web:
${evidencias.map((e, i) => `[${i+1}] ${e.origem} - ${e.titulo}: ${e.conteudo}`).join('\n\n')}

Responda em DUAS secoes estritas:
SECAO 1: DOSSIE TEXTUAL COMPLETO (com Identidade & Presenca Digital, Perfil Comportamental, Ressonancia Astral, Acao Karmica Recomendada e Fontes).
SECAO 2: METRICAS_JSON
\`\`\`json
{
  "pesoKarmico": 72,
  "essencia": "Alma Radiante de Influência",
  "taxaCorrupcao": 28,
  "ressonanciaElemental": "Éter",
  "afinidadeOculta": "Magnetismo",
  "vasoInfluencia": 95,
  "resistenciaPsiquica": 78,
  "vulnerabilidadeEspiritual": 35,
  "polaridadeAlma": "Luz Radiante",
  "purezaSangue": 65,
  "frequenciaVibracionalHz": 528,
  "arquetipoAbissal": "O Arauto das Multidões",
  "vinculoKarmicoRecomendado": "sugestao_onirica",
  "justificativaKarmica": "Sua voz atinge milhões no éter mundano."
}
\`\`\`
(Adapte os valores de acordo com a analise real)`;

  const chat = await groq.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.6,
    max_tokens: 1800
  });

  const resp = chat.choices[0].message.content;
  console.log('\n--- DOSSIÊ DA MENTE ABISSAL ---\n');
  const jsonMatch = resp.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    const jsonStr = jsonMatch[1];
    const parsed = JSON.parse(jsonStr);
    const textual = resp.replace(/```json[\s\S]*?```/, '').replace(/SECAO 2:?[\s\S]*/i, '').trim();
    console.log(textual);
    console.log('\n--- MÉTRICAS ESTRUTURADAS ---\n', parsed);
  } else {
    console.log(resp);
  }
}

testFullPipeline().catch(console.error);
