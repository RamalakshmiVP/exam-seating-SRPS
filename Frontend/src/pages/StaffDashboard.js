import { Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function StaffDashboard() {
  const location = useLocation();
  const name = location.state?.name;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" color="#F4A300">
        Welcome {name}
      </Typography>
    </Box>
  );
}