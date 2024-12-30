import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignExaminer = () => {
    const [tests, setTests] = useState([]);
    const [students, setStudents] = useState([]);
    const [examiners, setExaminers] = useState([]);
    const [examinerHeads, setExaminerHeads] = useState([]);

    const [selectedTest, setSelectedTest] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedExaminer, setSelectedExaminer] = useState('');
    const [selectedExaminerHead, setSelectedExaminerHead] = useState('');

    useEffect(() => {
        // Fetch data for tests, students, examiners, and examiner heads
        const fetchData = async () => {
            try {
                const testsResponse = await axios.get('http://localhost:5000/api/tests');
                const studentsResponse = await axios.get('http://localhost:5000/api/students');
                const examinersResponse = await axios.get('http://localhost:5000/api/examiners');
                const examinerHeadsResponse = await axios.get('http://localhost:5000/api/examiner-heads');

                setTests(testsResponse.data);
                setStudents(studentsResponse.data);
                setExaminers(examinersResponse.data);
                setExaminerHeads(examinerHeadsResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:5000/api/assignments', {
                testId: selectedTest,
                studentId: selectedStudent,
                examinerId: selectedExaminer,
                examinerHeadId: selectedExaminerHead,
            });
            alert('Assignment successfully updated!');
            // Clear the form or reload the data as needed
        } catch (error) {
            console.error('Error assigning examiner', error);
            alert('Failed to assign examiner.');
        }
    };

    return (
        <div>
            <h2>Assign Examiner & Examiner Head</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="test">Select Test:</label>
                    <select
                        id="test"
                        value={selectedTest}
                        onChange={(e) => setSelectedTest(e.target.value)}
                        required
                    >
                        <option value="">Select Test</option>
                        {tests.map((test) => (
                            <option key={test._id} value={test._id}>
                                {test.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="student">Select Student:</label>
                    <select
                        id="student"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        required
                    >
                        <option value="">Select Student</option>
                        {students.map((student) => (
                            <option key={student._id} value={student._id}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="examiner">Select Examiner:</label>
                    <select
                        id="examiner"
                        value={selectedExaminer}
                        onChange={(e) => setSelectedExaminer(e.target.value)}
                        required
                    >
                        <option value="">Select Examiner</option>
                        {examiners.map((examiner) => (
                            <option key={examiner._id} value={examiner._id}>
                                {examiner.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="examinerHead">Select Examiner Head:</label>
                    <select
                        id="examinerHead"
                        value={selectedExaminerHead}
                        onChange={(e) => setSelectedExaminerHead(e.target.value)}
                        required
                    >
                        <option value="">Select Examiner Head</option>
                        {examinerHeads.map((head) => (
                            <option key={head._id} value={head._id}>
                                {head.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit">Assign</button>
            </form>
        </div>
    );
};

export default AssignExaminer;
