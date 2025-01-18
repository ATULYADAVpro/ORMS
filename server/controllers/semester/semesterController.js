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
    // // --------------- Do active status for multiple students --------
    // async semesterActiveBulk(req, res, next) {
    //     try {
    //         const { students } = req.body; // Assuming 'students' is an array of student data

    //         let results = []; // Initialize an array to store results for each student

    //         for (const student of students) {
    //             const { _id, sem, stream } = student;
    //             const semester = await Semester.findById(_id).populate({ path: "subjects" });
    //             const subjects = await Subject.find({ sem, stream });

    //             let leftSubjects = []; // Initialize as an array to store all unmatched subjects

    //             let semesterSubjectIds = semester.subjects.map(sems => sems); // Keep ObjectId as it is

    //             // Loop through all subjects and check if they are in the semester subjects
    //             for (const sub of subjects) {
    //                 const isSubjectPresent = semester.subjects.some(semesterSubject =>
    //                     semesterSubject.subjectId.equals(sub._id) // Use .equals() for comparison
    //                 );

    //                 if (!isSubjectPresent) {
    //                     leftSubjects.push(sub); // Add unmatched subjects to the array
    //                 }
    //             }

    //             if (leftSubjects.length > 0) {
    //                 // Return message if there are unmatched subjects
    //                 return res.status(400).json({
    //                     message: `Some subjects are not submitted left ${leftSubjects.length}, contact your teacher`,
    //                     leftSubjects
    //                 });
    //             } else {
    //                 // Update status field to true if all subjects are submitted
    //                 semester.status = true;
    //                 semester.calculateSGPA(semesterSubjectIds);

    //                 try {
    //                     // Save the instance after calculation
    //                     await semester.save();
    //                     // console.log('Semester saved successfully:', semester);

    //                     // Return semester subject IDs in the response body (still keep ObjectId)
    //                     return res.status(200).json({
    //                         message: "All subjects submitted successfully and status updated",
    //                         semester,
    //                         semesterSubjectIds // Include the semesterSubjectIds without converting to string
    //                     });
    //                 } catch (err) {
    //                     // console.error('Error saving semester:', err);
    //                     return next(err);
    //                 }
    //             }
    //         }

    //         // Return results for all students
    //         return res.status(200).json({ results });

    //     } catch (error) {
    //         return next(error);
    //     }
    // },

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

    async addSubjectsInSemesterBulk(req, res, next) {
        try {
            const { studentsData } = req.body;
            // console.log(studentsData)

            let results = []; // Initialize an array to store results for each student

            for (const studentData of studentsData) {
                const { semesterDetails, markDetails } = studentData;
                // console.log(markDetails)

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

    // async getCompletedSemesterSubject(req, res, next) {
    //     const { stream, sem, date_of_issue, admissionDate, examType } = req.body;
    //     try {
    //         const semesters = await Semester.find({ stream, sem, date_of_issue, examType }).populate("subjects").populate("student")
    //         const subjects = await Subject.find({ stream, sem });

    //         // ------ Checking if semesters and subjects exist or not ------
    //         if (!semesters || semesters.length === 0) {
    //             return next(CustomErrorHandler.notFound("Not found Semester!"));
    //         }
    //         if (!subjects || subjects.length === 0) {
    //             return next(CustomErrorHandler.notFound("Not found Subject!"));
    //         }

    //         // Filter semesters where all subjects match
    //         const matchedSemesters = semesters.filter(semester => {
    //             return subjects.every(subject => {
    //                 return semester.subjects.some(semesterSubject =>
    //                     semesterSubject.subjectId.equals(subject._id) // Use .equals() for comparison
    //                 );
    //             });
    //         });

    //         if (matchedSemesters.length === 0) {
    //             return next(CustomErrorHandler.notFound("No semesters found with all matching subjects!"));
    //         }

    //         res.status(200).json(matchedSemesters);

    //     } catch (error) {
    //         return next(error);
    //     }
    // }

    async getCompletedSemesterSubject(req, res, next) {
        const { stream, sem, date_of_issue, admissionDate, examType } = req.body;
        try {
            const semesters = await Semester.find({ stream, sem, date_of_issue, examType }).populate("subjects").populate("student")
            const subjects = await Subject.find({ stream, sem });

            // ------ Checking if semesters and subjects exist or not ------
            if (!semesters || semesters.length === 0) {
                return next(CustomErrorHandler.notFound("Not found Semester!"));
            }
            if (!subjects || subjects.length === 0) {
                return next(CustomErrorHandler.notFound("Not found Subject!"));
            }

            // Filter semesters where all subjects match
            const matchedSemesters = semesters.filter(semester => {
                return subjects.every(subject => {
                    return semester.subjects.some(semesterSubject =>
                        semesterSubject.subjectId.equals(subject._id) // Use .equals() for comparison
                    );
                });
            });

            if (matchedSemesters.length === 0) {
                return next(CustomErrorHandler.notFound("No semesters found with all matching subjects!"));
            }

            // New condition: Filter out semesters where the status is true
            const filteredSemesters = matchedSemesters.filter(semester => !semester.status);

            if (filteredSemesters.length === 0) {
                return next(CustomErrorHandler.notFound("No semesters found with all matching subjects and status is not true!"));
            }

            res.status(200).json(filteredSemesters);

        } catch (error) {
            return next(error);
        }
    },

    // async generateResultNow(req, res, next) {
    //     const students = req.body;
    //     // console.log(students)
    //     try {
    //         for (const std of students) {
    //             const semester = await Semester.findById(std._id).populate("subjects");
    //             if (!semester) {
    //                 continue; // skip this student if semester is not found
    //             }

    //             // Update status field to true
    //             semester.status = true;

    //             // Assuming calculateSGPA is a method in the Semester model
    //             semester.calculateSGPA();

    //             await semester.save();
    //         }
    //         res.status(200).json({ message: "Results generated successfully" });
    //     } catch (error) {
    //         return next(error);
    //     }
    // }

    async generateResultNow(req, res, next) {
        const studentIds = req.body;
        console.log("Student IDs array:", studentIds);
        try {
            for (const id of studentIds) {
                const semester = await Semester.findById(id).populate("subjects");
                if (!semester) {
                    console.log(`Semester not found for student ID: ${id}`);
                    continue;
                }

                // Update status field to true
                semester.status = true;

                // Ensure subjects array is populated
                if (!Array.isArray(semester.subjects) || semester.subjects.length === 0) {
                    console.log(`No subjects found for student ID: ${id}`);
                    continue;
                }

                // Log subjects before calling calculateSGPA
                // console.log(`Subjects for student ID: ${id}`, semester.subjects);

                // Assuming calculateSGPA is a method in the Semester model
                try {
                    semester.calculateSGPA(semester.subjects);
                    await semester.save();
                    // console.log(`Results saved successfully for student ID: ${id}`);
                } catch (calculationError) {
                    // console.error(`Error calculating SGPA for student ID: ${id}`, calculationError);
                    continue;
                }
            }
            res.status(200).json({ message: "Results generated successfully" });
        } catch (error) {
            console.error("Error generating results", error);
            return next(error);
        }
    },

    // async getInCompletedSemesterSubject(req, res, next) {
    //     const { stream, sem, date_of_issue, examType } = req.body;

    //     try {
    //         const semesters = await Semester.find({ stream, sem, date_of_issue, examType }).populate({ path: "subjects" }).populate("student");
    //         const subjects = await Subject.find({ sem, stream });

    //         let result = []; // Array to hold the result for each semester

    //         semesters.forEach(semester => {
    //             let leftSubjects = []; // Initialize as an array to store all unmatched subjects for the current semester

    //             // Loop through all subjects and check if they are in the semester subjects
    //             for (const sub of subjects) {
    //                 const isSubjectPresent = semester.subjects.some(semesterSubject =>
    //                     semesterSubject.subjectId.equals(sub._id) // Use .equals() for comparison
    //                 );

    //                 if (!isSubjectPresent) {
    //                     leftSubjects.push(sub); // Add unmatched subjects to the array
    //                 }
    //             }

    //             if (leftSubjects.length > 0) {
    //                 result.push({
    //                     semester,
    //                     leftSubjects
    //                 });
    //             }


    //         });

    //         return res.status(200).json(result);
    //     } catch (error) {
    //         return next(error);
    //     }
    // }
    async getInCompletedSemesterSubject(req, res, next) {
        const { stream, sem, date_of_issue, examType } = req.body;

        try {
            // Fetch semesters and subjects based on filters
            const semesters = await Semester.find({ stream, sem, date_of_issue, examType })
                .populate({ path: "subjects" })
                .populate("student");

            const subjects = await Subject.find({ sem, stream });

            if (!semesters.length || !subjects.length) {
                return res.status(404).json({ message: "No data found for the given criteria." });
            }

            // Prepare results
            const result = semesters.map(semester => {
                const semesterSubjectIds = new Set(semester.subjects.map(s => s.subjectId.toString()));

                // Filter unmatched subjects
                const unmatchedSubjects = subjects.filter(sub => !semesterSubjectIds.has(sub._id.toString()));

                return unmatchedSubjects.length > 0
                    ? { semester, leftSubjects: unmatchedSubjects }
                    : null;
            }).filter(Boolean); // Remove null results

            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    },

    async getActiveSemester(req, res, next) {
        const sems = req.body;
        try {
            let activeSems = [];
            for (const obj of sems) {
                const semesters = await Semester.findById(obj).populate("subjects").populate("stream")
                if (semesters && semesters.status === true) {
                    activeSems.push(semesters);
                }
            }
            res.json(activeSems);
        } catch (error) {
            return next(error);
        }
    },


    async getActiveSemesterForExportResult(req, res, next) {
        const { sem, stream, examType, date_of_issue } = req.body;
        try {
            let activeSems = [];
            const semesters = await Semester.find({ sem, stream, examType, date_of_issue }).populate("subjects").populate("stream").populate("student")
            if (!semesters) {
                return next(CustomErrorHandler.notFound("This semester Data is not found"))
            }

            for (const sems of semesters) {
                if (sems.status === true) {
                    activeSems.push(sems)
                }

            }
            if (activeSems.length > 0) {
                res.status(200).json(activeSems)
            } else {
                return next(CustomErrorHandler.notFound("This semester Data is not found"))
            }




        } catch (error) {
            return next(error);
        }
    },

    async displayResultData(req, res, next) {
        const { sem, date_of_issue, rollNo } = req.body;
        try {
            if (!sem || !date_of_issue || !rollNo) {
                return next(CustomErrorHandler.RequireField("All fields are required."));
            }

            const student = await Student.findOne({ rollNo });
            if (!student) {
                return next(CustomErrorHandler.notFound("Student not found."));
            }

            const semester = await Semester.findOne({ sem, date_of_issue, student: student._id }).populate("student").populate("stream").populate("subjects");
            if (!semester) {
                return next(CustomErrorHandler.notFound("Semester is not created... contact your teacher."));
            }

            if (semester.status === true) {
                return res.status(200).json(semester);
            } else {
                return next(CustomErrorHandler.notFound("Semester is not active, contact your HOD."));
            }

        } catch (error) {
            return next(error);
        }
    },



    // ---------------------- Manage Atkt -------

    async findAtktSemesters(req, res, next) {
        const { sem, stream, date_of_issue } = req.body;
        const success = false;
        const status = true;
        try {
            const semesters = await Semester.find({ sem, stream, date_of_issue, success, status })
                .populate("subjects")
                .populate("stream")
                .populate("student");

            if (!semesters) {
                return next(CustomErrorHandler.notFound("Data not Available"));
            }

            // Structure response as {semester, failSubject}
            const result = semesters.map((semester) => {
                const failSubjects = semester.subjects.filter((subject) =>
                    subject.grade === 'F' || subject.practicalGrade === 'F'
                );
                return {
                    semester,
                    failSubjects
                };
            });

            res.json(result);

        } catch (error) {
            return next(error);
        }
    },

    async subjectDeleteInAtkt(req, res, next) {
        const { semesterArray, date_of_issue } = req.body;
        try {
            for (const semesterId of semesterArray) {
                const semester = await Semester.findById(semesterId).populate("subjects");
    
                if (!semester) {
                    return next(CustomErrorHandler.notFound("Semester not found"));
                }
    
                const passSubjects = semester.subjects
                    .filter((sub) => sub.grade !== 'F' && sub.practicalGrade !== 'F')
                    .map((sub) => sub._id);
    
                const newAtktsemester = new Semester({
                    student: semester.student,
                    stream: semester.stream,
                    subjects: passSubjects,
                    sem: semester.sem,
                    examType: "atkt",
                    date_of_issue
                });
    
                await newAtktsemester.save();
    
                const studentDetails = await Student.findById(semester.student);
                studentDetails.semesters.push(newAtktsemester._id);
                await studentDetails.save();
            }
    
            res.json({ message: "New ATKT semesters created successfully" });
        } catch (error) {
            return next(error);
        }
    }
    






};

export default semesterController;
