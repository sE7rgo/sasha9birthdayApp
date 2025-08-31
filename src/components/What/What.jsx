import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import './What.scss';

const What = () => (
  <Paper elevation={4} className="what-paper">
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Sasha’s birthday wish is simple: cold hard cash 💵 or prepaid cards 🎁.
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Why? Because all roads lead to a Nintendo Switch 🎮 (and no, socks won’t do this year 😅).
      </Typography>
    </Box>
  </Paper>
);

export default What;
