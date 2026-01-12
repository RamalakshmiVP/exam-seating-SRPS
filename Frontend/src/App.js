import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStaff from "./pages/AdminStaff";
import AdminStudents from "./pages/AdminStudents";
import AdminSeating from "./pages/AdminSeating";
import AdminRooms from "./pages/AdminRooms";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* ADMIN AUTH */}
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* <Route path="/staff-login" element={<StaffLogin />} /> */}

        {/* ADMIN DASHBOARD */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        

        {/* ADMIN MODULES */}
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/seating" element={<AdminSeating />} />
        <Route path="/admin/rooms" element={<AdminRooms />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
