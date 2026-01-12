import { Box, Typography } from "@mui/material";
import RoleCard from "../components/RoleCard";
import Header from "../components/header";

export default function Home() {
  return (
    <><Header />
    <Box
      sx={{
       height: "calc(100vh - 200px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: 6
      }}
    >
      {/* Heading */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 5,
          color: "#1976d2",
          textAlign: "center"
        }}
      >
        AI BASED EXAM SEATING ARRANGEMENT APP
      </Typography>

      {/* Cards */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          justifyContent: "center",
          mt: 3
        }}
      >
        <RoleCard
          role="admin"
          title="Admin"
          subtitle="Manage Exams & Seating"
        />

        <RoleCard
          role="staff"
          title="Staff"
          subtitle="Invigilation & Reports"
        />

        <RoleCard
          role="student"
          title="Student"
          subtitle="View Hall Ticket & Seat"
        />
        
      </Box>
    </Box>
    </>
  );
}
