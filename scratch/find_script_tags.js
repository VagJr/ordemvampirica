const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Find all script tags
const matches = [...content.matchAll(/<\/script>/gi)];
console.log('Number of </script>:', matches.length);
matches.forEach((m, i) => {
    console.log(`Script ${i + 1} ends at position ${m.index}. Prev 100 chars:\n`, content.substring(m.index - 100, m.index));
});
