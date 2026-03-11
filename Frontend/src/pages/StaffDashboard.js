import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

export default function StaffDashboard() {
  const navigate = useNavigate();
  
  // Get staff name from localStorage for session persistence
  const staffName = localStorage.getItem("staffName");

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("staffName");
    localStorage.removeItem("staffUsername");
    localStorage.removeItem("isStaffLoggedIn");
    navigate("/staff-login");
  };

  // If not logged in, redirect to login page
  if (!staffName) {
    navigate("/staff-login");
    return null;
  }

  return (
    <>
      <Header />
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" color="#F4A300">
            Welcome {staffName}
          </Typography>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: "#F4A300", ":hover": { backgroundColor: "#d18c00" } }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </>
  );
}

