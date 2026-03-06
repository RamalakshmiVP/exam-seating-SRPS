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

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = () => {
    axios
      .get("http://localhost:5000/api/staff/")
      .then((res) => {
        // ✅ Ensure DB order (id ascending)
        const orderedData = res.data.staff.sort(
          (a, b) => a.id - b.id
        );
        setStaff(orderedData);
      })
      .catch((err) => console.error("Staff fetch error:", err));
  };

  return (
    <>
      <Header />

      <Box sx={{ display: "flex" }}>
        <AdminSidebar />

        <Box sx={{ p: 3, flexGrow: 1 }}>
          {/* ===== TITLE + COUNT ===== */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Staff List
            </Typography>

            <Typography color="primary" fontWeight="bold">
              Total Staff : {staff.length}
            </Typography>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: "#1e293b" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>S.No</TableCell>
                  <TableCell sx={{ color: "white" }}>Name</TableCell>
                   <TableCell sx={{ color: "white" }}>Gender</TableCell>
                  <TableCell sx={{ color: "white" }}>Department</TableCell>
                  <TableCell sx={{ color: "white" }}>Mobile</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {staff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No staff found
                    </TableCell>
                  </TableRow>
                ) : (
                  staff.map((s, index) => (
                    <TableRow key={s.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{s.staff_name}</TableCell>
                      <TableCell>{s.gender}</TableCell>
                      <TableCell>{s.department_name}</TableCell>
                      <TableCell>{s.mobile}</TableCell>
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