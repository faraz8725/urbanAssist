import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { label: "Plumber", icon: "🔧", color: "#dbeafe" },
  { label: "Electrician", icon: "⚡", color: "#fef9c3" },
  { label: "Tutor", icon: "📚", color: "#dcfce7" },
  { label: "Delivery", icon: "🚚", color: "#fce7f3" },
];

function Home() {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value.trim();
    navigate(`/services${q ? `?search=${q}` : ""}`);
  };

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Trusted Local Services</h1>
        <p style={styles.heroSub}>Book plumbers, electricians, tutors & delivery agents near you</p>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input name="search" placeholder="Search services or providers..." style={styles.searchInput} />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>
      </section>

      {/* Categories */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Browse by Category</h2>
        <div style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              style={{ ...styles.catCard, background: cat.color }}
              onClick={() => navigate(`/services?category=${cat.label.toLowerCase()}`)}
            >
              <span style={styles.catIcon}>{cat.icon}</span>
              <span style={styles.catLabel}>{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ ...styles.section, background: "#f1f5f9" }}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsGrid}>
          {[
            { step: "1", title: "Search", desc: "Find service providers near you by category or keyword" },
            { step: "2", title: "Book", desc: "Choose a time slot and book instantly" },
            { step: "3", title: "Get Served", desc: "Provider arrives and completes the job" },
            { step: "4", title: "Review", desc: "Rate your experience to help others" },
          ].map((s) => (
            <div key={s.step} style={styles.stepCard}>
              <div style={styles.stepNum}>{s.step}</div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={{ color: "#fff", marginBottom: "12px" }}>Are you a service provider?</h2>
        <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>Join UrbanAssist and grow your business</p>
        <button style={styles.ctaBtn} onClick={() => navigate("/signup")}>Join as Provider</button>
      </section>
    </div>
  );
}

const styles = {
  hero: { background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", padding: "80px 32px", textAlign: "center" },
  heroTitle: { color: "#fff", fontSize: "48px", fontWeight: "800", marginBottom: "16px", letterSpacing: "-1px" },
  heroSub: { color: "#94a3b8", fontSize: "18px", marginBottom: "36px" },
  searchForm: { display: "flex", maxWidth: "520px", margin: "0 auto", gap: "0" },
  searchInput: { flex: 1, padding: "14px 20px", fontSize: "16px", border: "none", borderRadius: "8px 0 0 8px", outline: "none" },
  searchBtn: { padding: "14px 28px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "0 8px 8px 0", fontSize: "16px", fontWeight: "600" },
  section: { padding: "60px 32px" },
  sectionTitle: { textAlign: "center", fontSize: "28px", fontWeight: "700", marginBottom: "36px", color: "#0f172a" },
  grid: { display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" },
  catCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "28px 36px", borderRadius: "12px", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", minWidth: "140px" },
  catIcon: { fontSize: "36px" },
  catLabel: { fontSize: "16px", fontWeight: "600", color: "#1e293b" },
  stepsGrid: { display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" },
  stepCard: { background: "#fff", borderRadius: "12px", padding: "28px 24px", textAlign: "center", maxWidth: "220px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  stepNum: { width: "40px", height: "40px", background: "#3b82f6", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700", margin: "0 auto 16px" },
  stepTitle: { fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: "#0f172a" },
  stepDesc: { fontSize: "14px", color: "#64748b", lineHeight: "1.5" },
  cta: { background: "#0f172a", padding: "60px 32px", textAlign: "center" },
  ctaBtn: { padding: "14px 32px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600" }
};

export default Home;
