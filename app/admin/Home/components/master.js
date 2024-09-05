import React, { useState } from "react";
import axios from "axios";

const url = "http://localhost/attendance-api/main.php"; // Update with your API URL

export const MasterDataEntry = () => {
  const [newStudent, setNewStudent] = useState({
    name: "",
    student_number: "",
    contact_information: "",
    year_level: "",
  });

  const [newTribu, setNewTribu] = useState({
    name: "",
  });

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(url, null, {
        params: {
          operation: "createStudent",
          json: JSON.stringify(newStudent),
        },
      });

      if (res.data.success) {
        alert("Student added successfully");
        setNewStudent({
          ...newStudent,
          name: "",
          student_number: "",
          contact_information: "",
          year_level: "",
        });
      } else {
        alert("Failed to add student");
        console.log(res.data);
      }
    } catch (e) {
      alert("Error adding student: " + e.message);
    }
  };

  const handleAddTribu = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(url, null, {
        params: {
          operation: "createTribu",
          json: JSON.stringify(newTribu),
        },
      });

      if (res.data.success) {
        alert("Tribu added successfully");
        setNewTribu({ ...newTribu, name: "" });
      } else {
        alert("Failed to add tribu");
        console.log(res.data);
      }
    } catch (e) {
      alert("Error adding tribu: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Master Data Entry</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold mb-2">Student Information</h4>
          <form className="space-y-2" onSubmit={handleAddStudent}>
            <input
              className="w-full p-2 border rounded"
              placeholder="Student Name"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Student ID"
              value={newStudent.student_number}
              onChange={(e) =>
                setNewStudent({ ...newStudent, student_number: e.target.value })
              }
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Contact Information"
              value={newStudent.contact_information}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  contact_information: e.target.value,
                })
              }
            />
            <select
              className="w-full p-2 border rounded"
              value={newStudent.year_level}
              onChange={(e) =>
                setNewStudent({ ...newStudent, year_level: e.target.value })
              }
            >
              <option value="" disabled>
                Select Year Level
              </option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Add Student
            </button>
          </form>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold mb-2">Tribu Management</h4>
          <form className="space-y-2" onSubmit={handleAddTribu}>
            <input
              className="w-full p-2 border rounded"
              placeholder="Tribu Name"
              value={newTribu.name}
              onChange={(e) =>
                setNewTribu({ ...newTribu, name: e.target.value })
              }
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Add Tribu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
