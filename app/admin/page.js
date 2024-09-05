"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { User, LockIcon } from "lucide-react";

const url = "http://localhost/attendance-api/auth.php";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const data = sessionStorage.getItem("admin");

    if (data) {
      window.location.href = "/admin/Home";
    }
  }, []);

  const validate = () => {
    let errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const login = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "adminLogin",
          json: JSON.stringify({
            email: email,
            password: password,
          }),
        },
      });

      if (res.status !== 200) {
        alert("Status error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        sessionStorage.setItem("admin", JSON.stringify(res.data.success));
        window.location.href = "/admin/Home";
      } else {
        alert(res.data.error);
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      login();
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="title">
          <span>Login Form</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <i className="fas fa-user">
              <User />
            </i>
            <input
              type="text"
              placeholder="Email or Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <div className="row">
            <i className="fas fa-lock">
              <LockIcon />
            </i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          <div className="pass">
            <a href="#">Forgot password?</a>
          </div>
          <div className="row button">
            <input type="submit" value="Login" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
