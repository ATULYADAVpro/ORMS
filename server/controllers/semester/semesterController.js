import Joi from "joi";
import CustomErrorHandler from "../../utils/services/CustomErrorHandler.js";
import Student from "../../models/StudentModels.js";
import Semester from "../../models/SemesterModel.js";
import moment from "moment"; // Import moment for date handling
import Subject from "../../models/SubjectModels.js";
import Marks from "../../models/MarkModel.js";

const semesterController = {

    // -------------- add semester ------------
    async addSemester(req, res, next) {
        try {
            // ------- Validation ------
            const semesterSchema = Joi.object({
                sem: Joi.string().required(),
                student: Joi.string().required(),
                date_of_issue: Joi.string().pattern(/^\d{2}-\d{4}$/).required(),
                examType: Joi.string().required()
            });
            const { value, error } = semesterSchema.validate(req.body);
            if (error) { return next(error); }

            // Format the date_of_issue to "DD-MM-YYYY"
            value.date_of_issue = moment(value.date_of_issue, "MM-YYYY").format("MM-YYYY");

            // ------------- Verify Student Exists ------
            const studentExist = await Student.findById(value.student).select('_id firstName rollNo semesters stream');
            if (!studentExist) { return next(CustomErrorHandler.notFound("Student not Found")); }

            // ----------------- Verify Semester Exists ------
            const semesterExist = await Semester.findOne({ sem: value.sem, student: value.student, date_of_issue: value.date_of_issue }).select('_id');
            if (semesterExist) { return next(CustomErrorHandler.AlreadyExists("This student already has this semester")); }

            // ------------ Add Semester Details in DB ------------
            const addSemesterData = new Semester({
                stream: studentExist.stream,
                ...value
            });
            await addSemesterData.save();

            // ------- Add Semester ID to Student's Semester Field ----
            studentExist.semesters = studentExist.semesters.concat(addSemesterData._id);
            await studentExist.save();

            res.status(200).json({ success: true, message: `Successfully added semester for ${studentExist.firstName}`, addSemesterData });

        } catch (error) {
            return next(error);
        }
    },

    // ----------- Get Semester -----------
    async getSemester(req, res, next) {
        try {
            const semester = await Semester.find({})
            if (!semester) { return next(CustomErrorHandler.notFound("Semester are empty or not found")) }
            res.status(200).json({ message: "Successfull Getting semester ", semester })

        } catch (error) {
            return next(error)
        }
    },

    // --------------- Do active status --------
    async semesterActive(req, res, next) {
        try {
            const { _id, sem, stream } = req.body;
            const semester = await Semester.findById(_id).populate({ path: "subjects" });
            const subjects = await Subject.find({ sem, stream });

            let leftSubjects = []; // Initialize as an array to store all unmatched subjects
            let semesterSubjectIds = semester.subjects.map(sems => sems); // Keep ObjectId as it is

            // Loop through all subjects and check if they are in the semester subjects
            for (const sub of subjects) {
                const isSubjectPresent = semester.subjects.some(semesterSubject =>
                    semesterSubject.subjectId.equals(sub._id) // Use .equals() for comparison
                );

                if (!isSubjectPresent) {
                    leftSubjects.push(sub); // Add unmatched subjects to the array
                }
            }

            if (leftSubjects.length > 0) {
                // Return message if there are unmatched subjects
                return res.status(400).json({
                    message: `Some subjects are not submitted left ${leftSubjects.length}, contact your teacher`,
                    leftSubjects
                });
            } else {
                // Update status field to true if all subjects are submitted
                semester.status = true;
                semester.calculateSGPA(semesterSubjectIds);

                try {
                    // Save the instance after calculation
                    await semester.save();
                    console.log('Semester saved successfully:', semester);

                    // Return semester subject IDs in the response body (still keep ObjectId)
                    return res.status(200).json({
                        message: "All subjects submitted successfully and status updated",
                        semester,
                        semesterSubjectIds // Include the semesterSubjectIds without converting to string
                    });
                } catch (err) {
                    console.error('Error saving semester:', err);
                    return next(err);
                }
            }
        } catch (error) {
            return next(error);
        }
    },
    // --------------- Do active status for multiple students --------
    async semesterActiveBulk(req, res, next) {
        try {
            const { students } = req.body; // Assuming 'students' is an array of student data

            let results = []; // Initialize an array to store results for each student

            for (const student of students) {
                const { _id, sem, stream } = student;
                const semester = await Semester.findById(_id).populate({ path: "subjects" });
                const subjects = await Subject.find({ sem, stream });

                let leftSubjects = []; // Initialize as an array to store all unmatched subjects

                let semesterSubjectIds = semester.subjects.map(sems => sems); // Keep ObjectId as it is

                // Loop through all subjects and check if they are in the semester subjects
                for (const sub of subjects) {
                    const isSubjectPresent = semester.subjects.some(semesterSubject =>
                        semesterSubject.subjectId.equals(sub._id) // Use .equals() for comparison
                    );

                    if (!isSubjectPresent) {
                        leftSubjects.push(sub); // Add unmatched subjects to the array
                    }
                }

                if (leftSubjects.length > 0) {
                    // Return message if there are unmatched subjects
                    return res.status(400).json({
                        message: `Some subjects are not submitted left ${leftSubjects.length}, contact your teacher`,
                        leftSubjects
                    });
                } else {
                    // Update status field to true if all subjects are submitted
                    semester.status = true;
                    semester.calculateSGPA(semesterSubjectIds);

                    try {
                        // Save the instance after calculation
                        await semester.save();
                        // console.log('Semester saved successfully:', semester);

                        // Return semester subject IDs in the response body (still keep ObjectId)
                        return res.status(200).json({
                            message: "All subjects submitted successfully and status updated",
                            semester,
                            semesterSubjectIds // Include the semesterSubjectIds without converting to string
                        });
                    } catch (err) {
                        // console.error('Error saving semester:', err);
                        return next(err);
                    }
                }
            }

            // Return results for all students
            return res.status(200).json({ results });

        } catch (error) {
            return next(error);
        }
    },

    // ------------------------- for teachar subject permission related add subject functionalty ------
    async addSubjectInSemester(req, res, next) {
        try {
            const { semesterDetails, markDetails } = req.body;

            // Find the semester
            const semester = await Semester.findOne({
                sem: semesterDetails.sem,
                stream: semesterDetails.stream,
                student: semesterDetails.student,
                date_of_issue: semesterDetails.date_of_issue
            }).populate({ path: "subjects" });

            if (!semester) {
                return next(CustomErrorHandler.notFound("Semester not found"));
            }

            // const subjectSchema = await Subject.findById(markDetails.subjectId)


            // Verify if the subject already exists (case-insensitive check)
            const subjectExist = semester.subjects.some((subject) =>
                subject.subjectCode.toLowerCase() === markDetails.subjectCode.toLowerCase()
            );

            if (subjectExist) {
                return next(CustomErrorHandler.AlreadyExists("This subject already added"));
            }

            // Create Mark entry
            const submitMark = new Marks({
                semesterId: semester._id,
                ...markDetails
            });

            // Save the new mark entry
            await submitMark.save();

            // Add the new mark ID to the semester's subjects array
            semester.subjects.push(submitMark._id);

            // Save the updated semester
            await semester.save();

            res.status(200).json({ success: true, message: "Successfully added subject", submitMark });
        } catch (error) {
            return next(error);
        }
    },

     // ------------------------- in for teachar subject permission related add subject functionalty ------

    // async addSubjectsInSemesterBulk(req, res, next) {
    //     try {
    //         const { semesterDetailsList, markDetailsList } = req.body;

    //         let results = []; // Initialize an array to store results for each semester

    //         for (const semesterDetails of semesterDetailsList) {
    //             // Find the semester
    //             const semester = await Semester.findOne({
    //                 sem: semesterDetails.sem,
    //                 stream: semesterDetails.stream,
    //                 student: semesterDetails.student,
    //                 date_of_issue: semesterDetails.date_of_issue
    //             }).populate({ path: "subjects" });

    //             if (!semester) {
    //                 results.push({ error: `Semester not found for student: ${semesterDetails.student}` });
    //                 continue; // Skip to the next semesterDetails if not found
    //             }

    //             let submitMarks = [];

    //             for (const markDetails of markDetailsList) {
    //                 // Verify if the subject already exists (case-insensitive check)
    //                 const subjectExist = semester.subjects.some((subject) =>
    //                     subject.subjectCode.toLowerCase() === markDetails.subjectCode.toLowerCase()
    //                 );

    //                 if (subjectExist) {
    //                     continue; // Skip to the next markDetails if the subject already exists
    //                 }

    //                 // Create Mark entry
    //                 const submitMark = new Marks({
    //                     semesterId: semester._id,
    //                     ...markDetails
    //                 });

    //                 // Save the new mark entry
    //                 await submitMark.save();

    //                 // Add the new mark ID to the semester's subjects array
    //                 semester.subjects.push(submitMark._id);
    //                 submitMarks.push(submitMark);
    //             }

    //             // Save the updated semester
    //             await semester.save();

    //             results.push({ success: true, message: `Successfully added subjects for student: ${semesterDetails.student}`, submitMarks });
    //         }

    //         res.status(200).json({ results });
    //     } catch (error) {
    //         return next(error);
    //     }
    // },

    async addSubjectsInSemesterBulk(req, res, next) {
        try {
            const { studentsData } = req.body;
            console.log(studentsData)
    
            let results = []; // Initialize an array to store results for each student
    
            for (const studentData of studentsData) {
                const { semesterDetails, markDetails } = studentData;
    
                // Find the semester
                const semester = await Semester.findOne({
                    sem: semesterDetails.sem,
                    stream: semesterDetails.stream,
                    student: semesterDetails.student,
                    date_of_issue: semesterDetails.date_of_issue
                }).populate({ path: "subjects" });
    
                if (!semester) {
                    results.push({ error: `Semester not found for student: ${semesterDetails.student}` });
                    continue; // Skip to the next studentData if not found
                }
    
                let submitMarks = [];
    
                // Verify if the subject already exists (case-insensitive check)
                const subjectExist = semester.subjects.some((subject) =>
                    subject.subjectCode.toLowerCase() === markDetails.subjectCode.toLowerCase()
                );
    
                if (subjectExist) {
                    results.push({ message: `Subject already exists for student: ${semesterDetails.student}` });
                    continue; // Skip to the next studentData if the subject already exists
                }
    
                // Create Mark entry
                const submitMark = new Marks({
                    semesterId: semester._id,
                    ...markDetails
                });
    
                // Save the new mark entry
                await submitMark.save();
    
                // Add the new mark ID to the semester's subjects array
                semester.subjects.push(submitMark._id);
                submitMarks.push(submitMark);
    
                // Save the updated semester
                await semester.save();
    
                results.push({ success: true, message: `Successfully added subjects for student: ${semesterDetails.student}`, submitMarks });
            }
    
            res.status(200).json({ results });
        } catch (error) {
            return next(error);
        }
    },
    

     // ------- Addsemester In Bulk --------
     async addSemesterinBulk(req, res, next) {
        const { studentArray, examType, stream, date_of_issue, sem } = req.body;

        try {
            // Validate that the students array is provided
            if (!Array.isArray(studentArray) || studentArray.length === 0) {
                return next(CustomErrorHandler.Invailed("No students provided"));
            }

            for (const _id of studentArray) {
                //------ Find Student from Student collaction ------
                const student = await Student.findById(_id)
                if (!student) {
                    continue;
                    // Skip if student not found, optionally log this 
                }

                // --------- Find semester from semester collection with student details ---------
                const semester = await Semester.findOne({
                    stream,
                    student: student._id,
                    date_of_issue,
                    sem,
                    examType
                })

                if (!semester) {
                    const newSemester = new Semester({
                        stream,
                        student: student._id,
                        date_of_issue,
                        sem,
                        examType
                    })

                    student.semesters = student.semesters.concat(newSemester._id)
                    await student.save();
                    await newSemester.save();
                } else {
                    // Optionally handle if semester already exists for the student
                    return next(CustomErrorHandler.notFound("semester already exists for the student"))
                }
            }

            res.status(200).json({ message: "Semesters added successfully" });

        } catch (error) {
            return next(error)
        }

    },

};

export default semesterController;
