import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", color: "#854d0e" },
  confirmed: { bg: "#dbeafe", color: "#1d4ed8" },
  completed: { bg: "#dcfce7", color: "#166534" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" }
};

const DEFAULT_SLOTS = ["9:00 AM - 11:00 AM", "11:00 AM - 1:00 PM", "2:00 PM - 4:00 PM", "4:00 PM - 6:00 PM"];

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSvc, setEditSvc] = useState(null); // service being edited

  useEffect(() => {
    if (!user) return navigate("/login");
    const endpoint = user.role === "customer" ? "/api/bookings/my" : "/api/bookings/provider";
    const calls = [API.get(endpoint)];
    if (user.role !== "customer") calls.push(API.get(`/api/services/providers/${user._id}`));
    Promise.all(calls).then(([bRes, sRes]) => {
      setBookings(bRes.data);
      if (sRes) setServices(sRes.data.services || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/api/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch {}
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await API.delete(`/api/services/${id}`);
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete");
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/api/services/${editSvc._id}`, editSvc);
      setServices(services.map(s => s._id === editSvc._id ? res.data : s));
      setEditSvc(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update");
    }
  };

  const toggleSlot = (slot) => {
    const slots = editSvc.timeSlots || [];
    setEditSvc({ ...editSvc, timeSlots: slots.includes(slot) ? slots.filter(s => s !== slot) : [...slots, slot] });
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

      {/* Provider Services Section */}
      {user.role !== "customer" && (
        <>
          <h2 style={styles.sectionTitle}>My Services</h2>
          {services.length === 0 ? (
            <p style={{ color: "#64748b", marginBottom: "32px" }}>No services yet.</p>
          ) : (
            <div style={{ ...styles.grid, marginBottom: "40px" }}>
              {services.map(svc => (
                <div key={svc._id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div>
                      <div style={styles.serviceName}>{svc.title}</div>
                      <div style={styles.category}>{svc.category}</div>
                    </div>
                    <div style={styles.svcPrice}>₹{svc.price}</div>
                  </div>
                  <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px" }}>{svc.description}</p>
                  <div style={styles.actions}>
                    <button style={styles.editBtn} onClick={() => setEditSvc({ ...svc })}>✏️ Edit</button>
                    <button style={styles.cancelBtn} onClick={() => deleteService(svc._id)}>🗑 Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

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

      {/* Edit Service Modal */}
      {editSvc && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ marginBottom: "16px", color: "#0f172a" }}>Edit Service</h3>
            <form onSubmit={saveEdit} style={styles.form}>
              <input style={styles.input} value={editSvc.title} onChange={e => setEditSvc({ ...editSvc, title: e.target.value })} placeholder="Title" required />
              <textarea style={{ ...styles.input, height: "70px", resize: "vertical" }} value={editSvc.description} onChange={e => setEditSvc({ ...editSvc, description: e.target.value })} placeholder="Description" />
              <input style={styles.input} type="number" value={editSvc.price} onChange={e => setEditSvc({ ...editSvc, price: Number(e.target.value) })} placeholder="Price" required />
              <input style={styles.input} value={editSvc.location || ""} onChange={e => setEditSvc({ ...editSvc, location: e.target.value })} placeholder="Location" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {DEFAULT_SLOTS.map(slot => (
                  <button key={slot} type="button"
                    style={{ ...styles.slotBtn, ...((editSvc.timeSlots || []).includes(slot) ? styles.slotActive : {}) }}
                    onClick={() => toggleSlot(slot)}>{slot}</button>
                ))}
              </div>
              <div style={styles.actions}>
                <button type="submit" style={styles.confirmBtn}>Save</button>
                <button type="button" style={styles.cancelBtn} onClick={() => setEditSvc(null)}>Cancel</button>
              </div>
            </form>
          </div>
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
  addBtn: { padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  sectionTitle: { fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" },
  card: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #f1f5f9" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" },
  serviceName: { fontWeight: "700", fontSize: "16px", color: "#0f172a", marginBottom: "2px" },
  category: { fontSize: "13px", color: "#64748b", textTransform: "capitalize" },
  svcPrice: { fontSize: "16px", fontWeight: "700", color: "#0f172a" },
  statusBadge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize" },
  details: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "13px", color: "#475569", marginBottom: "12px" },
  note: { fontSize: "13px", color: "#64748b", background: "#f8fafc", padding: "8px", borderRadius: "6px", marginBottom: "12px" },
  actions: { display: "flex", gap: "8px" },
  confirmBtn: { flex: 1, padding: "8px", background: "#dcfce7", color: "#166534", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  editBtn: { flex: 1, padding: "8px", background: "#eff6ff", color: "#1d4ed8", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  cancelBtn: { flex: 1, padding: "8px", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  completeBtn: { width: "100%", padding: "8px", background: "#dbeafe", color: "#1d4ed8", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  center: { textAlign: "center", padding: "60px", color: "#64748b" },
  empty: { textAlign: "center", padding: "60px", color: "#64748b" },
  browseBtn: { marginTop: "16px", padding: "10px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "460px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none", width: "100%" },
  slotBtn: { padding: "8px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#fff", fontSize: "12px", cursor: "pointer", color: "#475569" },
  slotActive: { background: "#eff6ff", border: "1px solid #3b82f6", color: "#1d4ed8", fontWeight: "600" }
};

export default Dashboard;
