import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const url = "http://localhost/attendance-api/main.php"; // Adjust this URL as needed

const SortableTable = ({ data, columns, onSort }) => {
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (column) => {
    const newOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newOrder);
    onSort(column, newOrder);
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              onClick={() => handleSort(column.key)}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              {column.label}
              {sortColumn === column.key && (
                <span className="ml-2">{sortOrder === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-auto flex-grow">{children}</div>
      </div>
    </div>
  );
};

export const Reports = () => {
  const [openModal, setOpenModal] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [tribus, setTribus] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedTribu, setSelectedTribu] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    getTribus();
    getEvents();
  }, []);

  const getTribus = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "getTribus",
          json: JSON.stringify({}),
        },
      });

      if (res.status !== 200) {
        console.error("Status Error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        setTribus(res.data.success);
        console.log("TRIBUS DATA: ", res.data.success);
      } else {
        setTribus([]);
        console.error("No Tribu found");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getEvents = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "getEvents",
          json: JSON.stringify({}),
        },
      });

      if (res.status !== 200) {
        console.error("Status Error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        setEvents(res.data.success);
      } else {
        setEvents([]);
        console.error("No events found");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReportData = async () => {
    try {
      const params = {
        operation:
          openModal === "tribu"
            ? "getAttendanceByTribuWithRate"
            : openModal === "yearLevel"
            ? "getAttendanceByYearLevelAndEvent"
            : "getStudentsAttendanceWithRate",
        json: JSON.stringify({
          ...(openModal === "tribu" && { tribu_id: selectedTribu }),
          ...(openModal === "yearLevel" && {
            year_level: selectedYearLevel,
            event_id: selectedEvent,
          }),
        }),
        sortColumn,
        sortDirection,
      };

      console.log("PARAMETERS: ", params);

      const response = await axios.get(url, { params });

      if (response.data.success) {
        setReportData(response.data.success);
        console.log(response.data);
      } else {
        console.error("Error fetching data:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenModal = (modalName) => {
    setOpenModal(modalName);
    setSelectedTribu("");
    setSelectedYearLevel("");
    setSelectedEvent("");
    setSortColumn("");
    setSortDirection("asc");
    fetchReportData();
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setReportData([]);
  };

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
    fetchReportData();
  };

  const renderModalContent = () => {
    switch (openModal) {
      case "student":
        return (
          <SortableTable
            data={reportData}
            columns={[
              { key: "student_id", label: "Student ID" },
              { key: "name", label: "Student Name" },
              { key: "attendance_rate", label: "Attendance Rate" },
            ]}
            onSort={handleSort}
          />
        );
      case "tribu":
        return (
          <>
            <select
              value={selectedTribu}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSelectedTribu(selectedValue);
              }}
              onBlur={fetchReportData}
              className="mb-4 p-2 border rounded"
            >
              <option value="">Select Tribu</option>
              {tribus.map((tribu) => (
                <option key={tribu.tribu_id} value={tribu.tribu_id}>
                  {tribu.tribu_name}
                </option>
              ))}
            </select>
            <SortableTable
              data={reportData.tribu || []}
              columns={[
                { key: "tribu_name", label: "Tribu Name" },
                { key: "total_count", label: "Member Count" },
                { key: "present_count", label: "Total Number of Presents" },
                { key: "absent_count", label: "Total Number of Absents" },
                { key: "attendance_rate", label: "Attendance Rate" },
              ]}
              onSort={handleSort}
            />
          </>
        );
      case "yearLevel":
        return (
          <>
            <select
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
              }}
              onBlur={fetchReportData}
              className="mb-4 p-2 border rounded"
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event.event_id} value={event.event_id}>
                  {event.event_name}
                </option>
              ))}
            </select>
            <SortableTable
              data={reportData}
              columns={[
                { key: "year_level", label: "Year Level" },
                { key: "total_students", label: "Total Students" },
                { key: "present_count", label: "Present Count" },
                { key: "attendance_rate", label: "Attendance Rate" },
              ]}
              onSort={handleSort}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Attendance Reports</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          className="bg-white p-4 rounded-lg shadow hover:bg-gray-50"
          onClick={() => handleOpenModal("student")}
        >
          <h4 className="font-semibold">Attendance by Student</h4>
        </button>
        <button
          className="bg-white p-4 rounded-lg shadow hover:bg-gray-50"
          onClick={() => handleOpenModal("tribu")}
        >
          <h4 className="font-semibold">Attendance by Tribu</h4>
        </button>
        <button
          className="bg-white p-4 rounded-lg shadow hover:bg-gray-50"
          onClick={() => handleOpenModal("yearLevel")}
        >
          <h4 className="font-semibold">Attendance by Year Level</h4>
        </button>
      </div>

      <Modal
        isOpen={openModal !== null}
        onClose={handleCloseModal}
        title={`Attendance by ${
          openModal === "student"
            ? "Student"
            : openModal === "tribu"
            ? "Tribu"
            : "Year Level"
        }`}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};
