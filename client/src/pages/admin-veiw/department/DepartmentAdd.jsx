import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import style from './departmentAdd.module.css';
import { addDepartment } from '../../../api/api';
import { toast } from 'react-toastify';

export default function DepartmentAdd() {
  const queryClient = useQueryClient();
  const formRef = useRef(null);

  const { mutate: addDepartmentMutate, isLoading: isAdding } = useMutation({
    mutationFn: addDepartment,
    onSuccess: () => {
      toast.success('Successfully added department!');
      queryClient.invalidateQueries(['department']);
      formRef.current.reset(); // Reset the form
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const departmentFormData = {
      stream: e.target.stream.value,
      code: e.target.code.value,
      practical: e.target.practical.value,
      addmissionYearsCode: {
        FY: e.target.FY.value,
        SY: e.target.SY.value,
        TY: e.target.TY.value,
      }
    };

    addDepartmentMutate(departmentFormData);
  }

  return (
    <div className={style.container}>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className={style.inputContainer}>
          <h3>Here Add Department</h3>
          <div className={style.inputFlex}>
            <div className={style.inputBox}>
              <label htmlFor="stream">Stream: </label>
              <input type="text" name="stream" id="stream" placeholder='Stream' required />
            </div>
            <div className={style.inputBox}>
              <label htmlFor="code">Code: </label>
              <input type="text" name="code" id="code" placeholder='Code' required />
            </div>
          </div>

          <div className={style.inputFlex}>
            <div className={style.inputBox}>
              <label htmlFor="practical">Practical: </label>
              <select name="practical" id="practical" defaultValue={""}>
                <option value="" disabled>Select Practicals</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <div className={style.inputBox}>
              <label htmlFor="FY">First Year: </label>
              <input type="text" name="FY" id="FY" placeholder='First Year Code' required />
            </div>
          </div>

          <div className={style.inputFlex}>
            <div className={style.inputBox}>
              <label htmlFor="SY">Second Year: </label>
              <input type="text" name="SY" id="SY" placeholder='Second Year Code' required />
            </div>
            <div className={style.inputBox}>
              <label htmlFor="TY">Third Year: </label>
              <input type="text" name="TY" id="TY" placeholder='Third Year Code' required />
            </div>
          </div>

          <div className={style.inputFlex}>
            <button className={style.btn}>Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}
