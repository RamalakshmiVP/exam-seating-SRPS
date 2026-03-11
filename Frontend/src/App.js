import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStaff from "./pages/AdminStaff";
import AdminStudents from "./pages/AdminStudents";
import AdminSeating from "./pages/AdminSeating";
import AdminRooms from "./pages/AdminRooms";
import AdminTimetable from "./pages/AdminTimetable";
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* ADMIN AUTH */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* STAFF AUTH */}
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />

        {/* STUDENT AUTH */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* ADMIN DASHBOARD */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        

        {/* ADMIN MODULES */}
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/seating" element={<AdminSeating />} />
        <Route path="/admin/rooms" element={<AdminRooms />} />
        <Route path="/admin/timetable" element={<AdminTimetable />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
