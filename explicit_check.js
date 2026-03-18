import { courses } from './src/data/mockData.js';

let count = 0;
courses.forEach(c => {
  let hasVideo = false;
  if (c.lessons && c.lessons.length > 0) {
    c.lessons.forEach(l => {
      if (l.videoUrl && l.videoUrl.trim() !== '') {
        hasVideo = true;
      }
    });
  }
  if (!hasVideo) {
    console.log(`COURSE WITHOUT VIDEO: ${c.id} - ${c.title}`);
    count++;
  }
});

console.log(`Total courses without videos: ${count}`);
