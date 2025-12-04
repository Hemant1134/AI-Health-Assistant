"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "../app/globals.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#22c55e" },
    background: { default: "#0f172a", paper: "#0b141a" },
  },
  typography: { fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif" },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
