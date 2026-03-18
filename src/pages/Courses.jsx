import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { courses } from '../data/mockData';
import { Filter, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Courses() {
  const [filter, setFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchUrlParam = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(searchUrlParam);

  useEffect(() => {
    setSearchQuery(searchUrlParam);
  }, [searchUrlParam]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSearchParams(val ? { search: val } : {});
  };

  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filteredCourses = courses.filter(c => {
    const matchesCategory = filter === 'All' || c.category === filter;
    const q = searchQuery.toLowerCase();
    const titleMatch = c.title && c.title.toLowerCase().includes(q);
    const categoryMatch = c.category && c.category.toLowerCase().includes(q);
    const authorMatch = c.author && c.author.toLowerCase().includes(q);
    const matchesSearch = titleMatch || categoryMatch || authorMatch;
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Explore Courses</h1>
          <p className="page-subtitle">Find the perfect course to upgrade your skills.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
            />
          </div>
          <button 
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`} 
            style={{ gap: '0.5rem' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', animation: 'fadeIn 0.2s ease-out' }}>
          {categories.map(category => (
            <button
              key={category}
              className={`btn ${filter === category ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-xl)' }}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="courses-grid">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
}
