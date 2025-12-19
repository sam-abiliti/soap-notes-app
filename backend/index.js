const { Pool } = require("pg");
const cors = require("cors");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS must come before routes
app.use(cors({
  origin: "https://soap-notes-app.vercel.app"
}));
app.options("*", cors());
app.use(express.json());

const pool = new Pool({
  connectionString: "postgresql://soap_notes_db_user:IT6opTYVSYGwbjevirP34XjrfgKvcTSb@dpg-d51vspffte5s73aebv00-a.virginia-postgres.render.com/soap_notes_db",
  ssl: { rejectUnauthorized: false }
});

// Test route
app.get("/", (req, res) => res.send("SOAP Notes API is running"));

// POST /soap-notes
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

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/soap-notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM soap_notes");
    res.json(result.rows);
  } catch (error) {
    console.error("DB ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
