import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MarkEntryForm.css';

const MarkEntryForm = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [examinerAssignments, setExaminerAssignments] = useState([]);
  const [marks, setMarks] = useState({
    reading: 0,
    accent: 0,
    tajweed: 0,
    memorization: 0,
  });
  const [total, setTotal] = useState(0);
  const [teacher, setTeacher] = useState('');
  const [student, setStudent] = useState('');
  const [studentDetails, setStudentDetails] = useState({
    juzz: '',
    examiner: '',
    consultant: '',
    studentId: '',
    name: '',
  });
  const [qualifyingMarks, setQualifyingMarks] = useState(null);
  const [voucher, setVoucher] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [date] = useState(new Date().toLocaleDateString());
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await fetch('http://localhost:3001/teachers');
      const data = await response.json();
      setTeachers(data);
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchExaminerAssignments = async () => {
      const response = await fetch('http://localhost:3001/examiner-assignments');
      const data = await response.json();
      setExaminerAssignments(data);
    };
    fetchExaminerAssignments();
  }, []);

  const handleTeacherChange = async (e) => {
    setTeacher(e.target.value);
    const response = await fetch(`http://localhost:3001/students?teacher=${e.target.value}`);
    const data = await response.json();
    setStudents(data);
  };

  const handleStudentChange = (e) => {
    const selectedStudent = students.find((s) => s._id === e.target.value);
    setStudent(e.target.value);
    setStudentDetails({
      ...studentDetails,
      studentId: selectedStudent.studentId,
      name: selectedStudent.fullName,
    });
  };

  useEffect(() => {
    const fetchQualifyingMarks = async () => {
      if (studentDetails.juzz) {
        try {
          const response = await axios.get('http://localhost:3001/qualifying-marks');
          const juzzData = response.data.find(juzz => juzz.subject === studentDetails.juzz);
          if (juzzData) {
            setQualifyingMarks(juzzData.minimumMarks);
          } else {
            setQualifyingMarks(null);
          }
        } catch (error) {
          console.error("Error fetching qualifying marks:", error);
          setQualifyingMarks(null);
        }
      }
    };

    fetchQualifyingMarks();
  }, [studentDetails.juzz]);

  const handleMarksChange = (e) => {
    setMarks({ ...marks, [e.target.name]: Number(e.target.value) });
  };

  const calculateTotal = () => {
    return marks.reading + marks.accent + marks.tajweed + marks.memorization;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalMarks = calculateTotal();
    setTotal(totalMarks);
  
    const passed = totalMarks >= qualifyingMarks;
  
    const selectedTeacher = teachers.find(t => t._id === teacher);
    
    const reportData = {
      student: {
        studentId: studentDetails.studentId,  // Ensure studentId is passed here
        name: studentDetails.name,
      },
      teacher: {
        teacherId: teacher,
        name: selectedTeacher ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : '',
      },
      marks,
      total: totalMarks,
      qualifyingMarks,
      passed,
      remarks: feedback,
      date,
    };
  
    // Navigate to GenerateReport and pass reportData
    navigate('/examiner/generate-report', { state: reportData });
  };
  

  return (
    <div className="mark-entry-container">
      <h2>Mark Entry Form</h2>
      <form className="mark-entry-form" onSubmit={handleSubmit}>
        <label>Teacher:</label>
        <select value={teacher} onChange={handleTeacherChange} required>
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.firstName} {teacher.lastName}
            </option>
          ))}
        </select>

        {teacher && (
          <>
            <label>Student:</label>
            <select value={student} onChange={handleStudentChange} required>
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.fullName}
                </option>
              ))}
            </select>
          </>
        )}

        {student && (
          <>
            <label>Juzz Tested:</label>
            <input
              type="text"
              name="juzz"
              value={studentDetails.juzz}
              onChange={(e) => setStudentDetails({ ...studentDetails, juzz: e.target.value })}
              required
            />
            {qualifyingMarks !== null && (
              <div className="qualifying-marks-display">
                <p>Qualifying Marks for Juzz {studentDetails.juzz}: {qualifyingMarks}</p>
              </div>
            )}

            <label>Examiner:</label>
            <select
              name="examiner"
              value={studentDetails.examiner}
              onChange={(e) => setStudentDetails({ ...studentDetails, examiner: e.target.value })}
              required
            >
              <option value="">Select Examiner</option>
              {examinerAssignments.map((assignment) => (
                <option key={assignment._id} value={assignment.examinerId}>
                  {assignment.examinerName} {assignment.examinerId}
                </option>
              ))}
            </select>

            <label>Reading (Max: 45):</label>
            <input
              type="number"
              name="reading"
              max="45"
              value={marks.reading}
              onChange={handleMarksChange}
            />
            <label>Accent (Max: 5):</label>
            <input
              type="number"
              name="accent"
              max="5"
              value={marks.accent}
              onChange={handleMarksChange}
            />
            <label>Tajweed (Max: 30):</label>
            <input
              type="number"
              name="tajweed"
              max="30"
              value={marks.tajweed}
              onChange={handleMarksChange}
            />
            <label>Memorization (Max: 20):</label>
            <input
              type="number"
              name="memorization"
              max="20"
              value={marks.memorization}
              onChange={handleMarksChange}
            />

            <div className="total-marks">
              <h3>Total Marks: {total}</h3>
              <h3>Qualifying Marks: {qualifyingMarks}</h3>
            </div>

            {voucher && (
              <div className="voucher-section">
                <h3>Voucher Earned: Yes</h3>
                <p>
                  Voucher Details: Minimum Marks: {voucher.minimumMarks}, Maximum Marks: {voucher.maximumMarks}
                </p>
              </div>
            )}

            {feedback && <div className="feedback-section">{feedback}</div>}

            <div className="date-section">
              <h4>Date: {date}</h4>
            </div>

            <button type="submit">Submit</button>
          </>
        )}
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default MarkEntryForm;
