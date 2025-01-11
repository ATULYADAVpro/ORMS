async getStudentHaveSemester(req, res, next) {
    try {
        const { admissionDate, examType, stream, date_of_issue, sem, subjectId } = req.body;
        const filterData = [];

        const semesters = await Semester.find({
            examType,
            stream: new mongoose.Types.ObjectId(stream), // Correct comparison of ObjectId
            date_of_issue,
            sem
        }).populate("student").populate("subjects");

        for (const element of semesters) {
            if (!element.subjects || element.subjects.every(sub => mongoose.Types.ObjectId(sub.subjectId).toString() !== mongoose.Types.ObjectId(subjectId).toString())) {
                filterData.push(element);
            }
        }

        return res.status(200).json(filterData);
    } catch (error) {
        return next(error);
    }
}


import { updateStudentData } from '../../../api/api'; // Import your update API function

const { mutate: updateStudentDataMutate } = useMutation(updateStudentData, {
    onSuccess: (data) => {
        toast.success('Successfully updated student data.');
        // Optionally update your local state here if needed
    },
    onError: (error) => {
        toast.error(error.message);
    },
});

function handleUpdate() {
    if (!selectedUser) return;

    const updatedData = {
        ...selectedUser,
        internal: parseInt(document.querySelector('input[name="internal"]').value, 10),
        external: parseInt(document.querySelector('input[name="external"]').value, 10),
        credit: parseInt(document.querySelector('input[name="credit"]').value, 10),
        practicalMark: parseInt(document.querySelector('input[name="practicalMark"]').value, 10),
        practicalCredit: parseInt(document.querySelector('input[name="practicalCredit"]').value, 10),
    };

    updateStudentDataMutate(updatedData);
}
