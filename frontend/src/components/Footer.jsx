import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div>
          <div style={styles.brand}>🏙️ UrbanAssist</div>
          <p style={styles.tagline}>Connecting you with trusted local service providers.</p>
        </div>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/services" style={styles.link}>Services</Link>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/signup" style={styles.link}>Sign Up</Link>
        </div>
      </div>
      <div style={styles.copy}>© 2024 UrbanAssist. All rights reserved.</div>
    </footer>
  );
}

const styles = {
  footer: { background: "#0f172a", color: "#94a3b8", marginTop: "auto" },
  inner: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "40px 32px 24px", flexWrap: "wrap", gap: "24px" },
  brand: { color: "#fff", fontSize: "18px", fontWeight: "700", marginBottom: "8px" },
  tagline: { fontSize: "14px", maxWidth: "280px" },
  links: { display: "flex", gap: "20px", flexWrap: "wrap" },
  link: { color: "#94a3b8", fontSize: "14px" },
  copy: { textAlign: "center", padding: "16px", borderTop: "1px solid #1e293b", fontSize: "13px" }
};

export default Footer;
