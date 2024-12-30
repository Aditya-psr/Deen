import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/admin01/fal_form");
  };
  const navigateToSignUp = () => {
    navigate("/examiner/signup");
  };

  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05, boxShadow: "0 0 30px rgba(0, 0, 0, 0.3)" },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  return (
    <div className="home-container">
      <div className="background-image"></div>
      <motion.div
        className="containerr"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="card faculty"
          onClick={navigateToLogin}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <div className="card-inner">
            <div className="card-front">
              <img src="/image/img9.jpg" alt="Admin" />
              <h2 className="text">Admin</h2>
            </div>
            <div className="card-back">
              <p>Sign in to access Admin panel</p>
              <button>Sign In</button>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="card management"
          onClick={navigateToSignUp}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <div className="card-inner">
            <div className="card-front">
              <img src="/image/img6.png" alt="Examiner" />
              <h2 className="text">Examiner</h2>
            </div>
            <div className="card-back">
              <p>Sign in to access management resources.</p>
              <button>Sign In</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
