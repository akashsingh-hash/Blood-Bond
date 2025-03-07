import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Replace with your actual Gemini API Key
  const GEMINI_API_KEY = "AIzaSyAQNqRjEg1FtHbdMqycKQTOg34lpSh01tI";  
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: input }] }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract AI response
      const botMessageContent = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm sorry, I couldn't process that request.";


      setMessages((prev) => [...prev, { role: "bot", content: botMessageContent }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, something went wrong!" }]);
    }

    setLoading(false);
  };

  // Handle "Enter" Key Press to Send Message
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Chatbot Floating Button */}
      {!isOpen && (
        <button
          className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
          onClick={toggleChat}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chatbox Panel */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 w-80 h-96 bg-white shadow-lg border border-gray-300 p-4 flex flex-col rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold text-blue-600">Chat with Us</h2>
            <X className="cursor-pointer hover:text-red-500" onClick={toggleChat} />
          </div>

          {/* Messages Display */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-2 rounded-lg max-w-xs ${
                    msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-gray-500 text-center animate-pulse">Thinking...</p>}
          </div>

          {/* Input Box */}
          <div className="border-t pt-2 flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Handle Enter key
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;