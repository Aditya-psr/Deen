import React, { useState, useEffect } from 'react';
import './AddEditTeacher.css';

const AddEditTeacher = () => {
  // State for form data and teacher list
  const [teacher, setTeacher] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    mobile: '',
    email: '',
    city: ''
  });

  const [teacherList, setTeacherList] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null); // To store the ID of the teacher being edited

  // Fetch the teacher list from the database
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:3001/teachers');
      const data = await response.json();
      setTeacherList(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher({
      ...teacher,
      [name]: value,
    });
  };

  // Add or Edit teacher to the list
  const handleAddTeacher = async () => {
    // Ensure every value is treated as a string to avoid calling trim on non-strings
    if (Object.values(teacher).some(value => String(value).trim() === '')) {
      alert("Please fill out all fields.");
      return;
    }

    if (editIndex !== null) {
      // Update the teacher in the database
      try {
        const response = await fetch(`http://localhost:3001/teachers/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(teacher)
        });

        if (response.ok) {
          const updatedList = teacherList.map((t, index) =>
            index === editIndex ? teacher : t
          );
          setTeacherList(updatedList);
          setEditIndex(null);
          setEditId(null); // Reset editId after update
        } else {
          console.error('Failed to update teacher');
        }
      } catch (error) {
        console.error('Error updating teacher:', error);
      }
    } else {
      // Adding a new teacher to the database
      try {
        const response = await fetch('http://localhost:3001/teachers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(teacher),
        });

        if (response.ok) {
          const newTeacher = await response.json();
          setTeacherList([...teacherList, newTeacher]);
        } else {
          console.error('Failed to add teacher');
        }
      } catch (error) {
        console.error('Error adding teacher:', error);
      }
    }

    // Reset the form and close it
    setTeacher({
      firstName: '',
      lastName: '',
      gender: '',
      mobile: '',
      email: '',
      city: ''
    });
    setIsFormVisible(false);
  };

  // Edit a teacher
  const handleEditTeacher = (index) => {
    const selectedTeacher = teacherList[index];
    setTeacher(selectedTeacher);
    setIsFormVisible(true);
    setEditIndex(index);
    setEditId(selectedTeacher._id); // Store the teacher ID for updating in the database
  };

  // Delete a teacher
  const handleDeleteTeacher = async (index) => {
    const teacherId = teacherList[index]._id;
    try {
      const response = await fetch(`http://localhost:3001/teachers/${teacherId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedList = teacherList.filter((_, i) => i !== index);
        setTeacherList(updatedList);
      } else {
        console.error('Failed to delete teacher');
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  return (
    <div className="add-edit-teacher-form">
      <h3>Manage Teachers</h3>

      {/* Add Teacher Button */}
      {!isFormVisible && (
        <button onClick={() => setIsFormVisible(true)}>Add Teacher</button>
      )}

      {/* Form to add/edit teacher */}
      {isFormVisible && (
        <div className="teacher-form">
          <input
            type="text"
            name="firstName"
            value={teacher.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            value={teacher.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />

          {/* Gender Radio Buttons */}
          <div className="gender-selection">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={teacher.gender === 'Male'}
                onChange={handleChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={teacher.gender === 'Female'}
                onChange={handleChange}
              />
              Female
            </label>
          </div>

          <input
            type="number"
            name="mobile"
            value={teacher.mobile}
            onChange={handleChange}
            placeholder="Mobile"
          />
          <input
            type="email"
            name="email"
            value={teacher.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="city"
            value={teacher.city}
            onChange={handleChange}
            placeholder="City"
          />
          <button onClick={handleAddTeacher}>
            {editIndex !== null ? "Update Teacher" : "Submit"}
          </button>
        </div>
      )}

      {/* Display teacher data in a table */}
      {teacherList.length > 0 && (
        <table className="teacher-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teacherList.map((teacher, index) => (
              <tr key={teacher._id}>
                <td>{teacher.firstName}</td>
                <td>{teacher.lastName}</td>
                <td>{teacher.gender}</td>
                <td>{teacher.mobile}</td>
                <td>{teacher.email}</td>
                <td>{teacher.city}</td>
                <td>
                  <button onClick={() => handleEditTeacher(index)}>Edit</button>
                  <button onClick={() => handleDeleteTeacher(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AddEditTeacher;
