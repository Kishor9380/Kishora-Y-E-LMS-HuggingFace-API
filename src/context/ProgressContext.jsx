import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { courses } from '../data/mockData';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const [enrollments, setEnrollments] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);

  useEffect(() => {
    if (user) {
      const allEnrollments = JSON.parse(localStorage.getItem('lms_enrollments') || '[]');
      const allProgress = JSON.parse(localStorage.getItem('lms_progress') || '[]');
      
      setEnrollments(allEnrollments.filter(e => e.userId === user.id));
      setProgressRecords(allProgress.filter(p => p.userId === user.id));
    } else {
      setEnrollments([]);
      setProgressRecords([]);
    }
  }, [user]);

  const enrollCourse = (courseId) => {
    if (!user) return;
    const allEnrollments = JSON.parse(localStorage.getItem('lms_enrollments') || '[]');
    
    // Check if already enrolled
    if (!allEnrollments.some(e => e.userId === user.id && e.courseId === courseId)) {
      const newEnrollment = { userId: user.id, courseId, date: new Date().toISOString() };
      const updatedEnrollments = [...allEnrollments, newEnrollment];
      localStorage.setItem('lms_enrollments', JSON.stringify(updatedEnrollments));
      setEnrollments(updatedEnrollments.filter(e => e.userId === user.id));
      
      const course = courses.find(c => c.id === courseId);
      if (course) {
        addNotification(`You have successfully purchased ${course.title}!`, 'course');
      }
    }
  };

  const toggleLessonComplete = (courseId, lessonId) => {
    if (!user) return;
    const allProgress = JSON.parse(localStorage.getItem('lms_progress') || '[]');
    
    const existingIndex = allProgress.findIndex(p => p.userId === user.id && p.courseId === courseId && p.lessonId === lessonId);
    
    let updatedProgress = [...allProgress];
    
    let isCompletedNow = false;
    
    if (existingIndex !== -1) {
      // Toggle existing record
      const isCompleted = !updatedProgress[existingIndex].completed;
      updatedProgress[existingIndex].completed = isCompleted;
      updatedProgress[existingIndex].completionDate = isCompleted ? new Date().toISOString() : null;
      isCompletedNow = isCompleted;
    } else {
      // Create new record
      updatedProgress.push({
        userId: user.id,
        courseId,
        lessonId,
        completed: true,
        completionDate: new Date().toISOString()
      });
      isCompletedNow = true;
    }
    
    localStorage.setItem('lms_progress', JSON.stringify(updatedProgress));
    
    const userProgress = updatedProgress.filter(p => p.userId === user.id);
    setProgressRecords(userProgress);

    if (isCompletedNow) {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        const lesson = course.lessons?.find(l => l.id === lessonId);
        if (lesson) {
          addNotification(`You completed the lesson: ${lesson.title}`, 'course');
        }
        
        // Check if course is completed now!
        const lessons = course.lessons || [];
        const completedCount = lessons.filter(l => userProgress.some(p => p.courseId === courseId && p.lessonId === l.id && p.completed)).length;
        if (lessons.length > 0 && completedCount === lessons.length) {
          addNotification(`Congratulations! You completed ${course.title}. Your certificate is ready.`, 'cert');
        }
      }
    }
  };

  const isCoursePurchased = (courseId) => {
    return enrollments.some(e => e.courseId === courseId);
  };

  const isLessonCompleted = (courseId, lessonId) => {
    const record = progressRecords.find(p => p.courseId === courseId && p.lessonId === lessonId);
    return record ? record.completed : false;
  };

  const getCourseProgress = (courseId, lessons = []) => {
    if (!isCoursePurchased(courseId)) return 0;
    if (lessons.length === 0) return 1; // 1% for started, since they are enrolled
    
    const completedCount = lessons.filter(l => isLessonCompleted(courseId, l.id)).length;
    return Math.round((completedCount / lessons.length) * 100);
  };

  return (
    <ProgressContext.Provider value={{ 
      enrollCourse, 
      toggleLessonComplete, 
      isCoursePurchased, 
      isLessonCompleted, 
      getCourseProgress,
      enrolledCourseIds: enrollments.map(e => e.courseId),
      completedLessonIds: progressRecords.filter(p => p.completed).map(p => p.lessonId)
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
