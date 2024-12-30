import React, { useState, useEffect } from 'react';
import './Student.css';

const Student = () => {
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    fullName: '',
    city: '',
    teacher: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3001/students');
      let data = await response.json();
      data = data.map(student => {
        const teacher = teachers.find(t => t._id === student.teacher);
        return {
          ...student,
          teacher,
        };
      });
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:3001/teachers');
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      // Update student
      try {
        await fetch(`http://localhost:3001/students/${editIndex}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        setEditIndex(null);
        fetchStudents();
      } catch (error) {
        console.error('Error updating student:', error);
      }
    } else {
      // Register new student
      try {
        await fetch('http://localhost:3001/register-student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        fetchStudents();
      } catch (error) {
        console.error('Error registering student:', error);
      }
    }
    setForm({
      fullName: '',
      city: '',
      teacher: teachers[0]?._id || '',
    });
    setShowForm(false);
  };

  const handleEdit = (studentId) => {
    const studentToEdit = students.find(student => student._id === studentId);
    setForm(studentToEdit);
    setEditIndex(studentId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/students/${id}`, {
        method: 'DELETE',
      });
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div className="student-container">
      <button className="toggle-button" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Student'}
      </button>
      {showForm && (
        <form className="student-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={form.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="teacher">Teacher:</label>
            <select
              id="teacher"
              name="teacher"
              value={form.teacher}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">{editIndex ? 'Update Student' : 'Add Student'}</button>
        </form>
      )}
      <h2>Registered Students</h2>
      <table className="student-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>City</th>
            <th>Teacher</th>
            <th>Student ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.fullName}</td>
              <td>{student.city}</td>
              <td>{student.teacher?.firstName} {student.teacher?.lastName}</td>
              <td>{student.studentId}</td>
              <td>
                <button onClick={() => handleEdit(student._id)}>Edit</button>
                <button onClick={() => handleDelete(student._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Student;
