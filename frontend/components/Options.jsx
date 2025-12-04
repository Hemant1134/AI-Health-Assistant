"use client";
import { Box, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function Options({ options, onSelect }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
      {options.map((opt, i) => (
        <Button key={i}
          component={motion.button}
          whileTap={{ scale: 0.92 }}
          variant="outlined"
          onClick={() => onSelect(opt)}
          sx={{
            borderColor: "primary.main",
            color: "white",
            textTransform: "none",
            fontSize: 13,
            px: 1.6,
            py: 0.6,
            borderRadius: 2,
            "&:hover": { bgcolor: "primary.main" }
          }}
        >
          {opt}
        </Button>
      ))}
    </Box>
  );
}
