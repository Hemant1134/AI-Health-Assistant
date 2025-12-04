"use client";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#0f172a",
        color: "#fff",
      }}
    >
      {/* ---- LEFT IMAGE PANEL ---- */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "linear-gradient(135deg, #2b6cb0, #4fd1c5)",
          p: 4,
        }}
      >
        <Image
          src="/doctor.png" // 📌 put file in public folder
          alt="Doctor"
          width={420}
          height={500}
          style={{ borderRadius: "20px" }}
        />
      </Box>

      {/* ---- RIGHT FORM PANEL ---- */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 380,
            bgcolor: "rgba(15,23,42,0.94)",
            borderRadius: 3,
            p: 4,
            boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography variant="h5" fontWeight={700} textAlign="center">
            Create Account 🚀
          </Typography>
          <Typography textAlign="center" sx={{ opacity: 0.7, mb: 3 }}>
            Sign up to start
          </Typography>

          <TextField fullWidth label="Full Name" variant="filled" sx={{ mb: 2, bgcolor: "#1e293b", borderRadius: 1 }} />
          <TextField fullWidth label="Email" variant="filled" sx={{ mb: 2, bgcolor: "#1e293b", borderRadius: 1 }} />
          <TextField fullWidth label="Password" type="password" variant="filled" sx={{ mb: 3, bgcolor: "#1e293b", borderRadius: 1 }} />

          <Button fullWidth variant="contained" sx={{ bgcolor: "#14b8a6", height: 44, fontWeight: 600 }}>
            SIGN UP
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
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#14b8a6", fontWeight: 600 }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
