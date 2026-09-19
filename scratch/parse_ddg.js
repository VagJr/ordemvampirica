const fs = require('fs');
const html = fs.readFileSync('scratch/ddg_sample.html', 'utf8');

// Check structure
console.log('HTML length:', html.length);
if (html.includes('zero-click')) console.log('Has zero-click');
const trs = html.split('<tr>');
console.log('Total table rows:', trs.length);

trs.slice(1).forEach((tr, i) => {
  const linkMatch = tr.match(/class=['"]result-link['"][^>]*href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/i) ||
                    tr.match(/<a[^>]*href=['"]([^'"]+)['"][^>]*class=['"]result-link['"][^>]*>([\s\S]*?)<\/a>/i) ||
                    tr.match(/<a[^>]*href=['"](https?:\/\/[^'"]+)['"][^>]*>([\s\S]*?)<\/a>/i);
  const snippetMatch = tr.match(/class=['"]result-snippet['"][^>]*>([\s\S]*?)<\/td>/i);
  if (linkMatch || snippetMatch) {
    console.log(`Row ${i}:`);
    if (linkMatch) console.log(`  Link: ${linkMatch[1]} | Title: ${linkMatch[2].replace(/<[^>]+>/g, '').trim()}`);
    if (snippetMatch) console.log(`  Snippet: ${snippetMatch[1].replace(/<[^>]+>/g, '').trim()}`);
  }
});
