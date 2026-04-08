import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const DEFAULT_SLOTS = ["9:00 AM - 11:00 AM", "11:00 AM - 1:00 PM", "2:00 PM - 4:00 PM", "4:00 PM - 6:00 PM"];

function AddService() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [form, setForm] = useState({ title: "", description: "", category: user?.role || "plumber", price: "", location: "", timeSlots: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user || user.role === "customer") {
    navigate("/");
    return null;
  }

  const toggleSlot = (slot) => {
    setForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.includes(slot)
        ? prev.timeSlots.filter(s => s !== slot)
        : [...prev.timeSlots, slot]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/api/services", { ...form, price: Number(form.price) });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add service");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add New Service</h2>
        <p style={styles.sub}>List your service for customers to discover</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Service Title (e.g. Pipe Leak Repair)"
            required
            style={styles.input}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            style={{ ...styles.input, height: "90px", resize: "vertical" }}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            style={styles.input}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="plumber">Plumber</option>
            <option value="electrician">Electrician</option>
            <option value="tutor">Tutor</option>
            <option value="delivery">Delivery</option>
          </select>
          <input
            placeholder="Price per hour (₹)"
            type="number"
            required
            style={styles.input}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            placeholder="Location (e.g. Mumbai)"
            style={styles.input}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <div>
            <label style={styles.label}>Available Time Slots</label>
            <div style={styles.slotsGrid}>
              {DEFAULT_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  style={{ ...styles.slotBtn, ...(form.timeSlots.includes(slot) ? styles.slotActive : {}) }}
                  onClick={() => toggleSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Adding..." : "Add Service"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "calc(100vh - 128px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", background: "#f8fafc" },
  card: { background: "#fff", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "500px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
  title: { fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" },
  sub: { color: "#64748b", fontSize: "15px", marginBottom: "28px" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  input: { padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "15px", outline: "none", width: "100%" },
  label: { fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" },
  slotsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" },
  slotBtn: { padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#fff", fontSize: "13px", cursor: "pointer", color: "#475569" },
  slotActive: { background: "#eff6ff", border: "1px solid #3b82f6", color: "#1d4ed8", fontWeight: "600" },
  error: { color: "#ef4444", fontSize: "14px" },
  submitBtn: { padding: "13px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600" }
};

export default AddService;
