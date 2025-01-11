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
