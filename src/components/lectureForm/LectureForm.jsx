import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LectureForm = () => {
    const [course, setCourse] = useState("");
    const [section, setSection] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [qrCode, setQrCode] = useState("")
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        let token = localStorage.getItem("user"); // Retrieve token from localStorage
        const apiUrl = "http://localhost:5000/api/instructors/create-lecture";
        token = JSON.parse(token).token;
        if (!token) {
            setMessage("Authentication token not found.");
            setLoading(false);
            return;
        }
        const payload = {
            course,
            section,
        };
        try {
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Lecture created successfully!");
            setQrCode(response.data.lecture.qrCode);
            setCourse("");
            setSection("");
            navigate("/qrcode", { state: { data: response.data.lecture } });
        } catch (error) {
            setMessage(error.response?.data?.message || "An error occurred. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="h-full flex justify-center items-center">
            <div className="p-4 w-1/2 bg-white shadow-md rounded-md my-5">
                <h2 className="text-xl font-semibold mb-4">Create Lecture</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Course</label>
                        <input
                            type="text"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Section</label>
                        <input
                            type="text"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
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

export default LectureForm;
