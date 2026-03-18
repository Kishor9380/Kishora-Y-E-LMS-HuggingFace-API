import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Star, Users, BookOpen, PlayCircle, CreditCard, CheckCircle } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const { id, title, category, author, price, rating, students, thumbnail } = course;
  const numLessons = course.lessons ? course.lessons.length : 0;
  
  const { isCoursePurchased, getCourseProgress, enrollCourse } = useProgress();
  
  // Dynamic state that aligns with Dashboard mapping requirements
  const isPurchased = isCoursePurchased(id);
  const currentProgress = getCourseProgress(id, course.lessons);
  
  const [showModal, setShowModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('details'); // details, method, processing, success
  
  const handleBuyClick = (e) => {
    e.preventDefault();
    setPaymentStep('details');
    setShowModal(true);
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    setPaymentStep('method');
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentStep('processing');
    
    // Simulate Payment delay
    setTimeout(() => {
      setPaymentStep('success');
      
      // Update data source state
      enrollCourse(course.id);

      // Close modal and unmount after showing success
      setTimeout(() => {
        setShowModal(false);
        setPaymentStep('details');
        // Optional: you can redirect to the course details after purchase
        navigate(`/course/${id}`);
      }, 1500);

    }, 2000);
  };

  return (
    <>
      <div className="card course-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Link to={`/course/${id}`} style={{position: 'relative', display: 'block'}}>
          <img src={thumbnail} alt={title} className="course-thumb" style={{ aspectRatio: '16/9', objectFit: 'cover', width: '100%', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }} />
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '0.25rem 0.6rem',
            borderRadius: '2rem',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            boxShadow: 'var(--shadow-md)',
            backdropFilter: 'blur(4px)'
          }}>
            <Star size={12} color="#FBBF24" fill="#FBBF24" /> {rating}
          </div>
        </Link>
        
        <div className="course-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div className="course-category" style={{ margin: 0 }}>{category}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <BookOpen size={14} /> {numLessons} lessons
            </div>
          </div>
          
          <Link to={`/course/${id}`} style={{ textDecoration: 'none' }}>
            <h3 className="course-title" style={{ fontSize: '1rem', lineHeight: 1.4, marginBottom: '0.5rem', minHeight: '2.8rem' }}>{title}</h3>
          </Link>
          <div style={{fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>
            {author}
          </div>
          
          <div style={{ marginTop: 'auto' }}>
            {isPurchased ? (
              <>
                <div className="course-progress-container" style={{ margin: '0 0 1.25rem 0' }}>
                  <div className="progress-bar" style={{ height: '6px', background: 'var(--bg-body)', borderRadius: '1rem' }}>
                    <div className="progress-fill" style={{width: `${currentProgress}%`, background: 'var(--primary)' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                    <span>{Math.round(currentProgress)}% Complete</span>
                  </div>
                </div>
                <Link 
                  to={`/course/${id}`} 
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem' }}
                >
                  <PlayCircle size={18} /> Start Learning
                </Link>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', margin: '0 0 1.25rem 0', color: 'var(--text-main)', fontWeight: 'bold' }}>
                  <span>₹{price}</span>
                </div>
                <button 
                  onClick={handleBuyClick}
                  className="btn btn-outline" 
                  style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', background: '#eef2ff' }}
                >
                  <CreditCard size={18} /> Buy Course
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{
            background: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            width: '90%',
            maxWidth: '400px',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative'
          }}>
            {paymentStep !== 'processing' && paymentStep !== 'success' && (
              <button 
                onClick={() => setShowModal(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >&times;</button>
            )}
            
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-main)' }}>Secure Payment</h2>
            
            {paymentStep === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle size={64} color="#10B981" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ color: '#10B981', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Payment Successful!</h3>
                <p style={{ color: 'var(--text-muted)' }}>You are now enrolled in {title}.</p>
              </div>
            ) : paymentStep === 'processing' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px', margin: '0 auto 1rem', borderColor: 'var(--primary) transparent var(--primary) transparent' }}></div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Processing Payment...</h3>
                <p style={{ color: 'var(--text-muted)' }}>Please do not close this window.</p>
              </div>
            ) : paymentStep === 'method' ? (
              <div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--text-main)', textAlign: 'center' }}>Select Payment Method</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button className="btn" style={{ display: 'flex', justifyContent: 'center', padding: '0.875rem', background: '#10B981', color: 'white', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }} onClick={() => handlePaymentMethodSelect('UPI')}>
                    UPI (GPay, PhonePe, Paytm)
                  </button>
                  <button className="btn" style={{ display: 'flex', justifyContent: 'center', padding: '0.875rem', background: '#3B82F6', color: 'white', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)' }} onClick={() => handlePaymentMethodSelect('Card')}>
                    Credit / Debit Card
                  </button>
                  <button className="btn" style={{ display: 'flex', justifyContent: 'center', padding: '0.875rem', background: '#8B5CF6', color: 'white', boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)' }} onClick={() => handlePaymentMethodSelect('NetBanking')}>
                    Net Banking
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-body)', borderRadius: 'var(--radius-lg)' }}>
                  <img src={thumbnail} alt="Course" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                  <div>
                    <h4 style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{title}</h4>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>₹{price}</p>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '0.875rem', fontSize: '1.125rem' }}
                  onClick={handlePayNow}
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
