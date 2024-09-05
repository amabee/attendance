import React, { useEffect, useState } from "react";
import axios from "axios";

const url = "http://localhost/attendance-api/main.php";

export const TribuAssignment = () => {
  const [studentsWithoutTribu, setStudentsWithOutTribu] = useState([]);
  const [tribus, setTribus] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedTribu, setSelectedTribu] = useState("");

  useEffect(() => {
    getStudentsWithOutTribu();
    getTribus();
  }, []);

  const getStudentsWithOutTribu = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "getStudentsWithoutTribu",
          json: "",
        },
      });

      if (res.status !== 200) {
        alert("Status error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        setStudentsWithOutTribu(res.data.success);
      } else {
        setStudentsWithOutTribu([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  const getTribus = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "getTribus",
          json: "",
        },
      });

      if (res.status !== 200) {
        alert("Status Error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        setTribus(res.data.success);
      } else {
        setTribus([]);
        alert("No Tribu found");
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    const params = {
      operation: "assignStudentToTribu",
      json: JSON.stringify({
        student_ids: [selectedStudent],
        tribu_id: selectedTribu,
      }),
    };

    console.log("Params:", params);
    try {
      const res = await axios.post(url, null, { params });

      if (res.data.success) {
        alert("Student assigned to Tribu successfully");
        setSelectedStudent("");
        setSelectedTribu("");
      } else {
        alert("Failed to assign student to Tribu");
        console.log(res.data);
      }
    } catch (e) {
      alert("Error assigning student to Tribu: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Tribu Assignment</h3>
      <div className="bg-white p-4 rounded-lg shadow">
        <form className="space-y-2" onSubmit={handleAssign}>
          <select
            className="w-full p-2 border rounded"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select Student</option>
            {studentsWithoutTribu.map((student) => (
              <option key={student.student_id} value={student.student_id}>
                {student.name}
              </option>
            ))}
          </select>
          <select
            className="w-full p-2 border rounded"
            value={selectedTribu}
            onChange={(e) => setSelectedTribu(e.target.value)}
          >
            <option value="">Select Tribu</option>
            {tribus.map((tribu) => (
              <option key={tribu.tribu_id} value={tribu.tribu_id}>
                {tribu.tribu_name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Assign to Tribu
          </button>
        </form>
      </div>
    </div>
  );
};
