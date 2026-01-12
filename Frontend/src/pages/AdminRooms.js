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

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/rooms")
      .then((res) => setRooms(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Header />
      <Box sx={{ display: "flex" }}>
        <AdminSidebar />

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Typography variant="h6" mb={2}>
            Classrooms List
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: "#880000" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Room No</TableCell>
                  <TableCell sx={{ color: "white" }}>Capacity</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rooms.map((room, index) => (
                  <TableRow key={index}>
                    <TableCell>{room.room_no}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
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
