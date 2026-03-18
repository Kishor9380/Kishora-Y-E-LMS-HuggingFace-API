import fs from 'fs';
let content = fs.readFileSync('src/data/mockData.js', 'utf8');

// Reset progress everywhere (handle variations in spaces)
content = content.replace(/"progress":\s*\d+,/g, '"progress": 0,');

// Delete isPurchased if it happens to be there
content = content.replace(/"isPurchased":\s*(true|false),/g, '');

// Reset completed everywhere
content = content.replace(/"completed":\s*true/g, '"completed": false');

fs.writeFileSync('src/data/mockData.js', content, 'utf8');
console.log('Progress reset successfully.');
