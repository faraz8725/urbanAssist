import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.sub}>Login to your UrbanAssist account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Email"
            type="email"
            required
            style={styles.input}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            required
            style={styles.input}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{" "}
          <span style={styles.switchLink} onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "calc(100vh - 128px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", background: "#f8fafc" },
  card: { background: "#fff", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
  title: { fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" },
  sub: { color: "#64748b", fontSize: "15px", marginBottom: "28px" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  input: { padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "15px", outline: "none" },
  error: { color: "#ef4444", fontSize: "14px" },
  submitBtn: { padding: "13px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600" },
  switchText: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#64748b" },
  switchLink: { color: "#3b82f6", cursor: "pointer", fontWeight: "600" }
};

export default Login;
