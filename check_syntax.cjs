const fs = require('fs');
const content = fs.readFileSync('./src/pages/DynamicPage.tsx', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Check for non-ASCII characters that could cause issues
  for (let j = 0; j < line.length; j++) {
    const code = line.charCodeAt(j);
    if (code > 127 && code !== 8212 && code !== 8211) { // allow em-dash and en-dash
      console.log(`Line ${i+1}, col ${j+1}: char code ${code} = "${line[j]}" context: ...${line.substring(Math.max(0,j-10), j+10)}...`);
    }
  }
}
// Also check for unbalanced single quotes in object literals
lines.forEach((line, i) => {
  if (line.includes("excerpt:") || line.includes("desc:")) {
    // Count single quotes
    let count = 0;
    for (const ch of line) {
      if (ch === "'") count++;
    }
    if (count % 2 !== 0) {
      console.log(`Line ${i+1}: ODD number of single quotes (${count}) - likely broken string`);
    }
  }
});
console.log('Check complete');
