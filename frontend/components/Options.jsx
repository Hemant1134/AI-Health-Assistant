"use client";

import { Box, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function Options({ options, onSelect }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
      {options.map((opt, i) => (
        <Button
          key={i}
          component={motion.button}
          whileTap={{ scale: 0.92 }}
          variant="outlined"
          onClick={() => onSelect(opt)}
          sx={{
            borderColor: "#00A884",
            color: "#e9edef",
            textTransform: "none",
            fontSize: 13,
            px: 1.6,
            py: 0.4,
            borderRadius: 2,
            "&:hover": {
              bgcolor: "rgba(0,168,132,0.12)",
            },
          }}
        >
          {opt}
        </Button>
      ))}
    </Box>
  );
}
