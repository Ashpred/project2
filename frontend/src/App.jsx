import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import CreateProfilePage from './pages/CreateProfilePage'
import MainPage from './pages/MainPage'
import CreateBlogPage from './pages/CreateBlogPage'
import BlogSuccessPage from './pages/BlogSuccessPage'
import BlogDetailPage from './pages/BlogDetailPage'
import SettingsPage from './pages/SettingsPage'
import AboutPage from './pages/AboutPage'
import ProfilePage from './pages/ProfilePage'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/signin" 
          element={isAuthenticated ? <Navigate to="/main" /> : <SignInPage setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/main" /> : <SignUpPage />} 
        />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected Routes */}
        <Route 
          path="/create-profile" 
          element={<CreateProfilePage />} 
        />
        <Route 
          path="/main" 
          element={
            isAuthenticated ? <MainPage /> : <Navigate to="/signin" />
          } 
        />
        <Route 
          path="/profile/:username" 
          element={
            isAuthenticated ? <ProfilePage /> : <Navigate to="/signin" />
          } 
        />
        <Route 
          path="/create-blog" 
          element={
            isAuthenticated ? <CreateBlogPage /> : <Navigate to="/signin" />
          } 
        />
        <Route 
          path="/blog-success" 
          element={
            isAuthenticated ? <BlogSuccessPage /> : <Navigate to="/signin" />
          } 
        />
        <Route 
          path="/blog/:blogId" 
          element={
            isAuthenticated ? <BlogDetailPage /> : <Navigate to="/signin" />
          } 
        />
        <Route 
          path="/settings" 
          element={
            isAuthenticated ? <SettingsPage /> : <Navigate to="/signin" />
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
