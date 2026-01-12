import { Box, Button, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

export default function Login() {
  const { role } = useParams();

  return (
    <Box sx={{ width: 300, mx: "auto", mt: 8 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {role.toUpperCase()} LOGIN
      </Typography>

      {role === "student" && (
        <>
          <TextField label="Register Number" fullWidth margin="normal" />
          <TextField type="date" fullWidth margin="normal" />
        </>
      )}

      {role !== "student" && (
        <>
          <TextField label="Username / Phone" fullWidth margin="normal" />
          <TextField type="password" label="Password" fullWidth margin="normal" />
        </>
      )}

      <Button variant="contained" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
}
