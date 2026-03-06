import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Students", path: "/admin/students" },
    { label: "Staff", path: "/admin/staff" },
    { label: "Rooms", path: "/admin/rooms" },
    { label: "Timetable", path: "/admin/timetable" },
    { label: "Seating", path: "/admin/seating" }
  ];

  return (
    <Box
      sx={{
        width: 240,
        minHeight: "100vh",
        backgroundColor: "#880000",
        p: 2
      }}
    >
      <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                border: "2px solid white",
                borderRadius: 2,
                color: "white",
                textAlign: "center",
                backgroundColor: active ? "rgba(255,255,255,0.2)" : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                  transform: "scale(1.03)"
                },
                transition: "all 0.2s ease"
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  textAlign: "center"
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
