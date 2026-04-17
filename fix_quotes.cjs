const fs = require('fs');
let content = fs.readFileSync('./src/pages/DynamicPage.tsx', 'utf8');
// Replace curly apostrophes with straight ones
content = content.replace(/\u2019/g, "'");
content = content.replace(/\u2018/g, "'");
content = content.replace(/\u201C/g, '"');
content = content.replace(/\u201D/g, '"');
fs.writeFileSync('./src/pages/DynamicPage.tsx', content);
console.log('Fixed smart quotes');
