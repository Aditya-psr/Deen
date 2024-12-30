const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ---- MongoDB Connections ----

// Main database for student, report, teacher data
mongoose.connect('mongodb://localhost:27017/examiner_reports', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Main MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Separate database for Qualifying Marks
const qualifyingMarksDB = mongoose.createConnection('mongodb://localhost:27017/qualifying_marks_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Separate database for Voucher Marks
const voucherMarksDB = mongoose.createConnection('mongodb://localhost:27017/voucher_marks_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

qualifyingMarksDB.on('connected', () => {
  console.log("Connected to Qualifying Marks Database");
});

voucherMarksDB.on('connected', () => {
  console.log("Connected to Voucher Marks Database");
});


// ---- Examiner Assignment Schema ----
const examinerAssignmentSchema = new mongoose.Schema({
  testId: String,
  studentId: String,
  examinerId: String,
  examinerHeadId: String
});

const ExaminerAssignment = mongoose.model('ExaminerAssignment', examinerAssignmentSchema);

// ---- Examiner Assignment Routes ----

// Create a new assignment
app.post('/examiner-assignments', async (req, res) => {
  try {
    const { testId, studentId, examinerId, examinerHeadId } = req.body;

    const newAssignment = new ExaminerAssignment({ testId, studentId, examinerId, examinerHeadId });
    await newAssignment.save();
    res.status(201).json({ message: 'Examiner assigned successfully' });
  } catch (error) {
    console.error('Error assigning examiner:', error);
    res.status(500).json({ message: 'Error assigning examiner' });
  }
});

// Get all assignments
app.get('/examiner-assignments', async (req, res) => {
  try {
    const assignments = await ExaminerAssignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching examiner assignments:', error);
    res.status(500).json({ message: 'Error fetching examiner assignments' });
  }
});

// Update an assignment
app.put('/examiner-assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { testId, studentId, examinerId, examinerHeadId } = req.body;

    await ExaminerAssignment.findByIdAndUpdate(id, { testId, studentId, examinerId, examinerHeadId }, { new: true });
    res.status(200).json({ message: 'Assignment updated successfully' });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Error updating assignment' });
  }
});

// Delete an assignment
app.delete('/examiner-assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ExaminerAssignment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ message: 'Error deleting assignment' });
  }
});

// ---- Student Schema and Routes ----

const studentSchema = new mongoose.Schema({
  fullName: String,
  city: String,
  teacher: String, // Should store the teacher's ID
  studentId: { type: Number, unique: true }, // The student ID will now be a unique number
});


const Student = mongoose.model('Student', studentSchema);


// Route to register a new student
app.post('/register-student', async (req, res) => {
  try {
    const { fullName, city, teacher } = req.body; // Remove studentId from req.body
    
    // Get the last registered student to determine the next studentId
    const lastStudent = await Student.findOne().sort({ studentId: -1 }).exec();
    
    let newStudentId = 40; // Start from 40 if no students exist
    if (lastStudent) {
      newStudentId = parseInt(lastStudent.studentId) + 1; // Increment the last studentId
    }

    const newStudent = new Student({
      fullName,
      city,
      teacher, // This should be the teacher's ObjectId from the frontend form
      studentId: newStudentId.toString() // Automatically set the new studentId
    });

    await newStudent.save();
    res.status(200).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ message: "Error registering student" });
  }
});



// Route to get all registered students
app.get('/students', async (req, res) => {
  const { teacher } = req.query; // Optional filter by teacher

  try {
    let query = {};
    if (teacher) {
      query = { teacher }; // Filter students by teacher if provided
    }
    
    const students = await Student.find(query).populate('teacher'); // Populate teacher details
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching students" });
  }
});



// Route to update a student
app.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, city, teacher, studentId } = req.body;

    await Student.findByIdAndUpdate(id, { fullName, city, teacher, studentId }, { new: true });
    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Error updating student" });
  }
});

// Route to delete a student
app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Error deleting student" });
  }
});

// ---- Report Schema and Routes ----

const reportSchema = new mongoose.Schema({
  student: {
    studentId: String,
    fullName: String,
  },
  teacher: {
    teacherId: String,
    fullName: String,
  },
  marks: {
    reading: Number,
    accent: Number,
    tajweed: Number,
    memorization: Number,
  },
  total: Number,
  qualifyingMarks: Number,
  passed: Boolean,
  remarks: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model('Report', reportSchema);

// Route to submit a report
app.post('/submit-report', async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body for debugging

    const { student, teacher, marks, qualifyingMarks, passed, remarks } = req.body;

    // Validate that the student, teacher, and marks objects exist and contain necessary fields
    if (!student || !student.studentId) {
      return res.status(400).json({ message: 'Missing student or studentId' });
    }
    if (!teacher || !teacher.teacherId) {
      return res.status(400).json({ message: 'Missing teacher or teacherId' });
    }
    if (!marks || typeof marks.reading === 'undefined' || typeof marks.accent === 'undefined' || typeof marks.tajweed === 'undefined' || typeof marks.memorization === 'undefined') {
      return res.status(400).json({ message: 'Missing or incomplete marks' });
    }

    const total = marks.reading + marks.accent + marks.tajweed + marks.memorization;

    const newReport = new Report({
      student: {
        studentId: student.studentId,
        fullName: student.name,
      },
      teacher: {
        teacherId: teacher.teacherId,
        fullName: teacher.name,
      },
      marks,
      total,
      qualifyingMarks,
      passed,
      remarks,
    });

    await newReport.save();
    res.status(200).json({ message: "Report submitted successfully" });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ message: "Error submitting report" });
  }
});


// Route to get reports by studentId
app.get('/reports', async (req, res) => {
  const { studentId } = req.query;
  try {
    const reports = await Report.find({ 'student.studentId': studentId });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
});

// Route to update a report
app.put('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extract report ID from the request params
    const {
      student,
      teacher,
      marks,
      qualifyingMarks,
      passed,
      remarks,
    } = req.body; // Extract updated report data from the body

    const total = marks.reading + marks.accent + marks.tajweed + marks.memorization;

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      {
        student: {
          studentId: student.studentId,
          fullName: student.fullName,
        },
        teacher: {
          teacherId: teacher.teacherId,
          fullName: teacher.fullName,
        },
        marks,
        total,
        qualifyingMarks,
        passed,
        remarks,
      },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report updated successfully", report: updatedReport });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "Error updating report" });
  }
});


// ---- Teacher Schema and Routes ----

const teacherSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  mobile: String,
  email: String,
  city: String,
});

const Teacher = mongoose.model('Teacher', teacherSchema);

// Route to add a new teacher
app.post('/teachers', async (req, res) => {
  try {
    const { firstName, lastName, gender, mobile, email, city } = req.body;
    const newTeacher = new Teacher({ firstName, lastName, gender, mobile, email, city });

    await newTeacher.save();
    res.status(201).json({ message: 'Teacher added successfully' });
  } catch (error) {
    console.error('Error adding teacher:', error);
    res.status(500).json({ message: 'Error adding teacher' });
  }
});

// Route to get all teachers
app.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Error fetching teachers' });
  }
});

// Route to update a teacher
app.put('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, gender, mobile, email, city } = req.body;

    await Teacher.findByIdAndUpdate(id, { firstName, lastName, gender, mobile, email, city }, { new: true });
    res.status(200).json({ message: 'Teacher updated successfully' });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Error updating teacher' });
  }
});

// Route to delete a teacher
app.delete('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Teacher.findByIdAndDelete(id);
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Error deleting teacher' });
  }
});


// ---- Qualifying Marks Schema and Routes ----

const qualifyingMarksSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  minimumMarks: { type: Number, required: true },
});

const QualifyingMarks = qualifyingMarksDB.model('QualifyingMarks', qualifyingMarksSchema);

// Route to create or update Qualifying Marks
app.post('/qualifying-marks', async (req, res) => {
  const { subject, minimumMarks } = req.body;

  try {
    const existingMarks = await QualifyingMarks.findOne({ subject });
    if (existingMarks) {
      existingMarks.minimumMarks = minimumMarks;
      await existingMarks.save();
      return res.status(200).json({ message: "Qualifying Marks updated successfully" });
    } else {
      const newQualifyingMarks = new QualifyingMarks({ subject, minimumMarks });
      await newQualifyingMarks.save();
      return res.status(201).json({ message: "Qualifying Marks created successfully" });
    }
  } catch (error) {
    console.error('Error saving Qualifying Marks:', error);
    res.status(500).json({ message: "Error saving Qualifying Marks" });
  }
});

// Route to get all Qualifying Marks
app.get('/qualifying-marks', async (req, res) => {
  try {
    const qualifyingMarks = await QualifyingMarks.find();
    res.status(200).json(qualifyingMarks);
  } catch (error) {
    console.error("Error fetching Qualifying Marks:", error);
    res.status(500).json({ message: "Error fetching Qualifying Marks" });
  }
});

// ---- Voucher Marks Schema and Routes ----

const voucherMarksSchema = new mongoose.Schema({
  juzzId: { type: String, unique: true, required: true }, // Juzz or Category ID
  minimumMarks: { type: Number, required: true },
  maximumMarks: { type: Number, required: true },
});

const VoucherMarks = voucherMarksDB.model('VoucherMarks', voucherMarksSchema);

// Route to create or update Voucher Marks
app.post('/voucher-marks', async (req, res) => {
  const { juzzId, minimumMarks, maximumMarks } = req.body;

  try {
    const existingVoucher = await VoucherMarks.findOne({ juzzId });
    if (existingVoucher) {
      existingVoucher.minimumMarks = minimumMarks;
      existingVoucher.maximumMarks = maximumMarks;
      await existingVoucher.save();
      return res.status(200).json({ message: "Voucher Marks updated successfully" });
    } else {
      const newVoucherMarks = new VoucherMarks({ juzzId, minimumMarks, maximumMarks });
      await newVoucherMarks.save();
      return res.status(201).json({ message: "Voucher Marks created successfully" });
    }
  } catch (error) {
    console.error('Error saving Voucher Marks:', error);
    res.status(500).json({ message: "Error saving Voucher Marks" });
  }
});

// Route to get all Voucher Marks
app.get('/voucher-marks', async (req, res) => {
  try {
    const voucherMarks = await VoucherMarks.find();
    res.status(200).json(voucherMarks);
  } catch (error) {
    console.error("Error fetching Voucher Marks:", error);
    res.status(500).json({ message: "Error fetching Voucher Marks" });
  }
});

// ---- Authentication Routes ----

const users = [
  { userid: 'admin', password: 'pass', role: 'admin' },
  { userid: 'examiner', password: '1234', role: 'examiner' },
];

// Admin login route
app.post('/login', (req, res) => {
  const { userid, password } = req.body;
  const user = users.find(user => user.userid === userid && user.password === password && user.role === 'admin');

  if (user) {
    res.json("Success");
  } else {
    res.json("Failure");
  }
});

// Examiner login route
app.post('/examiner-login', (req, res) => {
  const { userid, password } = req.body;
  const examiner = users.find(user => user.userid === userid && user.password === password && user.role === 'examiner');

  if (examiner) {
    res.json({ message: "Success", redirectUrl: "/mark-entry" });
  } else {
    res.status(401).json({ message: "Failure" });
  }
});

// ---- Start the Server ----
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
