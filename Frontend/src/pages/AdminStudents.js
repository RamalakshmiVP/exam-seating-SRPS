import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

import Header from "../components/header";
import AdminSidebar from "../components/sidebar";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/students")
      .then((res) => {
        // 🔥 IMPORTANT: backend returns ARRAY
        setStudents(res.data.students);
      })
      .catch((err) => console.error("Student fetch error:", err));
  }, []);

  return (
    <>
      <Header />

      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
           <center>Students</center>
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#1e293b" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Register No</TableCell>
                  <TableCell sx={{ color: "white" }}>DOB</TableCell>
                  <TableCell sx={{ color: "white" }}>Department</TableCell>
                  <TableCell sx={{ color: "white" }}>Semester</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.id}</TableCell>
                      <TableCell>{s.student_name}</TableCell>
                      <TableCell>{s.register_no}</TableCell>
                      <TableCell>{s.dob}</TableCell>
                      <TableCell>{s.dept}</TableCell>
                      <TableCell>{s.sem}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
