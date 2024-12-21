// export const sendOtp = async ({ email }) => {
//     // Make API call to send OTP
//     const response = await fetch('/api/send-otp', {
//       method: 'POST',
//       body: JSON.stringify({ email }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     return response.json(); // Assuming the response contains OTP sending info
//   };

//   export const verifyOtp = async ({ email, otp }) => {
//     // Make API call to verify OTP
//     const response = await fetch('/api/verify-otp', {
//       method: 'POST',
//       body: JSON.stringify({ email, otp }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     return response.json(); // Assuming the response contains user data and role
//   };

import axios from 'axios';

// Set up Axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000', // Your base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to send OTP
export const sendOtp = async ({ email }) => {
  try {
    const response = await api.post('/api/auth/sendOtp', { email });
    return response.data; // Assuming the response contains necessary data
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Error sending OTP');
  }
};

// Function to verify OTP
export const verifyOtp = async ({ email, otp }) => {
  try {
    const response = await api.post('/api/auth/loginWithOtp', { email, otp });
    return response.data; // Assuming the response contains user data and role
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Error verifying OTP');
  }
};


// Function to add faculty
export const addFaculty = async (data) => {
  try {
    const response = await api.post('/api/auth/register', data);
    return response.data; // 
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Error verifying OTP');
  }
};


