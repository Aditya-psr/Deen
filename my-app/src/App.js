import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from './components/Home';
import Homee from './components/Admin01/Homee';
import Fal_form from "./components/Admin01/Fal_form";
import AssignExaminer from './components/Admin01/AssignExaminer';
import AddEditTeacher from './components/Admin01/AddEditTeacher';
import ViewEditReports from './components/Admin01/ViewEditReports';
import EditQualifyingMarks from './components/Admin01/EditQualifyingMarks';
import EditVoucherMarks from './components/Admin01/EditVoucherMarks';
import GenerateReports from './components/Admin01/GenerateReports';
import MarkEntryForm from './components/Examiner/MarkEntryForm';
import GenerateReport from './components/Examiner/GenerateReport';
import Sidebar from './components/Admin01/Sidebar';
import Sidebar2 from './components/Examiner/Sidebar2';
import ExaminerSignup from './components/Examiner/ExaminerSignup';
import Student from './components/Admin01/Student'; // Fixed import

const Layout = ({ children }) => {
  const location = useLocation();

  const adminPaths = [
    '/admin01/homee',
    '/admin01/student', // Added student route back
    '/admin01/assign-examiner',
    '/admin01/add-edit-teacher',
    '/admin01/view-edit-reports',
    '/admin01/edit-qualifying-marks',
    '/admin01/edit-voucher-marks',
    '/admin01/generate-reports'
  ];

  const examinerPaths = [
    '/examiner/mark-entry',
    '/examiner/generate-report'
  ];

  const showAdminSidebar = adminPaths.includes(location.pathname);
  const showExaminerSidebar = examinerPaths.includes(location.pathname);

  return (
    <div style={{ display: 'flex' }}>
      {showAdminSidebar && <Sidebar />}
      {showExaminerSidebar && <Sidebar2 />}
      <div style={{ marginLeft: (showAdminSidebar || showExaminerSidebar) ? '200px' : '0', padding: '20px', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin01/*" element={
          <Layout>
            <Routes>
              <Route path="homee" element={<Homee />} />
              <Route path="student" element={<Student />} /> {/* Fixed student route */}
              <Route path="assign-examiner" element={<AssignExaminer />} />
              <Route path="add-edit-teacher" element={<AddEditTeacher />} />
              <Route path="view-edit-reports" element={<ViewEditReports />} />
              <Route path="edit-qualifying-marks" element={<EditQualifyingMarks />} />
              <Route path="edit-voucher-marks" element={<EditVoucherMarks />} />
              <Route path="generate-reports" element={<GenerateReports />} />
              <Route path="fal_form" element={<Fal_form />} />
            </Routes>
          </Layout>
        } />
        <Route path="/examiner/*" element={
          <Layout>
            <Routes>
              <Route path="mark-entry" element={<MarkEntryForm />} />
              <Route path="generate-report" element={<GenerateReport />} />
              <Route path="signup" element={<ExaminerSignup />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
