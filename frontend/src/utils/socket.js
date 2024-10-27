import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Replace with your server URL

const socket = io(SOCKET_SERVER_URL, {
    autoConnect: true,
    transports: ['websocket'],
});

export default socket;
