import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";

function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "Guest Member";
  const userId = localStorage.getItem("userId") || "anonymous_session";

  useEffect(() => {
    if (isOpen && !socketRef.current) {
      // Connect to express live socket engine
      socketRef.current = io("http://localhost:5000");

      // Locks room using current logged user identifier codes definitions securely
      socketRef.current.emit("join_room", userId);

      socketRef.current.on("receive_message", (data) => {
        setMessages((prev) => [...prev, data]);
      });
    }

    return () => {
      if (!isOpen && socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isOpen, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const dispatchTextMsg = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !socketRef.current) return;

    const chatPayload = {
      room: userId,
      sender: userName,
      message: typedMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    socketRef.current.emit("send_message", chatPayload);
    setTypedMessage("");
  };

  if (!token) return null; // Support widget visible for logged loyalty members profiles only

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-montserrat">
      {/* FLOATING SPARK CONTROLLER TRIGGER */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 border-2 border-white animate-bounce"
        >
          <FaComments size={24} />
        </button>
      )}

      {/* OVERLAY CORE CHAT MATRIX */}
      {isOpen && (
        <div className="bg-white w-[340px] h-[440px] rounded-[30px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-enter">
          {/* HEADER CHAT PORT */}
          <div className="bg-gray-900 p-4 text-white flex justify-between items-center border-b-4 border-red-600">
            <div>
              <h4 className="font-black text-xs uppercase tracking-wider">RFC Support Chat</h4>
              <span className="text-[9px] text-green-400 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span> Live Representative Desk
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
              <FaTimes size={16} />
            </button>
          </div>

          {/* CHAT MESSAGES LEDGER COMPONENT LOOP */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.length === 0 && (
              <p className="text-[11px] font-medium text-gray-400 text-center italic mt-12 px-4">
                Hi {userName}! Connecting live help desks. Drop your queries here regarding orders or voucher activation issues. 🍔
              </p>
            )}
            {messages.map((msg, i) => {
              const isMe = msg.sender === userName;
              return (
                <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <span className="text-[8px] font-black uppercase text-gray-400 mb-0.5 px-1">{msg.sender}</span>
                  <div className={`p-3 max-w-[80%] text-xs font-semibold rounded-2xl shadow-sm ${
                    isMe ? "bg-red-600 text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none border"
                  }`}>
                    <p className="leading-relaxed">{msg.message}</p>
                    <span className={`text-[7px] block text-right mt-1 font-bold ${isMe ? "text-red-200" : "text-gray-400"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT DISPATCH PANEL FOOTER */}
          <form onSubmit={dispatchTextMsg} className="p-3 bg-white border-t flex gap-2">
            <input
              type="text"
              placeholder="Type assistance query..."
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              className="w-full bg-gray-50 text-xs font-semibold p-3 outline-none border-2 border-gray-100 focus:border-red-600 rounded-xl transition-all"
            />
            <button type="submit" className="bg-gray-900 text-white p-3 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center">
              <FaPaperPlane size={12} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SupportChatWidget;
