import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../assets/styles/AuthPages.css';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Password validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      console.log('Submitting registration data:', { 
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: 'HIDDEN' 
      });

      // Make API call to register
      try {
        console.log('Attempting to connect to API endpoint /api/auth/register');
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: formData.password
          })
        });

        console.log('Registration response status:', response.status);
        
        // Check if response is empty
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        let data = {};
        try {
          if (responseText) {
            data = JSON.parse(responseText);
          }
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Invalid server response. Please try again.');
        }

        if (!response.ok) {
          console.error('Error response:', data);
          
          // Handle specific error cases
          if (data.message && data.message.includes('Email already in use')) {
            throw new Error('This email is already registered. Please use a different email or sign in.');
          } else if (data.message && data.message.includes('Username already taken')) {
            throw new Error('This username is already taken. Please choose a different username.');
          } else if (data.message && data.message.includes('duplicate key')) {
            if (data.message.includes('email')) {
              throw new Error('This email is already registered. Please use a different email.');
            } else if (data.message.includes('username')) {
              throw new Error('This username is already taken. Please choose a different username.');
            }
          }
          
          throw new Error(data.message || 'Registration failed');
        }

        console.log('Registration successful:', data);

        // Store the token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to profile creation page
        navigate('/create-profile');
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError; // Let the outer catch handle the error
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider) => {
    setSocialLoading(provider);
    setError(null);
    
    try {
      console.log(`Initiating ${provider} sign up...`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, we'll simulate a successful registration
      const userData = {
        google: { name: 'Google User', email: 'google.user@example.com' },
        facebook: { name: 'Facebook User', email: 'facebook.user@example.com' },
        github: { name: 'GitHub User', email: 'github.user@example.com' }
      };
      
      console.log(`Successful ${provider} sign up:`, userData[provider]);
      
      // Create user data for local storage
      const userObject = {
        id: `${provider}-user-${Date.now()}`,
        fullName: userData[provider].name,
        username: provider + '_user_' + Date.now(),
        email: userData[provider].email,
        isVerified: true
      };
      
      // Store token and user data
      localStorage.setItem('token', `${provider}-token-${Date.now()}`);
      localStorage.setItem('user', JSON.stringify(userObject));
      
      // Redirect directly to profile creation
      navigate('/create-profile');
    } catch (err) {
      setError(`${provider} sign up failed. Please try again.`);
    } finally {
      setSocialLoading('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { opacity: 0 }
  };

  const formVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { delay: 0.2, duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="auth-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Navbar />
      
      <div className="auth-container">
        <motion.div 
          className="auth-card"
          variants={formVariants}
        >
          <div className="auth-header">
            <h2>Create an Account</h2>
            <p>Join our community and start sharing your stories</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>
            
            <div className="form-group-remember">
              <div className="remember-me">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">I agree to the <Link to="/terms">Terms of Service</Link></label>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating Account...
                </>
              ) : 'Sign Up'}
            </button>
            
            <div className="auth-divider">
              <span>OR</span>
            </div>
            
            <div className="social-signin">
              <button 
                type="button" 
                className="social-button google"
                onClick={() => handleSocialSignUp('google')}
                disabled={socialLoading !== ''}
              >
                {socialLoading === 'google' ? (
                  <>
                    <span className="spinner-small"></span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <i className="fab fa-google"></i>
                    Sign up with Google
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="social-button facebook"
                onClick={() => handleSocialSignUp('facebook')}
                disabled={socialLoading !== ''}
              >
                {socialLoading === 'facebook' ? (
                  <>
                    <span className="spinner-small"></span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <i className="fab fa-facebook-f"></i>
                    Sign up with Facebook
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="social-button github"
                onClick={() => handleSocialSignUp('github')}
                disabled={socialLoading !== ''}
              >
                {socialLoading === 'github' ? (
                  <>
                    <span className="spinner-small"></span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <i className="fab fa-github"></i>
                    Sign up with GitHub
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/signin">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignUpPage; 