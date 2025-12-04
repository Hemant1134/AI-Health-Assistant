"use client";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import Link from "next/link";

export default function Login() {
  return (
    <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#0f172a" }}>
      <Box
        sx={{
          width: 380,
          bgcolor: "rgba(15,23,42,0.94)",
          borderRadius: 3,
          p: 4,
          boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight={700}>
          Welcome Back 👋
        </Typography>
        <Typography textAlign="center" sx={{ opacity: 0.7, mb: 3 }}>
          Login to continue
        </Typography>

        <TextField fullWidth label="Email" variant="filled" sx={{ mb: 2, bgcolor: "#1e293b", borderRadius: 1 }} />
        <TextField fullWidth label="Password" type="password" variant="filled" sx={{ mb: 3, bgcolor: "#1e293b", borderRadius: 1 }} />

        <Button fullWidth variant="contained" sx={{ bgcolor: "#14b8a6", height: 44, fontWeight: 600 }}>
          LOGIN
        </Button>

        <Divider sx={{ my: 3, opacity: 0.3 }}>OR</Divider>

        <Button
          fullWidth
          variant="outlined"
          sx={{ height: 44, borderColor: "#14b8a6", color: "#14b8a6" }}
          onClick={() => (window.location.href = "http://localhost:5002/auth/google")}
        >
          CONTINUE WITH GOOGLE
        </Button>

        <Typography textAlign="center" sx={{ mt: 2, opacity: 0.8 }}>
          Don’t have an account?{" "}
          <Link href="/signup" style={{ color: "#14b8a6", fontWeight: 600 }}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
