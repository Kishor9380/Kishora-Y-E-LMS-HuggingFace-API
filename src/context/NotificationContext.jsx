import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      const allNotifs = JSON.parse(localStorage.getItem('lms_notifications') || '[]');
      setNotifications(allNotifs.filter(n => n.userId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date)));
    } else {
      setNotifications([]);
    }
  }, [user]);

  const addNotification = (text, type = 'course') => {
    if (!user) return;
    const allNotifs = JSON.parse(localStorage.getItem('lms_notifications') || '[]');
    const newNotif = {
      id: Date.now(),
      userId: user.id,
      text,
      type,
      date: new Date().toISOString(),
      read: false
    };
    const updatedNotifs = [newNotif, ...allNotifs];
    localStorage.setItem('lms_notifications', JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs.filter(n => n.userId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const markAllAsRead = () => {
    if (!user) return;
    const allNotifs = JSON.parse(localStorage.getItem('lms_notifications') || '[]');
    const updatedNotifs = allNotifs.map(n => {
      if (n.userId === user.id) {
        return { ...n, read: true };
      }
      return n;
    });
    localStorage.setItem('lms_notifications', JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs.filter(n => n.userId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
