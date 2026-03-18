import { courses } from './src/data/mockData.js';

let count = 0;
courses.forEach(c => {
    const missing = c.lessons.filter(l => !l.videoUrl || l.videoUrl.trim() === "");
    if (missing.length > 0) {
        console.log(`COURSE: ${c.title} (ID: ${c.id}) has ${missing.length} lessons missing videos.`);
        count++;
    }
    if (!c.lessons || c.lessons.length === 0) {
        console.log(`COURSE: ${c.title} (ID: ${c.id}) HAS NO LESSONS.`);
        count++;
    }
});

console.log(`Total courses with issues: ${count}`);
