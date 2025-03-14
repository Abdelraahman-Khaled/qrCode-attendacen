import React, { useEffect, useState } from "react";
import axios from "axios";

export const StudentsAttendance = () => {
    const [loading, setLoading] = useState(false);
    const [attendance, setAttendance] = useState([]);
    const [message, setMessage] = useState("");
    const studentsPerPage = 5; // Number of students per page
    const [currentPages, setCurrentPages] = useState({}); // Stores pagination for each lecture

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            setMessage("");

            let tokenData = localStorage.getItem("user");
            if (!tokenData) {
                setMessage("Authentication token not found.");
                setLoading(false);
                return;
            }

            const token = JSON.parse(tokenData)?.token;
            const apiUrl = "https://qr-code-generator-backend-nodejs-production.up.railway.app/api/instructors/attendance";

            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAttendance(response.data || []);

                // Initialize pagination states
                const initialPages = {};
                response.data.forEach((lecture) => {
                    initialPages[lecture.lecture._id] = 1;
                });
                setCurrentPages(initialPages);
            } catch (error) {
                setMessage(error.response?.data?.message || "An error occurred. Please try again.");
            }

            setLoading(false);
        };

        fetchAttendance();
    }, []);

    const handleNextPage = (lectureId, totalStudents) => {
        setCurrentPages((prev) => ({
            ...prev,
            [lectureId]: Math.min(prev[lectureId] + 1, Math.ceil(totalStudents / studentsPerPage)),
        }));
    };

    const handlePrevPage = (lectureId) => {
        setCurrentPages((prev) => ({
            ...prev,
            [lectureId]: Math.max(prev[lectureId] - 1, 1),
        }));
    };

    const handleExport = async () => {
        let tokenData = localStorage.getItem("user");
        if (!tokenData) {
            setMessage("Authentication token not found.");
            return;
        }

        const token = JSON.parse(tokenData)?.token;
        const exportUrl = "https://qr-code-generator-backend-nodejs-production.up.railway.app/api/instructors/export-excel";

        try {
            const response = await axios.get(exportUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                responseType: "blob", // Important for file download
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "attendance.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setMessage("Failed to export attendance data.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto my-6 p-6 bg-white shadow-lg rounded-lg">
            {message && <p className="text-center text-red-500 mb-4">{message}</p>}

            {loading ? (
                <p className="text-center text-lg font-semibold text-gray-700">Loading...</p>
            ) : (
                <>
                    {attendance.length > 0 ? (
                        attendance.map((lectureData, index) => {
                            const totalStudents = lectureData.students.length;
                            const totalPages = Math.ceil(totalStudents / studentsPerPage);
                            const currentPage = currentPages[lectureData.lecture._id] || 1;

                            const startIdx = (currentPage - 1) * studentsPerPage;
                            const selectedStudents = lectureData.students.slice(startIdx, startIdx + studentsPerPage);

                            return (
                                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {lectureData.lecture.course.toUpperCase()} - Section {lectureData.lecture.section}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Date: {new Date(lectureData.lecture.date).toLocaleString()}
                                    </p>

                                    <div className="overflow-x-auto mt-4">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                                                    <th className="py-3 px-4 text-left">Student Name</th>
                                                    <th className="py-3 px-4 text-left">Department</th>
                                                    <th className="py-3 px-4 text-left">Group</th>
                                                    <th className="py-3 px-4 text-left">Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedStudents.length > 0 ? (
                                                    selectedStudents.map((student, idx) => (
                                                        <tr key={idx} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
                                                            <td className="py-3 px-4">{student.studentName}</td>
                                                            <td className="py-3 px-4">{student.department}</td>
                                                            <td className="py-3 px-4">{student.group}</td>
                                                            <td className="py-3 px-4">{new Date(student.timestamp).toLocaleTimeString()}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="py-3 px-4 text-center text-gray-500">
                                                            No students attended this lecture.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-lg text-gray-600">No attendance records found.</p>
                    )}

                    {!loading && attendance.length > 0 && (
                        <button 
                            className="px-8 py-3 mx-auto flex items-center gap-2 text-white bg-[var(--primary)] border border-[var(--primary)] rounded cursor-pointer"
                            onClick={handleExport}
                        >
                            Export
                        </button>
                    )}
                </>
            )}
        </div>
    );
};
