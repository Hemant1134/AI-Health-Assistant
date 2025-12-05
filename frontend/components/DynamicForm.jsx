"use client";

import { Box, Button, TextField, MenuItem } from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DynamicForm({ schema, onSubmit }) {
  const defaults = {};
  schema.fields?.forEach((f) => (defaults[f.name] = ""));

  const [form, setForm] = useState(defaults);

  const handleSubmit = () => onSubmit(form);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box
      component={motion.div}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      sx={{
        p: 2,
        mt: 2,
        borderRadius: 3,
        bgcolor: "#ffffff",
        border: "1px solid #dbeafe",
      }}
    >
      {schema.fields?.map((f) =>
        f.type === "select" ? (
          <TextField
            key={f.name}
            select
            fullWidth
            label={f.label}
            size="small"
            variant="outlined"
            sx={{ mb: 1.5 }}
            value={form[f.name] || ""}
            onChange={(e) => handleChange(f.name, e.target.value)}
          >
            {f.options?.map((op) => (
              <MenuItem key={op} value={op}>{op}</MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            key={f.name}
            fullWidth
            label={f.label}
            size="small"
            variant="outlined"
            type={f.type === "number" ? "number" : "text"}
            sx={{ mb: 1.5 }}
            value={form[f.name] || ""}
            onChange={(e) => handleChange(f.name, e.target.value)}
          />
        )
      )}

      <Button fullWidth variant="contained" sx={{ textTransform: "none", bgcolor: "#2563EB" }} onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}
