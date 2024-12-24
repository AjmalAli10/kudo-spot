import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

function Login() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError("");
    setLoading(true);

    try {
      await login(name.trim());
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Login failed"
      );
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Welcome to KudoSpot
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Enter your name"
              name="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!error}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!name.trim() || loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
