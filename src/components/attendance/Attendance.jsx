import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Attendance = () => {
    const [studentName, setStudentName] = useState("");
    const [department, setDepartment] = useState("");
    const [group, setGroup] = useState("");
    const [gpsLocation, setGpsLocation] = useState("");
    const [deviceFingerprint, setDeviceFingerprint] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { id } = useParams()
    const _id = id.split("&")[0]
    const expire = id.split("&")[1]
    console.log(expire);
    // Get GPS Location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setGpsLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setGpsLocation("Location unavailable");
                }
            );
        } else {
            setGpsLocation("Geolocation not supported");
        }

        // Get Device Fingerprint (Simple Method)
        setDeviceFingerprint(navigator.userAgent);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const apiUrl = "http://localhost:5000/api/students/attendance";
        const payload = {
            lecture: _id,
            studentName,
            department,
            group,
            gpsLocation,
            deviceFingerprint,
            expire
        };

        try {
            const response = await axios.post(apiUrl, payload);
            setMessage("Attendance marked successfully!");
            setStudentName("");
            setDepartment("");
            setGroup(""); // Reset input fields

        } catch (error) {
            setMessage(error.response?.data?.message || "An error occurred. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="h-full flex justify-center items-center">
            <div className="p-4 w-1/2 bg-white shadow-md rounded-md my-5">
                <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Student Name</label>
                        <input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Department</label>
                        <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Group</label>
                        <input
                            type="text"
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    {/* <p className="text-sm text-gray-600">
                        GPS: {gpsLocation || "Fetching location..."}
                    </p>
                    <p className="text-sm text-gray-600">
                        Device: {deviceFingerprint.slice(0, 50)}...
                    </p> */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default Attendance;
