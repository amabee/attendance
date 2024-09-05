"use client";
import { useEffect, useState } from "react";
import "../public/fonts/linearicons/style.css";
import "../public/css/style.css";
import axios from "axios";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [studID, setStudID] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [yearLevel, setYearLevel] = useState("");

  const url = "http://localhost/attendance-api/auth.php";

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      window.location.href = "/Home";
    }
  }, []);

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login();
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    await signup();
  };

  async function login() {
    const res = await axios.get(url, {
      params: {
        operation: "login",
        json: JSON.stringify({
          student_number: studID,
          contact_information: email,
        }),
      },
    });

    try {
      if (res.status !== 200) {
        alert("Status Error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        sessionStorage.setItem("user", JSON.stringify(res.data.success));
        window.location.href = "/Home";
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {}
  }

  async function signup() {
    const formData = new FormData();

    formData.append("operation", "signup");
    formData.append(
      "json",
      JSON.stringify({
        name: fullname,
        student_number: studID,
        contact_information: email,
        year_level: yearLevel,
      })
    );

    try {
      const res = await axios({
        url: url,
        method: "POST",
        data: formData,
      });

      if (res.status !== 200) {
        alert("Status Error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        alert(JSON.stringify(res.data.success));
        setIsRegister(false);
        setStudID("");
        setEmail("");
        setFullname("");
        setYearLevel("");
      } else {
        alert(JSON.stringify(res.data.error));
      }
    } catch (e) {
      alert(e);
    }
  }

  return (
    <div className="wrapper">
      <div className="inner">
        <img src="images/image-1.png" alt="" className="image-1" />
        <form
          action=""
          onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit}
        >
          <h3>{isRegister ? "Register" : "Login"}</h3>

          {isRegister ? (
            <>
              <div className="form-holder">
                <span className="lnr lnr-user"></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="form-holder">
                <span className="lnr lnr-user"></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Student ID"
                  value={studID}
                  onChange={(e) => setStudID(e.target.value)}
                />
              </div>
              <div className="form-holder">
                <span className="lnr lnr-envelope"></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-holder">
                <span className="lnr lnr-envelope"></span>
                <select
                  className="form-control"
                  value={yearLevel}
                  onChange={(e) => setYearLevel(e.target.value)}
                >
                  <option value="">Select Year Level</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="form-holder">
                <span className="lnr lnr-phone-handset"></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Student ID"
                  value={studID}
                  onChange={(e) => setStudID(e.target.value)}
                />
              </div>
              <div className="form-holder">
                <span className="lnr lnr-envelope"></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Student Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </>
          )}

          <button type="submit">
            <span>{isRegister ? "Register" : "Login"}</span>
          </button>
          <button type="button" onClick={toggleForm}>
            <span>{isRegister ? "Login" : "Register"}</span>
          </button>
        </form>
        <img src="images/image-2.png" alt="" className="image-2" />
      </div>
    </div>
  );
}
