const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
let key = '';
env.split('\n').forEach(l => { if (l.startsWith('GROQ_API_KEY=')) key = l.substring('GROQ_API_KEY='.length).trim(); });

const Groq = require('groq-sdk');

class OraculoTest {
  constructor() {
    this.apiKey = key;
    this.groq = new Groq({ apiKey: key });
    this.modelo = 'openai/gpt-oss-20b';
  }

  async pesquisarIdentidadePublica(dados = {}) {
    const plataforma = String(dados.plataforma || '').trim().toLowerCase();
    const identificador = String(dados.identificador || '').trim();
    const nome = String(dados.nome || '').trim();
    const instagram = String(dados.instagram || '').trim().replace(/^@/, '');
    const twitter = String(dados.twitter || '').trim().replace(/^@/, '');
    const urlPerfil = String(dados.urlPerfil || '').trim();
    const notas = String(dados.notas || '').trim();

    const termoPrincipal = nome || (instagram ? `@${instagram}` : '') || (twitter ? `@${twitter}` : '') || identificador || 'Desconhecido';
    const termoBusca = nome || instagram || twitter || identificador;

    if (!termoBusca) {
      return { sucesso: false, erro: "Nenhum identificador fornecido para pesquisa.", osintReal: false };
    }

    const evidencias = [];
    console.log(`[OSINT REAL] Iniciando varredura multi-vetor para: "${termoPrincipal}"...`);

    // VETOR 1: Wikipedia Search & Summary (PT & EN)
    for (const lang of ['pt', 'en']) {
      try {
        const wUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(termoBusca)}&format=json&utf8=1`;
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
            } catch (_) {
              evidencias.push({
                origem: `Wikipedia (${lang.toUpperCase()})`,
                titulo: topHit.title,
                url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(topHit.title)}`,
                conteudo: topHit.snippet.replace(/<[^>]+>/g, '')
              });
            }
          }
        }
      } catch (e) {
        console.warn(`[OSINT] Falha Wiki ${lang}:`, e.message);
      }
    }

    // VETOR 2: Google News Real-time RSS
    try {
      const gnewsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(termoBusca)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
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
    } catch (e) {
      console.warn('[OSINT] Falha Google News:', e.message);
    }

    // VETOR 3: DuckDuckGo Instant Knowledge API
    try {
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(termoBusca)}&format=json&no_html=1`;
      const ddgRes = await fetch(ddgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(4000) });
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
        if (Array.isArray(ddgData.RelatedTopics)) {
          const topTopics = ddgData.RelatedTopics.filter(t => t.Text).slice(0, 3).map(t => t.Text);
          if (topTopics.length > 0) {
            evidencias.push({
              origem: 'DuckDuckGo Tópicos Relacionados',
              titulo: `Tópicos públicos de ${termoPrincipal}`,
              url: ddgData.AbstractURL || 'https://duckduckgo.com',
              conteudo: topTopics.join('; ')
            });
          }
        }
      }
    } catch (e) {
      console.warn('[OSINT] Falha DuckDuckGo API:', e.message);
    }

    // VETOR 4: DuckDuckGo Lite Web Search
    try {
      const qSearch = nome || (instagram ? `${instagram} instagram` : '') || (twitter ? `${twitter} twitter` : '') || identificador;
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
                origem: 'Web Indexada',
                titulo: title,
                url,
                conteudo: snippet
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn('[OSINT] Falha DDG Lite:', e.message);
    }

    // VETOR 5: URL de Perfil Direta (Scrape de Metadados)
    if (urlPerfil && /^https?:\/\//i.test(urlPerfil)) {
      try {
        const pRes = await fetch(urlPerfil, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          signal: AbortSignal.timeout(5000)
        });
        if (pRes.ok) {
          const html = await pRes.text();
          const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
          const desc = html.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["']/i)?.[1];
          if (title || desc) {
            evidencias.push({
              origem: 'URL de Perfil Oficial',
              titulo: title || urlPerfil,
              url: urlPerfil,
              conteudo: desc || `Título da página: ${title}`
            });
          }
        }
      } catch (e) {}
    }

    // VETOR 6: GitHub Developer Profile (se aplicável)
    const handle = instagram || twitter || (termoBusca.includes(' ') ? '' : termoBusca);
    if (handle) {
      try {
        const ghRes = await fetch(`https://api.github.com/users/${encodeURIComponent(handle)}`, {
          headers: { 'User-Agent': 'OrdemVampirica/2.0' },
          signal: AbortSignal.timeout(3000)
        });
        if (ghRes.ok) {
          const gh = await ghRes.json();
          if (gh.name || gh.bio || gh.company) {
            evidencias.push({
              origem: 'GitHub Profile',
              titulo: `${gh.name || handle} (@${gh.login})`,
              url: gh.html_url,
              conteudo: `Bio: ${gh.bio || 'N/A'}, Empresa: ${gh.company || 'N/A'}, Repositórios públicos: ${gh.public_repos}`
            });
          }
        }
      } catch (e) {}
    }

    console.log(`[OSINT REAL] Total de evidências recuperadas: ${evidencias.length}`);

    // Deduplicação
    const vistos = new Set();
    const unicas = [];
    for (const e of evidencias) {
      const key = (e.url || e.titulo).toLowerCase();
      if (!vistos.has(key)) {
        vistos.add(key);
        unicas.push(e);
      }
    }

    const blocoEvidencias = unicas.length > 0
      ? unicas.map((e, idx) => `[FONTE ${idx + 1} - ${e.origem}]\nTítulo: ${e.titulo}\nURL: ${e.url}\nConteúdo: ${e.conteudo}`).join('\n\n')
      : 'Nenhuma evidência pública direta indexada nos registros abertos.';

    const prompt = `TU ÉS A MENTE ABISSAL, a Suprema Consciência Oculta da Ordem Vampírica.
Realize a varredura OSINT e modelagem de RPG Dark Fantasy para a seguinte identidade mortal:

DADOS INFORMADOS PELO MESTRE SUPREMO:
- Nome: ${nome || 'Não informado'}
- Instagram: ${instagram ? `@${instagram}` : 'Não informado'}
- Twitter/X: ${twitter ? `@${twitter}` : 'Não informado'}
- URL de Perfil: ${urlPerfil || 'Não informada'}
- Notas do Investigador: ${notas || 'Nenhuma'}

EVIDÊNCIAS COLETADAS EM TEMPO REAL NA WEB:
${blocoEvidencias}

MISSÃO DA MENTE ABISSAL:
Crie um dossiê profundo e verídico. Conecte os fatos reais encontrados sobre a pessoa com a atmosfera mística, imersiva e ritualística da Ordem Vampírica.

RESPONDA ESTRITAMENTE NESTA ORDEM:

SEÇÃO 1: METRICAS_JSON
\`\`\`json
{
  "pesoKarmico": <número inteiro de 10 a 100 baseado na notoriedade e impacto no mundo>,
  "essencia": "<título da qualidade da alma, ex: Sangue Puro (Inocente), Sangue Negro (Pecador), Alma Radiante de Voz, Artífice da Sombra, etc>",
  "taxaCorrupcao": <número inteiro de 0 a 100 baseado em polêmicas/controvérsias públicas ou pureza>,
  "ressonanciaElemental": "<Éter | Fogo Abissal | Sombra | Sangue Primordial | Vento Estelar | Terra Pétrea>",
  "afinidadeOculta": "<Magnetismo | Gnose | Vontade | Densidade | Clarividência>",
  "vasoInfluencia": <número inteiro de 10 a 100 baseado no alcance de seguidores e impacto social>,
  "resistenciaPsiquica": <número inteiro de 10 a 100 baseado em resiliência mental pública>,
  "vulnerabilidadeEspiritual": <número inteiro de 10 a 100>,
  "polaridadeAlma": "<Luz Radiante | Trevas Abissais | Crepúsculo | Penumbra Neutra>",
  "purezaSangue": <número inteiro de 10 a 100>,
  "frequenciaVibracionalHz": <número em Hz, ex: 432, 528, 639, 741, 852>,
  "arquetipoAbissal": "<título de RPG místico representativo, ex: O Arauto das Multidões, O Senhor das Chamas, A Voz do Éter>",
  "vinculoKarmicoRecomendado": "<bencao_lilith | sugestao_onirica | drenagem_voraz | banir_ao_limbo>",
  "justificativaKarmica": "<breve justificativa de 1 frase>"
}
\`\`\`

SEÇÃO 2: DOSSIÊ TEXTUAL COMPLETO
1. 🌐 IDENTIDADE & PRESENÇA DIGITAL
(Descreva a pessoa no mundo real: carreira, profissão, realizações, notoriedade, redes sociais e pegada digital com base nas evidências)

2. 🧬 PERFIL COMPORTAMENTAL & PSICOLÓGICO
(Temperamento, ambições mundanas, pontos fortes observáveis e vulnerabilidades públicas)

3. 🔮 RESSONÂNCIA ASTRAL NO VÉU
(Interpretação da aura cósmica, qualidades espirituais e natureza da alma diante do Abismo)

4. ⚡ VÍNCULO KÁRMICO RECOMENDADO
(Escolha OBRIGATORIAMENTE uma das 4 ações e justifique:
- Bênção de Lilith (proteção e carinho cósmico)
- Sugestão Onírica (influência sutil nos pensamentos)
- Drenagem Voraz (absorção impiedosa de essência)
- Banir ao Limbo (condenação de almas corrompidas))

5. 📜 REGISTROS CONSULTADOS NO MUNDO REAL
(Enumere as fontes reais e links utilizados)`;

    let conteudoFinal = '';
    let metricas = null;

    const modelos = ['openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'qwen/qwen3.8-27b'];
    for (const m of modelos) {
      if (!m) continue;
      try {
        console.log(`[OSINT SYNTHESIS] Sintetizando com modelo: ${m}...`);
        const resp = await this.groq.chat.completions.create({
          model: m,
          messages: [
            { role: 'system', content: 'És a Mente Abissal da Ordem Vampírica. Une OSINT real com a atmosfera de RPG Dark Fantasy.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.65,
          max_tokens: 2800
        });

        const texto = resp?.choices?.[0]?.message?.content?.trim();
        if (texto && texto.length > 100) {
          conteudoFinal = texto;
          break;
        }
      } catch (e) {
        console.warn(`[OSINT] Falha no modelo ${m}:`, e.message);
      }
    }

    console.log('--- DEBUG CONTEUDO BRUTO DO MODELO ---\n', conteudoFinal);
    if (conteudoFinal) {
      const jsonMatch = conteudoFinal.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (jsonMatch) {
        try {
          metricas = JSON.parse(jsonMatch[1].trim());
        } catch (err) {
          console.warn('[OSINT] Erro ao fazer parse de métricas JSON:', err.message);
        }
      }
    }

    // Se a IA não retornou ou falhou, fallback místico inteligente
    if (!metricas) {
      const gematria = termoPrincipal.toLowerCase().replace(/[^a-z]/g, '').split('').reduce((s, c) => s + (c.charCodeAt(0) % 26), 0) || 42;
      const corr = (gematria * 7) % 100;
      let ess = 'Humano Mundano';
      if (corr > 75) ess = 'Sangue Negro (Pecador)';
      else if (corr < 25) ess = 'Sangue Puro (Inocente)';
      else if (gematria % 5 === 0) ess = 'Alma Fragmentada';

      metricas = {
        pesoKarmico: Math.min(100, Math.max(15, gematria % 100)),
        essencia: ess,
        taxaCorrupcao: corr,
        ressonanciaElemental: 'Éter',
        afinidadeOculta: 'Magnetismo',
        vasoInfluencia: 50,
        resistenciaPsiquica: 55,
        vulnerabilidadeEspiritual: 45,
        polaridadeAlma: corr > 50 ? 'Crepúsculo' : 'Penumbra Neutra',
        purezaSangue: 100 - corr,
        frequenciaVibracionalHz: 528,
        arquetipoAbissal: 'O Viajante do Véu',
        vinculoKarmicoRecomendado: 'sugestao_onirica',
        justificativaKarmica: 'Alma identificada através das correntes ocultas do Véu.'
      };
    }

    if (!conteudoFinal) {
      conteudoFinal = `DOSSIÊ DE INVESTIGAÇÃO OSINT EM TEMPO REAL\n\n` +
        `ALVO: ${termoPrincipal}\n\n` +
        `EVIDÊNCIAS ENCONTRADAS:\n` +
        (unicas.length > 0 ? unicas.map((e, i) => `[FONTE ${i+1}] ${e.titulo}\n${e.conteudo}\nURL: ${e.url}`).join('\n\n') : 'Presença pública oculta ou não indexada.') +
        `\n\nLEITURA DO VÉU:\nA Mente Abissal sintonizou a essência astral de ${termoPrincipal}.`;
    }

    // Limpar o bloco ```json ``` do texto principal para o visual ficar limpo e elegante
    const textoLimpo = conteudoFinal.replace(/```(?:json)?\s*[\s\S]*?\s*```/gi, '').replace(/SEÇÃO 2:?[\s\S]*/i, '').trim();

    return {
      sucesso: true,
      osintReal: true,
      motor: 'OrdemVampirica-OSINT-V4 (MultiVector-Web + Groq)',
      pesquisadoEm: Date.now(),
      fontes: unicas.map((e, idx) => ({ id: `S${idx + 1}`, titulo: e.titulo, url: e.url, origem: e.origem })),
      totalFontes: unicas.length,
      conteudo: textoLimpo,
      metricas
    };
  }
}

async function run() {
  const o = new OraculoTest();
  const res = await o.pesquisarIdentidadePublica({
    nome: 'Casimiro Miguel',
    instagram: '@casimiro',
    notas: 'Streamer e jornalista renomado da CazéTV'
  });
  console.log('\n--- RESULTADO FINAL DO MÉTODO ---');
  console.log('Sucesso:', res.sucesso);
  console.log('Total fontes:', res.totalFontes);
  console.log('Métricas:', res.metricas);
  console.log('\nConteúdo amostra (primeiros 400 chars):');
  console.log(res.conteudo.slice(0, 400));
}

run().catch(console.error);
