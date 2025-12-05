"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

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

import { signupAPI, loginAPI } from "@/lib/api";

export default function AuthScreen() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const { fetchUser } = useContext(AuthContext);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      setLoading(true);
      const res = tab === 0 ? await signupAPI(payload) : await loginAPI(payload);
      toast.success(res?.data?.message);

      await fetchUser();
      router.push("/chat");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      {/* Your same FULL UI BELOW */}
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          overflow: "hidden",
          bgcolor: {
            xs: "linear-gradient(135deg,#3B82F6 0%,#06B6D4 50%,#D946EF 100%)",
            md: "#ffffff",
          },
        }}
      >
        {/* LEFT SIDE HIDDEN ON MOBILE */}
        <Box
          sx={{
            flex: 1.15,
            position: "relative",
            display: { xs: "none", md: "flex" },
            background:
              "linear-gradient(135deg,#3B82F6 0%,#06B6D4 50%,#D946EF 100%)",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, md: 6 },
            clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
          }}
        >
          <Box sx={{ width: 360, height: 360, position: "relative" }}>
            <Image
              src="/auth-doctor.png"
              alt="Doctor"
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>

          <Typography
            sx={{
              position: "absolute",
              bottom: 18,
              left: 26,
              fontSize: 11,
              color: "rgba(226,239,255,0.8)",
            }}
          >
            © 2025 AI Health Assistant. All rights reserved.
          </Typography>
        </Box>

        {/* RIGHT FORM SIDE */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 3, md: 5 },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              maxWidth: 420,
              bgcolor: { xs: "rgba(255,255,255,0.92)", md: "#ffffff" },
              borderRadius: 5,
              p: { xs: 3, md: 4 },
              boxShadow: {
                xs: "0 3px 10px rgba(0,0,0,0.10)",
                md: "0 20px 60px rgba(0,0,0,0.22), 0 12px 28px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              centered
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  minWidth: 120,
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#8C9AB5",
                },
                "& .Mui-selected": { color: "#111827 !important" },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#2563EB",
                  height: 2,
                  borderRadius: 999,
                },
              }}
            >
              <Tab label="Sign Up" />
              <Tab label="Sign In" />
            </Tabs>

            {/* FORM FIELDS */}
            <Box sx={{ mt: 4 }}>
              {tab === 0 && (
                <>
                  <UnderlineInput label="Full Name" name="fullName" />
                  <UnderlineInput label="Email" type="email" name="email" />
                  <UnderlineInput
                    label="Password"
                    type="password"
                    name="password"
                  />
                  <BlueButton loading={loading}>Sign Up</BlueButton>
                  <Typography
                    sx={{
                      mt: 2,
                      textAlign: "center",
                      fontSize: 13,
                      color: "#2563EB",
                      cursor: "pointer",
                    }}
                    onClick={() => setTab(1)}
                  >
                    I have an Account ?
                  </Typography>
                </>
              )}

              {tab === 1 && (
                <>
                  <UnderlineInput label="Email" type="email" name="email" />
                  <UnderlineInput
                    label="Password"
                    type="password"
                    name="password"
                  />
                  <BlueButton loading={loading}>Sign In</BlueButton>
                  <Typography
                    sx={{
                      mt: 2,
                      textAlign: "center",
                      fontSize: 13,
                      color: "#2563EB",
                      cursor: "pointer",
                    }}
                    onClick={() => setTab(0)}
                  >
                    Don&apos;t have an Account ?
                  </Typography>
                </>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Button
              fullWidth
              sx={{
                textTransform: "none",
                borderRadius: 999,
                border: "1.5px solid #E5E7EB",
                color: "#374151",
                fontWeight: 600,
                fontSize: 14,
                py: 1.1,
                gap: 1.2,
                bgcolor: "#ffffff",
                transition: "all 0.25s ease-in-out",
                "&:hover": {
                  bgcolor: "#F3F4F6",
                  boxShadow: "0 3px 7px rgba(0,0,0,0.14)",
                },
                "& svg": { color: "#111827", fontSize: 18 },
              }}
            >
              <Google sx={{ fontSize: 20 }} />
              Continue with Google
            </Button>

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "center",
                gap: 2.2,
                color: "#4B5563",
              }}
            >
              <LinkedIn sx={{ fontSize: 20 }} />
              <Instagram sx={{ fontSize: 20 }} />
              <Twitter sx={{ fontSize: 20 }} />
              <Facebook sx={{ fontSize: 20 }} />
              <YouTube sx={{ fontSize: 20 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

/* REUSABLES */
const UnderlineInput = ({ label, name, type = "text" }) => (
  <TextField
    fullWidth
    label={label}
    name={name}
    type={type}
    variant="standard"
    required
    sx={{
      mb: 2.8,
      "& .MuiInputBase-input": {
        fontSize: 14,
        paddingY: 0.5,
        color: "#111827",
      },
      "& .MuiInputLabel-root": {
        fontSize: 13,
        color: "#4B5563 !important",
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#4B5563 !important",
      },
      "& .MuiInput-underline:before": { borderBottomColor: "#D1D5DB" },
      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottomColor: "#2563EB",
      },
      "& .MuiInput-underline.Mui-focused:after": {
        borderBottomColor: "#2563EB",
      },
    }}
  />
);

function BlueButton({ children, loading }) {
  return (
    <Button
      type="submit"
      fullWidth
      disabled={loading}
      sx={{
        mt: 1,
        borderRadius: 50,
        textTransform: "none",
        fontWeight: 600,
        fontSize: 14,
        py: 1.2,
        color: "#ffffff",
        bgcolor: loading ? "#93C5FD" : "#2563EB",
        "&:hover": { bgcolor: loading ? "#93C5FD" : "#1D4ED8" },
      }}
    >
      {loading ? "Please wait..." : children}
    </Button>
  );
}
