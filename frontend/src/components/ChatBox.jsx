"use client";
import React, { useState } from "react";
import { Paper, Box, Typography, TextField, Button, MenuItem } from "@mui/material";

export default function DynamicForm({ formSchema = { title: "", fields: [] }, onSubmit }) {
  const [formData, setFormData] = useState({});
  const change = (k, v) => setFormData(prev => ({ ...prev, [k]: v }));

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{formSchema.title}</Typography>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
        {formSchema.fields.map(f => (
          <Box key={f.name}>
            {f.type === "select" ? (
              <TextField select fullWidth label={f.label} value={formData[f.name] || ""} onChange={(e) => change(f.name, e.target.value)}>
                {(f.options || []).map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
            ) : (
              <TextField fullWidth label={f.label} value={formData[f.name] || ""} onChange={(e) => change(f.name, e.target.value)} />
            )}
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="contained" onClick={() => onSubmit(formData)}>Submit</Button>
      </Box>
    </Paper>
  );
}
