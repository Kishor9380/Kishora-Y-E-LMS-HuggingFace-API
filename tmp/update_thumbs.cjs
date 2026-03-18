const fs = require('fs');

const data = fs.readFileSync('src/data/mockData.js', 'utf8');

let photoMapping = {
    'python': '1526379095098-d400fd0bf935',
    'java': '1517694712202-14dd9538aa97',
    'c ': '1555066931-4365d14bab8c',
    'c++': '1555066931-4365d14bab8c',
    'javascript': '1627398514753-c20f17c6ce46',
    'web': '1633356122544-f134324a6cee',
    'html': '1555099962-4199c345e5dd',
    'react': '1633356122544-f134324a6cee',
    'node': '1555066931-4365d14bab8c',
    'data': '1551288049-bebda4e38f71',
    'machine learning': '1555949987-1e56ed9d4edc',
    'artificial intelligence': '1677442136019-21780ecaca9f',
    'cybersecurity': '1550751827-4bd374c3f58b',
    'cloud': '1451187580459-43490279c0fa',
    'devops': '1618401471536-8a50ed1836f6',
    'sql': '1544383835-bda2bc66a55d',
    'git': '1618401471536-8a50ed1836f6',
    'linux': '1629654261663-d10660c1d2cb',
    'operating': '1517694712202-14dd9538aa97',
    'network': '1557804506-669a67965ba0',
    'mobile': '1512941937669-90a1b58e7e9c',
    'android': '1607252654041-eb6560cb970a',
    'ios': '1512941937669-90a1b58e7e9c',
    'software': '1517694712202-14dd9538aa97',
    'system': '1551288049-bebda4e38f71',
    'digital marketing': '1460925895917-afdab827c52f',
    'business': '1454165804606-c3d57bc86b40',
    'entrepreneurship': '1556761175-5973e449ee14',
    'financ': '1611974789855-9c2a0a7236a3',
    'design': '1561557944696-6184d08b33bf',
    'productivity': '1484480974693-6ca0a78fb36cb',
    'default': '1498050108023-c5249f4df085'
};

let currentTitle = '';
let result = data.replace(/"title":\s*"([^"]+)"|("thumbnail":\s*")[^"]+(")/g, (match, titleMatch, p1, p2) => {
    if (titleMatch) {
       currentTitle = titleMatch.toLowerCase();
       return match;
    } else {
       let chosenId = photoMapping['default'];
       for (let key in photoMapping) {
           if (currentTitle.includes(key) && key !== 'default') {
               chosenId = photoMapping[key];
               break;
           }
       }
       return `${p1}https://images.unsplash.com/photo-${chosenId}?auto=format&fit=crop&w=600&q=80${p2}`;
    }
});

fs.writeFileSync('src/data/mockData.js', result, 'utf8');
console.log('Thumbnails updated successfully!');
