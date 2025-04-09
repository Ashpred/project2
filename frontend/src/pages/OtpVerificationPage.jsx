import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Skip OTP verification and redirect to profile creation page
    navigate('/create-profile');
  }, [navigate]);
  
  return null; // Component will not render as it immediately redirects
};

export default OtpVerificationPage; 