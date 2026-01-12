import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Header from "../components/header";
export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);   // 👈 error state
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setError(false);
    setErrorMsg("");

    try {
      const res = await 
      axios.post("http://127.0.0.1:5000/api/login/admin", {
        username,
        password
      });

      if (res.data.status === "success") {
        navigate("/admin/dashboard");
      } else {
        setError(true);
        setErrorMsg("Invalid username or password");
      }
    } catch (err) {
      setError(true);
      setErrorMsg("Invalid username or password");
    }
  };

  return (
    <><Header/>
    <Box
      sx={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Box
        sx={{
          width: 360,
          p: 4,
          borderRadius: "16px",
          boxShadow: "0px 8px 30px rgba(0,0,0,0.15)",
          backgroundColor: "#fff"
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          mb={3}
          fontWeight="bold"
          sx={{ color: "#8B0000" }}
        >
          Admin Login
        </Typography>

        {/* ERROR MESSAGE */}
        {error && (
          <Typography
            sx={{
              mb: 2,
              color: "#8B0000",
              backgroundColor: "rgba(139,0,0,0.08)",
              p: 1,
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: 500
            }}
          >
            {errorMsg}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          error={error}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: error ? "#8B0000" : ""
              },
              "&:hover fieldset": {
                borderColor: error ? "#8B0000" : "#1976d2"
              }
            }
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          error={error}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: error ? "#8B0000" : ""
              },
              "&:hover fieldset": {
                borderColor: error ? "#8B0000" : "#1976d2"
              }
            }
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            background: "linear-gradient(90deg, #8B0000, #B22222)",
            fontWeight: "bold",
            borderRadius: "10px",
            py: 1,
            "&:hover": {
              background: "linear-gradient(90deg, #7A0000, #9B1C1C)"
            }
          }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Box>
    </>
  );
}
