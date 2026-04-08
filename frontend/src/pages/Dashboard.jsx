import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", color: "#854d0e" },
  confirmed: { bg: "#dbeafe", color: "#1d4ed8" },
  completed: { bg: "#dcfce7", color: "#166534" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" }
};

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate("/login");
    const endpoint = user.role === "customer" ? "/api/bookings/my" : "/api/bookings/provider";
    API.get(endpoint).then((res) => {
      setBookings(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/api/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch {}
  };

  if (!user) return null;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Dashboard</h1>
          <p style={styles.sub}>Welcome back, {user.name} · <span style={styles.role}>{user.role}</span></p>
        </div>
        {user.role !== "customer" && (
          <button style={styles.addBtn} onClick={() => navigate("/add-service")}>+ Add Service</button>
        )}
      </div>

      <h2 style={styles.sectionTitle}>
        {user.role === "customer" ? "My Bookings" : "Bookings Received"}
      </h2>

      {loading ? (
        <div style={styles.center}>Loading...</div>
      ) : bookings.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: "48px" }}>📋</div>
          <p>No bookings yet.</p>
          {user.role === "customer" && (
            <button style={styles.browseBtn} onClick={() => navigate("/services")}>Browse Services</button>
          )}
        </div>
      ) : (
        <div style={styles.grid}>
          {bookings.map((b) => {
            const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
            return (
              <div key={b._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <div style={styles.serviceName}>{b.service?.title}</div>
                    <div style={styles.category}>{b.service?.category}</div>
                  </div>
                  <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>{b.status}</span>
                </div>
                <div style={styles.details}>
                  <div>📅 {b.date}</div>
                  <div>🕐 {b.timeSlot}</div>
                  <div>💰 ₹{b.service?.price}</div>
                  {user.role === "customer" ? (
                    <div>👤 {b.provider?.name}</div>
                  ) : (
                    <div>👤 {b.customer?.name}</div>
                  )}
                </div>
                {b.note && <p style={styles.note}>📝 {b.note}</p>}
                {user.role !== "customer" && b.status === "pending" && (
                  <div style={styles.actions}>
                    <button style={styles.confirmBtn} onClick={() => updateStatus(b._id, "confirmed")}>Confirm</button>
                    <button style={styles.cancelBtn} onClick={() => updateStatus(b._id, "cancelled")}>Cancel</button>
                  </div>
                )}
                {user.role !== "customer" && b.status === "confirmed" && (
                  <button style={styles.completeBtn} onClick={() => updateStatus(b._id, "completed")}>Mark Complete</button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "32px", maxWidth: "1100px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" },
  title: { fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" },
  sub: { color: "#64748b", fontSize: "15px" },
  role: { textTransform: "capitalize", color: "#3b82f6", fontWeight: "600" },
  addBtn: { padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600" },
  sectionTitle: { fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" },
  card: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #f1f5f9" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" },
  serviceName: { fontWeight: "700", fontSize: "16px", color: "#0f172a", marginBottom: "2px" },
  category: { fontSize: "13px", color: "#64748b", textTransform: "capitalize" },
  statusBadge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize" },
  details: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "13px", color: "#475569", marginBottom: "12px" },
  note: { fontSize: "13px", color: "#64748b", background: "#f8fafc", padding: "8px", borderRadius: "6px", marginBottom: "12px" },
  actions: { display: "flex", gap: "8px" },
  confirmBtn: { flex: 1, padding: "8px", background: "#dcfce7", color: "#166534", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600" },
  cancelBtn: { flex: 1, padding: "8px", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600" },
  completeBtn: { width: "100%", padding: "8px", background: "#dbeafe", color: "#1d4ed8", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600" },
  center: { textAlign: "center", padding: "60px", color: "#64748b" },
  empty: { textAlign: "center", padding: "60px", color: "#64748b" },
  browseBtn: { marginTop: "16px", padding: "10px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600" }
};

export default Dashboard;
