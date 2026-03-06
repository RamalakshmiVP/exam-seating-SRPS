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
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";

import Header from "../components/header";
import AdminSidebar from "../components/sidebar";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // edit
  const [openEdit, setOpenEdit] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get("http://localhost:5000/api/students")
      .then((res) => {
        setStudents(res.data.students);
        setFilteredStudents(res.data.students); // initial
      })
      .catch((err) => console.error("Student fetch error:", err));
  };

  // ================= EDIT =================
  const handleEditClick = (student) => {
    setEditStudent(student);
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    setEditStudent({
      ...editStudent,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/api/students/${editStudent.id}`, editStudent)
      .then(() => {
        setOpenEdit(false);
        fetchStudents();
      })
      .catch(err => console.error("Update error:", err));
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (!window.confirm("Delete this student?")) return;

    axios.delete(`http://localhost:5000/api/students/${id}`)
      .then(() => fetchStudents())
      .catch(err => console.error("Delete error:", err));
  };

  // ================= UI =================
  return (
    <>
      <Header />
      <Box sx={{ display: "flex" }}>
        <AdminSidebar />

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
           <center><Typography variant="h5" fontWeight="bold">
              Student List
            </Typography></center> 

            <Typography color="primary" fontWeight="bold">
              Count: {filteredStudents.length}
            </Typography>
          </Box>


          {/* ================= TABLE ================= */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#1e293b" }}>
                <TableRow>
                  {["ID","Name","Register No","DOB","Mobile","Department","Semester","Actions"]
                    .map(h => (
                      <TableCell key={h} sx={{ color: "white" }}>{h}</TableCell>
                    ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">No students found</TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map(s => (
                    <TableRow key={s.id}>
                      <TableCell>{s.id}</TableCell>
                      <TableCell>{s.student_name}</TableCell>
                      <TableCell>{s.register_no}</TableCell>
                      <TableCell>{s.dob}</TableCell>
                      <TableCell>{s.mobile}</TableCell>
                      <TableCell>{s.department_name}</TableCell>
                      <TableCell>{s.semester}</TableCell>
                      <TableCell>
                        <Button size="small" variant="contained" sx={{ mr: 1 }} onClick={() => handleEditClick(s)}>
                          Edit
                        </Button>
                        <Button size="small" variant="contained" color="error" onClick={() => handleDelete(s.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Name" name="student_name" value={editStudent?.student_name || ""} onChange={handleEditChange} />
          <TextField label="Mobile" name="mobile" value={editStudent?.mobile || ""} onChange={handleEditChange} />
          <TextField label="Semester" name="semester" value={editStudent?.semester || ""} onChange={handleEditChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
