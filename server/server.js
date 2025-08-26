// creating server
import express from "express"
import "dotenv/config" ;
import cors from "cors";
import http from "http";
import { connectDb } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

import { Server } from "socket.io";

import dotenv from "dotenv";
dotenv.config();



// You are importing the Server class from the socket.io library.
//This allows you to create a WebSocket server that can handle real-time communication between clients and your backend.

// create express app and http server
const app = express();

const server = http.createServer(app);

// initialize socket.io server 
export const io = new Server(server , {
    cors : {origin : "*"}// allow all the origins 
});

// store online users

export const userSocketMap = {} ; // {userId : socketId}

// socket.io connection handler 

io.on("connection" , (socket) => {
    // get the list of onlie users 
    // and the list is stored in userSocketMap as key value pairs . 
    const userId = socket.handshake.query.userId;
    // When connecting from the frontend, you send userId in the handshake query.

    console.log("user connected " , userId );

    if(userId) userSocketMap[userId] = socket.id;


    /// emit online users to all connected clients 
    io.emit("getOnlineUsers" , Object.keys(userSocketMap));
    // Object.keys(userSocketMap) returns all currently online user IDs.
    // The server broadcasts (emit) this list to all connected clients.
    // This way, every client always has the latest online users list.

    // disconnect event
    socket.on("disconnect" , () => {
        console.log("User disconnected" , userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers" , Object.keys(userSocketMap))   
        
        //When a client closes the tab / loses internet / logs out, the "disconnect" event is fired.
        // We remove that user’s userId from userSocketMap.
        // Then we re-broadcast the updated list of online users to everyone.
    });
})

// middlewares  setup 
app.use(express.json({limit : "4mb"})); // photo size  limit  to upload .

app.use(cors());

// add routes setup 

app.use("/api/status" , (req ,res) => res.send("server is live ") );

app.use("/api/auth" , userRouter);// for user endpoint .

app.use("/api/messages" , messageRouter);

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ error: err.message });
});


// connect to mongo db 
await connectDb();

// define port numbe

if(process.env.NODE_ENV  !== "production"){
    const PORT = process.env.PORT || 5001;
    server.listen(PORT , () => console.log("server is running on PORT : "  + PORT ));
}

// export server for vercel 
export default server;



// mongodb+srv://anshuljan2003:<db_password>@cluster0.pb6n99o.mongodb.net