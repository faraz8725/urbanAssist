import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🏙️ UrbanAssist</Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/services" style={styles.link}>Services</Link>

        {user ? (
          <div style={{ position: "relative" }}>
            <button style={styles.avatarBtn} onClick={() => setMenuOpen(!menuOpen)}>
              {user.name.charAt(0).toUpperCase()} ▾
            </button>
            {menuOpen && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownName}>{user.name}</div>
                <div style={styles.dropdownRole}>{user.role}</div>
                <hr style={{ margin: "8px 0", borderColor: "#e2e8f0" }} />
                <button style={styles.dropItem} onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}>My Dashboard</button>
                {user.role !== "customer" && (
                  <button style={styles.dropItem} onClick={() => { navigate("/add-service"); setMenuOpen(false); }}>Add Service</button>
                )}
                <button style={{ ...styles.dropItem, color: "#ef4444" }} onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={styles.loginBtn} onClick={() => navigate("/login")}>Login</button>
            <button style={styles.signupBtn} onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px", height: "64px", background: "#0f172a", position: "sticky", top: 0, zIndex: 100 },
  brand: { color: "#fff", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.5px" },
  links: { display: "flex", alignItems: "center", gap: "24px" },
  link: { color: "#cbd5e1", fontSize: "15px", transition: "color 0.2s" },
  loginBtn: { padding: "7px 16px", background: "transparent", border: "1px solid #475569", color: "#cbd5e1", borderRadius: "6px", fontSize: "14px" },
  signupBtn: { padding: "7px 16px", background: "#3b82f6", border: "none", color: "#fff", borderRadius: "6px", fontSize: "14px", fontWeight: "600" },
  avatarBtn: { padding: "6px 14px", background: "#1e40af", border: "none", color: "#fff", borderRadius: "6px", fontSize: "14px", fontWeight: "600" },
  dropdown: { position: "absolute", right: 0, top: "44px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", minWidth: "180px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: "8px" },
  dropdownName: { padding: "4px 8px", fontWeight: "600", fontSize: "14px" },
  dropdownRole: { padding: "0 8px 4px", fontSize: "12px", color: "#64748b", textTransform: "capitalize" },
  dropItem: { display: "block", width: "100%", padding: "8px", background: "none", border: "none", textAlign: "left", fontSize: "14px", borderRadius: "6px", cursor: "pointer" }
};

export default Navbar;
