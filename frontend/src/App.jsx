import { useState } from "react";

function App() {
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  const [billingAmount, setBillingAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://soap-notes-app.onrender.com/soap-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjective,
          objective,
          assessment,
          plan,
          billingAmount: Number(billingAmount)
        })
      });

      if (response.ok) {
        setMessage("SOAP note saved successfully");
        setSubjective("");
        setObjective("");
        setAssessment("");
        setPlan("");
        setBillingAmount("");
      } else {
        const errData = await response.json();
        setMessage("Error saving SOAP note: " + (errData.error || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      setMessage("Network or server error. Check backend URL and CORS.");
    }
  };

return (
  <div style={{
    maxWidth: "700px",
    margin: "40px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif"
  }}>
    <h2 style={{ marginBottom: "20px" }}>SOAP Notes Entry</h2>

    <form onSubmit={handleSubmit}>
      {[
        ["Subjective", subjective, setSubjective],
        ["Objective", objective, setObjective],
        ["Assessment", assessment, setAssessment],
        ["Plan", plan, setPlan]
      ].map(([label, value, setter]) => (
        <div key={label} style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold" }}>{label}</label>
          <textarea
            value={value}
            onChange={e => setter(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              marginTop: "6px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
        </div>
      ))}

      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "bold" }}>Billing Amount ($)</label>
        <input
          type="number"
          value={billingAmount}
          onChange={e => setBillingAmount(e.target.value)}
          style={{
            width: "100%",
            marginTop: "6px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: "#2563eb",
          color: "#fff",
          padding: "10px 16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Save SOAP Note
      </button>
    </form>

    {message && (
      <p style={{ marginTop: "20px", fontWeight: "bold" }}>
        {message}
      </p>
    )}
  </div>
);
}

export default App;
