"use client";

import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function GoogleButton() {
  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<GoogleIcon />}
      href="http://localhost:5002/auth/google"
    >
      Continue with Google
    </Button>
  );
}
