const { Pool } = require("pg");
const cors = require("cors");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to read JSON - CORS Must Come First
app.use(cors({
  origin: "https://soap-notes-app.vercel.app/"
}));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Temp Storage
let soapNotes = [];
let currentId = 1;

// Test route
app.get("/", (req, res) => {
  res.send("SOAP Notes API is running");
});

//Post SOAP Note
app.post("/soap-notes", async (req, res) => {
  const { subjective, objective, assessment, plan, billingAmount } = req.body;

  if (!subjective || !objective || !assessment || !plan || billingAmount == null) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO soap_notes
       (subjective, objective, assessment, plan, billing_amount)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [subjective, objective, assessment, plan, billingAmount]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Get SOAP Notes - This Must Exist
app.get("/soap-notes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM soap_notes ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Start server - This Must be Last
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
