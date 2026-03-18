import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, Users, PlayCircle, BookOpen, CheckCircle, MonitorPlay, Award, ArrowLeft, ArrowRight, Download, Lock } from 'lucide-react';
import { courses } from '../data/mockData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';

export default function CourseDetails() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const course = courses.find(c => c.id === parseInt(courseId)) || courses[0];
  
  const { isCoursePurchased, enrollCourse, isLessonCompleted, toggleLessonComplete: toggleCtxLessonComplete, getCourseProgress } = useProgress();
  const isPurchased = isCoursePurchased(course.id);

  const [showModal, setShowModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('details');

  const handleBuyClick = (e) => {
    if (e) e.preventDefault();
    setPaymentStep('details');
    setShowModal(true);
  };

  const handlePayNow = (e) => {
    if (e) e.preventDefault();
    setPaymentStep('method');
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentStep('processing');
    
    setTimeout(() => {
      setPaymentStep('success');
      
      enrollCourse(course.id);

      setTimeout(() => {
        setShowModal(false);
        setPaymentStep('details');
      }, 1500);
    }, 2000);
  };

  const [activeLessonId, setActiveLessonId] = useState(course.lessons?.[0]?.id || null);
  const [updateTick, setUpdateTick] = useState(0);

  const activeLessonIndex = course.lessons?.findIndex(l => l.id === activeLessonId) ?? -1;
  const activeLesson = activeLessonIndex !== -1 ? course.lessons[activeLessonIndex] : null;
  const prevLesson = activeLessonIndex > 0 ? course.lessons[activeLessonIndex - 1] : null;
  const nextLesson = activeLessonIndex !== -1 && activeLessonIndex < course.lessons.length - 1 ? course.lessons[activeLessonIndex + 1] : null;

  const completedLessons = course.lessons ? course.lessons.filter(l => isLessonCompleted(course.id, l.id)).length : 0;
  const totalLessons = course.lessons ? course.lessons.length : 0;
  
  // Calculate true current progress if we wanted, but use course.progress or completed count
  const currentProgress = getCourseProgress(course.id, course.lessons || []);
  const isCourseCompleted = isPurchased && currentProgress === 100 && totalLessons > 0;

  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      // Temporarily make it visible for capture if needed, though html2canvas can capture off-screen
      certificateRef.current.style.display = 'flex';
      
      const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2] // standardizing scale
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${course.title.replace(/\s+/g, '_')}_Certificate.pdf`);
      
      certificateRef.current.style.display = 'none';
      setIsDownloading(false);
    } catch (error) {
      console.error("Error generating certificate", error);
      setIsDownloading(false);
      certificateRef.current.style.display = 'none';
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return 'dQw4w9WgXcQ';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
  };

  const handleLessonComplete = () => {
    if (activeLesson) {
      toggleCtxLessonComplete(course.id, activeLesson.id);
    }
  };

  return (
    <>
      <div className="detail-header" style={{
        backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.95) 20%, rgba(17, 24, 39, 0.7) 100%), url(${course.thumbnail})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '5rem 2rem',
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        marginTop: '-1rem',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <div className="detail-header-content" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            color: 'var(--primary)', 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(10px)',
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            borderRadius: '2rem',
            textTransform: 'uppercase', 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>
            {course.category}
          </div>
          <h1 className="detail-title">{course.title}</h1>
          <p style={{fontSize: '1.25rem', color: '#E5E7EB', marginBottom: '1.5rem', maxWidth: '80%'}}>
            {course.description}
          </p>
          
          <div className="detail-meta">
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FBBF24'}}>
              <Star size={18} fill="#FBBF24" /> {course.rating} ({course.students} reviews)
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Users size={18} /> {course.students.toLocaleString()} students
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Clock size={18} /> 48 hours
            </div>
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{color: '#E5E7EB'}}>Created by <strong style={{color: 'white'}}>{course.author}</strong></div>
            <div style={{color: '#9CA3AF'}}>Last updated 10/2025</div>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            {isPurchased ? (
              <div style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--secondary)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 'bold'}}>
                <CheckCircle size={20} /> Enrolled
              </div>
            ) : (
              <button 
                onClick={handleBuyClick} 
                className="btn btn-primary" 
                style={{fontSize: '1.125rem', padding: '0.75rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
              >
                Buy Course for ₹{course.price}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="detail-body">
        <div className="detail-main-content">
          
          {!isPurchased ? (
            <div className="detail-section" style={{ padding: '3rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111827', color: 'white', textAlign: 'center', minHeight: '400px', position: 'relative' }}>
              <Lock size={64} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <h2 style={{ marginBottom: '1rem', color: 'white' }}>Course Content Locked</h2>
              <p style={{ marginBottom: '2rem', color: 'var(--text-muted)', maxWidth: '400px' }}>Purchase this course to unlock all lessons, materials, and earn your certificate of completion.</p>
              <button 
                onClick={handleBuyClick} 
                className="btn btn-primary" 
                style={{ padding: '1rem 2rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Buy Course for ₹{course.price}
              </button>
            </div>
          ) : activeLesson && (
            <div className="detail-section" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'black' }}>
                <iframe 
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeLesson.videoUrl)}?rel=0&modestbranding=1`} 
                  title={activeLesson.title} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{activeLesson.order ? `${activeLesson.order}. ` : ''}{activeLesson.title}</h2>
                  <button 
                    onClick={handleLessonComplete} 
                    className={`btn ${isLessonCompleted(course.id, activeLesson.id) ? 'btn-primary' : 'btn-outline'}`} 
                    style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                  >
                    <CheckCircle size={18} />
                    {isLessonCompleted(course.id, activeLesson.id) ? 'Completed' : 'Mark as Complete'}
                  </button>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  {prevLesson ? (
                    <button onClick={() => setActiveLessonId(prevLesson.id)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ArrowLeft size={18} /> Previous Lesson
                    </button>
                  ) : <div></div>}
                  
                  {nextLesson ? (
                    <button onClick={() => setActiveLessonId(nextLesson.id)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Next Lesson <ArrowRight size={18} />
                    </button>
                  ) : <div></div>}
                </div>
              </div>
            </div>
          )}

          <div className="detail-section">
            <h2 style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>What you'll learn</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              {[
                "Build fully functional web applications",
                "Master React and modern JavaScript",
                "Create responsive designs with CSS",
                "Work with RESTful APIs",
                "Deploy apps to production",
                "Understand software architecture"
              ].map((item, i) => (
                <div key={i} style={{display: 'flex', gap: '0.75rem', alignItems: 'flex-start'}}>
                  <CheckCircle size={20} color="var(--secondary)" style={{flexShrink: 0, marginTop: '2px'}} />
                  <span style={{fontSize: '0.875rem', color: 'var(--text-main)'}}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="detail-sidebar">
          <div className="card sidebar-card" style={{padding: '0', border: 'none', boxShadow: 'var(--shadow-lg)', top: '5.5rem'}}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Course Content</h2>
              <div className="course-progress-container" style={{marginTop: '0'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                  <span style={{fontSize: '0.875rem', fontWeight: '500'}}>Progress</span>
                  <span className="progress-text">{completedLessons} / {totalLessons} ({currentProgress}%)</span>
                </div>
                <div className="progress-bar" style={{height: '8px', background: '#E5E7EB', margin: 0}}>
                  <div className="progress-fill" style={{width: `${currentProgress}%`, background: isCourseCompleted ? 'var(--secondary)' : 'var(--primary)'}}></div>
                </div>
              </div>
              
              {isCourseCompleted && (
                <div style={{marginTop: '1.5rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem'}}>
                    <Award size={18} /> Course Completed!
                  </div>
                  <button 
                    onClick={downloadCertificate} 
                    disabled={isDownloading}
                    className="btn btn-primary" 
                    style={{width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', background: 'var(--secondary)'}}
                  >
                    <Download size={18} /> 
                    {isDownloading ? 'Generating...' : 'Download Certificate'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="lesson-list" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
              {course.lessons && course.lessons.map(lesson => {
                const isPlaying = lesson.id === activeLessonId;
                return (
                  <div 
                    key={lesson.id} 
                    className="lesson-item"
                    onClick={() => {
                      if (isPurchased) setActiveLessonId(lesson.id);
                    }}
                    style={{
                      cursor: isPurchased ? 'pointer' : 'not-allowed', 
                      background: (isPlaying && isPurchased) ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                      borderLeft: (isPlaying && isPurchased) ? '3px solid var(--primary)' : '3px solid transparent',
                      borderTop: 'none',
                      borderBottom: '1px solid var(--border-color)',
                      opacity: isPurchased ? 1 : 0.7
                    }}
                  >
                    {isLessonCompleted(course.id, lesson.id) ? (
                      <CheckCircle size={18} color="var(--secondary)" style={{flexShrink: 0}} />
                    ) : (
                      isPurchased ? <PlayCircle size={18} color={isPlaying ? "var(--primary)" : "var(--text-muted)"} style={{flexShrink: 0}} /> : <Lock size={18} color="var(--text-muted)" style={{flexShrink: 0}} />
                    )}
                    <div style={{flex: 1, fontSize: '0.875rem', color: isPlaying ? 'var(--primary)' : 'var(--text-main)', fontWeight: isPlaying ? 600 : 400}}>
                      {lesson.order ? `${lesson.order}. ` : ''}{lesson.title}
                    </div>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                      {lesson.duration}
                    </div>
                  </div>
                );
              })}
              
              {(!course.lessons || course.lessons.length === 0) && (
                <div style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Course content is being updated.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Certificate Template for PDF Generation */}
      <div 
        ref={certificateRef}
        style={{
          display: 'none',
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '1024px',
          height: '725px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
          color: '#111827',
          padding: '40px',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box'
        }}
      >
        <div style={{
          border: '15px solid #4F46E5',
          borderRadius: '20px',
          padding: '60px',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: '#ffffff',
          boxShadow: 'inset 0 0 0 5px #E5E7EB'
        }}>
          {/* Logo / Header */}
          <div style={{ position: 'absolute', top: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4F46E5' }}>
              <BookOpen size={48} />
              <span style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '2px' }}>KodHub</span>
            </div>
            <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '4px', color: '#6B7280', marginTop: '10px' }}>
              Certificate of Completion
            </div>
          </div>
          
          {/* Body */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <h1 style={{ fontSize: '56px', fontWeight: 800, color: '#111827', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Certificate</h1>
            <p style={{ fontSize: '24px', fontStyle: 'italic', color: '#4B5563', margin: '0 0 40px 0' }}>This is to certify that</p>
            <h2 style={{ fontSize: '48px', fontWeight: 700, color: '#4F46E5', margin: '0 0 40px 0', borderBottom: '2px solid #E5E7EB', paddingBottom: '20px', display: 'inline-block', minWidth: '500px' }}>{user?.name || 'User'}</h2>
            <p style={{ fontSize: '24px', color: '#4B5563', margin: '0 0 20px 0' }}>has successfully completed the course</p>
            <h3 style={{ fontSize: '36px', fontWeight: 800, color: '#111827', margin: '0' }}>{course.title}</h3>
          </div>
          
          {/* Footer Metadata */}
          <div style={{ position: 'absolute', bottom: '60px', width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid #E5E7EB', paddingTop: '20px' }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 5px 0' }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Date of Completion</p>
            </div>
            
            <div style={{ textAlign: 'center', color: '#FBBF24' }}>
              <Award size={64} />
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 5px 0', fontFamily: 'monospace' }}>CERT-{course.id}-{new Date().getFullYear()}</p>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Certificate ID</p>
            </div>
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
                <p style={{ color: 'var(--text-muted)' }}>You are now enrolled in {course.title}.</p>
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
                  <img src={course.thumbnail} alt="Course" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                  <div>
                    <h4 style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{course.title}</h4>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>₹{course.price}</p>
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
