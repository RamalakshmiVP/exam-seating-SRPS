import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import Header from "../components/header";

export default function StudentLogin() {
  const [regNo, setRegNo] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/login/student", {
        reg_no: regNo,
        dob: dob
      });

      if (res.data.status === "success") {
        // Store student data in localStorage for session persistence
        localStorage.setItem("studentName", res.data.name);
        localStorage.setItem("studentDept", res.data.dept);
        localStorage.setItem("studentSem", res.data.sem);
        localStorage.setItem("studentGender", res.data.gender);
        localStorage.setItem("isStudentLoggedIn", "true");
        
        navigate("/student-dashboard");
      }
    } catch {
      alert("Invalid Credentials");
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Box
          sx={{
            width: 380,
            p: 4,
            borderRadius: 3,
            boxShadow: "0px 0px 25px rgba(244,163,0,0.4)"
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            mb={3}
            sx={{ color: "#F4A300", fontWeight: "bold" }}
          >
            STUDENT LOGIN
          </Typography>

          <TextField
            fullWidth
            label="Register Number"
            margin="normal"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
          />

          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />

          <Button
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#F4A300",
              ":hover": { backgroundColor: "#d18c00" }
            }}
            variant="contained"
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </Box>
    </>
  );
}

