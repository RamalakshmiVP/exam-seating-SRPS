// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Dialog
// } from "@mui/material";
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/header";

// export default function StaffLogin() {
//   const navigate = useNavigate();

//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");

//   const [open, setOpen] = useState(false);
//   const [oldPass, setOldPass] = useState("");
//   const [newPass, setNewPass] = useState("");
//   const [confirmPass, setConfirmPass] = useState("");

//   // ---------------- STAFF LOGIN ----------------
//   const handleLogin = async () => {
//     try {
//       const res = await axios.post(
//         "http://127.0.0.1:5000/api/login/staff",
//         { phone, password }
//       );

//       if (res.data.status === "success") {
//         navigate("/staff-dashboard", {
//           state: {name: res.data.name }
//         });
//       }
//     } catch {
//       alert("Invalid credentials");
//     }
//   };

//   // ---------------- CHANGE PASSWORD ----------------
//   const handleUpdatePassword = async () => {
//     if (newPass !== confirmPass) {
//       alert("Passwords do not match");
//       return;
//     }

//     try {
//       await axios.post(
//         "http://127.0.0.1:5000/api/change-password/staff",
//         {
//           phone,
//           old_password: oldPass,
//           new_password: newPass
//         }
//       );

//       alert("Password Updated Successfully");
//       setOpen(false);
//       setOldPass("");
//       setNewPass("");
//       setConfirmPass("");
//     } catch {
//       alert("Old password incorrect");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "80vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center"
//       }}
//     >
//       <Box
//         sx={{
//           width: 380,
//           p: 4,
//           borderRadius: 3,
//           boxShadow: "0px 0px 25px rgba(244,163,0,0.4)"
//         }}
//       >
//         <Typography
//           variant="h5"
//           textAlign="center"
//           mb={3}
//           sx={{ color: "#F4A300", fontWeight: "bold" }}
//         >
//           STAFF LOGIN
//         </Typography>

//         <TextField
//           fullWidth
//           label="Phone Number"
//           margin="normal"
//           onChange={(e) => setPhone(e.target.value)}
//         />

//         <TextField
//           fullWidth
//           label="Password"
//           type="password"
//           margin="normal"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <Button
//           fullWidth
//           sx={{
//             mt: 2,
//             backgroundColor: "#F4A300",
//             ":hover": { backgroundColor: "#d18c00" }
//           }}
//           variant="contained"
//           onClick={handleLogin}
//         >
//           Login
//         </Button>

//         <Typography
//           mt={2}
//           textAlign="right"
//           sx={{
//             cursor: "pointer",
//             color: "#F4A300",
//             fontSize: 14
//           }}
//           onClick={() => setOpen(true)}
//         >
//           Change Password?
//         </Typography>
//       </Box>

//       {/* ---------------- CHANGE PASSWORD DIALOG ---------------- */}
//       <Dialog open={open} onClose={() => setOpen(false)}>
//         <Box sx={{ p: 3, width: 350 }}>
//           <Typography
//             variant="h6"
//             mb={2}
//             sx={{ color: "#F4A300", fontWeight: "bold" }}
//           >
//             Change Password
//           </Typography>

//           <TextField
//             fullWidth
//             label="Old Password"
//             type="password"
//             margin="dense"
//             onChange={(e) => setOldPass(e.target.value)}
//           />

//           <TextField
//             fullWidth
//             label="New Password"
//             type="password"
//             margin="dense"
//             onChange={(e) => setNewPass(e.target.value)}
//           />

//           <TextField
//             fullWidth
//             label="Confirm Password"
//             type="password"
//             margin="dense"
//             onChange={(e) => setConfirmPass(e.target.value)}
//           />

//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               mt: 2
//             }}
//           >
//             <Button onClick={() => setOpen(false)}>Cancel</Button>
//             <Button
//               variant="contained"
//               sx={{ backgroundColor: "#F4A300" }}
//               onClick={handleUpdatePassword}
//             >
//               Update
//             </Button>
//           </Box>
//         </Box>
//       </Dialog>
//     </Box>
//   );
// }
