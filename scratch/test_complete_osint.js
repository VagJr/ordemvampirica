try { process.loadEnvFile(); } catch(e){}
const Groq = require('groq-sdk');

async function pesquisarWebReal(dados) {
  const nome = String(dados.nome || '').trim();
  const instagram = String(dados.instagram || '').trim().replace(/^@/, '');
  const twitter = String(dados.twitter || '').trim().replace(/^@/, '');
  const urlPerfil = String(dados.urlPerfil || '').trim();
  const notas = String(dados.notas || '').trim();

  const termoPrincipal = nome || instagram || twitter || 'Desconhecido';
  const evidencias = [];

  console.log(`[OSINT SEARCH] Iniciando varredura real para: "${termoPrincipal}"...`);

  // 1. Wikipedia PT & EN
  for (const lang of ['pt', 'en']) {
    try {
      const wUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(termoPrincipal)}&format=json&utf8=1`;
      const wRes = await fetch(wUrl, { headers: { 'User-Agent': 'OrdemVampiricaBot/1.0' } });
      if (wRes.ok) {
        const wData = await wRes.json();
        const hits = wData?.query?.search || [];
        if (hits.length > 0) {
          const topHit = hits[0];
          // Buscar resumo completo da pagina principal encontrada
          const sumRes = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topHit.title)}`, {
            headers: { 'User-Agent': 'OrdemVampiricaBot/1.0' }
          });
          if (sumRes.ok) {
            const sumData = await sumRes.json();
            evidencias.push({
              origem: `Wikipedia (${lang.toUpperCase()})`,
              titulo: sumData.title || topHit.title,
              url: sumData.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(topHit.title)}`,
              conteudo: sumData.extract || topHit.snippet.replace(/<[^>]+>/g, '')
            });
          } else {
            evidencias.push({
              origem: `Wikipedia (${lang.toUpperCase()})`,
              titulo: topHit.title,
              url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(topHit.title)}`,
              conteudo: topHit.snippet.replace(/<[^>]+>/g, '')
            });
          }
        }
      }
    } catch(e) {
      console.warn(`[OSINT] Falha Wiki ${lang}:`, e.message);
    }
  }

  // 2. DuckDuckGo Instant Knowledge API
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(termoPrincipal)}&format=json&no_html=1`;
    const ddgRes = await fetch(ddgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (ddgRes.ok) {
      const ddgData = await ddgRes.json();
      if (ddgData.AbstractText) {
        evidencias.push({
          origem: 'DuckDuckGo Knowledge Base',
          titulo: ddgData.Heading || termoPrincipal,
          url: ddgData.AbstractURL || 'https://duckduckgo.com',
          conteudo: ddgData.AbstractText
        });
      }
      if (Array.isArray(ddgData.RelatedTopics) && ddgData.RelatedTopics.length > 0) {
        const topTopics = ddgData.RelatedTopics
          .filter(t => t.Text)
          .slice(0, 3)
          .map(t => t.Text);
        if (topTopics.length > 0) {
          evidencias.push({
            origem: 'DuckDuckGo Categorias Relacionadas',
            titulo: `Tópicos públicos associados a ${termoPrincipal}`,
            url: ddgData.AbstractURL || 'https://duckduckgo.com',
            conteudo: topTopics.join('; ')
          });
        }
      }
    }
  } catch(e) {
    console.warn('[OSINT] Falha DDG API:', e.message);
  }

  // 3. Google News Real-time RSS
  try {
    const gnewsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(termoPrincipal)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
    const gnewsRes = await fetch(gnewsUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (gnewsRes.ok) {
      const xml = await gnewsRes.text();
      const items = [...xml.matchAll(/<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<source[^>]*>([\s\S]*?)<\/source>/g)];
      const recentes = items.slice(0, 5);
      for (const item of recentes) {
        evidencias.push({
          origem: `Notícias em Tempo Real (${item[4] || 'Imprensa'})`,
          titulo: item[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
          url: item[2],
          conteudo: `Publicado em: ${item[3]}. Notícia veiculada: ${item[1]}`
        });
      }
    }
  } catch(e) {
    console.warn('[OSINT] Falha Google News RSS:', e.message);
  }

  // 4. Se URL de Perfil foi informada, buscar metadados diretos
  if (urlPerfil && /^https?:\/\//i.test(urlPerfil)) {
    try {
      const pRes = await fetch(urlPerfil, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(5000)
      });
      if (pRes.ok) {
        const html = await pRes.text();
        const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
        const desc = html.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["']/i)?.[1];
        if (title || desc) {
          evidencias.push({
            origem: 'URL de Perfil Direto',
            titulo: title || urlPerfil,
            url: urlPerfil,
            conteudo: desc || `Título da página: ${title}`
          });
        }
      }
    } catch(e) {
      console.warn('[OSINT] Falha URL perfil direto:', e.message);
    }
  }

  // 5. Se houver handle de GitHub / redes públicas abertas
  const handle = instagram || twitter || (termoPrincipal.includes(' ') ? '' : termoPrincipal);
  if (handle) {
    try {
      const ghRes = await fetch(`https://api.github.com/users/${encodeURIComponent(handle)}`, {
        headers: { 'User-Agent': 'OrdemVampirica/1.0' },
        signal: AbortSignal.timeout(3000)
      });
      if (ghRes.ok) {
        const gh = await ghRes.json();
        if (gh.name || gh.bio || gh.company) {
          evidencias.push({
            origem: 'GitHub Dev Profile',
            titulo: `${gh.name || handle} (@${gh.login})`,
            url: gh.html_url,
            conteudo: `Nome: ${gh.name || 'N/A'}, Bio: ${gh.bio || 'N/A'}, Empresa: ${gh.company || 'N/A'}, Repos públicos: ${gh.public_repos}`
          });
        }
      }
    } catch(e) {}
  }

  console.log(`[OSINT SEARCH] Total de evidências reais recuperadas: ${evidencias.length}`);
  return evidencias;
}

async function sintetizarComGroq(dados, evidencias) {
  const nome = String(dados.nome || '').trim();
  const instagram = String(dados.instagram || '').trim();
  const twitter = String(dados.twitter || '').trim();
  const urlPerfil = String(dados.urlPerfil || '').trim();
  const notas = String(dados.notas || '').trim();
  const termoPrincipal = nome || instagram || twitter || 'Desconhecido';

  const blocoEvidencias = evidencias.length > 0
    ? evidencias.map((e, idx) => `[FONTE ${idx + 1} - ${e.origem}]\nTítulo: ${e.titulo}\nURL: ${e.url}\nConteúdo: ${e.conteudo}`).join('\n\n')
    : 'Nenhum registro público direto localizado nos índices abertos.';

  const prompt = `CONTEXTO: Tu és a MENTE ABISSAL, a Suprema Inteligência Oculta do MMORPG Dark Fantasy "Ordem Vampírica" (Sanguinis).
Um Mestre Supremo rasgou o Véu Nosferatu para investigar o seguinte indivíduo do mundo real:

DADOS INFORMADOS PELO MESTRE:
- Nome: ${nome || 'Não especificado'}
- Instagram: ${instagram || 'Não especificado'}
- Twitter / X: ${twitter || 'Não especificado'}
- URL de Perfil: ${urlPerfil || 'Não especificada'}
- Notas do Investigador: ${notas || 'Nenhuma nota'}

EVIDÊNCIAS COLETADAS EM TEMPO REAL NA WEB:
${blocoEvidencias}

MISSÃO DA MENTE ABISSAL:
Produza um DOSSIÊ COMPLETO, PROFUNDO E REAL do alvo. Misture a precisão factual investigativa do mundo real com a prosa solene, mística e ritualística da Ordem Vampírica.

ESTRUTURA OBRIGATÓRIA DA RESPOSTA:
1. 🌐 IDENTIDADE & PRESENÇA DIGITAL
(Descreva quem a pessoa é no mundo real, suas áreas de atuação, histórico profissional, notoriedade, redes sociais e pegada digital com base nas evidências)

2. 🧬 PERFIL COMPORTAMENTAL & PSICOLÓGICO
(Análise detalhada de temperamento, ambições mundanas, pontos fortes observáveis e vulnerabilidades)

3. 🔮 RESSONÂNCIA ASTRAL NO VÉU
(Interpretação mística da aura do alvo na cosmologia do jogo: natureza da sua essência cósmica, qualidades espirituais e peso kármico)

4. ⚡ VÍNCULO KÁRMICO RECOMENDADO
(Escolha obrigatoriamente UMA das 6 ações rituais do jogo que melhor se conecta a esta alma e justifique a escolha:
- Drenar Vitalidade
- Sussurro no Véu
- Maldição do Espelho
- Laço de Sangue
- Olho de Seth
- Sombra de Akasha)

5. 📜 REGISTROS CONSULTADOS NO MUNDO REAL
(Enumere as fontes e links reais consultados pela varredura)`;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const modelo = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

  console.log(`[OSINT SYNTHESIS] Enviando para modelo Groq: ${modelo}...`);

  const resp = await groq.chat.completions.create({
    model: modelo,
    messages: [
      {
        role: 'system',
        content: 'És a Mente Abissal, a onisciente consciência arcana da Ordem Vampírica. Une OSINT real com a atmosfera imersiva de RPG dark fantasy.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.65,
    max_tokens: 1800
  });

  return resp.choices[0].message.content;
}

async function testar() {
  const dados = {
    nome: 'Casimiro Miguel',
    instagram: '@casimiro',
    twitter: '@casimiro',
    notas: 'Streamer e jornalista brasileiro, criador da CazéTV'
  };

  const evidencias = await pesquisarWebReal(dados);
  const relatorio = await sintetizarComGroq(dados, evidencias);
  console.log('\n========================================');
  console.log('📖 ANÁLISE DA MENTE ABISSAL - RESULTADO:');
  console.log('========================================\n');
  console.log(relatorio);
}

testar().catch(console.error);
