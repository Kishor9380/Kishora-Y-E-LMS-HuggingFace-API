import React, { useState } from 'react';
import { MessageSquare, Send, Loader2, CheckCircle2, AlertCircle, Quote, BarChart3 } from 'lucide-react';

export default function FeedbackAnalysis() {
  const [feedback, setFeedback] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeFeedback = async () => {
    if (!feedback.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Calling the backend API via relative path (proxied in dev, absolute in Vercel)
      const response = await fetch(`/api/sentiment?text=${encodeURIComponent(feedback)}`, {
        method: "GET", // Using GET as required by the backend route
      });

      const data = await response.json();

      if (response.ok) {
        // The model returns [[{"label": "POSITIVE", "score": 0.99}...]] 
        // through our backend wrapper
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const sentiment = data[0].reduce((prev, current) => (prev.score > current.score) ? prev : current);
          setResult(sentiment);
        } else {
          setError(data.error || "Unexpected response format from backend.");
        }
      } else {
        setError(data.detail?.error || data.detail || "Failed to connect to backend analysis server.");
      }
    } catch (err) {
      setError("Analysis backend is not reachable. Ensure the server is running on port 8000.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-analysis-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header">
        <h1 className="page-title">AI Feedback Analysis</h1>
        <p className="page-subtitle">Understand student sentiment using Hugging Face DistilBERT</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <Quote size={20} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>Input Student Feedback</h2>
          </div>

          <div style={{ position: 'relative' }}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Type or paste student feedback here (e.g., 'The course was amazing and I learned a lot!')"
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--border-color)',
                backgroundColor: 'var(--bg-body)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'none',
                outline: 'none',
                transition: 'all 0.2s',
                lineHeight: '1.6'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
                e.target.style.backgroundColor = 'var(--bg-surface)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = 'var(--bg-body)';
              }}
            />
            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              {feedback.length} characters
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={analyzeFeedback}
              disabled={loading || !feedback.trim()}
              className="btn btn-primary"
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                gap: '0.75rem',
                minWidth: '220px'
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <BarChart3 size={20} />
                  <span>Analyze Feedback</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Analysis Result</h3>

            {!result && !loading && !error && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <MessageSquare size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                <p style={{ fontSize: '0.875rem' }}>Results will appear here after analysis</p>
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 1rem', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Processing text...</p>
              </div>
            )}

            {result && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  margin: '0 auto 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: result.label === 'POSITIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: result.label === 'POSITIVE' ? '#10B981' : '#EF4444',
                  border: `2px solid ${result.label === 'POSITIVE' ? '#10B981' : '#EF4444'}`
                }}>
                  <CheckCircle2 size={40} />
                </div>

                <h4 style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: result.label === 'POSITIVE' ? '#10B981' : '#EF4444',
                  marginBottom: '0.5rem'
                }}>
                  {result.label}
                </h4>

                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  Confidence: {Math.round(result.score * 100)}%
                </div>

                <div style={{ padding: '1rem', background: 'var(--bg-body)', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {result.label === 'POSITIVE'
                      ? "The feedback indicates a satisfying experience. Keep up the great work!"
                      : "The feedback suggests areas for improvement. Review specific points for action."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(to bottom right, var(--bg-surface), var(--bg-body))' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} color="var(--primary)" />
              How it works
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              We use the <strong>DistilBERT</strong> model hosted on Hugging Face. This transformer-based model has been fine-tuned on the SST-2 dataset for binary sentiment classification.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
