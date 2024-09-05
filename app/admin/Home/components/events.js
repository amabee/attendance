import axios from "axios";
import { Plus, Pencil, Trash2, QrCode } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Datepicker } from "flowbite-react";
import { format } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";

const EventsModule = () => {
  const url = "http://localhost/attendance-api/main.php";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [events, setEvents] = useState([]);

  // Form state
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [eventStatus, setEventStatus] = useState("active");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleCreateEvent = () => {
    setEventName("");
    setEventDate(new Date());
    setStartTime("00:00");
    setEndTime("00:00");
    setEventStatus("active");
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEventName(event.event_name);
    setEventDate(new Date(event.event_start_time.split(" ")[0]));
    setStartTime(event.event_start_time.split(" ")[1]);
    setEndTime(event.event_end_time.split(" ")[1]);
    setEventStatus(event.isActive ? "active" : "inactive");
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSubmitEvent = async () => {
    const formData = new FormData();
    formData.append("operation", selectedEvent ? "updateEvent" : "createEvent");
    formData.append(
      "json",
      JSON.stringify({
        event_id: selectedEvent ? selectedEvent.event_id : undefined,
        event_name: eventName,
        event_start_time: `${format(eventDate, "yyyy-MM-dd")} ${startTime}`,
        event_end_time: `${format(eventDate, "yyyy-MM-dd")} ${endTime}`,
        isActive: eventStatus === "active",
      })
    );

    try {
      const res = await axios.post(url, formData);

      if (res.status !== 200) {
        alert("Status Error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        alert(`Event ${selectedEvent ? "updated" : "created"} successfully`);
        setIsModalOpen(false);
        getEvents();
      } else {
        alert(
          "Failed to " +
            (selectedEvent ? "update" : "create") +
            " event: " +
            res.data.error
        );
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const getEvents = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "getEvents",
          json: "",
        },
      });

      if (res.status !== 200) {
        alert("Status Error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        setEvents(res.data.success);
      } else {
        setEvents([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleQrClick = (event) => {
    setQrCodeValue(
      `Event ID: ${event.event_id}, Event Name: ${event.event_name}`
    );
    setIsQRCodeModalOpen(true);
  };

  const updateStatus = async (id) => {
    const formData = new FormData();
    formData.append("operation", "deleteEvent");
    formData.append(
      "json",
      JSON.stringify({
        event_id: id,
      })
    );

    try {
      const res = await axios({
        url: url,
        method: "POST",
        data: formData,
      });

      if (res.status !== 200) {
        return alert("Status Error: " + res.statusText);
      }

      if (res.data.success) {
        alert(res.data.success);
        return getEvents();
      } else {
        return alert(res.data.error);
      }
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Events</h2>
        <button
          onClick={() => handleCreateEvent()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Event</span>
        </button>
      </div>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event Start Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event End Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.event_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.event_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.event_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(event.event_start_time).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(event.event_start_time).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(event.event_end_time).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.isActive ? "Active" : "Inactive"}
                </td>

                <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200">
                  {event.isActive ? (
                    <button
                      onClick={() => handleQrClick(event)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <QrCode size={16} />
                    </button>
                  ) : null}

                  <button
                    onClick={() => handleEditEvent(event)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => updateStatus(event.event_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="px-6 py-4 whitespace-nowrap text-center"
              >
                No events found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isQRCodeModalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="qr-code-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                QR Code for Event
              </h3>
              <div className="mt-2 px-7 py-3">
                <QRCodeCanvas
                  value={qrCodeValue}
                  size={256}
                  className="mx-auto"
                />
              </div>
              <button
                onClick={() => setIsQRCodeModalOpen(false)}
                className="px-4 py-2 mt-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="event-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedEvent ? "Edit Event" : "Create Event"}
              </h3>
              <div className="mt-2 px-7 py-3">
                <form>
                  <div>
                    <label
                      htmlFor="event-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Event Name
                    </label>
                    <input
                      type="text"
                      id="event-name"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="event-date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Event Date
                    </label>
                    <Datepicker
                      selected={eventDate}
                      onChange={(date) => setEventDate(date)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="start-time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Time
                    </label>
                    <input
                      type="time"
                      id="start-time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="end-time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Time
                    </label>
                    <input
                      type="time"
                      id="end-time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    />
                  </div>
                  {/* <div className="mt-4">
                    <label
                      htmlFor="event-status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="event-status"
                      value={eventStatus}
                      onChange={(e) => setEventStatus(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div> */}
                </form>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleSubmitEvent}
                  className="px-4 py-2 mt-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600"
                >
                  {selectedEvent ? "Update Event" : "Create Event"}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 mt-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsModule;