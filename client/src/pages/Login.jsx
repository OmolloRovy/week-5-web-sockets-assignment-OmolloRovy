import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/backendint';

export default function Login({ setUser }) {
const [username, setUsername] = useState('');
const navigate = useNavigate();

const handleLogin = async () => {
    const res = await registerUser(username);
    setUser(res.data);
    navigate('/');
};

return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-80">
           <h1 className='text-lg font-bold mb-4'>Join Chat</h1>
           <input
               type="text"
               placeholder="Enter your username"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               className="border p-2 rounded w-full mb-4"
           />
           <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded w-full">Enter</button>
            </div>
    </div>
);
};