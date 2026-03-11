import { Typography, Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

export default function StudentDashboard() {
  const navigate = useNavigate();
  
  // Get student data from localStorage for session persistence
  const studentName = localStorage.getItem("studentName");
  const studentDept = localStorage.getItem("studentDept");
  const studentSem = localStorage.getItem("studentSem");
  const studentGender = localStorage.getItem("studentGender");

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentDept");
    localStorage.removeItem("studentSem");
    localStorage.removeItem("studentGender");
    localStorage.removeItem("isStudentLoggedIn");
    navigate("/student-login");
  };

  // If not logged in, redirect to login page
  if (!studentName) {
    navigate("/student-login");
    return null;
  }

  return (
    <>
      <Header />
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" color="#F4A300">
            Welcome {studentName}
          </Typography>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: "#F4A300", ":hover": { backgroundColor: "#d18c00" } }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
              <Typography variant="h6" color="#F4A300" gutterBottom>
                Student Details
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {studentName}
              </Typography>
              <Typography variant="body1">
                <strong>Gender:</strong> {studentGender}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
              <Typography variant="h6" color="#F4A300" gutterBottom>
                Academic Details
              </Typography>
              <Typography variant="body1">
                <strong>Class/Department:</strong> {studentDept}
              </Typography>
              <Typography variant="body1">
                <strong>Semester:</strong> {studentSem}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

