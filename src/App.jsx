import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import CourseDetails from './pages/CourseDetails';
import LessonVideo from './pages/LessonVideo';
import Messages from './pages/Messages';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import FeedbackAnalysis from './pages/FeedbackAnalysis';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ProgressProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/course/:courseId" element={<CourseDetails />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/feedback" element={<FeedbackAnalysis />} />
              </Route>
              
              {/* Lesson Video Page is outside AppLayout since it has its own layout */}
              <Route path="/course/:courseId/lesson/:lessonId" element={<ProtectedRoute><LessonVideo /></ProtectedRoute>} />
            </Routes>
          </Router>
        </ProgressProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
