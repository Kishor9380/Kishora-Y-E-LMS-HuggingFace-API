import React, { useState, useRef } from 'react';
import { Award, Download, BookOpen } from 'lucide-react';
import { courses } from '../data/mockData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function Certificates() {
  const { isCoursePurchased, getCourseProgress } = useProgress();
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const completedCourses = courses.filter(c => {
    if (!isCoursePurchased(c.id)) return false;
    const progress = getCourseProgress(c.id, c.lessons || []);
    return progress === 100 && (c.lessons && c.lessons.length > 0);
  });

  const certificateRef = useRef(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [activeDownloadCourse, setActiveDownloadCourse] = useState(null);

  const downloadCertificate = async (course) => {
    setActiveDownloadCourse(course);
    setDownloadingId(course.id);
    
    // We need a short timeout to let the activeDownloadCourse reflect in the DOM
    setTimeout(async () => {
      if (!certificateRef.current) {
        setDownloadingId(null);
        return;
      }
      try {
        certificateRef.current.style.display = 'flex';
        const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width / 2, canvas.height / 2]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
        pdf.save(`${course.title.replace(/\s+/g, '_')}_Certificate.pdf`);
        
        addNotification(`Your certificate for ${course.title} is available for download.`, 'cert');
        
        certificateRef.current.style.display = 'none';
        setDownloadingId(null);
        setActiveDownloadCourse(null);
      } catch (error) {
        console.error("Error generating certificate", error);
        setDownloadingId(null);
        setActiveDownloadCourse(null);
        if (certificateRef.current) certificateRef.current.style.display = 'none';
      }
    }, 100);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Certificates</h1>
        <p className="page-subtitle">View and download your earned certificates</p>
      </div>

      {completedCourses.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)' }}>
          <Award size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Certificates Yet</h2>
          <p style={{ color: 'var(--text-muted)' }}>Complete courses to earn certificates.</p>
        </div>
      ) : (
        <div className="certificates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {completedCourses.map(course => (
            <div key={course.id} className="card certificate-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Award size={64} color="var(--primary)" />
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{course.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Completed on: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ID: CERT-{course.id}-{new Date().getFullYear()}</p>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}
                onClick={() => downloadCertificate(course)}
                disabled={downloadingId === course.id}
              >
                <Download size={18} style={{ marginRight: '0.5rem' }} />
                {downloadingId === course.id ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden Certificate Template for PDF Generation */}
      <div 
        ref={certificateRef}
        style={{
          display: 'none',
          position: 'fixed',
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
            <h3 style={{ fontSize: '36px', fontWeight: 800, color: '#111827', margin: '0' }}>{activeDownloadCourse?.title || 'Course Title'}</h3>
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
              <p style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 5px 0', fontFamily: 'monospace' }}>CERT-{activeDownloadCourse?.id || '000'}-{new Date().getFullYear()}</p>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Certificate ID</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
