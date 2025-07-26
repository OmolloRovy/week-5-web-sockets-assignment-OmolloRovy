import { useEffect, useRef, useState } from "react";

export default function ChatRoom({ room, messages, user, socket }) {
const [chat, setChat] = useState('');
const [typingUser, setTypingUser] = useState('');
const msgRef = useRef(null);


useEffect(() => {
    socket.on("newMessage", (msg) => {
        msgRef.current.innerHTML += `<div class="message"><strong>${msgRef.sender.username}</strong>: ${msg.content}</div>`;
});
 socket.on("typing", (username) => {
        setTypingUser(username);
    });
    socket.on("stopTyping", () => {
        setTypingUser('');
    });
    return () => {
        socket.off("newMessage");
        socket.off("typing");
        socket.off("stopTyping");
    };
}, [socket]);
const handleTyping = () => {
    socket.emit("typing");
    setTimeout(() => {
        socket.emit("stopTyping");
    }, 1000);
};

const handleSend = () => {
   
    socket.emit("sendMessage", chat);
    setChat('');
};
return (
    <div>
        <h2 className="text-2xl mb-2">room.name</h2>
        <div className="border p-4 h-64 overflow-y-auto bg-gray-50" ref={msgRef}>
            {messages.map((msg) =>(
<p key={msg._id}>
    <strong>{msg.sender.username}</strong>: {msg.content}
</p>
            ) )}        
             </div>

             <div>
                {typingUser && <p className="text-gray-500 mb-2 text-sm">{typingUser} is typing...</p>
                }
             </div>
             <div className="flex mt-4 gap-2">
                <input
                className="flex-1 border p-2 rounded"
                value={chat}
                onChange={(e) => setChat(e.target.value)}
                onKeyDown={handleTyping}
                placeholder="Type a message..."
                />
                <button className="bg-blue-500 text-white p-2 rounded px-4" onClick={handleSend}>Send</button>
             </div>
    </div>
)
};


