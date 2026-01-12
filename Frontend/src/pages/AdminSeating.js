// import { useState } from "react";
// import {
//   Box, Typography, Button,
//   Table, TableHead, TableRow,
//   TableCell, TableBody, Paper,
//   FormControl, InputLabel, Select, MenuItem
// } from "@mui/material";

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// import studentsData from "../data/students";
// import roomsData from "../data/rooms";
// import staffData from "../data/staff";

// import Header from "../components/header";
// import AdminSidebar from "../components/sidebar";
// import ClassroomDialog from "../components/ClassroomDialog";
// import{Snackbar,Alert} from "@mui/material";

// const arranged = generateMixedSeating(filtered, capacity);

// const unallocated = filtered.slice(arranged.length);

// setSeating(arranged);
// setOverflow(unallocated);

// if (unallocated.length > 0) {
//   setNotify(true);
// }

// /* ================= MIXED SEATING ================= */
// function generateMixedSeating(students, capacity) {
//   const deptMap = {};
//   students.forEach(s => {
//     if (!deptMap[s.dept]) deptMap[s.dept] = [];
//     deptMap[s.dept].push(s);
//   });

//   const depts = Object.keys(deptMap);
//   const seated = [];

//   while (seated.length < capacity) {
//     for (let d of depts) {
//       if (deptMap[d].length && seated.length < capacity) {
//         seated.push(deptMap[d].shift());
//       }
//     }
//     if (depts.every(d => deptMap[d].length === 0)) break;
//   }

//   const remaining = [];
//   depts.forEach(d => {
//     remaining.push(...deptMap[d]);
//   });

//   return { seated, remaining };
// }


// /* ================= AUTO ROOM ALLOCATION ================= */
// function allocateStudentsToRooms(students, rooms) {
//   const result = {}; // { A1: [], B2: [] }
//   let remaining = [...students];

//   rooms.forEach(room => {
//     result[room.room_no] = [];
//     for (let i = 0; i < room.capacity; i++) {
//       if (remaining.length === 0) break;
//       result[room.room_no].push(remaining.shift());
//     }
//   });

//   return {
//     roomWiseSeating: result,
//     unallocatedStudents: remaining
//   };
// }

// /* ================= DEPT SUMMARY ================= */
// const getDeptSummary = (students) => {
//   const map = {};
//   students.forEach(s => {
//     map[s.dept] = (map[s.dept] || 0) + 1;
//   });
//   return map;
// };

// export default function AdminSeating() {

//   const [depts, setDepts] = useState([]);
//   const [room, setRoom] = useState("");
//   const [staff, setStaff] = useState("");
//   const [seating, setSeating] = useState([]);
//   const [overflow, setOverflow] = useState([]);
//   const [openView, setOpenView] = useState(false);
//   const [roomWise, setRoomWise] = useState({});
//   const [currentRoom, setCurrentRoom] = useState("");

//   const departments = [...new Set(studentsData.map(s => s.dept))];

//   const capacity = room
//     ? roomsData.find(r => r.room_no === room)?.capacity || 20
//     : 20;

//   /* ================= GENERATE ================= */
//  const generateSeating = () => {
//   if (depts.length === 0 || !staff) {
//     alert("Select Department(s) & Invigilator");
//     return;
//   }

//   // 1️⃣ Filter students
//   const filtered = studentsData.filter(s => depts.includes(s.dept));

//   // 2️⃣ Allocate students to rooms
//   const { roomWiseSeating, unallocatedStudents } =
//     allocateStudentsToRooms(filtered, roomsData);

//   // 3️⃣ Set room-wise data
//   setRoomWise(roomWiseSeating);

//   // 4️⃣ Default first room view
//   const firstRoom = Object.keys(roomWiseSeating)[0];
//   setCurrentRoom(firstRoom);
//   setSeating(roomWiseSeating[firstRoom] || []);

//   // 5️⃣ AFTER GENERATION show warning
//   if (unallocatedStudents.length > 0) {
//     setTimeout(() => {
//       alert(
//         `⚠ Warning: ${unallocatedStudents.length} students not allocated due to room capacity`
//       );
//     }, 300);
//   }
// };


//   /* ================= EXPORT PDF ================= */
//   const exportPDF = () => {
//     const doc = new jsPDF();
//     const overflowSummary = getDeptSummary(overflow);

//     doc.setFontSize(14);
//     doc.text("Exam Seating Arrangement", 14, 15);

//     doc.setFontSize(10);
//     doc.text(`Room : ${room}`, 14, 25);
//     doc.text(`Invigilator : ${staff}`, 14, 31);
//     doc.text(`Departments : ${depts.join(", ")}`, 14, 37);
//     doc.text(`Capacity : ${capacity}`, 14, 43);
//     doc.text(`Occupied : ${seating.length}`, 14, 49);
//     doc.text(`Not Seated : ${overflow.length}`, 14, 55);

//     let y = 61;
//     Object.entries(overflowSummary).forEach(([dept, count]) => {
//       doc.text(`${dept} : ${count}`, 18, y);
//       y += 6;
//     });

//     autoTable(doc, {
//       startY: y + 5,
//       head: [["Reg No", "Name", "Department"]],
//       body: seating.map(s => [
//         s.register_no,
//         s.student_name,
//         s.dept
//       ])
//     });

//     doc.save("seating-arrangement.pdf");
//   };

//   return (
//     <>
//       <Header />

//       <Box sx={{ display: "flex" }}>
//         <AdminSidebar />

//         <Box sx={{ p: 3, flexGrow: 1 }}>
//           <Typography variant="h6" mb={2}>
//             Seating Arrangement
//           </Typography>

//           {/* ================= CONTROLS ================= */}
//           <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>

//             <FormControl sx={{ minWidth: 220 }} size="small">
//               <InputLabel>Select Department(s)</InputLabel>
//               <Select
//                 multiple
//                 value={depts}
//                 label="Select Department(s)"
//                 onChange={(e) => setDepts(e.target.value)}
//               >
//                 {departments.map(d => (
//                   <MenuItem key={d} value={d}>{d}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl sx={{ minWidth: 160 }} size="small">
//               <InputLabel>Select Room</InputLabel>
//               <Select
//                 value={room}
//                 label="Select Room"
//                 onChange={(e) => setRoom(e.target.value)}
//               >
//                 {roomsData.map(r => (
//                   <MenuItem key={r.room_no} value={r.room_no}>
//                     {r.room_no}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl sx={{ minWidth: 200 }} size="small">
//               <InputLabel>Select Invigilator</InputLabel>
//               <Select
//                 value={staff}
//                 label="Select Invigilator"
//                 onChange={(e) => setStaff(e.target.value)}
//               >
//                 {staffData.map(s => (
//                   <MenuItem key={s.id} value={s.name}>
//                     {s.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <Button variant="outlined" onClick={() => setOpenView(true)}>
//               VISUALS 👁
//             </Button>

//             <Button variant="contained" onClick={generateSeating}>
//               Generate
//             </Button>

//             {Object.keys(roomWise).length > 0 && (
//   <FormControl sx={{ minWidth: 160 }} size="small">
//     <InputLabel>View Room</InputLabel>
//     <Select
//       value={currentRoom}
//       label="View Room"
//       onChange={(e) => {
//         setCurrentRoom(e.target.value);
//         setSeating(roomWise[e.target.value]);
//       }}
//     >
//       {Object.keys(roomWise).map(r => (
//         <MenuItem key={r} value={r}>
//           {r}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormControl>
// )}


//             {seating.length > 0 && (
//               <Button variant="outlined" color="success" onClick={exportPDF}>
//                 Export PDF
//               </Button>
//             )}
//           </Box>

//           {/* ================= WARNING ================= */}
//           {overflow.length > 0 && (
//             <Box sx={{
//               mb: 2,
//               p: 2,
//               border: "1px solid #f44336",
//               bgcolor: "#ffebee",
//               borderRadius: 1
//             }}>
//               <Typography fontWeight={600} color="error">
//                 ⚠ Capacity Exceeded
//               </Typography>

//               {Object.entries(getDeptSummary(overflow)).map(
//                 ([dept, count]) => (
//                   <Typography key={dept} fontSize={13}>
//                     • {dept} : {count} student(s)
//                   </Typography>
//                 )
//               )}
//             </Box>
//           )}

//           {/* ================= TABLE ================= */}
//           {seating.length > 0 && (
//             <Paper>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Reg No</TableCell>
//                     <TableCell>Name</TableCell>
//                     <TableCell>Department</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {seating.map(s => (
//                     <TableRow key={s.id}>
//                       <TableCell>{s.register_no}</TableCell>
//                       <TableCell>{s.student_name}</TableCell>
//                       <TableCell>{s.dept}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Paper>
//           )}
//         </Box>
//       </Box>

//       <ClassroomDialog
//   open={openView}
//   onClose={() => setOpenView(false)}
//   seating={seating}
//   capacity={
//     roomsData.find(r => r.room_no === currentRoom)?.capacity || 20
//   }
//   room={currentRoom}
//   staff={staff}

  
// />

// <Snackbar
//   open={notify}
//   autoHideDuration={6000}
//   onClose={() => setNotify(false)}
// >
//   <Alert
//     onClose={() => setNotify(false)}
//     severity="warning"
//     sx={{ width: "100%" }}
//   >
//     ⚠️ {overflow.length} students not allocated.
//     Please assign another room (ex: B1).
//   </Alert>
// </Snackbar>

//     </>
//   );
// }

import { useState } from "react";
import {
  Box, Typography, Button,
  Table, TableHead, TableRow,
  TableCell, TableBody, Paper,
  FormControl, InputLabel, Select, MenuItem,
  Snackbar, Alert
} from "@mui/material";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import studentsData from "../data/students";
import roomsData from "../data/rooms";
import staffData from "../data/staff";

import Header from "../components/header";
import AdminSidebar from "../components/sidebar";
import ClassroomDialog from "../components/ClassroomDialog";

/* ================= AUTO ROOM ALLOCATION ================= */
function allocateStudentsToRooms(students, rooms) {
  const result = {};
  let remaining = [...students];

  rooms.forEach(room => {
    result[room.room_no] = [];
    for (let i = 0; i < room.capacity; i++) {
      if (remaining.length === 0) break;
      result[room.room_no].push(remaining.shift());
    }
  });

  return {
    roomWiseSeating: result,
    unallocatedStudents: remaining
  };
}

/* ================= DEPT SUMMARY ================= */
const getDeptSummary = (students) => {
  const map = {};
  students.forEach(s => {
    map[s.dept] = (map[s.dept] || 0) + 1;
  });
  return map;
};

export default function AdminSeating() {

  const [depts, setDepts] = useState([]);
  const [room, setRoom] = useState("");
  const [staff, setStaff] = useState("");
  const [seating, setSeating] = useState([]);
  const [overflow, setOverflow] = useState([]);
  const [roomWise, setRoomWise] = useState({});
  const [currentRoom, setCurrentRoom] = useState("");
  const [openView, setOpenView] = useState(false);
  const [notify, setNotify] = useState(false);

  const departments = [...new Set(studentsData.map(s => s.dept))];

  /* ================= GENERATE ================= */
  const generateSeating = () => {
    if (depts.length === 0 || !staff) {
      alert("Select Department(s) & Invigilator");
      return;
    }

    const filtered = studentsData.filter(s =>
      depts.includes(s.dept)
    );

    const { roomWiseSeating, unallocatedStudents } =
      allocateStudentsToRooms(filtered, roomsData);

    setRoomWise(roomWiseSeating);

    const firstRoom = Object.keys(roomWiseSeating)[0];
    setCurrentRoom(firstRoom);
    setSeating(roomWiseSeating[firstRoom] || []);

    setOverflow(unallocatedStudents);

    if (unallocatedStudents.length > 0) {
      setNotify(true); // 🔔 snackbar trigger
    }
  };

  /* ================= EXPORT PDF ================= */
  const exportPDF = () => {
    const doc = new jsPDF();
    const overflowSummary = getDeptSummary(overflow);

    doc.setFontSize(14);
    doc.text("Exam Seating Arrangement", 14, 15);

    doc.setFontSize(10);
    doc.text(`Room : ${currentRoom}`, 14, 25);
    doc.text(`Invigilator : ${staff}`, 14, 31);
    doc.text(`Departments : ${depts.join(", ")}`, 14, 37);
    doc.text(`Seated : ${seating.length}`, 14, 43);
    doc.text(`Not Seated : ${overflow.length}`, 14, 49);

    let y = 55;
    Object.entries(overflowSummary).forEach(([dept, count]) => {
      doc.text(`${dept} : ${count}`, 18, y);
      y += 6;
    });

    autoTable(doc, {
      startY: y + 5,
      head: [["Reg No", "Name", "Department"]],
      body: seating.map(s => [
        s.register_no,
        s.student_name,
        s.dept
      ])
    });

    doc.save("seating-arrangement.pdf");
  };

  return (
    <>
      <Header />

      <Box sx={{ display: "flex" }}>
        <AdminSidebar />

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Typography variant="h6" mb={2}>
            Seating Arrangement
          </Typography>

          {/* ================= CONTROLS ================= */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>

            <FormControl sx={{ minWidth: 220 }} size="small">
              <InputLabel>Select Department(s)</InputLabel>
              <Select
                multiple
                value={depts}
                label="Select Department(s)"
                onChange={(e) => setDepts(e.target.value)}
              >
                {departments.map(d => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Select Invigilator</InputLabel>
              <Select
                value={staff}
                label="Select Invigilator"
                onChange={(e) => setStaff(e.target.value)}
              >
                {staffData.map(s => (
                  <MenuItem key={s.id} value={s.name}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" onClick={generateSeating}>
              Generate
            </Button>

            <Button variant="outlined" onClick={() => setOpenView(true)}>
              VISUALS 👁
            </Button>

            {Object.keys(roomWise).length > 0 && (
              <FormControl sx={{ minWidth: 160 }} size="small">
                <InputLabel>View Room</InputLabel>
                <Select
                  value={currentRoom}
                  label="View Room"
                  onChange={(e) => {
                    setCurrentRoom(e.target.value);
                    setSeating(roomWise[e.target.value]);
                  }}
                >
                  {Object.keys(roomWise).map(r => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {seating.length > 0 && (
              <Button variant="outlined" color="success" onClick={exportPDF}>
                Export PDF
              </Button>
            )}
          </Box>

          {/* ================= WARNING BOX ================= */}
          {overflow.length > 0 && (
            <Box sx={{
              mb: 2,
              p: 2,
              border: "1px solid #f44336",
              bgcolor: "#ffebee",
              borderRadius: 1
            }}>
              <Typography fontWeight={600} color="error">
                ⚠ Capacity Exceeded
              </Typography>

              {Object.entries(getDeptSummary(overflow)).map(
                ([dept, count]) => (
                  <Typography key={dept} fontSize={13}>
                    • {dept} : {count} student(s)
                  </Typography>
                )
              )}
            </Box>
          )}

          {/* ================= TABLE ================= */}
          {seating.length > 0 && (
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reg No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Department</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seating.map(s => (
                    <TableRow key={s.id}>
                      <TableCell>{s.register_no}</TableCell>
                      <TableCell>{s.student_name}</TableCell>
                      <TableCell>{s.dept}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>
      </Box>

      {/* ================= CLASSROOM VISUAL ================= */}
      <ClassroomDialog
        open={openView}
        onClose={() => setOpenView(false)}
        seating={seating}
        capacity={
          roomsData.find(r => r.room_no === currentRoom)?.capacity || 20
        }
        room={currentRoom}
        staff={staff}
      />

      {/* ================= SNACKBAR ================= */}
      <Snackbar
        open={notify}
        autoHideDuration={6000}
        onClose={() => setNotify(false)}
      >
        <Alert
          onClose={() => setNotify(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          ⚠️ {overflow.length} students not allocated.
          Please assign another room (ex: B1).
        </Alert>
      </Snackbar>
    </>
  );
}
