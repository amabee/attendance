import React, { useEffect, useState } from "react";
import axios from "axios";

const url = "http://localhost/attendance-api/main.php";

export const AttendanceMonitoring = () => {
  const url = "http://localhost/attendance-api/main.php";
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [students, setStudents] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const fetchEvents = async () => {
    try {
      const res = await axios.get(url, {
        params: { operation: "getEvents", json: "" },
      });

      if (res.data.success) {
        setEvents(res.data.success);
      } else {
        setEvents([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  const fetchStudents = async () => {
    console.log(selectedEvent);
    try {
      const res = await axios.get(url, {
        params: {
          operation: "getAttendanceByEvent",
          json: JSON.stringify({
            event_id: selectedEvent,
          }),
        },
      });

      if (res.data.success) {
        setStudents(res.data.success);
        console.log(res.data.success);
      } else {
        console.log(res.data);

        setStudents([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchStudents();
    }
  }, [selectedEvent]);

  const sortedStudents = React.useMemo(() => {
    const sorted = [...students];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [students, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <label
          htmlFor="event-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Event
        </label>
        <select
          id="event-select"
          value={selectedEvent}
          onChange={handleEventChange}
          className="block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
        >
          <option value="">Select an event</option>
          {events.map((event) => (
            <option key={event.event_id} value={event.event_id}>
              {event.event_name}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              onClick={() => requestSort("id")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Student ID
            </th>
            <th
              onClick={() => requestSort("name")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Student Name
            </th>
            <th
              onClick={() => requestSort("tribu")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Tribu
            </th>
            <th
              onClick={() => requestSort("check_in_time")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Check-In Time
            </th>
            <th
              onClick={() => requestSort("check_out_time")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Check-Out Time
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.length > 0 ? (
            sortedStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.student_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.tribu_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.check_in_time
                    ? student.check_in_time
                    : "Not Available"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.check_out_time
                    ? student.check_out_time
                    : "Not Available"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="px-6 py-4 whitespace-nowrap text-center"
              >
                No students found for this event
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
