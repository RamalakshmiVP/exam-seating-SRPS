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
    axios.get("http://127.0.0.1:5000/api/staff")
      .then(res => setStaff(res.data.staff))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Header />
      <Box sx={{ display: "flex" }}>
        <AdminSidebar />

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Typography variant="h6" mb={2}>Staff List</Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: "#1e293b" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Phone</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {staff.map(s => (
                  <TableRow key={s.staff_id}>
                    <TableCell>{s.staff_id}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
