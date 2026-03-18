import React from 'react';
import CourseCard from '../components/CourseCard';
import { courses } from '../data/mockData';
import { useProgress } from '../context/ProgressContext';

export default function MyCourses() {
  const { isCoursePurchased } = useProgress();
  const activeCourses = courses.filter(c => isCoursePurchased(c.id));

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">My Courses</h1>
        <p className="page-subtitle">View and continue your purchased courses.</p>
      </div>

      {activeCourses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>You haven't purchased any courses yet</h2>
          <p style={{ color: 'var(--text-muted)' }}>Head over to the Explore section to find your next favorite course!</p>
        </div>
      ) : (
        <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {activeCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  );
}
