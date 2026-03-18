import { courses } from './src/data/mockData.js';

let issuesFound = 0;

courses.forEach(course => {
  if (!course.lessons || course.lessons.length === 0) {
    console.log(`Course: ${course.title} (ID: ${course.id}) NO LESSONS`);
    issuesFound++;
  } else {
    course.lessons.forEach(lesson => {
      if (!lesson.videoUrl || lesson.videoUrl === "https://www.youtube.com/watch?v=" || lesson.videoUrl.trim() === "") {
        console.log(`Course: ${course.title} (ID: ${course.id}) | Lesson: ${lesson.title} (ID: ${lesson.id}) | MISSING/INVALID VIDEO URL: "${lesson.videoUrl}"`);
        issuesFound++;
      }
    });
  }
});

if (issuesFound === 0) {
  console.log("No missing video URLs found in mockData.js");
} else {
  console.log(`Total issues found: ${issuesFound}`);
}
