import { courses } from './src/data/mockData.js';

let totalMissing = 0;
courses.forEach(c => {
    if (!c.lessons || c.lessons.length === 0) {
        console.log(`Course ${c.id}: "${c.title}" HAS NO LESSONS`);
        totalMissing++;
    } else {
        c.lessons.forEach(l => {
            if (!l.videoUrl) {
                console.log(`Course ${c.id}: "${c.title}" | Lesson: "${l.title}" | MISSING videoUrl`);
                totalMissing++;
            }
        });
    }
});

if (totalMissing === 0) {
    console.log("No missing videos found in mockData.js");
} else {
    console.log(`Summary: Found ${totalMissing} missing videos.`);
}
