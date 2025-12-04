"use client";

import {
  Box,
  Drawer,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Chip,
  Backdrop,
} from "@mui/material";

export default function HistoryDrawer({ open, onClose, history }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {/* Dim background for overlay effect */}
      <Backdrop
        open={open}
        onClick={onClose}
        sx={{
          zIndex: 1200,
          bgcolor: "rgba(0,0,0,0.4)",
        }}
      />

      <Drawer
        anchor={isMobile ? "bottom" : "left"}
        open={open}
        onClose={onClose}
        hideBackdrop
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 380,
            maxHeight: isMobile ? "82vh" : "100vh",
            bgcolor: "rgba(2,6,23,0.95)",
            backdropFilter: "blur(14px)",
            color: "#e5e7eb",
            boxShadow:
              "0px 0px 30px rgba(0,0,0,0.6), 0px 0px 50px rgba(15,23,42,0.5)",
            borderRight: "1px solid rgba(148,163,184,0.3)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            🕒 Visit history
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Previous checkups and appointment suggestions
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "rgba(148,163,184,0.3)" }} />

        <Box sx={{ p: 2, pt: 1, overflowY: "auto", maxHeight: "100%" }}>
          {(!history || history.length === 0) && (
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              No previous records yet. Your next completed checkup will appear
              here.
            </Typography>
          )}

          {history?.map((item, idx) => (
            <Box
              key={item.id || idx}
              sx={{
                position: "relative",
                pl: 2,
                mb: 2.5,
                borderLeft: "2px solid rgba(148,163,184,0.5)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: -6,
                  top: 8,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor:
                    item.riskLevel === "moderate"
                      ? "#fbbf24"
                      : item.riskLevel === "high"
                      ? "#f97316"
                      : "#22c55e",
                }}
              />

              <Typography variant="subtitle2" fontWeight={600}>
                {item.personal?.name} • {item.personal?.age} yrs
              </Typography>

              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {new Date(item.createdAt).toLocaleString()}
              </Typography>

              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {item.summary}
              </Typography>

              <Box sx={{ mt: 0.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {item.riskLevel && (
                  <Chip
                    size="small"
                    label={`Risk: ${item.riskLevel.toUpperCase()}`}
                    color={
                      item.riskLevel === "moderate"
                        ? "warning"
                        : item.riskLevel === "high"
                        ? "error"
                        : "success"
                    }
                  />
                )}
                {item.appointment?.department && (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={item.appointment.department}
                    sx={{
                      borderColor: "rgba(148,163,184,0.5)",
                      color: "#e5e7eb",
                    }}
                  />
                )}
              </Box>

              {item.appointment && (
                <Typography
                  variant="caption"
                  sx={{ mt: 0.5, display: "block", opacity: 0.8 }}
                >
                  ⏰ {item.appointment.date} at {item.appointment.time} •{" "}
                  {item.appointment.status}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Drawer>
    </>
  );
}
