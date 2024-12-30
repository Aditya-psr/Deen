import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./ExaminerSignup.css";
import { Button, TextField } from "@mui/material";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/setup";


function ExaminerSignup() {
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtp = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
      console.log(confirmation);
    } catch (err) {
      console.log(err);
    }
  };


  const verifyOtp = async()=>{
    try{
      const data = await user.confirm(otp)
      console.log(data)
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="phone-signin">
      <div className="phone-content">
        <PhoneInput
          country={"in"}
          value={phone}
          onChange={(phone) => setPhone("+" + phone)}
        />
        <Button
          onClick={sendOtp}
          sx={{ marginTop: "10px" }}
          variant="contained"
        >
          Send Otp
        </Button>
        <div style={{ marginTop: "10px" }} id="recaptcha"></div>
        <br />
        <TextField
        onChange={(e)=> setOtp(e.target.value)}
          sx={{ marginTop: "10px", width: "300px" }}
          variant="outlined"
          size="small"
          label="Enter Otp"
        />
        <br />
        <Button onClick={verifyOtp} sx={{ marginTop: "10px" }} variant="contained" color="success">
          Verify Otp
        </Button>
      </div>
    </div>
  );
}

export default ExaminerSignup;
