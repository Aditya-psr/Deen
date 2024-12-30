import React, { useState, useEffect } from 'react';
import './EditVoucherMarks.css';

const EditVoucherMarks = () => {
  const [categoryId, setCategoryId] = useState('');
  const [minMarks, setMinMarks] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const [voucherMarksList, setVoucherMarksList] = useState([]);

  // Fetch the voucher marks from the backend
  useEffect(() => {
    const fetchVoucherMarks = async () => {
      try {
        const response = await fetch('http://localhost:3001/voucher-marks');
        const data = await response.json();
        if (response.ok) {
          setVoucherMarksList(data); // Store the list of voucher marks
        } else {
          console.error('Error fetching voucher marks:', data.message);
        }
      } catch (error) {
        console.error('Error fetching voucher marks:', error);
      }
    };

    fetchVoucherMarks();
  }, []);

  // Handle form submission to update or create voucher marks
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      juzzId: categoryId,
      minimumMarks: minMarks,
      maximumMarks: maxMarks,
    };

    try {
      const response = await fetch('http://localhost:3001/voucher-marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setCategoryId(''); // Clear the form fields after submission
        setMinMarks('');
        setMaxMarks('');
        fetchVoucherMarks(); // Refresh the voucher marks list
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating voucher marks:', error);
    }
  };

  // Fetch the updated list of voucher marks after submitting the form
  const fetchVoucherMarks = async () => {
    try {
      const response = await fetch('http://localhost:3001/voucher-marks');
      const data = await response.json();
      if (response.ok) {
        setVoucherMarksList(data); // Update the list of voucher marks
      } else {
        console.error('Error fetching voucher marks:', data.message);
      }
    } catch (error) {
      console.error('Error fetching voucher marks:', error);
    }
  };

  return (
    <div className="edit-voucher-marks-form">
      <h3>Edit Voucher Marks</h3>
      <form onSubmit={handleSubmit}>
        <label>Category ID:</label>
        <input
          type="text"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />

        <label>Minimum Marks:</label>
        <input
          type="number"
          value={minMarks}
          onChange={(e) => setMinMarks(e.target.value)}
        />

        <label>Maximum Marks:</label>
        <input
          type="number"
          value={maxMarks}
          onChange={(e) => setMaxMarks(e.target.value)}
        />

        <button type="submit">Update Marks</button>
      </form>

      {/* Display the list of voucher marks */}
      <div className="voucher-marks-list">
        <h4>Existing Voucher Marks</h4>
        <ul>
          {voucherMarksList.map((voucher) => (
            <li key={voucher.juzzId}>
              Juzz ID: {voucher.juzzId} - Minimum Marks: {voucher.minimumMarks} - Maximum Marks: {voucher.maximumMarks}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditVoucherMarks;
