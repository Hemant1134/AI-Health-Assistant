"use client";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DynamicForm({ schema, onSubmit }) {
  const [form, setForm] = useState(() => {
    const defaults = {};
    schema.fields.forEach(f => defaults[f.name] = "");
    return defaults;
  });

  const change = (name, val) => setForm({ ...form, [name]: val });

  return (
    <Box component={motion.div}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      sx={{
        p: 2, mt: 1,
        bgcolor: "rgba(255,255,255,0.06)",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {schema.fields.map((f, i) =>
        f.type === "select" ? (
          <TextField key={i} select fullWidth size="small" sx={{ my: 1 }}
            label={f.label} value={form[f.name]}
            onChange={(e) => change(f.name, e.target.value)}>
            {f.options.map((op, idx) => <MenuItem key={idx} value={op}>{op}</MenuItem>)}
          </TextField>
        ) : (
          <TextField key={i} fullWidth size="small" sx={{ my: 1 }}
            label={f.label} type={f.type} value={form[f.name]}
            onChange={(e) => change(f.name, e.target.value)} />
        )
      )}

      <Button variant="contained" fullWidth onClick={() => onSubmit(form)} sx={{ mt: 1.5 }}>
        Submit
      </Button>
    </Box>
  );
}
