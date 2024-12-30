import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar2.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Examiner Panel</h2>
      <ul>
        <li>
          <Link to="/examiner/mark-entry">Mark Entry</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
