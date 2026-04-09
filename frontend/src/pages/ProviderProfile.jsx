import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ serviceId: "", date: "", timeSlot: "", note: "" });
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [bookingMsg, setBookingMsg] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    Promise.all([
      API.get(`/api/services/providers/${id}`),
      API.get(`/api/reviews/${id}`)
    ]).then(([provRes, revRes]) => {
      setData(provRes.data);
      setReviews(revRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await API.delete(`/api/reviews/${reviewId}`);
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete");
    }
  };

  const handleChat = async () => {
    if (!user) return navigate("/login");
    navigate(`/chat/${id}`);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    try {
      await API.post("/api/bookings", booking);
      setBookingMsg("✅ Booking confirmed!");
      setBooking({ serviceId: "", date: "", timeSlot: "", note: "" });
    } catch (err) {
      setBookingMsg("❌ " + (err.response?.data?.error || "Booking failed"));
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    try {
      await API.post("/api/reviews", { providerId: id, ...review });
      setReviewMsg("✅ Review submitted!");
      const res = await API.get(`/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      setReviewMsg("❌ " + (err.response?.data?.error || "Failed"));
    }
  };

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (!data) return <div style={styles.center}>Provider not found.</div>;

  const { provider, services } = data;

  return (
    <div style={styles.page}>
      {/* Profile Header */}
      <div style={styles.profileCard}>
        <div style={styles.avatar}>{provider.name.charAt(0).toUpperCase()}</div>
        <div style={styles.profileInfo}>
          <h1 style={styles.name}>{provider.name}</h1>
          <div style={styles.roleBadge}>{provider.role}</div>
          <div style={styles.metaRow}>
            <span>📍 {provider.location || "Location not set"}</span>
            <span>📞 {provider.phone || "N/A"}</span>
            <span>⭐ {provider.rating || 0} ({provider.totalReviews || 0} reviews)</span>
          </div>
          {provider.bio && <p style={styles.bio}>{provider.bio}</p>}
          {provider.skills?.length > 0 && (
            <div style={styles.skills}>
              {provider.skills.map((s, i) => <span key={i} style={styles.skill}>{s}</span>)}
            </div>
          )}
        </div>
        {provider.price && <div style={styles.priceTag}>₹{provider.price}/hr</div>}
        {user && user._id !== id && (
          <button style={styles.chatBtn} onClick={handleChat}>💬 Chat</button>
        )}
      </div>

      <div style={styles.twoCol}>
        {/* Left: Services + Booking */}
        <div style={styles.left}>
          <h2 style={styles.sectionTitle}>Services Offered</h2>
          {services.length === 0 ? (
            <p style={{ color: "#64748b" }}>No services listed yet.</p>
          ) : (
            services.map((svc) => (
              <div key={svc._id} style={styles.serviceItem}>
                <div>
                  <div style={styles.svcTitle}>{svc.title}</div>
                  <div style={styles.svcDesc}>{svc.description}</div>
                  {svc.timeSlots?.length > 0 && (
                    <div style={styles.slots}>
                      {svc.timeSlots.map((t, i) => <span key={i} style={styles.slot}>{t}</span>)}
                    </div>
                  )}
                </div>
                <div style={styles.svcPrice}>₹{svc.price}</div>
              </div>
            ))
          )}

          {/* Booking Form */}
          {user?.role === "customer" && services.length > 0 && (
            <div style={styles.bookingBox}>
              <h3 style={styles.sectionTitle}>Book a Service</h3>
              <form onSubmit={handleBook} style={styles.form}>
                <select
                  required
                  value={booking.serviceId}
                  onChange={(e) => setBooking({ ...booking, serviceId: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Select a service</option>
                  {services.map((s) => <option key={s._id} value={s._id}>{s.title} — ₹{s.price}</option>)}
                </select>
                <input
                  type="date"
                  required
                  value={booking.date}
                  onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                  style={styles.input}
                  min={new Date().toISOString().split("T")[0]}
                />
                <select
                  required
                  value={booking.timeSlot}
                  onChange={(e) => setBooking({ ...booking, timeSlot: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Select time slot</option>
                  {booking.serviceId && services.find(s => s._id === booking.serviceId)?.timeSlots?.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                  {(!booking.serviceId || !services.find(s => s._id === booking.serviceId)?.timeSlots?.length) && (
                    <>
                      <option>9:00 AM - 11:00 AM</option>
                      <option>11:00 AM - 1:00 PM</option>
                      <option>2:00 PM - 4:00 PM</option>
                      <option>4:00 PM - 6:00 PM</option>
                    </>
                  )}
                </select>
                <textarea
                  placeholder="Additional notes (optional)"
                  value={booking.note}
                  onChange={(e) => setBooking({ ...booking, note: e.target.value })}
                  style={{ ...styles.input, height: "80px", resize: "vertical" }}
                />
                <button type="submit" style={styles.submitBtn}>Confirm Booking</button>
                {bookingMsg && <p style={styles.msg}>{bookingMsg}</p>}
              </form>
            </div>
          )}
        </div>

        {/* Right: Reviews */}
        <div style={styles.right}>
          <h2 style={styles.sectionTitle}>Reviews ({reviews.length})</h2>

          {user?.role === "customer" && (
            <div style={styles.reviewForm}>
              <h4 style={{ marginBottom: "12px", color: "#0f172a" }}>Leave a Review</h4>
              <form onSubmit={handleReview} style={styles.form}>
                <div style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      style={{ fontSize: "24px", cursor: "pointer", color: n <= review.rating ? "#f59e0b" : "#e2e8f0" }}
                      onClick={() => setReview({ ...review, rating: n })}
                    >★</span>
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience..."
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  style={{ ...styles.input, height: "80px", resize: "vertical" }}
                />
                <button type="submit" style={styles.submitBtn}>Submit Review</button>
                {reviewMsg && <p style={styles.msg}>{reviewMsg}</p>}
              </form>
            </div>
          )}

          {reviews.length === 0 ? (
            <p style={{ color: "#64748b", marginTop: "16px" }}>No reviews yet. Be the first!</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <span style={styles.reviewerName}>{r.reviewer?.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={styles.reviewStars}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    {(user?._id === r.reviewer?._id || user?._id === id) && (
                      <button onClick={() => handleDeleteReview(r._id)} style={styles.delBtn}>🗑</button>
                    )}
                  </div>
                </div>
                <p style={styles.reviewComment}>{r.comment}</p>
                <span style={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "32px", maxWidth: "1100px", margin: "0 auto" },
  center: { textAlign: "center", padding: "80px", color: "#64748b" },
  profileCard: { display: "flex", gap: "24px", background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: "32px", alignItems: "flex-start", flexWrap: "wrap" },
  avatar: { width: "80px", height: "80px", background: "#3b82f6", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "700", flexShrink: 0 },
  profileInfo: { flex: 1 },
  name: { fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" },
  roleBadge: { display: "inline-block", padding: "3px 12px", background: "#dbeafe", color: "#1d4ed8", borderRadius: "20px", fontSize: "13px", fontWeight: "600", textTransform: "capitalize", marginBottom: "10px" },
  metaRow: { display: "flex", gap: "16px", fontSize: "14px", color: "#64748b", flexWrap: "wrap", marginBottom: "10px" },
  bio: { fontSize: "14px", color: "#475569", lineHeight: "1.6", marginBottom: "10px" },
  skills: { display: "flex", gap: "8px", flexWrap: "wrap" },
  skill: { padding: "4px 12px", background: "#f1f5f9", borderRadius: "20px", fontSize: "13px", color: "#475569" },
  priceTag: { fontSize: "24px", fontWeight: "800", color: "#0f172a", background: "#f0fdf4", padding: "12px 20px", borderRadius: "10px", alignSelf: "center" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" },
  left: {},
  right: {},
  sectionTitle: { fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" },
  serviceItem: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "#fff", borderRadius: "10px", padding: "16px", marginBottom: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" },
  svcTitle: { fontWeight: "600", fontSize: "15px", color: "#0f172a", marginBottom: "4px" },
  svcDesc: { fontSize: "13px", color: "#64748b", marginBottom: "8px" },
  slots: { display: "flex", gap: "6px", flexWrap: "wrap" },
  slot: { padding: "3px 10px", background: "#eff6ff", color: "#3b82f6", borderRadius: "20px", fontSize: "12px" },
  svcPrice: { fontSize: "18px", fontWeight: "700", color: "#0f172a", flexShrink: 0 },
  bookingBox: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", marginTop: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none", width: "100%" },
  submitBtn: { padding: "12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600" },
  msg: { fontSize: "14px", color: "#475569" },
  reviewForm: { background: "#f8fafc", borderRadius: "10px", padding: "16px", marginBottom: "20px" },
  starRow: { display: "flex", gap: "4px", marginBottom: "8px" },
  reviewCard: { background: "#fff", borderRadius: "10px", padding: "16px", marginBottom: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" },
  reviewHeader: { display: "flex", justifyContent: "space-between", marginBottom: "6px" },
  reviewerName: { fontWeight: "600", fontSize: "14px", color: "#0f172a" },
  reviewStars: { color: "#f59e0b", fontSize: "14px" },
  reviewComment: { fontSize: "14px", color: "#475569", lineHeight: "1.5", marginBottom: "6px" },
  reviewDate: { fontSize: "12px", color: "#94a3b8" },
  chatBtn: { padding: "10px 20px", background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", alignSelf: "center" },
  delBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "14px", padding: "2px 4px", color: "#ef4444" }
};

export default ProviderProfile;
