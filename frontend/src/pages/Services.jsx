import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";

const CATEGORIES = ["all", "plumber", "electrician", "tutor", "delivery"];

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category && category !== "all") params.category = category;
        const res = await API.get("/api/services", { params });
        setServices(res.data);
      } catch {
        setServices([]);
      }
      setLoading(false);
    };
    fetchServices();
  }, [search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value.trim();
    const params = {};
    if (q) params.search = q;
    if (category !== "all") params.category = category;
    setSearchParams(params);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Find Services</h1>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input name="search" defaultValue={search} placeholder="Search services..." style={styles.searchInput} />
          <button type="submit" style={styles.searchBtn}>🔍</button>
        </form>
      </div>

      {/* Category Filter */}
      <div style={styles.filters}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            style={{ ...styles.filterBtn, ...(category === cat ? styles.filterActive : {}) }}
            onClick={() => setSearchParams(search ? { search, category: cat } : { category: cat })}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.center}>Loading services...</div>
      ) : services.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: "48px" }}>🔍</div>
          <p>No services found. Try a different search or category.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {services.map((svc) => (
            <div key={svc._id} style={styles.card} onClick={() => navigate(`/provider/${svc.provider?._id}`)}>
              <div style={styles.cardBadge}>{svc.category}</div>
              <h3 style={styles.cardTitle}>{svc.title}</h3>
              <p style={styles.cardDesc}>{svc.description}</p>
              <div style={styles.cardMeta}>
                <span>👤 {svc.provider?.name || "Unknown"}</span>
                <span>📍 {svc.location || "N/A"}</span>
              </div>
              <div style={styles.cardFooter}>
                <span style={styles.price}>₹{svc.price}/hr</span>
                <div style={styles.rating}>⭐ {svc.provider?.rating || "New"}</div>
              </div>
              <button style={styles.bookBtn}>View & Book</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "32px", maxWidth: "1100px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#0f172a" },
  searchForm: { display: "flex", gap: "0" },
  searchInput: { padding: "10px 16px", border: "1px solid #e2e8f0", borderRadius: "8px 0 0 8px", fontSize: "15px", outline: "none", width: "260px" },
  searchBtn: { padding: "10px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "0 8px 8px 0", fontSize: "16px" },
  filters: { display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" },
  filterBtn: { padding: "8px 18px", border: "1px solid #e2e8f0", borderRadius: "20px", background: "#fff", fontSize: "14px", cursor: "pointer", color: "#475569" },
  filterActive: { background: "#3b82f6", color: "#fff", border: "1px solid #3b82f6" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" },
  card: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", border: "1px solid #f1f5f9" },
  cardBadge: { display: "inline-block", padding: "3px 10px", background: "#dbeafe", color: "#1d4ed8", borderRadius: "20px", fontSize: "12px", fontWeight: "600", marginBottom: "10px", textTransform: "capitalize" },
  cardTitle: { fontSize: "17px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" },
  cardDesc: { fontSize: "14px", color: "#64748b", marginBottom: "12px", lineHeight: "1.5" },
  cardMeta: { display: "flex", gap: "12px", fontSize: "13px", color: "#64748b", marginBottom: "12px", flexWrap: "wrap" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" },
  price: { fontSize: "18px", fontWeight: "700", color: "#0f172a" },
  rating: { fontSize: "14px", color: "#f59e0b", fontWeight: "600" },
  bookBtn: { width: "100%", padding: "10px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600" },
  center: { textAlign: "center", padding: "60px", color: "#64748b" },
  empty: { textAlign: "center", padding: "60px", color: "#64748b" }
};

export default Services;
