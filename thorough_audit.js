import { courses } from './src/data/mockData.js';

courses.forEach(c => {
    const videoCount = (c.lessons || []).filter(l => l.videoUrl && l.videoUrl.trim() !== "").length;
    console.log(`ID: ${c.id} | TITLE: ${c.title} | VIDEOS: ${videoCount} / ${c.lessons.length}`);
});
