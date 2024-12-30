import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './ViewEditReports.css';

const ViewEditReports = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [teachersName, setTeachersName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [editingReport, setEditingReport] = useState(null);
  const [teachers, setTeachers] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3001/students');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Error fetching students. Please try again.');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:3001/teachers');
      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Error fetching teachers. Please try again.');
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (teachersName) {
      const teacher = teachers.find(
        (teacher) => teacher.firstName + ' ' + teacher.lastName === teachersName
      );
      if (teacher) {
        const filtered = students.filter(
          (student) => student.teacher === teacher._id
        );
        setFilteredStudents(filtered);
      }
    } else {
      setFilteredStudents([]);
    }
  }, [teachersName, students, teachers]);

  const fetchReports = async (studentId, selectedDate) => {
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    try {
      const response = await fetch(
        `http://localhost:3001/reports?studentId=${studentId}&month=${month}&year=${year}`
      );
      if (response.ok) {
        const data = await response.json();
        setReports(data);
        setError('');
      } else {
        setError('No reports found for this student.');
        setReports([]);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Error fetching reports. Please try again.');
    }
  };

  const handleViewReport = () => {
    if (!selectedDate || !studentName || !teachersName) {
      setError('Please select a date, teacher, and enter a student name.');
      return;
    }
    const selectedStudent = students.find(
      (student) => student.fullName === studentName
    );
    if (!selectedStudent) {
      setError('Student not found. Please enter a valid student name.');
      return;
    }
    fetchReports(selectedStudent.studentId, selectedDate);
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
  };

  const handleSaveReport = async () => {
    const reportId = editingReport._id; // The ID of the report you are editing
    const updatedReport = {
      student: {
        studentId: editingReport.student.studentId,
        fullName: editingReport.student.fullName,
      },
      teacher: {
        teacherId: editingReport.teacher.teacherId,
        fullName: editingReport.teacher.fullName,
      },
      marks: editingReport.marks,
      qualifyingMarks: editingReport.qualifyingMarks,
      passed: editingReport.passed,
      remarks: editingReport.remarks,
    };
  
    try {
      const response = await axios.put(`http://localhost:3001/reports/${reportId}`, updatedReport);
      console.log(response.data.message);
      // Reload reports or update UI after successful update
      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId ? { ...report, ...updatedReport } : report
        )
      );
      setEditingReport(null); // Clear editing state after saving
    } catch (error) {
      console.error("Error updating report:", error);
      setError('Error updating report. Please try again.');
    }
  };

  return (
    <div className="view-edit-reports-container">
      <h2>View/Edit Reports</h2>

      <div className="input-group">
        <label>Select Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MMMM d, yyyy"
          className="datepicker"
          placeholderText="Select Date"
          popperClassName="react-datepicker-popper"
          withPortal
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      </div>

      <div className="input-group">
        <label>Select Teacher's Name</label>
        <select
          value={teachersName}
          onChange={(e) => setTeachersName(e.target.value)}
        >
          <option value="">Select a teacher</option>
          {teachers.map((teacher) => (
            <option
              key={teacher._id}
              value={teacher.firstName + ' ' + teacher.lastName}
            >
              {teacher.firstName} {teacher.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Select Student's Name</label>
        <select
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        >
          <option value="">Select a student</option>
          {filteredStudents.map((student) => (
            <option key={student.studentId} value={student.fullName}>
              {student.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <button onClick={handleViewReport}>View Report</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {reports.length > 0 && (
        <div className="reports-list">
          <h3>Reports</h3>
          {reports.map((report) => {
            const teacher = teachers.find(t => t._id === report.teacher.teacherId);
            return (
              <div key={report._id} className="report-item">
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(report.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Teacher:</strong> {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown'}
                </p>
                <p>
                  <strong>Student:</strong> {report.student.fullName}
                </p>
                <p>
                  <strong>Marks:</strong>
                </p>
                <ul>
                  <li>Reading: {report.marks.reading}</li>
                  <li>Accent: {report.marks.accent}</li>
                  <li>Tajweed: {report.marks.tajweed}</li>
                  <li>Memorization: {report.marks.memorization}</li>
                </ul>
                <p>
                  <strong>Total Marks:</strong> {report.total}
                </p>
                <p>
                  <strong>Qualifying Marks:</strong> {report.qualifyingMarks}
                </p>
                <p>
                  <strong>Result:</strong> {report.passed ? 'Passed' : 'Failed'}
                </p>
                <p>
                  <strong>Remarks:</strong> {report.remarks}
                </p>
                <button onClick={() => handleEditReport(report)}>Edit</button>
              </div>
            );
          })}
        </div>
      )}

      {editingReport && (
        <div className="edit-report">
          <h3>Edit Report</h3>
          <label>Reading</label>
          <input
            type="number"
            value={editingReport.marks.reading}
            onChange={(e) =>
              setEditingReport({
                ...editingReport,
                marks: { ...editingReport.marks, reading: Number(e.target.value) },
              })
            }
          />
          <label>Accent</label>
          <input
            type="number"
            value={editingReport.marks.accent}
            onChange={(e) =>
              setEditingReport({
                ...editingReport,
                marks: { ...editingReport.marks, accent: Number(e.target.value) },
              })
            }
          />
          <label>Tajweed</label>
          <input
            type="number"
            value={editingReport.marks.tajweed}
            onChange={(e) =>
              setEditingReport({
                ...editingReport,
                marks: { ...editingReport.marks, tajweed: Number(e.target.value) },
              })
            }
          />
          <label>Memorization</label>
          <input
            type="number"
            value={editingReport.marks.memorization}
            onChange={(e) =>
              setEditingReport({
                ...editingReport,
                marks: { ...editingReport.marks, memorization: Number(e.target.value) },
              })
            }
          />
          <button onClick={handleSaveReport}>Save Report</button>
        </div>
      )}
    </div>
  );
};

export default ViewEditReports;
