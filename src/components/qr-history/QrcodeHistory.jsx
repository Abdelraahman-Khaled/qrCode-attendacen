import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const QrcodeHistory = () => {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [lectures, setLectures] = useState([]);

    useEffect(() => {
        const fetchLectures = async () => {
            let token = localStorage.getItem("user");
            if (!token) {
                setMessage("Authentication token not found.");
                setLoading(false);
                return;
            }

            token = JSON.parse(token).token;

            try {
                const response = await axios.get("https://qr-code-generator-backend-nodejs-production.up.railway.app/api/instructors/lecture", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                setLectures(response.data);
                setMessage("Lectures fetched successfully.");
            } catch (error) {
                setMessage(error.response?.data?.message || "An error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchLectures();
    }, []);

    return (
        <div className="my-10 px-6">
            <h2 className="text-4xl font-bold text-center mb-6">QR Code History</h2>
            {loading ? (
                <p className="text-center text-lg">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[...lectures].reverse().map((lecture) => (
                        <Link key={lecture._id} to={`/qrcode`}
                            state={{ data: lecture }} // Passing lecture data to the Qrcode component
                        >
                            <div className="p-6 bg-white shadow-lg rounded-lg text-center hover:shadow-xl transition-all cursor-pointer">
                                <p className="text-lg font-semibold">Course: {lecture.course}</p>
                                <p className="text-gray-600">Section: {lecture.section}</p>
                                <p className="text-gray-500">Date: {new Date(lecture.date).toLocaleString()}</p>
                                <img src={lecture.qrCode} alt="QR Code" className="w-40 h-40 mx-auto mt-4 rounded-md" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QrcodeHistory;
