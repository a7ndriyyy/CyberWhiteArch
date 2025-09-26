import React, { useState } from "react";
import "../Login/Login.css";
import logo from "../../assets/bunnylogo.png"; // Adjust the path as necessary
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

   const [responseMsg, setResponseMsg] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {

 if (!username.trim()) {
      setResponseMsg("Please enter your username.");
      return;
    }

    if (!password.trim()) {
      setResponseMsg("Please enter your password.");
      return;
    }

 try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        setResponseMsg("🟢 Login successful. Welcome to CyberCore.");
        setTimeout(() => {
           navigate("/app/welcome");
        }, 1000); // невелика затримка для стилю
      } else {
        setResponseMsg(`${data.msg}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setResponseMsg("Connection error. Try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="logo-left">
        <img src={logo} alt="Logo" className="login-logo cyber-logo" />
        <h2>OI OI</h2>
        <p>Please enter your login data</p>
      </div>

      <div className="login-right">
        <input
          required
          type="text"
          placeholder="Username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          required
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="access-button-container">
          <button className="access-button" onClick={handleLogin}>
            Access
          </button>
        </div>

         {responseMsg && (
          <div style={{
            color: '#00ff00',
            backgroundColor: '#000',
            padding: '10px',
            borderRadius: '5px',
            fontFamily: 'monospace',
            marginTop: '15px'
          }}>
            {responseMsg}
          </div>
        )}

        <div className="login-links">
          <div className="login-link-block">
            <div className="arrow-icon">↗</div>
            <Link to="/register">Don't have an account?</Link>
          </div>
          <div className="login-link-block">
            <div className="arrow-icon">↗</div>
            <a href="#">Can't sign in?</a>
          </div>
        </div>
      </div>
    </div>
  );
}