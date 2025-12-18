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
      const response = await fetch("https://soap-notes-api.onrender.com/soap-notes", {
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
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>SOAP Notes Entry</h2>
      <form onSubmit={handleSubmit}>
        <label>Subjective</label>
        <textarea value={subjective} onChange={e => setSubjective(e.target.value)} />

        <label>Objective</label>
        <textarea value={objective} onChange={e => setObjective(e.target.value)} />

        <label>Assessment</label>
        <textarea value={assessment} onChange={e => setAssessment(e.target.value)} />

        <label>Plan</label>
        <textarea value={plan} onChange={e => setPlan(e.target.value)} />

        <label>Billing Amount ($)</label>
        <input
          type="number"
          value={billingAmount}
          onChange={e => setBillingAmount(e.target.value)}
        />

        <br /><br />
        <button type="submit">Save SOAP Note</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default App;
