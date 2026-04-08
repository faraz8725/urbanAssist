import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const ROLES = ["customer", "plumber", "electrician", "tutor", "delivery"];

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer", phone: "", location: "", skills: "", price: "", bio: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isProvider = form.role !== "customer";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, skills: form.skills ? form.skills.split(",").map(s => s.trim()) : [], price: form.price ? Number(form.price) : undefined };
      const res = await API.post("/api/auth/signup", payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
    setLoading(false);
  };

  const f = (field) => ({ value: form[field], onChange: (e) => setForm({ ...form, [field]: e.target.value }) });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.sub}>Join UrbanAssist today</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.roleRow}>
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                style={{ ...styles.roleBtn, ...(form.role === r ? styles.roleActive : {}) }}
                onClick={() => setForm({ ...form, role: r })}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <input placeholder="Full Name" required style={styles.input} {...f("name")} />
          <input placeholder="Email" type="email" required style={styles.input} {...f("email")} />
          <input placeholder="Password" type="password" required style={styles.input} {...f("password")} />
          <input placeholder="Phone Number" style={styles.input} {...f("phone")} />
          <input placeholder="Location (e.g. Mumbai)" style={styles.input} {...f("location")} />

          {isProvider && (
            <>
              <input placeholder="Skills (comma separated, e.g. pipe fixing, wiring)" style={styles.input} {...f("skills")} />
              <input placeholder="Price per hour (₹)" type="number" style={styles.input} {...f("price")} />
              <textarea placeholder="Bio / About yourself" style={{ ...styles.input, height: "80px", resize: "vertical" }} {...f("bio")} />
            </>
          )}

          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <span style={styles.switchLink} onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "calc(100vh - 128px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", background: "#f8fafc" },
  card: { background: "#fff", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "480px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
  title: { fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" },
  sub: { color: "#64748b", fontSize: "15px", marginBottom: "28px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  roleRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "4px" },
  roleBtn: { padding: "6px 14px", border: "1px solid #e2e8f0", borderRadius: "20px", background: "#fff", fontSize: "13px", cursor: "pointer", color: "#475569" },
  roleActive: { background: "#3b82f6", color: "#fff", border: "1px solid #3b82f6" },
  input: { padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "15px", outline: "none", width: "100%" },
  error: { color: "#ef4444", fontSize: "14px" },
  submitBtn: { padding: "13px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", marginTop: "4px" },
  switchText: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#64748b" },
  switchLink: { color: "#3b82f6", cursor: "pointer", fontWeight: "600" }
};

export default Signup;
