import React from 'react';
import { BookOpen, CheckCircle, TrendingUp, Clock, Star, PlayCircle } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { courses } from '../data/mockData';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { isCoursePurchased, isLessonCompleted, getCourseProgress, enrolledCourseIds } = useProgress();
  
  const allEnrolledCourses = courses.filter(c => isCoursePurchased(c.id));
  const activeCourses = allEnrolledCourses.filter(c => getCourseProgress(c.id, c.lessons) < 100);
  const completedCoursesCount = allEnrolledCourses.length - activeCourses.length;
  
  const completedLessonsCount = courses.reduce((total, course) => {
    if (!isCoursePurchased(course.id)) return total;
    return total + (course.lessons ? course.lessons.filter(l => isLessonCompleted(course.id, l.id)).length : 0);
  }, 0);

  let totalPossibleLessons = 0;
  let totalCompletedLessons = 0;
  
  // Calculate overall progress across *all* enrolled courses
  
  allEnrolledCourses.forEach(c => {
    if (c.lessons) {
      totalPossibleLessons += c.lessons.length;
      totalCompletedLessons += c.lessons.filter(l => isLessonCompleted(c.id, l.id)).length;
    }
  });
  const overallProgress = totalPossibleLessons === 0 ? 0 : Math.round((totalCompletedLessons / totalPossibleLessons) * 100);

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Welcome Banner */}
      <div className="card welcome-banner" style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #818CF8 100%)',
        color: 'white',
        padding: '2.5rem',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.4)'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div className="profile-avatar-container" style={{ position: 'relative' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.3)',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', background: 'var(--primary-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
          <div>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: 'white' }}>Welcome back, {user?.name || 'User'}!</h1>
            <p style={{ opacity: 0.9, fontSize: '1.125rem' }}>Ready to pick up where you left off?</p>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div className="card stat-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <BookOpen size={28} color="var(--primary)" />
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Courses Completed</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>{completedCoursesCount}</div>
          </div>
        </div>
        
        <div className="card stat-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <CheckCircle size={28} color="#10B981" />
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Lessons Completed</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>{completedLessonsCount}</div>
          </div>
        </div>
        
        <div className="card stat-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <TrendingUp size={28} color="#F59E0B" />
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Overall Progress</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>{overallProgress}%</div>
          </div>
          <div className="progress-bar" style={{ height: '8px', background: 'var(--bg-body)' }}>
            <div className="progress-fill" style={{ width: `${overallProgress}%`, background: '#F59E0B' }}></div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      {activeCourses.length > 0 && (
        <div className="continue-learning-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlayCircle color="var(--primary)" /> My Courses
            </h2>
            <Link to="/my-courses" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>View All &rarr;</Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {activeCourses.slice(0, 3).map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended for you */}
      <div className="recommended-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star color="#FBBF24" fill="#FBBF24" /> Recommended for You
          </h2>
          <Link to="/courses" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>Explore Catalog &rarr;</Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {courses.filter(c => !activeCourses.includes(c)).slice(0, 4).map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
