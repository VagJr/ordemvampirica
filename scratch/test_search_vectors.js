const fs = require('fs');

async function testWebSearchVectors(dados) {
  const nome = String(dados.nome || '').trim();
  const instagram = String(dados.instagram || '').trim().replace(/^@/, '');
  const twitter = String(dados.twitter || '').trim().replace(/^@/, '');
  const urlPerfil = String(dados.urlPerfil || '').trim();
  const notas = String(dados.notas || '').trim();

  const termoPrincipal = nome || instagram || twitter || 'Desconhecido';
  const evidencias = [];

  console.log(`[TESTE VECTORES] Testando varredura real para: "${termoPrincipal}"...`);

  // Vector 1: Wikipedia Search & Summary (PT & EN)
  for (const lang of ['pt', 'en']) {
    try {
      const wUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(termoPrincipal)}&format=json&utf8=1`;
      const wRes = await fetch(wUrl, { headers: { 'User-Agent': 'OrdemVampiricaBot/2.0' }, signal: AbortSignal.timeout(5000) });
      if (wRes.ok) {
        const wData = await wRes.json();
        const hits = wData?.query?.search || [];
        if (hits.length > 0) {
          const topHit = hits[0];
          try {
            const sumRes = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topHit.title)}`, {
              headers: { 'User-Agent': 'OrdemVampiricaBot/2.0' },
              signal: AbortSignal.timeout(4000)
            });
            if (sumRes.ok) {
              const sumData = await sumRes.json();
              evidencias.push({
                origem: `Wikipedia (${lang.toUpperCase()})`,
                titulo: sumData.title || topHit.title,
                url: sumData.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(topHit.title)}`,
                conteudo: sumData.extract || topHit.snippet.replace(/<[^>]+>/g, '')
              });
            }
          } catch(e) {
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
      console.warn(`Wiki ${lang} erro:`, e.message);
    }
  }

  // Vector 2: Google News Real-time RSS
  try {
    const gnewsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(termoPrincipal)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
    const gnewsRes = await fetch(gnewsUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) });
    if (gnewsRes.ok) {
      const xml = await gnewsRes.text();
      const items = [...xml.matchAll(/<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<source[^>]*>([\s\S]*?)<\/source>/g)];
      items.slice(0, 4).forEach(item => {
        evidencias.push({
          origem: `Notícias (${item[4] || 'Imprensa'})`,
          titulo: item[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
          url: item[2],
          conteudo: `Publicado em ${item[3]}: ${item[1]}`
        });
      });
    }
  } catch(e) {
    console.warn('GNews erro:', e.message);
  }

  // Vector 3: DuckDuckGo Instant Knowledge API
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(termoPrincipal)}&format=json&no_html=1`;
    const ddgRes = await fetch(ddgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(4000) });
    if (ddgRes.ok) {
      const ddgData = await ddgRes.json();
      if (ddgData.AbstractText) {
        evidencias.push({
          origem: 'DuckDuckGo Knowledge',
          titulo: ddgData.Heading || termoPrincipal,
          url: ddgData.AbstractURL || 'https://duckduckgo.com',
          conteudo: ddgData.AbstractText
        });
      }
      if (Array.isArray(ddgData.RelatedTopics)) {
        const topTopics = ddgData.RelatedTopics.filter(t => t.Text).slice(0, 3).map(t => t.Text);
        if (topTopics.length > 0) {
          evidencias.push({
            origem: 'DuckDuckGo Tópicos',
            titulo: `Tópicos associados a ${termoPrincipal}`,
            url: ddgData.AbstractURL || 'https://duckduckgo.com',
            conteudo: topTopics.join('; ')
          });
        }
      }
    }
  } catch(e) {
    console.warn('DDG erro:', e.message);
  }

  // Vector 4: DuckDuckGo Lite Web Search
  try {
    const qSearch = nome || (instagram ? `${instagram} instagram` : '') || (twitter ? `${twitter} twitter` : '');
    if (qSearch) {
      const ddlRes = await fetch('https://lite.duckduckgo.com/lite/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        body: 'q=' + encodeURIComponent(qSearch),
        signal: AbortSignal.timeout(5000)
      });
      if (ddlRes.ok) {
        const html = await ddlRes.text();
        const tdLinks = [...html.matchAll(/<td[^>]*valign=['"]top['"][^>]*>[\s\S]*?<a[^>]*href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/g)];
        const snippetMatches = [...html.matchAll(/class=['"]result-snippet['"][^>]*>([\s\S]*?)<\/td>/g)];
        for (let i = 0; i < Math.min(tdLinks.length, snippetMatches.length, 3); i++) {
          const url = tdLinks[i][1];
          const title = tdLinks[i][2].replace(/<[^>]+>/g, '').trim();
          const snippet = snippetMatches[i][1].replace(/<[^>]+>/g, '').trim();
          if (!evidencias.some(e => e.url === url)) {
            evidencias.push({
              origem: 'Web Pública',
              titulo: title,
              url,
              conteudo: snippet
            });
          }
        }
      }
    }
  } catch(e) {
    console.warn('DDG Lite erro:', e.message);
  }

  console.log('Total de evidências coletadas:', evidencias.length);
  evidencias.forEach((e, idx) => console.log(` [${idx+1}] [${e.origem}] ${e.titulo} -> ${e.url}`));
  return evidencias;
}

testWebSearchVectors({
  nome: 'Alok',
  instagram: '@alok',
  notas: 'DJ e produtor musical brasileiro de fama mundial'
}).catch(console.error);
