import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Attendance = () => {
    const [studentName, setStudentName] = useState("");
    const [department, setDepartment] = useState("");
    const [group, setGroup] = useState("");
    const [gpsLocation, setGpsLocation] = useState({ latitude: null, longitude: null });
    const [deviceFingerprint, setDeviceFingerprint] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { id } = useParams();
    const [_id, expire] = id?.split("&") || [];

    // Get GPS Location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setGpsLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    console.log(error);
                    setGpsLocation({ latitude: "Unavailable", longitude: "Unavailable" });
                }
            );
        } else {
            setGpsLocation({ latitude: "Not supported", longitude: "Not supported" });
        }

        // Get Device Fingerprint (User Agent)
        setDeviceFingerprint(navigator.userAgent);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const apiUrl = "https://qr-code-generator-backend-nodejs-production.up.railway.app/api/students/attendance";
        const payload = {
            lecture: _id,
            studentName,
            department,
            group,
            gpsLocation,  // Correctly formatted object
            deviceFingerprint,
            expire
        };

        try {
            const response = await axios.post(apiUrl, payload);
            setMessage("Attendance marked successfully!");
            setStudentName("");
            setDepartment("");
            setGroup("");
        } catch (error) {
            setMessage(error.response?.data?.message || "An error occurred. Please try again.");
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <div className="h-full flex justify-center items-center ">
            <div className="md:w-3/4 w-full p-4 bg-white shadow-md rounded-md my-5">
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
                    <p className="text-sm text-gray-600">
                        GPS: {gpsLocation.latitude}, {gpsLocation.longitude}
                    </p>
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
