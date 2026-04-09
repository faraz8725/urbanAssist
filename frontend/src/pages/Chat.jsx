import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";

const socket = io("https://urbanassist-yq5t.onrender.com/", { autoConnect: false });

function Chat() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return navigate("/login");
    API.get(`/api/chats/${providerId}`).then(res => {
      setChat(res.data);
      setMessages(res.data.messages || []);
      socket.connect();
      socket.emit("join", res.data._id);
    });
    socket.on("message", (msg) => setMessages(prev => [...prev, msg]));
    return () => { socket.off("message"); socket.disconnect(); };
  }, [providerId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim() || !chat) return;
    socket.emit("message", { chatId: chat._id, senderId: user._id, text });
    setText("");
  };

  const other = chat?.participants?.find(p => p._id !== user._id);

  return (
    <div style={styles.page}>
      <div style={styles.chatBox}>
        <div style={styles.header}>
          <button style={styles.back} onClick={() => navigate(-1)}>←</button>
          <div style={styles.avatar}>{other?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={styles.name}>{other?.name}</div>
            <div style={styles.role}>{other?.role}</div>
          </div>
        </div>

        <div style={styles.messages}>
          {messages.map((m, i) => {
            const mine = (m.sender?._id || m.sender) === user._id;
            return (
              <div key={i} style={{ ...styles.msgRow, justifyContent: mine ? "flex-end" : "flex-start" }}>
                <div style={{ ...styles.bubble, background: mine ? "#3b82f6" : "#f1f5f9", color: mine ? "#fff" : "#0f172a" }}>
                  {m.text}
                  <div style={styles.time}>{m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} style={styles.inputRow}>
          <input
            style={styles.input}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message..."
            autoFocus
          />
          <button type="submit" style={styles.sendBtn}>Send</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 128px)", background: "#f8fafc", padding: "16px" },
  chatBox: { width: "100%", maxWidth: "640px", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", height: "75vh" },
  header: { display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", borderBottom: "1px solid #f1f5f9" },
  back: { background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" },
  avatar: { width: "40px", height: "40px", background: "#3b82f6", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px" },
  name: { fontWeight: "700", fontSize: "15px", color: "#0f172a" },
  role: { fontSize: "12px", color: "#64748b", textTransform: "capitalize" },
  messages: { flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "8px" },
  msgRow: { display: "flex" },
  bubble: { maxWidth: "70%", padding: "10px 14px", borderRadius: "12px", fontSize: "14px", lineHeight: "1.5" },
  time: { fontSize: "10px", opacity: 0.6, marginTop: "4px", textAlign: "right" },
  inputRow: { display: "flex", gap: "8px", padding: "12px 16px", borderTop: "1px solid #f1f5f9" },
  input: { flex: 1, padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none" },
  sendBtn: { padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }
};

export default Chat;
