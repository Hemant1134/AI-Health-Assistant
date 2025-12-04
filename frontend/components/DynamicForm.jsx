"use client";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DynamicForm({ schema, onSubmit }) {
  const defaultValues = {};
  schema.fields.forEach(f => defaultValues[f.name] = "");

  const [form, setForm] = useState(defaultValues);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const submitForm = () => {
    onSubmit(form);
  };

  return (
    <Box component={motion.div}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      sx={{
        p: 2,
        mt: 1,
        bgcolor: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {schema.fields?.map((f, i) => (
        f.type === "select" ? (
          <TextField
            key={i}
            select
            fullWidth
            variant="outlined"
            size="small"
            label={f.label}
            sx={{ my: 1 }}
            value={form[f.name] || ""}
            onChange={(e) => handleChange(f.name, e.target.value)}
          >
            {f.options?.map((op, j) => (
              <MenuItem key={j} value={op}>{op}</MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            key={i}
            fullWidth
            variant="outlined"
            size="small"
            label={f.label}
            type={f.type}
            sx={{ my: 1 }}
            value={form[f.name] || ""}
            onChange={(e) => handleChange(f.name, e.target.value)}
          />
        )
      ))}

      <Button
        variant="contained"
        fullWidth
        onClick={submitForm}
        sx={{ mt: 1.5 }}
      >
        Submit
      </Button>
    </Box>
  );
}
