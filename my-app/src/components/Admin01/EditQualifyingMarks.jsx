import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditQualifyingMarks.css';

const EditQualifyingMarks = () => {
  const [juzzId, setJuzzId] = useState('');
  const [minimumMarks, setMinimumMarks] = useState('');
  const [juzzList, setJuzzList] = useState([]);

  useEffect(() => {
    // Fetch existing Qualifying Marks data on load
    const fetchJuzzData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/qualifying-marks'); // Updated route
        setJuzzList(response.data); // Store the fetched Qualifying Marks list
      } catch (error) {
        console.error("Error fetching Qualifying Marks:", error);
      }
    };

    fetchJuzzData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/qualifying-marks', { subject: juzzId, minimumMarks }); // Updated route and payload
      alert("Qualifying marks updated successfully");
    } catch (error) {
      console.error("Error updating qualifying marks:", error);
      alert("Failed to update qualifying marks");
    }
  };

  return (
    <div className="edit-qualifying-marks-form">
      <h3>Edit Qualifying Marks</h3>
      <form onSubmit={handleSubmit}>
        <label>Juzz Number:</label>
        <input
          type="text"
          value={juzzId}
          onChange={(e) => setJuzzId(e.target.value)}
          required
        />

        <label>Minimum Marks:</label>
        <input
          type="number"
          value={minimumMarks}
          onChange={(e) => setMinimumMarks(e.target.value)}
          required
        />

        <button type="submit">Update Qualifying Marks</button>
      </form>

      <div className="juzz-list">
        <h4>Existing Juzz Entries</h4>
        <ul>
          {juzzList.map(juzz => (
            <li key={juzz.subject}>Juzz {juzz.subject} - Minimum Marks: {juzz.minimumMarks}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditQualifyingMarks;
