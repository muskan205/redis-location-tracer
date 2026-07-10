import { useState } from "react";
import axios from "axios";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/rag/ask",
        { question: input }
      );

      const aiMessage: Message = {
        role: "assistant",
        text: res.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error getting response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>💬 RAG Chat</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#DCF8C6" : "#eee",
            }}
          >
            {msg.text}
          </div>
        ))}

        {loading && <div>Thinking...</div>}
      </div>

      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    width: "400px",
    margin: "auto",
    fontFamily: "Arial",
  },
  chatBox: {
    border: "1px solid #ccc",
    height: "400px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    marginBottom: "10px",
  },
  message: {
    padding: "8px",
    borderRadius: "8px",
    marginBottom: "8px",
    maxWidth: "70%",
  },
  inputBox: {
    display: "flex",
  },
  input: {
    flex: 1,
    padding: "8px",
  },
  button: {
    padding: "8px 12px",
  },
};