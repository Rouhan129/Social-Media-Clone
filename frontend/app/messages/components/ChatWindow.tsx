"use client";

export default function ChatWindow({ selectedUser, messages, currentUserId, input, setInput, handleSend }) {
  return (
    <div className="flex-1 flex flex-col">
      {selectedUser ? (
        <>
          <div className="bg-gray-300 p-3 font-semibold">
            Chat with {selectedUser.email}
          </div>

          <div className="flex-1 overflow-y-auto p-3 bg-white">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`my-2 ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block px-3 py-1 rounded ${
                      msg.senderId === currentUserId ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="p-3 flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 border rounded p-2"
              placeholder="Type a message..."
            />
            <button onClick={handleSend} className="ml-2 bg-blue-500 text-white rounded px-3 py-2">
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center flex-1 text-gray-500">
          Select a user to start chatting
        </div>
      )}
    </div>
  );
}
