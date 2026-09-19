async function testQuery(q) {
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
  console.log(`Results for [${q}]:`, tdLinks.length);
  for (let i = 0; i < Math.min(tdLinks.length, snippetMatches.length, 5); i++) {
    console.log(`- ${tdLinks[i][2].replace(/<[^>]+>/g, '').trim()} | ${tdLinks[i][1]}`);
    console.log(`  ${snippetMatches[i][1].replace(/<[^>]+>/g, '').trim().slice(0, 150)}`);
  }
}
testQuery('Felipe Neto instagram');
