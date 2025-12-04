"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Google,
} from "@mui/icons-material";

export default function AuthScreen({ onAuthenticated }) {
  const [tab, setTab] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthenticated?.();
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#EAF3FF", // light blue bg
      }}
    >
      {/* LEFT IMAGE SECTION */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          px: 4,
        }}
      >
        <Box
          sx={{
            width: 500,
            height: 500,
            borderRadius: "30px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 10px 40px rgba(0,0,0,0.08)",
            bgcolor: "white",
          }}
        >
          <Image
            src="/auth-doctor.png"
            alt="Doctor Illustration"
            width={520}
            height={520}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      </Box>

      {/* RIGHT FORM SCREEN */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: 380,
            bgcolor: "#ffffff",
            borderRadius: 6,
            p: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            centered
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: 16,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#2F62F0",
                height: 3,
                borderRadius: "2px",
              },
            }}
          >
            <Tab label="Sign Up" />
            <Tab label="Sign In" />
          </Tabs>

          <Box sx={{ mt: 4 }}>
            {/* SIGN UP */}
            {tab === 0 && (
              <>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="standard"
                  sx={{ mb: 3 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="standard"
                  sx={{ mb: 3 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="standard"
                  sx={{ mb: 4 }}
                  required
                />
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    bgcolor: "#2F62F0",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#254cd1" },
                  }}
                >
                  Sign Up
                </Button>

                <Typography textAlign="center" sx={{ mt: 2, fontSize: 14 }}>
                  Already have an account?{" "}
                  <span
                    style={{
                      color: "#2F62F0",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={() => setTab(1)}
                  >
                    Login
                  </span>
                </Typography>
              </>
            )}

            {/* SIGN IN  */}
            {tab === 1 && (
              <>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="standard"
                  sx={{ mb: 3 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="standard"
                  sx={{ mb: 4 }}
                  required
                />
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    bgcolor: "#2F62F0",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#254cd1" },
                  }}
                >
                  Login
                </Button>

                <Typography textAlign="center" sx={{ mt: 2, fontSize: 14 }}>
                  New here?{" "}
                  <span
                    style={{
                      color: "#2F62F0",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={() => setTab(0)}
                  >
                    Create Account
                  </span>
                </Typography>
              </>
            )}
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 3 }} />

          {/* Google Login Button */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{
              textTransform: "none",
              py: 1,
              borderRadius: 2,
              borderColor: "#c9c9c9",
              "&:hover": { borderColor: "#999" },
            }}
          >
            Continue with Google
          </Button>

          {/* Social Icons */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              gap: 2,
              color: "#666",
            }}
          >
            <LinkedIn />
            <Instagram />
            <Twitter />
            <Facebook />
            <YouTube />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
