import axios from 'axios';
import { io } from 'socket.io-client';

const BackendBaseUrl = "http://localhost:5000";
const APIBaseUrl = "http://localhost:5000/api";

const API = axios.create({
    baseURL:APIBaseUrl,
});

export const registerUser = ( username ) => {
    return API.post('/auth/register', { username });
};

export const getRooms = () => {
    return API.get('/rooms');
};
export const createRoom = ( name ) => {
    return API.post('/rooms', { name });
};
export const getMessages = ( roomId ) => {
    return API.get(`/messages${roomId}`);
};
export const socket = io(BackendBaseUrl, {autoConnect: false});

export default API;