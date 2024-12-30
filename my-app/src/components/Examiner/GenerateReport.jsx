import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './GenerateReport.css';

const GenerateReport = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [remarks, setRemarks] = useState('');
  const [reportStatus, setReportStatus] = useState('');

  // Extract necessary values from location.state with fallback values
  const { marks = {}, student = {}, teacher = {}, total = 0, qualifyingMarks = 0, passed = false } = location.state || {};

  const handleRemarksChange = (e) => setRemarks(e.target.value);

  const handleSubmitReport = async () => {
    const reportData = {
      student: { 
        studentId: student.studentId,
        name: student.name 
      },
      teacher: { 
        teacherId: teacher.teacherId,
        name: teacher.name 
      },
      marks, 
      total, 
      qualifyingMarks, 
      passed, 
      remarks,
    };

    console.log('Sending report data:', reportData); // Log the report data for debugging

    try {
      const response = await fetch('http://localhost:3001/submit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        setReportStatus('Report submitted successfully!');
        setTimeout(() => navigate('/examiner/view-reports'), 2000);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setReportStatus('Error submitting report: ' + (errorData.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setReportStatus('Error submitting report. Please check your network and try again.');
    }
  };

  // Return JSX with conditional rendering based on studentId
  return (
    <div className="generate-report-container">
      <h2>Generate Report</h2>

      {!student.studentId ? (
        <div>Error: Missing report data. Please return to the previous page and try again.</div>
      ) : (
        <>
          <div className="marks-summary">
            <h3>Marks Summary for {student.name || 'Unknown Student'}</h3>
            <p>Reading: {marks.reading || 'N/A'}</p>
            <p>Accent: {marks.accent || 'N/A'}</p>
            <p>Tajweed: {marks.tajweed || 'N/A'}</p>
            <p>Memorization: {marks.memorization || 'N/A'}</p>
            <p>Total: {total || 'N/A'}</p>
            <p>Qualifying Marks: {qualifyingMarks || 'N/A'}</p>
            <p>Passed and Promoted to next para: {passed ? 'Yes' : 'No'}</p>
          </div>

          <div className="remarks-section">
            <label>Remarks:</label>
            <textarea value={remarks} onChange={handleRemarksChange} />
          </div>

          <button onClick={handleSubmitReport}>Submit Report</button>

          {reportStatus && <div className="report-status">{reportStatus}</div>}
        </>
      )}
    </div>
  );
};

export default GenerateReport;
