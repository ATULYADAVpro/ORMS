import { useMutation, useQuery } from '@tanstack/react-query';
import style from './subjectAdd.module.css';
import { addSubject, getDepartment } from '../../../api/api';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function SubjectAdd() {
  const [formData, setFormData] = useState({
    stream: '',
    sem: '',
    name: '',
    code: '',
    credit: '',
    internalMax: '',
    internalMin: '',
    externalMax: '',
    externalMin: '',
    totalMax: "",
    totalMin: ""
  });

  const { data: departmentData, isLoading: departmentLoading, isError: departmentError } = useQuery({
    queryFn: getDepartment,
    queryKey: ['department'],
  });

  const addSubjectMutation = useMutation({
    mutationFn: addSubject,
    onSuccess: () => {
      toast.success('Successfully Added Subject!');
      setFormData({
        stream: '',
        sem: '',
        name: '',
        code: '',
        credit: '',
        internalMax: '',
        internalMin: '',
        externalMax: '',
        externalMin: '',
        totalMax: "",
        totalMin: ""
      });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const selectedDepartment = departmentData?.department.find(dep => dep._id === formData.stream);
    const showPracticals = selectedDepartment?.practical;

    const isFormValid = Object.keys(formData).every(field => {
      if (showPracticals || (field !== 'practicalName' && field !== 'practicalCode')) {
        return formData[field].trim() !== '';
      }
      return true;
    });

    if (!isFormValid) {
      toast.error('Please fill out all required fields.');
      return;
    }

    addSubjectMutation.mutate(formData);
  }

  const selectedDepartment = departmentData?.department.find(dep => dep._id === formData.stream);
  const showPracticals = selectedDepartment?.practical;

  return (
    <div className={style.container}>
      {departmentLoading ? (
        <p>Loading departments...</p>
      ) : departmentError ? (
        <p>Error loading departments</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={style.inputContainer}>
            <div className={style.inpBox}>
              <label htmlFor="stream">Select Stream:</label>
              <select name="stream" id="stream" value={formData.stream} onChange={handleInputChange} required>
                <option value="" disabled>Select Stream</option>
                {departmentData && departmentData.department.length > 0 ? (
                  departmentData.department.map((data) => (
                    <option value={data._id} key={data._id}>
                      {data.stream}
                    </option>
                  ))
                ) : (
                  <option disabled>No data available</option>
                )}
              </select>
            </div>

            <div className={style.inpBox}>
              <label htmlFor="sem">Select Semester:</label>
              <select name="sem" id="sem" value={formData.sem} onChange={handleInputChange} required>
                <option value="" disabled>Select Semester</option>
                <option value="1">Sem 1</option>
                <option value="2">Sem 2</option>
                <option value="3">Sem 3</option>
                <option value="4">Sem 4</option>
                {/* Add more semesters as needed */}
              </select>
            </div>

            <div className={style.inpBox}>
              <label htmlFor="name">Subject Name:</label>
              <input type="text" name="name" value={formData.name} required onChange={handleInputChange} placeholder="Subject name" />
            </div>

            <div className={style.inpBox}>
              <label htmlFor="code">Subject Code:</label>
              <input type="text" name="code" value={formData.code} required onChange={handleInputChange} placeholder="Subject code" />
            </div>
            <div className={style.inpBox}>
              <label htmlFor="credit">Credit:</label>
              <input type="number" name="credit" value={formData.credit} required onChange={handleInputChange} placeholder="Credit" />
            </div>
            <div className={style.flexBox}>
              <div className={style.inpBox}>
                <label htmlFor="internalMax">Internal Max: </label>
                <input type="number" name="internalMax" value={formData.internalMax} required onChange={handleInputChange} placeholder="Internal Max" />
              </div>

              <div className={style.inpBox}>
                <label htmlFor="internalMin">Internal Min:</label>
                <input type="number" name="internalMin" value={formData.internalMin} required onChange={handleInputChange} placeholder="Internal Min" />
              </div>
            </div>

            <div className={style.flexBox}>
              <div className={style.inpBox}>
                <label htmlFor="externalMax">External Max: </label>
                <input type="number" name="externalMax" value={formData.externalMax} required onChange={handleInputChange} placeholder="External Max" />
              </div>

              <div className={style.inpBox}>
                <label htmlFor="externalMin">External Min:</label>
                <input type="number" name="externalMin" value={formData.externalMin} required onChange={handleInputChange} placeholder="External Min" />
              </div>
            </div>
            <div className={style.flexBox}>
              <div className={style.inpBox}>
                <label htmlFor="totalMax">Total Max: </label>
                <input type="number" name="totalMax" value={formData.totalMax} required onChange={handleInputChange} placeholder="total Max" />
              </div>

              <div className={style.inpBox}>
                <label htmlFor="totalMin">Total Min:</label>
                <input type="number" name="totalMin" value={formData.totalMin} required onChange={handleInputChange} placeholder="Total Min" />
              </div>
            </div>

            {showPracticals && (
              <>
                <div className={style.inpBox}>
                  <label htmlFor="practicalName">Practical Name:</label>
                  <input type="text" name="practicalName" value={formData.practicalName || ''} required={showPracticals} onChange={handleInputChange} placeholder="Practical name" />
                </div>

                <div className={style.flexBox}>
                  <div className={style.inpBox}>
                    <label htmlFor="practicalCode">Practical Code:</label>
                    <input type="text" name="practicalCode" value={formData.practicalCode || ''} required={showPracticals} onChange={handleInputChange} placeholder="Practical code" />
                  </div>
                  <div className={style.inpBox}>
                    <label htmlFor="practicalCredit">Practical Code:</label>
                    <input type="text" name="practicalCredit" value={formData.practicalCredit || ''} required={showPracticals} onChange={handleInputChange} placeholder="Practical credit" />
                  </div>
                </div>

                <div className={style.flexBox}>
                  <div className={style.inpBox}>
                    <label htmlFor="practicalMax">Practical Max:</label>
                    <input type="number" name="practicalMax" value={formData.practicalMax || ''} required={showPracticals} onChange={handleInputChange} placeholder="Practical name" />
                  </div>
                  <div className={style.inpBox}>
                    <label htmlFor="practicalMin">Practical Min:</label>
                    <input type="number" name="practicalMin" value={formData.practicalMin || ''} required={showPracticals} onChange={handleInputChange} placeholder="Practical name" />
                  </div>
                </div>
              </>
            )}

            <div className={style.inpBox}>
              <hr />
              <button type="submit" disabled={addSubjectMutation.isLoading}>
                {addSubjectMutation.isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
