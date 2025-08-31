import "./Where.scss";
import whereImg from "../../assets/images/where.png";
import React, { useState, useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Where = () => {
  return (
    <div className="where">
      <Card className="where-card">
        <CardMedia
          component="img"
          image={whereImg}
          title="Where image"
          className="where-image"
        />

        <CardContent>
          <Typography variant="h4" gutterBottom className="where-title">
            🎈 You’re Invited! 🎈
          </Typography>
          <Typography variant="h6" gutterBottom className="where-desc">
            Come celebrate a Vertical Birthday Adventure!
          </Typography>
          <Typography
            sx={{ color: "text.secondary" }}
            variant="body2"
            gutterBottom
            className="where-desc"
          >
            📅 Date: Saturday, September 6<br />
            ⏰ Time: 11:00 AM
            <br />
            📍 Location: Climb Base 5 – Coquitlam
            <br />
            98 Brigatine Drive, Coquitlam, BC V3K 6Z6
            <br />
            ☎️ 604-526-2402 | 🌐 climbbase5.com
          </Typography>
          <Typography variant="h6" gutterBottom className="where-desc">
            🧗 What to Expect
          </Typography>
          <Typography
            sx={{ color: "text.secondary" }}
            variant="body1"
            gutterBottom
            className="where-desc"
          >
            An exciting climbing party with professional staff (4:1 ratio)
            <br />
            All safety equipment provided (climbing shoes not included — tight
            running shoes recommended)
          </Typography>
          <Typography variant="h6" gutterBottom className="where-desc">
            ✅ Important Notes
          </Typography>
          <Typography
            sx={{ color: "text.secondary" }}
            variant="body1"
            gutterBottom
            className="where-desc"
          >
            To make your visit speedy and smooth:
            <br />
            All participants & spectators must complete a waiver online before
            arrival.
            <br />
            Kids 18 & under must have their waiver completed by a parent or
            legal guardian.
            <br />
            👉 Complete waivers here:{" "}
            <a
              href="https://climbbase5.com/climb/waivers"
              target="_blank"
              rel="noopener noreferrer"
            >
              climbbase5.com/climb/waivers
            </a>
          </Typography>
          <Typography variant="h6" gutterBottom className="where-desc">
            🎉 Get ready for fun, laughter, and climbing high!
            <br />
            We can’t wait to celebrate with you.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Where;
