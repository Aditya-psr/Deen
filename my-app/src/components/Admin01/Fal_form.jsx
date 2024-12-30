import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Fal-form.css";
import WE from "../Admin01/v915.jpg";

const Fal_form = () => {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmitup = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/login", { userid, password })
      .then((result) => {
        if (result.data === "Success") {
          // Store the user ID in localStorage
          localStorage.setItem("userId", userid);
          // Show alert on successful sign-in
          alert("Sign-in successful!");
          // Redirect to the admin panel
          navigate("/admin01/homee");
        } else {
          alert("Sign-in failed. Please check your credentials.");
        }
      })
      .catch((err) => {
        alert("Sign-in failed. Please try again later.");
        console.log(err);
      });
  };

  return (
    <>
      <img className="we" src={WE} alt="" />
      <div className="kuch" style={{ marginTop: 250 }}>
        <form action="" onSubmit={handleSubmitup} className="sign-in-form">
          <h2 className="title">Sign In</h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              className="te"
              type="text"
              required
              placeholder="User-Id"
              name="userid"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-lock"></i>
            <input
              className="te"
              type="password"
              required
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <input type="submit" value="Login" className="btn solid" />
        </form>
      </div>
    </>
  );
};

export default Fal_form;
