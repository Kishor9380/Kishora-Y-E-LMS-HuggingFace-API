import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, CheckCircle, ChevronDown, ChevronUp, MessageSquare, Lock } from 'lucide-react';
import { courses } from '../data/mockData';
import { useProgress } from '../context/ProgressContext';

export default function LessonVideo() {
  const { courseId, lessonId } = useParams();
  const [course] = useState(courses.find(c => c.id === parseInt(courseId)) || courses[0]);
  
  const [updateTick, setUpdateTick] = useState(0);

  // Find current lesson info
  let currentLesson = { title: "Lesson not found", videoUrl: "" };
  let currentIndex = -1;
  let prevLesson = null;
  let nextLesson = null;

  if (course.lessons) {
    currentIndex = course.lessons.findIndex(l => l.id === parseInt(lessonId));
    if (currentIndex !== -1) {
      currentLesson = course.lessons[currentIndex];
      prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
      nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;
    }
  }

  const { isCoursePurchased, isLessonCompleted, toggleLessonComplete: toggleCtxLessonComplete, getCourseProgress } = useProgress();

  const purchased = isCoursePurchased(course.id);
  const completedLessons = course.lessons ? course.lessons.filter(l => isLessonCompleted(course.id, l.id)).length : 0;
  const totalLessons = course.lessons ? course.lessons.length : 0;
  const progressPercentage = getCourseProgress(course.id, course.lessons || []);

  const toggleLessonComplete = () => {
    if (currentIndex !== -1) {
      toggleCtxLessonComplete(course.id, currentLesson.id);
    }
  };

  // Extract video ID from YouTube URL
  const getYouTubeId = (url) => {
    if (!url) return 'dQw4w9WgXcQ';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
  };
  
  const videoId = getYouTubeId(currentLesson.videoUrl);

  return (
    <div className="lesson-layout">
      {/* Video Area */}
      <div className="video-section">
        <div style={{padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
          <Link to={`/course/${course.id}`} style={{color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8}}>
            <ArrowLeft size={20} />
            Back to Course
          </Link>
          <div style={{color: 'white', flex: 1, textAlign: 'center', fontWeight: '600'}}>{course.title}</div>
        </div>
        
        <div className="video-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000', color: 'white', position: 'relative' }}>
          {purchased ? (
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`} 
              title={currentLesson.title} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', zIndex: 10 }}>
              <Lock size={64} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Content Locked</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Purchase this course to unlock lessons.</p>
              <Link to={`/course/${course.id}`} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                View Course Details
              </Link>
            </div>
          )}
        </div>
        
        <div className="video-info">
          <h1 style={{fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)'}}>{currentLesson.title}</h1>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <img src={course.thumbnail} style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} alt={course.author} />
              <div>
                <div style={{fontSize: '0.875rem', fontWeight: '500'}}>{course.author}</div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Instructor</div>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <button 
                onClick={toggleLessonComplete} 
                className={`btn ${isLessonCompleted(course.id, currentLesson.id) ? 'btn-primary' : 'btn-outline'}`} 
                style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
              >
                <CheckCircle size={18} />
                {isLessonCompleted(course.id, currentLesson.id) ? 'Completed' : 'Mark as Complete'}
              </button>
              <button className="btn btn-outline" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <MessageSquare size={18} />
                Q&A
              </button>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0 0.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)'}}>
            {prevLesson ? (
              <Link to={`/course/${course.id}/lesson/${prevLesson.id}`} className="btn btn-outline" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                &larr; Previous Lesson
              </Link>
            ) : <div></div>}
            
            {nextLesson ? (
              <Link to={`/course/${course.id}/lesson/${nextLesson.id}`} className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                Next Lesson &rarr;
              </Link>
            ) : <div></div>}
          </div>
        </div>
      </div>
      
      {/* Sidebar Navigation */}
      <div className="lesson-sidebar">
        <div className="lesson-sidebar-header">
          <h2 style={{fontSize: '1.25rem', marginBottom: '0.5rem'}}>Course Content</h2>
          <div className="course-progress-container" style={{marginTop: '0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
              <span style={{fontSize: '0.875rem', fontWeight: '500'}}>Progress</span>
              <span className="progress-text">{completedLessons}/{totalLessons} ({progressPercentage}%)</span>
            </div>
            <div className="progress-bar" style={{height: '8px', background: '#E5E7EB'}}>
              <div className="progress-fill" style={{width: `${progressPercentage}%`}}></div>
            </div>
          </div>
        </div>
        
        <div className="lesson-sidebar-content">
          <div className="lesson-list">
            {course.lessons && course.lessons.map(lesson => {
              const isPlaying = lesson.id === parseInt(lessonId);
              const isCompleted = isLessonCompleted(course.id, lesson.id);
              return (
                <Link 
                  to={`/course/${course.id}/lesson/${lesson.id}`} 
                  key={lesson.id} 
                  className={`lesson-item ${isPlaying ? 'playing-lesson' : ''}`}
                  style={{borderTop: '1px solid var(--border-color)', padding: '0.75rem 1.25rem', gap: '0.75rem', textDecoration: 'none'}}
                >
                  <div style={{color: isCompleted ? 'var(--secondary)' : 'var(--text-muted)'}}>
                    {isCompleted ? (
                      <CheckCircle size={18} />
                    ) : purchased ? (
                      <PlayCircle size={18} />
                    ) : (
                      <Lock size={18} />
                    )}
                  </div>
                  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <span className="lesson-title" style={{fontSize: '0.875rem', color: isPlaying ? 'var(--primary)' : 'var(--text-main)', lineHeight: '1.2'}}>
                      {lesson.order ? `${lesson.order}. ` : ''}{lesson.title}
                    </span>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem'}}>
                      {lesson.duration}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
