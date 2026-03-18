import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for logged-in user on mount
    const storedUser = localStorage.getItem('lms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // In a real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('lms_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Don't store password in session state
      const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
      setUser(userData);
      localStorage.setItem('lms_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('lms_users') || '[]');
    
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'User with this email already exists' };
    }
    
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('lms_users', JSON.stringify(users));
    
    // Automatically log in after signup
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(userData);
    localStorage.setItem('lms_user', JSON.stringify(userData));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
  };

  const resetPassword = (email, newPassword) => {
    const users = JSON.parse(localStorage.getItem('lms_users') || '[]');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('lms_users', JSON.stringify(users));
      return { success: true };
    }
    return { success: false, error: 'User with this email not found' };
  };

  const changePassword = (currentPassword, newPassword) => {
    if (!user) return { success: false, error: 'Not logged in' };
    const users = JSON.parse(localStorage.getItem('lms_users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex !== -1) {
      if (users[userIndex].password !== currentPassword) {
        return { success: false, error: 'Incorrect current password' };
      }
      users[userIndex].password = newPassword;
      localStorage.setItem('lms_users', JSON.stringify(users));
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  };

  const updateProfile = (newName) => {
    if (!user) return { success: false, error: 'Not logged in' };
    const users = JSON.parse(localStorage.getItem('lms_users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex !== -1) {
      users[userIndex].name = newName;
      localStorage.setItem('lms_users', JSON.stringify(users));
      
      const updatedUser = { ...user, name: newName };
      setUser(updatedUser);
      localStorage.setItem('lms_user', JSON.stringify(updatedUser));
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  };

  const deleteAccount = () => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    // Remove user from users array
    const users = JSON.parse(localStorage.getItem('lms_users') || '[]');
    const newUsers = users.filter(u => u.email !== user.email);
    localStorage.setItem('lms_users', JSON.stringify(newUsers));
    
    // Remove enrollments (courses)
    const enrollments = JSON.parse(localStorage.getItem('lms_enrollments') || '[]');
    localStorage.setItem('lms_enrollments', JSON.stringify(enrollments.filter(e => e.userId !== user.id)));
    
    // Remove progress
    const progress = JSON.parse(localStorage.getItem('lms_progress') || '[]');
    localStorage.setItem('lms_progress', JSON.stringify(progress.filter(p => p.userId !== user.id)));
    
    // Remove messages
    const messages = JSON.parse(localStorage.getItem('lms_messages') || '[]');
    localStorage.setItem('lms_messages', JSON.stringify(messages.filter(m => m.senderId !== user.id && m.receiverId !== user.id)));

    // Log out
    setUser(null);
    localStorage.removeItem('lms_user');
    return { success: true };
  };

  if (loading) {
    return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="spinner" style={{ borderColor: 'var(--primary) transparent var(--primary) transparent' }}></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, changePassword, deleteAccount, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
