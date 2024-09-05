"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  LogOut,
  Bell,
  User,
  UsersRound,
  BookOpen,
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import "../../global.css";
import { MasterDataEntry } from "./components/master";
import { TribuAssignment } from "./components/tribuass";
import { AttendanceMonitoring } from "./components/attendanceMonitor";
import { Reports } from "./components/reports";
import EventsModule from "./components/events";

const Sidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Master Data", icon: BookOpen },
    { name: "Tribu Assignment", icon: UsersRound },
    { name: "Events", icon: UsersRound },
    { name: "Attendance", icon: ClipboardList },
    { name: "Reports", icon: BarChart3 },
    { name: "Logout", icon: LogOut },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-500 to-blue-500 text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-10">Tribu Manager</h1>
      <nav>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                className={`w-full text-left py-2 px-4 rounded ${
                  activeItem === item.name
                    ? "bg-white bg-opacity-20"
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
                onClick={() => setActiveItem(item.name)}
              >
                <item.icon className="inline-block mr-2 h-4 w-4" />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const SortableTable = ({ data }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const customHeaders = {
    student_id: "KEY",
    name: "Student Name",
    student_number: "Student ID Number",
    contact_information: "Email",
    tribu_id: "Tribu",
    year_level: "Year Level",
    created_at: "Registered",
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortColumn) {
      if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  const columns = Object.keys(data[0] || {});

  return (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          {columns.map((column) => (
            <th
              key={column}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort(column)}
            >
              <div className="flex items-center">
                {customHeaders[column] || column}
                {sortColumn === column &&
                  (sortOrder === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {sortedData.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column} className="px-6 py-4 whitespace-nowrap">
                {row[column]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Change to null initially
  const [loading, setLoading] = useState(true); // Add loading state
  const url = "http://localhost/attendance-api/main.php";

  useEffect(() => {
    const data = sessionStorage.getItem("admin");

    const checkData = async () => {
      if (!data) {
        window.location.href = "/admin";
      } else {
        const parsedData = JSON.parse(data);
        setCurrentUser(parsedData);
        await getStudentData(); // Fetch data after setting user
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    checkData();
  }, []);

  const getStudentData = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "getStudents",
          json: "",
        },
      });

      if (res.status !== 200) {
        alert("Status Error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        setStudentData(res.data.success);
      } else {
        setStudentData([]);
        alert("No students found");
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleLogOut = () => {
    sessionStorage.removeItem("admin");
    window.location.href = "/admin";
  };

  const renderActiveComponent = () => {
    switch (activeItem) {
      case "Master Data":
        return <MasterDataEntry />;
      case "Tribu Assignment":
        return <TribuAssignment />;
      case "Attendance":
        return <AttendanceMonitoring />;
      case "Reports":
        return <Reports />;
      case "Events":
        return <EventsModule />;
      case "Dashboard":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Student Data</h3>
            <SortableTable data={studentData} />
          </div>
        );
      case "Logout":
        return handleLogOut();
      default:
        return (
          <h3 className="text-xl font-semibold">Welcome to Tribu Manager</h3>
        );
    }
  };

  return (
    <>
      {loading ? (
        <div>LOADING...</div> // Show loading message or spinner
      ) : currentUser ? (
        <div className="flex bg-gray-100 min-h-screen">
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

          <main className="flex-1 p-6 overflow-y-auto">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">{activeItem}</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </header>

            {renderActiveComponent()}
          </main>
        </div>
      ) : (
        <div>LOADING...</div>
      )}
    </>
  );
}
