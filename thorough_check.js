import { courses } from './src/data/mockData.js';

let issues = [];

courses.forEach(c => {
  if (!c.lessons || c.lessons.length === 0) {
    issues.push({ course: c.title, issue: "No lessons" });
  } else {
    c.lessons.forEach(l => {
      if (!l.videoUrl || !(l.videoUrl.includes('youtube.com/watch?v=') || l.videoUrl.includes('youtu.be/') || l.videoUrl.includes('youtube.com/embed/'))) {
        issues.push({ course: c.title, lesson: l.title, url: l.videoUrl });
      }
    });
  }
});

console.log(JSON.stringify(issues, null, 2));
