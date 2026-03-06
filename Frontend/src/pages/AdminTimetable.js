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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";

import Header from "../components/header";
import AdminSidebar from "../components/sidebar";

export default function AdminTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [filteredTimetable, setFilteredTimetable] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = () => {
    axios.get("http://127.0.0.1:5000/api/timetable")
      .then((res) => {
        console.log("Timetable response:", res.data);
        const data = res.data.timetable || res.data || [];
        setTimetable(data);
        setFilteredTimetable(data);
      })
      .catch((err) => console.error("Timetable fetch error:", err));
  };

  const filterByYear = (year) => {
    setSelectedYear(year);
    if (year === "all") {
      setFilteredTimetable(timetable);
    } else {
      const filtered = timetable.filter(item => 
        item.semester && item.semester.toString().startsWith(year)
      );
      setFilteredTimetable(filtered);
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ display: "flex" }}>
        <AdminSidebar />

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Typography variant="h6" mb={2} align="center">
            Exam Timetable
          </Typography>

          {/* ================= FILTER BUTTONS ================= */}
          <Box sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "center" }}>
            <Button 
              variant={selectedYear === "all" ? "contained" : "outlined"} 
              onClick={() => filterByYear("all")}
              sx={{ minWidth: 100 }}
            >
              All
            </Button>
            <Button 
              variant={selectedYear === "1" ? "contained" : "outlined"} 
              onClick={() => filterByYear("1")}
              color="primary"
              sx={{ minWidth: 100 }}
            >
              UG
            </Button>
            <Button 
              variant={selectedYear === "2" ? "contained" : "outlined"} 
              onClick={() => filterByYear("2")}
              color="secondary"
              sx={{ minWidth: 100 }}
            >
              PG
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: "#880000" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Date</TableCell>
                  <TableCell sx={{ color: "white" }}>Time</TableCell>
                  <TableCell sx={{ color: "white" }}>Department</TableCell>
                  <TableCell sx={{ color: "white" }}>Semester</TableCell>
                  <TableCell sx={{ color: "white" }}>Subject</TableCell>
                  <TableCell sx={{ color: "white" }}>Hall</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredTimetable.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No timetable data found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTimetable.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.time}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell>{item.semester}</TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell>{item.hall}</TableCell>
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

