import React, { useState } from 'react';
import './GenerateReports.css';

const GenerateReports = () => {
  const [criteria, setCriteria] = useState('');

  const handleGenerateReports = () => {
    // Logic to generate reports based on the criteria
    console.log('Generating reports based on criteria:', criteria);
  };

  return (
    <div className="generate-reports-form">
      <h3>Generate Reports</h3>
      <label>Criteria:</label>
      <input
        type="text"
        value={criteria}
        onChange={(e) => setCriteria(e.target.value)}
        placeholder="Enter criteria for report generation"
      />
      <button onClick={handleGenerateReports}>Generate Reports</button>
    </div>
  );
};

export default GenerateReports;
