import { Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function StudentDashboard() {
  const { state } = useLocation();

  return (
    <Box sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h4">
        Welcome {state?.name}
      </Typography>
    </Box>
  );
}
