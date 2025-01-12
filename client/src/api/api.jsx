import axios from 'axios';

// Set up Axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000', // Your base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// ------------------------------ User's Api --------------------

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

// ============== Get Users ==============
export const getUsers = async () => {
  try {
    const response = await api.get(`/api/user/getUsers`)
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Subject fatching error');
  }
}

// ============ Get User base on Department ==========
export const getUserQueryBase = async (department) => {
  try {
    const response = await api.get(`/api/user/getUserQueryBase?department=${department}`)
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Subject fatching error');
  }
}
// ============ Get User ById for subject ==========
export const getUserById = async (_id) => {
  try {
    const response = await api.get(`/api/user/getUserById/${_id}`)
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Subject fatching error');
  }
}




// ------------------------ Department Api's -------------

// ============ Get Department Api =======
export const getDepartment = async () => {
  try {
    const response = await api.get('/api/getDepartment')
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Depertment fatching error');
  }
}
// ============ Get Department Api =======
export const getDepartmentById = async (_id) => {
  try {
    const response = await api.get(`/api/getDepartmentById/${_id}`)
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
// ============ Add Department Api =======
export const addDepartment = async (data) => {
  try {
    const response = await api.post(`/api/addDepartment`, data)
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Depertment Adding error');
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


// ------------------------------ student Api --------------------
// Function to add Student
export const addStudent = async (data) => {
  try {
    const response = await api.post('/api/student/addStudent', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Student not added something wrong');
  }
};

// Function to add Student in Bulk
export const addBulkStudents = async (data) => {
  try {
    const response = await api.post('/api/student/addBulkStudents', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Student not added in bulk something wrong');
  }
};

// Function to get Student
export const getStudent = async () => {
  try {
    const response = await api.get('/api/student/getStudent');
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Student not fatching something wrong');
  }
};

// Function to update Student
export const updateStudent = async (data) => {
  try {
    const response = await api.put('/api/student/updateStudent', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Student not Updating something wrong');
  }
};

// Function to delete Student
export const deleteStudent = async (data) => {
  console.log(data)
  try {
    const response = await api.post('/api/student/deleteStudent', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Student not deleting something wrong');
  }
};



// Function to get Student for semester
export const getStudentForSemester = async (data) => {
  // console.log(data)
  try {
    const response = await api.post('/api/student/getStudentForSemester', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'error in fatching for semester student');
  }
};



// ------------- Semester in add in Bulk ----------
export const addSemesterinBulk = async (data) => {
  // console.log(data)
  try {
    const response = await api.post('/api/semester/addSemesterinBulk', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'error in semester addin bulk time');
  }
};


// ------------- Get generate semester for teachar to give marks ----------

export const getStudentHaveSemester = async (data) => {
  // console.log(data)
  try {
    const response = await api.post('/api/student/getStudentHaveSemester', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'error in semester addin bulk time');
  }
};

// ------------- add subject in semesters -------------
export const addSubjectsInSemesterBulk = async (data) => {
  // console.log(data)
  try {
    const response = await api.post('/api/semester/addSubjectsInSemesterBulk', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'error in semester subject add in bulk time');
  }
};


// ------------- get subject have subject in  semesters -------------
export const getStudentMarkForSpecificTeacher = async (data) => {
  // console.log(data)
  try {
    const response = await api.post('/api/student/getStudentMarkForSpecificTeacher', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Subject Not fatch something is wrong');
  }
};



// ------------- subject mark update ------------
export const updateMark = async (data) => {
  // console.log(data)
  try {
    const response = await api.put('/api/marks/updateMark', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Subject Not Update something is wrong');
  }
};


// -------- Get complete semesters subjects -------
export const getCompletedSemesterSubject = async (data) => {
  // console.log(data)
  try {
    const response = await api.post('/api/semester/getCompletedSemesterSubject', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'error in getCompletedSemesterSubject ');
  }
};

// -------- Get complete semesters subjects -------
export const getInCompletedSemesterSubject = async (data) => {
  // console.log(data)
  try {
    const response = await api.post('/api/semester/getInCompletedSemesterSubject', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'error in getInCompletedSemesterSubject ');
  }
};
// -------- Here generate result ---------
export const generateResultNow = async (data) => {
  // console.log(data)
  try {
    const response = await api.post('/api/semester/generateResultNow', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'error in generateResultNow');
  }
};
