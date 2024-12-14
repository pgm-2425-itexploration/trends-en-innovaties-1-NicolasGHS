import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Vervang met jouw serveradres

function ChatApp() {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Luister naar inkomende berichten
    socket.on("message", (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Verwijder de event listener bij unmount
      socket.off("message");
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const message = { content: newMessage, timestamp: new Date() };
      socket.emit("message", message);
      setNewMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gradient-to-t from-green-300 to-blue-500">
      <div className="bg-gray-800 text-white rounded-lg w-96 h-96 p-6 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex-1 p-3 overflow-y-auto bg-gray-700 rounded-md space-y-3">
            {chatMessages.map((msg, index) => (
              <div key={index} className="flex flex-col items-start">
                <div
                  className="bg-indigo-500 text-white p-3 rounded-lg"
                >
                  {msg.content}
                </div>
                <span className="text-gray-400 text-xs mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-600">
            <div className="flex">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-l-md outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Schrijf een bericht..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                onClick={handleSendMessage}
              >
                Verstuur
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
