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

// Function to add faculty
export const updateFaculty = async (data) => {
  try {
    const response = await api.put('/api/user/updateUser', data);
    return response.data; // 
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'update');
  }
};

// Function to delete faculty
export const deleteFaculty = async (data) => {
  // console.log(data.email)
  const email = data.email;
  try {
    const response = await api.delete(`/api/user/deleteUser/:${email}`);
    return response.data; // 
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Delete error');
  }
};

// ============ Get Department Api =======
export const getDepartment = async () => {
  try {
    const response = await api.get('/api/getDepartment')
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Depertment fatching error');
  }
}

// ============ Update Department Api =======
export const updateDepartment = async (data) => {
  try {
    const response = await api.put('/api/updateDepartment', data)
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Depertment Updating error');
  }
}

// ============ Delete Department Api =======
export const deleteDepartment = async (data) => {
  const { _id } = data;
  try {
    const response = await api.delete(`/api/deleteDepartment/${_id}`)
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Depertment Deleting error');
  }
}

// =========== Get Subject ===============
export const getSubject = async (stream) => {
  try {
    const response = await api.get(`/api/subject/getSubject?stream=${stream}`)
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Subject fatching error');
  }

}

// =========== Get Subject ===============
export const getAllSubject = async () => {
  try {
    const response = await api.get(`/api/subject/getAllSubject`)
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'All Subject fatching error');
  }

}

// =========== Update Subject ===============
export const updateSubject = async (data) => {
  console.log(data)
  try {
    const response = await api.put(`/api/subject/subjectUpdate`, data)
    return response.data;
  } catch (error) {
    console.log(error)
    throw new Error(error.response ? error.response.data.message : ' Subject  updating error');
  }

}

// =========== Delete Subject ===============
export const deleteSubject = async (data) => {
  const _id = data._id;
  try {
    const response = await api.delete(`/api/subject/deleteSubject/${_id}`)
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : ' Subject delete error');
  }

}

// =========== Add Subject ===============
export const addSubject = async (data) => {
  try {
    const response = await api.post(`/api/subject/addSubject`, data)
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : ' Subject Adding error');
  }

}

// ============== Get Users ==============
export const getUsers = async () => {
  try {
    const response = await api.get(`/api/user/getUsers`)
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Subject fatching error');
  }
}
