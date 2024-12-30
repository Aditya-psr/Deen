import React, { useState, useEffect } from 'react';
import './AssignExaminer.css';

const AssignExaminer = () => {
  const [formData, setFormData] = useState({
    examinerId: '',
    examinerHeadId: ''
  });
  const [assignments, setAssignments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentAssignmentId, setCurrentAssignmentId] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:3001/examiner-assignments');
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching examiner assignments:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `http://localhost:3001/examiner-assignments/${currentAssignmentId}`
      : 'http://localhost:3001/examiner-assignments';
    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error in saving data');

      setFormData({
        examinerId: '',
        examinerHeadId: ''
      });

      setEditMode(false);
      setCurrentAssignmentId(null);
      fetchAssignments();
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  const handleEdit = (assignment) => {
    setFormData({
      examinerId: assignment.examinerId,
      examinerHeadId: assignment.examinerHeadId
    });
    setEditMode(true);
    setCurrentAssignmentId(assignment._id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/examiner-assignments/${id}`, {
        method: 'DELETE'
      });
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  return (
    <div className="assign-examiner-container">
      <h3>{editMode ? 'Edit Examiner Assignment' : 'Assign Examiner'}</h3>
      <form onSubmit={handleSubmit} className="examiner-form">
        <div className="form-group">
          <label>Examiner Name:</label>
          <input type="text" name="examinerId" value={formData.examinerId} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Examiner Head Name:</label>
          <input type="text" name="examinerHeadId" value={formData.examinerHeadId} onChange={handleInputChange} />
        </div>

        <button type="submit" className="submit-btn">{editMode ? 'Update Assignment' : 'Assign Examiner'}</button>
      </form>

      <h3>Assigned Examiners</h3>
      <table className="examiner-table">
        <thead>
          <tr>
            <th>Examiner Name</th>
            <th>Examiner Head Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment._id}>
              <td>{assignment.examinerId}</td>
              <td>{assignment.examinerHeadId}</td>
              <td>
                <button onClick={() => handleEdit(assignment)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(assignment._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignExaminer;
