// backend/server.js
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// ✅ CORS Configuration
// =======================
// Allow multiple origins (React, Vite, etc.) or use a single FRONTEND_URL in production
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL, // e.g., https://yourdomain.com in production
].filter(Boolean); // remove undefined if FRONTEND_URL is not set

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// =======================
// ✅ Middleware
// =======================
app.use(express.json());

// =======================
// ✅ Nodemailer Setup
// =======================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter once on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Nodemailer transporter verification failed:", error);
  } else {
    console.log("✅ Nodemailer transporter ready to send messages");
  }
});

// =======================
// ✅ Email Sending Route
// =======================
app.post("/api/send-emails", async (req, res) => {
  const emailsToSend = req.body;

  if (
    !emailsToSend ||
    !Array.isArray(emailsToSend) ||
    emailsToSend.length === 0
  ) {
    return res.status(400).json({ message: "No emails provided to send." });
  }

  const results = [];

  for (const email of emailsToSend) {
    const { to, subject, body } = email;

    if (!to || !subject || !body) {
      results.push({ status: "error", to, message: "Missing fields." });
      continue;
    }

    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html: body,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${to}: ${info.messageId}`);
      results.push({ status: "success", to, messageId: info.messageId });
    } catch (error) {
      let errorMessage = "Unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
      }

      console.error(`❌ Failed to send email to ${to}:`, error);
      results.push({ status: "error", to, message: errorMessage });
    }
  }

  const failedEmails = results.filter((r) => r.status === "error");
  if (failedEmails.length > 0) {
    return res.status(500).json({
      message: "Some emails failed to send.",
      failures: failedEmails,
      results,
    });
  }

  return res.status(200).json({
    message: "All emails sent successfully!",
    results,
  });
});

// =======================
// ✅ Start Server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Backend server listening on port ${PORT}`);
});
