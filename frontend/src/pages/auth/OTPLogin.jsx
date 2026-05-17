import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const OTPLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Step 1: Email input
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [purpose, setPurpose] = useState('login');
  const inputRefs = useRef([]);

  useEffect(() => {
    // Get email from navigation state if available
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setEmail(emailFromState);
      setStep('otp');
    }
  }, [location]);

  useEffect(() => {
    // Cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/auth/request-otp', {
        email: email.toLowerCase()
      });

      if (response.data.success) {
        setPurpose(response.data.data.purpose);
        setSuccess(`OTP sent to ${email}. Please check your inbox.`);
        setStep('otp');
        setResendCooldown(60);
        
        // Focus first OTP input
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOTPChange = (index, value) => {
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

  // Handle OTP input keydown
  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  // Handle OTP verification
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/auth/verify-otp', {
        email: email.toLowerCase(),
        otp: otpCode
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        const isNewUser = response.data.isNewUser;

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify({ user, token }));

        // Show success message
        toast.success(isNewUser ? 'Account created successfully!' : 'Login successful!');

        // Redirect based on role
        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (user.role === 'vendor') {
            navigate('/vendor/dashboard');
          } else {
            navigate('/customer/dashboard');
          }
        }, 1000);
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

  // Handle resend OTP
  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/auth/resend-otp', {
        email: email.toLowerCase()
      });

      if (response.data.success) {
        setSuccess('New OTP sent to your email!');
        setResendCooldown(60);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  // Handle back to email
  const handleBackToEmail = () => {
    setStep('email');
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="text-3xl font-bold text-black">RentalHub</div>
          </Link>
          
          {step === 'email' ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">
                Enter your email to receive a one-time password
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
              <p className="text-gray-600">
                We've sent a 6-digit code to
              </p>
              <p className="text-gray-900 font-medium mt-1">{email}</p>
            </>
          )}
        </div>

        {/* Email Step */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                'Continue with Email'
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <span className="text-black font-medium">
                  Just enter your email to sign up!
                </span>
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <Link
              to="/login"
              className="w-full block text-center py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Password Login
            </Link>
          </form>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <form onSubmit={handleOTPSubmit} className="space-y-6">
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
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors"
                  disabled={loading}
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

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
                purpose === 'signup' ? 'Create Account & Login' : 'Verify & Login'
              )}
            </button>

            {/* Resend */}
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
                <li>Code expires in 5 minutes</li>
                <li>You have 5 attempts per code</li>
              </ul>
            </div>

            {/* Back */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleBackToEmail}
                className="text-gray-600 text-sm hover:text-gray-900"
              >
                ← Use different email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OTPLogin;
