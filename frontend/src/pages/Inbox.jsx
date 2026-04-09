import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Inbox() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate("/login");
    API.get("/api/chats").then(res => {
      setChats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>💬 Messages</h1>
      {chats.length === 0 ? (
        <div style={styles.empty}>No conversations yet.</div>
      ) : (
        <div style={styles.list}>
          {chats.map(chat => {
            const other = chat.participants.find(p => p._id !== user._id);
            const last = chat.messages[chat.messages.length - 1];
            return (
              <div key={chat._id} style={styles.row} onClick={() => navigate(`/chat/${other._id}`)}>
                <div style={styles.avatar}>{other?.name?.charAt(0).toUpperCase()}</div>
                <div style={styles.info}>
                  <div style={styles.name}>{other?.name}</div>
                  <div style={styles.preview}>{last ? last.text : "No messages yet"}</div>
                </div>
                <div style={styles.time}>
                  {last ? new Date(last.createdAt).toLocaleDateString() : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: "640px", margin: "0 auto", padding: "32px 16px" },
  title: { fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "24px" },
  center: { textAlign: "center", padding: "80px", color: "#64748b" },
  empty: { textAlign: "center", padding: "60px", color: "#64748b", fontSize: "15px" },
  list: { display: "flex", flexDirection: "column", gap: "4px" },
  row: { display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "12px", cursor: "pointer", background: "#fff", border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "background 0.15s" },
  avatar: { width: "46px", height: "46px", background: "#3b82f6", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "18px", flexShrink: 0 },
  info: { flex: 1, minWidth: 0 },
  name: { fontWeight: "700", fontSize: "15px", color: "#0f172a", marginBottom: "2px" },
  preview: { fontSize: "13px", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  time: { fontSize: "12px", color: "#94a3b8", flexShrink: 0 }
};

export default Inbox;
