import React, { useState, useRef, useEffect } from "react";
import "./chatbot.css"; // create this file (code below)

const DietChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I can create a personalized diet plan for you.\nPlease enter: weight, height, age, gender (M/F), veg/non-veg." }
  ]);
  const [input, setInput] = useState("");

  const chatRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const newMessages = [...messages, { sender: "user", text: input }];
  setMessages(newMessages);
  setInput("");

  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`

      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: newMessages
          .map((m) => `${m.sender}: ${m.text}`)
          .join("\n"),
        max_output_tokens: 200,
      })
    });

    const data = await res.json();
    console.log("OPENAI RAW RESPONSE ===>", data);

    // ✅ Extract correct text
    const reply =
      data?.output?.[0]?.content?.[0]?.text ||
      data?.output_text ||
      "⚠ No reply received";

    setMessages(prev => [...prev, { sender: "bot", text: reply }]);

  } catch (err) {
    console.log("OPENAI ERROR ===>", err);
    setMessages(prev => [
      ...prev,
      { sender: "bot", text: "⚠ Unable to reach OpenAI API." }
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
        <div className="chatbot-container">
          <div className="chatbot-header">
            Diet Plan Chatbot
            <span className="close-btn" onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chatbot-messages" ref={chatRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input
              className="chat-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="send-btn" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default DietChatbot;
