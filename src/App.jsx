import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// pages & components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/navbar/Navbar";
import { useAuthContext } from "./hooks/useAuthContext";
import Qrcode from "./components/qrcode/Qrcode";
import Attendance from "./components/attendance/attendance";
import { StudentsAttendance } from "./components/getAttendance/StudentsAttendance";
import LectureForm from "./components/lectureForm/LectureForm";
import QrcodeHistory from "./components/qr-history/QrcodeHistory";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="container mx-auto h-[500px] ">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="qrcode"
              element={user ? <Qrcode /> : <Navigate to="/login" />}
            />
            <Route
              path="/qrcode/:id"
              element={<Attendance />}
            />
            <Route
              path="attendance"
              element={user ? <StudentsAttendance /> : <Navigate to="/login" />}
            />
            <Route
              path="create-lecture"
              element={user ? <LectureForm /> : <Navigate to="/login" />}
            />
            <Route
              path="history"
              element={user ? <QrcodeHistory /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
