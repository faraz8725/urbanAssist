function ServiceCard({ title, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ padding: "20px 28px", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", cursor: "pointer", textAlign: "center", minWidth: "120px" }}
    >
      <div style={{ fontSize: "28px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontWeight: "600", color: "#0f172a" }}>{title}</div>
    </div>
  );
}

export default ServiceCard;
