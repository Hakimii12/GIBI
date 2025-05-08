import { Server } from 'socket.io';
import express from "express";
import http from 'http';

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:8080', 'https://preview--role-based-education-sphere.lovable.app'],
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
  socket.on("disconnect",()=>{
    console.log("user disconnected")
  })
}
);

export { io, server, app };