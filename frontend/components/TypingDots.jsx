"use client";

import { Box } from "@mui/material";
import { motion } from "framer-motion";

export default function TypingDots() {
  return (
    <Box sx={{ display: "flex", gap: 0.5, pl: 1, mb: 1, mt: 1 }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.8)",
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
        />
      ))}
    </Box>
  );
}
