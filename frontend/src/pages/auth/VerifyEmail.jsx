import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearPendingVerification } from '../../slices/authSlice';
import axios from 'axios';

const API_URL = '/api';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailSent, setEmailSent] = useState(true);
  const inputRefs = useRef([]);
  
  // Get pending verification from Redux (persisted in sessionStorage)
  const { pendingVerification, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Get email from multiple sources (prioritized)
  useEffect(() => {
    // Priority: 1. Redux pendingVerification, 2. Location state, 3. SessionStorage
    const emailFromRedux = pendingVerification?.email;
    const emailFromState = location.state?.email;
    const emailFromStorage = sessionStorage.getItem('verificationEmail');
    
    const resolvedEmail = emailFromRedux || emailFromState || emailFromStorage;
    
    if (resolvedEmail) {
      setEmail(resolvedEmail);
      // Set emailSent status from location state or redux
      const sentStatus = location.state?.emailSent ?? pendingVerification?.emailSent ?? true;
      setEmailSent(sentStatus);
    } else {
      // No email found anywhere - redirect to register
      navigate('/register', { replace: true });
    }
  }, [location, navigate, pendingVerification]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/email-verification/verify`, {
        email,
        code
      });

      if (response.data.success) {
        // Clear pending verification state
        dispatch(clearPendingVerification());
        sessionStorage.removeItem('verificationEmail');
        
        setSuccess('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Email verified! You can now login.' },
            replace: true 
          });
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Verification failed. Please try again.';
      setError(errorMessage);
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/email-verification/resend`, {
        email
      });

      if (response.data.success) {
        setSuccess('New verification code sent to your email!');
        setEmailSent(true);
        setResendCooldown(60); // 60 seconds cooldown
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to resend code. Please try again.';
      setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-gray-900 font-medium mt-1">{email}</p>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors"
                disabled={loading}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify Email'
            )}
          </button>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || resendCooldown > 0}
              className="text-black font-medium hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
            >
              {resendLoading ? (
                'Sending...'
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend Code'
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-2">💡 Tips:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Check your spam/junk folder</li>
              <li>Code expires in 10 minutes</li>
              <li>You have 5 attempts per code</li>
            </ul>
          </div>

          {/* Back to Register */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-gray-600 text-sm hover:text-gray-900"
            >
              ← Back to Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
