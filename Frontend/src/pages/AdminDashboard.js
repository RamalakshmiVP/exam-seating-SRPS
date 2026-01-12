import { Box, Typography } from "@mui/material";
import Header from "../components/header";
import AdminSidebar from "../components/sidebar";

export default function AdminDashboard() {
  return (
    <>
      <Header />

      <Box sx={{ display: "flex" }}>
        <AdminSidebar />

        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" fontWeight="bold">
          <center>Welcome Admin</center> 
          </Typography>

        </Box>
      </Box>
    </>
  );
}
