
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Button,
  Table, TableHead, TableRow,
  TableCell, TableBody, Paper,
  FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogTitle, DialogContent,
  Snackbar, Alert, Chip, IconButton
} from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Header from "../components/header";
import AdminSidebar from "../components/sidebar";

export default function AdminSeating() {

  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [seating, setSeating] = useState([]);
  const [overflow, setOverflow] = useState([]);
  const [seatingHistory, setSeatingHistory] = useState([]);
  const [selectedNewHall, setSelectedNewHall] = useState("");

  const [openVisual, setOpenVisual] = useState(false);
  const [notify, setNotify] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState(null);

  /* ================= FETCH DB DATA ================= */
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/students")
      .then(res => setStudents(res.data.students || []));

    axios.get("http://127.0.0.1:5000/api/students/departments")
      .then(res => setDepartments(res.data.departments || []));

    axios.get("http://127.0.0.1:5000/api/staff")
      .then(res => setStaffList(res.data.staff || []));

    axios.get("http://127.0.0.1:5000/api/rooms")
      .then(res => setRooms(res.data.rooms || []));
  }, []);

  /* ================= GET CLASSES FOR SELECTED DEPT ================= */
  const getClassesForSelectedDepts = () => {
    if (selectedDepts.length === 0) return [];
    
    const classMap = {
      1: "I sem",
      2: "II sem",
      3: "III sem",
      4: "IV sem",
      5: "V sem",
      6: "VI sem"
    };

    // If only M.Sc department selected, show only I MA, II MA
    if (selectedDepts.length === 1 && selectedDepts[0].toLowerCase().includes("m.sc")) {
      const deptStudents = students.filter(s => s.department_name === selectedDepts[0]);
      const semesters = [...new Set(deptStudents.map(s => s.semester))].sort();
      return semesters.slice(0, 2).map(sem => ({
        value: sem,
        label: classMap[sem] || `Sem ${sem}`
      }));
    }
    
    // Otherwise show all available semesters
    const allSemesters = new Set();
    selectedDepts.forEach(dept => {
      const deptStudents = students.filter(s => s.department_name === dept);
      deptStudents.forEach(s => allSemesters.add(s.semester));
    });
    
    return [...allSemesters].sort().map(sem => ({
      value: sem,
      label: classMap[sem] || `Sem ${sem}`
    }));
  };

  /* ================= GET STUDENT RANGE ================= */
  const getStudentRange = (dept, cls) => {
    const filtered = students
      .filter(s => s.department_name === dept && s.semester === cls)
      .sort((a, b) => a.register_no.localeCompare(b.register_no));
    
    if (filtered.length === 0) return null;
    
    return {
      start: filtered[0].register_no,
      end: filtered[filtered.length - 1].register_no,
      count: filtered.length
    };
  };

  /* ================= CALCULATE TOTAL CAPACITY ================= */
  const getTotalCapacity = () => {
    return selectedRooms.reduce((total, roomNo) => {
      const room = rooms.find(r => r.room_no === roomNo);
      return total + (room?.capacity || 0);
    }, 0);
  };

  /* ================= ALLOCATE STUDENTS - SEPARATE DEPARTMENTS ================= */
  const allocateStudentsByDepartment = () => {
    const totalCapacity = getTotalCapacity();
    const remaining = [];
    
    let filteredStudents = students.filter(s =>
      selectedDepts.includes(s.department_name) && 
      selectedClasses.includes(s.semester)
    );

    // Group by department
    const deptGroups = {};
    selectedDepts.forEach(dept => {
      deptGroups[dept] = filteredStudents
        .filter(s => s.department_name === dept)
        .sort((a, b) => a.register_no.localeCompare(b.register_no));
    });

    // Allocate students with separation between departments
    // Seat pattern: Dept1 students, skip some seats, Dept2 students, skip some seats, etc.
    const seatMatrix = Array.from({ length: totalCapacity }, () => null);
    
    // Calculate skip pattern - distribute departments evenly
    const numDepts = selectedDepts.length;
    const seatsPerDept = {};
    
    // First pass: count students per department
    selectedDepts.forEach(dept => {
      seatsPerDept[dept] = (deptGroups[dept] || []).length;
    });

    // Allocate in pattern: interleave departments
    // Pattern: [Dept1_1, Dept2_1, Dept3_1, ..., Dept1_2, Dept2_2, Dept3_2, ...]
    // If 3 departments: seat 1=Dept1, seat 2=Dept2, seat 3=Dept3, seat 4=Dept1, seat 5=Dept2, seat 6=Dept3...
    
    let currentSeatIndex = 0;
    const maxStudentsInAnyDept = Math.max(...Object.values(seatsPerDept));
    
    // Fill seats in round-robin fashion to separate departments
    for (let round = 0; round < maxStudentsInAnyDept; round++) {
      for (let d = 0; d < numDepts; d++) {
        const dept = selectedDepts[d];
        const deptStudents = deptGroups[dept] || [];
        
        if (round < deptStudents.length) {
          if (currentSeatIndex < totalCapacity) {
            seatMatrix[currentSeatIndex] = {
              ...deptStudents[round],
              seatNumber: currentSeatIndex + 1
            };
            currentSeatIndex++;
          } else {
            remaining.push(deptStudents[round]);
          }
        }
      }
    }

    return {
      seated: seatMatrix.filter(s => s !== null),
      remaining
    };
  };

  /* ================= GENERATE SEATING ================= */
  const generateSeating = () => {
    if (selectedDepts.length === 0 || selectedClasses.length === 0 || 
        selectedStaff === "" || selectedRooms.length === 0) {
      alert("Select Department, Class, Invigilator & Room(s)");
      return;
    }

    const { seated, remaining } = allocateStudentsByDepartment();
    
    // Get class labels
    const classLabels = selectedClasses.map(c => 
      getClassesForSelectedDepts().find(gc => gc.value === c)?.label || c
    ).join(', ');

    // Save to history
    const historyEntry = {
      id: Date.now(),
      departments: selectedDepts,
      classes: selectedClasses,
      classLabels: classLabels,
      rooms: selectedRooms,
      invigilator: selectedStaff,
      seated: seated,
      remaining: remaining,
      timestamp: new Date().toLocaleString()
    };
    
    setSeatingHistory(prev => [historyEntry, ...prev]);
    setSeating(seated);
    setOverflow(remaining);

    if (remaining.length > 0) {
      setNotify(true);
    }
  };

  /* ================= GET ROOM STUDENTS ================= */
  const getRoomStudents = (roomNo, seatingData, roomsList) => {
    const room = roomsList.find(r => r.room_no === roomNo);
    const roomCapacity = room?.capacity || 0;
    
    let startIndex = 0;
    const roomOrder = roomsList.map(r => r.room_no);
    const roomIndex = roomOrder.indexOf(roomNo);
    
    for (let i = 0; i < roomIndex; i++) {
      const prevRoom = roomsList.find(r => r.room_no === roomOrder[i]);
      startIndex += (prevRoom?.capacity || 0);
    }
    
    return seatingData.slice(startIndex, startIndex + roomCapacity);
  };

  /* ================= GET ROOM INFO ================= */
  const getRoomInfo = (roomNo) => {
    const room = rooms.find(r => r.room_no === roomNo);
    const roomStudents = getRoomStudents(roomNo, seating, rooms);
    
    return {
      room: room,
      students: roomStudents,
      occupied: roomStudents.length,
      available: (room?.capacity || 0) - roomStudents.length
    };
  };

  /* ================= GET DEPARTMENTS IN SEATING ================= */
  const getDepartmentsInSeating = () => {
    const deptCounts = {};
    seating.forEach(s => {
      const dept = s.department_name || "Unknown";
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    return Object.entries(deptCounts).map(([dept, count]) => ({ dept, count }));
  };

  /* ================= GET CLASSES IN SEATING ================= */
  const getClassesInSeating = () => {
    const classCounts = {};
    seating.forEach(s => {
      const cls = s.semester ? `Sem ${s.semester}` : "Unknown";
      classCounts[cls] = (classCounts[cls] || 0) + 1;
    });
    return Object.entries(classCounts).map(([cls, count]) => ({ cls, count }));
  };

  /* ================= GET ROOM INFO FOR HISTORY ================= */
  const getRoomInfoForHistory = (roomNo, historyRooms, historySeated) => {
    const room = rooms.find(r => r.room_no === roomNo);
    const roomStudents = getRoomStudents(roomNo, historySeated, rooms);
    
    return {
      room: room,
      students: roomStudents,
      occupied: roomStudents.length,
      available: (room?.capacity || 0) - roomStudents.length
    };
  };

  /* ================= EXPORT PDF ================= */
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Exam Seating Arrangement", 14, 15);
    doc.setFontSize(10);

    doc.text(`Rooms : ${selectedRooms.join(", ")}`, 14, 25);
    doc.text(`Invigilator : ${selectedStaff}`, 14, 31);
    doc.text(`Departments : ${selectedDepts.join(", ")}`, 14, 37);
    doc.text(`Classes : ${selectedClasses.join(", ")}`, 14, 43);
    doc.text(`Seated : ${seating.length}`, 14, 49);
    doc.text(`Remaining : ${overflow.length}`, 14, 55);

    autoTable(doc, {
      startY: 60,
      head: [["S.No", "Reg No", "Name", "Department", "Semester", "Seat No"]],
      body: seating.map(s => [
        s.seatNumber,
        s.register_no,
        s.student_name,
        s.department_name,
        s.semester,
        s.seatNumber
      ])
    });

    doc.save("seating-arrangement.pdf");
  };

  /* ================= HANDLE DEPARTMENT CHANGE ================= */
  const handleDeptChange = (deptValues) => {
    setSelectedDepts(deptValues);
    setSelectedClasses([]);
    setSeating([]);
    setOverflow([]);
    setShowOverflow(false);
  };

  /* ================= HANDLE CLASS CHANGE ================= */
  const handleClassChange = (classValues) => {
    setSelectedClasses(classValues);
    setSeating([]);
    setOverflow([]);
    setShowOverflow(false);
  };

  /* ================= LOAD FROM HISTORY ================= */
  const loadFromHistory = (historyEntry) => {
    setSelectedDepts(historyEntry.departments);
    setSelectedClasses(historyEntry.classes);
    setSelectedRooms(historyEntry.rooms);
    setSelectedStaff(historyEntry.invigilator);
    setSeating(historyEntry.seated);
    setOverflow(historyEntry.remaining);
    setShowHistory(false);
  };

  /* ================= VIEW HISTORY VISUALS ================= */
  const viewHistoryVisual = (historyEntry) => {
    setSelectedHistoryEntry(historyEntry);
    setOpenVisual(true);
  };

  /* ================= PLACE STUDENTS IN NEW HALL ================= */
  const placeStudentsInNewHall = () => {
    if (!selectedNewHall || overflow.length === 0) {
      alert("Please select a hall first!");
      return;
    }

    // Get the capacity of the selected new hall
    const newRoom = rooms.find(r => r.room_no === selectedNewHall);
    if (!newRoom) {
      alert("Selected hall not found!");
      return;
    }

    const newHallCapacity = newRoom.capacity;
    const studentsToPlace = overflow.slice(0, newHallCapacity);
    const stillRemaining = overflow.slice(newHallCapacity);

    // Calculate the starting seat number for the new hall
    const currentTotalSeats = seating.length;
    
    // Add new students to seating with proper seat numbers
    const newlySeated = studentsToPlace.map((student, index) => ({
      ...student,
      seatNumber: currentTotalSeats + index + 1
    }));

    // Update states
    setSeating([...seating, ...newlySeated]);
    setOverflow(stillRemaining);
    setSelectedRooms([...selectedRooms, selectedNewHall]);
    setSelectedNewHall("");
    
    // Show success message
    if (stillRemaining.length === 0) {
      alert(`All remaining students have been seated in ${selectedNewHall}!`);
      setShowOverflow(false);
    } else {
      alert(`${studentsToPlace.length} students placed in ${selectedNewHall}. ${stillRemaining.length} students still remaining.`);
    }
  };

  /* ================= GET AVAILABLE ROOMS FOR NEW HALL ================= */
  const getAvailableRooms = () => {
    // Filter out rooms that are already selected
    return rooms.filter(r => !selectedRooms.includes(r.room_no));
  };

  return (
    <>
      <Header />
      <Box sx={{ display: "flex" }}>
        <AdminSidebar />

        <Box sx={{ p: 3, flexGrow: 1 }}>
          {/* ================= HEADER WITH HISTORY BUTTON ================= */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">
              Seating Arrangement
            </Typography>
            
            {seatingHistory.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => setShowHistory(true)}
                size="small"
              >
                History ({seatingHistory.length})
              </Button>
            )}
          </Box>

          {/* ================= DEPARTMENT SELECT ================= */}
          <Box sx={{ mb: 3 }}>
            <FormControl size="small" sx={{ minWidth: 280, mr: 2 }}>
              <InputLabel>Department</InputLabel>
              <Select
                multiple
                value={selectedDepts}
onChange={(e) => handleDeptChange(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {departments.map(d => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* ================= CLASS BUTTONS ================= */}
          {selectedDepts.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" mb={1} fontWeight="bold">
                Select Class:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {getClassesForSelectedDepts().map(cls => (
                  <Button
                    key={cls.value}
                    variant={selectedClasses.includes(cls.value) ? "contained" : "outlined"}
                    onClick={() => {
                      const newClasses = selectedClasses.includes(cls.value)
                        ? selectedClasses.filter(c => c !== cls.value)
                        : [...selectedClasses, cls.value];
                      handleClassChange(newClasses);
                    }}
                    sx={{ minWidth: 100 }}
                  >
                    {cls.label}
                  </Button>
                ))} 
              </Box>
              
              {/* Show student range */}
              {selectedClasses.length > 0 && selectedDepts.map(dept => {
                const deptClasses = selectedClasses.filter(c => {
                  const deptStudents = students.filter(s => s.department_name === dept);
                  return deptStudents.some(s => s.semester === c);
                });
                
                return deptClasses.map(cls => {
                  const range = getStudentRange(dept, cls);
                  if (!range) return null;
                  
                  const clsLabel = getClassesForSelectedDepts().find(c => c.value === cls)?.label;
                  
                  return (
                    <Typography key={`${dept}-${cls}-range`} variant="body2" sx={{ mt: 1, color: "#666" }}>
                      <Chip label={clsLabel} size="small" sx={{ mr: 1 }} />
                      {range.start} - {range.end} ({range.count} students)
                    </Typography>
                  );
                });
              })}
            </Box>
          )}

          {/* ================= INVIGILATOR & ROOM SELECT ================= */}
          {selectedClasses.length > 0 && (
            <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Invigilator</InputLabel>
                <Select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                >
                  {staffList.map(s => (
                    <MenuItem key={s.id} value={s.staff_name}>
                      {s.staff_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 250 }}>
                <InputLabel>Hall(s)</InputLabel>
                <Select
                  multiple
                  value={selectedRooms}
                  onChange={(e) => {
                    setSelectedRooms(e.target.value);
                    setSeating([]);
                    setOverflow([]);
                    setShowOverflow(false);
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {rooms.map(r => (
                    <MenuItem key={r.id} value={r.room_no}>
                      {r.room_no} (Capacity: {r.capacity})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="contained" onClick={generateSeating} sx={{ minWidth: 120 }}>
                Generate
              </Button>
            </Box>
          )}

          {/* ================= ROOM CAPACITY INFO ================= */}
          {selectedRooms.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: "#1976d2", mb: 1 }}>
                Total Capacity: {getTotalCapacity()} seats
                {selectedClasses.length > 0 && (
                  <> | Selected Students: {
                    students.filter(s => 
                      selectedDepts.includes(s.department_name) && 
                      selectedClasses.includes(s.semester)
                    ).length
                  }</>
                )}
              </Typography>
              
              {/* Room buttons for visual */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selectedRooms.map(roomNo => (
                  <Button
                    key={roomNo}
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenVisual(true)}
                  >
                    {roomNo}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* ================= COUNT & NEXT BUTTON ================= */}
          {seating.length > 0 && (
            <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
              <Typography fontWeight="600">
                Seated : {seating.length} | Remaining : {overflow.length}
              </Typography>
              
              {overflow.length > 0 && (
                <Button 
                  variant="outlined" 
                  color="warning"
                  onClick={() => setShowOverflow(true)}
                >
                  Next ({overflow.length})
                </Button>
              )}
            </Box>
          )}

          {/* ================= SEATING TABLE ================= */}
          {seating.length > 0 && (
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Seat No</TableCell>
                    <TableCell>Register No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Semester</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seating.map((s, i) => (
                    <TableRow key={s.id || i}>
                      <TableCell>{s.seatNumber}</TableCell>
                      <TableCell>{s.register_no}</TableCell>
                      <TableCell>{s.student_name}</TableCell>
                      <TableCell>{s.department_name}</TableCell>
                      <TableCell>{s.semester}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}

          {/* ================= ACTION BUTTONS ================= */}
          {seating.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={() => setOpenVisual(true)}>
                VISUALS 👁
              </Button>
              <Button variant="outlined" color="success" onClick={exportPDF}>
                Export PDF
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* ================= VISUAL DIALOG ================= */}
      <Dialog open={openVisual} onClose={() => { setOpenVisual(false); setSelectedHistoryEntry(null); }} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedHistoryEntry 
            ? `History: ${selectedHistoryEntry.classLabels} - ${selectedHistoryEntry.rooms.join(", ")}`
            : `Seating Visual - ${selectedRooms.join(", ")}`
          }
          <Typography variant="body2" sx={{ mt: 1 }}>
            Invigilator: {selectedHistoryEntry ? selectedHistoryEntry.invigilator : selectedStaff}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {(selectedHistoryEntry ? selectedHistoryEntry.rooms : selectedRooms).map(roomNo => {
            const { room, students: roomStudents, occupied, available } = selectedHistoryEntry
              ? getRoomInfoForHistory(roomNo, selectedHistoryEntry.rooms, selectedHistoryEntry.seated)
              : getRoomInfo(roomNo);
            
            const capacity = room?.capacity || 0;
            const totalColumns = 8; // A, B, C, D, E, F, G, H
            const seatsPerColumn = 5; // 5 rows per column
            
            // Function to get seat index - VERTICAL FILLING
            // Column A: seats 1-5, Column B: seats 6-10, etc.
            const getVerticalSeatIndex = (colIdx, rowIdx) => {
              return colIdx * seatsPerColumn + rowIdx;
            };
            
            return (
              <Box key={roomNo} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "#1976d2" }}>
                  Hall {roomNo} - {capacity} seats
                </Typography>
                
                {/* Column Headers */}
                <Box sx={{ display: "flex", mb: 0.5 }}>
                  <Box sx={{ width: 30 }} /> {/* Space for row numbers */}
                  {Array.from({ length: totalColumns }).map((_, colIdx) => (
                    <Box 
                      key={colIdx} 
                      sx={{ 
                        width: 85, 
                        textAlign: "center", 
                        fontWeight: "bold", 
                        color: "#666",
                        borderBottom: "2px solid #333"
                      }}
                    >
                      {String.fromCharCode(65 + colIdx)}
                    </Box>
                  ))}
                </Box>
                
                {/* Seat Grid - VERTICAL FILLING */}
                {/* Each row shows one seat from each column (going down) */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {Array.from({ length: seatsPerColumn }).map((_, rowIdx) => (
                    <Box key={rowIdx} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {/* Row Number */}
                      <Typography sx={{ width: 25, fontWeight: "bold", textAlign: "center", color: "#666" }}>
                        {rowIdx + 1}
                      </Typography>
                      
                      {/* Seats in this row - filled vertically */}
                      {Array.from({ length: totalColumns }).map((_, colIdx) => {
                        const seatIdx = getVerticalSeatIndex(colIdx, rowIdx);
                        const student = seatIdx < capacity ? roomStudents[seatIdx] : null;
                        
                        return (
                          <Box
                            key={colIdx}
                            sx={{
                              width: 80,
                              height: 50,
                              border: "2px solid #333",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: student ? "#c8e6c9" : "#ffcdd2",
                              fontSize: "10px",
                              padding: "2px"
                            }}
                            title={student ? `${student.register_no} - ${student.student_name}` : `Seat ${seatIdx + 1}`}
                          >
                            {student ? (
                              <>
                                <Typography sx={{ fontSize: "9px", fontWeight: "bold", lineHeight: 1.2, textAlign: "center" }}>
                                  {student.register_no}
                                </Typography>
                              </>
                            ) : seatIdx < capacity ? (
                              <Typography sx={{ fontSize: "10px", color: "#999" }}>
                                {seatIdx + 1}
                              </Typography>
                            ) : null}
                          </Box>
                        );
                      })}
                    </Box>
                  ))}
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: "block", ml: 3 }}>
                  Occupied: {occupied} | Available: {available}
                </Typography>
              </Box>
            );
          })}
          
          <Box sx={{ mt: 2, display: "flex", gap: 3, ml: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 20, height: 20, bgcolor: "#c8e6c9", border: "1px solid #333" }} />
              <Typography variant="body2">
                Occupied ({selectedHistoryEntry ? selectedHistoryEntry.seated.length : seating.length})
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 20, height: 20, bgcolor: "#ffcdd2", border: "1px solid #333" }} />
              <Typography variant="body2">
                Available ({getTotalCapacity() - (selectedHistoryEntry ? selectedHistoryEntry.seated.length : seating.length)})
              </Typography>
            </Box>
          </Box>

          {/* ================= CLASS/DEPARTMENT SUMMARY ================= */}
          {!selectedHistoryEntry && seating.length > 0 && (
            <Box sx={{ mt: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Summary:
              </Typography>
              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">Classes:</Typography>
                  {getClassesInSeating().map((item, idx) => (
                    <Typography key={idx} variant="body2">
                      {item.cls}: {item.count} students
                    </Typography>
                  ))}
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">Departments:</Typography>
                  {getDepartmentsInSeating().map((item, idx) => (
                    <Typography key={idx} variant="body2">
                      {item.dept}: {item.count} students
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= HISTORY DIALOG ================= */}
      <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Seating History
        </DialogTitle>
        <DialogContent>
          {seatingHistory.length === 0 ? (
            <Typography>No seating history found.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date/Time</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Rooms</TableCell>
                  <TableCell>Seated</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {seatingHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.timestamp}</TableCell>
                    <TableCell>{entry.classLabels}</TableCell>
                    <TableCell>{entry.departments.join(", ")}</TableCell>
                    <TableCell>{entry.rooms.join(", ")}</TableCell>
                    <TableCell>{entry.seated.length}</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        onClick={() => viewHistoryVisual(entry)}
                      >
                        View
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => loadFromHistory(entry)}
                      >
                        Load
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= OVERFLOW DIALOG ================= */}
      <Dialog open={showOverflow} onClose={() => setShowOverflow(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Remaining Students ({overflow.length})
        </DialogTitle>
        <DialogContent>
          {overflow.length === 0 ? (
            <Typography>All students are seated!</Typography>
          ) : (
            <>
              {/* Hall Selection and Place Button */}
              <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Select Hall</InputLabel>
                  <Select
                    value={selectedNewHall}
                    onChange={(e) => setSelectedNewHall(e.target.value)}
                    label="Select Hall"
                  >
                    {getAvailableRooms().map(r => (
                      <MenuItem key={r.id} value={r.room_no}>
                        {r.room_no} (Capacity: {r.capacity})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={placeStudentsInNewHall}
                  disabled={!selectedNewHall}
                >
                  Place Students
                </Button>
              </Box>

              {/* Remaining Students Table */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Remaining Students List:
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Register No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Semester</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {overflow.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell>{s.register_no}</TableCell>
                      <TableCell>{s.student_name}</TableCell>
                      <TableCell>{s.department_name}</TableCell>
                      <TableCell>{s.semester}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= WARNING ================= */}
      <Snackbar open={notify} autoHideDuration={5000} onClose={() => setNotify(false)}>
        <Alert severity="warning">
          ⚠ {overflow.length} students not allocated – click "Next" to view remaining students
        </Alert>
      </Snackbar>
    </>
  );
}


