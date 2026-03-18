import { courses } from './src/data/mockData.js';

const audit = [];

courses.forEach(course => {
  if (!course.lessons || course.lessons.length === 0) {
    audit.push({ id: course.id, title: course.title, issue: 'No lessons found' });
  } else {
    course.lessons.forEach(lesson => {
      const url = lesson.videoUrl || '';
      const match = url.match(/[?&]v=([^#&?]*)/);
      const videoId = match ? match[1] : '';
      
      if (!videoId || videoId.length !== 11) {
        audit.push({ 
          courseId: course.id, 
          courseTitle: course.title, 
          lessonId: lesson.id, 
          lessonTitle: lesson.title, 
          issue: 'Invalid or missing Video ID',
          idFound: videoId,
          url: url
        });
      }
    });
  }
});

console.log(JSON.stringify(audit, null, 2));
