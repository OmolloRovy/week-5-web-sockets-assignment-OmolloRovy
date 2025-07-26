import { useEffect, useState } from 'react';
import { getRooms, createRoom, getMessages, socket } from '../services/backendint';
import ChatRoom from '../components/ChatRoom'; // Corrected component name to follow PascalCase

export default function Home({ user }) {
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchRooms();
        socket.connect();
        // Listen for incoming messages
        socket.on('chat message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        // Listen for new room creation (if applicable)
        socket.on('newRoom', (newRoom) => {
            setRooms((prevRooms) => [...prevRooms, newRoom]);
        });
        // Listen for a successful room join confirmation
        socket.on('roomJoined', (data) => {
            console.log(`Successfully joined room: ${data.roomName}`);
            // You might want to update UI or state based on this confirmation
        });

        return () => {
            socket.off('chat message'); // Clean up event listener
            socket.off('newRoom'); // Clean up event listener
            socket.off('roomJoined'); // Clean up event listener
            socket.disconnect();
        };
    }, []); // Empty dependency array means this runs once on mount and clean up on unmount

    const fetchRooms = async () => {
        try {
            const res = await getRooms();
            setRooms(res.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            // Handle error (e.g., show an error message to the user)
        }
    };

    const handleCreateRoom = async (roomName) => {
        try {
            const newRoom = await createRoom({ name: roomName });
            setRooms((prevRooms) => [...prevRooms, newRoom.data]);
            // Automatically join the newly created room
            handleJoinRoom(newRoom.data);
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };


    const handleJoinRoom = async (room) => {
        // Leave the current room before joining a new one to prevent receiving messages from old rooms
        if (currentRoom && socket.connected) {
            socket.emit('leaveRoom', { username: user.username, roomId: currentRoom._id });
        }

        socket.emit('joinRoom', { username: user.username, roomId: room._id });
        setCurrentRoom(room);
        try {
            const res = await getMessages(room._id);
            setMessages(res.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setMessages([]); // Clear messages if there's an error
        }
    };

    return (
        <div className="flex h-screen">
            <aside className="w-1/4 bg-gray-200 p-4 text-gray-800"> {/* Changed text-white to text-gray-800 for better contrast */}
                <h2 className='text-lg font-bold mb-2'>Chat Rooms</h2>
                {/* Add a form or button for creating new rooms */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="New room name"
                        className="w-full p-2 border rounded mb-2"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                handleCreateRoom(e.target.value.trim());
                                e.target.value = ''; // Clear input
                            }
                        }}
                    />
                    <button
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        onClick={() => {
                            const roomName = prompt("Enter new room name:");
                            if (roomName) handleCreateRoom(roomName);
                        }}
                    >
                        Create New Room
                    </button>
                </div>
                <ul>
                    {rooms.map(room => (
                        <li key={room._id} className='mb-2 '>
                            <button
                                className={`w-full text-left p-2 rounded hover:bg-gray-400 ${currentRoom && currentRoom._id === room._id ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
                                onClick={() => handleJoinRoom(room)}
                            >
                                {room.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className='flex-1 p-4 bg-white'>
                {currentRoom ? (
                    <ChatRoom // Corrected component name
                        room={currentRoom}
                        messages={messages}
                        user={user}
                        socket={socket}
                        setMessages={setMessages} // Pass setMessages down for adding new messages
                    />
                ) : (
                    <p className='text-center text-gray-500'>Select a room to start chatting</p>
                )}
            </main>
        </div>
    );
}