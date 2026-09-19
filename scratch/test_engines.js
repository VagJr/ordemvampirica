async function testOEmbed() {
  // TikTok oEmbed
  try {
    const res = await fetch('https://www.tiktok.com/oembed?url=https://www.tiktok.com/@tiktok');
    console.log('TikTok oEmbed status:', res.status);
    if (res.ok) {
      const d = await res.json();
      console.log('TikTok oEmbed author:', d.author_name, '| title:', d.title);
    }
  } catch(e) { console.log('TikTok err', e.message); }

  // Twitter oEmbed
  try {
    const res = await fetch('https://publish.twitter.com/oembed?url=https://twitter.com/elonmusk');
    console.log('Twitter oEmbed status:', res.status);
    if (res.ok) {
      const d = await res.json();
      console.log('Twitter oEmbed author:', d.author_name, '| html:', d.html?.slice(0, 100));
    }
  } catch(e) { console.log('Twitter err', e.message); }
}
testOEmbed();
