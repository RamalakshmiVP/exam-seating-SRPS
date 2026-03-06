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
      .then((res) => {
        console.log("ROOM API RESPONSE:", res.data);
        setRooms(res.data.rooms);   // 🔥 FIX HERE
      })
      .catch((err) => console.error("Room fetch error:", err));
  }, []);

  return (
    <>
      <Header />

      <Box sx={{ display: "flex" }}>
        <AdminSidebar />

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Typography variant="h6" mb={2} align="center">
            Exam Hall Strength
          </Typography>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#880000" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>HALL NAME</TableCell>
                  <TableCell sx={{ color: "white" }}>A</TableCell>
                  <TableCell sx={{ color: "white" }}>B</TableCell>
                  <TableCell sx={{ color: "white" }}>C</TableCell>
                  <TableCell sx={{ color: "white" }}>D</TableCell>
                  <TableCell sx={{ color: "white" }}>E</TableCell>
                  <TableCell sx={{ color: "white" }}>F</TableCell>
                  <TableCell sx={{ color: "white" }}>G</TableCell>
                  <TableCell sx={{ color: "white" }}>H</TableCell>
                  <TableCell sx={{ color: "white" }}>I</TableCell>
                  <TableCell sx={{ color: "white" }}>J</TableCell>
                  <TableCell sx={{ color: "white" }}>TOTAL</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      No room data found
                    </TableCell>
                  </TableRow>
                ) : (
                  rooms.map((room, index) => (
                    <TableRow key={index}>
                      <TableCell>{room.hall_name}</TableCell>
                      <TableCell>{room.A}</TableCell>
                      <TableCell>{room.B}</TableCell>
                      <TableCell>{room.C}</TableCell>
                      <TableCell>{room.D}</TableCell>
                      <TableCell>{room.E}</TableCell>
                      <TableCell>{room.F}</TableCell>
                      <TableCell>{room.G}</TableCell>
                      <TableCell>{room.H}</TableCell>
                      <TableCell>{room.I}</TableCell>
                      <TableCell>{room.J}</TableCell>
                      <TableCell>{room.capacity}</TableCell>
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