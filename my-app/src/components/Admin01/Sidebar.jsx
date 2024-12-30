import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/admin01/homee">Home</Link></li>
        <li><Link to="/admin01/student">Student</Link></li>
        <li><Link to="/admin01/assign-examiner">Assign Examiner</Link></li>
        <li><Link to="/admin01/add-edit-teacher">Add/Edit Teacher</Link></li>
        <li><Link to="/admin01/view-edit-reports">View/Edit Reports</Link></li>
        <li><Link to="/admin01/edit-qualifying-marks">Edit Qualifying Marks</Link></li>
        <li><Link to="/admin01/edit-voucher-marks">Edit Voucher Marks</Link></li>
        <li><Link to="/admin01/generate-reports">Generate Reports</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
