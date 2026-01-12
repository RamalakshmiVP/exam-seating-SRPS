import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RoleCard({ title, subtitle, role }) {
  const navigate = useNavigate();

  const roleConfig = {
    admin: {
      color: "#8B0000",
      icon: "⚙️",
      path: "/admin-login"
    },
    staff: {
      color: "#F4A300",
      icon: "👨‍🏫",
      path: "/staff-login"
    },
    student: {
      color: "#0B6623",
      icon: "🎓",
      path: "/student-login"
    }
  };

  const { color, icon, path } = roleConfig[role];

  return (
    <Card
      onClick={() => navigate(path)}
      sx={{
        width: 300,
        height: 230,
        cursor: "pointer",
        borderRadius: 3,
        border: `2px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          boxShadow: `0 0 20px ${color}`,
          transform: "scale(1.05)"
        }
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Box sx={{ fontSize: 60 }}>{icon}</Box>
        <Typography variant="h5" fontWeight="bold" color={color}>
          {title}
        </Typography>
        <Typography>{subtitle}</Typography>
      </CardContent>
    </Card>
  );
}
