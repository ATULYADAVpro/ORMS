import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import style from './css/login.module.css';
import { sendOtp, verifyOtp } from '../../api/api'; // Import Axios functions
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpErrors, setOtpErrors] = useState([false, false, false, false]); // Track OTP field errors
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation for sending OTP
  const sendOtpMutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: () => {
      setIsEmailSubmitted(true);
      toast.success('OTP sent successfully');
    },
    onError: (error) => {
      // console.error('Failed to send OTP:', error.message);
      toast.error(error.message);
    },
  });

  // Mutation for verifying OTP and handling login
  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      console.log(data.role)
      // Save authentication data to cache and localStorage
      const authData = { isAuthenticated: true, user: data };
      queryClient.setQueryData(['auth'], authData);
      localStorage.setItem('auth', JSON.stringify(authData));

      // Redirect based on user role
      if (data.role === 'admin') {
        navigate('/admin/home');
      } else if (data.role === 'teacher') {
        navigate('/teacher/home');
      }
    },
    onError: (error) => {
      console.log(error)
      toast.error(error.message);
    },
  });

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle email submission (send OTP)
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      sendOtpMutation.mutate({ email });
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    let newOtp = [...otp];
    newOtp[index] = e.target.value;

    if (e.target.value.length === 1 && index < 3) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    } else if (e.target.value === '' && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
    setOtp(newOtp);
  };

  // Handle OTP submission (verify OTP)
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    let errors = otp.map((item) => item === '');
    setOtpErrors(errors);

    if (errors.includes(true)) {
      toast.error('Please fill out all OTP fields.');
      return;
    }

    const otpString = otp.join('');
    verifyOtpMutation.mutate({ email, otp: otpString });
  };

  return (
    <div className={style.container}>
      {/* Email Form */}
      {!isEmailSubmitted ? (
        <div className={style.formContainer}>
          <h1>Welcome Back!</h1>
          <form onSubmit={handleEmailSubmit}>
            <div className={style.inputContainer}>
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email here."
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <button className={style.btn} type="submit" disabled={sendOtpMutation.isPending}>
              {sendOtpMutation.isPending ? "Submit...." : "Submit"}
            </button>
          </form>
        </div>
      ) : (
        /* OTP Verification Form */
        <div className={style.formContainerOtp}>
          <h3>Verify Your Email Address</h3>
          <hr />
          <form>
            <div className={style.inputContainerOtp}>
              <p>
                Never share your OTP with anyone! It's your personal security code. Sharing it could lead to unauthorized access. Be vigilant against phishing attempts.
              </p>
              <div className={style.otpInput}>
                {otp.map((_, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(e, index)}
                    placeholder="-"
                    className={otpErrors[index] ? style.invalidOtp : ''}
                    required
                  />
                ))}
              </div>
            </div>
            <button
              className={style.btnOtp}
              onClick={handleOtpSubmit}
              type="button"
            >
              Verify
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
