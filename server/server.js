import React, { useState } from "react";
import "./DietChatbot.css";

const DietChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // SAFE to use in browser (only for Responses API)
 const apiKey = "";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = { role: "user", content: input };
    setMessages(prev => [...prev, newMsg]);

    setInput("");

    try {
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          input: [
            ...messages.map(m => `${m.role}: ${m.content}`),
            `user: ${input}`
          ].join("\n"),
          max_output_tokens: 150,
        }),
      });

      const data = await res.json();

      const reply = data.output_text || "⚠ Error reading response";

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: reply }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠ Unable to connect to OpenAI." }
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="chatbot-button" onClick={() => setOpen(!open)}>
        💬
      </div>

      {/* Chat Window */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Diet Assistant</h3>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.role === "user" ? "chat-user" : "chat-bot"}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              placeholder="Ask about diet..."
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default DietChatbot;
